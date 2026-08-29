import { SearchRun, SearchRunOrigin, PackageType, VacancyMatch, Application } from '../../src/types';
import { candidateProfileService } from './CandidateProfileService';
import { matchingEngine } from './MatchingEngine';
import { paymentService } from './PaymentService';

export class SearchRunService {
  private searchRuns: Map<string, SearchRun> = new Map();
  private applications: Map<string, Application> = new Map();

  constructor() {
    // Seed initial completed search run for Kamil Dadashov (with genuine sent applications & replies)
    const seedRunId = 'run-seed-001';
    const seedUserId = 'usr-kamil-dadashov';

    const seedRun: SearchRun = {
      id: seedRunId,
      userId: seedUserId,
      origin: 'WEB',
      packageType: 'JOB_LUCK',
      status: 'COMPLETED',
      maxScanned: 300,
      maxMatched: 30,
      maxSent: 30,
      vacanciesScanned: 284,
      vacanciesMatched: 4,
      applicationsPrepared: 4,
      applicationsSent: 4,
      startedAt: '2026-08-20T10:22:00Z',
      completedAt: '2026-08-20T10:25:00Z',
      estimatedCost: 5,
      actualAICost: 0.00341,
      aiLog: {
        model: 'gemini-3.7-flash',
        inputTokens: 3820,
        outputTokens: 1420,
        latencyMs: 1840,
        retries: 0,
      }
    };

    this.searchRuns.set(seedRun.id, seedRun);

    // Seed Applications
    const seedApps: Application[] = [
      {
        id: 'app-001',
        searchRunId: seedRunId,
        userId: seedUserId,
        vacancyId: 'vac-js-001',
        vacancy: {
          id: 'vac-js-001',
          source: 'JobSearch.az',
          sourceVacancyId: 'js-98412',
          canonicalVacancyId: 'canon-lead-designer-absheron',
          companyName: 'Absheron Hotel Group',
          companyLogoUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&h=100&fit=crop&q=80',
          titleOriginal: 'Lead Graphic & Brand Designer',
          titleNormalized: 'Lead Graphic Designer',
          descriptionOriginal: 'Absheron Hotel Group qrup daxili lüks otellər və restoran layihələri üçün Lead Graphic Designer axtarır.',
          descriptionNormalized: 'Lead graphic and brand design role for luxury hospitality group.',
          requirements: ['Qrafik və brend dizayn sahəsində minimum 4+ il təcrübə', 'Adobe Creative Suite', 'HoReCa portfel'],
          responsibilities: ['Qrup brendlərinin vizual konsepsiyalarının hazırlanması'],
          location: 'Bakı, Səbail r.',
          city: 'Baku',
          country: 'Azerbaijan',
          workFormat: 'HYBRID',
          salaryMin: 2200,
          salaryMax: 3200,
          salaryCurrency: 'AZN',
          seniority: 'MANAGER',
          category: 'Design & Creative',
          employmentType: 'FULL_TIME',
          languages: ['az', 'en'],
          publicationDate: '2026-08-20',
          applicationMethod: 'EMAIL',
          applicationEmail: 'careers@absheronhotelgroup.com',
          sourceUrl: 'https://jobsearch.az/vacancies/lead-graphic-designer-absheron',
          originalLanguage: 'az',
          status: 'ACTIVE',
          createdAt: '2026-08-20T10:00:00Z',
          updatedAt: '2026-08-20T10:00:00Z',
        },
        matchScore: 95,
        subject: 'Lead Graphic Designer — Kamil Dadashov',
        coverLetter: `Hörmətli Absheron Hotel Group İstedadların İdarəedilməsi komandası,

Şirkətinizdə elan olunmuş «Lead Graphic Designer» vakansiyası üzrə müraciətimi təqdim edirəm. 6+ illik peşəkar təcrübəm ərzində lüks otelçilik və yaradıcı layihələrdə brend standartlarının qurulmasına və dizayn komandasına rəhbərlik etmişəm.

Figma, Adobe Creative Suite biliklərim və HoReCa sahəsindəki uğurlu portfelim komandanızın vizual standartlarına yüksək dəyər qatacaqdır. Ətraflı CV faylım əlavə edilmişdir.

Hörmətlə,
Kamil Dadashov
+994 50 234 56 78
kamildadashoff@gmail.com`,
        recipientEmail: 'careers@absheronhotelgroup.com',
        senderEmail: 'kamildadashoff@gmail.com',
        status: 'SENT',
        sentAt: '2026-08-20T10:25:00Z',
        replyStatus: 'INTERVIEW',
        replyText: 'Salam Kamil bəy. CV və portfeliniz nəzərdən keçirildi. Gələn həftə çərşənbə axşamı saat 15:00-da ofisimizdə müsahibəyə dəvət etmək istərdik.',
        repliedAt: '2026-08-21T11:40:00Z',
        manualOutcome: 'INTERVIEW',
        threadId: 'th-absheron-9812',
      },
      {
        id: 'app-002',
        searchRunId: seedRunId,
        userId: seedUserId,
        vacancyId: 'vac-boss-002',
        vacancy: {
          id: 'vac-boss-002',
          source: 'Boss.az',
          sourceVacancyId: 'boss-55192',
          canonicalVacancyId: 'canon-senior-creative-designer-kapital',
          companyName: 'Kapital Bank',
          companyLogoUrl: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=100&h=100&fit=crop&q=80',
          titleOriginal: 'Kreativ Art Direktor / Senior Brand Designer',
          titleNormalized: 'Creative Art Director',
          descriptionOriginal: 'Kapital Bank Marketinq Departamentində Birbank ekosisteminin Art Direktoru.',
          descriptionNormalized: 'Art Director and Senior Brand Designer responsible for Birbank ecosystem.',
          requirements: ['Art Direction sahəsində 5+ il təcrübə', 'Genişmiqyaslı kampaniyalar'],
          responsibilities: ['Reklam və promo kampaniyalarının vizual konsepsiyaları'],
          location: 'Bakı, Nəsimi r.',
          city: 'Baku',
          country: 'Azerbaijan',
          workFormat: 'HYBRID',
          salaryMin: 2800,
          salaryMax: 4000,
          salaryCurrency: 'AZN',
          seniority: 'HEAD',
          category: 'Design & Creative',
          employmentType: 'FULL_TIME',
          languages: ['az', 'en'],
          publicationDate: '2026-08-20',
          applicationMethod: 'EMAIL',
          applicationEmail: 'recruitment@kapitalbank.az',
          sourceUrl: 'https://boss.az/vacancies/art-director-kapital-bank',
          originalLanguage: 'az',
          status: 'ACTIVE',
          createdAt: '2026-08-20T10:00:00Z',
          updatedAt: '2026-08-20T10:00:00Z',
        },
        matchScore: 92,
        subject: 'Creative Art Director — Kamil Dadashov',
        coverLetter: `Hörmətli Kapital Bank İstedadların Cəlbi komandası,

Birbank ekosistemi üzrə elan edilmiş «Creative Art Director» vəzifəsinə müraciətimi təqdim edirəm. 6 illik brending və kreativ rəhbərlik təcrübəm ilə milli miqyaslı kampaniyaların vizual arxitekturasına töhfə verməyə hazıram.

Hörmətlə,
Kamil Dadashov`,
        recipientEmail: 'recruitment@kapitalbank.az',
        senderEmail: 'kamildadashoff@gmail.com',
        status: 'SENT',
        sentAt: '2026-08-20T10:25:30Z',
        replyStatus: 'POSITIVE_REPLY',
        replyText: 'Salam Kamil bəy, müraciətiniz üçün təşəkkürlər. Portfeliniz kreativ heyət tərəfindən araşdırılır.',
        repliedAt: '2026-08-22T09:15:00Z',
        manualOutcome: 'NONE',
        threadId: 'th-kapital-5519',
      },
      {
        id: 'app-003',
        searchRunId: seedRunId,
        userId: seedUserId,
        vacancyId: 'vac-js-007',
        vacancy: {
          id: 'vac-js-007',
          source: 'JobSearch.az',
          sourceVacancyId: 'js-99881',
          canonicalVacancyId: 'canon-lead-ui-ux-designer-unibank',
          companyName: 'Unibank Commercial Bank',
          companyLogoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&h=100&fit=crop&q=80',
          titleOriginal: 'Lead Product Designer (UI/UX)',
          titleNormalized: 'Lead UI/UX Designer',
          descriptionOriginal: 'Unibank rəqəmsal bankçılıq məhsulları üzrə dizayn komandasına rəhbərlik.',
          descriptionNormalized: 'Lead UI/UX Product Designer heading digital banking design systems.',
          requirements: ['Mobil və veb məhsulların UI/UX dizaynında 4+ il təcrübə', 'Design Systems'],
          responsibilities: ['Dizayn sistemləri və istifadəçi təcrübəsinin idarəsi'],
          location: 'Bakı, Rəşid Behbudov küç.',
          city: 'Baku',
          country: 'Azerbaijan',
          workFormat: 'HYBRID',
          salaryMin: 2700,
          salaryMax: 4200,
          salaryCurrency: 'AZN',
          seniority: 'HEAD',
          category: 'Design & Creative',
          employmentType: 'FULL_TIME',
          languages: ['az', 'en'],
          publicationDate: '2026-08-20',
          applicationMethod: 'EMAIL',
          applicationEmail: 'cv@unibank.az',
          sourceUrl: 'https://jobsearch.az/vacancies/lead-product-designer-unibank',
          originalLanguage: 'az',
          status: 'ACTIVE',
          createdAt: '2026-08-20T10:00:00Z',
          updatedAt: '2026-08-20T10:00:00Z',
        },
        matchScore: 89,
        subject: 'Lead UI/UX Designer — Kamil Dadashov',
        coverLetter: `Hörmətli Unibank HR heyəti,

Rəqəmsal bank məhsulları üzrə Lead UI/UX Designer vəzifəsinə marağımı bildirirəm. Təcrübəm və dizayn sistemləri üzrə liderlik bacarığım məhsul komandanıza dəyər qatacaqdır. CV faylım əlavədədir.

Hörmətlə,
Kamil Dadashov`,
        recipientEmail: 'cv@unibank.az',
        senderEmail: 'kamildadashoff@gmail.com',
        status: 'SENT',
        sentAt: '2026-08-20T10:26:00Z',
        replyStatus: 'AUTOMATIC_REPLY',
        replyText: 'Müraciətiniz qeydə alındı. Namizədliyiniz uyğun gəldikdə əlaqə saxlanılacaq.',
        repliedAt: '2026-08-20T10:26:05Z',
        manualOutcome: 'NONE',
        threadId: 'th-unibank-9988',
      },
      {
        id: 'app-004',
        searchRunId: seedRunId,
        userId: seedUserId,
        vacancyId: 'vac-boss-011',
        vacancy: {
          id: 'vac-boss-011',
          source: 'Boss.az',
          sourceVacancyId: 'boss-73410',
          canonicalVacancyId: 'canon-creative-copywriter-ad-baku',
          companyName: 'Endorphin Creative Agency',
          companyLogoUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop&q=80',
          titleOriginal: 'Senior Copywriter & Creative Strategist',
          titleNormalized: 'Senior Copywriter',
          descriptionOriginal: 'Endorphin reklam agentliyi kampaniyalar üçün ssenarilər hazırlayacaq Senior Copywriter axtarır.',
          descriptionNormalized: 'Senior Creative Copywriter developing conceptual storytelling.',
          requirements: ['Agentlik təcrübəsi 3+ il'],
          responsibilities: ['Kreativ kampaniyalar'],
          location: 'Bakı, Fəvvarələr Meydanı',
          city: 'Baku',
          country: 'Azerbaijan',
          workFormat: 'HYBRID',
          salaryMin: 1800,
          salaryMax: 2600,
          salaryCurrency: 'AZN',
          seniority: 'SPECIALIST',
          category: 'Marketing & Growth',
          employmentType: 'FULL_TIME',
          languages: ['az', 'ru'],
          publicationDate: '2026-08-20',
          applicationMethod: 'EMAIL',
          applicationEmail: 'hr@endorphin.az',
          sourceUrl: 'https://boss.az/vacancies/senior-copywriter-endorphin',
          originalLanguage: 'az',
          status: 'ACTIVE',
          createdAt: '2026-08-20T10:00:00Z',
          updatedAt: '2026-08-20T10:00:00Z',
        },
        matchScore: 82,
        subject: 'Senior Copywriter & Creative Strategist — Kamil Dadashov',
        coverLetter: `Hörmətli Endorphin Creative komandası,

Kreativ layihələr və brend kommunikasiyası üzrə təcrübəmlə komandanızın layihələrinə töhfə verməyə hazıram. CV faylım əlavə edilmişdir.

Hörmətlə,
Kamil Dadashov`,
        recipientEmail: 'hr@endorphin.az',
        senderEmail: 'kamildadashoff@gmail.com',
        status: 'SENT',
        sentAt: '2026-08-20T10:26:30Z',
        replyStatus: 'REPLIED',
        replyText: 'Təşəkkür edirik Kamil bəy, portfelinizi çox bəyəndik. Tezliklə onlayn tanışlıq görüşü təyin edəcəyik.',
        repliedAt: '2026-08-23T16:00:00Z',
        manualOutcome: 'WHATSAPP',
        threadId: 'th-endorphin-7341',
      }
    ];

    seedApps.forEach(a => this.applications.set(a.id, a));
  }

  // Create a new SearchRun
  async createSearchRun(userId: string, packageType: PackageType, origin: SearchRunOrigin = 'WEB'): Promise<SearchRun> {
    const runId = `run-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const maxScanLimit = packageType === 'JOB_BLAST' ? 500 : 300;
    const maxShortlist = packageType === 'JOB_BLAST' ? 50 : 30;

    const run: SearchRun = {
      id: runId,
      userId,
      origin,
      packageType,
      status: 'PAYMENT_PENDING',
      maxScanned: maxScanLimit,
      maxMatched: maxShortlist,
      maxSent: maxShortlist,
      vacanciesScanned: 0,
      vacanciesMatched: 0,
      applicationsPrepared: 0,
      applicationsSent: 0,
      startedAt: new Date().toISOString(),
      estimatedCost: packageType === 'JOB_BLAST' ? 8 : 5,
      actualAICost: 0,
    };

    this.searchRuns.set(run.id, run);
    return run;
  }

  // Execute Search Pipeline
  async executeSearch(runId: string): Promise<SearchRun> {
    const run = this.searchRuns.get(runId);
    if (!run) throw new Error('Search run not found');

    run.status = 'PROCESSING';

    const candidate = candidateProfileService.getProfile(run.userId);
    const preferences = candidateProfileService.getPreferences(run.userId);

    if (!candidate || !preferences) {
      run.status = 'FAILED';
      run.errorSummary = 'Candidate profile or preferences missing';
      return run;
    }

    // Exclude previous applications (Repeat Search exclusion requirement)
    const previousAppIds = Array.from(this.applications.values())
      .filter(a => a.userId === run.userId)
      .map(a => a.vacancyId);

    const matchResults = await matchingEngine.runMatchPipeline({
      candidate,
      preferences,
      packageType: run.packageType,
      excludedPreviousVacancyIds: previousAppIds,
    });

    run.matches = matchResults.matches.map(m => ({ ...m, searchRunId: run.id }));
    run.vacanciesScanned = matchResults.scannedCount;
    run.vacanciesMatched = matchResults.matchedCount;
    run.applicationsPrepared = matchResults.matchedCount;
    run.actualAICost = matchResults.aiLog.costUSD;
    run.aiLog = matchResults.aiLog;
    run.status = 'READY_FOR_REVIEW';

    return run;
  }

  // Confirm and Send Applications (Rate-controlled queue simulation)
  async dispatchApplications(runId: string, senderEmail: string, approvedMatchIds?: string[]): Promise<Application[]> {
    const run = this.searchRuns.get(runId);
    if (!run || !run.matches) throw new Error('Search run not ready');

    run.status = 'SENDING';
    const sentApps: Application[] = [];

    const matchesToSend = run.matches.filter(m => {
      if (m.isExcluded) return false;
      if (approvedMatchIds && approvedMatchIds.length > 0) {
        return approvedMatchIds.includes(m.id);
      }
      return true;
    });

    for (let i = 0; i < matchesToSend.length; i++) {
      const match = matchesToSend[i];
      const app: Application = {
        id: `app-${Date.now()}-${i}`,
        searchRunId: run.id,
        userId: run.userId,
        vacancyId: match.vacancyId,
        vacancy: match.vacancy,
        matchScore: match.matchScore,
        subject: match.preparedSubject || `${match.vacancy.titleNormalized} Application`,
        coverLetter: match.userEditedLetter || match.preparedCoverLetter || '',
        recipientEmail: match.vacancy.applicationEmail || 'careers@company.az',
        senderEmail,
        status: match.vacancy.applicationMethod === 'MANUAL' ? 'EXCLUDED' : 'SENT',
        sentAt: new Date().toISOString(),
        replyStatus: 'PENDING',
        manualOutcome: 'NONE',
        threadId: `th-${Date.now()}-${i}`,
        messageId: `<mashcool-${Date.now()}-${i}@mash.cool>`,
      };

      this.applications.set(app.id, app);
      sentApps.push(app);
    }

    run.applicationsSent = sentApps.filter(a => a.status === 'SENT').length;
    run.status = 'COMPLETED';
    run.completedAt = new Date().toISOString();

    return sentApps;
  }

  getUserSearchRuns(userId: string): SearchRun[] {
    return Array.from(this.searchRuns.values())
      .filter(r => r.userId === userId)
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  }

  getSearchRunById(id: string): SearchRun | undefined {
    return this.searchRuns.get(id);
  }

  getUserApplications(userId: string): Application[] {
    return Array.from(this.applications.values())
      .filter(a => a.userId === userId)
      .sort((a, b) => (new Date(b.sentAt || 0).getTime() - new Date(a.sentAt || 0).getTime()));
  }

  updateManualOutcome(appId: string, outcome: any): Application {
    const app = this.applications.get(appId);
    if (!app) throw new Error('Application not found');
    app.manualOutcome = outcome;
    return app;
  }

  updateCoverLetter(runId: string, matchId: string, newLetter: string): VacancyMatch {
    const run = this.searchRuns.get(runId);
    if (!run || !run.matches) throw new Error('Search run matches not found');
    const match = run.matches.find(m => m.id === matchId);
    if (!match) throw new Error('Match not found');
    match.userEditedLetter = newLetter;
    return match;
  }

  excludeMatch(runId: string, matchId: string, isExcluded: boolean): VacancyMatch {
    const run = this.searchRuns.get(runId);
    if (!run || !run.matches) throw new Error('Search run matches not found');
    const match = run.matches.find(m => m.id === matchId);
    if (!match) throw new Error('Match not found');
    match.isExcluded = isExcluded;
    return match;
  }

  // Simulate employer reply detection for testing / live demonstrations
  simulateEmployerReply(appId: string, replyType: 'INTERVIEW' | 'POSITIVE_REPLY' | 'REJECTED' | 'OFFER' | 'AUTOMATIC_REPLY', text?: string): Application {
    const app = this.applications.get(appId);
    if (!app) throw new Error('Application not found');

    app.replyStatus = replyType;
    app.repliedAt = new Date().toISOString();
    app.replyText = text || (
      replyType === 'INTERVIEW' ? `Hörmətli namizəd, ${app.vacancy.companyName} komandası adından müraciətiniz üçün təşəkkür edirik. Sizi müsahibəyə dəvət edirik.` :
      replyType === 'OFFER' ? `Təbriklər! ${app.vacancy.companyName} sizə ${app.vacancy.titleNormalized} vəzifəsi üzrə rəsmi iş təklifi təqdim edir.` :
      replyType === 'POSITIVE_REPLY' ? `Müraciətiniz qəbul olundu və departament rəhbərinə yönləndirildi.` :
      replyType === 'AUTOMATIC_REPLY' ? `Avtomatik bildiriş: CV bazaya daxil edildi.` :
      `Hörmətli namizəd, digər namizədlə davam etmək qərarına gəldik.`
    );

    return app;
  }
}

export const searchRunService = new SearchRunService();
