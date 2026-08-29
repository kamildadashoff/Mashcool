import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowRight, Sparkles, CheckCircle, ShieldCheck, 
  Search, Briefcase, FileText, Send, Building2 
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { t, locale, setIsOnboardingOpen, setActiveView } = useApp();

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28 bg-[#FBFBF9]">
      {/* Subtle background ambient glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#9ACD00]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#6840E8]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Value Proposition & Slogan */}
          <div className="lg:col-span-7 space-y-7">
            
            {/* Top Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#EAEBE5] border border-[#DCDFD5] text-[#2D333D] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#84B000] animate-pulse"></span>
              <span>{t.hero.uploadedNotice}</span>
            </div>

            {/* Slogan & Heading */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#121417] leading-[1.1] font-syne">
                {locale === 'az' ? (
                  <>
                    Karyeranız üçün <br />
                    <span className="relative inline-block text-[#121417]">
                      <span className="relative z-10 text-[#6B8E00] underline decoration-[#9ACD00] decoration-wavy decoration-2">İşinizlə məşğuluq.</span>
                    </span>
                  </>
                ) : locale === 'ru' ? (
                  <>
                    Для вашей карьеры, <br />
                    <span className="text-[#6B8E00]">Ваш поиск работы — наша работа.</span>
                  </>
                ) : (
                  <>
                    For your career, <br />
                    <span className="text-[#6B8E00]">Your job search is our job.</span>
                  </>
                )}
              </h1>
              <p className="text-lg sm:text-xl text-[#4A5160] font-normal leading-relaxed max-w-2xl pt-2">
                {t.hero.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
              <button
                id="hero-primary-cta"
                onClick={() => setIsOnboardingOpen(true)}
                className="inline-flex items-center justify-center space-x-3 px-7 py-4 rounded-xl text-base font-bold bg-[#9ACD00] text-[#0F172A] hover:bg-[#88B800] active:scale-98 transition-all shadow-md cursor-pointer"
              >
                <span>{t.common.startCta}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                id="hero-secondary-cta"
                onClick={() => {
                  const elem = document.getElementById('how-it-works-section');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center px-6 py-4 rounded-xl text-base font-semibold text-[#2C313A] bg-[#ECEEE8] hover:bg-[#E2E4DC] transition-colors cursor-pointer"
              >
                <span>{t.common.howItWorksCta}</span>
              </button>
            </div>

            {/* Supported Portals Line */}
            <div className="pt-4 border-t border-[#EAEBE6] flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#6B7280]">
              <span className="font-semibold text-[#121417]">{t.hero.sourcesMonitored}</span>
            </div>
          </div>

          {/* Right Column: Realistic Baku Professional Photo with Illustrative Live Scanner Overlay */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Photo Card Container */}
              <div className="relative rounded-2xl overflow-hidden border border-[#E0E2DA] shadow-xl bg-white aspect-[4/3]">
                <img
                  src="/src/assets/images/baku_professional_laptop_1788044427646.jpg"
                  alt="Modern Azerbaijani professional using laptop in Baku office"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
                
                {/* Photo Badge overlay */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/40 shadow-xs flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-xs font-bold text-[#121417]">{t.hero.liveScanner}</span>
                </div>
              </div>

              {/* Overlaid Illustrative Search Panel (per exact prompt specification) */}
              <div className="relative -mt-16 sm:-mt-20 mx-4 sm:mx-6 p-5 rounded-2xl bg-white/95 backdrop-blur-lg border border-[#D5D8CE] shadow-2xl space-y-4">
                
                <div className="flex items-center justify-between border-b border-[#EAEBE6] pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-lg bg-[#9ACD00]/20 text-[#6B8E00]">
                      <Search className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#121417]">
                        {locale === 'az' ? 'Axtarış tamamlandı' : locale === 'ru' ? 'Поиск завершен' : 'Search Completed'}
                      </h4>
                      <p className="text-[10px] text-[#6B7280]">
                        {locale === 'az' ? 'Bakı üzrə mərkəzləşdirilmiş skan' : 'Unified Baku market index'}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#9ACD00] text-[#0F172A]">
                    {locale === 'az' ? 'Aktiv' : 'Active'}
                  </span>
                </div>

                {/* Sources breakdown (exact numbers from prompt) */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-[#F6F7F3] border border-[#EAEBE6]">
                    <div className="text-[10px] font-medium text-[#5E6573]">JobSearch.az</div>
                    <div className="text-sm font-bold text-[#121417] mt-0.5">186</div>
                    <div className="text-[9px] text-[#71717A]">{locale === 'az' ? 'vakansiya' : 'jobs'}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F6F7F3] border border-[#EAEBE6]">
                    <div className="text-[10px] font-medium text-[#5E6573]">Boss.az</div>
                    <div className="text-sm font-bold text-[#121417] mt-0.5">124</div>
                    <div className="text-[9px] text-[#71717A]">{locale === 'az' ? 'vakansiya' : 'jobs'}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F6F7F3] border border-[#EAEBE6]">
                    <div className="text-[10px] font-medium text-[#5E6573]">Glorri.az</div>
                    <div className="text-sm font-bold text-[#121417] mt-0.5">97</div>
                    <div className="text-[9px] text-[#71717A]">{locale === 'az' ? 'vakansiya' : 'jobs'}</div>
                  </div>
                </div>

                {/* Summary Metrics */}
                <div className="flex items-center justify-between pt-1 px-1">
                  <div className="text-left">
                    <span className="text-xl font-extrabold text-[#121417] block font-syne">407</span>
                    <span className="text-[11px] text-[#6B7280] font-medium">{t.hero.statScanned}</span>
                  </div>
                  <div className="h-8 w-px bg-[#E5E7EB]" />
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-[#6B8E00] block font-syne">32</span>
                    <span className="text-[11px] text-[#6B7280] font-medium">{t.hero.statMatched}</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
