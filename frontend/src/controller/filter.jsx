import React, { useContext, useState } from 'react';
import { ContextApi } from '../contextApi/api'; 

const Filter = () => {
  // 1. Em vez de puxar as vagas para ordenar na mão, puxamos a função de busca!
  const { buscarVagas } = useContext(ContextApi);
  
  // 2. Mantemos o estado apenas para trocar o título e a opção do <select>
  const [ordem, setOrdem] = useState('recent');

  // 3. A nova função enxuta:
  const handleOrderChange = (e) => {
    const valorSelecionado = e.target.value;
    
    // Atualiza o state visual (para o título mudar)
    setOrdem(valorSelecionado);

    // MÁGICA: Avisa a caixa d'água para esvaziar e buscar a água nova no backend!
    // Ele vai chamar: http://localhost:3000/api/vagas?ordem=most_viewed
    buscarVagas(valorSelecionado); 
  };

  return ( 
    <div className="w-full space-y-8">
      <div className="flex items-center justify-between mb-6">
        
        {/* O título continua dinâmico! */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {ordem === 'recent' ? 'Vagas mais recentes:' : 'Vagas mais vistas:'}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Ordenar por:</span>
          <select 
            id="order-select" 
            value={ordem}
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