import React from 'react';
import { useApp } from '../context/AppContext';
import { Locale } from '../types';
import { 
  Mail, Bot, Globe, ShieldCheck, CheckCircle2, 
  ExternalLink, LogOut, Check 
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { 
    user, locale, setLocale, connectEmail, disconnectEmail, 
    setIsTelegramBotOpen, locale: currentLocale, t 
  } = useApp();

  const isEmailConnected = Boolean(user?.emailConnection?.active);
  const isTelegramLinked = user?.identities.some(i => i.provider === 'TELEGRAM');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E0E2DA] shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-[#6B8E00]">
          {t.settings.title}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#121417] font-syne mt-1">
          {locale === 'az' ? 'Hesab və Əlaqə Tənzimləmələri' : 'Account & Channel Settings'}
        </h1>
        <p className="text-xs sm:text-sm text-[#5E6573]">
          {locale === 'az' 
            ? 'E-poçt provayderləri, Telegram botu və dil seçimlərinizi idarə edin.'
            : 'Manage direct email sending permissions, Telegram sync, and preferences.'}
        </p>
      </div>

      {/* Section 1: Email Integrations */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E0E2DA] shadow-xs space-y-5">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#121417] font-syne">
              {t.settings.connectedEmail}
            </h3>
            <p className="text-xs text-[#5E6573]">
              {locale === 'az'
                ? 'Müraciətlər bu e-poçt vasitəsilə işəgötürənlərə birbaşa sizin adınızdan göndərilir.'
                : 'Direct applicant sender account for all outgoing cover letters and attachments.'}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#FBFBF9] border border-[#EAEBE6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-[#121417]">
                Google Gmail Direct
              </span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                isEmailConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
              }`}>
                {isEmailConnected ? 'Aktiv / Bağlıdır' : 'Qoşulmayıb'}
              </span>
            </div>
            <p className="text-xs text-[#6B7280]">
              {isEmailConnected ? user?.emailConnection?.email : 'Hesab qoşulmayıb'}
            </p>
          </div>

          {isEmailConnected ? (
            <button
              onClick={() => disconnectEmail()}
              className="px-3.5 py-1.5 rounded-lg border border-[#E5E7EB] text-xs font-bold text-[#5E6573] hover:bg-[#F2F3EF] cursor-pointer"
            >
              Bağlantını Kəs
            </button>
          ) : (
            <button
              onClick={() => connectEmail('GMAIL', user?.email || 'kamildadashoff@gmail.com')}
              className="px-4 py-2 rounded-xl bg-[#121417] text-white text-xs font-bold hover:bg-black cursor-pointer shadow-xs"
            >
              Gmail Qoş
            </button>
          )}
        </div>
      </div>

      {/* Section 2: Telegram Bot Linking */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E0E2DA] shadow-xs space-y-5">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-[#2CA5E0]/15 text-[#0E7CB8]">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#121417] font-syne">
              {locale === 'az' ? 'Telegram Bot Əlaqəsi' : 'Telegram Bot Connection'}
            </h3>
            <p className="text-xs text-[#5E6573]">
              @mashcoolbot üzərindən axtarışları idarə edin və ani müsahibə bildirişləri alın.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#FBFBF9] border border-[#EAEBE6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-[#121417]">@kamil_dadashoff</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Sinxronlaşdırılıb
              </span>
            </div>
            <p className="text-xs text-[#6B7280]">
              Telegram ID: 98412034 • Vahid Profil Baza
            </p>
          </div>

          <button
            onClick={() => setIsTelegramBotOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#2CA5E0] text-white text-xs font-bold hover:bg-[#1E94CF] cursor-pointer shadow-xs flex items-center space-x-1.5"
          >
            <span>Simulyatorda Yoxla</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Section 3: Interface Language */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E0E2DA] shadow-xs space-y-5">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-[#F4F5EF] text-[#6B8E00]">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#121417] font-syne">
              {t.settings.interfaceLanguage}
            </h3>
            <p className="text-xs text-[#5E6573]">
              Sistem və bildirişlərin əsas dili.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'az' as Locale, label: 'Azərbaycan dili (AZ)' },
            { id: 'en' as Locale, label: 'English (EN)' },
            { id: 'ru' as Locale, label: 'Русский (RU)' },
          ].map(l => (
            <button
              key={l.id}
              onClick={() => setLocale(l.id)}
              className={`p-3.5 rounded-2xl border text-xs font-bold text-left transition-all cursor-pointer ${
                currentLocale === l.id
                  ? 'border-[#84B000] bg-[#9ACD00]/15 text-[#121417]'
                  : 'border-[#E0E2DA] hover:bg-[#F8F9F5] text-[#555C6B]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{l.label}</span>
                {currentLocale === l.id && <Check className="w-4 h-4 text-[#84B000]" />}
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
