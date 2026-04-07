"use client";

import React, { useState, useEffect } from 'react';
import { X, Archive } from 'lucide-react';

interface BoardSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description: string; isArchived: boolean }) => void;
  initialData: {
    name: string;
    description: string;
  };
}

export default function Board_Settings_Modal({ isOpen, onClose, onSave, initialData }: BoardSettingsModalProps) {
  const [name, setName] = useState(initialData.name);
  const [description, setDescription] = useState(initialData.description);
  const [isArchived, setIsArchived] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(initialData.name);
      setDescription(initialData.description);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-[2rem] animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-[32rem] rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-[1.75rem] border-b border-slate-100">
          <h2 className="text-[1.25rem] font-extrabold text-slate-800 tracking-tight">Configurações do Quadro</h2>
          <button 
            onClick={onClose}
            className="p-[0.5rem] rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all active:scale-90"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-[2rem] flex flex-col gap-[1.5rem]">
          {/* Name Field */}
          <div className="flex flex-col gap-[0.5rem]">
            <label className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest pl-[0.25rem]">Nome</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome do quadro..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-[1rem] py-[0.8rem] text-[0.95rem] font-bold text-slate-800 outline-none focus:border-blue-600 focus:bg-white focus:shadow-sm transition-all"
            />
          </div>

          {/* Description Field */}
          <div className="flex flex-col gap-[0.5rem]">
            <label className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest pl-[0.25rem]">Descrição</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o propósito deste board..."
              rows={4}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-[1rem] py-[0.8rem] text-[0.95rem] font-medium text-slate-600 outline-none focus:border-blue-600 focus:bg-white focus:shadow-sm transition-all resize-none"
            />
          </div>

          {/* Archive Action Section */}
          <div className="mt-[0.5rem] p-[1.5rem] bg-rose-50/30 border border-rose-100 rounded-2xl flex items-center justify-between group hover:bg-rose-50 transition-colors">
            <div className="flex flex-col gap-[0.2rem]">
              <span className="text-[0.9rem] font-extrabold text-slate-800">Arquivar Quadro</span>
              <span className="text-[0.75rem] font-medium text-slate-500 leading-tight">Isso moverá o quadro para a seção de arquivo.</span>
            </div>
            
            <button 
              onClick={() => setIsArchived(!isArchived)}
              className={`relative w-[3rem] h-[1.6rem] rounded-full transition-all duration-300 ${isArchived ? 'bg-rose-500' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-[0.2rem] w-[1.2rem] h-[1.2rem] bg-white rounded-full transition-all duration-300 shadow-sm ${isArchived ? 'left-[1.6rem]' : 'left-[0.2rem]'}`} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-[1.5rem] bg-slate-50/50 flex items-center justify-end gap-[1rem] border-t border-slate-100">
          <button 
            onClick={onClose}
            className="px-[1.5rem] py-[0.8rem] text-slate-500 font-extrabold text-[0.85rem] hover:text-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={() => onSave({ name, description, isArchived })}
            className="px-[2rem] py-[0.8rem] bg-blue-600 text-white font-extrabold text-[0.85rem] rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-100 transition-all active:scale-[0.98] shadow-sm"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}
