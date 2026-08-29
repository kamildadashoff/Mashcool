import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Send, MailCheck, MessageSquare, Award, TrendingUp, 
  RotateCcw, Sparkles, AlertCircle, CheckCircle2, ArrowRight,
  ExternalLink, Mail, Bot, Zap, Clock
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    user, profile, preferences, currentRun, searchRuns, 
    applications, locale, t, setActiveView, setIsOnboardingOpen,
    setIsTelegramBotOpen, connectEmail, disconnectEmail
  } = useApp();

  const isEmailConnected = Boolean(user?.emailConnection?.active);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Greeting & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#E0E2DA] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B8E00]">
              {t.dashboard.title}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#121417] font-syne">
            {locale === 'az' ? `Salam, ${user?.name || 'Kamil'}!` : `Welcome back, ${user?.name || 'Kamil'}!`}
          </h1>
          <p className="text-xs sm:text-sm text-[#5E6573]">
            {locale === 'az' 
              ? 'Müraciətlərinizin cari vəziyyəti və daxil olan cavabların canlı monitorinqi.' 
              : 'Real-time monitoring of your automated applications and employer replies.'}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-3">
          <button
            id="dash-new-search-btn"
            onClick={() => setIsOnboardingOpen(true)}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#9ACD00] text-[#0F172A] font-bold text-xs hover:bg-[#88B800] transition-all shadow-xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.dashboard.newSearch}</span>
          </button>
        </div>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1: Total Sent */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#5E6573]">
            <span className="text-xs font-semibold">{t.dashboard.totalApplications}</span>
            <div className="p-1.5 rounded-lg bg-[#9ACD00]/15 text-[#6B8E00]">
              <Send className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#121417] font-syne">
            {applications.totalSent}
          </div>
          <div className="text-[11px] text-[#6B7280]">
            {locale === 'az' ? 'Dəqiq müraciət' : 'Verified outreach'}
          </div>
        </div>

        {/* Metric 2: Replies */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#5E6573]">
            <span className="text-xs font-semibold">{t.dashboard.activeReplies}</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#121417] font-syne">
            {applications.repliedCount}
          </div>
          <div className="text-[11px] text-blue-600 font-medium">
            {locale === 'az' ? 'Canlı şirkət cavabı' : 'Direct replies'}
          </div>
        </div>

        {/* Metric 3: Interviews */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#5E6573]">
            <span className="text-xs font-semibold">{t.dashboard.interviews}</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#121417] font-syne">
            {applications.interviewCount}
          </div>
          <div className="text-[11px] text-purple-600 font-medium">
            {locale === 'az' ? 'Müsahibə dəvəti' : 'Interview invites'}
          </div>
        </div>

        {/* Metric 4: Offers */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#5E6573]">
            <span className="text-xs font-semibold">{t.dashboard.offers}</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#121417] font-syne">
            {applications.offerCount}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">
            {locale === 'az' ? 'Rəsmi iş təklifi' : 'Offers received'}
          </div>
        </div>

        {/* Metric 5: Reply Rate */}
        <div className="col-span-2 lg:col-span-1 p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#5E6573]">
            <span className="text-xs font-semibold">{t.dashboard.responseRate}</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#121417] font-syne">
            {applications.replyRate}%
          </div>
          <div className="text-[11px] text-amber-700 font-medium">
            {locale === 'az' ? 'Ortalama 14 saatda' : 'Avg 14h latency'}
          </div>
        </div>
      </div>

      {/* Email Connection Banner */}
      <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className={`p-2.5 rounded-xl ${isEmailConnected ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-[#121417]">
                {locale === 'az' ? 'Müraciət E-poçtu Bağlantısı:' : 'Direct Email Connection:'}
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                isEmailConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {isEmailConnected ? 'Qoşulub (Gmail Direct)' : 'Qoşulmayıb'}
              </span>
            </div>
            <p className="text-xs text-[#6B7280] mt-0.5">
              {isEmailConnected
                ? `${user?.emailConnection?.email || user?.email} vasitəsilə birbaşa işəgötürənlərə göndərilir.`
                : 'Müraciətlərin öz e-poçtunuzdan getməsi üçün Gmail və ya Outlook hesabınızı qoşun.'}
            </p>
          </div>
        </div>

        {isEmailConnected ? (
          <button
            onClick={() => disconnectEmail()}
            className="px-3.5 py-1.5 rounded-lg border border-[#E5E7EB] text-xs font-semibold text-[#5E6573] hover:bg-[#F4F5EF] cursor-pointer"
          >
            {locale === 'az' ? 'Ayır' : 'Disconnect'}
          </button>
        ) : (
          <button
            onClick={() => connectEmail('GMAIL', user?.email || 'kamildadashoff@gmail.com')}
            className="px-4 py-2 rounded-xl bg-[#121417] text-white text-xs font-bold hover:bg-black cursor-pointer shadow-xs"
          >
            {locale === 'az' ? 'Gmail Qoş' : 'Connect Gmail'}
          </button>
        )}
      </div>

      {/* Main Grid: Left Recent Applications, Right Repeat Search / Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Recent Applications Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#121417] font-syne">
              {locale === 'az' ? 'Son Göndərilən Müraciətlər' : 'Recent Applications'}
            </h3>
            <button
              onClick={() => setActiveView('applications')}
              className="text-xs font-bold text-[#6B8E00] hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>{locale === 'az' ? 'Hamısına bax' : 'View all'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {(applications?.list || []).slice(0, 4).map((app) => (
              <div 
                key={app.id}
                className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#9ACD00] transition-colors"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#F4F5EF] border border-[#E0E2DA] flex items-center justify-center font-bold text-xs text-[#121417] flex-shrink-0">
                    {app.vacancy.companyName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#121417]">
                      {app.vacancy.titleNormalized}
                    </h4>
                    <p className="text-xs text-[#6B7280]">
                      {app.vacancy.companyName} • {app.vacancy.source}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-center">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    app.replyStatus === 'INTERVIEW'
                      ? 'bg-purple-100 text-purple-800'
                      : app.replyStatus === 'POSITIVE_REPLY'
                        ? 'bg-blue-100 text-blue-800'
                        : app.replyStatus === 'AUTOMATIC_REPLY'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {app.replyStatus === 'INTERVIEW' ? 'Müsahibə Dəvəti' :
                     app.replyStatus === 'POSITIVE_REPLY' ? 'Müsbət Cavab' :
                     app.replyStatus === 'AUTOMATIC_REPLY' ? 'Avtomatik Qeyd' :
                     'Göndərildi'}
                  </span>

                  <button
                    onClick={() => setActiveView('replies')}
                    className="p-1.5 rounded-lg text-[#71717A] hover:text-[#121417] hover:bg-[#F4F5EF] cursor-pointer"
                    title="Cavabı gör"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Quick Repeat Search & Telegram Sync Card */}
        <div className="space-y-6">
          
          {/* Repeat Search Card */}
          <div className="p-6 rounded-3xl bg-[#F6F7F2] border border-[#E0E2DA] space-y-4">
            <div className="flex items-center space-x-2 text-[#6B8E00]">
              <RotateCcw className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {locale === 'az' ? 'Təkrar Axtarış Zəmanəti' : 'Repeat Search Protection'}
              </span>
            </div>

            <h4 className="text-base font-bold text-[#121417] font-syne">
              {locale === 'az' ? 'Yeni vakansiyaları yoxlayın' : 'Scan for new listings'}
            </h4>

            <p className="text-xs text-[#5E6573] leading-relaxed">
              {locale === 'az'
                ? 'Təkrar axtarış zamanı əvvəl müraciət edilmiş vakansiyalar avtomatik qara siyahıya alınır və təkrarlanmır.'
                : 'Repeat searches automatically exclude previously applied vacancies to maintain pristine outreach.'}
            </p>

            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="w-full py-3 rounded-xl bg-[#121417] text-white text-xs font-bold hover:bg-black transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
            >
              <span>{t.dashboard.repeatSearch}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#9ACD00]" />
            </button>
          </div>

          {/* Telegram Bot Card */}
          <div className="p-6 rounded-3xl bg-[#F0F8FF] border border-[#CDE5FA] space-y-4">
            <div className="flex items-center space-x-2 text-[#0E7CB8]">
              <Bot className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {locale === 'az' ? 'Telegram Bot Sinxronizasiyası' : 'Telegram Bot Sync'}
              </span>
            </div>

            <h4 className="text-base font-bold text-[#121417] font-syne">
              @mashcoolbot
            </h4>

            <p className="text-xs text-[#4E6275] leading-relaxed">
              {locale === 'az'
                ? 'Telefonunuzdan birbaşa bildirişlər alın, yeni axtarış başladın və gələn müsahibə təkliflərini anında görün.'
                : 'Receive instant Telegram notifications and start searches directly from your mobile.'}
            </p>

            <button
              onClick={() => setIsTelegramBotOpen(true)}
              className="w-full py-2.5 rounded-xl bg-[#2CA5E0] text-white text-xs font-bold hover:bg-[#1E94CF] transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
            >
              <span>{locale === 'az' ? 'Bot Simulyatorunu Aç' : 'Open Bot Simulator'}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
