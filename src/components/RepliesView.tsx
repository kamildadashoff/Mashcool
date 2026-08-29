import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Application, ManualOutcome } from '../types';
import { 
  MessageSquare, Award, CheckCircle2, PhoneCall, Smartphone, 
  Sparkles, RefreshCw, Clock, AlertCircle, Send, Check 
} from 'lucide-react';

export const RepliesView: React.FC = () => {
  const { applications, updateOutcome, simulateReply, locale, t } = useApp();
  const [selectedApp, setSelectedApp] = useState<Application | null>(
    applications.list.find(a => a.replyStatus !== 'PENDING') || applications.list[0] || null
  );

  const [activeTab, setActiveTab] = useState<'ALL' | 'INTERVIEW' | 'POSITIVE' | 'AUTO'>('ALL');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const repliesList = applications.list.filter(a => {
    if (activeTab === 'INTERVIEW') return a.replyStatus === 'INTERVIEW';
    if (activeTab === 'POSITIVE') return a.replyStatus === 'POSITIVE_REPLY';
    if (activeTab === 'AUTO') return a.replyStatus === 'AUTOMATIC_REPLY';
    return a.replyStatus !== 'PENDING';
  });

  const handleManualOutcomeChange = async (appId: string, outcome: ManualOutcome) => {
    await updateOutcome(appId, outcome);
  };

  const handleSimulateNewInterview = async () => {
    if (!selectedApp) return;
    setIsSimulating(true);
    try {
      await simulateReply(
        selectedApp.id, 
        'INTERVIEW', 
        `Salam Kamil bəy! ${selectedApp.vacancy.companyName} rəhbərliyi sizin CV və portfelinizi nəzərdən keçirdi. Sizi ${selectedApp.vacancy.titleNormalized} vəzifəsi üzrə əsas mərhələ müsahibəsinə dəvət edirik.`
      );
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E0E2DA] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#6B8E00]">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{locale === 'az' ? 'Cavab İzləmə Mərkəzi' : 'Reply & Response Tracker'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#121417] font-syne mt-1">
            {locale === 'az' ? 'Gələn Cavablar və Nəticələr' : 'Employer Responses & Outbox'}
          </h1>
          <p className="text-xs sm:text-sm text-[#5E6573]">
            {locale === 'az'
              ? 'Şirkətlərdən daxil olan e-poçt cavabları avtomatik təhlil edilir və sinifləndirilir.'
              : 'Automated classification of inbound employer emails, interview requests, and offers.'}
          </p>
        </div>

        {/* Live Simulation Action */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSimulateNewInterview}
            disabled={!selectedApp || isSimulating}
            className="px-4 py-2.5 rounded-xl bg-[#F0F4E8] border border-[#D5D8CE] text-[#5F7F00] text-xs font-bold hover:bg-[#E5EBD8] transition-colors flex items-center space-x-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSimulating ? 'Simulyasiya edilir...' : (locale === 'az' ? 'Canlı Müsahibə Cavabı Simulyasiyası' : 'Simulate Reply QA')}</span>
          </button>
        </div>
      </div>

      {/* Response Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-1">
          <span className="text-xs text-[#71717A] font-medium">Cavab Sürəti (Median)</span>
          <div className="text-2xl font-bold text-[#121417] font-syne">14.2 saat</div>
          <span className="text-[11px] text-emerald-600 font-semibold">Bazar normasından 2.8x daha tez</span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-1">
          <span className="text-xs text-[#71717A] font-medium">Müsbət Cavab Faizi</span>
          <div className="text-2xl font-bold text-[#121417] font-syne">
            {applications.totalSent > 0 ? Math.round((applications.repliedCount / applications.totalSent) * 100) : 0}%
          </div>
          <span className="text-[11px] text-[#6B8E00] font-semibold">Dəqiq müraciət effektivliyi</span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-1">
          <span className="text-xs text-[#71717A] font-medium">Müsahibə Dəvətləri</span>
          <div className="text-2xl font-bold text-[#121417] font-syne">{applications.interviewCount} dəvət</div>
          <span className="text-[11px] text-purple-600 font-semibold">Birbaşa işəgötürən tərəfindən</span>
        </div>
      </div>

      {/* Main 2-Col Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col (5 cols): Reply threads list */}
        <div className="lg:col-span-5 space-y-4">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-[#EFEFEA] rounded-xl border border-[#E0E2DA]">
            {[
              { id: 'ALL', label: `Hamısı (${repliesList.length})` },
              { id: 'INTERVIEW', label: `Müsahibə (${applications.interviewCount})` },
              { id: 'POSITIVE', label: 'Müsbət' },
              { id: 'AUTO', label: 'Avtomatik' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-white text-[#121417] shadow-xs'
                    : 'text-[#6B7280] hover:text-[#121417]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
            {repliesList.map(app => {
              const isSelected = selectedApp?.id === app.id;
              return (
                <button
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#84B000] bg-white shadow-sm ring-1 ring-[#84B000]'
                      : 'border-[#E5E7EB] bg-white hover:border-[#CCD0C2]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-[#121417] leading-snug">
                        {app.vacancy.companyName}
                      </h4>
                      <p className="text-xs text-[#5E6573]">
                        {app.vacancy.titleNormalized}
                      </p>
                    </div>

                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      app.replyStatus === 'INTERVIEW'
                        ? 'bg-purple-100 text-purple-800'
                        : app.replyStatus === 'POSITIVE_REPLY'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-700'
                    }`}>
                      {app.replyStatus === 'INTERVIEW' ? 'Müsahibə' :
                       app.replyStatus === 'POSITIVE_REPLY' ? 'Müsbət' : 'Avto'}
                    </span>
                  </div>

                  <p className="text-xs text-[#4B5262] mt-2 line-clamp-2 italic bg-[#FBFBF9] p-2 rounded-lg border border-[#EAEBE6]">
                    "{app.replyText || 'Cavab qeydə alınıb.'}"
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-[#F2F3EF] flex items-center justify-between text-[11px] text-[#71717A]">
                    <span>{app.repliedAt ? new Date(app.repliedAt).toLocaleDateString('az-AZ') : 'Son cavab'}</span>
                    <span className="font-semibold text-[#84B000]">{app.recipientEmail}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Col (7 cols): Reply details & Manual Outcome Logger */}
        <div className="lg:col-span-7">
          {selectedApp ? (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E0E2DA] shadow-xs space-y-6">
              
              {/* Header */}
              <div className="flex items-start justify-between border-b border-[#EAEBE6] pb-5">
                <div>
                  <span className="text-xs font-bold text-[#6B8E00] uppercase tracking-wider">
                    {selectedApp.vacancy.companyName}
                  </span>
                  <h3 className="text-xl font-extrabold text-[#121417] font-syne mt-0.5">
                    {selectedApp.vacancy.titleNormalized}
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    Müraciət göndərildi: {new Date(selectedApp.sentAt || Date.now()).toLocaleDateString('az-AZ')}
                  </p>
                </div>

                <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                  selectedApp.replyStatus === 'INTERVIEW'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {selectedApp.replyStatus === 'INTERVIEW' ? 'Müsahibə Dəvəti' : 'Müsbət Cavab'}
                </span>
              </div>

              {/* Employer's Reply Message Body */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#121417]">
                  {locale === 'az' ? 'İşəgötürənin Cavab Mətni' : 'Inbound Reply Message'}
                </h4>
                <div className="p-4 rounded-2xl bg-[#F6F7F2] border border-[#E0E2DA] text-xs text-[#121417] leading-relaxed whitespace-pre-wrap font-medium">
                  {selectedApp.replyText || 'Cavab daxil olub.'}
                </div>
              </div>

              {/* Manual Outcome Logger (Phone / WhatsApp logging) */}
              <div className="p-5 rounded-2xl bg-[#FAFBF7] border border-[#EAEBE6] space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-[#121417]">
                    {locale === 'az' ? 'Telefon və ya WhatsApp Əlaqəsi Qeydi' : 'Log Phone / WhatsApp Outcome'}
                  </h4>
                  <p className="text-[11px] text-[#6B7280]">
                    {locale === 'az' 
                      ? 'Əgər işəgötürən sizə birbaşa zəng edibsə və ya WhatsApp ilə yazıbsa, nəticəni qeyd edin.'
                      : 'Log off-platform communication.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                  {[
                    { id: 'PHONE_CALL', label: 'Zəng etdilər', icon: PhoneCall },
                    { id: 'WHATSAPP', label: 'WhatsApp yazdılar', icon: Smartphone },
                    { id: 'INTERVIEW', label: 'Müsahibə təyin olundu', icon: Award },
                    { id: 'OFFER', label: 'İş təklifi verildi', icon: CheckCircle2 },
                    { id: 'REJECTED', label: 'İmtina edildi', icon: AlertCircle },
                  ].map(item => {
                    const isSelected = selectedApp.manualOutcome === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleManualOutcomeChange(selectedApp.id, item.id as ManualOutcome)}
                        className={`p-2.5 rounded-xl text-xs font-bold border flex items-center space-x-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#84B000] bg-[#9ACD00]/15 text-[#121417]'
                            : 'border-[#E0E2DA] bg-white hover:bg-[#F2F3EF] text-[#4E5664]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 text-[#6B8E00]" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-[#E0E2DA] text-center text-[#71717A] text-xs">
              Cavabları görmək üçün sol siyahıdan müraciət seçin.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
