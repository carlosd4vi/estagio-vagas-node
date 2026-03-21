import React, { createContext, useState, useEffect, useRef } from 'react';

export const ContextApi = createContext();

export function Api({ children }) {
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [pagina, setPagina] = useState(0);
  const [cliquesBotao, setCliquesBotao] = useState(0);
  const [ordemAtual, setOrdemAtual] = useState('recent');
  const [buscaAtual, setBuscaAtual] = useState(''); 

  // 1. CRIAMOS A GAVETA SECRETA DE CACHE
  // Ela vai guardar as coisas no formato: { "url_buscada": [array_de_vagas] }
  const cacheVagas = useRef({});

  const buscarVagas = async (ordem = ordemAtual, resetar = true, termoBusca = buscaAtual) => {
    if (resetar) {
      setLoading(true);
      setPagina(0); 
      setCliquesBotao(0); 
      setOrdemAtual(ordem);
      setBuscaAtual(termoBusca);
    }

    try {
      const paginaParaBuscar = resetar ? 0 : pagina + 1;
      //const url = `http://localhost:3000/api/vagas?ordem=${ordem}&page=${paginaParaBuscar}&busca=${encodeURIComponent(termoBusca)}`;
      const url = `https://estagio-vagas-node.onrender.com`
      
      // 2. O GUARDA DE TRÂNSITO DO CACHE
      if (cacheVagas.current[url]) {
        // Se já temos o resultado exato dessa URL guardado na gaveta...
        if (resetar) {
          setVagas(cacheVagas.current[url]);
        } else {
          setVagas((vagasAntigas) => [...vagasAntigas, ...cacheVagas.current[url]]);
          setPagina(paginaParaBuscar);
        }
        
        // Tiramos o loading e CANCELAMOS a execução da função aqui mesmo com o 'return'
        if (resetar) setLoading(false);
        return; 
      }

      // 3. SE NÃO TEM NO CACHE, VAMOS NA API
      // (Podemos tirar o { cache: 'no-store' } daqui, pois nós mesmos estamos controlando isso agora)
      const response = await fetch(url);
      const data = await response.json();
      
      // 4. SALVAMOS O RESULTADO NA GAVETA PARA A PRÓXIMA VEZ!
      cacheVagas.current[url] = data;
      
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
      await buscarVagas(ordemAtual, false, buscaAtual); 
    }
  };

  useEffect(() => {
    buscarVagas();
  }, []); 

  return (
    <ContextApi.Provider value={{ vagas, loading, buscarVagas, carregarMaisVagas, cliquesBotao, ordemAtual }}>
      {children}
    </ContextApi.Provider>
  );
}