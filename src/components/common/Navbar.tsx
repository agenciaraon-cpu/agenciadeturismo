import React, { useState } from 'react';
import {
  Search,
  PlusCircle,
  Bell,
  ExternalLink,
  Shield,
  RotateCcw,
  UserCheck,
  Compass,
  Menu,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const {
    agency,
    currentUser,
    currentRole,
    setCurrentRole,
    setCurrentView,
    setIsGlobalSearchOpen,
    installments,
    documents,
    contracts,
    resetDemoData,
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Count urgent items
  const overdueInstallments = installments.filter((i) => i.status === 'atrasado');
  const pendingDocs = documents.filter((d) => d.status === 'pendente' || d.status === 'recusado');
  const unsignedContracts = contracts.filter((c) => !c.signed);
  const totalUrgent = overdueInstallments.length + pendingDocs.length + unsignedContracts.length;

  const roleLabels: Record<UserRole, { label: string; color: string }> = {
    admin: { label: 'Administrador (Geral)', color: 'bg-blue-600 text-white' },
    gerente: { label: 'Gerente', color: 'bg-indigo-600 text-white' },
    comercial: { label: 'Comercial (CRM & Vendas)', color: 'bg-emerald-600 text-white' },
    operacional: { label: 'Operacional (Viagens & Guias)', color: 'bg-cyan-600 text-white' },
    financeiro: { label: 'Financeiro', color: 'bg-amber-600 text-white' },
    guia: { label: 'Guia de Turismo', color: 'bg-purple-600 text-white' },
    saas_owner: { label: 'SaaS Master (ADMIN RAON)', color: 'bg-slate-900 text-white' },
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6 shadow-xs">
      {/* Left: Mobile Toggle & Agency Brand */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 md:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold shadow-xs">
            <Compass className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-slate-900">RAON TRAVEL</span>
              <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700">SaaS</span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 truncate max-w-[160px] sm:max-w-xs">
              {agency.name}
            </p>
          </div>
        </div>
      </div>

      {/* Center: Global Search Trigger */}
      <div className="hidden sm:flex flex-1 max-w-md mx-4">
        <button
          onClick={() => setIsGlobalSearchOpen(true)}
          className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2 text-sm text-slate-400 hover:border-slate-300 hover:bg-slate-100/70 transition-all shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-slate-400" />
            <span className="text-slate-500 text-xs sm:text-sm">Buscar cliente, viagem, reserva, guia...</span>
          </div>
          <kbd className="hidden md:inline-flex items-center gap-0.5 rounded border border-slate-300 bg-white px-1.5 text-[10px] font-medium text-slate-500">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right: Actions, Notifications, Role Switcher */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Button */}
        <button
          onClick={() => setIsGlobalSearchOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 sm:hidden"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Portal do Viajante simulator */}
        <button
          onClick={() => setCurrentView('traveler_portal')}
          className="hidden lg:flex items-center gap-1.5 rounded-lg border border-cyan-200 bg-cyan-50/70 px-2.5 py-1.5 text-xs font-semibold text-cyan-800 hover:bg-cyan-100 transition-colors"
          title="Ver o Portal do Viajante como o cliente vê no celular"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span>Portal do Viajante</span>
        </button>

        {/* Notifications & Pending Items */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Central de Pendências"
          >
            <Bell className="h-4 w-4" />
            {totalUrgent > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white shadow-xs">
                {totalUrgent}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">Central de Alertas</h4>
                <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                  {totalUrgent} pendências
                </span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto text-xs">
                {overdueInstallments.length > 0 && (
                  <div
                    onClick={() => {
                      setCurrentView('finance');
                      setShowNotifications(false);
                    }}
                    className="flex cursor-pointer items-start gap-2 rounded-xl bg-rose-50/70 p-2.5 text-rose-900 hover:bg-rose-100/70 transition-colors"
                  >
                    <span className="text-base">🔴</span>
                    <div>
                      <p className="font-semibold">{overdueInstallments.length} parcelas em atraso</p>
                      <p className="text-[11px] text-rose-700">Acesse o financeiro para enviar cobrança amigável.</p>
                    </div>
                  </div>
                )}

                {pendingDocs.length > 0 && (
                  <div
                    onClick={() => {
                      setCurrentView('documents');
                      setShowNotifications(false);
                    }}
                    className="flex cursor-pointer items-start gap-2 rounded-xl bg-amber-50/70 p-2.5 text-amber-900 hover:bg-amber-100/70 transition-colors"
                  >
                    <span className="text-base">⚠️</span>
                    <div>
                      <p className="font-semibold">{pendingDocs.length} documentos pendentes</p>
                      <p className="text-[11px] text-amber-700">Documentos de passageiros aguardando envio.</p>
                    </div>
                  </div>
                )}

                {unsignedContracts.length > 0 && (
                  <div
                    onClick={() => {
                      setCurrentView('contracts');
                      setShowNotifications(false);
                    }}
                    className="flex cursor-pointer items-start gap-2 rounded-xl bg-blue-50/70 p-2.5 text-blue-900 hover:bg-blue-100/70 transition-colors"
                  >
                    <span className="text-base">📝</span>
                    <div>
                      <p className="font-semibold">{unsignedContracts.length} contratos não assinados</p>
                      <p className="text-[11px] text-blue-700">Disponíveis para assinatura eletrônica.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher (Simula diferentes perfis para o usuário testar permissões) */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold shadow-2xs transition-all ${roleLabels[currentRole].color}`}
            title="Alternar perfil de acesso para testar permissões"
          >
            <Shield className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{roleLabels[currentRole].label.split(' ')[0]}</span>
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50">
              <div className="px-2 py-1.5 border-b border-slate-100 mb-1">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Alternar Perfil (RBAC)</p>
                <p className="text-xs text-slate-600 font-medium">Teste o sistema com cada nível de permissão:</p>
              </div>
              <div className="space-y-1">
                {(Object.keys(roleLabels) as UserRole[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setCurrentRole(role);
                      setShowRoleMenu(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-left transition-colors ${
                      currentRole === role ? 'bg-slate-100 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{roleLabels[role].label}</span>
                    {currentRole === role && <UserCheck className="h-3.5 w-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reset Demo Data Button */}
        <button
          onClick={resetDemoData}
          className="hidden xl:flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
          title="Restaurar dados de demonstração originais da agência"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset Demo</span>
        </button>
      </div>
    </header>
  );
};
