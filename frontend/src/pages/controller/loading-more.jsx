import React, { useContext, useState } from 'react';
import { ContextApi } from '../ContextApi/api'; // Ajuste o caminho!

const LoadingMore = () => {
  const { carregarMaisVagas, cliquesBotao } = useContext(ContextApi);
  const [isCarregando, setIsCarregando] = useState(false);

  // Se já clicou 5 vezes (atingiu o limite), esconde o botão!
  if (cliquesBotao >= 5) {
    return null; 
  }

  const handleCarregarMais = async () => {
    setIsCarregando(true); // Troca o texto do botão
    await carregarMaisVagas();
    setIsCarregando(false); // Volta o texto normal
  };

  return ( 
    <div className="mt-10 flex justify-center">
      <button 
        id="load-more" 
        onClick={handleCarregarMais}
        disabled={isCarregando} // Impede o usuário de clicar duas vezes rápido
        className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        {isCarregando ? 'Carregando...' : 'Carregar mais vagas'}
        <span className="material-symbols-outlined">
          {isCarregando ? 'hourglass_empty' : 'expand_more'}
        </span>
      </button>
    </div>
  );
}
 
export default LoadingMore;