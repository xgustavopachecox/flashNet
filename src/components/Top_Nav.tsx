"use client";

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Search, Bell, HelpCircle } from 'lucide-react';

interface TopNavProps {
  boardName: string;
  activeTab: 'board' | 'activity' | 'files';
}

export default function Top_Nav({ boardName, activeTab }: TopNavProps) {
  const router = useRouter();
  const params = useParams();

  const handleNavigateToConstruction = () => router.push('/construction');

  return (
    <header className="flex items-center justify-between px-[2rem] h-[4rem] min-h-[4rem] border-b border-slate-200 bg-white sticky top-0 z-10 font-sans">
      <div className="flex items-center gap-[3rem] h-full">
        <span className="font-black text-[1.1rem] text-slate-900 tracking-tight">{boardName}</span>
        
        <div className="flex gap-[1.5rem] h-full">
          <div 
            onClick={() => router.push(`/board/${params?.id}`)}
            className={`flex items-center text-[0.85rem] font-bold cursor-pointer transition-all h-full border-b-[0.15rem] leading-none ${activeTab === 'board' ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-900'}`}
          >
            Board
          </div>
          <div 
            onClick={() => router.push(`/board/${params?.id}/activity`)}
            className={`flex items-center text-[0.85rem] font-bold cursor-pointer transition-all h-full border-b-[0.15rem] leading-none ${activeTab === 'activity' ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-900'}`}
          >
            Atividades
          </div>
          <div 
            onClick={handleNavigateToConstruction}
            className={`flex items-center text-[0.85rem] font-bold cursor-pointer transition-all h-full border-b-[0.15rem] leading-none ${activeTab === 'files' ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-900'}`}
          >
            Files
          </div>
        </div>
      </div>

      <div className="flex items-center gap-[1.5rem]">
        <div className="flex items-center bg-slate-100 px-[1rem] py-[0.5rem] rounded-full gap-[0.5rem] transition-all hover:bg-slate-200 border border-transparent focus-within:border-blue-300 focus-within:bg-white focus-within:shadow-sm">
          <Search size={16} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search activity..." 
            className="border-none bg-transparent outline-none text-[0.85rem] w-[12rem] font-medium"
          />
        </div>
        
        <div className="flex items-center gap-[0.75rem]">
          <button className="p-[0.5rem] rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-95">
            <Bell size={20} />
          </button>
          <button className="p-[0.5rem] rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-95">
            <HelpCircle size={20} />
          </button>
          <div className="w-[2.2rem] h-[2.2rem] rounded-full overflow-hidden border border-slate-200 cursor-pointer hover:shadow-md transition-shadow transition-transform active:scale-95">
            <img src="https://i.pravatar.cc/150?u=admin" alt="User" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
}
