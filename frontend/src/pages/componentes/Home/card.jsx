import React from 'react';

import { Link } from "react-router-dom";

import gupyLogo from "../../../assets/img/gupy.jpg";
import indeedLogo from "../../../assets/img/indeed.jpg";
import linkedinLogo from "../../../assets/img/linkedin.jpg";
import infojobsLogo from "../../../assets/img/infojobs.jpg";
import cathoLogo from "../../../assets/img/catho.jpg";
import solidesLogo from "../../../assets/img/solides.jpg";
import siteLogo from "../../../assets/img/site.jpg";

// Função ninja para limpar textos (tira acentos, espaços viram traços, tudo minúsculo)
export const gerarSlug = (texto) => {
  if (!texto) return 'vaga';
  return texto
    .toString()
    .normalize('NFD') // Separa os acentos das letras
    .replace(/[\u0300-\u036f]/g, '') // Apaga os acentos
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Troca espaços por -
    .replace(/[^\w\-]+/g, '') // Remove caracteres especiais (como ! @ #)
    .replace(/\-\-+/g, '-'); // Se tiver dois traços juntos, vira um só
};

export default function Card({ 
  id = 1, 
  titulo = 'Não encontrado', 
  link = 'https://google.com',
  modelo = 'Presencial', 
  cliques = 0, 
  dia = 'Hoje' 
}) {

  // Função que avisa a API que alguém clicou!
const registrarClique = () => {
  // 1. Verifica se existe uma sessão de admin ativa no navegador
  // Lembre-se de trocar 'token' pela palavra exata que você usa no seu login!
  const isAdminLogado = !!localStorage.getItem('sb-gwocynxaeyeabakxkutk-auth-token'); 

  // 2. O Escudo: Se for o admin, bloqueia o envio
  if (isAdminLogado) {
    console.log("🕵️‍♂️ Admin logado: Clique ignorado para não sujar as métricas.");
    return; // O return expulsa a função daqui, o fetch abaixo não será executado.
  }

  // 3. Se for um estudante comum, a função continua e envia para o banco
  fetch(`https://estagio-vagas-node.onrender.com/api/vagas/${id}/clique`, {
    method: 'POST',
    headers: {
      'x-api-key': import.meta.env.VITE_API_KEY
    }
  }).catch(err => console.error("Erro ao computar clique:", err));
};

  // Função que Converte a Data
  function formatarTempoDecorrido(dataBanco) {
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

  // 2. A MÁGICA: A função agora retorna a própria VARIÁVEL da imagem importada
  const identificarPlataformaImg = (linkVaga) => {
    if (!linkVaga) return siteLogo;
    
    const url = linkVaga.toLowerCase();
    
    if (url.includes('gupy.io')) return gupyLogo;
    if (url.includes('indeed.com')) return indeedLogo;
    if (url.includes('linkedin.com')) return linkedinLogo;
    if (url.includes('infojobs.com.br')) return infojobsLogo;
    if (url.includes('catho.com.br')) return cathoLogo;
    if (url.includes('vagas.solides.com.br')) return solidesLogo;
    
    return siteLogo;
  };

  // 3. Pegamos a variável da imagem correta
  const logoSrc = identificarPlataformaImg(link);

  const icone_calculado = (modelo || '').toLowerCase() === 'presencial' ? 'apartment' : 'computer';

    return (
    // ✨ Usamos o Link para não recarregar a página e manter o cache vivo!
    // ✨ E usamos as variáveis 'titulo' e 'id' diretamente.
    <Link 
      to={`/vaga/${gerarSlug(titulo)}/${id}`} 
      className="block h-full"
      onClick={registrarClique} 
    >
      <article className="bg-card-light dark:bg-card-dark p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all group flex flex-col h-full relative overflow-hidden">
        
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <img 
              className="size-12 rounded-lg object-cover bg-gray-50" 
              src={logoSrc}
              onError={(e) => { e.target.src = siteLogo; }} 
            />
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors text-lg leading-tight">
                {titulo}
              </h4>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">
            <span className="material-symbols-outlined text-[14px]">location_on</span>
            Fortaleza, CE
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-green-50 dark:bg-green-900/30 text-xs font-medium text-green-600 dark:text-green-300">
            <span className="material-symbols-outlined text-[14px]">{icone_calculado}</span>
            {modelo}
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">
            <span className="material-symbols-outlined text-[14px]">work</span>
            Estágio
          </span>
          
          <br />
          
          <div className="w-full flex items-center gap-1 mt-2 text-gray-500 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18" fill="currentColor">
              <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"></path>
            </svg>
            <span>{cliques}</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700/50">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">schedule</span>
            {formatarTempoDecorrido(dia)}
          </span>
          <span className="text-sm font-bold text-primary hover:text-primary/80 dark:hover:text-teal-400 transition-colors">
            Candidatar-se
          </span>
        </div>

        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
      </article>
    </Link>
  );
}