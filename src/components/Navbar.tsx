import React from 'react';
import { useApp } from '../context/AppContext';
import { Locale } from '../types';
import { 
  Bot, Globe, UserCheck, ArrowRight, LayoutDashboard, 
  CheckCircle2, Sparkles, LogOut, Menu, X, ShieldCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    locale, setLocale, t, user, activeView, setActiveView, 
    setIsOnboardingOpen, setIsTelegramBotOpen, setIsTestsModalOpen,
    loginWithGoogle 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { id: 'home', label: locale === 'az' ? 'Əsas səhifə' : locale === 'ru' ? 'Главная' : 'Home', publicOnly: true },
    { id: 'how-it-works', label: t.howItWorks.title, publicOnly: true },
    { id: 'pricing', label: t.common.viewPricing, publicOnly: true },
    { id: 'tests', label: t.navigation.tests, action: () => setIsTestsModalOpen(true) },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E5E7EB]/80 bg-[#FBFBF9]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-6">
          <button 
            id="nav-brand-logo"
            onClick={() => setActiveView('home')}
            className="flex items-center tracking-tight text-2xl font-extrabold focus:outline-none group cursor-pointer"
          >
            <span className="text-[#121417] font-syne group-hover:text-black transition-colors">MASH</span>
            <span className="text-[#84B000] font-syne group-hover:text-[#9ACD00] transition-colors">COOL</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#84B000] ml-0.5 mt-2.5"></span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => {
                  if (link.action) {
                    link.action();
                  } else {
                    setActiveView(link.id);
                  }
                }}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  activeView === link.id
                    ? 'text-[#121417] bg-[#EAEBE6]'
                    : 'text-[#5E6470] hover:text-[#121417] hover:bg-[#F2F3EF]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Section: Actions & Profile */}
        <div className="flex items-center space-x-3">
          
          {/* Telegram Bot Indicator Button */}
          <button
            id="nav-telegram-bot-button"
            onClick={() => setIsTelegramBotOpen(true)}
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#38A4E1]/30 bg-[#2CA5E0]/10 text-[#0E7CB8] hover:bg-[#2CA5E0]/20 text-xs font-semibold transition-colors cursor-pointer"
            title="MASHCOOL Telegram Botu (@mashcoolbot)"
          >
            <Bot className="w-3.5 h-3.5 text-[#2CA5E0]" />
            <span>@mashcoolbot</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </button>

          {/* Language Switcher */}
          <div className="relative flex items-center bg-[#EFEFEA] p-0.5 rounded-lg border border-[#E0E2DA]">
            {(['az', 'en', 'ru'] as Locale[]).map((l) => (
              <button
                key={l}
                id={`lang-switcher-${l}`}
                onClick={() => setLocale(l)}
                className={`px-2.5 py-1 text-xs font-bold uppercase rounded-md transition-all cursor-pointer ${
                  locale === l
                    ? 'bg-white text-[#121417] shadow-xs'
                    : 'text-[#707684] hover:text-[#121417]'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Primary CTA / Dashboard Switch */}
          {user ? (
            <div className="flex items-center space-x-2">
              <button
                id="nav-dashboard-button"
                onClick={() => setActiveView(activeView === 'home' ? 'dashboard' : 'home')}
                className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  activeView !== 'home'
                    ? 'bg-[#121417] text-white hover:bg-black shadow-xs'
                    : 'bg-[#9ACD00] text-[#0F172A] hover:bg-[#88B800] shadow-xs'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{activeView === 'home' ? t.navigation.overview : (locale === 'az' ? 'Sayta qayıt' : 'Public Site')}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                id="nav-login-google-btn"
                onClick={loginWithGoogle}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[#444A54] hover:text-[#121417] hover:bg-[#EFEFEA] transition-colors cursor-pointer"
              >
                <span>{t.common.login}</span>
              </button>
              <button
                id="nav-start-onboarding-btn"
                onClick={() => setIsOnboardingOpen(true)}
                className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-sm font-bold bg-[#9ACD00] text-[#0F172A] hover:bg-[#88B800] transition-colors shadow-xs cursor-pointer"
              >
                <span>{t.common.startCta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-[#5E6470] hover:text-[#121417] hover:bg-[#EFEFEA]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E7EB] bg-[#FBFBF9] px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                if (link.action) {
                  link.action();
                } else {
                  setActiveView(link.id);
                }
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#121417] hover:bg-[#F2F3EF]"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-[#EAEBE6]">
            <button
              onClick={() => {
                setIsTelegramBotOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-[#0E7CB8] bg-[#2CA5E0]/10"
            >
              <Bot className="w-4 h-4" />
              <span>@mashcoolbot İnteraktiv Simulyator</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
