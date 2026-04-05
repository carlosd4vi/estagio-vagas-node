import React from 'react';
import { useNavigate } from 'react-router-dom';

import Header from "../componentes/Home/header"; 
import Footer from "../componentes/Home/footer"; 

export default function Privacidade() {
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
            <span className="material-symbols-outlined text-[32px]">policy</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Política de Privacidade
          </h1>
        </div>

        <article className="bg-white dark:bg-card-dark rounded-2xl p-8 md:p-12 space-y-8 shadow-sm border border-gray-100 dark:border-gray-800">
          
          <section>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg mb-4">
              A sua privacidade é importante para nós. É política do nosso site respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar, operando de forma transparente e segura.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">1. Informações que Coletamos</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg mb-4">
              Como a maioria dos sites, coletamos informações não pessoais que os navegadores e servidores da web normalmente disponibilizam, como o tipo de navegador, preferência de idioma, site de referência e a data e hora de cada solicitação de visitante. Nosso objetivo ao coletar essas informações é entender melhor como os nossos visitantes usam o site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">2. Uso de Cookies e Google AdSense</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg mb-4">
              Utilizamos cookies para armazenar informação, tais como as suas preferências pessoais quando visita o nosso website. Além disso, utilizamos publicidade de terceiros para suportar os custos de manutenção:
            </p>
            <ul className="space-y-3 mt-4 ml-2">
              <li className="flex gap-3 items-start text-gray-600 dark:text-gray-400">
                <span className="material-symbols-outlined text-primary mt-0.5">chevron_right</span>
                <span>O Google, como fornecedor de terceiros, utiliza cookies para exibir anúncios no nosso site.</span>
              </li>
              <li className="flex gap-3 items-start text-gray-600 dark:text-gray-400">
                <span className="material-symbols-outlined text-primary mt-0.5">chevron_right</span>
                <span>Com o cookie DART, o Google pode exibir anúncios com base nas visitas que você fez a este e a outros sites na Internet.</span>
              </li>
              <li className="flex gap-3 items-start text-gray-600 dark:text-gray-400">
                <span className="material-symbols-outlined text-primary mt-0.5">chevron_right</span>
                <span>Você pode desativar o uso do cookie DART visitando a <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Política de privacidade da rede de conteúdo e dos anúncios do Google</a>.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">3. Links para Sites de Terceiros</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
              Nosso site atua como um agregador e contém links para sites externos (como plataformas de emprego e empresas parceiras). Não temos controle sobre o conteúdo e as práticas desses sites e não podemos aceitar responsabilidade por suas respectivas políticas de privacidade. Recomendamos que você leia as políticas de cada site ao qual for redirecionado.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">4. Consentimento</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
              O uso continuado de nosso site será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais. Se você tiver alguma dúvida sobre como lidamos com dados do usuário, entre em contato conosco.
            </p>
            <p className="text-sm text-gray-400 mt-6">
              <em>Esta política é efetiva a partir de Abril de 2026.</em>
            </p>
          </section>

        </article>
      </main>
      
      <Footer />
    </div>
  );
}