import { useState } from "react";
import { Check, ArrowLeft, Info } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SpotlightCard from "../components/SpotlightCard";

export default function Plans() {
  // Agora o estado guarda uma string com a opção selecionada
  const [commitment, setCommitment] = useState("monthly"); // 'monthly', 'quarterly', 'semiannual', 'yearly'
  const navigate = useNavigate();

  // Configuração dos Ciclos e Descontos
  const cycles = {
    monthly: { label: "Mensal", discount: 0, months: 1 },
    quarterly: { label: "Trimestral", discount: 0.04, months: 3 },
    semiannual: { label: "Semestral", discount: 0.06, months: 6 },
    yearly: { label: "Anual", discount: 0.10, months: 12 },
  };

  // Função auxiliar para calcular o preço com base no ciclo atual
  const calculatePrice = (basePrice) => {
    const discount = cycles[commitment].discount;
    const finalPrice = basePrice * (1 - discount);
    // Arredonda para 2 casas decimais, mas retorna número para formatação
    return Number(finalPrice.toFixed(2)); 
  };

const handleSelectPlan = async (planKey) => {
    // 1. Se for plano PAGO (Pro ou Enterprise), vai para o Checkout
    if (planKey === 'pro' || planKey === 'enterprise') {
      // Importante: Passamos o plano E o ciclo escolhido na URL
      // Ex: /checkout/pro?cycle=semiannual
      navigate(`/checkout/${planKey}?cycle=${commitment}`);
      return;
    }

    // 2. Se for plano GRÁTIS (Starter), segue o fluxo direto de API
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

    if (!token) {
      alert("Você precisa estar logado.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/subscription/select", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        // Enviamos o plano e o ciclo (mesmo que starter seja sempre mensal)
        body: JSON.stringify({ 
          plan: planKey.toLowerCase(),
          cycle: commitment 
        })
      });

      if (response.ok) {
        navigate(`/welcome/${planKey}`);
      } else {
        const errorData = await response.json();
        alert("Erro ao selecionar plano: " + errorData.error);
      }
    } catch (error) {
      console.error("Erro de rede:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  const plans = [
    {
      name: "Starter",
      description: "Ideal para organizar uma única loja.",
      basePrice: 0, // Preço base mensal
      features: [
        "1 Loja incluída",
        "Cadastro de produtos ilimitado",
        "Fichas Técnicas completas",
        "Controle de estoque manual",
        "Gestão de perdas e quebras",
      ],
      highlight: false,
      buttonText: "Começar Grátis",
      action: () => handleSelectPlan("starter"),
    },
    {
      name: "Pro",
      description: "Automação e IA para maximizar seu lucro.",
      basePrice: 129, // Preço base mensal
      features: [
        "Até 2 Lojas incluídas",
        "+ Taxa por loja extra",
        "Integração automática com PDV",
        "IA de Previsão e ZenBot",
        "Sugestão de Preços e Promoções",
        "Alertas via WhatsApp",
      ],
      highlight: true,
      buttonText: "Assinar Pro",
      action: () => handleSelectPlan("pro"),
    },
    {
      name: "Enterprise",
      description: "Governança e API para redes em expansão.",
      basePrice: 399, // Preço base mensal
      features: [
        "Até 5 Lojas incluídas",
        "+ R$ 100/mês por loja extra",
        "API Aberta para integrações",
        "Gestão avançada de usuários",
        "Logs de auditoria detalhados",
        "Relatórios de BI avançados",
      ],
      highlight: false,
      buttonText: "Assinar Enterprise",
      action: () => handleSelectPlan("enterprise"),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans py-14 px-4 relative">
      <Link to="/Home">
        <button className="left-10 top-6 absolute bg-background cursor-pointer w-20 h-12 items-center flex justify-between font-semibold text-lg font-sans text-gray-400 hover:text-indigo-600 transition-all duration-500 hidden md:flex">
           <ArrowLeft /> {' Voltar'}
        </button>
      </Link>

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* TÍTULO */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-display text-foreground text-center mb-6 leading-tight">
            Planos flexíveis para <br className="hidden md:block" /> o seu momento
          </h1>
          <p className="text-muted-foreground text-lg text-center max-w-2xl mb-10 mx-auto">
            Economize assinando contratos de fidelidade. <br/>
            Quanto maior o compromisso, maior o desconto mensal.
          </p>
        </motion.div>

        {/* --- SELETOR DE CICLO (4 OPÇÕES) --- */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-16 bg-slate-100 p-2 rounded-2xl border border-slate-200"
        >
          {Object.entries(cycles).map(([key, data]) => (
            <button
              key={key}
              onClick={() => setCommitment(key)}
              className={`
                relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300
                ${commitment === key 
                  ? "bg-white text-indigo-600 shadow-md ring-1 ring-black/5" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                }
              `}
            >
              {data.label}
              {data.discount > 0 && (
                <span className={`
                  ml-2 text-xs py-0.5 px-1.5 rounded-full
                  ${commitment === key ? "bg-indigo-100 text-indigo-700" : "bg-teal-100 text-teal-700"}
                `}>
                  -{data.discount * 100}%
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* --- GRID DE CARDS --- */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl"
        >
          {plans.map((plan) => {
            const isPro = plan.name === "Pro";
            const isEnterprise = plan.name === "Enterprise";
            const isStarter = plan.name === "Starter";

            // Calcula o preço baseado no ciclo selecionado
            const currentMonthlyPrice = calculatePrice(plan.basePrice);
            
            // Cores do efeito
            let spotlightColor = "rgba(200, 200, 200, 0.45)";
            if (isPro) spotlightColor = "rgba(99, 102, 241, 0.3)";
            if (isEnterprise) spotlightColor = "rgb(0, 187, 167, 0.3)";

            return (
              <motion.div key={plan.name} variants={itemVariants} className="h-full">
                <SpotlightCard
                  spotlightColor={spotlightColor}
                  className={`
                    h-full flex flex-col p-8 transition-all duration-500 group relative
                    ${isStarter ? "bg-card border-gray-200 hover:border-gray-300 hover:-translate-y-1 shadow-sm" : ""}
                    ${isPro ? "bg-gradient-to-b from-white to-indigo-50/60 border-indigo-500 shadow-[0_0_40px_rgba(79,70,229,0.15)] scale-100 md:scale-105 z-10 ring-1 ring-indigo-500/20" : ""}
                    ${isEnterprise ? "bg-white text-slate-900 shadow-2xl border border-teal-500/30 hover:shadow-teal-500/10" : ""}
                  `}
                >
                  
                  {isPro && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-teal-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg z-20">
                      Recomendado
                    </div>
                  )}

                  <h3 className={`text-3xl font-display mb-2 text-slate-900`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mb-8 h-10 leading-relaxed text-slate-500`}>
                    {plan.description}
                  </p>

                  <div className="mb-8">
                    {/* Preço */}
                    <div className="flex items-baseline">
                      <span className="text-5xl font-bold tracking-tight text-slate-900">
                        R$ {currentMonthlyPrice.toFixed(0).replace('.', ',')}
                        {/* Se tiver centavos, podemos mostrar menor, mas arredondei para visual clean */}
                      </span>
                      <span className="text-lg ml-1 text-slate-400">/mês</span>
                    </div>

                    {/* Explicação do Compromisso */}
                    {plan.basePrice > 0 && (
                      <div className="mt-3 text-sm flex flex-col gap-1">
                        {commitment === 'monthly' ? (
                          <span className="text-slate-400 flex items-center gap-1">
                            <Info size={14}/> Sem fidelidade. Cancele quando quiser.
                          </span>
                        ) : (
                          <>
                            <span className="text-indigo-600 font-medium">
                              Cobrança mensal no cartão.
                            </span>
                            <span className="text-slate-400 text-xs">
                              Compromisso de {cycles[commitment].months} meses. 
                              <br/>
                              Economia total: R$ {((plan.basePrice - currentMonthlyPrice) * cycles[commitment].months).toFixed(2).replace('.', ',')}
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={plan.action}
                    className={`
                      w-full py-4 rounded-xl font-bold transition-all duration-300 mb-10 shadow-sm relative z-20
                      ${isStarter ? "bg-white cursor-pointer border-2 border-gray-200 text-slate-700 hover:border-gray-400 hover:text-slate-900" : ""}
                      ${isPro ? "bg-indigo-600 cursor-pointer text-white hover:bg-indigo-900 shadow-indigo-500/25 hover:-translate-y-1" : ""}
                      ${isEnterprise ? "cursor-pointer bg-teal-500 text-white hover:bg-teal-600 hover:-translate-y-1" : ""}
                    `}
                  >
                    {plan.buttonText}
                  </button>

                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-wider mb-4 text-slate-400">
                      O que está incluso:
                    </p>
                    <ul className="space-y-4">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <div className={`
                            flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5
                            ${isStarter ? "bg-gray-100 text-gray-500" : ""}
                            ${isPro ? "bg-indigo-100 text-indigo-600" : ""}
                            ${isEnterprise ? "bg-teal-100 text-teal-600" : ""}
                          `}>
                            <Check size={12} strokeWidth={3} />
                          </div>
                          
                          <span className="text-sm font-medium text-slate-600">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </SpotlightCard>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </div>
  );
}