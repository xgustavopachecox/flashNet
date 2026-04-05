"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './board.module.css';
import { 
  LayoutDashboard, 
  Activity, 
  Settings, 
  Search, 
  Bell, 
  HelpCircle, 
  UserCircle, 
  SlidersHorizontal, 
  UserPlus, 
  MoreHorizontal, 
  AlertTriangle,
  Plus,
  MessageSquare,
  Calendar
} from 'lucide-react';

// --- Types ---
type UserRole = 'ADMIN' | 'EDITOR' | 'VISUALIZADOR' | 'MEMBRO';
type Priority = 'CRÍTICA' | 'ALTA' | 'MÉDIA' | 'BAIXA' | 'REVISÃO NECESSÁRIA';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  date: string;
  assignee: string; // url to avatar
  comments?: number;
  alert?: string;
  isCriticaLayout?: boolean; // For specific visual styling
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
  members: string[]; // urls to avatars
  columns: ColumnData[];
}

export default function BoardPage() {
  const params = useParams();
  const router = useRouter();
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('ADMIN');
  const [currentUserName, setCurrentUserName] = useState<string>('Admin');
  const [boardData, setBoardData] = useState<BoardData | null>(null);
  const [columns, setColumns] = useState<ColumnData[]>([]);

  useEffect(() => {
    const savedAuth = localStorage.getItem("tictac_auth");
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        setCurrentUserRole(parsed.role as UserRole);
        setCurrentUserName(parsed.name);
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

  const handleNavigateToConstruction = () => alert('Navegar para: TELA EM CONSTRUÇÃO');
  const handleOpenModal = (modalName: string) => alert(`Abrir modal: ${modalName}`);

  const handleDragStart = (e: React.DragEvent, taskId: string, sourceColId: string) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("sourceColId", sourceColId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessário para permitir o drop
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
    
    // Remove from source and push to target
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
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarLogo}>
            <LayoutDashboard size={18} />
          </div>
          <div className={styles.sidebarTitleGroup}>
            <span className={styles.sidebarTitle}>Tic Tac</span>
            <span className={styles.sidebarSubtitle}>Premium Workspace</span>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          <a onClick={() => router.push('/')} className={styles.navItem}>
            <LayoutDashboard size={18} />
            Meus boards
          </a>
          <a onClick={handleNavigateToConstruction} className={styles.navItem}>
            <Activity size={18} />
            Atividades Global
          </a>
          <a onClick={handleNavigateToConstruction} className={styles.navItem}>
            <Settings size={18} />
            Configurações
          </a>
        </nav>

        {/* User Role Footer Matching Main Page */}
        <div className="mt-auto border-t border-slate-200 p-[1.5rem] flex flex-col gap-[1rem]">
          <div 
            onClick={() => {
              localStorage.removeItem("tictac_auth");
              router.push('/');
            }}
            className="flex items-center gap-[0.75rem] p-[0.75rem] bg-white border border-slate-200 rounded-2xl w-full cursor-pointer hover:bg-slate-100 transition-colors shadow-sm group"
          >
            <div className="flex items-center justify-center w-[2.5rem] h-[2.5rem] rounded-full bg-blue-100 text-blue-700 font-bold text-lg shrink-0 border border-blue-200 group-hover:bg-blue-700 group-hover:text-white transition-colors">
              {currentUserName.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col flex-1 truncate">
              <span className="text-sm font-bold text-slate-800 tracking-wide truncate">{currentUserName}</span>
              <span className="text-[0.65rem] text-slate-500 font-bold tracking-widest uppercase">{currentUserRole}</span>
            </div>
            <button className="w-[2rem] h-[2rem] flex items-center justify-center rounded-lg bg-slate-100 group-hover:bg-red-100 group-hover:text-red-700 transition-colors shrink-0">
              <svg width="1.25rem" height="1.25rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className={styles.mainWorkspace}>
        {/* Top Navbar */}
        <header className={styles.topNav}>
          <div className={styles.topNavLeft}>
            <span className={styles.boardName}>Projetos</span>
            <div className={styles.tabs}>
              <div className={`${styles.tab} ${styles.active}`}>Board</div>
              <div className={styles.tab} onClick={handleNavigateToConstruction}>Atividades</div>
              <div className={styles.tab} onClick={handleNavigateToConstruction}>Files</div>
            </div>
          </div>
          
          <div className={styles.topNavRight}>
            <div className={styles.searchBar}>
              <Search size={16} color="#94a3b8" />
              <input type="text" placeholder="Busca rápida..." className={styles.searchInput} />
            </div>
            <div className={styles.headerIcons}>
              <div className={styles.iconBtn}><Bell size={20} /></div>
              <div className={styles.iconBtn}><HelpCircle size={20} /></div>
            </div>
          </div>
        </header>

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
