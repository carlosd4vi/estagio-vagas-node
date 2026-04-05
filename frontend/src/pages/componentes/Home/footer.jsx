import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return ( 
    <footer className="bg-white dark:bg-card-dark border-t border-gray-200 dark:border-gray-800 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Direitos Autorais */}
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">
          © 2025 - 2026 Estágio Fortaleza. Todos os direitos reservados.
        </p>

        {/* Links Institucionais (Obrigatórios para o AdSense) */}
        <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-gray-500 dark:text-gray-400">
          <Link to="/sobre-nos" className="hover:text-primary transition-colors">
            Sobre Nós
          </Link>
          <Link to="/politica-privacidade" className="hover:text-primary transition-colors">
            Privacidade
          </Link>
          <Link to="/termos-de-uso" className="hover:text-primary transition-colors">
            Termos de Uso
          </Link>
          <Link to="/contato" className="hover:text-primary transition-colors">
            Contato
          </Link>
        </div>

        {/* Redes Sociais */}
        <div className="flex gap-6">
          <a 
            className="text-gray-400 hover:text-primary transition-colors" 
            href="https://www.instagram.com/estagiofortaleza/" 
            target="_blank" 
            rel="nofollow noopener noreferrer"
          >
            <span className="sr-only">Instagram</span>
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" ariaHidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5"></rect>
              <circle cx="12" cy="12" r="3.5"></circle>
              <path d="M17.5 6.5h.01"></path>
            </svg>
          </a>
        </div>

      </div>
    </footer>
  );
}
 
export default Footer;