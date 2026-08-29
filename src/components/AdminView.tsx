import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, Server, Database, DollarSign, Activity, 
  Cpu, Power, CheckCircle2, AlertTriangle, Sparkles 
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { adminMetrics, sourcesHealth, toggleSource, locale, t } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E0E2DA] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-rose-600">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>MASHCOOL System Administration & Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#121417] font-syne mt-1">
            Mərkəzi İdarəetmə və AI Xərclər Paneli
          </h1>
          <p className="text-xs sm:text-sm text-[#5E6573]">
            Sistem mənbələri, xərc limitləri və vakansiya aqreqasiyası vəziyyəti.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 text-xs font-bold text-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Sistem Normaldır (99.9% Uptime)</span>
        </div>
      </div>

      {/* Top 4 System Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-1">
          <span className="text-xs text-[#71717A] font-medium">Toplam İstifadəçilər</span>
          <div className="text-2xl font-black text-[#121417] font-syne">{adminMetrics?.totalUsers || 142}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">128 aktiv profil</span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-1">
          <span className="text-xs text-[#71717A] font-medium">Baza Vakansiyaları</span>
          <div className="text-2xl font-black text-[#121417] font-syne">{adminMetrics?.totalVacancies || 534}</div>
          <span className="text-[11px] text-blue-600 font-semibold">{adminMetrics?.activeVacancies || 489} aktiv elan</span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-1">
          <span className="text-xs text-[#71717A] font-medium">Toplam Gəlir</span>
          <div className="text-2xl font-black text-[#121417] font-syne">{adminMetrics?.totalRevenueAZN || 1255} AZN</div>
          <span className="text-[11px] text-[#6B8E00] font-semibold">JOB LUCK & BLAST</span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-1">
          <span className="text-xs text-[#71717A] font-medium">Ümumi Cavab Faizi</span>
          <div className="text-2xl font-black text-[#121417] font-syne">{adminMetrics?.overallReplyRatePercent || 24.6}%</div>
          <span className="text-[11px] text-purple-600 font-semibold">9.8% müsahibə dərəcəsi</span>
        </div>
      </div>

      {/* AI Token & Cost Telemetry (Critical Product Spec) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E0E2DA] shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[#7C3AED]">
            <Cpu className="w-5 h-5" />
            <h3 className="text-base font-bold text-[#121417] font-syne">
              Gemini AI Token və Xərc Telemetriyası
            </h3>
          </div>
          <span className="text-xs font-bold text-[#71717A]">
            Model: gemini-3.7-flash
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#FAF5FF] border border-[#F3E8FF] space-y-1">
            <span className="text-[11px] text-[#6B7280]">JOB LUCK Ort. Xərc</span>
            <div className="text-xl font-extrabold text-[#7C3AED] font-syne">
              ${adminMetrics?.avgAiCostJobLuckUSD?.toFixed(4) || '0.0034'}
            </div>
            <span className="text-[10px] text-[#6B7280]">Hər 300 vakansiya skanı üzrə</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF5FF] border border-[#F3E8FF] space-y-1">
            <span className="text-[11px] text-[#6B7280]">JOB BLAST Ort. Xərc</span>
            <div className="text-xl font-extrabold text-[#7C3AED] font-syne">
              ${adminMetrics?.avgAiCostJobBlastUSD?.toFixed(4) || '0.0058'}
            </div>
            <span className="text-[10px] text-[#6B7280]">Hər 500 vakansiya skanı üzrə</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F6F7F3] border border-[#E5E7EB] space-y-1">
            <span className="text-[11px] text-[#6B7280]">P50 / P95 Latensiya və Xərc</span>
            <div className="text-lg font-bold text-[#121417] font-syne">
              ${adminMetrics?.p50AiCostUSD?.toFixed(4)} / ${adminMetrics?.p95AiCostUSD?.toFixed(4)}
            </div>
            <span className="text-[10px] text-[#6B7280]">Stabil iqtisadi model</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
            <span className="text-[11px] text-emerald-800 font-medium">Aylıq Təhlükəsizlik Limiti</span>
            <div className="text-lg font-bold text-emerald-900 font-syne">
              ${adminMetrics?.currentMonthAiSpendUSD || 14.82} / ${adminMetrics?.aiSpendingSafetyLimitUSD || 100}
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold">Təhlükəsiz limit daxilində</span>
          </div>
        </div>
      </div>

      {/* Vacancy Source Adapters & Health Management */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E0E2DA] shadow-xs space-y-5">
        <div className="flex items-center space-x-2 text-[#121417]">
          <Database className="w-5 h-5 text-[#6B8E00]" />
          <h3 className="text-base font-bold text-[#121417] font-syne">
            Vakansiya Mənbələri və Adapterlərin İdarəsi
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(sourcesHealth || []).map((source) => (
            <div 
              key={source.sourceName}
              className="p-5 rounded-2xl bg-[#FBFBF9] border border-[#E0E2DA] space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#121417]">{source.sourceName}</h4>
                <button
                  onClick={() => toggleSource(source.sourceName, !source.enabled)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    source.enabled
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                  }`}
                >
                  {source.enabled ? 'Aktiv' : 'Deaktiv'}
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-[#555C6B]">
                <div className="flex justify-between">
                  <span>Mövcud vakansiya:</span>
                  <span className="font-bold text-[#121417]">{source.totalFetched}</span>
                </div>
                <div className="flex justify-between">
                  <span>Deduplikasiya nisbəti:</span>
                  <span className="font-bold text-[#121417]">14.2%</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#71717A] pt-1 border-t border-[#EAEBE6]">
                  <span>Son sinxronizasiya:</span>
                  <span>{new Date(source.lastFetchedAt).toLocaleTimeString('az-AZ')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
