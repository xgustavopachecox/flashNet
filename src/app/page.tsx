"use client";

import React, { useState } from "react";
import { AlertCircle, Loader2, AlertTriangle, Construction } from "lucide-react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });



export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState<"none" | "invalid_password" | "403">("none");
  const [showConstruction, setShowConstruction] = useState(false);

  const validUsers = ["alice", "bob", "carol"];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorState("none");

    setTimeout(() => {
      setIsLoading(false);
      
      const isDave = username.toLowerCase() === "dave" && password === "Teste@123";
      const isAdmin = username.toLowerCase() === "admin" && password === "Admin@123";
      const isMember = validUsers.includes(username.toLowerCase()) && password === "Teste@123";

      if (isDave) {
        setErrorState("403");
      } else if (isAdmin || isMember) {
        setShowConstruction(true);
      } else {
        setErrorState("invalid_password");
      }
    }, 2000); // Timer de 2 Segundos exigido
  };

  if (showConstruction) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${inter.className}`} style={{ background: 'radial-gradient(circle at center, #FFFFFF 0%, #F8FAFC 100%)' }}>
        <div className="bg-white rounded-[16px] shadow-[0_10px_25px_0_rgba(0,0,0,0.05)] p-12 flex flex-col items-center text-center max-w-[440px] w-full animate-in zoom-in-95 duration-300">
          <div className="bg-[#FEF2F2] text-[#B91C1C] p-5 rounded-full mb-6 relative">
            <Construction className="w-10 h-10" />
            <div className="absolute top-1 right-1 w-3 h-3 bg-[#0047BB] rounded-full animate-ping" />
          </div>
          <h1 className="text-[24px] font-bold text-[#1E293B] mb-3">TELA EM CONSTRUÇÃO</h1>
          <p className="text-[#64748B] text-[14px] mb-8 leading-relaxed">
            Área protegida do Tic Tac. A navegação falhou pois a tela de destino não existe neste protótipo.
          </p>
          <button 
            onClick={() => {
              setShowConstruction(false);
              setUsername("");
              setPassword("");
            }}
            className="w-full h-[44px] bg-[#0047BB] text-white text-[14px] font-medium hover:bg-[#003B99] transition-colors rounded-[8px]"
          >
            Voltar ao Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen flex flex-col items-center justify-center p-4 relative ${inter.className}`}
      style={{ background: 'radial-gradient(circle at center, #FFFFFF 0%, #F8FAFC 100%)' }}
    >
      {/* Main Login Column */}
      <div className="flex flex-col items-center w-full max-w-[440px]">
        
        {/* Header_TicTac */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="bg-[#0047BB] w-[48px] h-[48px] rounded-full flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <h1 className="text-[24px] font-bold text-[#1E293B] mb-2 tracking-tight">Tic Tac</h1>
          <p className="text-[14px] text-[#64748B]">
            Kanban editorial para equipes de alta performance.
          </p>
        </div>
        
        {/* Login_Form */}
        <main className="bg-white rounded-[16px] shadow-[0_10px_25px_0_rgba(0,0,0,0.05)] p-[40px] w-full">
          <form onSubmit={handleLogin} className="flex flex-col gap-[24px]">
            
            {/* Error_Messages: Alerta de 'Acesso Negado (403)' para Dave */}
            {errorState === "403" && (
              <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-[8px] p-[16px] flex items-start gap-[12px] animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 text-[#B91C1C] shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1 text-left">
                  <h3 className="text-[#B91C1C] text-[13px] font-bold">Acesso Negado (403)</h3>
                  <p className="text-[#B91C1C] text-[12px] opacity-90 leading-relaxed">
                    Sua conta foi desativada. Por favor, entre em contato com o administrador da sua organização para suporte.
                  </p>
                </div>
              </div>
            )}

            {/* Input_Username */}
            <div className="flex flex-col gap-[8px] text-left">
              <label htmlFor="username" className="text-[11px] font-bold uppercase text-[#64748B] tracking-wider">
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
                className="w-full h-[44px] px-4 rounded-[8px] bg-[#F8FAFC] border border-transparent text-[14px] text-[#1E293B] outline-none focus:border-[#0047BB] focus:bg-white transition-colors disabled:opacity-60"
              />
            </div>

            {/* Input_Password */}
            <div className="flex flex-col gap-[8px] text-left">
              <label htmlFor="password" className="text-[11px] font-bold uppercase text-[#64748B] tracking-wider">
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
                  className={`w-full h-[44px] px-4 rounded-[8px] bg-[#F8FAFC] border text-[14px] text-[#1E293B] outline-none transition-colors disabled:opacity-60 pr-10 ${
                    errorState === "invalid_password" 
                      ? "border-[#B91C1C] focus:border-[#B91C1C]" 
                      : "border-transparent focus:border-[#0047BB] focus:bg-white"
                  }`}
                />
                {errorState === "invalid_password" && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <AlertTriangle className="h-4 w-4 text-[#B91C1C]" />
                  </div>
                )}
              </div>
              {/* Error_Messages: Senha Incorreta */}
              {errorState === "invalid_password" && (
                <p className="text-[12px] text-[#B91C1C] animate-in fade-in slide-in-from-top-1 duration-200">
                  Senha incorreta. Por favor, tente novamente.
                </p>
              )}
            </div>

            {/* Login_Button */}
            <button 
              type="submit"
              disabled={isLoading || !username || !password}
              className="w-full h-[44px] bg-[#0047BB] hover:bg-[#003B99] disabled:bg-[#0047BB]/70 transition-colors rounded-[8px] flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                  <span className="text-white text-[14px] font-medium">Entrando...</span>
                </>
              ) : (
                <span className="text-white text-[14px] font-medium">Entrar</span>
              )}
            </button>

          </form>
        </main>
      </div>


      
    </div>
  );
}
