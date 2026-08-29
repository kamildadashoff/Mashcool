import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { PricingSection } from './components/PricingSection';
import { DashboardView } from './components/DashboardView';
import { VacanciesView } from './components/VacanciesView';
import { ApplicationsView } from './components/ApplicationsView';
import { RepliesView } from './components/RepliesView';
import { ProfileView } from './components/ProfileView';
import { PricingView } from './components/PricingView';
import { SettingsView } from './components/SettingsView';
import { AdminView } from './components/AdminView';
import { OnboardingModal } from './components/OnboardingModal';
import { TelegramBotDrawer } from './components/TelegramBotDrawer';
import { SystemTestsModal } from './components/SystemTestsModal';
import { 
  LayoutDashboard, Sparkles, Send, MessageSquare, 
  User, CreditCard, Settings, ShieldCheck, ArrowRight, Bot 
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeView, setActiveView, user, locale, t, applications } = useApp();

  const isPublicView = activeView === 'home' || activeView === 'how-it-works' || (activeView === 'pricing' && !user);

  const authTabs = [
    { id: 'dashboard', label: t.navigation.overview, icon: LayoutDashboard },
    { id: 'vacancies', label: t.navigation.vacancies, icon: Sparkles, badge: 'New' },
    { id: 'applications', label: t.navigation.applications, icon: Send, count: applications.totalSent },
    { id: 'replies', label: t.navigation.replies, icon: MessageSquare, count: applications.repliedCount, highlight: true },
    { id: 'profile', label: t.navigation.profile, icon: User },
    { id: 'pricing', label: t.navigation.pricing, icon: CreditCard },
    { id: 'settings', label: t.navigation.settings, icon: Settings },
    { id: 'admin', label: t.navigation.admin, icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBF9] text-[#121417] antialiased selection:bg-[#9ACD00]/30 selection:text-black">
      
      {/* Primary Navigation Bar */}
      <Navbar />

      {/* Authenticated Dashboard Secondary Header Sub-bar */}
      {user && !isPublicView && (
        <div className="border-b border-[#E5E7EB] bg-white sticky top-16 z-30 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center space-x-1 overflow-x-auto py-2.5 scrollbar-none">
              {authTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeView === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`auth-tab-${tab.id}`}
                    onClick={() => setActiveView(tab.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#121417] text-white shadow-xs'
                        : 'text-[#5E6573] hover:text-[#121417] hover:bg-[#F4F5EF]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#9ACD00]' : 'text-[#71717A]'}`} />
                    <span>{tab.label}</span>
                    
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                        tab.highlight ? 'bg-purple-100 text-purple-900' : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {tab.count}
                      </span>
                    )}

                    {tab.badge && !isActive && (
                      <span className="px-1.5 py-0.2 rounded-md bg-[#9ACD00]/20 text-[#5F7F00] text-[9px] font-black uppercase">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Public Views */}
        {activeView === 'home' && (
          <>
            <HeroSection />
            <HowItWorksSection />
            <PricingSection />
          </>
        )}
        {activeView === 'how-it-works' && (
          <div className="pt-6">
            <HowItWorksSection />
            <PricingSection />
          </div>
        )}
        
        {/* Authenticated / Functional Views */}
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'vacancies' && <VacanciesView />}
        {activeView === 'applications' && <ApplicationsView />}
        {activeView === 'replies' && <RepliesView />}
        {activeView === 'profile' && <ProfileView />}
        {activeView === 'pricing' && <PricingView />}
        {activeView === 'settings' && <SettingsView />}
        {activeView === 'admin' && <AdminView />}
      </main>

      {/* Global Modals & Drawers */}
      <OnboardingModal />
      <TelegramBotDrawer />
      <SystemTestsModal />

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
