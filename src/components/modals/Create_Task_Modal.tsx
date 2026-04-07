"use client";

import React, { useState, useEffect } from 'react';
import { X, Plus, Calendar, Flag } from 'lucide-react';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: { title: string; description: string; priority: string; date: string }) => void;
}

export default function Create_Task_Modal({ isOpen, onClose, onSave }: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MÉDIA');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setPriority('MÉDIA');
      setDate('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const priorities = [
    { label: 'CRÍTICA', color: 'bg-rose-100 text-rose-700 border-rose-200' },
    { label: 'ALTA', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { label: 'MÉDIA', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    { label: 'BAIXA', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-[2rem] animate-fade-in font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-[34rem] rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-[2rem] border-b border-slate-100 bg-slate-50/30">
          <div className="flex flex-col">
            <h2 className="text-[1.5rem] font-black text-slate-800 tracking-tight leading-none uppercase">Nova Tarefa</h2>
            <p className="text-[0.7rem] font-bold text-slate-400 mt-[0.5rem] uppercase tracking-widest">Adicionando ao board atual</p>
          </div>
          <button 
            onClick={onClose}
            className="p-[0.6rem] rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-all active:scale-90 border border-transparent hover:border-slate-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-[2.5rem] flex flex-col gap-[1.5rem]">
          {/* Title Field */}
          <div className="flex flex-col gap-[0.5rem]">
            <label className="text-[0.7rem] font-black text-slate-500 uppercase tracking-widest pl-[0.25rem]">Título da Tarefa</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Implementar autenticação via SSO..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-[1.25rem] py-[1.1rem] text-[1rem] font-bold text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:shadow-md transition-all placeholder:text-slate-300"
            />
          </div>

          {/* Description Field */}
          <div className="flex flex-col gap-[0.5rem]">
            <label className="text-[0.7rem] font-black text-slate-500 uppercase tracking-widest pl-[0.25rem]">Descrição</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva os detalhes e critérios de aceitação..."
              rows={4}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-[1.25rem] py-[1.1rem] text-[0.95rem] font-bold text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:shadow-md transition-all resize-none placeholder:text-slate-300"
            />
          </div>

          {/* Two columns: Priority & Date */}
          <div className="grid grid-cols-2 gap-[1.5rem]">
            <div className="flex flex-col gap-[0.5rem]">
              <label className="text-[0.7rem] font-black text-slate-500 uppercase tracking-widest pl-[0.25rem]">Prioridade</label>
              <div className="flex flex-wrap gap-[0.5rem]">
                {priorities.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setPriority(p.label)}
                    className={`px-[0.8rem] py-[0.5rem] rounded-xl text-[0.7rem] font-black tracking-widest border transition-all active:scale-95 ${priority === p.label ? p.color : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-[0.5rem]">
              <label className="text-[0.7rem] font-black text-slate-500 uppercase tracking-widest pl-[0.25rem]">Data de Entrega</label>
              <div className="relative">
                <Calendar size={18} className="absolute left-[1.1rem] top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-[3rem] pr-[1rem] py-[1rem] text-[0.95rem] font-bold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none"
                />
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
            disabled={!title}
            onClick={() => onSave({ title, description, priority, date })}
            className="flex items-center gap-[0.85rem] px-[3rem] py-[1.1rem] bg-blue-600 text-white font-black text-[0.85rem] uppercase tracking-widest rounded-2xl hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed border border-blue-500"
          >
            <Plus size={20} />
            Criar Tarefa
          </button>
        </div>
      </div>
    </div>
  );
}
