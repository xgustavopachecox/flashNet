"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar_Main from '@/components/Sidebar_Main';
import Activity_Log_Table from '@/components/Activity_Log_Table';
import Top_Nav from '@/components/Top_Nav';
import Board_Settings_Modal from '@/components/modals/Board_Settings_Modal';
import { Settings, Download, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ActivityLogPage() {
  const params = useParams();
  const router = useRouter();
  const [boardName, setBoardName] = useState('Sprint 24');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentBoardDesc, setCurrentBoardDesc] = useState('Workspace editorial para controle de tarefas e sprint.');
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const boardId = params?.id as string;
    let name = 'Sprint 24';
    if (boardId === 'mkt-digital') name = 'Marketing Digital';
    else if (boardId === 'dev-tic-tac') name = 'Desenvolvimento Tic Tac';
    
    setBoardName(name);

    // Load persistent info
    const savedInfo = localStorage.getItem(`tictac_board_info_${boardId}`);
    if (savedInfo) {
      try {
        const parsed = JSON.parse(savedInfo);
        setBoardName(parsed.name || name);
        setCurrentBoardDesc(parsed.description || 'Workspace editorial para controle de tarefas e sprint.');
      } catch (e) {}
    }

    // Load persistent activities
    const savedLogs = localStorage.getItem(`tictac_activity_log_${boardId}`);
    if (savedLogs) {
      try {
        setActivities(JSON.parse(savedLogs));
      } catch (e) {}
    }
  }, [params?.id]);

  const handleSaveSettings = (data: { name: string; description: string; isArchived: boolean }) => {
    setBoardName(data.name);
    setCurrentBoardDesc(data.description);
    
    localStorage.setItem(`tictac_board_info_${params?.id}`, JSON.stringify({
      name: data.name,
      description: data.description,
      isArchived: data.isArchived
    }));

    setIsSettingsOpen(false);
    window.location.reload();
  };

  const handleNavigateToConstruction = () => router.push('/construction');

  return (
    <div className="flex w-full h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar_Main activeView="none" />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Top_Nav boardName={boardName} activeTab="activity" />

        <main className="flex-1 p-[2.5rem] overflow-y-auto">
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
                  {currentBoardDesc}
                </p>
              </div>

              <div className="flex items-center gap-[1rem] animate-fade-in-delayed">
                <button 
                   onClick={() => setIsSettingsOpen(true)}
                  className="flex items-center gap-[0.75rem] px-[1.25rem] py-[0.75rem] bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-[0.85rem] hover:border-blue-600 hover:text-blue-600 hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <Settings size={18} /> Configurações
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

          <section className="animate-scale-in">
            <Activity_Log_Table entries={activities} />
          </section>

          <footer className="mt-[2rem] flex flex-col sm:flex-row items-center justify-between gap-[1.5rem] py-[1.5rem] border-t border-slate-200 animate-fade-in">
            <span className="text-[0.8rem] text-slate-500 font-bold">
              Exibindo <span className="text-slate-800">1-{activities.length}</span> de <span className="text-slate-800">{activities.length}</span> atividades do quadro
            </span>

            <div className="flex items-center gap-[0.5rem]">
               <button className="w-[2.2rem] h-[2.2rem] flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 opacity-50 cursor-not-allowed">
                  <ChevronLeft size={18} />
               </button>
               <button className="w-[2.2rem] h-[2.2rem] rounded-xl bg-blue-600 text-white font-black text-[0.8rem] shadow-md shadow-blue-100 flex items-center justify-center">1</button>
               <button className="w-[2.2rem] h-[2.2rem] flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 opacity-50 cursor-not-allowed">
                  <ChevronRight size={18} />
               </button>
            </div>
          </footer>
        </main>
      </div>

      <Board_Settings_Modal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentData={{ name: boardName, description: currentBoardDesc }}
        onSave={handleSaveSettings}
      />
    </div>
  );
}
