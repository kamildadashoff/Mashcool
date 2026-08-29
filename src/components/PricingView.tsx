import React from 'react';
import { useApp } from '../context/AppContext';
import { PackageType } from '../types';
import { Check, Zap, Sparkles, ShieldCheck, CreditCard, History } from 'lucide-react';

export const PricingView: React.FC = () => {
  const { locale, t, setIsOnboardingOpen, currentRun, searchRuns } = useApp();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#6B8E00]">
          {locale === 'az' ? 'Planlar və Balans' : 'Plans & Invoicing'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#121417] font-syne">
          {t.pricing.title}
        </h1>
        <p className="text-sm text-[#5E6573]">
          {t.pricing.subtitle}
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* JOB LUCK */}
        <div className="rounded-3xl bg-white border-2 border-[#9ACD00] p-8 shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-extrabold text-[#121417] font-syne">JOB LUCK</h3>
                <p className="text-xs text-[#6B7280]">Standart Müraciət Paketi</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#9ACD00]/20 text-[#5F7F00] text-xs font-bold">
                Populyar
              </span>
            </div>

            <div className="flex items-baseline space-x-2">
              <span className="text-5xl font-black text-[#121417] font-syne">5</span>
              <span className="text-xl font-bold text-[#6B7280]">AZN</span>
            </div>

            <ul className="space-y-2.5 text-xs text-[#2D333D]">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#84B000]" />
                <span>300 vakansiyayadək tam bazar skanı</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#84B000]" />
                <span>30-dək uyğun müraciət və fərdi məktub</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#84B000]" />
                <span>Birbaşa Gmail/Outlook inteqrasiyası</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#84B000]" />
                <span>Avtomatlaşdırılmış cavab izləmə</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="w-full py-3.5 rounded-xl bg-[#9ACD00] text-[#0F172A] font-bold text-sm hover:bg-[#88B800] transition-all cursor-pointer shadow-xs"
            >
              Bu Paketi Başlat
            </button>
          </div>
        </div>

        {/* JOB BLAST */}
        <div className="rounded-3xl bg-white border-2 border-[#7C3AED] p-8 shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-extrabold text-[#121417] font-syne flex items-center space-x-1.5">
                  <span>JOB BLAST</span>
                  <Zap className="w-5 h-5 text-[#7C3AED]" />
                </h3>
                <p className="text-xs text-[#6B7280]">Maksimum Əhatə və Dərin AI</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#7C3AED]/15 text-[#7C3AED] text-xs font-bold">
                Maksimum
              </span>
            </div>

            <div className="flex items-baseline space-x-2">
              <span className="text-5xl font-black text-[#121417] font-syne">8</span>
              <span className="text-xl font-bold text-[#6B7280]">AZN</span>
            </div>

            <ul className="space-y-2.5 text-xs text-[#2D333D]">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#7C3AED]" />
                <span>500 vakansiyayadək tam bazar skanı</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#7C3AED]" />
                <span>50-dək uyğun müraciət və fərdi məktub</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#7C3AED]" />
                <span>Prioritet növbə və ani göndəriş</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#7C3AED]" />
                <span>Dərin AI uyğunluq rəyi və tövsiyələr</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="w-full py-3.5 rounded-xl bg-[#7C3AED] text-white font-bold text-sm hover:bg-[#6D28D9] transition-all cursor-pointer shadow-xs"
            >
              Bu Paketi Başlat
            </button>
          </div>
        </div>

      </div>

      {/* Transaction & Invoices Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E0E2DA] shadow-xs space-y-4 max-w-4xl mx-auto">
        <div className="flex items-center space-x-2">
          <History className="w-4 h-4 text-[#6B8E00]" />
          <h4 className="text-base font-bold text-[#121417] font-syne">
            {locale === 'az' ? 'Ödəniş və Faktura Tarixçəsi' : 'Billing & Payment Receipts'}
          </h4>
        </div>

        <div className="border border-[#E5E7EB] rounded-2xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-[#F8F9F5] border-b border-[#E5E7EB] text-[#555C6B]">
              <tr>
                <th className="p-3">Tarix</th>
                <th className="p-3">Paket</th>
                <th className="p-3">Məbləğ</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Qəbz</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEBE6]">
              <tr>
                <td className="p-3 text-[#121417] font-medium">20 Avqust 2026</td>
                <td className="p-3 font-bold">JOB LUCK (Axtarış #1)</td>
                <td className="p-3 font-bold text-[#121417]">5.00 AZN</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    Ödənildi
                  </span>
                </td>
                <td className="p-3 text-right text-[#6B8E00] font-semibold cursor-pointer hover:underline">
                  #INV-9841
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
