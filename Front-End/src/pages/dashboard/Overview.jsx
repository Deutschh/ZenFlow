import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  AlertTriangle, 
  Package, 
  Store, 
  ArrowRight,
  LogOut,       // Ícone Sair
  CreditCard    // Ícone Plano
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

// Dados simulados para o gráfico
const data = [
  { name: "Seg", value: 400 },
  { name: "Ter", value: 300 },
  { name: "Qua", value: 550 },
  { name: "Qui", value: 450 },
  { name: "Sex", value: 680 },
  { name: "Sáb", value: 800 },
  { name: "Dom", value: 600 },
];

export default function Overview() {
  const navigate = useNavigate();

  // --- FUNÇÃO DE LOGOUT ---
  const handleLogout = () => {
    // 1. Limpa qualquer vestígio de autenticação
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    
    // 2. Manda o usuário para a tela de login
    navigate("/login");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* --- CABEÇALHO --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Visão Geral
          </h1>
          <p className="text-muted-foreground">
            Bem-vindo de volta. Aqui está o resumo da sua operação hoje.
          </p>
        </div>
        
        {/* GRUPO DE BOTÕES DE AÇÃO (Incluindo os Provisórios) */}
        <div className="flex gap-3 flex-wrap">
          
          {/* Botão Provisório: Trocar Plano */}
          <button 
            onClick={() => navigate("/planos")}
            className="px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-sm font-bold hover:bg-indigo-100 transition flex items-center gap-2"
            title="Botão provisório para testes"
          >
            <CreditCard size={16} />
            Mudar Plano
          </button>

          {/* Botão Provisório: Logout */}
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-bold hover:bg-red-100 transition flex items-center gap-2"
            title="Sair da conta"
          >
            <LogOut size={16} />
            Sair
          </button>
          
          {/* Botão Original (Decorativo por enquanto) */}
          <button className="hidden md:block px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition shadow-lg shadow-indigo-500/20">
            + Nova Compra
          </button>
        </div>
      </div>

      {/* --- KPI CARDS (Indicadores) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Vendas */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Vendas Hoje</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">R$ 1.240,50</h3>
            </div>
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <TrendingUp size={20} />
            </div>
          </div>
          <span className="text-xs font-medium text-green-600 flex items-center">
            +12% <span className="text-muted-foreground ml-1">vs. ontem</span>
          </span>
        </div>

        {/* Card 2: Estoque Crítico */}
        <div className="bg-card p-6 rounded-2xl border border-destructive/20 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1 bg-destructive/50"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Risco de Ruptura</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">3 Itens</h3>
            </div>
            <div className="p-2 bg-red-100 text-destructive rounded-lg">
              <AlertTriangle size={20} />
            </div>
          </div>
          <span className="text-xs font-medium text-destructive cursor-pointer hover:underline">
            Ver itens críticos &rarr;
          </span>
        </div>

        {/* Card 3: Produtos */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Produtos Ativos</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">48</h3>
            </div>
            <div className="p-2 bg-indigo-100 text-primary rounded-lg">
              <Package size={20} />
            </div>
          </div>
          <span className="text-xs text-muted-foreground">
            5 novos este mês
          </span>
        </div>

        {/* Card 4: Lojas */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Lojas Conectadas</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">1</h3>
            </div>
            <div className="p-2 bg-teal-100 text-teal-600 rounded-lg">
              <Store size={20} />
            </div>
          </div>
          <span className="text-xs font-medium text-primary cursor-pointer hover:underline">
            Gerenciar rede &rarr;
          </span>
        </div>
      </div>

      {/* --- SEÇÃO PRINCIPAL --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Gráfico */}
        <div className="lg:col-span-2 bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Movimentação de Estoque</h3>
            <select className="text-sm border-none bg-secondary text-foreground rounded-md px-2 py-1 outline-none cursor-pointer">
              <option>Últimos 7 dias</option>
              <option>Últimos 30 dias</option>
            </select>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}} 
                />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#4338ca" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ZenBot Teaser */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-2xl shadow-xl text-white flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            
            <h3 className="text-xl font-bold font-display mb-2">ZenBot</h3>
            <p className="text-indigo-200 text-sm mb-6 flex-1">
              "Olá, Ana! Notei que o estoque de <strong>Leite Integral</strong> está baixando mais rápido que o normal. Deseja adicionar à lista de compras?"
            </p>

            <button className="w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl text-sm font-semibold transition flex items-center justify-center group">
              Falar com ZenBot
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}