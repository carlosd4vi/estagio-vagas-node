import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../script/supabase';

import Header from "../pages/componentes/Dashboard/header";

// 🌟 1. A NOSSA SUPER GAVETA DE CACHE (Fora do componente)
// Ela vai guardar dados assim: { "": [todas as vagas], "react": [vagas de react] }
let cacheVagasAdmin = {};
let ultimaBuscaAdmin = ''; // Lembra o que estava escrito no input!

const Editar = () => {
  const navigate = useNavigate();
  
  // 2. Os states já iniciam puxando da memória global!
  const [busca, setBusca] = useState(ultimaBuscaAdmin);
  const [vagas, setVagas] = useState(cacheVagasAdmin[ultimaBuscaAdmin] || []);
  const [loading, setLoading] = useState(!cacheVagasAdmin[ultimaBuscaAdmin]);

  // Segurança da Porta e Busca Inicial
  useEffect(() => {
    const verificarAcessoEBuscar = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      
      // Só vai no banco se a gaveta da busca atual estiver vazia
      if (!cacheVagasAdmin[ultimaBuscaAdmin]) {
        buscarVagas(ultimaBuscaAdmin);
      }
    };
    
    verificarAcessoEBuscar();
  }, [navigate]);

  // 3. Função de Busca SUPER Inteligente
  const buscarVagas = async (termo = '') => {
    const termoTratado = termo.trim().toLowerCase(); // Padroniza o texto
    ultimaBuscaAdmin = termo; // Salva a nova palavra na memória global

    // Se a resposta dessa pesquisa já está no cache, usa ela e ACABA a função!
    if (cacheVagasAdmin[termoTratado]) {
      setVagas(cacheVagasAdmin[termoTratado]);
      setLoading(false);
      return; 
    }

    setLoading(true);
    try {
      let query = supabase.from('vagas_info').select('*').order('id', { ascending: false }).limit(9);
      
      if (termoTratado) {
        query = query.ilike('titulo', `%${termoTratado}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Salva o resultado no Dicionário para a próxima vez!
      cacheVagasAdmin[termoTratado] = data;
      setVagas(data);
    } catch (error) {
      console.error("Erro ao buscar vagas:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePesquisar = (e) => {
    e.preventDefault();
    buscarVagas(busca);
  };

  const handleIrParaEditar = (vaga) => {
    navigate('/dashboard', { state: { vagaParaEditar: vaga } });
  };

  // 4. Exclusão de Vagas (Limpando os fantasmas do Cache)
  const handleExcluir = async (id, titulo) => {
    if (window.confirm(`Tem certeza que deseja excluir a vaga:\n"${titulo}"?`)) {
      try {
        const { error } = await supabase.from('vagas_info').delete().eq('id', id);
        if (error) throw error;
        
        // Remove da tela atual
        const vagasAtualizadas = vagas.filter(v => v.id !== id);
        setVagas(vagasAtualizadas);
        
        // MÁGICA: Entra em todas as gavetas do cache e apaga essa vaga lá de dentro também!
        Object.keys(cacheVagasAdmin).forEach(termo => {
          cacheVagasAdmin[termo] = cacheVagasAdmin[termo].filter(v => v.id !== id);
        });

        alert("Vaga excluída com sucesso.");
      } catch (error) {
        console.error("Erro ao excluir:", error.message);
        alert("Erro ao excluir a vaga.");
      }
    }
  };

  const handleLimparAntigas = async () => {
    const hoje = new Date();
    const data15DiasAtras = new Date();
    data15DiasAtras.setDate(hoje.getDate() - 15);
    const inicioMesAtual = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const dataCorte = data15DiasAtras < inicioMesAtual ? data15DiasAtras : inicioMesAtual;

    const dataFormatada = dataCorte.toLocaleDateString('pt-BR');

    const confirmacao = window.confirm(
      `⚠️ ATENÇÃO: Limpeza Automática\n\nIsso apagará todas as vagas anteriores a ${dataFormatada}.\nVagas do mês atual não serão afetadas.\n\nDeseja continuar?`
    );

    if (!confirmacao) return;

    try {
      setLoading(true);
      const { count, error } = await supabase
        .from('vagas_info')
        .delete({ count: 'exact' })
        .lt('dia', dataCorte.toISOString());

      if (error) throw error;

      alert(`✅ Limpeza concluída! ${count || 0} vagas antigas foram excluídas.`);
      
      // Se fizemos uma limpeza gigante, o cache não serve mais. Apagamos tudo!
      cacheVagasAdmin = {}; 
      buscarVagas(busca); 
      
    } catch (error) {
      console.error("Erro ao limpar vagas antigas:", error.message);
      alert("Erro ao realizar a limpeza.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Header />
    <main className="flex-grow flex flex-col items-center justify-start pt-10 pb-20 px-4 sm:px-6">
      
      {/* Abas de Navegação */}
      <div className="w-full max-w-2xl mb-6">
        <nav aria-label="Tabs" className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1 shadow-inner">
          <Link 
            to="/dashboard" 
            className="flex items-center justify-center gap-2 w-full rounded-lg py-2.5 text-sm font-medium text-text-secondary dark:text-gray-400 hover:text-text-main hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Criar Vaga
          </Link>
          <Link 
            to="/dashboard/editar" 
            className="flex items-center justify-center gap-2 w-full rounded-lg bg-white dark:bg-surface-dark shadow-sm py-2.5 text-sm font-bold text-primary dark:text-primary ring-1 ring-black/5 dark:ring-white/10 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Editar
          </Link>
        </nav>
      </div>

      <div className="w-full max-w-2xl mb-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h2 className="text-2xl font-extrabold text-text-main dark:text-white">Gerenciar Vagas</h2>
          
          <button 
            onClick={handleLimparAntigas}
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/40 font-bold rounded-lg transition-colors text-sm shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
            Limpar Antigas
          </button>
        </div>
        
        <form onSubmit={handlePesquisar} className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </span>
            <input 
              type="text" 
              value={busca}
              onChange={(e) => {
                const valor = e.target.value;
                setBusca(valor);
                ultimaBuscaAdmin = valor; // Salva o que a pessoa tá digitando na memória
                if(valor === '') buscarVagas(''); // Se limpar o input, já traz tudo do cache
              }}
              placeholder="Buscar pelo título da vaga..." 
              className="block w-full pl-10 pr-4 py-3 rounded-lg border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-main dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm outline-none"
            />
          </div>
          <button 
            type="submit"
            className="px-6 py-3 bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-bold rounded-lg shadow-md transition-colors"
          >
            Buscar
          </button>
        </form>
      </div>

      <div className="w-full max-w-2xl space-y-4">
        
        {loading ? (
          <div className="text-center py-10 text-gray-500">Carregando vagas...</div>
        ) : vagas.length === 0 ? (
          <div className="text-center py-10 bg-surface-light dark:bg-surface-dark rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-gray-500">
            Nenhuma vaga encontrada.
          </div>
        ) : (
          vagas.map((vaga) => (
            <div key={vaga.id} className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-soft border border-border-light dark:border-border-dark p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-all hover:shadow-md hover:border-primary/30">
              <div>
                <h3 className="font-bold text-text-main dark:text-white text-lg leading-tight">{vaga.titulo}</h3>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-text-secondary dark:text-gray-400">
                  <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs font-medium">
                    <span className="material-symbols-outlined text-[14px]">
                      {vaga.modelo.toLowerCase() === 'presencial' ? 'apartment' : 'computer'}
                    </span> 
                    {vaga.modelo}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">visibility</span> {vaga.cliques || 0} cliques
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">schedule</span> 
                    {(() => {
                      const data = new Date(vaga.dia);
                      const dataFormatada = data.toLocaleDateString('pt-BR');
                      const horas = String(data.getHours()).padStart(2, '0');
                      const minutos = String(data.getMinutes()).padStart(2, '0');
                      return `${dataFormatada} - ${horas}h${minutos}m`;
                    })()}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 border-t sm:border-t-0 border-border-light dark:border-border-dark pt-4 sm:pt-0">
                <button 
                  onClick={() => handleIrParaEditar(vaga)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                  <span className="sm:hidden">Editar</span>
                </button>
                
                <button 
                  onClick={() => handleExcluir(vaga.id, vaga.titulo)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                  <span className="sm:hidden">Excluir</span>
                </button>
              </div>
            </div>
          ))
        )}

      </div>
    </main>
    </>
  );
};

export default Editar;