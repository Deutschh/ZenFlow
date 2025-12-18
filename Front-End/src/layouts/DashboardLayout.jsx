import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ChefHat, 
  DollarSign, 
  Bot, 
  Store, 
  Settings, 
  LogOut,
  ChevronDown,
  Menu,
  X
} from "lucide-react";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Função de Logout (reaproveitada)
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    navigate("/login");
  };

  // Itens do Menu (As suas Abas)
  const menuItems = [
    { name: "Visão Geral", path: "/dashboard", icon: LayoutDashboard },
    { name: "Estoque", path: "/dashboard/estoque", icon: Package },
    { name: "Produtos & Receitas", path: "/dashboard/produtos", icon: ChefHat },
    { name: "Financeiro", path: "/dashboard/financeiro", icon: DollarSign },
    { name: "ZenBot", path: "/dashboard/zenbot", icon: Bot },
    { name: "Minhas Lojas", path: "/dashboard/lojas", icon: Store },
    { name: "Configurações", path: "/dashboard/configuracoes", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* --- SIDEBAR (Barra Lateral) --- */}
      <aside 
        className={`
          bg-background text-white transition-all duration-300 flex flex-col
          ${isSidebarOpen ? "w-64" : "w-20"}
          hidden md:flex
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-slate-800">
          {isSidebarOpen ? (
            <h1 className="font-display text-2xl font-bold bg-gradient-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent">
              ZenFlow
            </h1>
          ) : (
            <span className="font-display text-2xl font-bold text-indigo-400">Z</span>
          )}
        </div>

        {/* Menu de Navegação */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center px-3 py-3 rounded-xl transition-all group
                  ${isActive 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }
                `}
              >
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                
                {/* Texto (Só aparece se sidebar aberta) */}
                {isSidebarOpen && (
                  <span className="ml-3 font-medium whitespace-nowrap overflow-hidden">
                    {item.name}
                  </span>
                )}
                
                {/* Tooltip para quando fechado */}
                {!isSidebarOpen && (
                  <div className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer da Sidebar (Usuário) */}
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className={`
              flex items-center w-full px-3 py-2 rounded-xl text-red-400 hover:bg-red-900/20 transition
              ${!isSidebarOpen && "justify-center"}
            `}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="ml-3 font-medium">Sair</span>}
          </button>
        </div>
      </aside>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Header (Topo) */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
          
          {/* Botão Menu Mobile / Toggle Sidebar */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 focus:outline-none"
          >
            <Menu size={24} />
          </button>

          {/* --- SELETOR DE LOJA GLOBAL (Sua ideia!) --- */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-full text-sm font-semibold text-slate-700 transition">
                <Store size={16} className="text-indigo-600" />
                <span>Loja Principal</span> {/* Aqui virá o nome dinâmico */}
                <ChevronDown size={14} className="text-slate-400" />
              </button>
              
              {/* Dropdown (Simulado por enquanto) */}
              <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50">
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase">Trocar Loja</div>
                  <button className="w-full text-left px-3 py-2 text-sm text-indigo-600 bg-indigo-50 rounded-lg font-medium mb-1">Loja Principal</button>
                  <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg">+ Criar Nova Loja</button>
                </div>
              </div>
            </div>

            {/* Avatar do Usuário */}
            <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:ring-2 ring-indigo-300 transition">
              A {/* Inicial da Ana */}
            </div>
          </div>
        </header>

        {/* Área de Scroll do Conteúdo */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50">
          {/* O Outlet é onde as páginas (Overview, Estoque...) serão renderizadas */}
          <Outlet />
        </main>

      </div>
    </div>
  );
}