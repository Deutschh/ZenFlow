import { useState } from "react";
import { Check, ArrowLeft  } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // 1. Importar Framer Motion
import SpotlightCard from "../components/SpotlightCard"; // 2. Importar nosso novo componente

export default function Plans() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const navigate = useNavigate();

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
      highlight: false,
      buttonText: "Começar Grátis",
      action: () => navigate("/dashboard"),
    },
    {
      name: "Pro",
      description: "Automação e IA para maximizar seu lucro.",
      price: { monthly: 129, yearly: 116 },
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
      action: () => alert("Checkout Pro"),
    },
    {
      name: "Enterprise",
      description: "Governança e API para redes em expansão.",
      price: { monthly: 399, yearly: 359 },
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
      action: () => alert("Checkout Enterprise"),
    },
  ];

  // Configuração da animação de entrada (Stagger)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Um card aparece 0.1s depois do outro
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 }, // Começa invisível e um pouco para baixo
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }, // Sobe suavemente
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans py-14 px-4 relative">
      <Link to="/Home">
      <button className=" left-10 top-6 absolute bg-background cursor-pointer w-20 h-12 items-center flex justify-between font-semibold text-lg font-sans text-gray-400 hover:text-indigo-600 transition-all duration-500"> <ArrowLeft /> {' Voltar'}</button>
      </Link>
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Animação simples no título */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-display text-foreground text-center mb-6 leading-tight">
            Escolha o plano ideal para <br className="hidden md:block" /> proseguir
          </h1>
          <p className="text-muted-foreground text-lg text-center max-w-2xl mb-10 mx-auto">
            Comece gratuitamente e faça o upgrade conforme sua rede cresce <br/>
            Desconto de 10% nos planos anuais.
          </p>
        </motion.div>

        {/* SWITCH MENSAL / ANUAL */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center space-x-4 mb-16"
        >
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
        </motion.div>

        {/* --- GRID DE CARDS COM ANIMAÇÃO --- */}
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

            // Definir a cor do holofote baseado no tema do card
            let spotlightColor = "rgba(200, 200, 200, 0.45)"; // Padrão (Starter)
            if (isPro) spotlightColor = "rgba(99, 102, 241, 0.3)"; // Indigo suave
            if (isEnterprise) spotlightColor = "rgb(0, 187, 167, 0.1)"; // Branco suave (para fundo escuro)

            return (
              <motion.div key={plan.name} variants={itemVariants} className="h-full">
                {/* Usamos o SpotlightCard aqui em vez de uma div normal */}
                <SpotlightCard
                  spotlightColor={spotlightColor}
                  className={`
                    h-full flex flex-col p-8 transition-all duration-500 group
                    ${/* Mantendo seus estilos originais */ ""}
                    ${isStarter ? "bg-card border-gray-200 hover:border-gray-300 hover:-translate-y-1 shadow-sm" : ""}
                    ${isPro ? "bg-gradient-to-b from-white to-indigo-50/60 border-indigo-500 shadow-[0_0_40px_rgba(79,70,229,0.15)] scale-100 md:scale-105 z-10 ring-1 ring-indigo-500/20" : ""}
                    ${isEnterprise ? "bg-white text-white shadow-2xl border-1 border-teal-500 hover:shadow-slate-500/20" : ""}
                  `}
                >
                  
                  {isPro && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-teal-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg z-20">
                      Recomendado
                    </div>
                  )}

                  <h3 className={`text-3xl font-display mb-2 ${isEnterprise ? "text-slate-900" : "text-slate-900"}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mb-8 h-10 leading-relaxed ${isEnterprise ? "text-slate-500" : "text-slate-500"}`}>
                    {plan.description}
                  </p>

                  <div className="mb-8">
                    <span className={`text-5xl font-bold tracking-tight ${isEnterprise ? "text-slate-900" : "text-slate-900"}`}>
                      R$ {plan.price[billingCycle]}
                    </span>
                    <span className={`text-lg ml-1 ${isEnterprise ? "text-slate-400" : "text-slate-400"}`}>/mês</span>
                    
                    {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                      <div className={`text-sm mt-2 font-semibold ${isEnterprise ? "text-teal-600" : "text-teal-600"}`}>
                        Total de {(plan.price.yearly * 12).toFixed(2).replace('.', ',')}R$ por ano
                      </div>
                    )}
                  </div>

                  <button
                    onClick={plan.action}
                    className={`
                      w-full py-4 rounded-xl font-bold transition-all duration-300 mb-10 shadow-sm relative z-20
                      ${isStarter ? "bg-white cursor-pointer border-2 border-gray-200 text-slate-700 hover:border-gray-400 hover:text-slate-900" : ""}
                      ${isPro ? "bg-indigo-600 cursor-pointer text-white hover:bg-indigo-900 shadow-indigo-500/25 hover:-translate-y-1" : ""}
                      ${isEnterprise ? " cursor-pointer bg-gradient-to-r from-indigo-600 to-teal-500 text-white hover:bg-gray-100 hover:-translate-y-1" : ""}
                    `}
                  >
                    {plan.buttonText}
                  </button>

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
                            ${isEnterprise ? "bg-gradient-to-r from-indigo-600 to-teal-500 text-white" : ""}
                          `}>
                            <Check size={12} strokeWidth={3} />
                          </div>
                          
                          <span className={`text-sm font-medium ${isEnterprise ? "text-slate-600" : "text-slate-600"}`}>
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