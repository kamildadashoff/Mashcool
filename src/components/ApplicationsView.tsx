import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Application, ApplicationStatus } from '../types';
import { 
  Send, MailCheck, Clock, CheckCircle2, MessageSquare, 
  ExternalLink, Search, Filter, FileText, ChevronRight 
} from 'lucide-react';

export const ApplicationsView: React.FC = () => {
  const { applications, locale, t, setActiveView } = useApp();
  const [selectedApp, setSelectedApp] = useState<Application | null>(applications.list[0] || null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredApps = applications.list.filter(app => {
    if (statusFilter === 'SENT') return app.status === 'SENT';
    if (statusFilter === 'REPLIED') return app.replyStatus !== 'PENDING';
    if (statusFilter === 'INTERVIEW') return app.replyStatus === 'INTERVIEW';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E0E2DA] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#6B8E00]">
            <Send className="w-3.5 h-3.5" />
            <span>{locale === 'az' ? 'Müraciət Tarixçəsi' : 'Application History'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#121417] font-syne mt-1">
            {locale === 'az' ? 'Göndərilmiş Müraciətlər' : 'Outbox & Delivery Logs'}
          </h1>
          <p className="text-xs sm:text-sm text-[#5E6573]">
            {locale === 'az'
              ? 'MASHCOOL tərəfindən göndərilmiş bütün rəsmi e-poçt müraciətləri və çatdırılma vəziyyəti.'
              : 'All dispatched applications and automated deliverability records.'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveView('replies')}
            className="px-4 py-2 rounded-xl bg-[#F0F4E8] text-[#5F7F00] font-bold text-xs hover:bg-[#E5EBD8] transition-colors cursor-pointer flex items-center space-x-1.5"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{locale === 'az' ? 'Gələn Cavablar Qutusunu Aç' : 'View Replies Inbox'}</span>
          </button>
        </div>
      </div>

      {/* 2-Column Split: Applications List on Left, Inspection Pane on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col (5 cols): Filter & List */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Status Filter Buttons */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-[#EFEFEA] rounded-xl border border-[#E0E2DA]">
            {[
              { id: 'ALL', label: locale === 'az' ? `Hamısı (${applications.list.length})` : 'All' },
              { id: 'SENT', label: locale === 'az' ? 'Göndərildi' : 'Sent' },
              { id: 'REPLIED', label: locale === 'az' ? `Cavab (${applications.repliedCount})` : 'Replies' },
              { id: 'INTERVIEW', label: locale === 'az' ? `Müsahibə (${applications.interviewCount})` : 'Interviews' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-white text-[#121417] shadow-xs'
                    : 'text-[#6B7280] hover:text-[#121417]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* List items */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredApps.map(app => {
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
                      <span className="text-[10px] font-bold text-[#6B8E00] uppercase tracking-wider">
                        {app.vacancy.source}
                      </span>
                      <h4 className="text-sm font-bold text-[#121417] leading-snug">
                        {app.vacancy.titleNormalized}
                      </h4>
                      <p className="text-xs text-[#5E6573]">
                        {app.vacancy.companyName}
                      </p>
                    </div>

                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      app.replyStatus === 'INTERVIEW'
                        ? 'bg-purple-100 text-purple-800'
                        : app.replyStatus === 'POSITIVE_REPLY'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {app.replyStatus === 'INTERVIEW' ? 'Müsahibə' :
                       app.replyStatus === 'POSITIVE_REPLY' ? 'Müsbət' : 'Göndərildi'}
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#F2F3EF] flex items-center justify-between text-[11px] text-[#71717A]">
                    <span>{new Date(app.sentAt || Date.now()).toLocaleDateString('az-AZ')}</span>
                    <span className="font-semibold text-[#121417]">{app.matchScore}% Fit</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Col (7 cols): Selected Application Inspector */}
        <div className="lg:col-span-7">
          {selectedApp ? (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E0E2DA] shadow-xs space-y-6">
              
              {/* Top metadata */}
              <div className="flex items-start justify-between border-b border-[#EAEBE6] pb-5">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#9ACD00]/20 text-[#5F7F00] text-xs font-bold">
                      {selectedApp.matchScore}% Uyğunluq
                    </span>
                    <span className="text-xs text-[#71717A]">•</span>
                    <span className="text-xs text-[#71717A]">{selectedApp.vacancy.location}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-[#121417] font-syne mt-1">
                    {selectedApp.vacancy.titleNormalized}
                  </h3>
                  <p className="text-xs font-semibold text-[#4B5262]">
                    {selectedApp.vacancy.companyName}
                  </p>
                </div>

                <div className="text-right text-xs">
                  <span className="text-[#71717A] block">Çatdırılma:</span>
                  <span className="font-bold text-emerald-700 flex items-center justify-end space-x-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Uğurlu (Delivered)</span>
                  </span>
                </div>
              </div>

              {/* Email details box */}
              <div className="p-4 rounded-2xl bg-[#F9FAF7] border border-[#EAEBE6] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#71717A]">Mövzu:</span>
                  <span className="font-bold text-[#121417]">{selectedApp.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#71717A]">Göndərən:</span>
                  <span className="font-mono text-[#121417]">{selectedApp.senderEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#71717A]">Alıcı:</span>
                  <span className="font-mono text-[#121417]">{selectedApp.recipientEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#71717A]">Tarix:</span>
                  <span>{new Date(selectedApp.sentAt || Date.now()).toLocaleString('az-AZ')}</span>
                </div>
              </div>

              {/* Cover letter body */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#121417]">
                  {locale === 'az' ? 'Göndərilmiş Məktub Mətni' : 'Sent Application Letter'}
                </h4>
                <div className="p-4 rounded-2xl bg-[#F6F7F2] border border-[#E0E2DA] text-xs text-[#2D333D] whitespace-pre-wrap leading-relaxed">
                  {selectedApp.coverLetter}
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveView('replies')}
                  className="px-5 py-2.5 rounded-xl bg-[#121417] text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer flex items-center space-x-2"
                >
                  <span>{locale === 'az' ? 'Cavab Qovluğuna Keç' : 'Go to Reply Thread'}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#9ACD00]" />
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-[#E0E2DA] text-center text-[#71717A] text-xs">
              Məlumatı görmək üçün sol siyahıdan müraciət seçin.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
