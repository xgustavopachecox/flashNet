"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar_Main from '@/components/Sidebar_Main';
import Activity_Log_Table from '@/components/Activity_Log_Table';
import Top_Nav from '@/components/Top_Nav';
import { Filter, Download, ChevronLeft, ChevronRight } from 'lucide-react';

// Mock data generation for logic demonstration
const MOCK_ACTIVITIES = [
  {
    id: '1',
    datetime: 'Out 24, 2023 14:32:05',
    user: { name: 'Sarah Connor', avatar: 'https://i.pravatar.cc/150?u=9', role: 'MEMBRO' },
    action: 'CARD MOVIMENTADO' as const,
    entity: 'Hero Section Refactor',
    justification: 'Movido de Em Andamento para Revisão de QA. Marco do caminho crítico atingido antes do prazo.'
  },
  {
    id: '2',
    datetime: 'Out 24, 2023 12:15:44',
    user: { name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=10', role: 'ADMIN' },
    action: 'CARD CRIADO' as const,
    entity: 'API Auth Debugging',
    justification: 'Descoberto caso extremo no ciclo de atualização do JWT durante os testes de homologação. Priorizando como P1.'
  },
  {
    id: '3',
    datetime: 'Out 23, 2023 17:45:10',
    user: { name: 'Alex Rivers', avatar: 'https://i.pravatar.cc/150?u=1', role: 'MEMBRO' },
    action: 'CARD ARQUIVADO' as const,
    entity: 'Deprecated Legacy Fonts',
    justification: 'Limpeza de dívida técnica. Todos os ativos foram migrados com sucesso para a nova CDN do design system.'
  },
  {
    id: '4',
    datetime: 'Out 23, 2023 09:02:12',
    user: { name: 'Monica Geller', avatar: 'https://i.pravatar.cc/150?u=12', role: 'ADMIN' },
    action: 'DETALHES ATUALIZADOS' as const,
    entity: 'Content Strategy Q4',
    justification: 'Critérios de aceitação revisados com base no feedback das partes interessadas na reunião de alinhamento de sexta-feira.'
  }
];

export default function ActivityLogPage() {
  const params = useParams();
  const router = useRouter();
  const [boardName, setBoardName] = useState('Sprint 24');

  useEffect(() => {
    const boardId = params?.id as string;
    if (boardId === 'mkt-digital') setBoardName('Marketing Digital');
    else if (boardId === 'dev-tic-tac') setBoardName('Desenvolvimento Tic Tac');
  }, [params?.id]);

  const handleNavigateToConstruction = () => router.push('/construction');

  return (
    <div className="flex w-full h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar_Main />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Consistent Top Navigation */}
        <Top_Nav boardName={boardName} activeTab="activity" />

        <main className="flex-1 p-[2.5rem] overflow-y-auto">
          {/* Internal Page Header Section */}
          <header className="mb-[2.5rem]">
            <nav className="flex items-center gap-[0.5rem] mb-[0.75rem] animate-fade-in">
              <span className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors" onClick={() => router.push(`/board/${params?.id}`)}>{boardName}</span>
              <span className="text-slate-300 text-[0.8rem]">&rsaquo;</span>
              <span className="text-[0.65rem] font-black text-blue-600 uppercase tracking-widest">Log de Auditoria</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-[1.5rem]">
              <div className="animate-slide-up">
                <h1 className="text-[2.2rem] font-extrabold text-slate-800 tracking-tight leading-tight">
                  Atividade do Quadro - <span className="text-blue-600">{boardName}</span>
                </h1>
                <p className="text-[0.95rem] text-slate-500 font-medium max-w-[40rem] mt-[0.5rem] leading-relaxed">
                  Registro cronológico completo das interações da equipe, mudanças de estado e justificativas editoriais para o ciclo de sprint atual.
                </p>
              </div>

              <div className="flex items-center gap-[1rem] animate-fade-in-delayed">
                <button 
                  onClick={handleNavigateToConstruction}
                  className="flex items-center gap-[0.75rem] px-[1.25rem] py-[0.75rem] bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-[0.85rem] hover:border-blue-600 hover:text-blue-600 hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <Filter size={18} /> Filtrar
                </button>
                <button 
                  onClick={handleNavigateToConstruction}
                  className="flex items-center gap-[0.75rem] px-[1.25rem] py-[0.75rem] bg-blue-600 border border-blue-700 rounded-xl text-white font-bold text-[0.85rem] hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-[0.98]"
                >
                  <Download size={18} /> Exportar
                </button>
              </div>
            </div>
          </header>

          {/* Table Container */}
          <section className="animate-scale-in">
            <Activity_Log_Table entries={MOCK_ACTIVITIES} />
          </section>

          {/* Footer Navigation */}
          <footer className="mt-[2rem] flex flex-col sm:flex-row items-center justify-between gap-[1.5rem] py-[1.5rem] border-t border-slate-200 animate-fade-in">
            <span className="text-[0.8rem] text-slate-500 font-bold">
              Exibindo <span className="text-slate-800">1-20</span> de <span className="text-slate-800">1.248</span> atividades do quadro
            </span>

            <div className="flex items-center gap-[0.5rem]">
              <button 
                onClick={handleNavigateToConstruction}
                className="w-[2.2rem] h-[2.2rem] flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:border-blue-600 hover:text-blue-600 hover:bg-white transition-all active:scale-90"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex items-center gap-[0.5rem]">
                <button className="w-[2.2rem] h-[2.2rem] rounded-xl bg-blue-600 text-white font-black text-[0.8rem] shadow-md shadow-blue-100 flex items-center justify-center hover:scale-105 active:scale-95 transition-all">1</button>
                <button onClick={handleNavigateToConstruction} className="w-[2.2rem] h-[2.2rem] rounded-xl bg-white border border-slate-200 text-slate-600 font-black text-[0.8rem] flex items-center justify-center hover:border-blue-600 hover:text-blue-600 active:scale-95 transition-all">2</button>
                <button onClick={handleNavigateToConstruction} className="w-[2.2rem] h-[2.2rem] rounded-xl bg-white border border-slate-200 text-slate-600 font-black text-[0.8rem] flex items-center justify-center hover:border-blue-600 hover:text-blue-600 active:scale-95 transition-all">3</button>
              </div>

              <button 
                onClick={handleNavigateToConstruction}
                className="w-[2.2rem] h-[2.2rem] flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:border-blue-600 hover:text-blue-600 hover:bg-white transition-all active:scale-90"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
