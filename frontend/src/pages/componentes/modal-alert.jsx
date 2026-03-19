import React, { useState, useEffect } from 'react';

const ModalAlert = () => {
  // 1. Inicialização Preguiçosa: O React só faz essa matemática UMA VEZ de verdade.
  const [isVisible, setIsVisible] = useState(() => {
    try {
      const v = localStorage.getItem('mensagem');
      const vTime = localStorage.getItem('mensagem_time');
      const agora = new Date().getTime();
      const trinta_dias = 30 * 24 * 60 * 60 * 1000; 
      
      // Se já tem no Local Storage e está no prazo de 30 dias: Esconde
      if (v === 'true' && vTime && (agora - parseInt(vTime, 10)) < trinta_dias) {
        return false; 
      }
      // Se não tem (ou expirou): Mostra
      return true; 
    } catch (e) {
      console.error("Erro ao ler o localStorage:", e);
      return true;
    }
  });

  // 2. O useEffect agora só serve para GRAVAR no Local Storage, se o alerta estiver visível
  useEffect(() => {
    if (isVisible) {
      localStorage.setItem('mensagem', 'true');
      localStorage.setItem('mensagem_time', new Date().getTime().toString());
    }
  }, [isVisible]);

  // Se não estiver visível, não renderiza nada
  if (!isVisible) {
    return null;
  }

  // BÔNUS: Função para o usuário poder fechar o alerta manualmente na hora!
  const fecharAlerta = () => {
    setIsVisible(false);
  };

  return ( 
    <div id="alert-mensagem" className="relative w-full mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 dark:border-amber-600 rounded-lg shadow-sm">
      
      {/* Botão de Fechar (X) no canto superior direito */}
      <button 
        onClick={fecharAlerta}
        className="absolute top-3 right-3 text-amber-600/60 hover:text-amber-800 dark:text-amber-400/60 dark:hover:text-amber-300 transition-colors"
        aria-label="Fechar alerta"
      >
        <span className="material-symbols-outlined text-xl">close</span>
      </button>

      <div className="flex gap-4 pr-6"> {/* Adicionei pr-6 para o texto não encostar no botão de X */}
        <div className="flex-shrink-0">
          <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-2xl">warning</span>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-amber-800 dark:text-amber-300 mb-2">Atenção:</h3>
          <p className="text-amber-700 dark:text-amber-200 text-sm mb-3">
            Tenha muito cuidado com golpes, seja em pagamentos de taxas ou até mesmo em envio de documentos de forma antecipada (antes da entrevista).
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-200">
            Caso queira se proteger acesse o artigo: <a href="https://www.santander.com.br/blog/vagas-falsas-de-emprego" target="_blank" rel="noopener noreferrer nofollow" className="font-bold text-amber-800 dark:text-amber-300 hover:underline">Saiba Mais</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ModalAlert;