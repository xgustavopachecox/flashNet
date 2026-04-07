"use client";

import React from 'react';

type ActionType = 'CARD MOVIMENTADO' | 'CARD CRIADO' | 'CARD ARQUIVADO' | 'DETALHES ATUALIZADOS' | 'CARD RESOLVIDO' | 'CONFIGURAÇÕES ATUALIZADAS';

interface ActionBadgeProps {
  action: ActionType;
}

const Action_Badge: React.FC<ActionBadgeProps> = ({ action }) => {
  const getBadgeStyles = () => {
    switch (action) {
      case 'CARD MOVIMENTADO':
        return 'bg-blue-100 text-blue-700 border-blue-200 shadow-blue-50';
      case 'CARD CRIADO':
        return 'bg-slate-100 text-slate-700 border-slate-200 shadow-slate-50';
      case 'CARD ARQUIVADO':
        return 'bg-red-100 text-red-700 border-red-200 shadow-red-50';
      case 'DETALHES ATUALIZADOS':
        return 'bg-purple-100 text-purple-700 border-purple-200 shadow-purple-50';
      case 'CARD RESOLVIDO':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200 shadow-emerald-50';
      case 'CONFIGURAÇÕES ATUALIZADAS':
        return 'bg-slate-100 text-slate-700 border-slate-200 shadow-slate-50';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 shadow-slate-50';
    }
  };

  return (
    <span className={`px-[1rem] py-[0.4rem] rounded-full text-[0.65rem] font-black tracking-widest border shadow-sm transition-all duration-300 hover:scale-105 select-none whitespace-nowrap inline-block ${getBadgeStyles()}`}>
      {action}
    </span>
  );
};

export default Action_Badge;
