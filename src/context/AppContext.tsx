import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, CandidateProfile, CVDocument, JobPreference, 
  Vacancy, SearchRun, Application, AppNotification, 
  AdminMetrics, Locale, PackageType, ManualOutcome, SourceHealth 
} from '../types';
import { getTranslation, detectInitialLocale } from '../locales';

interface AppContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: ReturnType<typeof getTranslation>;
  user: User | null;
  profile: CandidateProfile | null;
  preferences: JobPreference | null;
  documents: CVDocument[];
  vacancies: Vacancy[];
  sourcesHealth: SourceHealth[];
  searchRuns: SearchRun[];
  currentRun: SearchRun | null;
  applications: ApplicationsSummary;
  notifications: AppNotification[];
  adminMetrics: AdminMetrics | null;
  activeView: string;
  setActiveView: (view: string) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isTelegramBotOpen: boolean;
  setIsTelegramBotOpen: (open: boolean) => void;
  isTestsModalOpen: boolean;
  setIsTestsModalOpen: (open: boolean) => void;
  isLoading: boolean;
  // Actions
  loginWithEmail: (email: string, name?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  linkTelegram: (telegramId: string, username: string) => Promise<void>;
  connectEmail: (provider: 'GMAIL' | 'OUTLOOK', email: string) => Promise<void>;
  disconnectEmail: () => Promise<void>;
  uploadCV: (filename: string, rawText: string) => Promise<{ profile: CandidateProfile; doc: CVDocument }>;
  updateProfile: (profile: Partial<CandidateProfile>) => Promise<void>;
  updatePreferences: (prefs: Partial<JobPreference>) => Promise<void>;
  startSearchRun: (packageType: PackageType) => Promise<SearchRun>;
  payAndExecuteSearch: (runId: string, packageType: PackageType) => Promise<SearchRun>;
  dispatchApplications: (runId: string, approvedMatchIds?: string[]) => Promise<Application[]>;
  updateCoverLetter: (runId: string, matchId: string, newLetter: string) => Promise<void>;
  excludeMatch: (runId: string, matchId: string, isExcluded: boolean) => Promise<void>;
  updateOutcome: (appId: string, outcome: ManualOutcome) => Promise<void>;
  simulateReply: (appId: string, replyType: any, text?: string) => Promise<void>;
  toggleSource: (sourceName: string, enabled: boolean) => Promise<void>;
  refreshAllData: () => Promise<void>;
}

interface ApplicationsSummary {
  list: Application[];
  totalSent: number;
  repliedCount: number;
  interviewCount: number;
  offerCount: number;
  replyRate: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(detectInitialLocale());
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [preferences, setPreferences] = useState<JobPreference | null>(null);
  const [documents, setDocuments] = useState<CVDocument[]>([]);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [sourcesHealth, setSourcesHealth] = useState<SourceHealth[]>([]);
  const [searchRuns, setSearchRuns] = useState<SearchRun[]>([]);
  const [currentRun, setCurrentRun] = useState<SearchRun | null>(null);
  const [applicationsList, setApplicationsList] = useState<Application[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [adminMetrics, setAdminMetrics] = useState<AdminMetrics | null>(null);
  
  const [activeView, setActiveView] = useState<string>('home');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isTelegramBotOpen, setIsTelegramBotOpen] = useState<boolean>(false);
  const [isTestsModalOpen, setIsTestsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const t = getTranslation(locale);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mashcool_locale', newLocale);
      document.documentElement.lang = newLocale;
    }
  };

  const refreshAllData = async () => {
    try {
      const headers: Record<string, string> = {
        'x-user-id': user?.id || 'usr-kamil-dadashov',
      };

      // 1. Auth & Me
      const userRes = await fetch('/api/auth/me', { headers });
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData.user);
      }

      // 2. Profile
      const profRes = await fetch('/api/profile', { headers });
      if (profRes.ok) {
        const pData = await profRes.json();
        setProfile(pData.profile);
        setPreferences(pData.preferences);
        setDocuments(pData.documents || []);
      }

      // 3. Vacancies
      const vacRes = await fetch('/api/vacancies');
      if (vacRes.ok) {
        const vData = await vacRes.json();
        setVacancies(vData.vacancies || []);
        setSourcesHealth(vData.sourcesHealth || []);
      }

      // 4. Search Runs
      const runRes = await fetch('/api/search/runs', { headers });
      if (runRes.ok) {
        const rData = await runRes.json();
        setSearchRuns(rData.runs || []);
        if (rData.runs && rData.runs.length > 0 && !currentRun) {
          setCurrentRun(rData.runs[0]);
        }
      }

      // 5. Applications
      const appRes = await fetch('/api/applications', { headers });
      if (appRes.ok) {
        const aData = await appRes.json();
        setApplicationsList(aData.applications || []);
      }

      // 6. Notifications
      const notifRes = await fetch('/api/notifications', { headers });
      if (notifRes.ok) {
        const nData = await notifRes.json();
        setNotifications(nData.notifications || []);
      }

      // 7. Admin Metrics
      const admRes = await fetch('/api/admin/metrics');
      if (admRes.ok) {
        const admData = await admRes.json();
        setAdminMetrics(admData.metrics);
      }
    } catch (err) {
      console.warn('Error fetching MASHCOOL backend data:', err);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Compute metrics
  const totalSent = applicationsList.filter(a => a.status === 'SENT').length;
  const repliedCount = applicationsList.filter(a => a.replyStatus !== 'PENDING' && a.replyStatus !== 'AUTOMATIC_REPLY').length;
  const interviewCount = applicationsList.filter(a => a.replyStatus === 'INTERVIEW' || a.manualOutcome === 'INTERVIEW').length;
  const offerCount = applicationsList.filter(a => a.replyStatus === 'OFFER' || a.manualOutcome === 'OFFER').length;
  const replyRate = totalSent > 0 ? Math.round((repliedCount / totalSent) * 100) : 0;

  const applications: ApplicationsSummary = {
    list: applicationsList,
    totalSent,
    repliedCount,
    interviewCount,
    offerCount,
    replyRate,
  };

  const loginWithEmail = async (email: string, name?: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/email-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, locale }),
      });
      const data = await res.json();
      setUser(data.user);
      await refreshAllData();
      setActiveView('dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'kamildadashoff@gmail.com',
          name: 'Kamil Dadashov',
          googleId: 'g-1092834710',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80',
        }),
      });
      const data = await res.json();
      setUser(data.user);
      await refreshAllData();
      setActiveView('dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const linkTelegram = async (telegramId: string, username: string) => {
    if (!user) return;
    const res = await fetch('/api/auth/telegram-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, telegramId, telegramUsername: username }),
    });
    const data = await res.json();
    setUser(data.user);
  };

  const connectEmail = async (provider: 'GMAIL' | 'OUTLOOK', email: string) => {
    if (!user) return;
    const res = await fetch('/api/auth/connect-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, provider, email }),
    });
    const data = await res.json();
    setUser(data.user);
  };

  const disconnectEmail = async () => {
    if (!user) return;
    const res = await fetch('/api/auth/disconnect-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    });
    const data = await res.json();
    setUser(data.user);
  };

  const uploadCV = async (filename: string, rawText: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/profile/upload-cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || 'usr-kamil-dadashov',
        },
        body: JSON.stringify({ filename, rawText }),
      });
      const data = await res.json();
      setProfile(data.profile);
      setDocuments(prev => [data.doc, ...prev]);
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<CandidateProfile>) => {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': user?.id || 'usr-kamil-dadashov',
      },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    setProfile(data.profile);
  };

  const updatePreferences = async (updates: Partial<JobPreference>) => {
    const res = await fetch('/api/profile/preferences', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': user?.id || 'usr-kamil-dadashov',
      },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    setPreferences(data.preferences);
  };

  const startSearchRun = async (packageType: PackageType) => {
    const res = await fetch('/api/search/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': user?.id || 'usr-kamil-dadashov',
      },
      body: JSON.stringify({ packageType, origin: 'WEB' }),
    });
    const data = await res.json();
    setCurrentRun(data.run);
    setSearchRuns(prev => [data.run, ...prev]);
    return data.run;
  };

  const payAndExecuteSearch = async (runId: string, packageType: PackageType) => {
    setIsLoading(true);
    try {
      // 1. Process payment
      await fetch('/api/search/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || 'usr-kamil-dadashov',
        },
        body: JSON.stringify({ searchRunId: runId, packageType }),
      });

      // 2. Execute matching pipeline
      const execRes = await fetch(`/api/search/${runId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await execRes.json();
      setCurrentRun(data.run);
      setSearchRuns(prev => prev.map(r => r.id === data.run.id ? data.run : r));
      return data.run;
    } finally {
      setIsLoading(false);
    }
  };

  const dispatchApplications = async (runId: string, approvedMatchIds?: string[]) => {
    setIsLoading(true);
    try {
      const senderEmail = user?.emailConnection?.email || user?.email || 'kamildadashoff@gmail.com';
      const res = await fetch(`/api/search/${runId}/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderEmail, approvedMatchIds }),
      });
      const data = await res.json();
      await refreshAllData();
      return data.applications;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCoverLetter = async (runId: string, matchId: string, newLetter: string) => {
    const res = await fetch(`/api/search/${runId}/update-letter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchId, newLetter }),
    });
    const data = await res.json();
    if (currentRun && currentRun.matches) {
      setCurrentRun({
        ...currentRun,
        matches: currentRun.matches.map(m => m.id === matchId ? data.match : m),
      });
    }
  };

  const excludeMatch = async (runId: string, matchId: string, isExcluded: boolean) => {
    const res = await fetch(`/api/search/${runId}/exclude-match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchId, isExcluded }),
    });
    const data = await res.json();
    if (currentRun && currentRun.matches) {
      setCurrentRun({
        ...currentRun,
        matches: currentRun.matches.map(m => m.id === matchId ? data.match : m),
      });
    }
  };

  const updateOutcome = async (appId: string, outcome: ManualOutcome) => {
    const res = await fetch(`/api/applications/${appId}/outcome`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ outcome }),
    });
    const data = await res.json();
    setApplicationsList(prev => prev.map(a => a.id === appId ? data.application : a));
  };

  const simulateReply = async (appId: string, replyType: any, text?: string) => {
    const res = await fetch(`/api/applications/${appId}/simulate-reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ replyType, text }),
    });
    const data = await res.json();
    setApplicationsList(prev => prev.map(a => a.id === appId ? data.application : a));
    await refreshAllData();
  };

  const toggleSource = async (sourceName: string, enabled: boolean) => {
    const res = await fetch('/api/admin/sources/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceName, enabled }),
    });
    const data = await res.json();
    setSourcesHealth(data.sources);
  };

  return (
    <AppContext.Provider
      value={{
        locale,
        setLocale,
        t,
        user,
        profile,
        preferences,
        documents,
        vacancies,
        sourcesHealth,
        searchRuns,
        currentRun,
        applications,
        notifications,
        adminMetrics,
        activeView,
        setActiveView,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isTelegramBotOpen,
        setIsTelegramBotOpen,
        isTestsModalOpen,
        setIsTestsModalOpen,
        isLoading,
        loginWithEmail,
        loginWithGoogle,
        linkTelegram,
        connectEmail,
        disconnectEmail,
        uploadCV,
        updateProfile,
        updatePreferences,
        startSearchRun,
        payAndExecuteSearch,
        dispatchApplications,
        updateCoverLetter,
        excludeMatch,
        updateOutcome,
        simulateReply,
        toggleSource,
        refreshAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
