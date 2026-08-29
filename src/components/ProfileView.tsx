import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, FileText, Briefcase, SlidersHorizontal, Plus, 
  Trash2, Check, Upload, Sparkles, CheckCircle2 
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { profile, preferences, documents, updateProfile, updatePreferences, uploadCV, locale, t } = useApp();

  const [activeTab, setActiveTab] = useState<'PROFILE' | 'PREFERENCES' | 'DOCUMENTS'>('PROFILE');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [headline, setHeadline] = useState(profile?.professionalHeadline || '');
  const [summary, setSummary] = useState(profile?.professionalSummary || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [city, setCity] = useState(profile?.city || 'Baku');
  const [yearsExp, setYearsExp] = useState(profile?.yearsExperience || 6);
  const [skills, setSkills] = useState<string[]>(profile?.skills || []);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Preference states
  const [minSalary, setMinSalary] = useState(preferences?.minimumSalary || 2200);
  const [desiredTitles, setDesiredTitles] = useState(preferences?.desiredTitles?.join(', ') || '');
  const [excludedCompanies, setExcludedCompanies] = useState(preferences?.excludedCompanies?.join(', ') || '');

  const handleSaveProfile = async () => {
    await updateProfile({
      professionalHeadline: headline,
      professionalSummary: summary,
      phone,
      city,
      yearsExperience: Number(yearsExp),
      skills,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSavePreferences = async () => {
    await updatePreferences({
      minimumSalary: Number(minSalary),
      desiredTitles: desiredTitles.split(',').map(s => s.trim()).filter(Boolean),
      excludedCompanies: excludedCompanies.split(',').map(s => s.trim()).filter(Boolean),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddSkill = () => {
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E0E2DA] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B8E00]">
            {locale === 'az' ? 'Karyera Profili' : 'Candidate Profile'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#121417] font-syne mt-1">
            {profile?.firstName} {profile?.lastName}
          </h1>
          <p className="text-xs sm:text-sm text-[#5E6573]">
            {headline}
          </p>
        </div>

        {savedSuccess && (
          <div className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center space-x-1.5 border border-emerald-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{locale === 'az' ? 'Dəyişikliklər saxlanıldı!' : 'Saved successfully!'}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#E5E7EB] pb-3">
        {[
          { id: 'PROFILE', label: locale === 'az' ? 'Şəxsi Məlumatlar və Bacarıqlar' : 'Profile & Skills', icon: User },
          { id: 'PREFERENCES', label: locale === 'az' ? 'Axtarış Seçimləri və Filtrlər' : 'Search Preferences', icon: SlidersHorizontal },
          { id: 'DOCUMENTS', label: locale === 'az' ? 'CV Faylları və Versiyalar' : 'CV Documents', icon: FileText },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#121417] text-white shadow-xs'
                  : 'bg-[#F2F3EF] text-[#5E6573] hover:text-[#121417]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Profile Editor */}
      {activeTab === 'PROFILE' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E0E2DA] shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#121417] block mb-1">Peşəkar Başlıq</label>
              <input
                type="text"
                value={headline}
                onChange={e => setHeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D0D4C8] text-sm focus:outline-none focus:border-[#84B000]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#121417] block mb-1">Şəhər / Ölkə</label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D0D4C8] text-sm focus:outline-none focus:border-[#84B000]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#121417] block mb-1">Peşəkar Xülasə</label>
            <textarea
              rows={4}
              value={summary}
              onChange={e => setSummary(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#D0D4C8] text-xs leading-relaxed focus:outline-none focus:border-[#84B000]"
            />
          </div>

          {/* Skills Tag Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#121417] block">Əsas Bacarıqlar</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {(skills || []).map((skill, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-[#F4F5EF] border border-[#E0E2DA] text-xs font-bold text-[#121417] flex items-center space-x-1.5"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-[#9CA3AF] hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={e => setNewSkillInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddSkill()}
                placeholder="Yeni bacarıq əlavə et..."
                className="px-3 py-1.5 rounded-xl border border-[#D0D4C8] text-xs focus:outline-none focus:border-[#84B000]"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 rounded-xl bg-[#121417] text-white text-xs font-bold hover:bg-black cursor-pointer"
              >
                Əlavə et
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-[#EAEBE6] flex justify-end">
            <button
              onClick={handleSaveProfile}
              className="px-6 py-2.5 rounded-xl bg-[#9ACD00] text-[#0F172A] font-bold text-xs hover:bg-[#88B800] transition-colors cursor-pointer shadow-xs"
            >
              Yadda saxla
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: Preferences */}
      {activeTab === 'PREFERENCES' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E0E2DA] shadow-xs space-y-6">
          <div>
            <label className="text-xs font-bold text-[#121417] block mb-1">Minimum Maaş Gözləntisi (AZN)</label>
            <input
              type="number"
              value={minSalary}
              onChange={e => setMinSalary(Number(e.target.value))}
              className="w-full max-w-xs px-3 py-2 rounded-xl border border-[#D0D4C8] text-sm font-bold focus:outline-none focus:border-[#84B000]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#121417] block mb-1">Arzulanan Vəzifə Adları</label>
            <input
              type="text"
              value={desiredTitles}
              onChange={e => setDesiredTitles(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#D0D4C8] text-sm focus:outline-none focus:border-[#84B000]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#121417] block mb-1">İstisna Ediləcək Şirkətlər</label>
            <input
              type="text"
              value={excludedCompanies}
              onChange={e => setExcludedCompanies(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#D0D4C8] text-sm focus:outline-none focus:border-[#84B000]"
            />
          </div>

          <div className="pt-4 border-t border-[#EAEBE6] flex justify-end">
            <button
              onClick={handleSavePreferences}
              className="px-6 py-2.5 rounded-xl bg-[#9ACD00] text-[#0F172A] font-bold text-xs hover:bg-[#88B800] transition-colors cursor-pointer shadow-xs"
            >
              Yadda saxla
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: Documents Manager */}
      {activeTab === 'DOCUMENTS' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E0E2DA] shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#121417] font-syne">
                {locale === 'az' ? 'Yüklənmiş CV Faylları' : 'Uploaded CV Documents'}
              </h3>
              <p className="text-xs text-[#5E6573]">
                {locale === 'az' ? 'Hər müraciət zamanı aktiv versiya qoşma kimi göndərilir.' : 'Active version is automatically attached.'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {(documents || []).map((doc) => (
              <div 
                key={doc.id}
                className="p-4 rounded-2xl bg-[#FBFBF9] border border-[#E5E7EB] flex items-center justify-between"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="p-2.5 rounded-xl bg-white border border-[#E0E2DA] text-[#6B8E00]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-[#121417]">{doc.filename}</h4>
                      {doc.active && (
                        <span className="px-2 py-0.5 rounded-md bg-[#9ACD00]/20 text-[#5F7F00] text-[10px] font-bold">
                          Aktiv Versiya (v{doc.version})
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#71717A] mt-0.5">
                      {new Date(doc.uploadedAt).toLocaleDateString('az-AZ')} • {(doc.fileSize / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </div>

                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                  Ready to attach
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
