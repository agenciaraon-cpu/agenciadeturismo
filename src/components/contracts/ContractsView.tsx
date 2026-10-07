import React, { useState } from 'react';
import {
  FileSignature,
  FileText,
  Printer,
  CheckCircle2,
  Clock,
  Shield,
  Send,
  Eye,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ContractInstance } from '../../types';

export const ContractsView: React.FC = () => {
  const { contracts, contractTemplates, reservations, customers, trips, signContract, showToast } = useApp();

  const [selectedContract, setSelectedContract] = useState<ContractInstance | null>(contracts[0] || null);
  const [signerName, setSignerName] = useState('');
  const [signerCpf, setSignerCpf] = useState('');
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContract) return;
    if (!signerName || !signerCpf) {
      alert('Preencha seu nome e CPF para assinar digitalmente.');
      return;
    }
    signContract(selectedContract.id, signerName, signerCpf);
    setIsSignModalOpen(false);
    setSelectedContract((prev) =>
      prev ? { ...prev, signed: true, signedAt: new Date().toISOString(), signerName, signerCpf } : null
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Contratos & Assinatura Digital</h1>
            <span className="rounded-full bg-blue-100 text-blue-700 px-2.5 py-0.5 text-xs font-bold">
              Variáveis Automáticas & LGPD
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Geração de minutas com preenchimento instantâneo de dados do cliente, viagem e valores.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
        >
          <Printer className="h-4 w-4" />
          <span>Imprimir / Gerar PDF</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Contracts List */}
        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider mb-3">
              Contratos Gerados ({contracts.length})
            </h3>
            <div className="space-y-2">
              {contracts.map((cnt) => {
                const isSelected = selectedContract?.id === cnt.id;
                return (
                  <div
                    key={cnt.id}
                    onClick={() => setSelectedContract(cnt)}
                    className={`cursor-pointer rounded-xl p-3 border transition-all text-xs ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-slate-900">{cnt.title}</p>
                      {cnt.signed ? (
                        <span className="rounded bg-emerald-100 text-emerald-800 px-1.5 py-0.5 text-[9px] font-bold">
                          Assinado
                        </span>
                      ) : (
                        <span className="rounded bg-amber-100 text-amber-800 px-1.5 py-0.5 text-[9px] font-bold">
                          Pendente
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {cnt.signed ? `Assinado em ${cnt.signedAt?.split('T')[0]}` : 'Aguardando assinatura do cliente'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modelos & Variáveis (Requisito #23) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Variáveis Dinâmicas Disponíveis</h4>
            <p className="text-[11px] text-slate-500">
              O sistema substitui essas tags automaticamente com os dados reais da reserva:
            </p>
            <div className="flex flex-wrap gap-1 font-mono text-[10px]">
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-blue-700">&#123;&#123;nome_cliente&#125;&#125;</span>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-blue-700">&#123;&#123;cpf&#125;&#125;</span>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-blue-700">&#123;&#123;viagem&#125;&#125;</span>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-blue-700">&#123;&#123;valor&#125;&#125;</span>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-blue-700">&#123;&#123;data_saida&#125;&#125;</span>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-blue-700">&#123;&#123;destino&#125;&#125;</span>
            </div>
          </div>
        </div>

        {/* Right Column: Contract Preview Document */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          {selectedContract ? (
            <>
              {/* Document Header & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">{selectedContract.title}</h2>
                  <p className="text-xs text-slate-500">Documento de prestação de serviços turísticos</p>
                </div>

                <div className="flex items-center gap-2">
                  {selectedContract.signed ? (
                    <div className="flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-800">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Assinado Eletronicamente</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setSignerName('');
                        setSignerCpf('');
                        setIsSignModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
                    >
                      <FileSignature className="h-4 w-4" />
                      <span>Assinar Agora</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Rendered Contract Document Sheet */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/40 p-6 sm:p-8 font-serif text-xs leading-relaxed text-slate-800 shadow-inner whitespace-pre-line max-h-[60vh] overflow-y-auto">
                {selectedContract.renderedContent}
              </div>

              {/* Digital Signature Metadata Box */}
              {selectedContract.signed && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 text-xs space-y-1">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <Shield className="h-4 w-4 text-emerald-600" />
                    <span>Registro de Validade Jurídica e Integridade (MP 2.200-2 / LGPD)</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Assinado por: <b>{selectedContract.signerName}</b> • CPF: {selectedContract.signerCpf}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Data/Hora: {selectedContract.signedAt} • IP de Registro: {selectedContract.signerIp || '189.120.45.102'}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center text-slate-400">
              <FileText className="mx-auto h-12 w-12 mb-2 text-slate-300" />
              <p>Selecione um contrato para visualizar.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Assinar Contrato */}
      {isSignModalOpen && selectedContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Assinatura Eletrônica do Contrato</h3>
            <p className="text-xs text-slate-500">
              Confirme seus dados para emissão da assinatura digital vinculada ao seu IP.
            </p>

            <form onSubmit={handleSign} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome Completo do Signatário *</label>
                <input
                  type="text"
                  required
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  placeholder="Nome do cliente"
                  className="w-full rounded-xl border border-slate-200 p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">CPF *</label>
                <input
                  type="text"
                  required
                  value={signerCpf}
                  onChange={(e) => setSignerCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full rounded-xl border border-slate-200 p-2.5"
                />
              </div>

              <div className="rounded-xl bg-slate-50 p-3 text-[11px] text-slate-600 border border-slate-200">
                Ao clicar em "Confirmar Assinatura", você declara que concorda com todas as cláusulas do contrato de
                prestação de serviços da viagem.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSignModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
                >
                  Confirmar Assinatura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
