"use client";

import React, { useState, useEffect } from 'react';
import Action_Badge from './Action_Badge';

interface GlobalActivityEntry {
  id: string;
  datetime: string;
  boardName: string;
  user: {
    name: string;
    avatar: string;
    role: string;
  };
  action: 'CARD MOVIMENTADO' | 'CARD CRIADO' | 'CARD RESOLVIDO' | 'CONFIGURAÇÕES ATUALIZADAS' | 'CARD ARQUIVADO' | 'DETALHES ATUALIZADOS';
  entity: string;
  justification: string;
}

interface GlobalActivityTableProps {
  entries: GlobalActivityEntry[];
}

const Global_Activity_Table: React.FC<GlobalActivityTableProps> = ({ entries }) => {
  return (
    <div className="w-full bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm transition-all duration-500 hover:shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[65rem]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-[1.5rem] py-[1.2rem] text-[0.7rem] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Data e Hora</th>
              <th className="px-[1.5rem] py-[1.2rem] text-[0.7rem] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Usuário</th>
              <th className="px-[1.5rem] py-[1.2rem] text-[0.7rem] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Quadro</th>
              <th className="px-[1.5rem] py-[1.2rem] text-[0.7rem] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Ação</th>
              <th className="px-[1.5rem] py-[1.2rem] text-[0.7rem] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Entidade (Card)</th>
              <th className="px-[1.5rem] py-[1.2rem] text-[0.7rem] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Justificativa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {entries.length > 0 ? (
              entries.map((entry) => (
                <tr key={entry.id} className="group hover:bg-slate-50/70 transition-colors duration-300 cursor-default active:bg-slate-100">
                  <td className="px-[1.5rem] py-[1.5rem]">
                    <div className="flex flex-col">
                      <span className="text-[0.85rem] font-bold text-slate-800">{entry.datetime.split(' ')[0]} {entry.datetime.split(' ')[1]}</span>
                      <span className="text-[0.7rem] font-bold text-slate-400 mt-[0.2rem] leading-none">{entry.datetime.split(' ')[2]}</span>
                    </div>
                  </td>
                  <td className="px-[1.5rem] py-[1.5rem]">
                    <div className="flex items-center gap-[0.75rem]">
                      <div className="w-[2.2rem] h-[2.2rem] rounded-full flex items-center justify-center bg-slate-800 text-white font-black text-[0.8rem] border border-slate-700 shadow-sm transition-all group-hover:scale-110">
                        {entry.user.avatar}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.85rem] font-extrabold text-slate-800 leading-tight">{entry.user.name}</span>
                        <span className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-tighter opacity-70">
                          {entry.user.role === 'ADMIN' ? 'ADMIN' : 'MEMBRO'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-[1.5rem] py-[1.5rem]">
                    <span className="text-[0.7rem] font-black text-slate-400 bg-slate-100 px-[0.6rem] py-[0.3rem] rounded-lg tracking-wider group-hover:bg-blue-600 group-hover:text-white transition-colors uppercase whitespace-nowrap inline-block">
                      {entry.boardName}
                    </span>
                  </td>
                  <td className="px-[1.5rem] py-[1.5rem]">
                    <Action_Badge action={entry.action} />
                  </td>
                  <td className="px-[1.5rem] py-[1.5rem]">
                    <span className="text-[0.85rem] font-bold text-blue-700 bg-blue-50 px-[0.6rem] py-[0.3rem] rounded-lg border border-blue-100/50 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer whitespace-nowrap inline-block">
                      {entry.entity}
                    </span>
                  </td>
                  <td className="px-[1.5rem] py-[1.5rem] max-w-[15rem]">
                    <p className="text-[0.85rem] text-slate-600 font-medium leading-relaxed italic border-l-[3px] border-slate-200 pl-[0.75rem] group-hover:border-blue-400 transition-all line-clamp-2">
                      "{entry.justification}"
                    </p>
                  </td>
                </tr>
              ))
            ) : (
                <tr>
                  <td colSpan={6} className="px-[1.5rem] py-[5rem] text-center">
                    <span className="text-[1rem] font-bold text-slate-400">Nenhuma atividade global registrada.</span>
                  </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Global_Activity_Table;
