import React, { useState } from 'react';
import {
  Compass,
  Building2,
  Phone,
  Users,
  Settings,
  Plane,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { agency, updateAgency, setCurrentView, showToast } = useApp();

  const [step, setStep] = useState(1);
  const [agencyName, setAgencyName] = useState(agency.name);
  const [whatsapp, setWhatsapp] = useState(agency.whatsapp);
  const [email, setEmail] = useState(agency.email);
  const [teamMembers, setTeamMembers] = useState('Carlos (Admin), Mariana (Gerente), Rodrigo (Vendas)');
  const [policyNotes, setPolicyNotes] = useState(agency.termsAndPolicies);

  if (!isOpen) return null;

  const handleFinish = () => {
    updateAgency({
      name: agencyName,
      whatsapp,
      email,
      termsAndPolicies: policyNotes,
    });
    onClose();
    setCurrentView('trips');
    showToast('Onboarding concluído com sucesso! Agora vamos criar sua viagem.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Top Progress Indicator */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white font-bold">
              <Compass className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-slate-900">Configuração Inicial da Agência</h2>
              <p className="text-[11px] text-slate-500">Passo {step} de 6</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300 rounded-full"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="min-h-56">
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-600">
                <Building2 className="h-5 w-5" />
                <h3 className="font-black text-base text-slate-900">Passo 1: Nome da sua Agência</h3>
              </div>
              <p className="text-xs text-slate-600">
                Como os viajantes conhecem a sua agência? Esse nome aparecerá no Portal do Viajante e nos contratos.
              </p>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome Fantasia da Agência</label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-cyan-600">
                <Compass className="h-5 w-5" />
                <h3 className="font-black text-base text-slate-900">Passo 2: Logotipo e Identidade</h3>
              </div>
              <p className="text-xs text-slate-600">
                A marca da sua agência é exibida com destaque. Você pode atualizar seu logo ou manter o ícone moderno padrão.
              </p>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-md">
                  {agencyName.substring(0, 2).toUpperCase()}
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-900">{agencyName}</p>
                  <p className="text-slate-500 text-[11px]">Identidade visual digital ativada</p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-600">
                <Phone className="h-5 w-5" />
                <h3 className="font-black text-base text-slate-900">Passo 3: WhatsApp e Contato Oficial</h3>
              </div>
              <p className="text-xs text-slate-600">
                Por onde seus clientes conversam com você? Utilizaremos para disparar mensagens diretas com 1 clique.
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp de Suporte</label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">E-mail Comercial</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-600">
                <Users className="h-5 w-5" />
                <h3 className="font-black text-base text-slate-900">Passo 4: Equipe e Perfis de Acesso</h3>
              </div>
              <p className="text-xs text-slate-600">
                Sua equipe tem acesso com perfis dedicados (Administrador, Comercial, Operacional, Financeiro e Guia).
              </p>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Membros Iniciais</label>
                <input
                  type="text"
                  value={teamMembers}
                  onChange={(e) => setTeamMembers(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-600">
                <Settings className="h-5 w-5" />
                <h3 className="font-black text-base text-slate-900">Passo 5: Políticas de Cancelamento</h3>
              </div>
              <p className="text-xs text-slate-600">
                Defina as regras gerais de cancelamento que constarão nas minutas dos contratos.
              </p>
              <textarea
                rows={3}
                value={policyNotes}
                onChange={(e) => setPolicyNotes(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
              />
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4 text-center py-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600 shadow-sm">
                <Plane className="h-7 w-7" />
              </div>
              <h3 className="font-black text-lg text-slate-900">Vamos configurar sua primeira viagem!</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Sua agência está pronta na plataforma RAON TRAVEL. Agora, crie sua primeira viagem para iniciar a venda
                de vagas e emissão de contratos.
              </p>
            </div>
          )}
        </div>

        {/* Modal Controls */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Voltar</span>
            </button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 active:scale-98"
            >
              <span>Próximo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 active:scale-98"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Concluir & Criar Viagem</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
