"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Activity, Settings } from 'lucide-react';
import User_Role_Footer from './User_Role_Footer';

export default function Sidebar_Main() {
  const router = useRouter();

  const handleNavigateToConstruction = () => router.push('/construction');

  return (
    <aside className="w-[20%] min-h-screen bg-slate-50 border-r border-slate-200 flex flex-col font-sans transition-all duration-500 overflow-hidden">
      {/* Top Section */}
      <div className="p-[1.5rem] flex items-center gap-[0.75rem] border-b border-slate-200/50">
        <div className="bg-blue-600 w-[2.5rem] h-[2.5rem] rounded-xl flex items-center justify-center text-white shadow-lg animate-fade-in shadow-blue-200">
          <LayoutDashboard size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-[1.2rem] font-black text-slate-800 tracking-tight leading-none uppercase">Tic Tac</span>
          <span className="text-[0.6rem] font-bold text-slate-400 tracking-[0.1rem] uppercase">Premium Hub</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-[1rem] flex flex-col gap-[0.5rem]">
        <span className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest pl-[0.5rem] py-[0.5rem]">Menu Principal</span>
        
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-[0.75rem] p-[0.75rem] rounded-xl text-slate-600 font-bold text-sm hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all duration-300 group"
        >
          <LayoutDashboard size={18} className="group-hover:scale-110 transition-transform" />
          Meus boards
        </button>

        <button 
          onClick={handleNavigateToConstruction}
          className="flex items-center gap-[0.75rem] p-[0.75rem] rounded-xl text-slate-600 font-bold text-sm hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all duration-300 group"
        >
          <Activity size={18} className="group-hover:scale-110 transition-transform" />
          Atividades Global
        </button>

        <button 
          onClick={handleNavigateToConstruction}
          className="flex items-center gap-[0.75rem] p-[0.75rem] rounded-xl text-slate-600 font-bold text-sm hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all duration-300 group"
        >
          <Settings size={18} className="group-hover:scale-110 transition-transform" />
          Configurações
        </button>
      </nav>

      {/* Footer Layer */}
      <User_Role_Footer />
    </aside>
  );
}
