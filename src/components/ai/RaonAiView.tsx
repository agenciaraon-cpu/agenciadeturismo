import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  TrendingUp,
  AlertCircle,
  FileText,
  MapPin,
  MessageSquare,
  Bot,
  User,
  Compass,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RaonAiView: React.FC = () => {
  const { trips, reservations, installments, expenses, customers, travelers, documents, agency } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<
    { role: 'user' | 'assistant'; text: string; timestamp: string }[]
  >([
    {
      role: 'assistant',
      text: `Olá! Eu sou o **RAON IA**, seu copiloto de inteligência operacional e financeira para a agência.\n\nJá analisei suas **${trips.length} viagens**, **${reservations.length} reservas** e **${travelers.length} passageiros**. Como posso te ajudar hoje?\n\n• Analisar viagens com margem baixa\n• Identificar inadimplência e sugerir ações de cobrança\n• Gerar roteiros e descrições comerciais atrativas\n• Avaliar ocupação das vagas`,
      timestamp: 'Hoje',
    },
  ]);

  // Context payload sent to server
  const contextData = {
    agencyName: agency.name,
    trips: trips.map((t) => {
      const tripRevenue = reservations
        .filter((r) => r.tripId === t.id && r.status !== 'cancelada')
        .reduce((sum, r) => sum + r.finalValue, 0);
      const tripCost = expenses.filter((e) => e.tripId === t.id).reduce((sum, e) => sum + e.amount, 0);
      const marginPct = tripRevenue > 0 ? (((tripRevenue - tripCost) / tripRevenue) * 100).toFixed(1) : 0;
      const booked = reservations
        .filter((r) => r.tripId === t.id && r.status !== 'cancelada')
        .reduce((sum, r) => sum + r.travelerDetails.length, 0);

      return {
        id: t.id,
        name: t.name,
        destination: t.destination,
        capacity: t.capacity,
        booked,
        occupancyPct: t.capacity > 0 ? ((booked / t.capacity) * 100).toFixed(1) : 0,
        price: t.price,
        totalRevenue: tripRevenue,
        totalCost: tripCost,
        marginPct: Number(marginPct),
      };
    }),
    finance: {
      totalReceived: installments.filter((i) => i.status === 'pago').reduce((s, i) => s + i.amount, 0),
      totalPending: installments.filter((i) => i.status === 'pendente').reduce((s, i) => s + i.amount, 0),
      overdueAmount: installments.filter((i) => i.status === 'atrasado').reduce((s, i) => s + i.amount, 0),
      overdueCount: installments.filter((i) => i.status === 'atrasado').length,
    },
    pendingDocsCount: documents.filter((d) => d.status === 'pendente' || d.status === 'recusado').length,
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg = { role: 'user' as const, text, timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          contextData,
        }),
      });

      const data = await response.json();
      const reply = data.text || 'Não consegui processar a resposta no momento.';

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: reply,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Erro de conexão com o assistente IA. Tente novamente em instantes.',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    'Quais viagens estão com baixa margem de rentabilidade?',
    'Resuma os pagamentos em atraso e sugira mensagens de cobrança amigável.',
    'Como está a taxa de ocupação dos nossos pacotes turísticos?',
    'Crie uma descrição irresistível para a viagem de Porto Seguro.',
    'Quais as maiores pendências operacionais da agência agora?',
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">RAON IA Copilot</h1>
            <span className="rounded-full bg-cyan-100 text-cyan-800 px-2.5 py-0.5 text-xs font-bold flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              Gemini 3.8 Flash Integrado
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Inteligência analítica conectada em tempo real com todos os dados da sua agência.
          </p>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips (Requisito #32) */}
      <div className="flex flex-wrap gap-2">
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            disabled={loading}
            className="rounded-xl border border-cyan-200 bg-cyan-50/60 px-3 py-1.5 text-xs font-semibold text-cyan-900 hover:bg-cyan-100 transition-colors text-left flex items-center gap-1.5"
          >
            <Sparkles className="h-3 w-3 text-cyan-600 shrink-0" />
            <span>{q}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Layout */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs flex flex-col h-[65vh]">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-bold text-xs shadow-xs ${
                  msg.role === 'assistant'
                    ? 'bg-linear-to-br from-cyan-600 to-blue-600 text-white'
                    : 'bg-slate-900 text-white'
                }`}
              >
                {msg.role === 'assistant' ? <Sparkles className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed shadow-2xs whitespace-pre-line ${
                  msg.role === 'assistant'
                    ? 'bg-slate-50 border border-slate-200 text-slate-800'
                    : 'bg-blue-600 text-white'
                }`}
              >
                {msg.text}
                <div
                  className={`mt-1.5 text-[10px] ${
                    msg.role === 'assistant' ? 'text-slate-400' : 'text-blue-200'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-600 text-white animate-pulse">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-500 italic">
                O RAON IA está consultando os dados operacionais da agência...
              </div>
            </div>
          )}
        </div>

        {/* Chat Input Bar */}
        <div className="border-t border-slate-200 p-3 sm:p-4 bg-slate-50/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Pergunte ao RAON IA sobre margens, viagens, cobranças ou peça para redigir roteiros..."
              className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md active:scale-95"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
