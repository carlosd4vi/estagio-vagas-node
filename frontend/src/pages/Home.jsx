import React, { useContext, useState, useMemo, useEffect } from 'react';
import { ContextApi } from "../contextApi/api";
import { Link } from "react-router-dom"; // ✨ Importamos o Link para a navegação do Modal

import Header from "../pages/componentes/Home/header";
import Section from "../pages/componentes/Home/section";
import Alert from "../pages/componentes/Home/modal-alert";
import Filtro from "../controller/filter";
import Card from "../pages/componentes/Home/card";
import Ad from "../pages/Ads";
import LoadingMore from "../controller/loading-more";
import Footer from "../pages/componentes/Home/footer";

const gerarSlug = (texto) => {
  if (!texto) return "";
  return texto.toString().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
    .replace(/[^a-z0-9 -]/g, "") 
    .replace(/\s+/g, "-") 
    .replace(/-+/g, "-") 
    .replace(/^-+|-+$/g, ""); 
};

const verificarSimilaridade = (titulo1, titulo2) => {
  const limpar = (t) => (t || "").toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
    .replace(/estagio|vaga|de|em|-|\||\/|\(|\)/g, " ") 
    .replace(/\s+/g, " ") 
    .trim();

  const t1 = limpar(titulo1);
  const t2 = limpar(titulo2);

  const palavraChave1 = t1.split(" ")[0];
  const palavraChave2 = t2.split(" ")[0];

  return palavraChave1 && palavraChave2 && palavraChave1 === palavraChave2 && palavraChave1.length > 2;
};

const agruparVagas = (listaVagas) => {
  const agrupadas = [];

  listaVagas.forEach((vagaAtual) => {
    const indexPai = agrupadas.findIndex(pai => {
      const dataVaga = new Date(vagaAtual.dia);
      const dataPai = new Date(pai.dia);
      
      if (!isNaN(dataVaga) && !isNaN(dataPai)) {
        const isMesmoDia = dataVaga.toDateString() === dataPai.toDateString();
        const diffHoras = Math.abs(dataVaga - dataPai) / (1000 * 60 * 60);
        return isMesmoDia && diffHoras <= 8 && verificarSimilaridade(vagaAtual.titulo, pai.titulo);
      }
      
      return verificarSimilaridade(vagaAtual.titulo, pai.titulo);
    });

    if (indexPai !== -1) {
      agrupadas[indexPai].similares.push(vagaAtual);
    } else {
      agrupadas.push({ ...vagaAtual, similares: [] });
    }
  });

  return agrupadas;
};

const Home = () => {
  const { vagas, loading, erro } = useContext(ContextApi);

  const [modalAberto, setModalAberto] = useState(false);
  const [vagasDoModal, setVagasDoModal] = useState([]);
  const [tituloModal, setTituloModal] = useState("");

  // Função para formatar a data como tempo decorrido (igual a do Card)
const formatarTempoDecorrido = (dataBanco) => {
  if (!dataBanco) return '';
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
};

  const vagasProcessadas = useMemo(() => {
    if (!vagas || vagas.length === 0) return [];
    return agruparVagas(vagas);
  }, [vagas]);

  // ✨ A MEMÓRIA DO MODAL: Quando as vagas carregam, verifica se tinha um modal aberto antes
  useEffect(() => {
    const idSalvo = sessionStorage.getItem('modalVagaAberta');
    if (idSalvo && vagasProcessadas.length > 0) {
      const vagaPai = vagasProcessadas.find(v => v.id.toString() === idSalvo);
      if (vagaPai) {
        setTituloModal(vagaPai.titulo);
        setVagasDoModal([vagaPai, ...vagaPai.similares]);
        setModalAberto(true);
      }
    }
  }, [vagasProcessadas]);

  const abrirModalSimilares = (vagaPrincipal) => {
    setTituloModal(vagaPrincipal.titulo);
    setVagasDoModal([vagaPrincipal, ...vagaPrincipal.similares]); 
    setModalAberto(true);
    // Salva na memória do navegador qual card foi aberto
    sessionStorage.setItem('modalVagaAberta', vagaPrincipal.id.toString());
  };

  const fecharModal = () => {
    setModalAberto(false);
    // Limpa a memória quando o usuário fecha no 'X'
    sessionStorage.removeItem('modalVagaAberta');
  };

  return (
    <>
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Section />
        <Alert />
        <Filtro />

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
        ) : erro ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center w-full col-span-full">
            <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-full mb-6 border border-red-100 dark:border-red-900/30">
              <span className="material-symbols-outlined text-6xl text-red-500">cloud_off</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">Ops! Algo deu errado.</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">Não foi possível carregar as vagas no momento. Tente mais tarde.</p>
            <button onClick={() => window.location.reload()} className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined">refresh</span>
              Tentar Novamente
            </button>
          </div>
        ) : (
          <div id="jobs-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vagasProcessadas.map((vaga, index) => (
              <React.Fragment key={vaga.id}>
                <Card 
                  id={vaga.id}
                  nome_site={vaga.nome_site}
                  titulo={vaga.titulo}
                  modelo={vaga.modelo}
                  link={vaga.link}
                  icone_modelo={vaga.icone_modelo}
                  cliques={vaga.cliques}
                  dia={vaga.dia} 
                  similares={vaga.similares} 
                  abrirModal={() => abrirModalSimilares(vaga)}
                  slug={gerarSlug(vaga.titulo)}
                />

                {(index + 1) % 6 === 0 && index !== vagasProcessadas.length - 1 && (
                  <div className="col-span-full w-full h-24 bg-gray-100/80 dark:bg-[#111827]/50 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center overflow-hidden opacity-70 hover:opacity-100 transition-opacity">
                    <Ad />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {!loading && !erro && <LoadingMore />}
        {modalAberto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">dynamic_feed</span>
                  Vagas Similares
                </h3>
                <button onClick={fecharModal} className="text-gray-400 hover:text-red-500 transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3">
                <p className="text-sm text-gray-500 mb-4">
                  Ocultamos as repetições para facilitar sua busca. Escolha a sua preferida para <strong>{tituloModal}</strong>:
                </p>

                {vagasDoModal.map((v, i) => {
                  // Descobre o ícone do modelo igual fazemos no card
                  const iconeModelo = (v.modelo || '').toLowerCase() === 'presencial' ? 'apartment' : 'computer';

                  return (
                    <div key={v.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary/50 bg-white dark:bg-gray-800 shadow-sm transition-all relative overflow-hidden gap-3">
  
  {/* Linha lateral de destaque para a vaga Principal */}
  <div className={`absolute top-0 left-0 w-1 h-full ${i === 0 ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}></div>

  <div className="flex flex-col pl-3 flex-1">
    <span className="font-bold text-sm text-gray-800 dark:text-gray-200">
      {v.titulo} {i === 0 && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded ml-2 uppercase">Principal</span>}
    </span>
    
    {/* ✨ APENAS MODELO E DIA (Carregados do Context) ✨ */}
    <div className="flex flex-wrap items-center gap-2 mt-2">
      
      {/* Modelo (Presencial/Híbrido) */}
      <span className="text-[11px] font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-1.5 py-0.5 rounded flex items-center gap-1">
        <span className="material-symbols-outlined text-[12px]">{iconeModelo}</span>
        {v.modelo}
      </span>

      {/* Dia da Publicação (Formatado para pt-BR) */}
      {/* Dia da Publicação (Usando a função de Tempo Decorrido) */}
{v.dia && (
  <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded flex items-center gap-1">
    <span className="material-symbols-outlined text-[12px]">schedule</span>
    {formatarTempoDecorrido(v.dia)}
  </span>
)}
      
    </div>
  </div>
  
  <Link 
    to={`/vaga/${gerarSlug(v.titulo)}/${v.id}`} 
    className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors text-center whitespace-nowrap self-start sm:self-center ml-2"
  >
    Ver Vaga
  </Link>
</div>
                  );
                })}
              </div>

            </div>
          </div>
        )}

      </main>
      <Footer />
    </>
  );
}

export default Home;