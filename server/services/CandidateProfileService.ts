import { CandidateProfile, CVDocument, JobPreference } from '../../src/types';
import { getGeminiClient } from './GeminiService';

export class CandidateProfileService {
  private profiles: Map<string, CandidateProfile> = new Map();
  private documents: Map<string, CVDocument[]> = new Map();
  private preferences: Map<string, JobPreference> = new Map();

  constructor() {
    // Seed initial profile for Kamil Dadashov (matching prompt context)
    const seedUserId = 'usr-kamil-dadashov';

    const seedDoc: CVDocument = {
      id: 'cv-doc-001',
      userId: seedUserId,
      filename: 'Kamil_Dadashov_CV_2026.pdf',
      mimeType: 'application/pdf',
      storageKey: 'cvs/usr-kamil-dadashov/v1.pdf',
      fileSize: 412000,
      parsedText: `Kamil Dadashov
Lead Graphic Designer & Creative Art Lead
Baku, Azerbaijan | kamildadashoff@gmail.com | +994 50 234 56 78
Portfolio: https://behance.net/kamildadashov | LinkedIn: https://linkedin.com/in/kamildadashov

PROFESSIONAL SUMMARY
Senior Brand & Graphic Designer with 6+ years of proven track record leading creative direction, brand identity systems, and multi-channel marketing campaigns across luxury hospitality, fintech, and commercial retail in Baku.

EXPERIENCE
Creative Lead & Senior Brand Designer — Baku Creative Labs (2023 - Present)
- Led creative squad of 5 designers, developing 360-degree brand campaigns for premier hospitality & banking clients.
- Elevated brand recall by 40% through unified digital design systems and packaging.
- Directed commercial photoshoots, brand guideline books, and digital marketing collateral.

Senior Graphic Designer — Absheron Media Group (2020 - 2023)
- Created print and digital visual assets for international corporate events and 5-star hotel launches.
- Managed end-to-end design lifecycles from concept moodboards to pre-press quality control.

Graphic Designer — Caspian Tech Solutions (2018 - 2020)
- Designed UI elements, social media campaigns, and marketing collateral.

SKILLS & TOOLS
- Brand Architecture & Guidelines, Visual Identity, Creative Direction, Typography, Pre-press Production.
- Tools: Adobe Photoshop, Adobe Illustrator, Adobe InDesign, Figma, After Effects, Lightroom.
- Languages: Azerbaijani (Native), English (Fluent - C1), Russian (Professional - B2).

EDUCATION
B.A. in Graphic & Industrial Design — Azerbaijan State Academy of Fine Arts (2014 - 2018)`,
      uploadedAt: '2026-08-20T10:15:00Z',
      active: true,
      version: 1,
    };

    const seedProfile: CandidateProfile = {
      id: 'prof-kamil-001',
      userId: seedUserId,
      firstName: 'Kamil',
      lastName: 'Dadashov',
      email: 'kamildadashoff@gmail.com',
      phone: '+994 50 234 56 78',
      city: 'Baku',
      country: 'Azerbaijan',
      professionalHeadline: 'Lead Graphic Designer & Creative Art Lead',
      professionalSummary: 'Senior Brand & Graphic Designer with 6+ years of proven track record leading creative direction, brand identity systems, and multi-channel marketing campaigns across luxury hospitality, fintech, and commercial retail in Baku.',
      yearsExperience: 6,
      currentRole: 'Creative Lead & Senior Brand Designer',
      previousRoles: ['Senior Graphic Designer', 'Graphic Designer', 'Brand Designer'],
      workHistory: [
        {
          company: 'Baku Creative Labs',
          role: 'Creative Lead & Senior Brand Designer',
          startDate: '2023-01-01',
          current: true,
          description: 'Led creative squad of 5 designers developing brand campaigns for hospitality and fintech.',
          highlights: ['Team leadership', 'Design systems', 'Brand guidelines']
        },
        {
          company: 'Absheron Media Group',
          role: 'Senior Graphic Designer',
          startDate: '2020-03-01',
          endDate: '2022-12-31',
          current: false,
          description: 'Created visual assets for international corporate events and 5-star hotel launches.',
          highlights: ['Print & digital collateral', 'Pre-press production']
        }
      ],
      skills: ['Brand Identity', 'Creative Direction', 'Typography', 'Visual Strategy', 'Design Systems', 'Pre-press Production', 'Team Mentorship'],
      tools: ['Figma', 'Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign', 'After Effects', 'Lightroom'],
      industries: ['Hospitality & Tourism', 'Fintech & Banking', 'Retail & FMCG', 'Creative Agencies'],
      languages: [
        { language: 'Azerbaijani', proficiency: 'Native' },
        { language: 'English', proficiency: 'Fluent (C1)' },
        { language: 'Russian', proficiency: 'Professional (B2)' }
      ],
      education: [
        {
          institution: 'Azerbaijan State Academy of Fine Arts',
          degree: 'Bachelor of Arts',
          field: 'Graphic & Industrial Design',
          graduationYear: '2018'
        }
      ],
      portfolioUrl: 'https://behance.net/kamildadashov',
      linkedinUrl: 'https://linkedin.com/in/kamildadashov',
      activeCvId: seedDoc.id,
      updatedAt: '2026-08-20T10:15:00Z',
    };

    const seedPreferences: JobPreference = {
      id: 'pref-kamil-001',
      userId: seedUserId,
      jobCategories: ['Design & Creative', 'Marketing & Growth'],
      desiredTitles: ['Lead Graphic Designer', 'Creative Director', 'Art Director', 'Senior Brand Designer', 'Head of Creative'],
      excludedTitles: ['Junior Designer', 'Intern'],
      seniorities: ['MANAGER', 'HEAD'],
      city: 'Baku',
      country: 'Azerbaijan',
      minimumSalary: 2200,
      salaryCurrency: 'AZN',
      workFormats: ['HYBRID', 'OFFICE', 'ANY'],
      preferredIndustries: ['Hospitality', 'Fintech', 'Retail', 'Creative Agencies'],
      excludedIndustries: ['Gambling'],
      preferredCompanies: ['Absheron Hotel Group', 'Kapital Bank', 'PASHA Technology', 'Unibank'],
      excludedCompanies: [],
      languages: ['az', 'en'],
      keywords: ['Brand', 'Lead', 'Design', 'Creative', 'Adobe', 'Figma'],
      blacklistedKeywords: ['unpaid']
    };

    this.documents.set(seedUserId, [seedDoc]);
    this.profiles.set(seedUserId, seedProfile);
    this.preferences.set(seedUserId, seedPreferences);
  }

  getProfile(userId: string): CandidateProfile | undefined {
    return this.profiles.get(userId);
  }

  getDocuments(userId: string): CVDocument[] {
    return this.documents.get(userId) || [];
  }

  getPreferences(userId: string): JobPreference | undefined {
    return this.preferences.get(userId);
  }

  saveProfile(userId: string, profile: Partial<CandidateProfile>): CandidateProfile {
    const existing = this.profiles.get(userId);
    const updated: CandidateProfile = {
      id: existing?.id || `prof-${Date.now()}`,
      userId,
      firstName: profile.firstName || existing?.firstName || '',
      lastName: profile.lastName || existing?.lastName || '',
      email: profile.email || existing?.email || '',
      phone: profile.phone || existing?.phone || '',
      city: profile.city || existing?.city || 'Baku',
      country: profile.country || existing?.country || 'Azerbaijan',
      professionalHeadline: profile.professionalHeadline || existing?.professionalHeadline || 'Professional Specialist',
      professionalSummary: profile.professionalSummary || existing?.professionalSummary || '',
      yearsExperience: profile.yearsExperience ?? existing?.yearsExperience ?? 3,
      currentRole: profile.currentRole || existing?.currentRole || '',
      previousRoles: profile.previousRoles || existing?.previousRoles || [],
      workHistory: profile.workHistory || existing?.workHistory || [],
      skills: profile.skills || existing?.skills || [],
      tools: profile.tools || existing?.tools || [],
      industries: profile.industries || existing?.industries || [],
      languages: profile.languages || existing?.languages || [{ language: 'Azerbaijani', proficiency: 'Native' }],
      education: profile.education || existing?.education || [],
      portfolioUrl: profile.portfolioUrl || existing?.portfolioUrl,
      linkedinUrl: profile.linkedinUrl || existing?.linkedinUrl,
      otherProfessionalLinks: profile.otherProfessionalLinks || existing?.otherProfessionalLinks,
      activeCvId: profile.activeCvId || existing?.activeCvId,
      updatedAt: new Date().toISOString(),
    };
    this.profiles.set(userId, updated);
    return updated;
  }

  savePreferences(userId: string, prefs: Partial<JobPreference>): JobPreference {
    const existing = this.preferences.get(userId);
    const updated: JobPreference = {
      id: existing?.id || `pref-${Date.now()}`,
      userId,
      jobCategories: prefs.jobCategories || existing?.jobCategories || ['Software Engineering', 'Design & Creative'],
      desiredTitles: prefs.desiredTitles || existing?.desiredTitles || [],
      excludedTitles: prefs.excludedTitles || existing?.excludedTitles || [],
      seniorities: prefs.seniorities || existing?.seniorities || ['SPECIALIST', 'MANAGER'],
      city: prefs.city || existing?.city || 'Baku',
      country: prefs.country || existing?.country || 'Azerbaijan',
      minimumSalary: prefs.minimumSalary ?? existing?.minimumSalary,
      salaryCurrency: prefs.salaryCurrency || existing?.salaryCurrency || 'AZN',
      workFormats: prefs.workFormats || existing?.workFormats || ['ANY'],
      preferredIndustries: prefs.preferredIndustries || existing?.preferredIndustries || [],
      excludedIndustries: prefs.excludedIndustries || existing?.excludedIndustries || [],
      preferredCompanies: prefs.preferredCompanies || existing?.preferredCompanies || [],
      excludedCompanies: prefs.excludedCompanies || existing?.excludedCompanies || [],
      languages: prefs.languages || existing?.languages || ['az', 'en'],
      keywords: prefs.keywords || existing?.keywords || [],
      blacklistedKeywords: prefs.blacklistedKeywords || existing?.blacklistedKeywords || [],
    };
    this.preferences.set(userId, updated);
    return updated;
  }

  // Parse CV Document and extract structured profile using Gemini AI (with robust fallback)
  async parseCvDocument(userId: string, filename: string, rawText: string): Promise<{ profile: CandidateProfile; doc: CVDocument }> {
    const existingDocs = this.documents.get(userId) || [];
    const newVersion = existingDocs.length + 1;

    // deactivate others
    existingDocs.forEach(d => { d.active = false; });

    const newDoc: CVDocument = {
      id: `cv-doc-${Date.now()}`,
      userId,
      filename,
      mimeType: filename.endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/pdf',
      storageKey: `cvs/${userId}/v${newVersion}_${filename}`,
      fileSize: rawText.length * 2,
      parsedText: rawText,
      uploadedAt: new Date().toISOString(),
      active: true,
      version: newVersion,
    };

    existingDocs.push(newDoc);
    this.documents.set(userId, existingDocs);

    let parsedProfileData: Partial<CandidateProfile> = {};

    const ai = getGeminiClient();
    if (ai && rawText && rawText.length > 50) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: `You are an executive CV parser for MASHCOOL. Analyze the following CV text and extract structured JSON matching the schema:
{
  "firstName": string,
  "lastName": string,
  "email": string,
  "phone": string,
  "city": string,
  "country": string,
  "professionalHeadline": string,
  "professionalSummary": string,
  "yearsExperience": number,
  "currentRole": string,
  "previousRoles": string[],
  "skills": string[],
  "tools": string[],
  "industries": string[],
  "languages": [{"language": string, "proficiency": string}],
  "education": [{"institution": string, "degree": string, "field": string, "graduationYear": string}]
}

CV TEXT:
${rawText}`,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          const extracted = JSON.parse(response.text);
          parsedProfileData = extracted;
        }
      } catch (err) {
        console.warn('Gemini CV parsing failed or skipped, applying heuristic fallback:', err);
      }
    }

    // Heuristic fallback if AI was unavailable or sparse
    if (!parsedProfileData.firstName) {
      const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
      const nameParts = (lines[0] || 'Aytan Mammadova').split(' ');
      parsedProfileData = {
        firstName: nameParts[0] || 'Candidate',
        lastName: nameParts.slice(1).join(' ') || '',
        email: rawText.match(/[\w.-]+@[\w.-]+\.\w+/)?.[0] || 'candidate@example.com',
        phone: rawText.match(/\+?\d[\d\s-]{7,}/)?.[0] || '+994 50 123 45 67',
        city: 'Baku',
        country: 'Azerbaijan',
        professionalHeadline: lines[1] || 'Specialist',
        professionalSummary: lines.slice(2, 5).join(' ') || 'Experienced professional focused on delivering high-impact business results.',
        yearsExperience: 4,
        currentRole: lines[1] || 'Specialist',
        previousRoles: [],
        skills: ['Strategic Planning', 'Project Delivery', 'Communication', 'Analysis'],
        tools: ['Microsoft Office', 'Slack', 'Jira'],
        industries: ['Technology', 'Services'],
        languages: [{ language: 'Azerbaijani', proficiency: 'Native' }, { language: 'English', proficiency: 'Working' }],
        education: [{ institution: 'Baku State University', degree: 'Bachelor', field: 'Economics & Management', graduationYear: '2020' }]
      };
    }

    const saved = this.saveProfile(userId, {
      ...parsedProfileData,
      activeCvId: newDoc.id,
    });

    return { profile: saved, doc: newDoc };
  }
}

export const candidateProfileService = new CandidateProfileService();
