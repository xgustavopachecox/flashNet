"use client";

import React, { useState, useEffect } from 'react';
import { X, UserPlus, UserMinus, Shield, ShieldAlert, ChevronDown, Lock } from 'lucide-react';
import { pushNotification } from "@/utils/notifications";

interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'EDITOR' | 'VISUALIZADOR' | 'OWNER';
  isJoined: boolean;
}

interface ManageMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (members: string[]) => void;
  currentMembers: string[]; 
  boardId?: string;
}

const ALL_USERS: Member[] = [
  { id: '1', name: 'Admin', email: 'admin@kanban.dev', avatar: 'A', role: 'OWNER', isJoined: true },
  { id: '2', name: 'Alice', email: 'alice@kanban.dev', avatar: 'A', role: 'EDITOR', isJoined: true },
  { id: '3', name: 'Bob', email: 'bob@kanban.dev', avatar: 'B', role: 'VISUALIZADOR', isJoined: true },
  { id: '4', name: 'Carol', email: 'carol@kanban.dev', avatar: 'C', role: 'EDITOR', isJoined: false },
  { id: '5', name: 'Dave', email: 'dave@kanban.dev', avatar: 'D', role: 'VISUALIZADOR', isJoined: false },
];

export default function Manage_Members_Modal({ isOpen, onClose, onSave, currentMembers, boardId }: ManageMembersModalProps) {
  const [search, setSearch] = useState('');
  const [memberList, setMemberList] = useState<Member[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Sync with current board members based on avatar URLs for this prototype
      const initial = ALL_USERS.map(u => ({
        ...u,
        isJoined: Array.isArray(currentMembers) && currentMembers.some(cm => typeof cm === 'string' && cm.toUpperCase() === u.name.toUpperCase())
      }));
      setMemberList(initial);
    }
  }, [isOpen, currentMembers]);

  if (!isOpen) return null;

  const toggleMember = (id: string) => {
    setMemberList(prev => prev.map(m => m.id === id ? { ...m, isJoined: !m.isJoined } : m));
  };

  const changeRole = (id: string, newRole: 'EDITOR' | 'VISUALIZADOR') => {
    setMemberList(prev => prev.map(m => m.id === id ? { ...m, role: newRole } : m));
  };

  const activeMembers = memberList.filter(m => m.isJoined);
  const filteredUsers = memberList.filter(m => 
    !m.isJoined && (m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-[2rem] animate-fade-in font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-[40rem] rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up border border-slate-200">
        {/* Header */}
        <div className="p-[2rem] border-b border-slate-100 bg-slate-50/30">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-[1.5rem] font-black text-slate-800 tracking-tight leading-none uppercase">Gerenciar Membros</h2>
              <p className="text-[0.65rem] font-black text-blue-600 mt-[0.5rem] uppercase tracking-widest">Apenas Administradores</p>
            </div>
            <button 
              onClick={onClose}
              className="p-[0.6rem] rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-all active:scale-90 border border-transparent hover:border-slate-200"
            >
              <X size={24} />
            </button>
          </div>

          {/* Search/Invite Bar */}
          <div className="mt-[2rem] flex items-center gap-[1rem]">
             <div className="relative flex-1 group">
                <span className="absolute left-[1.25rem] top-1/2 -translate-y-1/2 text-[1.1rem] text-slate-400 font-medium font-serif italic">@</span>
                <input 
                   type="text"
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   placeholder="Ex: usuario@architect.com"
                   className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-[2.75rem] pr-[1.25rem] py-[1.1rem] text-[0.95rem] font-bold text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:shadow-md transition-all placeholder:text-slate-300"
                />
             </div>
             <button className="px-[2.5rem] py-[1.1rem] bg-blue-600 text-white font-black text-[0.85rem] uppercase tracking-widest rounded-2xl hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-[0.98] shadow-lg border border-blue-500 outline-none">
                Convidar
             </button>
          </div>
        </div>

        {/* Body - Users List */}
        <div className="p-[2.5rem] pt-[1.5rem] flex flex-col gap-[1.5rem] max-h-[25rem] overflow-y-auto">
          
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_8rem_4rem] px-[1rem] text-[0.7rem] font-black text-slate-400 uppercase tracking-widest">
            <span>Usuário</span>
            <span className="text-center">Permissão</span>
            <span className="text-right">Ações</span>
          </div>

          {/* Members List */}
          <div className="flex flex-col gap-[0.75rem]">
            {memberList.filter(m => m.id !== '1').map((m) => (
              <div key={m.id} className={`grid grid-cols-[1fr_8rem_4rem] items-center p-[1rem] rounded-2xl border transition-all ${m.isJoined ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-50/50 border-transparent opacity-60 grayscale'}`}>
                <div className="flex items-center gap-[1rem]">
                  <div className={`w-[3rem] h-[3rem] rounded-full border-2 border-white ring-1 ring-slate-100 shadow-sm flex items-center justify-center font-black text-[1.1rem] text-white ${m.name === 'Alice' ? 'bg-indigo-500' : m.name === 'Bob' ? 'bg-emerald-500' : m.name === 'Carol' ? 'bg-amber-500' : 'bg-rose-500'}`}>
                    {m.name.charAt(0)}
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="text-[0.95rem] font-black text-slate-800 truncate leading-tight uppercase tabular-nums">{m.name}</span>
                    <span className="text-[0.7rem] font-medium text-slate-400 truncate">{m.email}</span>
                  </div>
                </div>

                <div className="flex justify-center">
                   {m.isJoined ? (
                     <div className="relative group">
                        <select 
                          value={m.role}
                          onChange={(e) => changeRole(m.id, e.target.value as any)}
                          className="appearance-none bg-slate-100 border border-slate-200 rounded-xl px-[1rem] py-[0.5rem] pr-[2.5rem] text-[0.75rem] font-bold text-slate-700 outline-none focus:border-blue-500 transition-all cursor-pointer hover:bg-white"
                        >
                          <option value="EDITOR">Editor</option>
                          <option value="VISUALIZADOR">Viewer</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-[0.75rem] top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                     </div>
                   ) : (
                     <span className="text-[0.7rem] font-bold text-slate-300">--</span>
                   )}
                </div>

                <div className="flex justify-end pr-[0.5rem]">
                   <button 
                     onClick={() => toggleMember(m.id)}
                     className={`p-[0.6rem] rounded-xl transition-all active:scale-90 ${m.isJoined ? 'text-rose-400 hover:bg-rose-50 hover:text-rose-600' : 'text-blue-400 hover:bg-blue-50 hover:text-blue-600'}`}
                     title={m.isJoined ? 'Remover do Board' : 'Adicionar ao Board'}
                   >
                     {m.isJoined ? <UserMinus size={20} /> : <UserPlus size={20} />}
                   </button>
                </div>
              </div>
            ))}

            {/* Admin/Owner Entry */}
            <div className="grid grid-cols-[1fr_8rem_4rem] items-center p-[1rem] rounded-2xl border bg-slate-50/80 border-slate-200/50 mt-[1rem]">
                <div className="flex items-center gap-[1rem]">
                  <div className="w-[3rem] h-[3rem] rounded-full bg-slate-800 flex items-center justify-center text-white font-black text-[1.1rem] border-2 border-white shadow-sm ring-1 ring-slate-200">AD</div>
                  <div className="flex flex-col">
                    <span className="text-[0.95rem] font-black text-slate-800 leading-tight uppercase tabular-nums">Admin (Você)</span>
                    <span className="text-[0.7rem] font-medium text-slate-400">admin@kanban.dev</span>
                  </div>
                </div>

                <div className="flex justify-center">
                   <span className="bg-blue-600 text-white px-[0.75rem] py-[0.25rem] rounded-lg text-[0.6rem] font-black tracking-[0.1em] uppercase">OWNER</span>
                </div>

                <div className="flex justify-end pr-[0.5rem]">
                   <div className="p-[0.6rem] text-slate-300">
                     <Lock size={18} />
                   </div>
                </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-[2rem] bg-slate-50/80 flex items-center justify-end gap-[1.5rem] border-t border-slate-100">
          <button 
            onClick={onClose}
            className="px-[1.5rem] py-[0.8rem] text-slate-400 font-black text-[0.75rem] uppercase tracking-widest hover:text-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={() => {
              const selectedNames = memberList.filter(m => m.isJoined).map(m => m.name);
              const newlyAdded = memberList.filter(m => m.isJoined && !currentMembers.some(cm => typeof cm === 'string' && cm.toUpperCase() === m.name.toUpperCase()));
              
              newlyAdded.forEach(m => {
                pushNotification(m.name, {
                  title: 'Novo Convite',
                  message: `Você foi adicionado a um novo board no Tic Tac. Clique para acessar o workspace.`,
                  type: 'BOARD_INVITE',
                  boardId: boardId
                });
              });

              onSave(selectedNames);
            }}
            className="px-[3rem] py-[1.1rem] bg-slate-800 text-white font-black text-[0.85rem] uppercase tracking-widest rounded-2xl hover:bg-slate-900 hover:shadow-xl transition-all active:scale-[0.98] shadow-lg outline-none"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}
