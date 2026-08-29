import React from 'react';
import { useApp } from '../context/AppContext';
import { PackageType } from '../types';
import { Check, Sparkles, Zap, ShieldCheck, HelpCircle } from 'lucide-react';

export const PricingSection: React.FC = () => {
  const { t, locale, setIsOnboardingOpen, startSearchRun, payAndExecuteSearch } = useApp();

  const handleSelectPackage = (pkg: PackageType) => {
    setIsOnboardingOpen(true);
  };

  return (
    <section id="pricing-section" className="py-20 bg-[#FBFBF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#9ACD00]/15 text-[#5F7F00] text-xs font-bold uppercase tracking-wider">
            <span>{locale === 'az' ? 'Şəffaf və Əlçatan Qiymətlər' : 'Accessible & Transparent Pricing'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#121417] tracking-tight font-syne">
            {t.pricing.title}
          </h2>
          <p className="text-base sm:text-lg text-[#555C6B]">
            {t.pricing.subtitle}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Card 1: JOB LUCK (5 AZN - Lime Accent) */}
          <div className="relative rounded-3xl bg-white border-2 border-[#9ACD00] p-8 sm:p-10 shadow-lg flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#9ACD00] text-[#0F172A] text-xs font-extrabold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
              {t?.pricing?.jobLuck?.badge || 'Optimal'}
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-extrabold text-[#121417] font-syne">
                  {t?.pricing?.jobLuck?.name || 'JOB LUCK'}
                </h3>
                <p className="text-xs text-[#5E6573] mt-1">
                  {locale === 'az' ? 'Aktiv iş axtarışına başlayanlar üçün optimal paket' : 'Ideal for starting focused job search'}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-2">
                <span className="text-5xl font-black text-[#121417] font-syne">5</span>
                <span className="text-xl font-bold text-[#6B7280]">AZN</span>
                <span className="text-xs text-[#84B000] font-semibold ml-2">/ {locale === 'az' ? 'axtarış' : 'search'}</span>
              </div>

              {/* Feature list */}
              <div className="space-y-3 pt-2">
                {(t?.pricing?.jobLuck?.features || [
                  '300-ə qədər vakansiya skan edilir',
                  '30-a qədər uyğun vakansiya seçilir',
                  '30-a qədər fərdi müraciət məktubu',
                  'Hər vakansiyaya özəl müraciət mətni',
                  'Müraciət tarixçəsi və analitika',
                ]).map((feature, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-[#2D333D]">
                    <div className="p-0.5 rounded-full bg-[#9ACD00]/20 text-[#6B8E00] mt-0.5 flex-shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-medium leading-snug">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="pt-8">
              <button
                id="pricing-job-luck-btn"
                onClick={() => handleSelectPackage('JOB_LUCK')}
                className="w-full py-4 rounded-xl text-base font-bold bg-[#9ACD00] text-[#0F172A] hover:bg-[#88B800] active:scale-98 transition-all shadow-md cursor-pointer"
              >
                {t?.pricing?.jobLuck?.cta || 'JOB LUCK ilə başla'}
              </button>
            </div>
          </div>

          {/* Card 2: JOB BLAST (8 AZN - Vivid Purple Accent) */}
          <div className="relative rounded-3xl bg-white border-2 border-[#7C3AED] p-8 sm:p-10 shadow-lg flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#7C3AED] text-white text-xs font-extrabold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
              {t?.pricing?.jobBlast?.badge || 'Maximum'}
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-extrabold text-[#121417] font-syne flex items-center space-x-2">
                  <span>{t?.pricing?.jobBlast?.name || 'JOB BLAST'}</span>
                  <Zap className="w-5 h-5 text-[#7C3AED]" />
                </h3>
                <p className="text-xs text-[#5E6573] mt-1">
                  {locale === 'az' ? 'Bütün bazarı dərindən əhatə edən intensiv müraciət' : 'Maximum market coverage and outreach'}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-2">
                <span className="text-5xl font-black text-[#121417] font-syne">8</span>
                <span className="text-xl font-bold text-[#6B7280]">AZN</span>
                <span className="text-xs text-[#7C3AED] font-semibold ml-2">/ {locale === 'az' ? 'axtarış' : 'search'}</span>
              </div>

              {/* Feature list */}
              <div className="space-y-3 pt-2">
                {(t?.pricing?.jobBlast?.features || [
                  '500-ə qədər vakansiya skan edilir',
                  '50-a qədər uyğun vakansiya seçilir',
                  '50-a qədər fərdi müraciət məktubu',
                  'Dərin AI uyğunluq təhlili',
                  'Genişləndirilmiş filtr və analitika',
                ]).map((feature, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-[#2D333D]">
                    <div className="p-0.5 rounded-full bg-[#7C3AED]/15 text-[#7C3AED] mt-0.5 flex-shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-medium leading-snug">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="pt-8">
              <button
                id="pricing-job-blast-btn"
                onClick={() => handleSelectPackage('JOB_BLAST')}
                className="w-full py-4 rounded-xl text-base font-bold bg-[#7C3AED] text-white hover:bg-[#6D28D9] active:scale-98 transition-all shadow-md cursor-pointer"
              >
                {t?.pricing?.jobBlast?.cta || 'JOB BLAST ilə başla'}
              </button>
            </div>
          </div>

        </div>

        {/* Precision Principle Notice Box */}
        <div className="mt-12 max-w-3xl mx-auto p-5 rounded-2xl bg-[#EFEFE9] border border-[#DCE0D4] flex items-start space-x-3.5 text-xs text-[#3E4552]">
          <ShieldCheck className="w-5 h-5 text-[#6B8E00] flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-bold text-[#121417]">
              {locale === 'az' ? 'Dəqiqlik Fəlsəfəsi (Precision Guarantee)' : 'Precision Guarantee'}
            </h5>
            <p className="leading-relaxed">
              {t.pricing.precisionNotice}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
