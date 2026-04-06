"use client";

import React from 'react';
import Action_Badge from './Action_Badge';

interface ActivityLogEntry {
  id: string;
  datetime: string;
  user: {
    name: string;
    avatar: string;
    role: string;
  };
  action: 'CARD MOVIMENTADO' | 'CARD CRIADO' | 'CARD ARQUIVADO' | 'DETALHES ATUALIZADOS';
  entity: string;
  justification: string;
}

interface ActivityLogTableProps {
  entries: ActivityLogEntry[];
}

const Activity_Log_Table: React.FC<ActivityLogTableProps> = ({ entries }) => {
  return (
    <div className="w-full bg-white rounded-[1.5rem] border border-slate-200 overflow-hidden shadow-sm transition-all duration-500 hover:shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[50rem]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-[1.5rem] py-[1.2rem] text-[0.7rem] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Data e Hora</th>
              <th className="px-[1.5rem] py-[1.2rem] text-[0.7rem] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Usuário</th>
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
                      <div className="w-[2.2rem] h-[2.2rem] rounded-full overflow-hidden border border-slate-200 shadow-sm transition-transform group-hover:scale-110">
                        <img src={entry.user.avatar} alt={entry.user.name} className="w-full h-full object-cover" />
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
                    <Action_Badge action={entry.action} />
                  </td>
                  <td className="px-[1.5rem] py-[1.5rem]">
                    <span className="text-[0.85rem] font-bold text-blue-700 bg-blue-50 px-[0.6rem] py-[0.3rem] rounded-lg border border-blue-100/50 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">
                      {entry.entity}
                    </span>
                  </td>
                  <td className="px-[1.5rem] py-[1.5rem] max-w-[20rem]">
                    <p className="text-[0.85rem] text-slate-600 font-medium leading-relaxed italic border-l-[3px] border-slate-200 pl-[0.75rem] group-hover:border-blue-400 transition-all">
                      "{entry.justification}"
                    </p>
                  </td>
                </tr>
              ))
            ) : (
                <tr>
                  <td colSpan={5} className="px-[1.5rem] py-[4rem] text-center">
                    <span className="text-[1rem] font-bold text-slate-400">Nenhuma atividade registrada.</span>
                  </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Activity_Log_Table;
