import React from 'react';
import { useNavigate } from 'react-router-dom';

import Header from "../componentes/Home/header"; 
import Footer from "../componentes/Home/footer"; 

export default function SobreNos() {
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
            {/* Ícone de grupo/equipe para dar um tom mais humano */}
            <span className="material-symbols-outlined text-[32px]">groups</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Sobre Nós
          </h1>
        </div>

        <article className="bg-white dark:bg-card-dark rounded-2xl p-8 md:p-12 space-y-8 shadow-sm border border-gray-100 dark:border-gray-800">
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Quem Somos</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
              Nascemos com um propósito muito claro: simplificar e democratizar o acesso às oportunidades de estágio e primeiro emprego para os estudantes de Fortaleza e região. Sabemos que o início da jornada profissional pode ser desafiador, e procurar vagas em dezenas de sites diferentes é exaustivo. Por isso, criamos um espaço único, organizado e focado em você.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">A Nossa Missão</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
              Acreditamos que o talento está em toda parte, mas as oportunidades nem sempre são visíveis. Nossa missão é ser a ponte entre os estudantes em busca de crescimento e as empresas que procuram novos talentos, economizando o tempo valioso dos candidatos e reduzindo a ansiedade da busca por emprego.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Como Funciona o Site?</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg mb-4">
              Nós operamos como um <strong>agregador inteligente de vagas</strong>. O que isso significa na prática?
            </p>
            <ul className="space-y-3 mt-4 ml-2">
              <li className="flex gap-3 items-start text-gray-600 dark:text-gray-400">
                <span className="material-symbols-outlined text-primary mt-0.5">search</span>
                <span>Monitoramos diariamente as principais plataformas de recrutamento (Gupy, Indeed, Catho, Sólides, LinkedIn, etc.).</span>
              </li>
              <li className="flex gap-3 items-start text-gray-600 dark:text-gray-400">
                <span className="material-symbols-outlined text-primary mt-0.5">filter_alt</span>
                <span>Filtramos rigorosamente apenas as vagas de Estágio, Trainee e Jovem Aprendiz focadas na nossa região.</span>
              </li>
              <li className="flex gap-3 items-start text-gray-600 dark:text-gray-400">
                <span className="material-symbols-outlined text-primary mt-0.5">ads_click</span>
                <span>Organizamos tudo de forma limpa e rápida, redirecionando você com segurança e direto para a página oficial de inscrição da empresa.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Nosso Compromisso</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
              Este projeto é <strong>100% gratuito</strong> para os usuários e sempre será. Não exigimos cadastro, não cobramos taxas e não intermediamos contratações. Somos movidos pela satisfação de saber que ajudamos milhares de universitários e recém-formados a darem o primeiro passo rumo a uma carreira de sucesso.
            </p>
          </section>

        </article>
      </main>
      
      <Footer />
    </div>
  );
}