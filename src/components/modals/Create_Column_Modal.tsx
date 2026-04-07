"use client";

import React, { useState, useEffect } from 'react';
import { X, Layout, Info } from 'lucide-react';

interface CreateColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (column: { title: string; wipLimit?: number }) => void;
}

export default function Create_Column_Modal({ isOpen, onClose, onSave }: CreateColumnModalProps) {
  const [title, setTitle] = useState('');
  const [wipLimit, setWipLimit] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setWipLimit('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title) return;
    onSave({
      title,
      wipLimit: wipLimit ? parseInt(wipLimit) : undefined
    });
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-[2rem] animate-fade-in font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-[32rem] rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up border border-slate-200">
        {/* Header */}
        <div className="p-[2.5rem] border-b border-slate-100 bg-slate-50/30">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-[1.5rem] font-black text-slate-800 tracking-tight leading-none uppercase">Nova Coluna</h2>
              <p className="text-[0.7rem] font-bold text-slate-400 mt-[0.5rem] uppercase tracking-widest leading-none">Estruturando seu Workspace</p>
            </div>
            <button 
              onClick={onClose}
              className="p-[0.6rem] rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-all active:scale-90 border border-transparent hover:border-slate-200"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-[2.5rem] flex flex-col gap-[2rem]">
          {/* Column Title */}
          <div className="flex flex-col gap-[0.75rem]">
            <label className="flex items-center gap-[0.5rem] text-[0.75rem] font-black text-slate-500 uppercase tracking-widest pl-[0.25rem]">
              <Layout size={14} className="text-blue-500" />
              NOME DA COLUNA
            </label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Em Revisão, Homologação, Produção..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-[1.25rem] py-[1.1rem] text-[1rem] font-bold text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:shadow-md transition-all placeholder:text-slate-300"
            />
          </div>

          {/* WIP Limit (Work in Progress) */}
          <div className="flex flex-col gap-[0.75rem]">
            <label className="flex items-center gap-[0.5rem] text-[0.75rem] font-black text-slate-500 uppercase tracking-widest pl-[0.25rem]">
              <Info size={14} className="text-orange-400" />
              LIMITE DE WIP (OPCIONAL)
            </label>
            <div className="relative group">
              <input 
                type="number" 
                value={wipLimit}
                onChange={(e) => setWipLimit(e.target.value)}
                placeholder="Ex: 5"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-[1.25rem] py-[1.1rem] text-[1rem] font-bold text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:shadow-md transition-all placeholder:text-slate-300 appearance-none"
              />
              <span className="absolute right-[1.25rem] top-1/2 -translate-y-1/2 text-[0.7rem] font-black text-slate-300 uppercase tracking-widest group-focus-within:text-blue-400 transition-colors">cards max</span>
            </div>
            <p className="text-[0.65rem] font-medium text-slate-400 italic pl-[0.25rem]">
              * WIP (Work in Progress) ajuda a controlar a carga de tarefas nesta etapa.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-[2rem] bg-slate-50 flex items-center justify-end gap-[1.5rem] border-t border-slate-100">
          <button 
            onClick={onClose}
            className="px-[1.5rem] py-[0.8rem] text-slate-400 font-black text-[0.75rem] uppercase tracking-widest hover:text-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button 
            disabled={!title}
            onClick={handleSave}
            className="px-[3rem] py-[1.1rem] bg-blue-600 text-white font-black text-[0.85rem] uppercase tracking-widest rounded-2xl hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed border border-blue-500"
          >
            Criar Coluna
          </button>
        </div>
      </div>
    </div>
  );
}
