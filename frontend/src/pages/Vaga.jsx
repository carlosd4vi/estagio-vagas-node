import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../script/supabase'; // Ajuste o caminho do seu supabase se precisar!
import { ContextApi } from '../contextApi/api';

import Header from "../pages/componentes/Home/header"; 
import Footer from "../pages/componentes/Home/footer"; 

// Importe todas as logos que você já usava no Card!
import gupyLogo from "../assets/img/gupy.jpg";
import indeedLogo from "../assets/img/indeed.jpg";
import linkedinLogo from "../assets/img/linkedin.jpg";
import infojobsLogo from "../assets/img/infojobs.jpg";
import cathoLogo from "../assets/img/catho.jpg";
import solidesLogo from "../assets/img/solides.jpg";
import siteLogo from "../assets/img/site.jpg";

export default function VagaDetalhes() {
  const { slug, id } = useParams();
  const { vagas, loading: contextLoading } = useContext(ContextApi);
  
  // 1. Puxamos o "volante" de navegação do React
  const navigate = useNavigate(); 

  // 2. A função inteligente de voltar
const handleVoltar = (e) => {
    e.preventDefault();
    if (window.history.state && window.history.state.idx > 0) {
      window.history.back(); // Salva a pátria do scroll!
    } else {
      navigate('/', { replace: true });
    }
  };

  const [vaga, setVaga] = useState(null);
  const [loading, setLoading] = useState(true);

  // O React pede para colocar 'vagas' aqui nas dependências
useEffect(() => {
    // 🚦 O SINAL VERMELHO: Se a Home ainda está buscando as vagas no Node, ESPERE! Não faça nada.
    if (contextLoading) return;

    const buscarVaga = async () => {
      
      // 1. TENTA ACHAR A VAGA NO CACHE
      const vagaNoCache = vagas.find(v => v.id.toString() === id);
      
      let colunasParaBuscar = '*'; 

      if (vagaNoCache) {
        setVaga(vagaNoCache); 
        setLoading(false);    
        
        if (vagaNoCache.descricao !== undefined && vagaNoCache.atividades !== undefined) return; 
        
        colunasParaBuscar = 'descricao, atividades';
      } else {
        setLoading(true); 
      }

      // 2. BUSCA NO SUPABASE 
      try {
        const { data, error } = await supabase
          .from('vagas_info')
          .select(colunasParaBuscar)
          .eq('id', id)
          .single();

        if (error) throw error;
        
        setVaga((vagaAtual) => ({
          ...vagaAtual, 
          ...data 
        })); 
        
      } catch (error) {
        console.error("Erro ao buscar detalhes da vaga:", error.message);
      } finally {
        setLoading(false);
      }
    };

    buscarVaga();
  }, [id, vagas, contextLoading]); // <-- Não esqueça de adicionar o contextLoading aqui no final!

  // 2. FUNÇÕES AJUDANTES (As mesmas do seu Card.jsx + Nome da Plataforma)
  const handleCandidatar = () => {
    if (vaga && vaga.link) {
      window.open(vaga.link, '_blank', 'noopener,noreferrer');
    }
  };

  function formatarTempoDecorrido(dataBanco) {
    if (!dataBanco) return 'Data desconhecida';
    const dataVaga = new Date(dataBanco);
    const dataAtual = new Date();
    const diferencaMs = dataAtual - dataVaga;
    const diferencaHoras = Math.floor(diferencaMs / (1000 * 60 * 60));
    const diferencaDias = Math.floor(diferencaMs / (1000 * 60 * 60 * 24));

    if (diferencaHoras < 24) {
      if (diferencaHoras === 0) return 'Agora mesmo'; 
      return `${diferencaHoras} hora${diferencaHoras > 1 ? 's' : ''} atrás`;
    } 
    if (diferencaDias < 3) {
      return `${diferencaDias} dia${diferencaDias > 1 ? 's' : ''} atrás`;
    } 
    return dataVaga.toLocaleDateString('pt-BR');
  }

  const identificarPlataforma = (linkVaga) => {
    if (!linkVaga) return { logo: siteLogo, nome: 'Site Oficial' };
    const url = linkVaga.toLowerCase();
    
    if (url.includes('gupy.io')) return { logo: gupyLogo, nome: 'Gupy' };
    if (url.includes('indeed.com')) return { logo: indeedLogo, nome: 'Indeed' };
    if (url.includes('linkedin.com')) return { logo: linkedinLogo, nome: 'LinkedIn' };
    if (url.includes('infojobs.com.br')) return { logo: infojobsLogo, nome: 'InfoJobs' };
    if (url.includes('catho.com.br')) return { logo: cathoLogo, nome: 'Catho' };
    if (url.includes('solides.com.br')) return { logo: solidesLogo, nome: 'Sólides' };
    
    return { logo: siteLogo, nome: 'Site da Empresa' };
  };


  // 3. TELAS DE CARREGAMENTO E ERRO
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0b1120] flex flex-col items-center justify-center font-manrope">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400 font-bold">Buscando informações da vaga...</p>
      </div>
    );
  }

  if (!vaga) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0b1120] flex flex-col items-center justify-center font-manrope">
        <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700 mb-4">work_off</span>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Vaga não encontrada</h2>
        <p className="text-gray-500 mb-6">A vaga que você está procurando pode ter sido removida.</p>
        
        {/* Botão de voltar com design bonito para a tela de erro */}
        <button 
          onClick={handleVoltar} 
          className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors border-none cursor-pointer"
        >
          Voltar para Home
        </button>
      </div>
    );
  }

  // Se chegou aqui, temos a vaga! Vamos extrair a logo e o nome:
  const plataforma = identificarPlataforma(vaga.link);

  // A MÁGICA DA GUPY: Descriptografa o Base64 e monta o link direto
  const gerarLinkRapidoGupy = (linkOriginal) => {
    try {
      // 1. Cria um objeto URL inteligente para facilitar a nossa vida
      const urlObj = new URL(linkOriginal);

      // 2. Verifica se é o formato com "Base64" (caminho /job/)
      if (!urlObj.pathname.includes('/job/')) {
        return linkOriginal; // Se for um link comum, não mexe em nada
      }

      // 3. Pega o nome da empresa ("unimedfortaleza")
      const empresa = urlObj.hostname.split('.')[0];

      // 4. Pega só a parte do Base64 ("eyJqb2...")
      const base64String = urlObj.pathname.split('/').pop();

      // 5. Decodifica o Base64 e converte para um objeto de verdade
      const jsonDecodificado = atob(base64String);
      const dadosVaga = JSON.parse(jsonDecodificado);
      
      // 6. Pega o ID escondido (ex: 11102420)
      const jobId = dadosVaga.jobId;

      if (!jobId) return linkOriginal;

      // 7. Retorna a URL pronta para a tela de Candidatura!
      return `https://${empresa}.gupy.io/candidates/jobs/${jobId}/apply?jobBoardSource=gupy_portal`;

    } catch (error) {
      console.error("Erro ao descriptografar link da Gupy:", error);
      return linkOriginal; // Caiu aqui? Devolve o link normal como salva-vidas.
    }
  };

// Exclusivo para o botão relâmpago: Saber se é Indeed ou não (para mudar o texto do botão normal)
// 1. Descobrindo a Plataforma
const isIndeed = plataforma.nome === 'Indeed';
const isGupy = plataforma.nome === 'Gupy';

// 2. Regra da Tela (Lembra do lance do Indeed quebrar no mobile?)
const isDesktop = window.innerWidth >= 768;

// 3. O Botão Mágico aparece se for Gupy (qualquer tela) OU Indeed (só no PC)
const showBotaoRapido = isGupy || (isIndeed && isDesktop);

// 4. Descobrindo qual link rápido usar
let linkCandidaturaRapida = vaga.link;
if (isGupy) {
  linkCandidaturaRapida = gerarLinkRapidoGupy(vaga.link);
} else if (isIndeed) {
  linkCandidaturaRapida = `${vaga.link}&utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic`;
}

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b1120] text-gray-900 dark:text-gray-100 font-manrope selection:bg-primary/20 selection:text-primary">
      
      <Header />

      <main className="pt-8 pb-8 px-6 max-w-7xl mx-auto">
        
        {/* Botão Voltar Inteligente (Agora sim no lugar certo!) */}
        <div className="mb-8">
          <button 
            onClick={handleVoltar}
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            Voltar para as vagas
          </button>
        </div>

        {/* Grid Principal continua aqui embaixo... */}

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* COLUNA ESQUERDA: Conteúdo */}
          <div className="lg:col-span-8 space-y-12">
            <section>
              <div className="flex items-center gap-4 mb-6">
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                  {vaga.modelo || 'Presencial'}
                </span>
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                  Estágio
                </span>
              </div>
              
              {/* TÍTULO DINÂMICO! */}
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
                {vaga.titulo}
              </h1>
              
              <div className="flex flex-wrap gap-6 text-gray-600 dark:text-gray-400 text-sm">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
                  <span>Fortaleza, CE</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">schedule</span>
                  {/* DATA DINÂMICA! */}
                  <span>{formatarTempoDecorrido(vaga.dia)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">visibility</span>
                  <span>{vaga.cliques || 0} visualizações</span>
                </div>
              </div>
            </section>

            {/* SEÇÃO DE TEXTOS (No futuro você pode adicionar a descrição no banco de dados e chamar {vaga.descricao} aqui) */}
            {/* SEÇÃO DE TEXTOS DINÂMICA */}
            <article className="bg-white dark:bg-card-dark rounded-2xl p-8 md:p-12 space-y-10 shadow-sm border border-gray-100 dark:border-gray-800">
              
              {/* DESCRIÇÃO DA VAGA */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Descrição da Vaga</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg whitespace-pre-wrap">
                  {vaga.descricao || "A descrição detalhada desta vaga está disponível diretamente na plataforma de inscrição. Clique no botão Candidatar-se para conferir!"}
                </p>
              </section>

              {/* ATIVIDADES (Lendo linha por linha) */}
              <section>
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Atividades</h2>
                <ul className="space-y-4">
                  {vaga.atividades ? (
                    // Pega o textão do banco, corta onde você deu ENTER (\n) e faz a lista
                    vaga.atividades.split('\n').map((item, index) => {
                      if (item.trim() === '') return null; // Ignora linhas em branco
                      return (
                        <li key={index} className="flex gap-4">
                          <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                          <span className="text-gray-600 dark:text-gray-400">{item}</span>
                        </li>
                      );
                    })
                  ) : (
                    // Texto padrão se você não tiver preenchido nada no painel
                    <li className="text-gray-600 dark:text-gray-400 italic">Atividades não especificadas. Confira no link oficial.</li>
                  )}
                </ul>
              </section>
                            <section>
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Requisitos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-900 dark:text-white font-semibold mb-1">Formação</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Cursando ensino superior na área ou áreas correlatas.</p>
                  </div>
                </div>
              </section>
            </article>
          </div>

          {/* COLUNA DIREITA: Sidebar Fixa */}
          <aside className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="bg-white dark:bg-card-dark rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
              
              {/* LOGO DINÂMICA (Puxa a logo certa dependendo do link) */}
              <div className="flex justify-center mb-4">
                <img 
                  src={plataforma.logo} 
                  alt={`Logo ${plataforma.nome}`} 
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 dark:border-gray-700 shadow-sm" 
                  onError={(e) => { e.target.src = siteLogo; }}
                />
              </div>    
              
              {/* NOME DA PLATAFORMA DINÂMICO */}
              <div className="text-center mb-6">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Plataforma: <strong className="text-gray-900 dark:text-white">{plataforma.nome}</strong>
                </span>
              </div>
              {/* O BOTÃO EXCLUSIVO (Só aparece se for Indeed E se estiver no PC) */}
              {/* O BOTÃO EXCLUSIVO (Gupy ou Indeed (Somente PC) */}
{showBotaoRapido && (
  <div className={`mb-4 border p-4 rounded-2xl ${isGupy ? 'bg-blue-50/50 border-blue-200' : 'bg-blue-50 dark:bg-blue-900/10 border-blue-100'}`}>
    <button 
      onClick={() => {
        window.open(linkCandidaturaRapida, '_blank');
      }}
      className={`w-full py-4 text-white rounded-xl font-extrabold text-lg shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 ${isGupy ? 'bg-[#0070FF] shadow-blue-500/20 hover:bg-[#005AE0]' : 'bg-[#2557a7] shadow-blue-500/20 hover:bg-[#1e4687]'}`}
    >
      <span className="material-symbols-outlined text-[24px]">bolt</span>
      Candidatura Rápida
    </button>
    
    <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3 px-2 leading-relaxed">
      ⚡ <strong>Aviso:</strong>Funciona apenas para candidatos <strong>logados na {plataforma.nome} </strong>.
    </p>
  </div>
)}

{/* O SEU BOTÃO PADRÃO (Para Infojobs, Catho, Sólides, etc) */}
<button 
  onClick={handleCandidatar}
  className="w-full py-4 bg-primary text-white rounded-xl font-extrabold text-lg shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all duration-300"
>
  {showBotaoRapido ? 'Candidatar-se Normalmente' : 'Candidatar-se'}
</button>
<p className="text-center text-xs text-gray-400 mt-4 px-4">
  Você será redirecionado para o site de inscrição.<br />
  Boa sorte! 🎉
</p>
            </div>
          </aside>

        </div>
      </main>
      <Footer />
    </div>
  );
}