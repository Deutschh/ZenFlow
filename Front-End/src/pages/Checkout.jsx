import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import { Check, CreditCard, Lock, ArrowLeft, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function Checkout() {
  const { planName } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // --- ESTADOS DO FORMULÁRIO (Para as Máscaras) ---
  const [formData, setFormData] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: ""
  });

  // --- ESTADO DO CICLO (Inicia com a URL, mas pode mudar) ---
  const initialCycle = searchParams.get('cycle') || 'monthly';
  const [selectedCycle, setSelectedCycle] = useState(initialCycle);

  // 2. Definição dos Ciclos e Descontos
  const cycles = {
    monthly: { label: "Mensal", discount: 0, months: 1 },
    quarterly: { label: "Trimestral", discount: 0.04, months: 3 },
    semiannual: { label: "Semestral", discount: 0.06, months: 6 }, // 6% conforme seu código
    yearly: { label: "Anual", discount: 0.10, months: 12 },
  };

  // 3. Preços Base
  const planDetails = {
    pro: {
      name: "ZenFlow Pro",
      basePrice: 129,
      features: ["2 Lojas", "IA e Automação", "Suporte Prioritário"],
    },
    enterprise: {
      name: "ZenFlow Enterprise",
      basePrice: 399,
      features: ["5 Lojas", "API Aberta", "Auditoria e Governança"],
    },
  };

  const selectedPlan = planDetails[planName] || planDetails.pro;

  // 4. Cálculos Matemáticos (Reativos ao selectedCycle)
  const cycleData = cycles[selectedCycle];
  const discountedMonthlyPrice = selectedPlan.basePrice * (1 - cycleData.discount);
  const totalDueToday = discountedMonthlyPrice; 

  // --- FUNÇÕES DE MÁSCARA ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      // Apenas números, limita a 16 dígitos, adiciona espaço a cada 4
      const v = value.replace(/\D/g, "").slice(0, 16);
      const parts = [];
      for (let i = 0; i < v.length; i += 4) {
        parts.push(v.slice(i, i + 4));
      }
      formattedValue = parts.length > 1 ? parts.join(" ") : value;
    } 
    else if (name === "expiry") {
      // Apenas números, limita a 4 dígitos, adiciona barra depois do 2º
      const v = value.replace(/\D/g, "").slice(0, 4);
      if (v.length >= 3) {
        formattedValue = `${v.slice(0, 2)}/${v.slice(2)}`;
      } else {
        formattedValue = v;
      }
    } 
    else if (name === "cvv") {
      // Apenas números, limita a 4 dígitos
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

    try {
      const response = await fetch("http://localhost:3000/api/subscription/select", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          plan: planName, 
          cycle: selectedCycle // Envia o ciclo que está no estado atual
        })
      });

      if (response.ok) {
        navigate(`/welcome/${planName}`);
      } else {
        alert("Erro ao processar assinatura.");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex items-center justify-center p-4 relative">
      
      <Link to="/planos" className="absolute top-6 left-6 text-slate-500 hover:text-indigo-600 flex items-center gap-2 transition-colors">
        <ArrowLeft size={20} /> Voltar para Planos
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200"
      >
        
        {/* --- COLUNA ESQUERDA: FORMULÁRIO --- */}
        <div className="w-full md:w-3/5 p-8 md:p-12">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold font-display">Z</div>
            <span className="font-display text-xl text-slate-900">Checkout Seguro</span>
          </div>

          <h2 className="text-2xl font-bold mb-6 text-slate-800">Dados de Pagamento</h2>

          <form onSubmit={handlePayment} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome no Cartão</label>
              <input 
                required 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                type="text" 
                placeholder="Como aparece no cartão" 
                className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none transition-all uppercase" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Número do Cartão</label>
              <div className="relative">
                <input 
                  required 
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  type="text" 
                  placeholder="0000 0000 0000 0000" 
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none transition-all font-mono" 
                />
                <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Validade</label>
                <div className="relative">
                  <input 
                    required 
                    name="expiry"
                    value={formData.expiry}
                    onChange={handleInputChange}
                    type="text" 
                    placeholder="MM/AA" 
                    className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none transition-all font-mono" 
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                </div>
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-slate-700 mb-1">CVV</label>
                <div className="relative">
                  <input 
                    required 
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    type="text" 
                    placeholder="123" 
                    maxLength={4} 
                    className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none transition-all font-mono" 
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                </div>
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit" 
              className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {loading ? "Processando..." : <><Lock size={18} /> Pagar R$ {totalDueToday.toFixed(2).replace('.', ',')}</>}
            </button>
            
            <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
              <Lock size={12} /> Pagamento processado em ambiente seguro (256-bit SSL).
            </p>
          </form>
        </div>

        {/* --- COLUNA DIREITA: RESUMO --- */}
        <div className="w-full md:w-2/5 bg-gradient-to-b from-indigo-600 to-indigo-950 text-white p-8 md:p-12 flex flex-col relative overflow-hidden">
          
          {/* SELETOR DE CICLO (Novidade) */}
          <div className="relative z-10 mb-8 ">
            <h3 className="text-sm font-medium text-indigo-200 mb-3 uppercase tracking-wide">Duração do Plano</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(cycles).map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCycle(key)}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-semibold transition-all border 
                    ${selectedCycle === key 
                      ? "bg-white text-indigo-900 border-white shadow-lg scale-105 z-10 cursor-default" 
                      : "bg-indigo-900/90 text-indigo-200 border-transparent hover:bg-indigo-950 cursor-pointer"
                    }  
                  `}
                >
                  {data.label}
                  {data.discount > 0 && <span className="text-[10px] ml-1 opacity-80">-{data.discount * 100}%</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <h3 className="text-lg font-medium text-slate-300 mb-4">Resumo do Pedido</h3>
            
            <h1 className="text-3xl font-display mb-1">{selectedPlan.name}</h1>
            <p className="text-teal-400 font-medium mb-6">
              Plano {cycleData.label} {cycleData.discount > 0 && `(-${cycleData.discount * 100}%)`}
            </p>

            <div className="space-y-3 mb-8">
              {selectedPlan.features.map((item, index) => (
                <div key={index} className="flex items-center gap-3 text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-white/20 relative z-10">
            <div className="flex justify-between text-sm mb-2 text-slate-300">
              <span>Valor Base</span>
              <span>R$ {selectedPlan.basePrice.toFixed(2).replace('.', ',')}</span>
            </div>
            
            {cycleData.discount > 0 && (
              <div className="flex justify-between text-sm mb-2 text-teal-400">
                <span>Desconto Fidelidade</span>
                <span>- R$ {(selectedPlan.basePrice - discountedMonthlyPrice).toFixed(2).replace('.', ',')}</span>
              </div>
            )}

            <div className="flex justify-between text-xl font-bold text-white mt-4 pt-2 border-t border-white/10">
              <span>Total Mensal</span>
              <span>R$ {totalDueToday.toFixed(2).replace('.', ',')}</span>
            </div>
            
            {selectedCycle !== 'monthly' && (
              <p className="text-xs text-slate-400 mt-2 text-right">
                Contrato de {cycleData.months} meses. <br/>
                Total do contrato: R$ {(totalDueToday * cycleData.months).toFixed(2).replace('.', ',')}
              </p>
            )}
          </div>

          {/* Efeito de Fundo Decorativo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

        </div>

      </motion.div>
    </div>
  );
}