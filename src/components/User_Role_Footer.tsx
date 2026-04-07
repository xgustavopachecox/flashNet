"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function User_Role_Footer() {
  const router = useRouter();
  const [currentUserRole, setCurrentUserRole] = useState<string>('ADMIN');
  const [currentUserName, setCurrentUserName] = useState<string>('Usuario');

  useEffect(() => {
    const savedAuth = localStorage.getItem("tictac_auth");
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        setCurrentUserRole(parsed.role || 'ADMIN');
        setCurrentUserName(parsed.name || 'GUSTAVO');
      } catch (e) {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("tictac_auth");
    window.location.href = '/';
  };

  return (
    <div className="mt-auto border-t border-slate-200 p-[1.5rem] flex flex-col gap-[1rem] w-full">
      <div 
        onClick={handleLogout}
        className="flex items-center gap-[0.75rem] p-[0.75rem] bg-white border border-slate-200 rounded-2xl w-full cursor-pointer hover:bg-slate-100 transition-all duration-300 shadow-sm group hover:shadow-md hover:border-blue-400"
      >
        <div className="flex items-center justify-center w-[2.5rem] h-[2.5rem] rounded-full bg-blue-100 text-blue-700 font-bold text-lg shrink-0 border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:scale-105">
          {currentUserName.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col flex-1 truncate">
          <span className="text-sm font-extrabold text-slate-800 tracking-wide truncate group-hover:text-blue-600 transition-colors">{currentUserName}</span>
          <span className="text-[0.65rem] text-slate-500 font-bold tracking-widest uppercase">
            | {currentUserRole === 'ADMIN' ? 'ADMIN' : 'MEMBRO'}
          </span>
        </div>
        <button className="w-[2rem] h-[2rem] flex items-center justify-center rounded-lg bg-slate-100 group-hover:bg-red-50 group-hover:text-red-500 transition-all transform group-hover:rotate-12 shrink-0 border border-transparent group-hover:border-red-200">
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
}
