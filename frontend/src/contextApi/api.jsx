import React, { createContext, useState, useEffect, useRef } from 'react';

export const ContextApi = createContext();

export function Api({ children }) {
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false); // ✨ NOVO: Estado para guardar o erro
  
  const [pagina, setPagina] = useState(0);
  const [cliquesBotao, setCliquesBotao] = useState(0);
  const [ordemAtual, setOrdemAtual] = useState('recent');
  const [buscaAtual, setBuscaAtual] = useState(''); 

  const cacheVagas = useRef({});

  const buscarVagas = async (ordem = ordemAtual, resetar = true, termoBusca = buscaAtual) => {
    if (resetar) {
      setLoading(true);
      setErro(false); // ✨ NOVO: Limpa o erro sempre que for tentar buscar de novo
      setPagina(0); 
      setCliquesBotao(0); 
      setOrdemAtual(ordem);
      setBuscaAtual(termoBusca);
    }
    
    try {
      const paginaParaBuscar = resetar ? 0 : pagina + 1;
      const url = `https://estagio-vagas-node.onrender.com/api/vagas?ordem=${ordem}&page=${paginaParaBuscar}&busca=${encodeURIComponent(termoBusca)}`;
      
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
      setErro(true); // ✨ NOVO: Se o código quebrar, avisa a tela que deu erro!
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
    buscarVagas();
  }, []); 

  return (
    // ✨ NOVO: Exportamos a variável "erro" no value do Provider para o Home poder usar
    <ContextApi.Provider value={{ vagas, loading, erro, buscarVagas, carregarMaisVagas, cliquesBotao, ordemAtual }}>
      {children}
    </ContextApi.Provider>
  );
}