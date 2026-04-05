import React from 'react';
import { useNavigate } from 'react-router-dom';

import Header from "../componentes/Home/header"; 
import Footer from "../componentes/Home/footer"; 

export default function TermosDeUso() {
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
            <span className="material-symbols-outlined text-[32px]">gavel</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Termos de Uso
          </h1>
        </div>

        <article className="bg-white dark:bg-card-dark rounded-2xl p-8 md:p-12 space-y-8 shadow-sm border border-gray-100 dark:border-gray-800">
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">1. Aceitação dos Termos</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
              Ao acessar e utilizar nosso site, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis ​​e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum desses termos, está proibido de usar ou acessar este site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">2. Natureza do Serviço</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
              Nosso site atua estritamente como um <strong>agregador e buscador de vagas</strong> de estágio e emprego. Nós não somos uma agência de recrutamento, não empregamos os candidatos e não participamos do processo seletivo, triagem ou contratação de nenhuma das vagas listadas.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">3. Isenção de Responsabilidade</h2>
            <ul className="space-y-4 ml-2">
              <li className="flex gap-3 items-start text-gray-600 dark:text-gray-400">
                <span className="material-symbols-outlined text-primary mt-0.5">warning</span>
                <span><strong>Veracidade das Vagas:</strong> Embora nos esforcemos para listar apenas oportunidades reais e ativas, as informações das vagas são de inteira responsabilidade das empresas e plataformas anunciantes. Não garantimos a precisão, integridade ou validade das informações.</span>
              </li>
              <li className="flex gap-3 items-start text-gray-600 dark:text-gray-400">
                <span className="material-symbols-outlined text-primary mt-0.5">warning</span>
                <span><strong>Links Externos:</strong> O site contém links para sites de terceiros (como Gupy, Indeed, Catho). O uso desses links é por sua conta e risco. Não endossamos o conteúdo desses sites e não somos responsáveis por quaisquer danos ou perdas causados por eles.</span>
              </li>
              <li className="flex gap-3 items-start text-gray-600 dark:text-gray-400">
                <span className="material-symbols-outlined text-primary mt-0.5">warning</span>
                <span><strong>Disponibilidade:</strong> As vagas podem ser preenchidas, alteradas ou removidas pelas empresas a qualquer momento, sem aviso prévio. Não garantimos que uma vaga listada em nosso site ainda estará disponível no momento do seu clique.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">4. Propriedade Intelectual</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
              Os logotipos, nomes de empresas e marcas registradas exibidos neste site (como logotipos de plataformas de emprego e empresas contratantes) pertencem aos seus respectivos proprietários. O uso dessas marcas tem caráter puramente informativo e de identificação, não implicando qualquer afiliação, patrocínio ou endosso.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">5. Modificações</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
              Podemos revisar estes termos de serviço do site a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual e em vigor desses termos de serviço.
            </p>
            <p className="text-sm text-gray-400 mt-6">
              <em>Última atualização: Abril de 2026.</em>
            </p>
          </section>

        </article>
      </main>
      
      <Footer />
    </div>
  );
}