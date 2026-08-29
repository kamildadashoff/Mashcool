import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileUp, SlidersHorizontal, Sparkles, FileText, Send, 
  CheckCircle2, ArrowRight, ShieldCheck, MailCheck 
} from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const { t, locale, setIsOnboardingOpen } = useApp();

  const stepIcons = [FileUp, SlidersHorizontal, Sparkles, FileText, Send];

  const stepsList = t?.howItWorks?.steps || [
    { step: 1, title: t?.howItWorks?.step1Title || 'CV-nizi yükləyin', description: t?.howItWorks?.step1Desc || 'PDF və ya Word formatında CV-nizi yükləyin.' },
    { step: 2, title: t?.howItWorks?.step2Title || 'Vakansiyaları axtarırıq', description: t?.howItWorks?.step2Desc || 'Platformaları bir mərkəzdən saniyələr içində skan edirik.' },
    { step: 3, title: t?.howItWorks?.step3Title || 'Uyğunu seçirik', description: t?.howItWorks?.step3Desc || 'Yalnız təcrübənizə 100% uyğun gələn real vakansiyaları seçirik.' },
    { step: 4, title: t?.howItWorks?.step4Title || 'Müraciətləri göndəririk', description: t?.howItWorks?.step4Desc || 'Hər vakansiya üçün fərdi müraciət məktubu hazırlanıb göndərilir.' },
    { step: 5, title: t?.howItWorks?.step5Title || 'Cavabları izləyirsiniz', description: t?.howItWorks?.step5Desc || 'Gələn müsahibə dəvətlərini şəxsi kabinetinizdə görürsünüz.' },
  ];

  return (
    <section id="how-it-works-section" className="py-20 bg-white border-y border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#9ACD00]/15 text-[#5F7F00] text-xs font-bold uppercase tracking-wider">
            <span>{locale === 'az' ? 'Sadə və Şəffaf Proses' : locale === 'ru' ? 'Простой и прозрачный процесс' : 'Simple & Transparent'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#121417] tracking-tight font-syne">
            {t?.howItWorks?.title || 'Necə işləyir?'}
          </h2>
          <p className="text-base sm:text-lg text-[#555C6B]">
            {t?.howItWorks?.subtitle || 'Cəmi 5 sadə addımda arzuladığınız iş müraciətləri göndərilir'}
          </p>
        </div>

        {/* 5-Step Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {stepsList.map((step, idx) => {
            const Icon = stepIcons[idx] || Sparkles;
            return (
              <div 
                key={step.step || idx}
                className="relative flex flex-col p-6 rounded-2xl bg-[#FBFBF9] border border-[#E5E7EB] hover:border-[#9ACD00] hover:shadow-md transition-all group"
              >
                {/* Step Number Pill */}
                <div className="flex items-center justify-between mb-4">
                  <span className="w-8 h-8 rounded-full bg-[#121417] text-white text-xs font-bold flex items-center justify-center font-syne group-hover:bg-[#84B000] transition-colors">
                    0{step.step || idx + 1}
                  </span>
                  <div className="p-2 rounded-xl bg-white border border-[#E0E2DA] text-[#121417]">
                    <Icon className="w-4 h-4 text-[#6B8E00]" />
                  </div>
                </div>

                {/* Step Title & Desc */}
                <h3 className="text-base font-bold text-[#121417] mb-2 leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs text-[#5E6573] leading-relaxed flex-1">
                  {step.description}
                </p>

                {/* Bottom line hint */}
                <div className="mt-4 pt-3 border-t border-[#EAEBE6] flex items-center space-x-1.5 text-[11px] text-[#6B8E00] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{locale === 'az' ? 'Dəqiq icra' : 'Verified'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Callout Banner */}
        <div className="mt-14 p-8 rounded-2xl bg-[#F5F6F1] border border-[#E0E2DA] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg font-bold text-[#121417] font-syne">
              {locale === 'az' ? 'İlk müraciət paketinizə başlamağa hazırsınız?' : 'Ready to start your first search?'}
            </h4>
            <p className="text-xs text-[#5E6573]">
              {locale === 'az' ? 'Cəmi 1 CV yükləməklə bütün Azərbaycan bazarını əhatə edin.' : 'Cover the entire Azerbaijan market with just 1 CV upload.'}
            </p>
          </div>
          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#121417] text-white font-bold text-sm hover:bg-black transition-all cursor-pointer shadow-sm"
          >
            <span>{t.common.startCta}</span>
            <ArrowRight className="w-4 h-4 text-[#9ACD00]" />
          </button>
        </div>

      </div>
    </section>
  );
};
