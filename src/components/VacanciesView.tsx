import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VacancyMatch } from '../types';
import { 
  Building2, MapPin, DollarSign, Briefcase, CheckCircle2, 
  AlertTriangle, Edit3, Send, Trash2, Eye, ExternalLink, 
  Check, Sparkles, Filter, ChevronDown, ChevronUp, ShieldCheck 
} from 'lucide-react';

export const VacanciesView: React.FC = () => {
  const { 
    currentRun, searchRuns, locale, t, 
    updateCoverLetter, excludeMatch, dispatchApplications, 
    user, setActiveView, isLoading 
  } = useApp();

  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [editedLetterText, setEditedLetterText] = useState<string>('');
  const [filterMode, setFilterMode] = useState<'ALL' | 'APPROVED' | 'EXCLUDED'>('ALL');
  const [isSendingAll, setIsSendingAll] = useState<boolean>(false);

  const matches = currentRun?.matches || [];

  const filteredMatches = matches.filter(m => {
    if (filterMode === 'APPROVED') return !m.isExcluded;
    if (filterMode === 'EXCLUDED') return m.isExcluded;
    return true;
  });

  const approvedCount = matches.filter(m => !m.isExcluded).length;

  const handleStartEdit = (match: VacancyMatch) => {
    setEditingMatchId(match.id);
    setEditedLetterText(match.userEditedLetter || match.preparedCoverLetter || '');
  };

  const handleSaveLetter = async (matchId: string) => {
    if (!currentRun) return;
    await updateCoverLetter(currentRun.id, matchId, editedLetterText);
    setEditingMatchId(null);
  };

  const handleToggleExclude = async (match: VacancyMatch) => {
    if (!currentRun) return;
    await excludeMatch(currentRun.id, match.id, !match.isExcluded);
  };

  const handleSendAllApproved = async () => {
    if (!currentRun) return;
    setIsSendingAll(true);
    try {
      const approvedIds = matches.filter(m => !m.isExcluded).map(m => m.id);
      await dispatchApplications(currentRun.id, approvedIds);
      setActiveView('applications');
    } finally {
      setIsSendingAll(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header with Search Run stats */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E0E2DA] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B8E00]">
              {locale === 'az' ? 'AI Uyğunluq və Müraciət Meneceri' : 'AI Match & Outreach Manager'}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#84B000]"></span>
            <span className="text-xs font-bold text-[#71717A]">
              {currentRun?.packageType || 'JOB LUCK'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#121417] font-syne">
            {locale === 'az' ? 'Seçilmiş Uyğun Vakansiyalar' : 'Matched Vacancies'}
          </h1>

          <p className="text-xs sm:text-sm text-[#5E6573]">
            {locale === 'az'
              ? `${currentRun?.vacanciesScanned || 284} vakansiya skan edildi, ${matches.length} dəqiq uyğunluq tapıldı və fərdi məktublar tərtib edildi.`
              : `Scanned ${currentRun?.vacanciesScanned || 284} listings, verified ${matches.length} precision matches with tailored letters.`}
          </p>
        </div>

        {/* Global Dispatch Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-[#121417] block">
              {approvedCount} / {matches.length} {locale === 'az' ? 'Təsdiqlənib' : 'Approved'}
            </span>
            <span className="text-[11px] text-[#71717A]">
              {user?.emailConnection?.email || user?.email}
            </span>
          </div>

          <button
            id="vacancies-send-all-btn"
            onClick={handleSendAllApproved}
            disabled={approvedCount === 0 || isSendingAll || isLoading}
            className="px-6 py-3.5 rounded-xl bg-[#9ACD00] text-[#0F172A] font-bold text-sm hover:bg-[#88B800] active:scale-98 transition-all flex items-center justify-center space-x-2 shadow-md cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>
              {isSendingAll 
                ? (locale === 'az' ? 'Göndərilir...' : 'Dispatching...') 
                : (locale === 'az' ? `Təsdiqlənmişləri Göndər (${approvedCount})` : `Send Approved (${approvedCount})`)}
            </span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
        <div className="flex items-center space-x-2">
          {(['ALL', 'APPROVED', 'EXCLUDED'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                filterMode === mode
                  ? 'bg-[#121417] text-white'
                  : 'bg-[#F2F3EF] text-[#5E6573] hover:text-[#121417]'
              }`}
            >
              {mode === 'ALL' && (locale === 'az' ? `Hamısı (${matches.length})` : `All (${matches.length})`)}
              {mode === 'APPROVED' && (locale === 'az' ? `Təsdiqlənənlər (${approvedCount})` : `Approved (${approvedCount})`)}
              {mode === 'EXCLUDED' && (locale === 'az' ? `Çıxarılanlar (${matches.length - approvedCount})` : `Excluded (${matches.length - approvedCount})`)}
            </button>
          ))}
        </div>
      </div>

      {/* Vacancy Match Cards List */}
      <div className="space-y-4">
        {filteredMatches.map((match) => {
          const isExpanded = expandedMatchId === match.id;
          const isEditing = editingMatchId === match.id;

          return (
            <div
              key={match.id}
              className={`rounded-3xl bg-white border transition-all overflow-hidden ${
                match.isExcluded 
                  ? 'border-[#E5E7EB] opacity-60 bg-[#FAFAFA]' 
                  : 'border-[#E0E2DA] shadow-xs hover:border-[#9ACD00]'
              }`}
            >
              {/* Match Card Header */}
              <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                
                <div className="flex items-start space-x-4">
                  {/* Company Initial / Logo */}
                  <div className="w-12 h-12 rounded-2xl bg-[#F6F7F2] border border-[#E5E7EB] flex items-center justify-center font-extrabold text-sm text-[#121417] flex-shrink-0 font-syne">
                    {match.vacancy.companyName.substring(0, 2).toUpperCase()}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-[#121417] font-syne">
                        {match.vacancy.titleNormalized}
                      </h3>
                      {/* Source badge */}
                      <span className="px-2 py-0.5 rounded-md bg-[#F0F1EA] text-[#555C6B] text-[10px] font-bold">
                        {match.vacancy.source}
                      </span>
                      {/* Seniority badge */}
                      <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold">
                        {match.vacancy.seniority}
                      </span>
                    </div>

                    <p className="text-xs text-[#5E6573] flex items-center space-x-3">
                      <span className="font-semibold text-[#121417]">{match.vacancy.companyName}</span>
                      <span>•</span>
                      <span>{match.vacancy.location}</span>
                      {match.vacancy.salaryMin && (
                        <>
                          <span>•</span>
                          <span className="font-bold text-[#6B8E00]">
                            {match.vacancy.salaryMin} - {match.vacancy.salaryMax} AZN
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* Score badge & Actions */}
                <div className="flex items-center space-x-3 self-end md:self-center">
                  
                  {/* Match Score */}
                  <div className="text-right">
                    <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl bg-[#9ACD00]/20 text-[#5F7F00] font-black text-sm font-syne">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{match.matchScore}% Uyğunluq</span>
                    </span>
                  </div>

                  {/* Exclude / Include toggle */}
                  <button
                    onClick={() => handleToggleExclude(match)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      match.isExcluded
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                    }`}
                  >
                    {match.isExcluded 
                      ? (locale === 'az' ? 'Bərpa et' : 'Restore') 
                      : (locale === 'az' ? 'Çıxar' : 'Exclude')}
                  </button>

                  {/* Expand button */}
                  <button
                    onClick={() => setExpandedMatchId(isExpanded ? null : match.id)}
                    className="p-2 rounded-xl text-[#71717A] hover:bg-[#F2F3EF] cursor-pointer"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>

                </div>

              </div>

              {/* Expanded Match Deep Details & Cover Letter */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-[#EAEBE6] bg-[#FBFBF9] space-y-6">
                  
                  {/* 2-Column: Left Fit & Risk reasons, Right Vacancy info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Positive Fit Reasons */}
                    <div className="p-4 rounded-2xl bg-white border border-[#E0E2DA] space-y-2">
                      <div className="flex items-center space-x-2 text-[#5F7F00]">
                        <CheckCircle2 className="w-4 h-4" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">
                          {locale === 'az' ? 'Bu vakansiya niyə sizə uyğundur?' : 'Why this matches you'}
                        </h4>
                      </div>
                      <ul className="space-y-1.5 text-xs text-[#2D333D]">
                        {(match.positiveReasons || []).map((r, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-[#84B000]">•</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Points of Caution / Risk factors */}
                    <div className="p-4 rounded-2xl bg-white border border-[#E0E2DA] space-y-2">
                      <div className="flex items-center space-x-2 text-amber-600">
                        <AlertTriangle className="w-4 h-4" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">
                          {locale === 'az' ? 'Diqqət edilməli məqamlar' : 'Points of Caution'}
                        </h4>
                      </div>
                      <ul className="space-y-1.5 text-xs text-[#2D333D]">
                        {(match.riskFactors || []).map((rf, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-amber-600">•</span>
                            <span>{rf}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Tailored Cover Letter Section */}
                  <div className="p-5 rounded-2xl bg-white border border-[#E0E2DA] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-[#121417]">
                          {locale === 'az' ? 'Fərdiləşdirilmiş Müraciət Məktubu' : 'Personalized Cover Letter'}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#9ACD00]/20 text-[#5F7F00] font-bold">
                          AI Verified
                        </span>
                      </div>

                      {isEditing ? (
                        <button
                          onClick={() => handleSaveLetter(match.id)}
                          className="px-3 py-1 rounded-lg bg-[#121417] text-white text-xs font-bold hover:bg-black cursor-pointer"
                        >
                          {locale === 'az' ? 'Yadda saxla' : 'Save'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(match)}
                          className="flex items-center space-x-1 text-xs font-bold text-[#6B8E00] hover:underline cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{locale === 'az' ? 'Redaktə et' : 'Edit'}</span>
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <textarea
                        rows={6}
                        value={editedLetterText}
                        onChange={e => setEditedLetterText(e.target.value)}
                        className="w-full p-3 rounded-xl border border-[#D0D4C8] text-xs leading-relaxed focus:outline-none focus:border-[#84B000]"
                      />
                    ) : (
                      <div className="p-3.5 rounded-xl bg-[#F9FAF7] border border-[#EAEBE6] text-xs leading-relaxed text-[#3E4552] whitespace-pre-wrap font-sans">
                        {match.userEditedLetter || match.preparedCoverLetter}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-[#71717A] pt-1">
                      <span>{locale === 'az' ? `Alıcı: ${match.vacancy.applicationEmail}` : `Recipient: ${match.vacancy.applicationEmail}`}</span>
                      <span>{locale === 'az' ? 'Qoşma: CV (PDF) əlavə edilir' : 'Attachment: Candidate CV included'}</span>
                    </div>
                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
