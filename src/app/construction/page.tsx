"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Hammer, ArrowLeft } from 'lucide-react';

export default function ConstructionPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-[2rem] font-sans">
      <div className="bg-white p-[3rem] rounded-[2rem] shadow-xl border border-slate-200 flex flex-col items-center gap-[1.5rem] max-w-[32rem] text-center">
        <div className="bg-blue-100 p-[1.5rem] rounded-full text-blue-600 animate-pulse">
          <Hammer size={48} />
        </div>
        <h1 className="text-[2.5rem] font-extrabold text-slate-800 tracking-tight">TELA EM CONSTRUÇÃO</h1>
        <p className="text-[1.2rem] text-slate-500 leading-relaxed">
          Estamos trabalhando para oferecer a melhor experiência possível. Esta funcionalidade estará disponível em breve no seu workspace Tic Tac. 🚀
        </p>
        <button 
          onClick={() => router.back()}
          className="mt-[1rem] flex items-center gap-[0.75rem] bg-blue-600 hover:bg-blue-700 active:transform active:scale-[0.98] text-white font-bold py-[1rem] px-[2rem] rounded-xl transition-all shadow-lg hover:shadow-blue-200"
        >
          <ArrowLeft size={20} />
          Voltar para o Board
        </button>
      </div>
    </div>
  );
}
