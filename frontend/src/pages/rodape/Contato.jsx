import React from 'react';
import { useNavigate } from 'react-router-dom';

import Header from "../componentes/Home/header"; 
import Footer from "../componentes/Home/footer"; 

export default function Contato() {
  const navigate = useNavigate();

  const handleVoltar = (e) => {
    e.preventDefault();
    if (window.history.state && window.history.state.idx > 0) {
      window.history.back();
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b1120] text-gray-900 dark:text-gray-100 font-manrope selection:bg-primary/20 selection:text-primary">
      <Header />

      <main className="pt-8 pb-16 px-6 max-w-4xl mx-auto">
        
        <div className="mb-8">
          <button 
            onClick={handleVoltar}
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            Voltar
          </button>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-primary/10 text-primary flex items-center justify-center rounded-xl">
            <span className="material-symbols-outlined text-[32px]">mail</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Entre em Contato
          </h1>
        </div>

        <article className="bg-white dark:bg-card-dark rounded-2xl p-8 md:p-12 space-y-8 shadow-sm border border-gray-100 dark:border-gray-800">
          
          <section className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Como podemos ajudar?</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
              Encontrou algum link quebrado? Tem uma sugestão de melhoria ou representa uma empresa e quer divulgar suas vagas de estágio com a gente? Adoraríamos ouvir você!
            </p>
          </section>

          {/* Card de E-mail Bonitão */}
          <div className="mt-8 flex flex-col items-center">
            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 w-full max-w-md text-center hover:shadow-lg hover:border-primary/30 transition-all group">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">send</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-xl mb-2">Mande um E-mail</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                Irei responder o mais rápido possível (geralmente em até 3 dias úteis).
              </p>
              <a 
                href="mailto:carlosdavi1314@gmail.com" 
                className="inline-block w-full py-3 px-6 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary/90 transition-colors"
              >
                carlosdavi1314@gmail.com
              </a>
            </div>
          </div>

          <section className="text-center mt-12 border-t border-gray-100 dark:border-gray-800 pt-8">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              <strong>Nota:</strong> Como somos um agregador de vagas, nós não recebemos currículos por e-mail. Para se candidatar, por favor, clique no botão "Candidatar-se" dentro da página da vaga desejada.
            </p>
          </section>

        </article>
      </main>
      
      <Footer />
    </div>
  );
}