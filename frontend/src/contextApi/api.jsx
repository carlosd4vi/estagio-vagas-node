import React, { createContext, useState, useEffect, useRef } from 'react';

export const ContextApi = createContext();

export function Api({ children }) {

 // Guardamos as vagas, o estado de loading, e o estado de erro

  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);

  // Guardamos a página atual, quantos cliques no botão "Carregar Mais" já tivemos, 
  // a ordem atual e o termo de busca atual
  
  const [pagina, setPagina] = useState(0);
  const [cliquesBotao, setCliquesBotao] = useState(0);
  const [ordemAtual, setOrdemAtual] = useState('recent');
  const [buscaAtual, setBuscaAtual] = useState('');
  
  // Criamos um cache para as vagas, usando useRef para manter o mesmo objeto entre renders

  const cacheVagas = useRef({});

  // Função para buscar vagas, que aceita parâmetros para ordem, se deve resetar a lista, e o termo de busca

  const buscarVagas = async (ordem = ordemAtual, resetar = true, termoBusca = buscaAtual) => {
    if (resetar) {
      setLoading(true);
      setErro(false);
      setPagina(0); 
      setCliquesBotao(0); 
      setOrdemAtual(ordem);
      setBuscaAtual(termoBusca);
    }

    // Construímos a URL da API com os parâmetros de ordem, página e busca, e verificamos se já temos os dados no cache
    
    try {
      const paginaParaBuscar = resetar ? 0 : pagina + 1;
      const url = `${import.meta.env.VITE_URL_API}/api/vagas?ordem=${ordem}&page=${paginaParaBuscar}&busca=${encodeURIComponent(termoBusca)}`;
      
      if (cacheVagas.current[url]) {
        if (resetar) {
          setVagas(cacheVagas.current[url]);
        } else {
          setVagas((vagasAntigas) => {
            const novas = cacheVagas.current[url].filter(vNova => 
              !vagasAntigas.some(vAntiga => vAntiga.id === vNova.id)
            );
            return [...vagasAntigas, ...novas];
          });
          setPagina(paginaParaBuscar);
        }
        if (resetar) setLoading(false);
        return; 
      }

      const response = await fetch(url, {
        headers: { 'x-api-key': import.meta.env.VITE_API_KEY }
      });

      // Se a resposta da API não for 200 OK, forçamos um erro para cair no catch
      if (!response.ok) {
        throw new Error("Falha na requisição da API");
      }

      const data = await response.json();
      
      cacheVagas.current[url] = data;

      // Se resetar, substituímos as vagas; se não, 
      // adicionamos as novas vagas à lista existente, garantindo que não haja duplicatas
      
      if (resetar) {
        setVagas(data);
      } else {
        setVagas((vagasAntigas) => {
          const novas = data.filter(vNova => 
            !vagasAntigas.some(vAntiga => vAntiga.id === vNova.id)
          );
          return [...vagasAntigas, ...novas];
        }); 
        setPagina(paginaParaBuscar);
      }
    } catch (error) {
      console.error("Erro ao buscar vagas:", error);
      setErro(true);
    } finally {
      if (resetar) setLoading(false);
    }
  };

  const carregarMaisVagas = async () => {
    if (cliquesBotao < 5) { 
      setCliquesBotao((prev) => prev + 1);
      await buscarVagas(ordemAtual, false, buscaAtual); 
    }
  };

  useEffect(() => {
    const urlAtual = window.location.pathname;

    // ✨ AGORA SIM! 100% BLINDADO ✨
    // Só bloqueia se a URL realmente começar com /login ou /dashboard
    if (urlAtual.startsWith('/login') || urlAtual.startsWith('/dashboard')) {
      return; 
    }

    // Segue o fluxo normal e busca as vagas pro estudante ver:
    buscarVagas(); 
    
  }, [ordemAtual, cliquesBotao]);

  return (
    <ContextApi.Provider value={{ vagas, loading, erro, buscarVagas, carregarMaisVagas, cliquesBotao, ordemAtual }}>
      {children}
    </ContextApi.Provider>
  );
}