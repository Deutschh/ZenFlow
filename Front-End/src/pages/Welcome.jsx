import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import confetti from "canvas-confetti"; // Opcional: efeito de confete!

export default function Welcome() {
  const { planName } = useParams();
  const formattedName = planName ? planName.charAt(0).toUpperCase() + planName.slice(1) : "Plano";

  useEffect(() => {
    // Dispara confetes ao carregar
    confetti({
      particleCount: 100,
      spread: 30,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-card p-10 rounded-3xl border border-border shadow-2xl max-w-lg w-full flex flex-col items-center animate-in fade-in zoom-in duration-500">
        
        <div className="w-20 h-20 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={48} strokeWidth={3} />
        </div>

        <h1 className="text-4xl font-display text-foreground mb-4">
          Sucesso!
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8">
          Você agora faz parte do plano <span className="font-bold text-indigo-600">{formattedName}</span>.
        </p>

        <p className="text-sm text-slate-500 mb-8">
          Sua conta foi configurada e você já pode começar a gerenciar sua rede.
        </p>

        <Link 
          to="/dashboard" 
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
        >
          Ir para o Dashboard
        </Link>
      </div>
    </div>
  );
}