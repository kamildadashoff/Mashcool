import { Vacancy, SourceHealth, WorkFormat, Seniority } from '../../src/types';
import { INITIAL_VACANCIES } from '../data/vacancies';

export interface VacancySourceAdapter {
  sourceName: string;
  fetchRecentVacancies(): Promise<Vacancy[]>;
  normalizeVacancy(raw: any): Vacancy;
  healthCheck(): Promise<SourceHealth>;
}

class BaseSourceAdapter implements VacancySourceAdapter {
  constructor(public sourceName: string, private defaultDomain: string) {}

  async fetchRecentVacancies(): Promise<Vacancy[]> {
    return INITIAL_VACANCIES.filter(v => v.source === this.sourceName);
  }

  normalizeVacancy(raw: any): Vacancy {
    return raw as Vacancy;
  }

  async healthCheck(): Promise<SourceHealth> {
    const isDegraded = false;
    return {
      sourceName: this.sourceName,
      status: isDegraded ? 'DEGRADED' : 'HEALTHY',
      lastSuccessfulSync: new Date().toISOString(),
      newVacanciesLast24h: Math.floor(Math.random() * 20) + 10,
      failedJobsCount: 0,
      duplicatesCount: 2,
      expiredJobsCount: 1,
      enabled: true,
    };
  }
}

export class JobSearchAdapter extends BaseSourceAdapter {
  constructor() {
    super('JobSearch.az', 'jobsearch.az');
  }
}

export class BossAdapter extends BaseSourceAdapter {
  constructor() {
    super('Boss.az', 'boss.az');
  }
}

export class GlorriAdapter extends BaseSourceAdapter {
  constructor() {
    super('Glorri.az', 'jobs.glorri.az');
  }
}

export class VacancyService {
  private vacancies: Vacancy[] = [...INITIAL_VACANCIES];
  private adapters: Map<string, VacancySourceAdapter> = new Map();
  private sourceStatus: Map<string, { enabled: boolean; health: SourceHealth }> = new Map();

  constructor() {
    const js = new JobSearchAdapter();
    const boss = new BossAdapter();
    const glorri = new GlorriAdapter();

    this.adapters.set(js.sourceName, js);
    this.adapters.set(boss.sourceName, boss);
    this.adapters.set(glorri.sourceName, glorri);

    this.initHealth();
  }

  private async initHealth() {
    for (const [name, adapter] of this.adapters.entries()) {
      const health = await adapter.healthCheck();
      this.sourceStatus.set(name, { enabled: true, health });
    }
  }

  getAllVacancies(): Vacancy[] {
    return this.vacancies.filter(v => {
      const src = this.sourceStatus.get(v.source);
      return src ? src.enabled : true;
    });
  }

  getVacancyById(id: string): Vacancy | undefined {
    return this.vacancies.find(v => v.id === id);
  }

  getSourcesHealth(): SourceHealth[] {
    return Array.from(this.sourceStatus.values()).map(s => ({
      ...s.health,
      enabled: s.enabled,
    }));
  }

  toggleSource(sourceName: string, enabled: boolean): boolean {
    const current = this.sourceStatus.get(sourceName);
    if (current) {
      current.enabled = enabled;
      current.health.enabled = enabled;
      return true;
    }
    return false;
  }

  // Canonical Deduplication Algorithm
  deduplicateVacancies(items: Vacancy[]): Vacancy[] {
    const canonicalMap = new Map<string, Vacancy>();

    for (const item of items) {
      // Normalization key based on normalized company + normalized title
      const normCompany = item.companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const normTitle = item.titleNormalized.toLowerCase().replace(/[^a-z0-9]/g, '');
      const dedupeKey = `${normCompany}_${normTitle}`;

      if (!canonicalMap.has(dedupeKey)) {
        canonicalMap.set(dedupeKey, { ...item });
      } else {
        const existing = canonicalMap.get(dedupeKey)!;
        const currentDuplicates = existing.duplicateSources || [];
        if (!currentDuplicates.includes(`${item.source}:${item.sourceVacancyId}`)) {
          currentDuplicates.push(`${item.source}:${item.sourceVacancyId}`);
        }
        existing.duplicateSources = currentDuplicates;
      }
    }

    return Array.from(canonicalMap.values());
  }

  // Pre-filter candidate vacancies against hard filters
  filterCandidates(params: {
    seniorities?: Seniority[];
    categories?: string[];
    excludedCompanies?: string[];
    excludedTitles?: string[];
    workFormats?: WorkFormat[];
    minSalary?: number;
    excludedJobIds?: string[];
  }): Vacancy[] {
    let list = this.getAllVacancies();

    if (params.excludedJobIds && params.excludedJobIds.length > 0) {
      const excludedSet = new Set(params.excludedJobIds);
      list = list.filter(v => !excludedSet.has(v.id) && !excludedSet.has(v.canonicalVacancyId));
    }

    if (params.seniorities && params.seniorities.length > 0) {
      const senSet = new Set(params.seniorities);
      list = list.filter(v => senSet.has(v.seniority));
    }

    if (params.categories && params.categories.length > 0) {
      const catLower = params.categories.map(c => c.toLowerCase());
      list = list.filter(v => catLower.some(c => v.category.toLowerCase().includes(c) || c.includes(v.category.toLowerCase())));
    }

    if (params.excludedCompanies && params.excludedCompanies.length > 0) {
      const excludedComp = params.excludedCompanies.map(c => c.toLowerCase());
      list = list.filter(v => !excludedComp.some(c => v.companyName.toLowerCase().includes(c)));
    }

    if (params.excludedTitles && params.excludedTitles.length > 0) {
      const excludedTitlesLower = params.excludedTitles.map(t => t.toLowerCase());
      list = list.filter(v => !excludedTitlesLower.some(t => v.titleNormalized.toLowerCase().includes(t)));
    }

    if (params.workFormats && params.workFormats.length > 0 && !params.workFormats.includes('ANY')) {
      const wfSet = new Set(params.workFormats);
      list = list.filter(v => wfSet.has(v.workFormat));
    }

    if (params.minSalary && params.minSalary > 0) {
      list = list.filter(v => !v.salaryMax || v.salaryMax >= (params.minSalary || 0));
    }

    return this.deduplicateVacancies(list);
  }
}

export const vacancyService = new VacancyService();
