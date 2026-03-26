import React, { useContext } from 'react';
import { ContextApi } from '../contextApi/api'; 

const Filter = () => {
  // 1. Puxamos a função de busca E a memória global 'ordemAtual' do Contexto!
  const { buscarVagas, ordemAtual } = useContext(ContextApi);
  
  // 2. Apagamos o useState local. Não precisamos mais dele!

  const handleOrderChange = (e) => {
    const valorSelecionado = e.target.value;
    
    // MÁGICA: Ao chamar o buscarVagas, o próprio ContextApi vai 
    // salvar a nova ordem no 'ordemAtual' e atualizar a tela sozinho!
    buscarVagas(valorSelecionado); 
  };

  return ( 
    <div className="w-full space-y-8">
      <div className="flex items-center justify-between mb-6">
        
        {/* Usamos a variável global do Contexto (ordemAtual) */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {ordemAtual === 'recent' ? 'Vagas mais recentes:' : 'Vagas mais vistas:'}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Ordenar por:</span>
          <select 
            id="order-select" 
            value={ordemAtual} // <--- Agora o Select obedece o Contexto!
            onChange={handleOrderChange}
            className="bg-transparent border-none text-gray-900 dark:text-white font-bold p-0 pr-6 focus:ring-0 cursor-pointer"
          >
            <option value="recent">Mais recentes</option>
            <option value="most_viewed">Mais vistos</option>
          </select>
        </div>
      </div>
    </div>
  );
}
 
export default Filter;