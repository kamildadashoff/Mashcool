export type Locale = 'az' | 'en' | 'ru';

export type Seniority = 'INTERN' | 'EMPLOYEE' | 'SPECIALIST' | 'MANAGER' | 'HEAD';
export type SeniorityLevel = Seniority;

export type WorkFormat = 'OFFICE' | 'HYBRID' | 'REMOTE' | 'ANY';

export type VacancyStatus = 'ACTIVE' | 'EXPIRED' | 'REMOVED' | 'UNKNOWN';

export type ApplicationMethod = 'EMAIL' | 'API' | 'EXTERNAL_FORM' | 'MANUAL' | 'UNKNOWN';

export type PackageType = 'JOB_LUCK' | 'JOB_BLAST';

export type SearchRunOrigin = 'WEB' | 'TELEGRAM';

export type SearchRunStatus = 
  | 'CREATED'
  | 'PAYMENT_PENDING'
  | 'PROCESSING'
  | 'READY_FOR_REVIEW'
  | 'SENDING'
  | 'COMPLETED'
  | 'PARTIAL'
  | 'FAILED'
  | 'CANCELLED';

export type ApplicationDeliveryStatus = 'PENDING' | 'SENT' | 'FAILED' | 'BOUNCED' | 'EXCLUDED';
export type ApplicationStatus = ApplicationDeliveryStatus;

export type ReplyClassification = 
  | 'PENDING'
  | 'REPLIED'
  | 'POSITIVE_REPLY'
  | 'INTERVIEW'
  | 'REJECTED'
  | 'OFFER'
  | 'AUTOMATIC_REPLY'
  | 'OTHER';

export type ManualOutcome = 'NONE' | 'CALLED_ME' | 'WHATSAPP' | 'INTERVIEW' | 'OFFER' | 'REJECTED' | 'NO_RESPONSE';

export interface UserIdentity {
  provider: 'EMAIL' | 'GOOGLE' | 'MICROSOFT' | 'TELEGRAM';
  providerId: string;
  email?: string;
  displayName?: string;
  connectedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  preferredLocale: Locale;
  identities: UserIdentity[];
  createdAt: string;
  role: 'USER' | 'ADMIN';
  emailConnection?: {
    provider: 'GMAIL' | 'OUTLOOK';
    email: string;
    connectedAt: string;
    active: boolean;
  };
}

export interface CVWorkExperience {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  highlights: string[];
}

export interface CVEducation {
  institution: string;
  degree: string;
  field: string;
  graduationYear: string;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  professionalHeadline: string;
  professionalSummary: string;
  yearsExperience: number;
  currentRole: string;
  previousRoles: string[];
  workHistory: CVWorkExperience[];
  skills: string[];
  tools: string[];
  industries: string[];
  languages: { language: string; proficiency: string }[];
  education: CVEducation[];
  portfolioUrl?: string;
  linkedinUrl?: string;
  otherProfessionalLinks?: string[];
  activeCvId?: string;
  updatedAt: string;
}

export interface CVDocument {
  id: string;
  userId: string;
  filename: string;
  mimeType: string;
  storageKey: string;
  fileSize: number;
  parsedText: string;
  uploadedAt: string;
  active: boolean;
  version: number;
}

export interface JobPreference {
  id: string;
  userId: string;
  jobCategories: string[];
  desiredTitles: string[];
  excludedTitles: string[];
  seniorities: Seniority[];
  city: string;
  country: string;
  minimumSalary?: number;
  salaryCurrency: string;
  workFormats: WorkFormat[];
  preferredIndustries: string[];
  excludedIndustries: string[];
  preferredCompanies: string[];
  excludedCompanies: string[];
  languages: string[];
  keywords: string[];
  blacklistedKeywords: string[];
}

export interface Vacancy {
  id: string;
  source: 'JobSearch.az' | 'Boss.az' | 'Glorri.az' | 'LinkedIn' | 'Direct';
  sourceVacancyId: string;
  canonicalVacancyId: string;
  companyName: string;
  companyLogoUrl?: string;
  titleOriginal: string;
  titleNormalized: string;
  descriptionOriginal: string;
  descriptionNormalized: string;
  requirements: string[];
  responsibilities: string[];
  location: string;
  city: string;
  country: string;
  workFormat: WorkFormat;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  salaryGrossNet?: 'GROSS' | 'NET';
  seniority: Seniority;
  category: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  languages: string[];
  publicationDate: string;
  expirationDate?: string;
  applicationMethod: ApplicationMethod;
  applicationEmail?: string;
  applicationUrl?: string;
  sourceUrl: string;
  originalLanguage: 'az' | 'en' | 'ru';
  status: VacancyStatus;
  createdAt: string;
  updatedAt: string;
  duplicateSources?: string[];
}

export interface VacancyMatch {
  id: string;
  searchRunId: string;
  vacancyId: string;
  vacancy: Vacancy;
  matchScore: number; // 0-100
  confidenceScore: number; // 0.0 - 1.0
  positiveReasons: string[];
  riskFactors: string[];
  missingRequirements: string[];
  recommendation: string;
  preparedCoverLetter?: string;
  preparedSubject?: string;
  isExcluded: boolean;
  userEditedLetter?: string;
}

export interface Application {
  id: string;
  searchRunId: string;
  userId: string;
  vacancyId: string;
  vacancy: Vacancy;
  matchScore: number;
  subject: string;
  coverLetter: string;
  recipientEmail: string;
  senderEmail: string;
  status: ApplicationDeliveryStatus;
  sentAt?: string;
  deliveryError?: string;
  replyStatus: ReplyClassification;
  replyText?: string;
  repliedAt?: string;
  manualOutcome: ManualOutcome;
  threadId?: string;
  messageId?: string;
}

export interface SearchRun {
  id: string;
  userId: string;
  origin: SearchRunOrigin;
  packageType: PackageType;
  status: SearchRunStatus;
  maxScanned: number;
  maxMatched: number;
  maxSent: number;
  vacanciesScanned: number;
  vacanciesMatched: number;
  applicationsPrepared: number;
  applicationsSent: number;
  startedAt: string;
  completedAt?: string;
  estimatedCost: number; // AZN
  actualAICost: number; // USD / AZN tracked
  errorSummary?: string;
  matches?: VacancyMatch[];
  aiLog?: {
    model: string;
    inputTokens: number;
    outputTokens: number;
    latencyMs: number;
    retries: number;
  };
}

export interface Payment {
  id: string;
  userId: string;
  packageType: PackageType;
  amount: number;
  currency: 'AZN';
  provider: 'MASHCOOL_PAY' | 'PASHAPAY_KAPITAL' | 'STRIPE' | 'DEV_MOCK';
  providerTransactionId: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  createdAt: string;
  updatedAt: string;
  searchRunId?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  eventType: 'APPLICATION_REPLY_RECEIVED' | 'SEARCH_RUN_COMPLETED' | 'INTERVIEW_INVITATION' | 'MATCH_DISCOVERED' | 'EMAIL_BOUNCED';
  payload: Record<string, any>;
  read: boolean;
  createdAt: string;
}

export interface AnalyticsEvent {
  id: string;
  userId?: string;
  eventName: string;
  origin: SearchRunOrigin;
  locale: Locale;
  package?: PackageType;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface SourceHealth {
  sourceName: string;
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  lastSuccessfulSync: string;
  newVacanciesLast24h: number;
  failedJobsCount: number;
  duplicatesCount: number;
  expiredJobsCount: number;
  enabled: boolean;
}

export interface AdminMetrics {
  totalUsers: number;
  activeProfiles: number;
  totalVacancies: number;
  activeVacancies: number;
  totalSearchRuns: number;
  totalApplicationsSent: number;
  totalRevenueAZN: number;
  avgAiCostJobLuckUSD: number;
  avgAiCostJobBlastUSD: number;
  p50AiCostUSD: number;
  p95AiCostUSD: number;
  aiSpendingSafetyLimitUSD: number;
  currentMonthAiSpendUSD: number;
  overallReplyRatePercent: number;
  interviewRatePercent: number;
  sources: SourceHealth[];
}
