"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './board.module.css';
import { 
  Settings, 
  Search, 
  Bell, 
  HelpCircle, 
  SlidersHorizontal, 
  MoreHorizontal, 
  AlertTriangle,
  Plus,
  MessageSquare,
  Calendar
} from 'lucide-react';
import Sidebar_Main from '@/components/Sidebar_Main';
import Top_Nav from '@/components/Top_Nav';
import Board_Settings_Modal from '@/components/modals/Board_Settings_Modal';
import { pushNotification } from "@/utils/notifications";
import Create_Task_Modal from '@/components/modals/Create_Task_Modal';
import Manage_Members_Modal from '@/components/modals/Manage_Members_Modal';
import Create_Column_Modal from '@/components/modals/Create_Column_Modal';
import Task_Details_Modal from '@/components/modals/Task_Details_Modal';
import Task_Move_Justification_Modal from '@/components/modals/Task_Move_Justification_Modal';

// --- Types ---
type UserRole = 'ADMIN' | 'EDITOR' | 'VISUALIZADOR' | 'MEMBRO';
type Priority = 'CRÍTICA' | 'ALTA' | 'MÉDIA' | 'BAIXA' | 'REVISÃO NECESSÁRIA';

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
  history: ActivityItem[];
  commentsList: CommentItem[];
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentBoardName, setCurrentBoardName] = useState('');
  const [currentBoardDesc, setCurrentBoardDesc] = useState('Workspace editorial para controle de tarefas e sprint.');
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [targetColumnId, setTargetColumnId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isManageMembersOpen, setIsManageMembersOpen] = useState(false);
  const [isCreateColumnOpen, setIsCreateColumnOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [pendingMove, setPendingMove] = useState<{ taskId: string; sourceColId: string; targetColId: string } | null>(null);

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
      const persistentData = localStorage.getItem(`tictac_board_data_${boardId}`);
      
      if (persistentData) {
        try {
          data = JSON.parse(persistentData);
        } catch (e) {
          data = getDefaultMockData(boardId);
        }
      } else {
        data = getDefaultMockData(boardId);
      }
      const savedInfo = localStorage.getItem(`tictac_board_info_${boardId}`);
      if (savedInfo) {
        try {
          const parsed = JSON.parse(savedInfo);
          data.name = parsed.name || data.name;
          setCurrentBoardDesc(parsed.description || 'Workspace editorial para controle de tarefas e sprint.');
        } catch (e) {}
      }
      
      setBoardData(data);
      setColumns(data.columns);
      setCurrentBoardName(data.name);
    }, 500);
  }, [params?.id]);

  const handleNavigateToConstruction = () => router.push('/construction');
  
  const logActivity = (action: 'CARD CRIADO' | 'CARD MOVIMENTADO' | 'CARD RESOLVIDO' | 'CONFIGURAÇÕES ATUALIZADAS', entity: string, justification: string) => {
    const boardId = params?.id as string;
    const auth = localStorage.getItem("tictac_auth");
    const userObj = auth ? JSON.parse(auth) : { name: 'Admin', role: 'ADMIN' };

    const newActivity = {
      id: Date.now().toString(),
      datetime: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      user: { name: userObj.name, avatar: 'AD', role: userObj.role },
      action,
      entity,
      justification
    };

    const existingLogs = JSON.parse(localStorage.getItem(`tictac_activity_log_${boardId}`) || '[]');
    localStorage.setItem(`tictac_activity_log_${boardId}`, JSON.stringify([newActivity, ...existingLogs]));
  };

  const handleOpenModal = (modalName: string) => alert(`Abrir modal: ${modalName}`);
  const handleSaveSettings = (data: { name: string; description: string; isArchived: boolean }) => {
    setCurrentBoardName(data.name);
    setCurrentBoardDesc(data.description);
    
    // Persist globally
    localStorage.setItem(`tictac_board_info_${params?.id}`, JSON.stringify({
      name: data.name,
      description: data.description,
      isArchived: data.isArchived
    }));

    logActivity('CONFIGURAÇÕES ATUALIZADAS', data.name, `O board foi reconfigurado. Novo status de arquivamento: ${data.isArchived ? 'Ativo' : 'Inativo'}.`);
    
    setIsSettingsOpen(false);
    
    // Reload to apply changes across all components (Sidebar, Top Nav, etc.)
    window.location.reload();
  };

  const handleCreateTask = (data: { title: string; description: string; priority: string; date: string }) => {
    if (!targetColumnId) return;

    const auth = localStorage.getItem("tictac_auth");
    const user = auth ? JSON.parse(auth).name : "Admin";

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: data.title,
      description: data.description,
      priority: data.priority as Priority,
      date: data.date ? new Date(data.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Sem data',
      assignee: 'A',
      history: [{
        user: user,
        action: "criou este card",
        date: new Date().toLocaleDateString('pt-BR') + ' · ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }],
      commentsList: []
    };

    const newCols = columns.map(col => col.id === targetColumnId ? { ...col, tasks: [...col.tasks, newTask] } : col);
    setColumns(newCols);
    if (boardData) {
      localStorage.setItem(`tictac_board_data_${boardData.id}`, JSON.stringify({ ...boardData, columns: newCols }));
    }
    logActivity('CARD CRIADO', data.title, data.description || 'Tarefa inicial criada no board.');
    setIsCreateTaskOpen(false);
    setTargetColumnId(null);
  };

  const handleCommentAdded = (taskId: string, commentText: string) => {
    const auth = localStorage.getItem("tictac_auth");
    const user = auth ? JSON.parse(auth).name : "Admin";
    const avatar = `https://i.pravatar.cc/150?u=${user}`;

    const newComment: CommentItem = {
      id: `comment-${Date.now()}`,
      user,
      userAvatar: avatar,
      date: new Date().toLocaleDateString('pt-BR') + ' · ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      text: commentText
    };

    const newCols = columns.map(col => ({
      ...col,
      tasks: col.tasks.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            commentsList: [...t.commentsList, newComment],
            comments: (t.comments || 0) + 1
          };
        }
        return t;
      })
    }));
    setColumns(newCols);
    
    // Update selected task to reflect changes in modal immediately
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(prev => prev ? {
        ...prev,
        commentsList: [...prev.commentsList, newComment],
        comments: (prev.comments || 0) + 1
      } : null);
    }
  };


  const handleMarkAsResolved = (taskId: string) => {
    const task = columns.flatMap(c => c.tasks).find(t => t.id === taskId);
    const newCols = columns.map(col => ({
      ...col,
      tasks: col.tasks.filter(t => t.id !== taskId)
    }));
    setColumns(newCols);
    if (boardData) {
      localStorage.setItem(`tictac_board_data_${boardData.id}`, JSON.stringify({ ...boardData, columns: newCols }));
    }
    if (task) {
      logActivity('CARD RESOLVIDO', task.title, 'A tarefa foi marcada como resolvida e arquivada.');
    }
    setIsDetailsOpen(false);
    setSelectedTask(null);
  };

  const handleSaveMembers = (memberAvatars: string[]) => {
    if (boardData) {
      const updatedData = { ...boardData, members: memberAvatars };
      setBoardData(updatedData);
      
      // PERSISTENT UPDATE: Syncing to database for other sessions (e.g. Bob's view)
      localStorage.setItem(`tictac_board_data_${boardData.id}`, JSON.stringify(updatedData));
      
      // Inform the global board list about the new member total
      const allBoardsRaw = localStorage.getItem('tictac_all_boards');
      if (allBoardsRaw) {
        try {
          const allBoards = JSON.parse(allBoardsRaw);
          const updated = allBoards.map((b: any) => 
            b.id === boardData.id ? { ...b, members: memberAvatars.length, initials: memberAvatars.slice(0, 2) } : b
          );
          localStorage.setItem('tictac_all_boards', JSON.stringify(updated));
        } catch (e) {}
      }

      logActivity('CONFIGURAÇÕES ATUALIZADAS', 'Participantes', `Lista de membros atualizada para ${memberAvatars.length} usuários.`);
    }
    setIsManageMembersOpen(false);
  };

  const handleAddColumn = (data: { title: string; wipLimit?: number }) => {
    const newCol: ColumnData = {
      id: `col-${Date.now()}`,
      title: data.title.toUpperCase(),
      wipLimit: data.wipLimit,
      tasks: []
    };
    setColumns([...columns, newCol]);
    if (boardData) {
      localStorage.setItem(`tictac_board_data_${boardData.id}`, JSON.stringify({ ...boardData, columns: [...columns, newCol] }));
    }
    setIsCreateColumnOpen(false);
  };

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
    
    // Intercept to show justification modal
    setPendingMove({ taskId, sourceColId, targetColId });
    setIsMoveModalOpen(true);
  };

  const confirmMove = (observation: string) => {
    if (!pendingMove) return;
    const { taskId, sourceColId, targetColId } = pendingMove;

    const auth = localStorage.getItem("tictac_auth");
    const user = auth ? JSON.parse(auth).name : "Alguém";

    const newCols = [...columns];
    const sourceColIndex = newCols.findIndex(c => c.id === sourceColId);
    const targetColIndex = newCols.findIndex(c => c.id === targetColId);
    
    const taskIndex = newCols[sourceColIndex].tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    
    const [movedTask] = newCols[sourceColIndex].tasks.splice(taskIndex, 1);
    
    const historyEntry: ActivityItem = {
      user,
      action: `moveu de ${newCols[sourceColIndex].title} para ${newCols[targetColIndex].title}`,
      date: new Date().toLocaleDateString('pt-BR') + ' · ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      observation: observation // Save justification here
    };

    movedTask.history = [...(movedTask.history || []), historyEntry];
    newCols[targetColIndex].tasks.push(movedTask);
    
    setColumns(newCols);
    if (boardData) {
      localStorage.setItem(`tictac_board_data_${boardData.id}`, JSON.stringify({ ...boardData, columns: newCols }));
      
      // Trigger notifications for all board members
      const memberNames = ['Alice', 'Bob', 'Carol', 'Dave', 'Admin']; // Proto-mapping
      memberNames.forEach(member => {
        pushNotification(member, {
          title: 'Card Movimentado',
          message: `O card "${movedTask.title}" foi movido para "${newCols[targetColIndex].title}" no projeto "${boardData.name}".`,
          type: 'TASK_MOVED',
          boardId: boardData.id
        });
      });
    }
    logActivity('CARD MOVIMENTADO', movedTask.title, observation);
    setIsMoveModalOpen(false);
    setPendingMove(null);
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
      <Sidebar_Main activeView="none" />

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
              <h1 className={styles.h1Dynamic}>Board: {currentBoardName}</h1>
              
              <div className={styles.memberAvatars}>
                {boardData.members.slice(0, 3).map((initial, idx) => (
                  <div key={idx} className={`${styles.avatar} flex items-center justify-center bg-slate-800 text-white font-black text-[0.7rem] border-2 border-white`}>
                    {initial.charAt(0).toUpperCase()}
                  </div>
                ))}
                {boardData.members.length > 3 && (
                  <div className={`${styles.avatar} ${styles.avatarExtra}`}>+{boardData.members.length - 3}</div>
                )}
              </div>
            </div>
            
            <div className={styles.headerActions}>
              <button 
                className={styles.filterBtn} 
                onClick={() => setIsCreateColumnOpen(true)}
              >
                <Plus size={18} />
                Nova Coluna
              </button>

              <button className={styles.filterBtn} onClick={() => setIsSettingsOpen(true)}>
                <Settings size={18} />
                Configurações
              </button>

              {currentUserRole === 'ADMIN' && (
                <button className={styles.addMemberBtn} onClick={() => setIsManageMembersOpen(true)}>
                  <Plus size={16} />
                  Gerenciar participantes
                </button>
              )}
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
                      onClick={() => {
                        setSelectedTask(task);
                        setIsDetailsOpen(true);
                      }}
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
                    onClick={() => {
                      if (!isViewer) {
                        setTargetColumnId(col.id);
                        setIsCreateTaskOpen(true);
                      }
                    }}
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

      {/* Settings Modal */}
      <Board_Settings_Modal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentData={{ name: currentBoardName, description: currentBoardDesc }}
        onSave={handleSaveSettings}
      />
      {/* Create Task Modal */}
      <Create_Task_Modal 
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        onSave={handleCreateTask}
      />
      {/* Task Details Drawer */}
      <Task_Details_Modal 
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        task={selectedTask}
        onMarkAsResolved={handleMarkAsResolved}
        onAddComment={handleCommentAdded}
      />
      {/* Manage Members Modal */}
      <Manage_Members_Modal
        isOpen={isManageMembersOpen}
        onClose={() => setIsManageMembersOpen(false)}
        onSave={handleSaveMembers}
        currentMembers={boardData.members}
        boardId={boardData.id}
      />
      {/* Create Column Modal */}
      <Create_Column_Modal 
        isOpen={isCreateColumnOpen}
        onClose={() => setIsCreateColumnOpen(false)}
        onSave={handleAddColumn}
      />
      {/* Move Justification Modal */}
      <Task_Move_Justification_Modal
        isOpen={isMoveModalOpen}
        onClose={() => {
          setIsMoveModalOpen(false);
          setPendingMove(null);
        }}
        onConfirm={confirmMove}
        taskTitle={columns.flatMap(c => c.tasks).find(t => t.id === pendingMove?.taskId)?.title || ""}
        targetColumnTitle={columns.find(c => c.id === pendingMove?.targetColId)?.title || ""}
      />
    </div>
  );
}

function getDefaultMockData(boardId: string): BoardData {
  if (boardId === 'mkt-digital') {
    return {
      id: boardId,
      name: 'Marketing Digital',
      sprint: 'CAMPANHA Q4',
      project: 'MARKETING',
      members: ['A', 'A', 'B'],
      columns: [
          { id: 'backlog', title: 'BACKLOG', tasks: [{ id: 'm1', title: 'Definir Copy para Anúncios no Meta', description: 'Escrever três variações de texto para a campanha de fim de ano', priority: 'MÉDIA', date: 'Nov 01, 2023', assignee: 'A', history: [], commentsList: [] }] },
          { id: 'wip', title: 'EM ANDAMENTO', wipLimit: 2, tasks: [{ id: 'm2', title: 'Aprovação de Criativos de Vídeo', description: 'Aguardando o time de design enviar os cortes finais para TikTok.', priority: 'ALTA', date: 'Oct 25, 2023', assignee: 'A', history: [], commentsList: [] }] },
          { id: 'review', title: 'REVISÃO', tasks: [] }
      ]
    };
  }
  return {
    id: boardId || '123',
    name: boardId === 'dev-tic-tac' ? 'Desenvolvimento Tic Tac' : 'Desenvolvimento Core',
    sprint: 'SPRINT 24',
    project: 'ENGENHARIA DE SOFTWARE',
    members: ['A', 'A', 'B', 'C', 'D'],
    columns: [
      { id: 'backlog', title: 'BACKLOG', tasks: [
        { id: 't1', title: 'Implementar Middleware de Autenticação', description: 'Configurar validação JWT para todas as rotas da API.', priority: 'MÉDIA', date: 'Oct 12, 2023', assignee: 'A', history: [], commentsList: [] },
        { id: 't2', title: 'Atualizar Biblioteca de Assets SVG', description: 'Padronizar pesos de ícones em todo o kit de UI...', priority: 'BAIXA', date: 'Oct 15, 2023', assignee: 'C', history: [], commentsList: [] }
      ]},
      { id: 'wip', title: 'EM ANDAMENTO', wipLimit: 3, tasks: [
        { id: 't3', title: 'Corrigir Vazamento de Dados de Produção', description: 'URGENTE: Logs do banco de dados expondo PII...', priority: 'CRÍTICA', alert: '! ASAP', date: 'Oct 10, 2023', assignee: 'A', isCriticaLayout: true, history: [], commentsList: [] },
        { id: 't4', title: 'Migração de Schema v2.4', description: 'Movendo preferências do usuário para nova camada...', priority: 'ALTA', date: 'Oct 10, 2023', assignee: 'B', history: [], commentsList: [] }
      ]},
      { id: 'review', title: 'REVISÃO', tasks: [
        { id: 't5', title: 'Interface do Dashboard de Faturamento', description: 'Novos gráficos para métricas de crescimento...', priority: 'REVISÃO NECESSÁRIA', comments: 4, date: '', assignee: 'D', history: [], commentsList: [] }
      ]}
    ]
  };
}
