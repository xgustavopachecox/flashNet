"use client";

import React, { useState } from 'react';
import { X, MessageSquare, History, User, CheckCircle2, Share2, MoreHorizontal, Send, ChevronRight } from 'lucide-react';

interface ActivityItem {
  user: string;
  action: string;
  date: string;
  observation?: string;
}

interface CommentItem {
  id: string;
  user: string;
  userAvatar: string;
  date: string;
  text: string;
}

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: {
    id: string;
    title: string;
    description?: string;
    priority: string;
    date: string;
    assignee: string;
    comments?: number;
    history: ActivityItem[];
    commentsList: CommentItem[];
  } | null;
  onMarkAsResolved: (taskId: string) => void;
  onAddComment: (taskId: string, text: string) => void;
}

export default function Task_Details_Modal({ isOpen, onClose, task, onMarkAsResolved, onAddComment }: TaskDetailsModalProps) {
  const [comment, setComment] = useState('');

  const handleSendComment = () => {
    if (!comment.trim() || !task) return;
    onAddComment(task.id, comment);
    setComment('');
  };

  if (!isOpen || !task) return null;

  const priorityColors: Record<string, string> = {
    'CRÍTICA': 'bg-rose-500 text-white',
    'ALTA': 'bg-orange-500 text-white',
    'MÉDIA': 'bg-amber-100 text-amber-700 border-amber-200',
    'BAIXA': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'REVISÃO NECESSÁRIA': 'bg-purple-100 text-purple-700 border-purple-200'
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-stretch justify-end animate-fade-in font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Drawer Content */}
      <div className="relative bg-white w-full max-w-[45rem] shadow-2xl overflow-y-auto animate-slide-left flex flex-col h-full border-l border-slate-200">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between p-[1.5rem] border-b border-slate-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-[1rem]">
            <button onClick={onClose} className="p-[0.5rem] text-slate-400 hover:text-slate-800 transition-colors">
              <X size={24} />
            </button>
            <nav className="flex items-center gap-[0.5rem] text-[0.7rem] font-bold text-slate-400 uppercase tracking-widest">
              <span>Espaço de Trabalho</span>
              <ChevronRight size={10} />
              <span>Editorial Kanban</span>
              <ChevronRight size={10} />
              <span className="text-slate-800">Card #{task.id.split('-').pop()}</span>
            </nav>
          </div>
          <div className="flex items-center gap-[0.75rem]">
            <button className="p-[0.5rem] text-slate-400 hover:text-slate-800 transition-colors"><Share2 size={20} /></button>
            <button className="p-[0.5rem] text-slate-400 hover:text-slate-800 transition-colors"><MoreHorizontal size={20} /></button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-[3rem] pt-[2rem] flex flex-col gap-[2.5rem] flex-1">
          
          {/* Main Title Section */}
          <section className="flex flex-col gap-[1rem]">
            <h1 className="text-[2.25rem] font-black text-slate-800 leading-[1.1] tracking-tight">{task.title}</h1>
            <div className="flex items-center gap-[2rem] mt-[1rem] border-y border-slate-50 py-[1.5rem]">
               <div className="flex flex-col gap-[0.4rem]">
                 <span className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">Prioridade</span>
                 <span className={`px-[0.8rem] py-[0.35rem] rounded-full text-[0.65rem] font-black tracking-widest inline-flex ${priorityColors[task.priority] || 'bg-slate-100'}`}>
                    {task.priority}
                 </span>
               </div>
               <div className="flex flex-col gap-[0.4rem]">
                 <span className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">Responsável</span>
                 <div className="flex items-center gap-[0.75rem]">
                   <img src={task.assignee} alt="assignee" className="w-[2.5rem] h-[2.5rem] rounded-full border-2 border-white shadow-sm ring-1 ring-slate-100" />
                   <div className="flex flex-col">
                     <span className="text-[0.9rem] font-bold text-slate-800 leading-none">Alex Chen</span>
                     <span className="text-[0.7rem] font-medium text-slate-400">Arquiteto Líder</span>
                   </div>
                 </div>
               </div>
            </div>
          </section>

          {/* Description Section */}
          <section className="flex flex-col gap-[1rem]">
             <div className="flex items-center gap-[0.6rem] text-slate-500">
               <MessageSquare size={18} />
               <h3 className="text-[0.75rem] font-black uppercase tracking-widest">Descrição</h3>
             </div>
             <div className="bg-slate-50 border border-slate-100 rounded-2xl p-[1.5rem] text-slate-600 font-medium leading-relaxed text-[0.95rem]">
               {task.description || "Sem descrição detalhada disponível para este card."}
             </div>
          </section>

          {/* Activity Timeline Section (Based on Screenshot) */}
          <section className="flex flex-col gap-[1.5rem]">
             <div className="flex items-center gap-[0.6rem] text-slate-500">
               <History size={18} />
               <h3 className="text-[0.75rem] font-black uppercase tracking-widest">Histórico de Atividade</h3>
             </div>
             
             <div className="flex flex-col gap-[1.5rem] pl-[0.5rem] relative">
               {(task.history && task.history.length > 0) ? (
                 <>
                   <div className="absolute left-[1.1rem] top-0 bottom-0 w-[2px] bg-slate-100" />
                   {task.history.map((item, idx) => (
                     <div key={idx} className="relative flex gap-[1.5rem]">
                       <div className={`w-[1.25rem] h-[1.25rem] rounded-full border-2 border-white z-10 shrink-0 mt-[0.2rem] ring-4 ring-white ${idx === 0 ? 'bg-blue-600' : 'bg-slate-100'}`} />
                       <div className="flex flex-col gap-[0.25rem]">
                          <p className="text-[0.9rem] font-bold text-slate-800">
                            {item.user} <span className="font-medium text-slate-500">{item.action}</span>
                          </p>
                          {item.observation && (
                            <div className="bg-slate-50 border-l-[3px] border-blue-500 p-[1.25rem] rounded-r-xl text-slate-500 text-[0.85rem] italic leading-relaxed">
                              "{item.observation}"
                            </div>
                          )}
                          <span className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-widest">{item.date}</span>
                       </div>
                     </div>
                   ))}
                 </>
               ) : (
                <p className="text-[0.85rem] text-slate-400 italic">Nenhum histórico disponível.</p>
               )}
             </div>
          </section>

          {/* Comments Section */}
          <section className="flex flex-col gap-[1.5rem] pb-[4rem]">
             <div className="flex items-center gap-[0.6rem] text-slate-500 border-t border-slate-50 pt-[2rem]">
               <MessageSquare size={18} />
               <h3 className="text-[0.75rem] font-black uppercase tracking-widest">Comentários ({task.commentsList?.length || 0})</h3>
             </div>
             
             {/* Comments List */}
             <div className="flex flex-col gap-[1.5rem]">
               {task.commentsList?.map(c => (
                 <div key={c.id} className="flex gap-[1rem] animate-fade-in">
                    <img src={c.userAvatar} alt={c.user} className="w-[2.5rem] h-[2.5rem] rounded-full border-2 border-white ring-1 ring-slate-100 shrink-0" />
                    <div className="flex flex-col gap-[0.25rem]">
                       <div className="flex items-center gap-[0.75rem]">
                         <span className="text-[0.85rem] font-black text-slate-800 uppercase tracking-tight">{c.user}</span>
                         <span className="text-[0.65rem] font-bold text-slate-400">{c.date}</span>
                       </div>
                       <div className="bg-slate-50 p-[1rem] rounded-2xl rounded-tl-none text-slate-600 font-medium text-[0.9rem] leading-relaxed">
                         {c.text}
                       </div>
                    </div>
                 </div>
               ))}
             </div>

             {/* Add Comment Input */}
             <div className="flex gap-[1rem] mt-[1rem]">
                <img src={`https://i.pravatar.cc/150?u=me`} alt="Logged User" className="w-[2.5rem] h-[2.5rem] rounded-full border-2 border-white ring-1 ring-slate-100 shrink-0" />
                <div className="flex-1 relative">
                  <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Escreva um comentário..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-[1rem] pr-[3.5rem] text-[0.9rem] font-medium outline-none focus:bg-white focus:border-blue-300 transition-all resize-none min-h-[5rem]"
                  />
                  <button 
                    onClick={handleSendComment}
                    className="absolute right-[0.8rem] bottom-[0.8rem] p-[0.6rem] bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all active:scale-90"
                  >
                    <Send size={16} />
                  </button>
                </div>
             </div>
          </section>
        </div>

        {/* Footer Fixed Actions */}
        <div className="p-[1.5rem] border-t border-slate-100 bg-slate-50/50 backdrop-blur-md sticky bottom-0 z-10 flex items-center justify-between gap-[1rem]">
           <button className="flex items-center gap-[0.5rem] px-[1.25rem] py-[0.75rem] bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-[0.8rem] hover:bg-slate-50 transition-colors">
              <User size={16} /> Subtarefas (4/12)
           </button>
           
           <div className="flex items-center gap-[1rem]">
             <button 
               onClick={onClose}
               className="px-[1.5rem] py-[0.8rem] text-slate-400 font-black text-[0.75rem] uppercase tracking-widest hover:text-slate-800 transition-colors"
             >
               Cancelar
             </button>
             <button 
               onClick={() => onMarkAsResolved(task.id)}
               className="flex items-center gap-[0.85rem] px-[2.5rem] py-[1rem] bg-blue-600 text-white font-black text-[0.8rem] rounded-xl hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-[0.98] shadow-lg border border-blue-500 uppercase tracking-widest"
             >
               <CheckCircle2 size={20} />
               Marcar como Resolvido
             </button>
           </div>
        </div>

      </div>
    </div>
  );
}
