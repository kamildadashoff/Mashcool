import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Mail, MapPin, ExternalLink, Bot } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, locale, setIsTelegramBotOpen, setIsTestsModalOpen } = useApp();

  return (
    <footer className="border-t border-[#E5E7EB] bg-[#F7F7F4] text-[#4B5262] text-sm pt-14 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#E5E7EB]">
          
          {/* Col 1: Brand & Slogan */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-1 text-2xl font-extrabold tracking-tight">
              <span className="text-[#121417] font-syne">MASH</span>
              <span className="text-[#84B000] font-syne">COOL</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#84B000] ml-0.5 mt-2.5"></span>
            </div>
            <p className="text-base font-bold text-[#121417]">
              {t.common.heroSlogan}
            </p>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              {t.common.tagline}
            </p>
            <div className="flex items-center space-x-2 text-xs text-[#4B5563] pt-1">
              <MapPin className="w-3.5 h-3.5 text-[#84B000]" />
              <span>{t.common.bakuAzerbaijan}</span>
            </div>
          </div>

          {/* Col 2: Public Vacancy Sources */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#121417] mb-3">
              {locale === 'az' ? 'Dəstəklənən Mənbələr' : locale === 'ru' ? 'Источники вакансий' : 'Supported Sources'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center space-x-1.5 hover:text-[#121417]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#84B000]"></span>
                <span>JobSearch.az</span>
              </li>
              <li className="flex items-center space-x-1.5 hover:text-[#121417]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#84B000]"></span>
                <span>Boss.az</span>
              </li>
              <li className="flex items-center space-x-1.5 hover:text-[#121417]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#84B000]"></span>
                <span>jobs.glorri.az (Glorri)</span>
              </li>
              <li className="text-[#9CA3AF] text-[11px] pt-1">
                {locale === 'az' ? '+ LinkedIn & Rəsmi Karyera portalları' : '+ LinkedIn & Direct career portals'}
              </li>
            </ul>
          </div>

          {/* Col 3: Channels & Integrations */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#121417] mb-3">
              {locale === 'az' ? 'İnteqrasiyalar' : locale === 'ru' ? 'Интеграции' : 'Integrations'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setIsTelegramBotOpen(true)}
                  className="flex items-center space-x-1.5 text-[#0E7CB8] hover:underline cursor-pointer"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Telegram Bot (@mashcoolbot)</span>
                </button>
              </li>
              <li className="text-[#4B5262]">Google Gmail OAuth (Direct Send)</li>
              <li className="text-[#4B5262]">Microsoft Outlook / Graph API</li>
              <li>
                <button
                  onClick={() => setIsTestsModalOpen(true)}
                  className="text-xs font-semibold text-[#121417] hover:underline cursor-pointer flex items-center space-x-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.navigation.tests} (QA Suite)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Quality & Ethics */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#121417] mb-3">
              {locale === 'az' ? 'Məxfilik və Standartlar' : locale === 'ru' ? 'Стандарты качества' : 'Standards & Ethics'}
            </h4>
            <p className="text-xs text-[#6B7280] leading-relaxed mb-3">
              {t.pricing.precisionNotice}
            </p>
            <div className="flex items-center space-x-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1.5 rounded-md border border-emerald-100">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>{locale === 'az' ? 'Spam əleyhinə dəqiq müraciət zəmanəti' : 'No spam / Precision fit guarantee'}</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#71717A] space-y-3 sm:space-y-0">
          <p>© {new Date().getFullYear()} MASHCOOL. {t.common.allRightsReserved}</p>
          <div className="flex items-center space-x-5">
            <span className="hover:text-[#121417] cursor-pointer">{t.common.privacy}</span>
            <span className="hover:text-[#121417] cursor-pointer">{t.common.terms}</span>
            <span className="hover:text-[#121417] cursor-pointer">{t.common.contact}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
