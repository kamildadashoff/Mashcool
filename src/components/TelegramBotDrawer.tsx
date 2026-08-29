import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, Send, Bot, User, Sparkles, CheckCircle2, 
  RotateCcw, ShieldCheck, ExternalLink, Zap 
} from 'lucide-react';

interface BotMessage {
  id: string;
  sender: 'BOT' | 'USER';
  text: string;
  time: string;
  buttons?: { label: string; action: () => void }[];
}

export const TelegramBotDrawer: React.FC = () => {
  const { 
    isTelegramBotOpen, setIsTelegramBotOpen, user, profile, 
    applications, currentRun, startSearchRun, payAndExecuteSearch, 
    locale, setActiveView 
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<BotMessage[]>([
    {
      id: 'm1',
      sender: 'BOT',
      text: `👋 Salam ${user?.name || 'Kamil'}! MASHCOOL Rəsmi Botuna (@mashcoolbot) xoş gəlmisiniz.\n\nİşinizlə məşğuluq. Saytdakı profiliniz botla tam sinxronlaşdırılıb.`,
      time: '12:00',
      buttons: [
        { label: '📊 Status & Cavablar', action: () => handleCommand('/status') },
        { label: '🚀 Yeni Axtarış Başlat (JOB LUCK)', action: () => handleCommand('/search') },
        { label: '👤 Profilim', action: () => handleCommand('/profile') },
      ]
    }
  ]);

  if (!isTelegramBotOpen) return null;

  const handleCommand = async (cmd: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add user message
    const userMsg: BotMessage = {
      id: `u-${Date.now()}`,
      sender: 'USER',
      text: cmd,
      time,
    };
    setMessages(prev => [...prev, userMsg]);

    setTimeout(async () => {
      let botResponse: BotMessage;

      if (cmd === '/status' || cmd.includes('Status')) {
        botResponse = {
          id: `b-${Date.now()}`,
          sender: 'BOT',
          text: `📊 *MASHCOOL Cari Hesabat:*\n• Göndərilən müraciətlər: ${applications.totalSent}\n• Gələn cavablar: ${applications.repliedCount}\n• Müsahibə dəvətləri: ${applications.interviewCount}\n• Cavab dərəcəsi: ${applications.replyRate}%\n\nBütün müraciətlər ${user?.emailConnection?.email || user?.email} ünvanınızdan icra olunub.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      } else if (cmd === '/search' || cmd.includes('Axtarış')) {
        botResponse = {
          id: `b-${Date.now()}`,
          sender: 'BOT',
          text: `🚀 *Yeni Axtarış Əmri Alındı:*\nPaket: JOB LUCK (5 AZN)\nBaza üzrə 300 vakansiya skan ediləcək və əvvəl müraciət edilmiş yerlər avtomatik çıxarılacaq.\n\nÖdəniş təsdiqlənir...`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        // Auto trigger search in background
        const run = await startSearchRun('JOB_LUCK');
        await payAndExecuteSearch(run.id, 'JOB_LUCK');
      } else if (cmd === '/profile' || cmd.includes('Profil')) {
        botResponse = {
          id: `b-${Date.now()}`,
          sender: 'BOT',
          text: `👤 *Namizəd Profili:*\n• Ad: ${profile?.firstName} ${profile?.lastName}\n• Vəzifə: ${profile?.professionalHeadline}\n• Təcrübə: ${profile?.yearsExperience} il\n• Bacarıqlar: ${profile?.skills.slice(0, 4).join(', ')}\n• Şəhər: ${profile?.city}, Azərbaycan`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      } else {
        botResponse = {
          id: `b-${Date.now()}`,
          sender: 'BOT',
          text: `Əmriniz qeydə alındı: "${cmd}". MASHCOOL süni intellekti sorğunuzu emal edir.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          buttons: [
            { label: '📊 Status & Cavablar', action: () => handleCommand('/status') },
            { label: '🚀 Yeni Axtarış Başlat', action: () => handleCommand('/search') },
          ]
        };
      }

      setMessages(prev => [...prev, botResponse]);
    }, 600);
  };

  const handleSend = () => {
    if (inputMessage.trim()) {
      handleCommand(inputMessage.trim());
      setInputMessage('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-[#17212B] text-white rounded-3xl shadow-2xl overflow-hidden border border-[#2B5278]/40 flex flex-col h-[650px] font-sans">
        
        {/* Telegram Top Header */}
        <div className="bg-[#242F3D] px-4 py-3.5 flex items-center justify-between border-b border-[#1C2733]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#2CA5E0] flex items-center justify-center text-white">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-sm">MASHCOOL Bot</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </div>
              <span className="text-[11px] text-[#8393A3]">bot • @mashcoolbot</span>
            </div>
          </div>

          <button
            onClick={() => setIsTelegramBotOpen(false)}
            className="p-1.5 rounded-full text-[#8393A3] hover:text-white hover:bg-[#17212B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telegram Chat Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0E1621]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'USER' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'USER'
                    ? 'bg-[#2B5278] text-white rounded-tr-xs'
                    : 'bg-[#182533] text-[#E4ECF2] border border-[#243547] rounded-tl-xs'
                }`}
              >
                {msg.text}
                <div className={`text-[9px] mt-1 text-right ${msg.sender === 'USER' ? 'text-[#8EA8C3]' : 'text-[#6C7E90]'}`}>
                  {msg.time}
                </div>
              </div>

              {/* Bot Action Buttons */}
              {msg.buttons && msg.buttons.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 max-w-[85%]">
                  {msg.buttons.map((btn, idx) => (
                    <button
                      key={idx}
                      onClick={btn.action}
                      className="px-3 py-1.5 rounded-xl bg-[#202E3E] hover:bg-[#2B3E52] border border-[#2D4156] text-[11px] font-semibold text-[#54A4DC] transition-colors cursor-pointer"
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Telegram Bottom Input Bar */}
        <div className="p-3 bg-[#17212B] border-t border-[#1C2733] flex items-center space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Mesaj və ya əmr yazın (/status, /search)..."
            className="flex-1 bg-[#242F3D] text-white placeholder-[#6C7E90] text-xs px-3.5 py-2.5 rounded-xl border border-[#2B3E52] focus:outline-none focus:border-[#2CA5E0]"
          />
          <button
            onClick={handleSend}
            className="p-2.5 rounded-xl bg-[#2CA5E0] text-white hover:bg-[#1E94CF] transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
