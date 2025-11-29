// Em: src/pages/Login.jsx

import React from "react";
import { useEffect } from "react"; 
import { Link, useNavigate } from "react-router-dom"; // Importa o useNavigate
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input"; // Nosso input de senha
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Iridescence from "../components/Iridescence.jsx";
import { StepperCadastro } from "../components/StepperCadastro.jsx"; // Nome correto do seu wizard
import { Checkbox } from "@/components/ui/checkbox.jsx";

// Importa as ferramentas de formulário
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Definimos as "regras" (Schema) para o login
const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "O email é obrigatório." })
    .email({ message: "Por favor, insira um email válido." }),
  password: z
    .string()
    .trim()
    .min(1, { message: "A senha é obrigatória." }),
  remember: z.boolean().default(false), // Para o "Mantenha-me conectado"
});

export function Login() {
  const navigate = useNavigate();

  // --- 2. NOVA LÓGICA: VERIFICAR SE JÁ ESTÁ LOGADO ---
useEffect(() => {
    const verifyUserSession = async () => {
      // 1. Pega o token
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

      // Se não tem token, não faz nada (fica na tela de login)
      if (!token) return;

      try {
        console.log("Verificando validade do token...");
        
        // 2. Pergunta ao Backend se o token é válido
        const response = await fetch("http://localhost:3000/api/auth/verify", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Envia o token para o middleware checar
          },
        });

        // 3. Se a resposta for OK (200), o usuário existe e o token é bom
        if (response.ok) {
          console.log("Token válido! Redirecionando...");
          navigate("/planos");
        } else {
          // 4. Se der erro (401, 403, 404), o token é inválido ou usuário foi deletado
          throw new Error("Sessão inválida");
        }

      } catch (error) {
        console.warn("Sessão expirada ou inválida. Limpando dados.");
        // 5. FAXINA: Remove os tokens inválidos para não cair no loop
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
        // O usuário permanece na tela de Login para entrar novamente
      }
    };

    verifyUserSession();
  }, [navigate]);
  // ----------------------------------------------------

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  // A função que é chamada QUANDO o formulário é válido
  const onSubmitLogin = async (data) => {
    // 'data' contém { email, password, remember }
    console.log("Enviando dados de Login:", data);

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Erro ao fazer login. Verifique suas credenciais.");
        return;
      }

      // SUCESSO! Agora salvamos o token
      console.log("Login realizado!", result.token);

      // Lógica do "Mantenha-me Conectado"
      if (data.remember) {
        localStorage.setItem("authToken", result.token);
      } else {
        sessionStorage.setItem("authToken", result.token);
      }
      
      // (Futuramente, vamos checar se ele tem plano e redirecionar para /dashboard)
      // Por agora, vamos para a página de planos
      navigate("/planos");

    } catch (error) {
      console.error("Erro de rede:", error);
      alert(
        "Não foi possível conectar ao servidor. Verifique se o backend está rodando."
      );
    }
  };
  
  return (
    // Seu layout (sem alteração)
    <div className="w-full h-screen flex justify-between bg-slate-200 relative ">
      <Link to="/">
        <div className="text-4xl p-4 font-display text-foreground absolute">
          ZenFlow
        </div>
      </Link>
      
      <Tabs
        defaultValue="login"
        className="bg-slate-200/20 w-60/100 pr-16 pl-12 flex my-auto bg-paink-400 flex-col h-2/3"
      >
        <TabsList className="w-2/5 bg-raed-400 h-1/13">
          <TabsTrigger
            className={
              "font-sans text-lg text-gray-500 font-semibold shadow-black/30 drop-shadow-black hover:bg-slate-300/70 transition-all duration-700 cursor-pointer"
            }
            value="login"
          >
            Entrar
          </TabsTrigger>
          <TabsTrigger
            className={
              "font-sans text-lg text-gray-500 font-semibold shadow-black/30 drop-shadow-black hover:bg-slate-300/70 transition-all duration-700 ml-2 cursor-pointer"
            }
            value="cadastro"
          >
            Cadastrar
          </TabsTrigger>
        </TabsList>

        {/* --- ABA DE LOGIN --- */}
        <TabsContent value="login">
          {/* ADICIONADO: tag <form> com handleSubmit */}
          <form onSubmit={handleSubmit(onSubmitLogin, (errors) => console.log("ERROS DE VALIDAÇÃO:", errors))}>
            <Card className="bg-slate-200/20 h-11/12 text-foreground font-sans border-none shadow-none pl-3">
              <CardHeader>
                <CardTitle className={"text-2xl text-foreground"}>
                  Bem-vindo de volta!
                </CardTitle>
                <CardDescription className="text-gray-400 text-lg">
                  Faça Login para acessar o Dashboard e muito mais.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="email-login"
                    className="text-lg text-gray-500 font-sans"
                  >
                    Email
                  </Label>
                  <Input
                    id="email-login"
                    type="email"
                    className={"w-1/2 h-12 shadow-xl border-1 border-zinc-400/50"}
                    placeholder="padariadaAna@gmail.com"
                    {...register("email")} // ADICIONADO: registro do form
                  />
                  {/* ADICIONADO: Mensagem de erro */}
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2 w-1/2">
                  <Label
                    htmlFor="password-login"
                    className="text-lg text-gray-500 font-sans"
                  >
                    Senha
                  </Label>
                  {/* MUDANÇA: Input -> PasswordInput */}
                  <PasswordInput
                    id="password-login"
                    className={"w-full h-12 shadow-xl border-1 border-zinc-400/50 text-foreground text-lg"}
                    {...register("password")} // ADICIONADO: registro do form
                  />
                  {/* ADICIONADO: Mensagem de erro */}
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>
              </CardContent>
              <div className="text-gray-500 font-semibold w-1/2 bg-reda-600 pl-16 text-lg mt-2 flex">
                <Checkbox 
                  id="remember"
                  className={"border-gray-500 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 mr-2 w-5 h-5 mt-1"}
                  {...register("remember")} // ADICIONADO: registro do form
                />
                <Label htmlFor="remember">Mantenha-me conectado</Label>
              </div>
              <CardFooter className="flex flex-col gap-3 w-1/2 mt-2 ">
                <Button
                  type="submit" // ADICIONADO: tipo submit
                  className="w-2/5 rounded-2xl h-12 text-lg bg-indigo-600 border-2 border-indigo-600 text-white items-center justify-center flex font-sans font-semibold hover:bg-inherit
                  hover:text-indigo-700 hover:border-indtext-indigo-700 cursor-pointer transition-all duration-700"
                >
                  Entrar
                </Button>
                {/* RESTAURADO: Seus botões "Esqueci a senha" e "Google" */}
                <Button
                  variant="link"
                  size="sm"
                  className="text-gray-400 decoration-none cursor-pointer"
                >
                  Esqueceu sua senha?
                </Button>
                <div className="flex bg-read-400 w-2/3 h-8 justify-between mt-2">
                  <div className="w-41/100 bg-zinc-400/50 h-0.5 my-auto"></div>
                  <div className="text-xl w-1/12 my-auto font-sans mb-2 text-gray-600 font-semibold">
                    ou
                  </div>
                  <div className="w-41/100 bg-zinc-400/50 h-0.5 my-auto"></div>
                </div>
                <div className="w-2/3 mt-1 h-12 border border-zinc-400 flex items-center justify-center hover:bg-zinc-500/25 transition-all duration-500 cursor-pointer">
                  Fazer login com Google
                </div>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>

        {/* --- ABA DE CADASTRO --- */}
        <TabsContent value="cadastro">
          <Card className="bg-slate-200 border-none shadow-none text-white">
            <CardHeader>
              <CardTitle className={"text-2xl text-foreground"}>Crie sua conta</CardTitle>
              <CardDescription className="text-gray-400 text-lg">
                Siga os passos para começar a usar o ZenFlow.
              </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[350px]">
              <StepperCadastro /> {/* Seu wizard */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Fundo Animado (sem alteração) */}
      <div className="w-40/100 inset-0 z-0 shadow-[0px_0px_30px_rgba(0,0,0,1)]">
        <Iridescence
          color={[0.5, 0.6, 0.8]}
          mouseReact={false}
          amplitude={0.05}
          speed={0.8}
        />
      </div>
    </div>
  );
}