import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PackageType, SeniorityLevel } from '../types';
import { 
  X, FileUp, Sparkles, Check, ArrowRight, ArrowLeft, 
  Building2, DollarSign, MapPin, Briefcase, ShieldCheck, 
  Zap, Lock, CheckCircle2 
} from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { 
    isOnboardingOpen, setIsOnboardingOpen, locale, t, 
    profile, preferences, uploadCV, updateProfile, updatePreferences, 
    startSearchRun, payAndExecuteSearch, setActiveView, isLoading 
  } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [cvFilename, setCvFilename] = useState<string>('Kamil_Dadashov_CV.pdf');
  const [cvRawText, setCvRawText] = useState<string>(`Kamil Dadashov
Lead Graphic Designer & Creative Art Lead
Baku, Azerbaijan | kamildadashoff@gmail.com | +994 50 234 56 78

PROFESSIONAL SUMMARY
Senior Brand & Graphic Designer with 6+ years of proven track record leading creative direction, brand identity systems, and multi-channel marketing campaigns across luxury hospitality, fintech, and commercial retail in Baku.

EXPERIENCE
Creative Lead & Senior Brand Designer — Baku Creative Labs (2023 - Present)
- Led creative squad of 5 designers, developing 360-degree brand campaigns for premier hospitality & banking clients.
- Elevated brand recall by 40% through unified digital design systems.

Senior Graphic Designer — Absheron Media Group (2020 - 2023)
- Created print and digital visual assets for international corporate events and 5-star hotel launches.

SKILLS & TOOLS
- Brand Architecture & Guidelines, Visual Identity, Creative Direction, Typography.
- Tools: Adobe Photoshop, Adobe Illustrator, Figma, After Effects, InDesign.
- Languages: Azerbaijani (Native), English (Fluent), Russian (Working).

EDUCATION
B.A. in Graphic & Industrial Design — Azerbaijan State Academy of Fine Arts (2018)`);

  // Local Form state initialized from context
  const [formData, setFormData] = useState({
    firstName: profile?.firstName || 'Kamil',
    lastName: profile?.lastName || 'Dadashov',
    email: profile?.email || 'kamildadashoff@gmail.com',
    phone: profile?.phone || '+994 50 234 56 78',
    city: profile?.city || 'Baku',
    professionalHeadline: profile?.professionalHeadline || 'Lead Graphic Designer & Creative Art Lead',
    yearsExperience: profile?.yearsExperience || 6,
    skills: profile?.skills || ['Brand Identity', 'Creative Direction', 'Typography', 'Visual Strategy', 'Design Systems'],
    tools: profile?.tools || ['Figma', 'Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign', 'After Effects'],
    seniorities: (preferences?.seniorities || ['MANAGER', 'HEAD']) as SeniorityLevel[],
    jobCategories: preferences?.jobCategories || ['Design & Creative', 'Marketing & Growth'],
    desiredTitles: preferences?.desiredTitles?.join(', ') || 'Lead Graphic Designer, Creative Director, Art Director, Senior Brand Designer',
    excludedCompanies: preferences?.excludedCompanies?.join(', ') || '',
    workFormats: preferences?.workFormats || ['HYBRID', 'OFFICE', 'ANY'],
    minimumSalary: preferences?.minimumSalary || 2200,
    selectedPackage: 'JOB_LUCK' as PackageType,
  });

  const [isProcessingAI, setIsProcessingAI] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOnboardingOpen) return null;

  const totalSteps = 9;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCvFilename(file.name);
      setIsProcessingAI(true);
      try {
        // Read file or simulate rich extracted text
        const text = await file.text();
        const content = text && text.length > 50 ? text : cvRawText;
        const result = await uploadCV(file.name, content);
        if (result.profile) {
          setFormData(prev => ({
            ...prev,
            firstName: result.profile.firstName,
            lastName: result.profile.lastName,
            email: result.profile.email,
            phone: result.profile.phone,
            professionalHeadline: result.profile.professionalHeadline,
            yearsExperience: result.profile.yearsExperience,
            skills: result.profile.skills,
            tools: result.profile.tools,
          }));
        }
      } catch (err) {
        console.warn('File read fallback:', err);
      } finally {
        setIsProcessingAI(false);
      }
    }
  };

  const handleDirectParseSample = async () => {
    setIsProcessingAI(true);
    try {
      const result = await uploadCV(cvFilename, cvRawText);
      if (result.profile) {
        setFormData(prev => ({
          ...prev,
          firstName: result.profile.firstName,
          lastName: result.profile.lastName,
          email: result.profile.email,
          phone: result.profile.phone,
          professionalHeadline: result.profile.professionalHeadline,
          yearsExperience: result.profile.yearsExperience,
          skills: result.profile.skills,
          tools: result.profile.tools,
        }));
      }
      setCurrentStep(2);
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (formData.firstName) {
        setCurrentStep(2);
      } else {
        await handleDirectParseSample();
      }
      return;
    }

    if (currentStep === 3) {
      // Save Candidate Profile
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        professionalHeadline: formData.professionalHeadline,
        yearsExperience: Number(formData.yearsExperience),
        skills: formData.skills,
        tools: formData.tools,
      });
    }

    if (currentStep === 7) {
      // Save Preferences
      await updatePreferences({
        seniorities: formData.seniorities,
        jobCategories: formData.jobCategories,
        desiredTitles: formData.desiredTitles.split(',').map(s => s.trim()).filter(Boolean),
        excludedCompanies: formData.excludedCompanies.split(',').map(s => s.trim()).filter(Boolean),
        workFormats: formData.workFormats,
        minimumSalary: Number(formData.minimumSalary),
      });
    }

    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Final Step: Complete Checkout and launch Search Pipeline!
      setIsSubmitting(true);
      try {
        const run = await startSearchRun(formData.selectedPackage);
        await payAndExecuteSearch(run.id, formData.selectedPackage);
        setIsOnboardingOpen(false);
        setActiveView('vacancies');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E0E2DA] overflow-hidden my-8">
        
        {/* Header with Progress */}
        <div className="px-6 py-5 border-b border-[#EAEBE6] bg-[#FBFBF9] flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B8E00]">
                {locale === 'az' ? `Addım ${currentStep} / ${totalSteps}` : `Step ${currentStep} of ${totalSteps}`}
              </span>
              <span className="text-xs text-[#9CA3AF]">•</span>
              <span className="text-xs font-bold text-[#121417]">
                {currentStep === 1 && (locale === 'az' ? 'CV Yükləmə' : 'Upload CV')}
                {currentStep === 2 && (locale === 'az' ? 'AI Təhlili və Nəticə' : 'AI Parsing Preview')}
                {currentStep === 3 && (locale === 'az' ? 'Şəxsi Məlumatlar' : 'Candidate Details')}
                {currentStep === 4 && (locale === 'az' ? 'Təcrübə Səviyyəsi' : 'Seniority Level')}
                {currentStep === 5 && (locale === 'az' ? 'Sahə və Vəzifələr' : 'Categories & Titles')}
                {currentStep === 6 && (locale === 'az' ? 'İş Formatı və Maaş' : 'Work Format & Salary')}
                {currentStep === 7 && (locale === 'az' ? 'İstisnalar və Filtrlər' : 'Exclusions & Filters')}
                {currentStep === 8 && (locale === 'az' ? 'Müraciət Paketi' : 'Choose Package')}
                {currentStep === 9 && (locale === 'az' ? 'Ödəniş və Başlatma' : 'Payment & Launch')}
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-48 sm:w-64 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#9ACD00] transition-all duration-300 rounded-full"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => setIsOnboardingOpen(false)}
            className="p-2 rounded-xl text-[#71717A] hover:text-[#121417] hover:bg-[#EAEBE6] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto">
          
          {/* STEP 1: Upload CV */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-2 max-w-lg mx-auto">
                <h3 className="text-2xl font-extrabold text-[#121417] font-syne">
                  {locale === 'az' ? 'CV-nizi yükləyin' : 'Upload your CV'}
                </h3>
                <p className="text-xs sm:text-sm text-[#5E6573]">
                  {locale === 'az' 
                    ? 'MASHCOOL süni intellekti CV-nizi dərhal təhlil edərək Azərbaycan bazarındakı yüzlərlə vakansiya ilə müqayisə edəcək.'
                    : 'MASHCOOL AI instantly structures your CV to match verified job listings.'}
                </p>
              </div>

              {/* Drag and drop zone */}
              <div className="relative border-2 border-dashed border-[#CCD0C2] hover:border-[#9ACD00] rounded-2xl p-8 text-center bg-[#FBFBF9] transition-colors group cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center space-y-3">
                  <div className="p-3 rounded-2xl bg-white border border-[#E0E2DA] shadow-xs group-hover:scale-105 transition-transform">
                    <FileUp className="w-6 h-6 text-[#6B8E00]" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#121417] block">
                      {cvFilename ? cvFilename : (locale === 'az' ? 'Faylı bura sürükləyin və ya seçin' : 'Click or drag file here')}
                    </span>
                    <span className="text-xs text-[#71717A] mt-1 block">
                      PDF, DOCX formatları dəstəklənir (Maks. 10MB)
                    </span>
                  </div>
                </div>
              </div>

              {/* Sample Profile Loader */}
              <div className="p-4 rounded-xl bg-[#F4F5EF] border border-[#E0E2DA] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-white text-[#6B8E00]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#121417] block">
                      {locale === 'az' ? 'Nümunə CV ilə test edin' : 'Use sample candidate CV'}
                    </span>
                    <span className="text-[11px] text-[#6B7280]">
                      Kamil Dadashov (Lead Graphic Designer, 6 il təcrübə)
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDirectParseSample}
                  disabled={isProcessingAI}
                  className="px-3.5 py-1.5 rounded-lg bg-white border border-[#D5D8CE] text-xs font-bold text-[#121417] hover:bg-[#EAEBE6] transition-colors cursor-pointer"
                >
                  {isProcessingAI ? 'Təhlil edilir...' : (locale === 'az' ? 'Tətbiq et' : 'Apply')}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: AI Parsing Result Preview */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-[#EAEBE6] pb-3">
                <div>
                  <h3 className="text-xl font-bold text-[#121417] font-syne">
                    {locale === 'az' ? 'AI Tərəfindən Çıxarılmış Məlumatlar' : 'Extracted Profile Preview'}
                  </h3>
                  <p className="text-xs text-[#5E6573]">
                    {locale === 'az' ? 'CV-niz uğurla strukturlaşdırıldı. Dəqiqliyi yoxlayın.' : 'Your profile has been structured.'}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>100% Parsed</span>
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#F9FAF7] border border-[#E5E7EB] space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[#71717A] block">Namizəd:</span>
                    <span className="font-bold text-[#121417]">{formData.firstName} {formData.lastName}</span>
                  </div>
                  <div>
                    <span className="text-[#71717A] block">Peşəkar Başlıq:</span>
                    <span className="font-bold text-[#121417]">{formData.professionalHeadline}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#EAEBE6]">
                  <div>
                    <span className="text-[#71717A] block">Ümumi Təcrübə:</span>
                    <span className="font-bold text-[#121417]">{formData.yearsExperience} il</span>
                  </div>
                  <div>
                    <span className="text-[#71717A] block">Əlaqə:</span>
                    <span className="font-bold text-[#121417]">{formData.phone} • {formData.email}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#EAEBE6]">
                  <span className="text-[#71717A] block mb-1.5">Əsas Bacarıqlar:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(formData.skills || []).map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-[#D5D8CE] text-[11px] font-semibold text-[#121417]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Candidate Information Confirmation */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#121417] font-syne">
                {locale === 'az' ? 'Şəxsi Məlumatlarınızı Təsdiqləyin' : 'Confirm Candidate Details'}
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#121417] block mb-1">Adınız</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D0D4C8] text-sm focus:outline-none focus:border-[#84B000]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#121417] block mb-1">Soyadınız</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D0D4C8] text-sm focus:outline-none focus:border-[#84B000]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#121417] block mb-1">E-poçt (Müraciət üçün)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D0D4C8] text-sm focus:outline-none focus:border-[#84B000]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#121417] block mb-1">Telefon</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D0D4C8] text-sm focus:outline-none focus:border-[#84B000]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#121417] block mb-1">Peşəkar Vəzifə / Headline</label>
                <input
                  type="text"
                  value={formData.professionalHeadline}
                  onChange={e => setFormData({ ...formData, professionalHeadline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#D0D4C8] text-sm focus:outline-none focus:border-[#84B000]"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Seniorities */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#121417] font-syne">
                {locale === 'az' ? 'Hansı təcrübə səviyyəsində vakansiyalar axtarırsınız?' : 'Select Desired Seniorities'}
              </h3>
              <p className="text-xs text-[#5E6573]">
                {locale === 'az' ? 'Bir və ya bir neçə səviyyə seçə bilərsiniz.' : 'Select one or more levels.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {[
                  { level: 'INTERN' as SeniorityLevel, label: 'Təcrübəçi (Intern)', desc: '0-1 il təcrübə' },
                  { level: 'JUNIOR' as SeniorityLevel, label: 'İşçi (Junior)', desc: '1-2 il təcrübə' },
                  { level: 'SPECIALIST' as SeniorityLevel, label: 'Mütəxəssis (Specialist / Middle)', desc: '2-4 il təcrübə' },
                  { level: 'MANAGER' as SeniorityLevel, label: 'Menecer / Aparıcı (Lead / Senior)', desc: '4-6 il təcrübə' },
                  { level: 'HEAD' as SeniorityLevel, label: 'Rəhbər (Head of / Director)', desc: '6+ il təcrübə və komanda idarəsi' },
                ].map(item => {
                  const isSelected = formData.seniorities.includes(item.level);
                  return (
                    <button
                      key={item.level}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setFormData({
                            ...formData,
                            seniorities: formData.seniorities.filter(s => s !== item.level)
                          });
                        } else {
                          setFormData({
                            ...formData,
                            seniorities: [...formData.seniorities, item.level]
                          });
                        }
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected 
                          ? 'border-[#84B000] bg-[#9ACD00]/10 text-[#121417]' 
                          : 'border-[#E0E2DA] hover:bg-[#F6F7F3] text-[#3E4552]'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold block">{item.label}</span>
                        <span className="text-[10px] text-[#6B7280]">{item.desc}</span>
                      </div>
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        isSelected ? 'bg-[#84B000] border-[#84B000] text-white' : 'border-[#CCD0C2]'
                      }`}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Categories & Titles */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#121417] font-syne">
                {locale === 'az' ? 'Fəaliyyət Sahələri və Vəzifə Adları' : 'Job Categories & Titles'}
              </h3>
              
              <div>
                <label className="text-xs font-bold text-[#121417] block mb-2">Sahələr</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Design & Creative', 'Software Engineering', 'Marketing & Growth', 
                    'Finance & Accounting', 'Sales & BD', 'Operations & HR'
                  ].map(cat => {
                    const isSelected = formData.jobCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setFormData({
                              ...formData,
                              jobCategories: formData.jobCategories.filter(c => c !== cat)
                            });
                          } else {
                            setFormData({
                              ...formData,
                              jobCategories: [...formData.jobCategories, cat]
                            });
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#121417] text-white'
                            : 'bg-[#EFEFEA] text-[#444A54] hover:bg-[#E2E4DC]'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <label className="text-xs font-bold text-[#121417] block mb-1">
                  Arzulanan Vəzifələr (vergüllə ayırın)
                </label>
                <input
                  type="text"
                  value={formData.desiredTitles}
                  onChange={e => setFormData({ ...formData, desiredTitles: e.target.value })}
                  placeholder="Məs: Lead Graphic Designer, Art Director, Senior Brand Designer"
                  className="w-full px-3 py-2 rounded-xl border border-[#D0D4C8] text-sm focus:outline-none focus:border-[#84B000]"
                />
              </div>
            </div>
          )}

          {/* STEP 6: Work Format & Salary */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#121417] font-syne">
                {locale === 'az' ? 'İş Formatı və Maaş Gözləntisi' : 'Work Format & Salary Expectations'}
              </h3>

              <div>
                <label className="text-xs font-bold text-[#121417] block mb-2">İş Formatı</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'HYBRID', label: 'Hibrid' },
                    { id: 'OFFICE', label: 'Ofis' },
                    { id: 'ANY', label: 'Fərq etmir' },
                  ].map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, workFormats: [f.id as any] })}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        formData.workFormats.includes(f.id as any)
                          ? 'border-[#84B000] bg-[#9ACD00]/15 text-[#121417]'
                          : 'border-[#E0E2DA] hover:bg-[#F6F7F3] text-[#555C6B]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="text-xs font-bold text-[#121417] block mb-1">
                  Minimum Maaş Gözləntisi (AZN / Net)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="100"
                    value={formData.minimumSalary}
                    onChange={e => setFormData({ ...formData, minimumSalary: Number(e.target.value) })}
                    className="w-full px-3 py-2 pl-9 rounded-xl border border-[#D0D4C8] text-sm font-bold text-[#121417] focus:outline-none focus:border-[#84B000]"
                  />
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-[#6B7280]">₼</span>
                </div>
                <p className="text-[11px] text-[#71717A] mt-1">
                  {locale === 'az' ? 'Maaşı qeyd olunmamış prestijli vakansiyalar da axtarışa daxil edilir.' : 'Salary confidential jobs will still be scanned.'}
                </p>
              </div>
            </div>
          )}

          {/* STEP 7: Exclusions */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#121417] font-syne">
                {locale === 'az' ? 'İstisnalar və Qara Siyahı' : 'Exclusions & Confidentiality'}
              </h3>
              <p className="text-xs text-[#5E6573]">
                {locale === 'az' 
                  ? 'Hazırkı iş yerinizə və ya müraciət etmək istəmədiyiniz şirkətlərə heç vaxt müraciət göndərilmir.'
                  : 'We will never send applications to your excluded employers.'}
              </p>

              <div>
                <label className="text-xs font-bold text-[#121417] block mb-1">
                  İstisna ediləcək şirkətlər (vergüllə ayırın)
                </label>
                <input
                  type="text"
                  value={formData.excludedCompanies}
                  onChange={e => setFormData({ ...formData, excludedCompanies: e.target.value })}
                  placeholder="Məs: Hazırkı Şirkət Adı, X Şirkəti"
                  className="w-full px-3 py-2 rounded-xl border border-[#D0D4C8] text-sm focus:outline-none focus:border-[#84B000]"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center space-x-2 text-xs text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{locale === 'az' ? 'Dəqiq müraciət filtri aktivdir' : 'Strict exclusion filter active'}</span>
              </div>
            </div>
          )}

          {/* STEP 8: Choose Package */}
          {currentStep === 8 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold text-[#121417] font-syne">
                  {locale === 'az' ? 'Müraciət Paketinizi Seçin' : 'Select Search Package'}
                </h3>
                <p className="text-xs text-[#5E6573]">
                  {locale === 'az' ? 'Təkrar axtarışlarda əvvəl göndərilən vakansiyalar avtomatik çıxarılır.' : 'No repeated applications.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* JOB LUCK */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, selectedPackage: 'JOB_LUCK' })}
                  className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer relative ${
                    formData.selectedPackage === 'JOB_LUCK'
                      ? 'border-[#9ACD00] bg-[#9ACD00]/10 shadow-sm'
                      : 'border-[#E0E2DA] hover:bg-[#F6F7F3]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-extrabold text-[#121417] font-syne">JOB LUCK</span>
                    <span className="text-lg font-black text-[#121417]">5 AZN</span>
                  </div>
                  <ul className="text-xs text-[#4B5262] space-y-1.5">
                    <li>• 300 vakansiyayadək skan</li>
                    <li>• 30-dək uyğun müraciət</li>
                    <li>• AI Fərdi Məktub</li>
                  </ul>
                </button>

                {/* JOB BLAST */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, selectedPackage: 'JOB_BLAST' })}
                  className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer relative ${
                    formData.selectedPackage === 'JOB_BLAST'
                      ? 'border-[#7C3AED] bg-[#7C3AED]/10 shadow-sm'
                      : 'border-[#E0E2DA] hover:bg-[#F6F7F3]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-extrabold text-[#121417] font-syne flex items-center space-x-1">
                      <span>JOB BLAST</span>
                      <Zap className="w-4 h-4 text-[#7C3AED]" />
                    </span>
                    <span className="text-lg font-black text-[#7C3AED]">8 AZN</span>
                  </div>
                  <ul className="text-xs text-[#4B5262] space-y-1.5">
                    <li>• 500 vakansiyayadək skan</li>
                    <li>• 50-dək uyğun müraciət</li>
                    <li>• Dərin AI Uyğunluq Təhlili</li>
                  </ul>
                </button>
              </div>
            </div>
          )}

          {/* STEP 9: 1-Click Secure Payment Simulation & Launch */}
          {currentStep === 9 && (
            <div className="space-y-5 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#9ACD00]/20 text-[#6B8E00] flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-extrabold text-[#121417] font-syne">
                  {locale === 'az' ? 'Ödənişi Təsdiqləyin' : 'Confirm & Launch Search'}
                </h3>
                <p className="text-xs text-[#5E6573]">
                  {locale === 'az' 
                    ? 'Təhlükəsiz MASHCOOL Pay Gateway ilə dərhal axtarışa başlayın.'
                    : 'Secure instant checkout with MASHCOOL Pay.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F6F7F3] border border-[#E5E7EB] text-left space-y-2 text-xs">
                <div className="flex justify-between font-medium">
                  <span>{locale === 'az' ? 'Seçilmiş Paket:' : 'Selected Package:'}</span>
                  <span className="font-bold text-[#121417]">{formData.selectedPackage}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>{locale === 'az' ? 'Göndərən E-poçt:' : 'Sender Email:'}</span>
                  <span className="font-bold text-[#121417]">{formData.email}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#121417] pt-2 border-t border-[#EAEBE6]">
                  <span>{locale === 'az' ? 'Yekun Məbləğ:' : 'Total Amount:'}</span>
                  <span className="text-[#84B000]">{formData.selectedPackage === 'JOB_BLAST' ? '8.00 AZN' : '5.00 AZN'}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-[#EAEBE6] bg-[#FBFBF9] flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1 || isSubmitting}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer ${
              currentStep === 1 
                ? 'opacity-0 pointer-events-none' 
                : 'text-[#555C6B] hover:bg-[#EAEBE6]'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.common.back}</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={isProcessingAI || isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-[#9ACD00] text-[#0F172A] text-sm font-bold hover:bg-[#88B800] active:scale-98 transition-all flex items-center space-x-2 shadow-xs cursor-pointer"
          >
            <span>
              {isSubmitting 
                ? (locale === 'az' ? 'Axtarış icra edilir...' : 'Executing search...') 
                : currentStep === totalSteps 
                  ? (locale === 'az' ? 'Ödə və Axtarışa Başla' : 'Pay & Start Search')
                  : t.common.next}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
