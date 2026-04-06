"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './board.module.css';
import { 
  SlidersHorizontal, 
  MoreHorizontal, 
  AlertTriangle,
  Plus,
  MessageSquare,
  Calendar
} from 'lucide-react';
import Sidebar_Main from '@/components/Sidebar_Main';
import Top_Nav from '@/components/Top_Nav';

// --- Types ---
type UserRole = 'ADMIN' | 'EDITOR' | 'VISUALIZADOR' | 'MEMBRO';
type Priority = 'CRÍTICA' | 'ALTA' | 'MÉDIA' | 'BAIXA' | 'REVISÃO NECESSÁRIA';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  date: string;
  assignee: string; 
  comments?: number;
  alert?: string;
  isCriticaLayout?: boolean; 
}

interface ColumnData {
  id: string;
  title: string;
  wipLimit?: number;
  tasks: Task[];
}

interface BoardData {
  id: string;
  name: string;
  sprint: string;
  project: string;
  members: string[]; 
  columns: ColumnData[];
}

export default function BoardPage() {
  const params = useParams();
  const router = useRouter();
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('ADMIN');
  const [boardData, setBoardData] = useState<BoardData | null>(null);
  const [columns, setColumns] = useState<ColumnData[]>([]);

  useEffect(() => {
    const savedAuth = localStorage.getItem("tictac_auth");
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        setCurrentUserRole(parsed.role as UserRole);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const boardId = params?.id as string;
    
    setTimeout(() => {
      let data: BoardData;
      if (boardId === 'mkt-digital') {
        data = {
          id: boardId,
          name: 'Marketing Digital',
          sprint: 'CAMPANHA Q4',
          project: 'MARKETING',
          members: [
            'https://i.pravatar.cc/150?u=9',
            'https://i.pravatar.cc/150?u=10'
          ],
          columns: [
             { id: 'backlog', title: 'BACKLOG', tasks: [{ id: 'm1', title: 'Definir Copy para Anúncios no Meta', description: 'Escrever três variações de texto para a campanha de fim de ano', priority: 'MÉDIA', date: 'Nov 01, 2023', assignee: 'https://i.pravatar.cc/150?u=9' }] },
             { id: 'wip', title: 'EM ANDAMENTO', wipLimit: 2, tasks: [{ id: 'm2', title: 'Aprovação de Criativos de Vídeo', description: 'Aguardando o time de design enviar os cortes finais para TikTok.', priority: 'ALTA', date: 'Oct 25, 2023', assignee: 'https://i.pravatar.cc/150?u=10' }] },
             { id: 'review', title: 'REVISÃO', tasks: [] }
          ]
        };
      } else {
        data = {
          id: boardId || '123',
          name: boardId === 'dev-tic-tac' ? 'Desenvolvimento Tic Tac' : 'Desenvolvimento Core',
          sprint: 'SPRINT 24',
          project: 'ENGENHARIA DE SOFTWARE',
          members: [
            'https://i.pravatar.cc/150?u=1',
            'https://i.pravatar.cc/150?u=2',
            'https://i.pravatar.cc/150?u=3'
          ],
          columns: [
            { id: 'backlog', title: 'BACKLOG', tasks: [
              { id: 't1', title: 'Implementar Middleware de Autenticação', description: 'Configurar validação JWT para todas as rotas da API.', priority: 'MÉDIA', date: 'Oct 12, 2023', assignee: 'https://i.pravatar.cc/150?u=4' },
              { id: 't2', title: 'Atualizar Biblioteca de Assets SVG', description: 'Padronizar pesos de ícones em todo o kit de UI...', priority: 'BAIXA', date: 'Oct 15, 2023', assignee: 'https://i.pravatar.cc/150?u=5' }
            ]},
            { id: 'wip', title: 'EM ANDAMENTO', wipLimit: 3, tasks: [
              { id: 't3', title: 'Corrigir Vazamento de Dados de Produção', description: 'URGENTE: Logs do banco de dados expondo PII...', priority: 'CRÍTICA', alert: '! ASAP', date: 'Oct 10, 2023', assignee: 'https://i.pravatar.cc/150?u=6', isCriticaLayout: true },
              { id: 't4', title: 'Migração de Schema v2.4', description: 'Movendo preferências do usuário para nova camada...', priority: 'ALTA', date: 'Oct 10, 2023', assignee: 'https://i.pravatar.cc/150?u=7' }
            ]},
            { id: 'review', title: 'REVISÃO', tasks: [
              { id: 't5', title: 'Interface do Dashboard de Faturamento', description: 'Novos gráficos para métricas de crescimento...', priority: 'REVISÃO NECESSÁRIA', comments: 4, date: '', assignee: 'https://i.pravatar.cc/150?u=8' }
            ]}
          ]
        };
      }
      setBoardData(data);
      setColumns(data.columns);
    }, 500);
  }, [params?.id]);

  const handleNavigateToConstruction = () => router.push('/construction');
  const handleOpenModal = (modalName: string) => alert(`Abrir modal: ${modalName}`);

  const handleDragStart = (e: React.DragEvent, taskId: string, sourceColId: string) => {
    if (currentUserRole === 'VISUALIZADOR') return;
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("sourceColId", sourceColId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
  };

  const handleDrop = (e: React.DragEvent, targetColId: string) => {
    const taskId = e.dataTransfer.getData("taskId");
    const sourceColId = e.dataTransfer.getData("sourceColId");

    if (!taskId || !sourceColId || sourceColId === targetColId) return;

    const newCols = [...columns];
    const sourceColIndex = newCols.findIndex(c => c.id === sourceColId);
    const targetColIndex = newCols.findIndex(c => c.id === targetColId);
    
    const taskIndex = newCols[sourceColIndex].tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    
    const [movedTask] = newCols[sourceColIndex].tasks.splice(taskIndex, 1);
    newCols[targetColIndex].tasks.push(movedTask);
    
    setColumns(newCols);
  };

  if (!boardData) {
    return <div className={styles.loadingContainer}>Carregando Board...</div>;
  }

  const isViewer = currentUserRole === 'VISUALIZADOR';
  const checkWipAlert = (col: ColumnData) => col.wipLimit !== undefined && col.tasks.length > col.wipLimit;

  const getPriorityClass = (priority: Priority) => {
    switch(priority) {
      case 'CRÍTICA': return styles.priorityCritica;
      case 'ALTA': return styles.priorityAlta;
      case 'MÉDIA': return styles.priorityMedia;
      case 'BAIXA': return styles.priorityBaixa;
      case 'REVISÃO NECESSÁRIA': return styles.priorityRevisao;
      default: return '';
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar_Main />

      <main className={styles.mainWorkspace}>
        {/* Consistent Top Navigation */}
        <Top_Nav boardName={boardData.name} activeTab="board" />

        {/* Board Header Section */}
        <div className={styles.boardHeader}>
          <div className={styles.breadcrumb}>
            {boardData.project} &rsaquo; {boardData.sprint}
          </div>
          
          <div className={styles.headerMainContent}>
            <div className={styles.headerTitleGroup}>
              <h1 className={styles.h1Dynamic}>Board: {boardData.name}</h1>
              
              <div className={styles.memberAvatars} onClick={() => handleOpenModal('Participantes')}>
                {boardData.members.map((avatar, idx) => (
                  <div key={idx} className={styles.avatar} style={{ backgroundImage: `url(${avatar})` }} />
                ))}
                <div className={`${styles.avatar} ${styles.avatarExtra}`}>+8</div>
              </div>
            </div>
            
            <div className={styles.headerActions}>
              <button className={styles.filterBtn} onClick={handleNavigateToConstruction}>
                <SlidersHorizontal size={16} />
                Filtros
              </button>
              <button className={styles.addMemberBtn} onClick={() => handleOpenModal('Adicionar Participante')}>
                <Plus size={16} />
                Adicionar participante
              </button>
            </div>
          </div>
        </div>

        {/* Kanban Board Layout */}
        <div className={styles.kanbanBoard}>
          {columns.map(col => {
            const isWipAlert = checkWipAlert(col);
            
            return (
              <div 
                key={col.id} 
                className={`${styles.column} ${isWipAlert ? styles.columnWipAlert : ''}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                <div className={styles.columnHeader}>
                  <div className={styles.columnTitleGroup}>
                    <span className={styles.columnTitle}>{col.title}</span>
                    <span className={`${styles.columnCount} ${isWipAlert ? styles.wipAlertIndicator : ''}`}>
                      {col.tasks.length} {col.wipLimit ? `/ ${col.wipLimit}` : ''}
                    </span>
                  </div>
                  
                  {isWipAlert && <AlertTriangle size={16} className={styles.wipIcon} />}
                  {!isWipAlert && <MoreHorizontal size={16} className={styles.columnMoreBtn} />}
                </div>
                
                <div className={styles.columnContent}>
                  {col.tasks.map(task => (
                    <div 
                      key={task.id} 
                      draggable={!isViewer}
                      onDragStart={(e) => handleDragStart(e, task.id, col.id)}
                      className={`${styles.taskCard} ${isViewer ? styles.taskCardBlocked : ''} ${task.isCriticaLayout ? styles.cardCritica : ''}`}
                    >
                      <span className={`${styles.priorityPill} ${getPriorityClass(task.priority)}`}>
                        {task.priority}
                      </span>
                      
                      <h3 className={styles.taskTitle}>{task.title}</h3>
                      
                      {task.description && (
                        <p className={styles.taskDesc}>{task.description}</p>
                      )}
                      
                      {task.alert && (
                        <div className={styles.taskAlert}>
                          {task.alert}
                        </div>
                      )}
                      
                      {task.comments && (
                        <div className={styles.taskComments}>
                          <MessageSquare size={14} />
                          {task.comments} Comentários
                        </div>
                      )}

                      <div className={styles.taskFooter}>
                        {task.date ? (
                          <div className={styles.taskDate}>
                            <Calendar size={14} />
                            {task.date}
                          </div>
                        ) : <div />}
                        
                        <div className={styles.taskAssignee} style={{ backgroundImage: `url(${task.assignee})` }} />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className={styles.columnFooter}>
                  <button 
                    className={`${styles.addCardBtn} ${isViewer ? styles.addCardBtnBlocked : ''}`}
                    onClick={() => !isViewer && handleOpenModal('Adicionar Card')}
                    disabled={isViewer}
                  >
                    <Plus size={16} /> Adicionar Card
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
