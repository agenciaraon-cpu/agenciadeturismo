import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Copy,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Settings,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CommunicationView: React.FC = () => {
  const { customers, trips, reservations, agency, showToast } = useApp();

  const [selectedTemplate, setSelectedTemplate] = useState<string>('confirmacao');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [selectedTripId, setSelectedTripId] = useState<string>(trips[0]?.id || '');
  const [customMessage, setCustomMessage] = useState<string>('');

  const customer = customers.find((c) => c.id === selectedCustomerId) || customers[0];
  const trip = trips.find((t) => t.id === selectedTripId) || trips[0];
  const customerRes = reservations.find((r) => r.customerId === customer?.id && r.tripId === trip?.id);

  // Template generators
  const getTemplateContent = (type: string): string => {
    switch (type) {
      case 'confirmacao':
        return `Olá, *${customer?.name || 'Cliente'}*! ✈️\n\nSua reserva para *${trip?.name || 'sua viagem'}* foi confirmada com sucesso pela *${agency.name}*!\n\n📅 *Data de Saída:* ${trip?.departureDate} às ${trip?.departureTime}\n📍 *Local de Embarque:* ${trip?.departureLocation}\n🔖 *Código da Reserva:* ${customerRes?.code || 'RES-1001'}\n\nQualquer dúvida, estamos à total disposição! Tenha uma excelente viagem!`;

      case 'cobranca':
        return `Olá, *${customer?.name || 'Cliente'}*! Tudo bem? Esperamos que sim!\n\nPassando para enviar com carinho o lembrete sobre a parcela da sua viagem *${trip?.name || 'sua viagem'}*, no valor de *R$ 1.850,00*.\n\nPara facilitar seu pagamento, nossa chave Pix é o CNPJ: *${agency.cnpj}* (${agency.name}).\n\nAssim que efetuar o pagamento, basta nos enviar o comprovante por aqui. Muito obrigado! 💙`;

      case 'doc_pendente':
        return `Olá, *${customer?.name || 'Cliente'}*! 📄\n\nPara que possamos emitir a lista oficial de passageiros do Ministério do Turismo e a apólice de seguro da sua viagem para *${trip?.destination}*, precisamos do envio do *documento com foto (RG ou CNH)* dos passageiros.\n\nPoderia nos enviar uma foto legível por aqui hoje mesmo? Obrigado pela colaboração!`;

      case 'embarque':
        return `Olá, viajante *${customer?.name || 'Cliente'}*! 🚌🎒\n\nFalta pouco para a nossa saída rumo a *${trip?.destination}*!\n\nLembramos os detalhes do embarque:\n📅 *Data:* ${trip?.departureDate}\n⏰ *Horário:* ${trip?.departureTime} (chegar 30 min antes)\n📍 *Ponto de Encontro:* ${trip?.departureLocation}\n\nNão esqueça de levar seu documento original com foto e remédios de uso pessoal. Até breve!`;

      case 'pos_venda':
        return `Olá, *${customer?.name || 'Cliente'}*! Esperamos que tenha descansado bastante! ☀️\n\nComo foi sua experiência na viagem para *${trip?.destination}* com a *${agency.name}*? Adoraríamos ouvir seu feedback para continuarmos evoluindo nossos roteiros.\n\nSe puder nos avaliar no Google ou marcar nosso Instagram @${agency.instagram}, ficaremos muito felizes! Até a próxima aventura! ✈️`;

      default:
        return '';
    }
  };

  const messageText = customMessage || getTemplateContent(selectedTemplate);

  const handleOpenWhatsApp = () => {
    if (!customer?.phone && !customer?.whatsapp) {
      alert('Cliente sem telefone cadastrado.');
      return;
    }
    const cleanPhone = (customer.whatsapp || customer.phone).replace(/\D/g, '');
    const url = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(messageText)}`;
    window.open(url, '_blank');
  };

  const handleCopyMessage = () => {
    navigator.clipboard?.writeText(messageText);
    showToast('Mensagem copiada para a área de transferência!');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Central de Comunicação & WhatsApp</h1>
            <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-xs font-bold">
              Templates Dinâmicos
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Envie confirmações, cobranças amigáveis, lembretes de embarque e pós-venda direto no WhatsApp do cliente.
          </p>
        </div>
      </div>

      {/* WhatsApp Official Business API Status Widget (Requisito #27) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-xs text-slate-900">WhatsApp Business API (Cloud API)</h3>
              <span className="rounded bg-slate-100 text-slate-600 px-2 py-0.5 text-[10px] font-bold">
                WhatsApp não configurado (Modo Link Direto Ativo)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              O sistema utiliza abertura direta via wa.me sem custos. Para disparos em massa automáticos, conecte suas credenciais da Meta posteriormente.
            </p>
          </div>
        </div>

        <button
          onClick={() => showToast('Módulo de credenciais da Meta API pronto para integração comercial.', 'info')}
          className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shrink-0"
        >
          Configurar API Oficial
        </button>
      </div>

      {/* Main Templates and Generator Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Select Template & Customer */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-3 text-xs">
            <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">1. Escolha o Template</h4>
            <div className="space-y-1.5">
              {[
                { id: 'confirmacao', label: '✓ Confirmação de Reserva' },
                { id: 'cobranca', label: '💳 Cobrança Amigável / Parcela' },
                { id: 'doc_pendente', label: '📄 Documento Pendente' },
                { id: 'embarque', label: '🚌 Informações de Embarque' },
                { id: 'pos_venda', label: '⭐ Pesquisa de Pós-Venda' },
              ].map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => {
                    setSelectedTemplate(tmpl.id);
                    setCustomMessage('');
                  }}
                  className={`w-full text-left rounded-xl p-2.5 font-bold transition-all ${
                    selectedTemplate === tmpl.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {tmpl.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-3 text-xs">
            <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">2. Destinatário & Viagem</h4>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Cliente</label>
              <select
                value={selectedCustomerId}
                onChange={(e) => {
                  setSelectedCustomerId(e.target.value);
                  setCustomMessage('');
                }}
                className="w-full rounded-xl border border-slate-200 p-2.5"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Viagem</label>
              <select
                value={selectedTripId}
                onChange={(e) => {
                  setSelectedTripId(e.target.value);
                  setCustomMessage('');
                }}
                className="w-full rounded-xl border border-slate-200 p-2.5"
              >
                {trips.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Live Message Preview */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Prévia da Mensagem Formatada</h3>
              <p className="text-xs text-slate-500">Destinatário: {customer?.name} ({customer?.phone})</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopyMessage}
                className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Copiar</span>
              </button>
              <button
                onClick={handleOpenWhatsApp}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Abrir WhatsApp Web</span>
              </button>
            </div>
          </div>

          {/* WhatsApp Chat Simulated Bubble */}
          <div className="rounded-2xl bg-[#E5DDD5] p-5 shadow-inner">
            <div className="max-w-md rounded-2xl bg-white p-4 shadow-md text-xs text-slate-800 space-y-2 whitespace-pre-line leading-relaxed border border-slate-200/50">
              {messageText}
              <div className="text-[10px] text-slate-400 text-right">Agora mesmo ✓✓</div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Editar Mensagem antes de enviar (Opcional):
            </label>
            <textarea
              rows={4}
              value={messageText}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 p-3 text-xs text-slate-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
