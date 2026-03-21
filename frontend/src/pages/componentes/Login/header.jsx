import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../../assets/img/logo.jpg";

// IMPORTANTE: Você precisa importar a sua conexão com o Supabase aqui!
import { supabase } from '../../../script/supabase'; 

const Login = () => {
  const navigate = useNavigate();

  // 1. Criamos os estados para guardar o que o usuário digita
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  
  // 2. Estados para controlar a interface (carregamento e mensagens de erro)
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  // 3. A função que faz a mágica de falar com o Supabase
  const handleLogin = async (e) => {
    e.preventDefault(); // Impede a página de recarregar
    setLoading(true);
    setErro(''); // Limpa erros anteriores

    try {
      // Chama a autenticação nativa do Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: senha,
      });

      if (error) {
        throw error;
      }

      // Se deu tudo certo, manda o recrutador para o Dashboard!
      navigate('/dashboard'); 

    } catch (error) {
      console.error("Erro no login:", error.message);
      setErro('E-mail ou senha incorretos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return ( 
    <main className="flex-grow flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-card-light rounded-2xl shadow-soft border border-gray-100 p-8 md:p-10">
          
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white">
                <img alt="Logo Estágio Fortaleza" className="w-6 h-6" src={Logo} />
              </div>
              <Link to="/">
                <span className="text-xl font-extrabold tracking-tight text-gray-900">Estágio Fortaleza</span> 
              </Link>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Área restrita</h2>
          </div>

          {/* Exibe a mensagem de erro em vermelho caso a senha esteja errada */}
          {erro && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
              {erro}
            </div>
          )}

          {/* Adicionamos o onSubmit no form */}
          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="email">Email:</label>
              <div className="relative group">
                <input 
                  id="email" 
                  name="email" 
                  type="email" // Mudei para tipo email para o teclado do celular ajudar
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Salva o texto digitado
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-gray-900 placeholder-gray-400" 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-semibold text-gray-700" htmlFor="password">Senha:</label>
              </div>
              <div className="relative group">
                <input 
                  id="password" 
                  name="senha" 
                  type="password" 
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)} // Salva a senha digitada
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-gray-900 placeholder-gray-400" 
                />
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading} // Desativa o botão enquanto carrega
                className="w-full py-4 bg-primary hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" 
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </main>
  );
}
 
export default Login;