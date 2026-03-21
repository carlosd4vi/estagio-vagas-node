import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// IMPORTANTE: Lembre de arrumar o caminho do Supabase para o seu projeto!
import { supabase } from "../script/supabase"; 

import Header from "../pages/componentes/Login/header";
import Footer from "../pages/componentes/Login/footer";

const Login = () => {
  const navigate = useNavigate();

  // A MÁGICA ACONTECE AQUI:
  useEffect(() => {
    const verificarUsuarioLogado = async () => {
      // 1. Pergunta pro Supabase se tem alguém logado agora
      const { data: { session } } = await supabase.auth.getSession();
      
      // 2. Se a sessão existir, o cara já tá logado! Manda ele pro painel.
      if (session) {
        navigate('/dashboard');
      }
      // Se não tiver sessão, o React não faz nada e deixa ele ver a tela de Login em paz.
    };

    verificarUsuarioLogado();
  }, [navigate]); // O array garante que a checagem rode assim que a tela abre

  return ( 
    <>
      <Header />
      <Footer />
    </>
  );
}
 
export default Login;