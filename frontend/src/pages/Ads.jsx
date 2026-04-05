import React, { useEffect, useRef } from 'react';

export default function AdBanner() {
  const bannerRef = useRef(null);
  
  // O nosso "Disjuntor": Verifica se estamos rodando no computador
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  useEffect(() => {
    if (isLocalhost) return;

    // Evita carregar o script duas vezes na mesma caixinha
    if (!bannerRef.current || bannerRef.current.querySelector('script')) return;

    // Criando a tag <script> que o Adsterra pediu
    const script = document.createElement('script');
    script.src = "https://pl29072061.profitablecpmratenetwork.com/a6c124d1c8473536f9b0d90ec8812c0e/invoke.js"; 
    script.async = true; 
    script.setAttribute('data-cfasync', 'false');

    // Injetando o script dentro do container
    bannerRef.current.appendChild(script);

  }, [isLocalhost]);

  // O QUE APARECE NA SUA TELA (DESENVOLVIMENTO)
  if (isLocalhost) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-yellow-100/50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-500 rounded-xl">
        <span className="material-symbols-outlined mb-1">engineering</span>
        <span className="text-xs font-bold text-center px-4">
          Modo Dev: Anúncio Oculto <br/> (Proteção Anti-Ban ativada)
        </span>
      </div>
    );
  }

  // O QUE APARECE NA VERCEL (PRODUÇÃO)
  return (
    <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* ATENÇÃO AQUI: Colocamos o ID exato que o Adsterra pediu na nossa div alvo! */}
      <div 
        id="container-a6c124d1c8473536f9b0d90ec8812c0e" 
        ref={bannerRef} 
        className="w-full flex justify-center"
      ></div>
    </div>
  );
}