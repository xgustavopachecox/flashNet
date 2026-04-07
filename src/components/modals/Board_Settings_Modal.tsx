"use client";

import React, { useState, useEffect } from 'react';
import { X, Save, Trash2 } from 'lucide-react';

interface BoardSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description: string; isArchived: boolean }) => void;
  currentData: {
    name: string;
    description: string;
  };
}

export default function Board_Settings_Modal({ isOpen, onClose, onSave, currentData }: BoardSettingsModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isArchived, setIsArchived] = useState(false);

  // Clear inputs every time modal opens as requested
  useEffect(() => {
    if (isOpen) {
      setName('');
      setDescription('');
      setIsArchived(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-[2rem] animate-fade-in font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-[32rem] rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-[1.75rem] border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-col">
            <h2 className="text-[1.25rem] font-black text-slate-800 tracking-tight leading-none uppercase">Configurações do Quadro</h2>
            <p className="text-[0.65rem] font-bold text-slate-400 mt-[0.4rem] uppercase tracking-widest">Workspace Premium</p>
          </div>
          <button 
            onClick={onClose}
            className="p-[0.5rem] rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-all active:scale-90 border border-transparent hover:border-slate-200"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="p-[2.5rem] flex flex-col gap-[1.5rem]">
          {/* Name Field */}
          <div className="flex flex-col gap-[0.5rem]">
            <label className="text-[0.65rem] font-black text-slate-500 uppercase tracking-widest pl-[0.25rem]">Novo Nome</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`Atual: ${currentData.name}`}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-[1.25rem] py-[1rem] text-[0.95rem] font-bold text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:shadow-md transition-all placeholder:text-slate-300 placeholder:italic"
            />
          </div>

          {/* Description Field */}
          <div className="flex flex-col gap-[0.5rem]">
            <label className="text-[0.65rem] font-black text-slate-500 uppercase tracking-widest pl-[0.25rem]">Nova Descrição</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={`Atual: ${currentData.description}`}
              rows={4}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-[1.25rem] py-[1rem] text-[0.95rem] font-bold text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:shadow-md transition-all resize-none placeholder:text-slate-300 placeholder:italic"
            />
          </div>

          {/* Danger Zone: Archive */}
          <div className="mt-[1rem] p-[1.5rem] bg-rose-50/20 border border-rose-100 rounded-3xl flex items-center justify-between group hover:bg-rose-50/50 transition-all">
            <div className="flex items-center gap-[1rem]">
              <div className={`p-[1rem] rounded-2xl transition-all ${isArchived ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-500'}`}>
                <Trash2 size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[0.95rem] font-black text-slate-800 uppercase tracking-tight">Arquivar Quadro</span>
                <span className="text-[0.7rem] font-bold text-slate-400 leading-tight">Será movido para a seção de arquivo.</span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsArchived(!isArchived)}
              className={`relative w-[3.5rem] h-[1.8rem] rounded-full transition-all duration-500 shadow-inner ${isArchived ? 'bg-rose-500' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-[0.25rem] w-[1.3rem] h-[1.3rem] bg-white rounded-full transition-all duration-500 shadow-md transform ${isArchived ? 'left-[1.95rem]' : 'left-[0.25rem]'}`} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-[1.75rem] bg-slate-50/80 flex items-center justify-end gap-[1.25rem] border-t border-slate-100 animate-slide-up">
          <button 
            onClick={onClose}
            className="px-[1.5rem] py-[0.8rem] text-slate-400 font-black text-[0.7rem] uppercase tracking-widest hover:text-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={() => onSave({ 
              name: name || currentData.name, 
              description: description || currentData.description, 
              isArchived 
            })}
            className="flex items-center gap-[0.75rem] px-[2.5rem] py-[1rem] bg-blue-600 text-white font-black text-[0.75rem] uppercase tracking-widest rounded-2xl hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-[0.98] shadow-lg border border-blue-500"
          >
            <Save size={18} />
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}
