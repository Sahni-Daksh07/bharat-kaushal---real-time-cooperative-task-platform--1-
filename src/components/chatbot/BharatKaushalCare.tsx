import React, { useState, useRef, useEffect } from 'react';
import { useRealtime } from '../../context/RealtimeContext';
import { SupportedLanguage } from '../../utils/i18n';
import { UserRole } from '../../types';
import {
  MessageSquare,
  X,
  Send,
  ShieldCheck,
  PhoneCall,
  ChevronRight,
  Bot,
  User,
} from 'lucide-react';
import { apiFetch } from '../../utils/apiConfig';

const fetch = apiFetch;

interface BharatKaushalCareProps {
  lang?: SupportedLanguage;
  onOpenBenchmark?: () => void;
  currentRole?: UserRole;
}

interface ChatMessage {
  id: string;
  sender: 'BOT' | 'USER';
  text: string;
  actions?: Array<{ label: string; action: string }>;
  timestamp: string;
}

export const BharatKaushalCare: React.FC<BharatKaushalCareProps> = ({
  lang: _lang,
  onOpenBenchmark,
  currentRole,
}) => {
  const { activeBooking, submitComplaint } = useRealtime();
  const [isOpen, setIsOpen] = useState(false);

  const isPricingAllowed =
    currentRole && ['SOCIETY_ADMIN', 'FEDERATION_ADMIN', 'SUPER_ADMIN'].includes(currentRole);

  useEffect(() => {
    const handleOpenSupport = () => setIsOpen(true);
    document.addEventListener('OPEN_SUPPORT', handleOpenSupport);
    return () => document.removeEventListener('OPEN_SUPPORT', handleOpenSupport);
  }, []);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'BOT',
      text: 'Namaste! I am the Bharat Kaushal Support Assistant. I can help with real-time tracking, local Indore prices, arrival/completion OTPs, and statutory helplines.',
      actions: [
        { label: 'Check Worker Location & ETA', action: 'TRACK' },
        ...(isPricingAllowed ? [{ label: 'Indore Price Benchmarks', action: 'PRICING' }] : []),
        { label: 'National Consumer Helpline (1915)', action: 'HELPLINE_1915' },
      ],
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (userText?: string) => {
    const query = userText || inputMessage;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'USER',
      text: query,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!userText) setInputMessage('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          bookingId: activeBooking?.id,
        }),
      });
      const data = await res.json();

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'BOT',
        text: data.reply || 'I am here to assist you.',
        actions: data.actions || [],
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = async (action: string) => {
    if (action === 'TRACK') {
      if (activeBooking && activeBooking.workerName) {
        handleSend(`Where is my worker for booking ${activeBooking.id}?`);
      } else {
        handleSend('Where is my worker?');
      }
    } else if (action === 'PRICING') {
      if (isPricingAllowed && onOpenBenchmark) {
        onOpenBenchmark();
      }
      handleSend('How are local service rates benchmarked?');
    } else if (action === 'HELPLINE_1915') {
      window.open('tel:1915');
    } else if (action === 'CREATE_TICKET') {
      await submitComplaint({
        bookingId: activeBooking?.id || 'SS-1042',
        userName: 'Customer Support Request',
        category: 'Service Dispute',
        description: 'Customer requested human intervention via AI Assistant.',
        priority: 'HIGH',
      });
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-ticket-${Date.now()}`,
          sender: 'BOT',
          text: 'Dispute ticket created successfully and assigned to Indore Society Admin. For urgent assistance, National Consumer Helpline 1915 is also available from 8 AM to 8 PM.',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
      {/* Trigger Button - Compact, accessible and unobtrusive */}
      {!isOpen && (
        <button
          id="btn-open-chatbot"
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 sm:px-3.5 sm:py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 border border-blue-500/30 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          title={t('Bharat_Kaushal_Support_Assista_jtgim', `Bharat Kaushal Support Assistant`)}
          aria-label="Open Support & Help Assistant"
        >
          <MessageSquare size={18} />
          <span className="text-xs font-semibold hidden sm:inline">{t('Help___Care_gdfv3', `Support & Help`)}</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-80 sm:w-96 h-[480px] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <div className="p-1.5 bg-blue-600 rounded-lg">
                <Bot size={18} />
              </div>
              <div>
                <div className="font-bold text-xs">{t('Bharat_Kaushal_Assistant_cp9zr', `Bharat Kaushal Assistant`)}</div>
                <div className="text-[10px] text-slate-400">{t('Live_Support___Statutory_Helpl_f4rqk', `Live Support & Statutory Helplines`)}</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X size={16} />
            </button>
          </div>

          {/* Statutory Helplines Strip */}
          <div className="bg-amber-50 border-b border-amber-200 px-3 py-1.5 text-[10px] text-amber-900 flex items-center justify-between">
            <a href="tel:1915" className="font-semibold hover:underline flex items-center gap-1">
              <PhoneCall size={10} />
              <span>{t('Consumer_Helpline__1915_e98ro', `Consumer Helpline: 1915`)}</span>
            </a>
            <a href="tel:112" className="font-bold text-rose-700 hover:underline">
              {t('Police___SOS__112_v0wxz', `Police / SOS: 112`)}</a>
          </div>

          {/* Message List */}
          <div ref={scrollRef} className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'BOT' && (
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={14} />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 ${
                    m.sender === 'USER'
                      ? 'bg-blue-600 text-white rounded-br-xs'
                      : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>
                  {m.actions && m.actions.length > 0 && (
                    <div className="mt-2 space-y-1 pt-1 border-t border-slate-200/60">
                      {m.actions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => handleActionClick(act.action)}
                          className="w-full text-left px-2 py-1 bg-white hover:bg-blue-50 text-blue-700 rounded-md text-[11px] font-medium transition-colors flex items-center justify-between border border-slate-200"
                        >
                          <span>{act.label}</span>
                          <ChevronRight size={12} />
                        </button>
                      ))}
                    </div>
                  )}
                  <span className="block text-[9px] opacity-60 text-right mt-1">
                    {m.timestamp}
                  </span>
                </div>
                {m.sender === 'USER' && (
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User size={13} />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2 items-center text-[11px] text-slate-400 italic">
                <Bot size={14} />
                <span>{t('Checking_Indore_live_system____fozr1', `Checking Indore live system...`)}</span>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[10px]">
            <button
              onClick={() => handleSend('Where is my worker right now?')}
              className="px-2 py-1 bg-white border border-slate-200 hover:bg-blue-50 rounded-full whitespace-nowrap text-slate-700"
            >
              {t('Where_is_my_worker__u0ryh', `Where is my worker?`)}</button>
            <button
              onClick={() => handleSend('How is the trust score calculated?')}
              className="px-2 py-1 bg-white border border-slate-200 hover:bg-blue-50 rounded-full whitespace-nowrap text-slate-700"
            >
              {t('Trust_Score_Formula_cbpbr', `Trust Score Formula`)}</button>
            {isPricingAllowed && (
              <button
                onClick={() => handleSend('What is the Indore price benchmark?')}
                className="px-2 py-1 bg-white border border-slate-200 hover:bg-blue-50 rounded-full whitespace-nowrap text-slate-700"
              >
                {t('Indore_Benchmark_Rates_gcelh', `Indore Benchmark Rates`)}
              </button>
            )}
          </div>

          {/* Input Box */}
          <div className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              placeholder={t('Ask_anything_about_jobs__rates_k8305', `Ask anything about jobs, rates, OTPs...`)}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={() => handleSend()}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shrink-0"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
