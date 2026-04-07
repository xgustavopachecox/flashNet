"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar_Main from '@/components/Sidebar_Main';
import Global_Activity_Table from '@/components/Global_Activity_Table';
import Top_Nav from '@/components/Top_Nav';
import { Settings, Download, Search, Filter, Calendar, Users, Briefcase } from 'lucide-react';

export default function GlobalActivityLogPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Scan all board logs in localStorage
    const allActivities: any[] = [];
    const keys = Object.keys(localStorage);
    
    // Group 1: Board IDs from activity logs
    const activityKeys = keys.filter(k => k.startsWith('tictac_activity_log_'));
    
    activityKeys.forEach(k => {
      const boardId = k.replace('tictac_activity_log_', '');
      const rawLogs = localStorage.getItem(k);
      const rawInfo = localStorage.getItem(`tictac_board_info_${boardId}`);
      
      let boardName = 'Board Desconhecido';
      if (rawInfo) {
        try {
          const parsedInfo = JSON.parse(rawInfo);
          boardName = parsedInfo.name || boardName;
        } catch (e) {}
      } else if (boardId === 'mkt-digital') {
        boardName = 'Marketing Digital';
      } else if (boardId === 'dev-tic-tac') {
        boardName = 'Desenvolvimento Tic Tac';
      }

      if (rawLogs) {
        try {
          const logs = JSON.parse(rawLogs);
          logs.forEach((log: any) => {
             allActivities.push({
               ...log,
               boardName
             });
          });
        } catch (e) {}
      }
    });

    // Sort by timestamp (id is Date.now().toString() in my logActivity)
    allActivities.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    setActivities(allActivities);
  }, []);

  const handleNavigateToConstruction = () => router.push('/construction');

  if (!isClient) return null;

  return (
    <div className="flex w-full h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar_Main activeView="activity" />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Top_Nav boardName="Atividade Global" activeTab="none" />

        <main className="flex-1 p-[2.5rem] pt-[1.5rem] overflow-y-auto">
          {/* Table Container */}
          <section className="animate-scale-in">
            <Global_Activity_Table entries={activities} />
          </section>

          {/* Footer Navigation */}
          <footer className="mt-[2.5rem] flex flex-col sm:flex-row items-center justify-between gap-[2rem] py-[1.5rem] animate-fade-in relative">
            
            {/* Minimalist Page Stats */}
            <span className="text-[0.75rem] text-slate-400 font-bold tracking-tight uppercase opacity-80">
              Mostrando <span className="text-slate-900">1-{activities.length}</span> de <span className="text-slate-900">{activities.length}</span> resultados
            </span>


            {/* Pagination Controls */}
            <div className="flex items-center gap-[1.5rem]">
              <span className="text-[0.9rem] text-slate-300 font-black hover:text-blue-600 transition-colors cursor-pointer select-none prev-page">
                 &lsaquo;
              </span>
              <div className="flex items-center gap-[1rem]">
                 <span className="w-[2rem] h-[2rem] bg-blue-600 text-white font-black text-[0.8rem] rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">1</span>
                 <span onClick={handleNavigateToConstruction} className="text-slate-400 font-black text-[0.8rem] hover:text-blue-600 cursor-pointer transition-all">2</span>
                 <span onClick={handleNavigateToConstruction} className="text-slate-400 font-black text-[0.8rem] hover:text-blue-600 cursor-pointer transition-all">3</span>
                 <span className="text-slate-300 font-black text-[0.8rem]">...</span>
                 <span onClick={handleNavigateToConstruction} className="text-slate-400 font-black text-[0.8rem] hover:text-blue-600 cursor-pointer transition-all">73</span>
              </div>
              <span className="text-[0.9rem] text-slate-400 font-black hover:text-blue-600 transition-colors cursor-pointer select-none next-page">
                 &rsaquo;
              </span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
