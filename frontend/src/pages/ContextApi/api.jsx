import React, { createContext, useState, useEffect } from 'react';

export const ContextApi = createContext();

export function Api({ children }) {
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [pagina, setPagina] = useState(0);
  const [cliquesBotao, setCliquesBotao] = useState(0);
  
  // Nossas duas memórias vitais: a Ordem e a Busca
  const [ordemAtual, setOrdemAtual] = useState('recent');
  const [buscaAtual, setBuscaAtual] = useState(''); 

  // Adicionamos a termoBusca na função. Se não passarem nada, ela lembra da busca anterior.
  const buscarVagas = async (ordem = ordemAtual, resetar = true, termoBusca = buscaAtual) => {
    if (resetar) {
      setLoading(true);
      setPagina(0); 
      setCliquesBotao(0); 
      setOrdemAtual(ordem);
      setBuscaAtual(termoBusca); // Salva o que o cara digitou na memória global
    }

    try {
      const paginaParaBuscar = resetar ? 0 : pagina + 1;
      
      // O encodeURIComponent é para a URL não quebrar se o usuário digitar espaços ou acentos!
      const url = `http://localhost:3000/api/vagas?ordem=${ordem}&page=${paginaParaBuscar}&busca=${encodeURIComponent(termoBusca)}`;
      
      const response = await fetch(url, { cache: 'no-store' });
      const data = await response.json();
      
      if (resetar) {
        setVagas(data);
      } else {
        setVagas((vagasAntigas) => [...vagasAntigas, ...data]); 
        setPagina(paginaParaBuscar);
      }
    } catch (error) {
      console.error("Erro ao buscar vagas:", error);
    } finally {
      if (resetar) setLoading(false);
    }
  };

  const carregarMaisVagas = async () => {
    if (cliquesBotao < 5) { 
      setCliquesBotao((prev) => prev + 1);
      // O botão "carregar mais" usa as memórias que guardamos:
      await buscarVagas(ordemAtual, false, buscaAtual); 
    }
  };

  useEffect(() => {
    buscarVagas();
  }, []); 

  return (
    // Exportamos a 'ordemAtual' para o componente de Busca saber como ordenar
    <ContextApi.Provider value={{ vagas, loading, buscarVagas, carregarMaisVagas, cliquesBotao, ordemAtual }}>
      {children}
    </ContextApi.Provider>
  );
}