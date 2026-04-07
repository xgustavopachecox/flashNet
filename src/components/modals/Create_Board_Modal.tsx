"use client";

import React, { useState, useEffect } from 'react';
import { X, UserPlus, Search, XCircle } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  avatar: string;
}

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (board: { name: string; description: string; members: string[] }) => void;
}

const AVAILABLE_MEMBERS: Member[] = [
  { id: '1', name: 'Alice', avatar: 'A' },
  { id: '2', name: 'Bob', avatar: 'B' },
  { id: '3', name: 'Carol', avatar: 'C' },
  { id: '4', name: 'Dave', avatar: 'D' },
];

export default function Create_Board_Modal({ isOpen, onClose, onSave }: CreateBoardModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName('');
      setDescription('');
      setSelectedMembers([]);
      setSearch('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name) return;
    onSave({
      name,
      description,
      members: ['Admin', ...selectedMembers.map(m => m.name)] // Always include Admin
    });
  };

  const toggleMember = (member: Member) => {
    if (selectedMembers.find(m => m.id === member.id)) {
      setSelectedMembers(prev => prev.filter(m => m.id !== member.id));
    } else {
      setSelectedMembers(prev => [...prev, member]);
    }
  };

  const filtered = AVAILABLE_MEMBERS.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) && 
    !selectedMembers.find(sm => sm.id === m.id)
  );

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-[2rem] animate-fade-in font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-[36rem] rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up border border-slate-200">
        {/* Header */}
        <div className="p-[2.5rem] border-b border-slate-100 flex items-center justify-between">
           <h2 className="text-[1.5rem] font-black text-slate-800 tracking-tight leading-none uppercase">Novo Quadro</h2>
           <button 
              onClick={onClose}
              className="p-[0.6rem] rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-all active:scale-90"
            >
              <X size={24} />
            </button>
        </div>

        {/* Body */}
        <div className="p-[2.5rem] flex flex-col gap-[2rem]">
          {/* Board Name */}
          <div className="flex flex-col gap-[0.75rem]">
            <label className="text-[0.7rem] font-black text-slate-500 uppercase tracking-widest pl-[0.25rem]">Nome do Quadro</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome do quadro..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-[1.25rem] py-[1.1rem] text-[1rem] font-bold text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:shadow-md transition-all placeholder:text-slate-300"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-[0.75rem]">
            <label className="text-[0.7rem] font-black text-slate-500 uppercase tracking-widest pl-[0.25rem]">Descrição</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Uma breve descrição sobre o objetivo deste quadro..."
              rows={4}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-[1.25rem] py-[1.1rem] text-[1rem] font-bold text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:shadow-md transition-all placeholder:text-slate-300 resize-none"
            />
          </div>

          {/* Members (Optional) */}
          <div className="flex flex-col gap-[0.75rem]">
            <label className="text-[0.7rem] font-black text-slate-500 uppercase tracking-widest pl-[0.25rem]">Membros Iniciais (Opcional)</label>
            <div className="relative">
               <div className="absolute left-[1.25rem] top-1/2 -translate-y-1/2 text-slate-400">
                  <UserPlus size={18} />
               </div>
               <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por nome ou email..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-[3rem] pr-[1.25rem] py-[1.1rem] text-[1rem] font-bold text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:shadow-md transition-all placeholder:text-slate-300"
               />
               {/* Search Results Dropdown */}
               {search && filtered.length > 0 && (
                 <div className="absolute top-full left-0 right-0 mt-[0.5rem] bg-white border border-slate-200 rounded-2xl shadow-xl z-20 py-2">
                    {filtered.map(m => (
                      <div 
                        key={m.id} 
                        onClick={() => toggleMember(m)}
                        className="px-[1.5rem] py-[0.75rem] flex items-center justify-between hover:bg-slate-50 cursor-pointer group"
                      >
                         <div className="flex items-center gap-[1rem]">
                            <div className="w-[2.5rem] h-[2.5rem] rounded-full bg-slate-800 flex items-center justify-center text-white font-black text-[0.9rem] border border-slate-700">{m.avatar}</div>
                            <span className="font-bold text-slate-800">{m.name}</span>
                         </div>
                         <UserPlus size={16} className="text-slate-300 group-hover:text-blue-600" />
                      </div>
                    ))}
                 </div>
               )}
            </div>

            {/* Selected Members Tags */}
            <div className="flex flex-wrap gap-[0.5rem] mt-[0.5rem]">
               {selectedMembers.map(m => (
                 <div key={m.id} className="bg-slate-100 border border-slate-200 rounded-full pl-[0.5rem] pr-[0.75rem] py-[0.4rem] flex items-center gap-[0.75rem] group animate-scale-in">
                    <div className="w-[1.8rem] h-[1.8rem] rounded-full bg-slate-800 flex items-center justify-center text-white font-black text-[0.7rem]">{m.avatar}</div>
                    <span className="text-[0.8rem] font-bold text-slate-700">{m.name}</span>
                    <button 
                      onClick={() => toggleMember(m)}
                      className="text-slate-400 hover:text-rose-500 transition-colors"
                    >
                       <XCircle size={16} />
                    </button>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-[2.5rem] bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-[1.5rem]">
           <button 
            onClick={onClose}
            className="px-[1.5rem] py-[0.8rem] text-slate-400 font-black text-[0.75rem] uppercase tracking-widest hover:text-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button 
            disabled={!name}
            onClick={handleSave}
            className="px-[4rem] py-[1.1rem] bg-blue-600 text-white font-black text-[0.85rem] uppercase tracking-widest rounded-2xl hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed border border-blue-500"
          >
            Criar Quadro
          </button>
        </div>
      </div>
    </div>
  );
}
