import { useState } from "react";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Plans() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const navigate = useNavigate();

  // --- DADOS DOS PLANOS ---
  const plans = [
    {
      name: "Starter",
      description: "Ideal para organizar uma única loja.",
      price: { monthly: 0, yearly: 0 },
      features: [
        "1 Loja incluída",
        "Cadastro de produtos ilimitado",
        "Fichas Técnicas completas",
        "Controle de estoque manual",
        "Gestão de perdas e quebras",
      ],
      highlight: false, // Starter
      buttonText: "Começar Grátis",
      action: () => navigate("/dashboard"),
    },
    {
      name: "Pro",
      description: "Automação e IA para maximizar seu lucro.",
      // Preço com ~10% de desconto no anual
      price: { monthly: 129, yearly: 116 }, 
      features: [
        "Até 2 Lojas incluídas",
        "+ Taxa por loja extra",
        "Integração automática com PDV",
        "IA de Previsão e ZenBot",
        "Sugestão de Preços e Promoções",
        "Alertas via WhatsApp",
      ],
      highlight: true, // Pro (Destaque Principal)
      buttonText: "Assinar Pro",
      action: () => alert("Redirecionando para o Checkout Pro..."),
    },
    {
      name: "Enterprise",
      description: "Governança e API para redes em expansão.",
      // Preço com ~10% de desconto no anual
      price: { monthly: 399, yearly: 359 }, 
      features: [
        "Até 5 Lojas incluídas",
        "+ R$ 100/mês por loja extra",
        "API Aberta para integrações",
        "Gestão avançada de usuários",
        "Logs de auditoria detalhados",
        "Relatórios de BI avançados",
      ],
      highlight: false, // Enterprise (Premium Dark)
      buttonText: "Assinar Enterprise",
      action: () => alert("Redirecionando para o Checkout Enterprise..."),
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans py-20 px-4">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* --- CABEÇALHO DA PÁGINA --- */}
        <h2 className="text-primary font-semibold tracking-wide uppercase mb-3 text-sm md:text-base">
          Preços Simples e Transparentes
        </h2>
        <h1 className="text-4xl md:text-5xl font-display text-foreground text-center mb-6 leading-tight">
          Escolha o plano ideal para <br className="hidden md:block" /> sua operação
        </h1>
        <p className="text-muted-foreground text-lg text-center max-w-2xl mb-10">
          Comece gratuitamente e faça o upgrade conforme sua rede cresce.
          Desconto de 10% nos planos anuais.
        </p>

        {/* --- SWITCH MENSAL / ANUAL --- */}
        <div className="flex items-center justify-center space-x-4 mb-16">
          <span className={`text-base font-semibold font-sans ${billingCycle === 'monthly' ? 'text-indigo-600' : 'text-gray-400'}`}>
            Mensal
          </span>
          
          <button
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
            className="relative w-14 h-7 bg-white rounded-full pl-1 border border-gray-200 shadow-sm transition-colors hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
          >
            <div
              className={`w-5 h-5 bg-indigo-600 rounded-full shadow-md transform transition-transform duration-300 mt-0.5 ${
                billingCycle === "yearly" ? "translate-x-7" : "translate-x-0"
              }`}
            />
          </button>

          <span className={`text-base font-semibold font-sans ${billingCycle === 'yearly' ? 'text-indigo-600' : 'text-gray-400'}`}>
            Anual <span className="text-teal-500 text-xs font-bold ml-1 tracking-wide">(-10% OFF)</span>
          </span>
        </div>

        {/* --- GRID DE CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {plans.map((plan) => {
            
            // Flags para identificar o tipo de card e aplicar estilos diferentes
            const isPro = plan.name === "Pro";
            const isEnterprise = plan.name === "Enterprise";
            const isStarter = plan.name === "Starter";

            return (
              <div
                key={plan.name}
                className={`
                  relative flex flex-col p-8 rounded-[2rem] border transition-all duration-500 group
                  
                  ${/* ESTILO STARTER: Clean e minimalista */ ""}
                  ${isStarter ? "bg-card border-gray-200 hover:border-gray-300 hover:-translate-y-1 shadow-sm" : ""}

                  ${/* ESTILO PRO: Vibrante, borda colorida, sombra brilhante */ ""}
                  ${isPro ? "bg-gradient-to-b from-white to-indigo-50/60 border-indigo-500 shadow-[0_0_40px_rgba(79,70,229,0.15)] scale-100 md:scale-105 z-10 ring-1 ring-indigo-500/20" : ""}

                  ${/* ESTILO ENTERPRISE: Fundo escuro (Premium) */ ""}
                  ${isEnterprise ? "bg-slate-900 border-slate-700 text-white shadow-2xl hover:shadow-slate-500/20" : ""}
                `}
              >
                
                {/* Badge "Mais Popular" apenas no Pro */}
                {isPro && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-teal-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                    Recomendado
                  </div>
                )}

                {/* Título e Descrição */}
                <h3 className={`text-3xl font-display mb-2 ${isEnterprise ? "text-white" : "text-slate-900"}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-8 h-10 leading-relaxed ${isEnterprise ? "text-slate-400" : "text-slate-500"}`}>
                  {plan.description}
                </p>

                {/* Preço */}
                <div className="mb-8">
                  <span className={`text-5xl font-bold tracking-tight ${isEnterprise ? "text-white" : "text-slate-900"}`}>
                    R$ {plan.price[billingCycle]}
                  </span>
                  <span className={`text-lg ml-1 ${isEnterprise ? "text-slate-500" : "text-slate-400"}`}>/mês</span>
                  
                  {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                    <div className={`text-xs mt-2 font-medium ${isEnterprise ? "text-teal-400" : "text-teal-600"}`}>
                      Faturado R$ {(plan.price.yearly * 12).toFixed(2).replace('.', ',')} por ano
                    </div>
                  )}
                </div>

                {/* Botão de Ação */}
                <button
                  onClick={plan.action}
                  className={`
                    w-full py-4 rounded-xl font-bold transition-all duration-300 mb-10 shadow-sm
                    
                    ${/* Botão Starter */ ""}
                    ${isStarter ? "bg-white border-2 border-gray-200 text-slate-700 hover:border-gray-400 hover:text-slate-900" : ""}
                    
                    ${/* Botão Pro */ ""}
                    ${isPro ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/25 hover:-translate-y-0.5" : ""}

                    ${/* Botão Enterprise */ ""}
                    ${isEnterprise ? "bg-white text-slate-900 hover:bg-gray-100" : ""}
                  `}
                >
                  {plan.buttonText}
                </button>

                {/* Lista de Benefícios */}
                <div className="flex-1">
                  <p className={`text-xs font-bold uppercase tracking-wider mb-4 ${isEnterprise ? "text-slate-500" : "text-slate-400"}`}>
                    O que está incluso:
                  </p>
                  <ul className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <div className={`
                          flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5
                          ${isStarter ? "bg-gray-100 text-gray-500" : ""}
                          ${isPro ? "bg-indigo-100 text-indigo-600" : ""}
                          ${isEnterprise ? "bg-slate-800 text-teal-400" : ""}
                        `}>
                          <Check size={12} strokeWidth={3} />
                        </div>
                        
                        <span className={`text-sm font-medium ${isEnterprise ? "text-slate-300" : "text-slate-600"}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}