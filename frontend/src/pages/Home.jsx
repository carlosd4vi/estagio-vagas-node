import React, { useContext } from 'react';
import { ContextApi } from "../contextApi/api"

import Header from "../pages/componentes/Home/header"
import Section from "../pages/componentes/Home/section"
import Alert from "../pages/componentes/Home/modal-alert"
import Filtro from "../controller/filter"
import Card from "../pages/componentes/Home/card"
import Ad from "../pages/Ads"
import LoadingMore from "../controller/loading-more"
import Footer from "../pages/componentes/Home/footer"

const Home = () => {
  const { vagas, loading } = useContext(ContextApi);

  // Removemos aquele "if (loading)" gigantesco daqui de cima!

  return (
    <>
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Section />
        <Alert />
        
        {/* O Filtro agora NUNCA MAIS é destruído, ele fica fixo! */}
        <Filtro />

        {/* A MÁGICA ACONTECE AQUI: Só trocamos os cards pelo Loading */}
        {loading ? (
          <div className="w-full min-h-[40vh] flex flex-col items-center justify-center space-y-4 transition-colors duration-300">
            <div className="relative flex justify-center items-center">
              <div className="absolute animate-ping h-10 w-10 rounded-full bg-primary/20"></div>
              <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-200 dark:border-gray-700 border-t-primary"></div>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-text-main dark:text-white tracking-tight">
                Buscando vagas...
              </h2>
            </div>
          </div>
        ) : (
          <div id="jobs-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Passamos a usar o index para contar a posição do card */}
            {vagas.map((vaga, index) => (
              <React.Fragment key={vaga.id}>
                
                {/* 1. O Card normal */}
                <Card 
                  id={vaga.id}
                  nome_site={vaga.nome_site}
                  titulo={vaga.titulo}
                  modelo={vaga.modelo}
                  link={vaga.link}
                  icone_modelo={vaga.icone_modelo}
                  cliques={vaga.cliques}
                  dia={vaga.dia} 
                />

                {/* 2. O Espaço do Anúncio MÁGICO (agora a cada 6 cards) */}
                {(index + 1) % 6 === 0 && index !== vagas.length - 1 && (
                  <div className="col-span-full w-full h-24 bg-gray-100/80 dark:bg-[#111827]/50 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center overflow-hidden opacity-70 hover:opacity-100 transition-opacity">
                    <Ad />
                  </div>
                )}
                
              </React.Fragment>
            ))}  
          </div>
        )}

        {/* O botão "Carregar Mais" só aparece quando não estiver carregando */}
        {!loading && <LoadingMore />}
        
      </main>
      <Footer />
    </>
  );
}
 
export default Home;