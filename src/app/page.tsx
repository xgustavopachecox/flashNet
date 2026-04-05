"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, Bell, Filter, LayoutGrid, Activity, Settings, 
  HelpCircle, LogOut, Map, Megaphone, Plus, Construction, Menu, X, Archive, Loader2, AlertTriangle, AlertCircle, FolderArchive
} from "lucide-react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

// --- VIEWS E APOIO ---

function ConstructionView({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-[4vw]">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-[4vw] flex flex-col items-center text-center w-full max-w-lg animate-in zoom-in-95 duration-300">
        <div className="bg-red-50 text-red-700 p-[1.5rem] rounded-full mb-[1.5rem] relative">
          <Construction className="w-[3rem] h-[3rem]" />
          <div className="absolute top-[0.5rem] right-[0.5rem] w-[1rem] h-[1rem] bg-blue-700 rounded-full animate-ping" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-[1rem]">TELA EM CONSTRUÇÃO</h1>
        <p className="text-slate-500 text-base mb-[2rem] leading-relaxed">
          Área protegida do Tic Tac. A funcionalidade solicitada não está disponível neste protótipo.
        </p>
        <button 
          onClick={onBack}
          className="w-full h-[3rem] bg-blue-700 text-white text-base font-medium hover:bg-blue-800 transition-colors rounded-xl"
        >
          Voltar ao Dashboard
        </button>
      </div>
    </div>
  );
}

// --- TELAS ---

function TicTacLogin({ onLogin }: { onLogin: (role: string, name: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState<"none" | "invalid_password" | "403">("none");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorState("none");

    setTimeout(() => {
      setIsLoading(false);
      const userLower = username.toLowerCase();
      
      if (userLower === "dave" && password === "Teste@123") {
        setErrorState("403");
      } else if (userLower === "admin" && password === "Admin@123") {
        onLogin("ADMIN", "Admin");
      } else if (["alice", "bob", "carol"].includes(userLower) && password === "Teste@123") {
        const capitalizedName = userLower.charAt(0).toUpperCase() + userLower.slice(1);
        onLogin("MEMBRO", capitalizedName);
      } else {
        setErrorState("invalid_password");
      }
    }, 1500);
  };

  return (
    <div 
      className={`min-h-screen flex flex-col items-center justify-center p-6 relative w-full ${inter.className}`}
      style={{ background: 'radial-gradient(circle at center, #FFFFFF 0%, #F8FAFC 100%)' }}
    >
      <div className="flex flex-col items-center w-full max-w-[440px] animate-in slide-in-from-bottom-4 duration-500">
        
        {/* Header_TicTac Login */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="bg-blue-700 w-[3rem] h-[3rem] rounded-full flex items-center justify-center mb-[1rem]">
            <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-[0.5rem] tracking-tight">Tic Tac</h1>
          <p className="text-sm text-slate-500">
            Kanban editorial para equipes de alta performance.
          </p>
        </div>
        
        {/* Formulário Login */}
        <main className="bg-white rounded-[1rem] shadow-[0_0.6rem_1.5rem_rgba(0,0,0,0.05)] p-[2.5rem] w-full">
          <form onSubmit={handleLogin} className="flex flex-col gap-[1.5rem]">
            
            {errorState === "403" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1 text-left">
                  <h3 className="text-red-700 text-sm font-bold">Acesso Negado (403)</h3>
                  <p className="text-red-700 text-xs opacity-90 leading-relaxed">
                    Sua conta foi desativada. Por favor, entre em contato com o administrador da sua organização para suporte.
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 text-left">
              <label htmlFor="username" className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                USUÁRIO
              </label>
              <input 
                id="username"
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="nome"
                required
                disabled={isLoading}
                className="w-full h-11 px-4 rounded-lg bg-slate-50 border border-transparent text-sm text-slate-800 outline-none focus:border-blue-700 focus:bg-white transition-colors disabled:opacity-60 focus:ring-4 focus:ring-blue-700/10"
              />
            </div>

            <div className="flex flex-col gap-2 text-left">
              <label htmlFor="password" className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                SENHA
              </label>
              <div className="relative">
                <input 
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  className={`w-full h-11 px-4 rounded-lg bg-slate-50 border text-sm text-slate-800 outline-none transition-colors disabled:opacity-60 pr-10 focus:ring-4 focus:ring-blue-700/10 ${
                    errorState === "invalid_password" 
                      ? "border-red-700 focus:border-red-700 focus:ring-red-700/10" 
                      : "border-transparent focus:border-blue-700 focus:bg-white"
                  }`}
                />
                {errorState === "invalid_password" && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <AlertTriangle className="h-4 w-4 text-red-700" />
                  </div>
                )}
              </div>
              {errorState === "invalid_password" && (
                <p className="text-xs text-red-700 animate-in fade-in slide-in-from-top-1 duration-200">
                  Senha incorreta. Por favor, tente novamente.
                </p>
              )}
            </div>

            <button 
              type="submit"
              disabled={isLoading || !username || !password}
              className="w-full h-11 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-700/70 transition-colors rounded-lg flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                  <span className="text-white text-sm font-medium">Entrando...</span>
                </>
              ) : (
                <span className="text-white text-sm font-medium">Entrar</span>
              )}
            </button>
          </form>
        </main>

        <p className="mt-[2rem] text-slate-400 text-xs">Exemplos de Mock: admin/Admin@123 ou alice/Teste@123 ou dave/Teste@123(403)</p>
      </div>
    </div>
  );
}

function TicTacDashboard({ userRole, userName, onLogout }: { userRole: string, userName: string, onLogout: () => void }) {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<"dashboard" | "construction">("dashboard");
  const [activeTab, setActiveTab] = useState<"boards" | "arquivados">("boards");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAnimatingTab, setIsAnimatingTab] = useState(false);

  const handleNavigate = () => {
    setCurrentView("construction");
    setIsMobileMenuOpen(false);
  };

  const switchTab = (tab: "boards" | "arquivados") => {
    if (tab === activeTab) return;
    setIsAnimatingTab(true);
    // Tempo da animação para troca de conteúdo fluido
    setTimeout(() => {
      setActiveTab(tab);
      setIsAnimatingTab(false);
    }, 150);
  };

  const handleModal = () => {
    console.log("Abertura de Modal Ativada");
  };

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col md:flex-row ${inter.className} animate-in fade-in duration-500`}>
      
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between bg-white p-[1rem] border-b border-slate-200 sticky top-0 z-20">
         <div className="flex items-center gap-[0.5rem]">
            <div className="bg-blue-700 w-[2.5rem] h-[2.5rem] rounded-full flex items-center justify-center">
              <svg width="1.25rem" height="1.25rem" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-lg">Tic Tac</span>
          </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-[0.5rem] text-slate-500 hover:text-blue-700 transition-colors">
          {isMobileMenuOpen ? <X className="w-[1.5rem] h-[1.5rem]"/> : <Menu className="w-[1.5rem] h-[1.5rem]" />}
        </button>
      </div>

      {/* Sidebar_Nav */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 bg-slate-50 border-r border-slate-200 flex flex-col transition-transform duration-300 shadow-xl 
        md:translate-x-0 md:static md:w-[20vw] md:min-w-[15rem] md:shadow-none
        ${isMobileMenuOpen ? 'translate-x-0 w-[80vw]' : '-translate-x-full'}
      `}>
        <div className="p-[2vw] flex flex-col h-full overflow-y-auto">
          {/* Logo Identity */}
          <div className="flex items-center gap-[0.75rem] mb-[2rem]">
            <div className="bg-blue-700 w-[2.5rem] h-[2.5rem] rounded-full flex items-center justify-center shrink-0">
              <svg width="1.25rem" height="1.25rem" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-slate-800 leading-none">Tic Tac</h2>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-[0.25rem]">Premium Workspace</span>
            </div>
          </div>

          {/* Primary Action */}
          {userRole === 'ADMIN' && (
            <button 
              onClick={handleModal}
              className="w-full bg-blue-700 text-white hover:bg-blue-800 transition-all transform hover:-translate-y-[0.1rem] rounded-xl h-[3rem] flex items-center justify-center gap-[0.5rem] font-medium text-sm mb-[2rem] shadow-[0_0.25rem_0.75rem_rgba(29,78,216,0.3)] hover:shadow-[0_0.35rem_1rem_rgba(29,78,216,0.4)]"
            >
              <Plus className="w-[1rem] h-[1rem]" />
              Criar Quadro
            </button>
          )}

          {/* Main Navigation */}
          <nav className="flex-1 flex flex-col gap-[0.25rem]">
            <button onClick={() => setCurrentView("dashboard")} className={`flex items-center gap-[0.75rem] px-[1rem] py-[0.75rem] rounded-xl font-medium text-sm transition-colors text-left ${currentView === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-200 hover:text-slate-800'}`}>
              <LayoutGrid className="w-[1.25rem] h-[1.25rem]" />
              Meus boards
            </button>
            <button onClick={handleNavigate} className="flex items-center gap-[0.75rem] px-[1rem] py-[0.75rem] text-slate-500 hover:bg-slate-200 hover:text-slate-800 rounded-xl font-medium text-sm transition-colors text-left group">
              <Activity className="w-[1.25rem] h-[1.25rem] group-hover:scale-110 transition-transform" />
              Atividades Global
            </button>
            <button onClick={handleNavigate} className="flex items-center gap-[0.75rem] px-[1rem] py-[0.75rem] text-slate-500 hover:bg-slate-200 hover:text-slate-800 rounded-xl font-medium text-sm transition-colors text-left group">
              <Settings className="w-[1.25rem] h-[1.25rem] group-hover:rotate-180 transition-transform duration-500" />
              Configurações
            </button>
          </nav>

          {/* User_Role_Footer */}
          <div className="mt-[2rem] border-t border-slate-200 pt-[1.5rem] flex flex-col gap-[1rem]">
            <button onClick={handleNavigate} className="flex items-center gap-[0.75rem] px-[1rem] py-[0.5rem] text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium w-full text-left">
              <HelpCircle className="w-[1.25rem] h-[1.25rem]" />
              Support
            </button>

            {/* Ação de Logout Conforme Solicitado */}
            <div className="flex items-center gap-[0.75rem] p-[0.75rem] bg-white border border-slate-200 rounded-2xl w-full mt-[0.5rem] cursor-pointer hover:bg-slate-100 transition-colors shadow-sm group" onClick={onLogout}>
              <div className="flex items-center justify-center w-[2.5rem] h-[2.5rem] rounded-full bg-blue-100 text-blue-700 font-bold text-lg shrink-0 border border-blue-200 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col flex-1 truncate">
                <span className="text-sm font-bold text-slate-800 tracking-wide truncate">{userName}</span>
                <span className="text-[0.65rem] text-slate-500 font-bold tracking-widest uppercase">{userRole}</span>
              </div>
              <button 
                className="w-[2rem] h-[2rem] flex items-center justify-center rounded-lg bg-slate-100 group-hover:bg-red-100 group-hover:text-red-700 transition-colors shrink-0"
                title="Deslogar e voltar pro Login"
              >
                <LogOut className="w-[1.25rem] h-[1.25rem] group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main_Content */}
      <main className="flex-1 flex flex-col bg-white h-screen overflow-y-auto relative w-full">
        
        {/* TopNav Section */}
        <header className="bg-white border-b border-slate-200 px-[4vw] py-[1.25rem] flex flex-col md:flex-row md:items-center justify-between gap-[1rem] sticky top-0 z-10 w-full hidden md:flex">
          <div className="flex items-center gap-[2.5rem]">
            <h1 className="text-2xl font-bold text-slate-800">Projetos</h1>
            
            {/* Tabs com Animação Visual */}
            <div className="flex gap-[1.5rem] mt-[0.25rem]">
              <button 
                onClick={() => switchTab("boards")}
                className={`text-xs font-bold uppercase tracking-widest pb-[1.5rem] -mb-[1.5rem] transition-all relative ${activeTab === 'boards' ? 'text-blue-700' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Meus boards
                {activeTab === 'boards' && <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-blue-700 rounded-t-sm" />}
              </button>
              <button 
                onClick={() => switchTab("arquivados")}
                className={`text-xs font-bold uppercase tracking-widest pb-[1.5rem] -mb-[1.5rem] transition-all relative ${activeTab === 'arquivados' ? 'text-blue-700' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Arquivados
                {activeTab === 'arquivados' && <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-blue-700 rounded-t-sm" />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-[1.5rem] flex-1 max-w-lg justify-end">
            <div className="relative group flex-1 max-w-sm">
              <Search className="w-[1.25rem] h-[1.25rem] text-slate-400 absolute left-[1rem] top-1/2 -translate-y-1/2 group-focus-within:text-blue-700 transition-colors" />
              <input 
                type="text" 
                placeholder="Pesquisar boards..." 
                className="w-full h-[2.5rem] bg-slate-50 rounded-full pl-[2.75rem] pr-[1rem] text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-800/10 border border-transparent focus:border-slate-200 transition-all font-medium"
              />
            </div>
            <button onClick={handleNavigate} className="relative text-slate-500 hover:text-slate-800 transition-colors shrink-0">
              <Bell className="w-[1.5rem] h-[1.5rem]" />
              <span className="absolute -top-[0.25rem] -right-[0.25rem] w-[0.75rem] h-[0.75rem] bg-red-700 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* View Routing / Tab Content Routing */}
        {currentView === "dashboard" ? (
          
          <div className={`p-[4vw] w-full flex-1 flex flex-col justify-start items-stretch transition-opacity duration-300 ${isAnimatingTab ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'}`}>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-[1rem] mb-[2vw]">
              <div className="flex flex-col gap-[0.5rem]">
                <h2 className="text-3xl font-bold text-slate-800 tracking-tight leading-tight">
                  {activeTab === 'boards' ? 'Projetos' : 'Arquivados'}
                </h2>
                <p className="text-base text-slate-500">
                  {activeTab === 'boards' ? 'Planeje suas tasks para sua equipe.' : 'Acesse boards bloqueados, encerrados e históricos.'}
                </p>
              </div>
              <button onClick={handleNavigate} className="flex items-center justify-center gap-[0.5rem] h-[2.5rem] px-[1.5rem] border border-slate-200 bg-white rounded-full text-sm font-medium text-slate-800 hover:border-blue-700/30 hover:bg-slate-50 transition-colors shadow-sm self-start md:self-auto shrink-0 shadow-[0_0.1rem_0.25rem_rgba(0,0,0,0.02)]">
                <Filter className="w-[1.25rem] h-[1.25rem]" />
                Filtro
              </button>
            </div>

            {/* Tab Conteúdo Variante (Grid) */}
            {activeTab === 'boards' ? (

              <div className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-[2vw]">
                {/* Board_Card 1 */}
                <div onClick={() => router.push('/board/dev-tic-tac')} className="group bg-white rounded-2xl p-[1.5rem] shadow-sm border border-slate-100 flex flex-col hover:border-blue-700/30 hover:shadow-[0_0.5rem_1.5rem_rgba(29,78,216,0.08)] transition-all cursor-pointer min-h-[12rem] h-full">
                  <div className="flex justify-between items-start mb-[1rem]">
                    <div className="w-[3rem] h-[3rem] rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                      <Map className="w-[1.5rem] h-[1.5rem]" />
                    </div>
                    {userRole === 'MEMBRO' && (
                      <span className="bg-blue-100 text-blue-700 text-xs font-bold px-[0.75rem] py-[0.25rem] rounded-full uppercase tracking-widest">
                        EDITOR
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-[0.25rem]">Desenvolvimento Tic Tac</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed flex-grow">Planejamento estratégico trimestral</p>
                  
                  <div className="mt-auto flex items-center justify-between pt-[1.5rem] border-t border-slate-50 text-slate-400 text-xs font-medium">
                    <div className="flex items-center -space-x-[0.5rem]">
                        <div className="w-[2rem] h-[2rem] rounded-full border-2 border-white bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs uppercase">TS</div>
                        <div className="w-[2rem] h-[2rem] rounded-full border-2 border-white bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs uppercase">AB</div>
                        <div className="w-[2rem] h-[2rem] rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[0.6rem] text-slate-600 font-bold z-10">+4</div>
                    </div>
                    <div className="flex items-center gap-[1rem]">
                      <span className="flex items-center gap-[0.25rem]"><span className="text-sm">👥</span> 12</span>
                      <span className="flex items-center gap-[0.25rem]"><span className="text-sm">📋</span> 48</span>
                    </div>
                  </div>
                </div>

                {/* Board_Card 2 */}
                <div onClick={() => router.push('/board/mkt-digital')} className="group bg-white rounded-2xl p-[1.5rem] shadow-sm border border-slate-100 flex flex-col hover:border-blue-700/30 hover:shadow-[0_0.5rem_1.5rem_rgba(29,78,216,0.08)] transition-all cursor-pointer min-h-[12rem] h-full">
                  <div className="flex justify-between items-start mb-[1rem]">
                    <div className="w-[3rem] h-[3rem] rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                      <Megaphone className="w-[1.5rem] h-[1.5rem]" />
                    </div>
                    {userRole === 'MEMBRO' && (
                      <span className="bg-slate-100 text-slate-500 text-xs font-bold px-[0.75rem] py-[0.25rem] rounded-full uppercase tracking-widest">
                        VISUALIZADOR
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-[0.25rem]">Marketing Digital</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed flex-grow">Campanhas de redes sociais</p>
                  
                  <div className="mt-auto flex items-center justify-between pt-[1.5rem] border-t border-slate-50 text-slate-400 text-xs font-medium">
                    <div className="flex items-center -space-x-[0.5rem]">
                       <div className="w-[2rem] h-[2rem] rounded-full border-2 border-white bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs uppercase">MK</div>
                       <div className="w-[2rem] h-[2rem] rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[0.6rem] text-slate-600 font-bold z-10">+2</div>
                    </div>
                    <div className="flex items-center gap-[1rem]">
                      <span className="flex items-center gap-[0.25rem]"><span className="text-sm">👥</span> 5</span>
                      <span className="flex items-center gap-[0.25rem]"><span className="text-sm">📋</span> 16</span>
                    </div>
                  </div>
                </div>

                {/* Action Card - New Board */}
                {userRole === 'ADMIN' && (
                  <button 
                    onClick={handleModal} 
                    className="group flex flex-col items-center justify-center border-[0.15rem] border-dashed border-slate-200 bg-slate-50/50 rounded-2xl min-h-[12rem] h-full hover:bg-blue-50/50 hover:border-blue-700/40 transition-all cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <div className="w-[3.5rem] h-[3.5rem] rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-[0_0.25rem_0.5rem_rgba(0,0,0,0.02)] group-hover:text-blue-700 group-hover:scale-[1.12] transition-all duration-300 mb-[1rem]">
                      <Plus className="w-[1.5rem] h-[1.5rem]" />
                    </div>
                    <span className="text-lg font-bold text-slate-800 mb-[0.25rem] group-hover:text-blue-700 transition-colors">Novo board</span>
                    <span className="text-sm text-slate-500 px-[2vw] text-center line-clamp-2">Comece aqui a planejar sua próxima missão.</span>
                  </button>
                )}
              </div>

            ) : (

              /* Arquivados Grid */
              <div className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-[2vw]">
                {/* Board Arquivado 1 */}
                <div className="group bg-slate-50 rounded-2xl p-[1.5rem] border border-slate-200 flex flex-col min-h-[12rem] h-full opacity-80 cursor-not-allowed">
                  <div className="flex justify-between items-start mb-[1rem]">
                    <div className="w-[3rem] h-[3rem] rounded-xl bg-slate-200 flex items-center justify-center text-slate-500">
                      <Archive className="w-[1.5rem] h-[1.5rem]" />
                    </div>
                    <span className="bg-slate-200 text-slate-600 text-xs font-bold px-[0.75rem] py-[0.25rem] rounded-full uppercase tracking-widest">
                      ENCERRADO
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-600 mb-[0.25rem]">Reforma Backend 2024</h3>
                  <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed flex-grow">Migração inicial para serviços desacoplados</p>
                  
                  <div className="mt-auto flex items-center justify-between pt-[1.5rem] border-t border-slate-200/60 text-slate-400 text-xs font-medium">
                    <div className="flex items-center -space-x-[0.5rem] grayscale">
                        <div className="w-[2rem] h-[2rem] rounded-full border-2 border-white bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-xs uppercase">CR</div>
                    </div>
                    <div className="flex items-center gap-[1rem]">
                      <span className="flex items-center gap-[0.25rem]"><span className="text-sm">👥</span> 8</span>
                      <span className="flex items-center gap-[0.25rem]"><span className="text-sm">📋</span> 112</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center border-[0.15rem] border-dashed border-slate-200 bg-transparent rounded-2xl min-h-[12rem] h-full text-slate-400 p-[2rem] text-center">
                   <FolderArchive className="w-[3rem] h-[3rem] mb-[1rem] opacity-50" />
                   <p className="text-sm">Não há outros boards arquivados neste workspace.</p>
                </div>
              </div>
            )}

          </div>
          
        ) : (
          <ConstructionView onBack={() => setCurrentView("dashboard")} />
        )}
      </main>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-slate-800/20 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

    </div>
  );
}

// --- APP ENTRYPOINT --- //
export default function AppRoot() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("ADMIN");
  const [userName, setUserName] = useState("Admin");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedAuth = localStorage.getItem("tictac_auth");
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        setUserRole(parsed.role);
        setUserName(parsed.name);
        setIsAuthenticated(true);
      } catch (e) {}
    }
  }, []);

  const handleAuthSuccess = (role: string, name: string) => {
    setUserRole(role);
    setUserName(name);
    setIsAuthenticated(true);
    localStorage.setItem("tictac_auth", JSON.stringify({ role, name }));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("tictac_auth");
  };

  if (!isClient) return null; // Avoid hydration mismatch on initial load with localStorage

  return (
    <>
      {!isAuthenticated ? (
        <TicTacLogin onLogin={handleAuthSuccess} />
      ) : (
        <TicTacDashboard userRole={userRole} userName={userName} onLogout={handleLogout} />
      )}
    </>
  );
}
