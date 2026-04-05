import React, { useEffect, useRef } from 'react';

export default function AdBanner() {
  const bannerRef = useRef(null);
  
  // 1. Mantém a verificação do localhost intacta
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  // 2. Verifica se existe uma sessão ativa (Ajuste a palavra 'token' para a chave que você usa no seu login)
  const hasSession = !!localStorage.getItem('sb-gwocynxaeyeabakxkutk-auth-token'); 

  // 3. O Modo Dev é ativado SE estiver no localhost OU SE o administrador estiver logado
  const isDevMode = isLocalhost || hasSession;

  useEffect(() => {
    // Agora o escudo bloqueia tanto o localhost quanto acessos logados na Vercel
    if (isDevMode) return;

    if (!bannerRef.current || bannerRef.current.querySelector('script')) return;

    const script = document.createElement('script');
    script.src = "https://pl29072061.profitablecpmratenetwork.com/a6c124d1c8473536f9b0d90ec8812c0e/invoke.js"; 
    script.async = true; 
    script.setAttribute('data-cfasync', 'false');

    bannerRef.current.appendChild(script);

  }, [isDevMode]);

  // O QUE APARECE PARA VOCÊ (No PC ou logado na Vercel)
  if (isDevMode) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-yellow-100/50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-500 rounded-xl border border-dashed border-yellow-300 dark:border-yellow-700">
        <span className="material-symbols-outlined mb-1">engineering</span>
        <span className="text-xs font-bold text-center px-4">
          Modo Dev: Anúncio Oculto <br/> 
          <span className="text-[10px] opacity-75">
            {isLocalhost ? '(Localhost)' : '(Sessão Ativa Detectada)'}
          </span>
        </span>
      </div>
    );
  }

  // O QUE APARECE PARA OS ESTUDANTES COMUNS (Vercel sem login)
  return (
    <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden">
      <div 
        id="container-a6c124d1c8473536f9b0d90ec8812c0e" 
        ref={bannerRef} 
        className="w-full flex justify-center"
      ></div>
    </div>
  );
}