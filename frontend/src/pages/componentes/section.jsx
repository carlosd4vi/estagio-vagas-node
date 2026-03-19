import React, { useState, useContext } from 'react';
import { ContextApi } from '../ContextApi/api'; // Verifique se o caminho está correto!

const Section = () => {
  const { buscarVagas, ordemAtual } = useContext(ContextApi);
  const [termo, setTermo] = useState('');

  // 1. Função que roda TODA VEZ que o usuário digita ou apaga uma letra
  const handleChange = (e) => {
    const textoDigitado = e.target.value;
    setTermo(textoDigitado);

    // MÁGICA 1: Se o usuário apagou tudo (BackSpace até o fim), traz as vagas de volta na hora!
    if (textoDigitado === '') {
      buscarVagas(ordemAtual, true, '');
    }
  };

  // 2. Função que roda quando clica no botão Buscar ou aperta Enter
  const handleSearch = (e) => {
    e.preventDefault(); 
    
    // MÁGICA 2: O .trim() remove os espaços acidentais do celular (ex: "Medicina " vira "Medicina")
    const termoLimpo = termo.trim();
    
    // Atualiza o visual pro usuário ver que o espaço sumiu
    setTermo(termoLimpo); 
    
    // Dispara a busca limpa!
    buscarVagas(ordemAtual, true, termoLimpo);
  };

  return ( 
    <section className="flex flex-col items-center justify-center mb-16 text-center space-y-8">
      <div className="w-full max-w-2xl">
        
        <form 
          onSubmit={handleSearch}
          className="flex flex-row items-center bg-white dark:bg-card-dark rounded-2xl shadow-soft dark:shadow-none border border-gray-100 dark:border-gray-700 p-2 gap-2 transition-all hover:shadow-lg focus-within:shadow-xl focus-within:ring-1 focus-within:ring-primary/20"
        >
          <div className="flex-1 flex items-center px-4 relative group/input">
            <span className="material-symbols-outlined text-gray-400 group-focus-within/input:text-primary transition-colors">
              search
            </span>
            <div className="ml-3 flex-1">
              
              <input 
                id="keyword" 
                name="cargo" 
                type="text" 
                // RETIRAMOS o 'required' para permitir limpar a busca
                placeholder="Digite seu cargo..." 
                value={termo}
                onChange={handleChange} // <-- Agora usamos a nossa função inteligente aqui
                className="w-full bg-transparent border-none p-0 text-base font-medium text-gray-900 dark:text-white placeholder-gray-300 focus:ring-0 leading-tight outline-none" 
              />
            </div>
          </div>
          <button 
            type="submit"
            className="h-14 w-14 md:w-32 rounded-xl bg-primary hover:bg-primary/80 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-all transform active:scale-[0.98]"
          >
            <span className="material-symbols-outlined md:hidden">search</span>
            <span className="hidden md:inline">Buscar</span>
          </button>
        </form>

      </div>
    </section> 
  );
}
 
export default Section;