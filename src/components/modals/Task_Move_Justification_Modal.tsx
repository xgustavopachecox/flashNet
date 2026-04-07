"use client";

import React, { useState, useEffect } from 'react';
import { X, LogOut, AlertCircle, CheckCircle2 } from 'lucide-react';

interface TaskMoveJustificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (observation: string) => void;
  taskTitle: string;
  targetColumnTitle: string;
}

export default function Task_Move_Justification_Modal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  taskTitle, 
  targetColumnTitle 
}: TaskMoveJustificationModalProps) {
  const [observation, setObservation] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setObservation('');
      setError(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (observation.length < 10) {
      setError(true);
      return;
    }
    onConfirm(observation);
  };

  const isInvalid = observation.length < 10;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-[2rem] animate-fade-in font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-[34rem] rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up border border-slate-100">
        
        {/* Header Section */}
        <div className="p-[2.5rem] flex flex-col gap-[1rem] bg-white">
          <div className="flex items-start justify-between">
            <div className="bg-blue-50 p-3 rounded-2xl">
              <LogOut size={24} className="text-blue-600 rotate-180" />
            </div>
            <button 
              onClick={onClose}
              className="p-[0.5rem] text-slate-300 hover:text-slate-800 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="flex flex-col">
            <h2 className="text-[1.3rem] font-black text-slate-800 leading-tight">
              Justifique a movimentação para <span className="text-blue-600">[{targetColumnTitle}]</span>
            </h2>
            <p className="text-[0.75rem] font-bold text-slate-400 mt-[0.25rem] uppercase tracking-wide">
              Card: {taskTitle}
            </p>
          </div>
        </div>

        {/* Input Body */}
        <div className="px-[2.5rem] pb-[2.5rem] flex flex-col gap-[1rem]">
          <div className="flex flex-col gap-[0.5rem]">
            <label className="text-[0.65rem] font-black text-slate-500 uppercase tracking-widest pl-[0.25rem]">Observação</label>
            <textarea 
              value={observation}
              onChange={(e) => {
                setObservation(e.target.value);
                if (e.target.value.length >= 10) setError(false);
              }}
              placeholder="Descreva o motivo da mudança de status..."
              rows={4}
              className={`w-full bg-slate-50 border rounded-2xl px-[1.25rem] py-[1.1rem] text-[0.95rem] font-bold text-slate-900 outline-none transition-all resize-none placeholder:text-slate-300 ${error ? 'border-rose-300 bg-rose-50/30' : 'border-slate-100 focus:border-blue-500 focus:bg-white focus:shadow-sm'}`}
            />
            {isInvalid && observation.length > 0 && (
              <div className="flex items-center gap-[0.5rem] text-[0.7rem] font-bold text-rose-500 pl-[0.25rem] animate-fade-in">
                <AlertCircle size={14} />
                Mínimo 10 caracteres
              </div>
            )}
            {!isInvalid && observation.length > 0 && (
              <div className="flex items-center gap-[0.5rem] text-[0.7rem] font-bold text-emerald-500 pl-[0.25rem] animate-fade-in">
                <CheckCircle2 size={14} />
                Pronto para confirmar
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-[2rem] bg-slate-50/50 flex items-center justify-center gap-[1rem] border-t border-slate-50">
          <button 
            onClick={onClose}
            className="flex-1 px-[1.5rem] py-[1.1rem] bg-[#eef2f6] text-slate-500 font-black text-[0.85rem] uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all active:scale-[0.98]"
          >
            Cancelar
          </button>
          <button 
            onClick={handleConfirm}
            className={`flex-1 flex items-center justify-center gap-[0.75rem] px-[1.5rem] py-[1.1rem] font-black text-[0.85rem] uppercase tracking-widest rounded-2xl transition-all active:scale-[0.98] shadow-lg ${isInvalid ? 'bg-blue-300 text-white/70 cursor-not-allowed shadow-none' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200 border border-blue-500'}`}
          >
            Confirmar <CheckCircle2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
