"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Search, Bell, X, Info } from 'lucide-react';
import { getNotifications, markAllAsRead, TicTacNotification } from "@/utils/notifications";

interface TopNavProps {
  boardName: string;
  userName?: string;
  activeTab?: 'board' | 'activity' | 'none' | 'boards' | 'arquivados';
  onTabChange?: (tab: any) => void;
}

export default function Top_Nav({ boardName, userName, activeTab, onTabChange }: TopNavProps) {
  const router = useRouter();
  const params = useParams();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<TicTacNotification[]>([]);
  
  // Robust identity resolution: priority to prop, then auth storage
  const [currentUser, setCurrentUser] = useState<string>('Admin');

  useEffect(() => {
    if (userName) {
      setCurrentUser(userName);
    } else {
      const savedAuth = localStorage.getItem("tictac_auth");
      if (savedAuth) {
        try {
          const parsed = JSON.parse(savedAuth);
          setCurrentUser(parsed.name || 'Admin');
        } catch (e) {}
      }
    }
  }, [userName]);

  const loadNotifications = () => {
    setNotifications(getNotifications(currentUser));
  };

  useEffect(() => {
    loadNotifications();
    const handleUpdate = (e: any) => {
      if (e.detail?.userName?.toLowerCase() === currentUser.toLowerCase()) {
        loadNotifications();
      }
    };
    window.addEventListener('tictac_new_notification', handleUpdate);
    return () => window.removeEventListener('tictac_new_notification', handleUpdate);
  }, [currentUser]);

  const unreadCount = notifications.filter((n: TicTacNotification) => !n.isRead).length;

  const handleMarkRead = () => {
    markAllAsRead(currentUser);
    setIsNotifOpen(false);
  };

  const handleNavigateToConstruction = () => router.push('/construction');

  return (
    <header className="flex items-center justify-between px-[2rem] h-[4rem] min-h-[4rem] border-b border-slate-200 bg-white sticky top-0 z-10 font-sans">
      <div className="flex items-center gap-[3rem] h-full">
        <span className="font-black text-[1.1rem] text-slate-900 tracking-tight">{boardName}</span>
        
        <div className="flex gap-[1.5rem] h-full">
          {activeTab !== 'none' && (
            <>
              {(activeTab === 'board' || activeTab === 'activity') ? (
                <>
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
                </>
              ) : (
                <>
                  <div 
                    onClick={() => onTabChange?.('boards')}
                    className={`flex items-center text-[0.85rem] font-bold cursor-pointer transition-all h-full border-b-[0.15rem] leading-none ${activeTab === 'boards' ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-900'}`}
                  >
                    Meus boards
                  </div>
                  <div 
                    onClick={() => onTabChange?.('arquivados')}
                    className={`flex items-center text-[0.85rem] font-bold cursor-pointer transition-all h-full border-b-[0.15rem] leading-none ${activeTab === 'arquivados' ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-900'}`}
                  >
                    Arquivados
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-[1.5rem]">
        <div className="flex items-center bg-slate-100 px-[1rem] py-[0.5rem] rounded-full gap-[0.5rem] transition-all hover:bg-slate-200 border border-transparent focus-within:border-blue-300 focus-within:bg-white focus-within:shadow-sm">
          <Search size={16} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search activity..." 
            className="border-none bg-transparent outline-none text-[0.85rem] w-[12rem] font-bold text-slate-900 placeholder:text-slate-400"
          />
        </div>
        
        <div className="flex items-center gap-[0.75rem] relative">
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-[0.5rem] rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-95 relative z-[110]"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-[0.6rem] right-[0.6rem] w-[0.6rem] h-[0.6rem] bg-rose-500 border-2 border-white rounded-full animate-pulse shadow-md"></span>
            )}
          </button>

          {/* Invisible Backdrop for Click-Outside closure */}
          {isNotifOpen && (
            <div 
              className="fixed inset-0 z-[100] bg-transparent cursor-default" 
              onClick={() => setIsNotifOpen(false)}
            />
          )}

          {/* Notification Dropdown Panel */}
          {isNotifOpen && (
            <div className="absolute top-[3.5rem] right-0 w-[24rem] bg-white rounded-[1.5rem] shadow-[0_1.5rem_4rem_rgba(15,23,42,0.15)] border border-slate-200 z-[110] animate-slide-up overflow-hidden">
               <div className="p-[1.25rem] border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex flex-col">
                    <span className="text-[1rem] font-black text-slate-800 tracking-tight uppercase">Central de Alertas</span>
                    <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest">{unreadCount} pendentes</span>
                  </div>
                  <button 
                    onClick={handleMarkRead}
                    className="text-[0.7rem] font-black text-blue-600 uppercase hover:text-blue-800 tracking-wider transition-colors"
                  >
                    Limpar tudo
                  </button>
               </div>
               
               <div className="max-h-[22rem] overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n: TicTacNotification) => (
                    <div 
                        key={n.id} 
                        onClick={() => {
                          if (n.boardId) {
                            router.push(`/board/${n.boardId}`);
                            setIsNotifOpen(false);
                          } else {
                            handleNavigateToConstruction();
                          }
                        }}
                        className={`p-[1.25rem] border-b border-slate-50 flex gap-[1.25rem] transition-all hover:bg-slate-50 cursor-pointer ${!n.isRead ? 'bg-blue-50/20' : ''}`}
                      >
                         <div className={`w-[2.5rem] h-[2.5rem] rounded-xl flex items-center justify-center shrink-0 ${n.type === 'BOARD_INVITE' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                            {n.type === 'BOARD_INVITE' ? <Info size={20} /> : <Bell size={20} />}
                         </div>
                         <div className="flex flex-col gap-[0.25rem]">
                            <span className="text-[0.9rem] font-black text-slate-800 tabular-nums">{n.title}</span>
                            <p className="text-[0.8rem] text-slate-500 font-medium leading-relaxed">{n.message}</p>
                            <span className="text-[0.65rem] font-bold text-slate-400 uppercase mt-[0.25rem]">Há instantes</span>
                         </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-[3rem] flex flex-col items-center justify-center text-center opacity-40">
                       <Bell size={40} className="text-slate-300 mb-[1rem]" />
                       <span className="text-[0.9rem] font-bold text-slate-400 uppercase tracking-widest">Sem alertas novos</span>
                    </div>
                  )}
               </div>

               <div className="p-[1rem] bg-slate-50 flex items-center justify-center">
                  <button className="text-[0.7rem] font-black text-slate-400 uppercase hover:text-slate-600 transition-colors">Ver todas as notificações</button>
               </div>
            </div>
          )}
          
          <div className="w-[2.2rem] h-[2.2rem] rounded-full bg-slate-800 flex items-center justify-center text-white font-black text-[0.8rem] border border-slate-700 cursor-pointer hover:shadow-md transition-all active:scale-95">
            {(userName || currentUser).slice(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
