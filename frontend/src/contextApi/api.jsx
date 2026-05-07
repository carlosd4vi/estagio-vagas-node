import React, { createContext, useState, useEffect } from 'react';
import { vagasEstaticas } from '../dados/VagaStatic'; // Suas vagas de mentira/salvas

export const ContextApi = createContext();

export function Api({ children }) {
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [ordemAtual, setOrdemAtual] = useState('recent');
  const [buscaAtual, setBuscaAtual] = useState('');
  
  // Controle de Paginação Local
  const vagasPorPagina = 9; // Quantas vagas mostra por vez
  const [pagina, setPagina] = useState(1);
  
  // ✨ A TRAVA DO FIM DA LINHA ✨
  const [temMaisVagas, setTemMaisVagas] = useState(true);

  const buscarVagas = () => {
    setLoading(true);
    setPagina(1);
    
    setTimeout(() => {
      // Pega apenas as primeiras 9 vagas do seu arquivo estático
      const vagasIniciais = vagasEstaticas.slice(0, vagasPorPagina);
      setVagas(vagasIniciais);
      
      // Verifica se o arquivo tem mais de 9 vagas
      setTemMaisVagas(vagasEstaticas.length > vagasPorPagina);
      setLoading(false);
    }, 600); // Simulando o tempo de internet para o recrutador ver o Loading
  };

  const carregarMaisVagas = () => {
    const proximaPagina = pagina + 1;
    const startIndex = pagina * vagasPorPagina;
    const endIndex = startIndex + vagasPorPagina;
    
    // Pega as próximas 9 vagas
    const novasVagas = vagasEstaticas.slice(startIndex, endIndex);
    
    setVagas(vagasAntigas => [...vagasAntigas, ...novasVagas]);
    setPagina(proximaPagina);
    
    // Se acabaram as vagas, o botão de "Carregar Mais" vai sumir
    if (endIndex >= vagasEstaticas.length) {
      setTemMaisVagas(false);
    }
  };

  useEffect(() => {
    const urlAtual = window.location.pathname;
    if (urlAtual.startsWith('/login') || urlAtual.startsWith('/dashboard')) {
      return; 
    }
    buscarVagas(); 
  }, [ordemAtual]); // 👀 Sem o cliquesBotao aqui!

  return (
    <ContextApi.Provider value={{ vagas, loading, buscarVagas, carregarMaisVagas, ordemAtual, temMaisVagas }}>
      {children}
    </ContextApi.Provider>
  );
}