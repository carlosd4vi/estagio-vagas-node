import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../../script/supabase'; 

const CriarVaga = () => {
  const navigate = useNavigate();
  // NOVO: Olheiro de Bagagem (useLocation)
  const location = useLocation();

  // Estados do formulário
  const [titulo, setTitulo] = useState('');
  const [modelo, setModelo] = useState('Presencial');
  const [link, setLink] = useState('');
  
  // NOVO: Estado que guarda o ID se for uma edição (nulo se for vaga nova)
  const [idEdicao, setIdEdicao] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState(false);

  // 1. O SEGURANÇA DA PORTA E LEITOR DE BAGAGEM
  useEffect(() => {
    const verificarAcesso = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      }
    };
    verificarAcesso();

// MÁGICA: Se o cara veio da tela de Editar, a bagagem vai ter 'vagaParaEditar'
    if (location.state && location.state.vagaParaEditar) {
      const vaga = location.state.vagaParaEditar;
      setTitulo(vaga.titulo);
      setLink(vaga.link);
      setIdEdicao(vaga.id); // Guardamos o ID para saber que é um Update!

      // O TRADUTOR DO MODELO DE TRABALHO:
      // Garantimos que a string vai bater perfeitamente com os "values" das <options>
      const modeloBanco = (vaga.modelo || '').toLowerCase();
      
      if (modeloBanco.includes('híbrido') || modeloBanco.includes('hibrido')) {
        setModelo('Híbrido');
      } else if (modeloBanco.includes('home') || modeloBanco.includes('remoto')) {
        setModelo('Home Office');
      } else {
        setModelo('Presencial');
      }

    } else {
      // Se não veio com bagagem, garante que a tela tá limpa
      setIdEdicao(null);
      setTitulo('');
      setModelo('Presencial');
      setLink('');
    }
  }, [navigate, location.state]);

  // 2. FUNÇÃO INTELIGENTE DE SALVAR OU ATUALIZAR
  const handlePublicar = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMensagemSucesso(false); 
    
    try {
      if (idEdicao) {
        // MODO EDIÇÃO (Update)
        const { error } = await supabase
          .from('vagas_info')
          .update({ 
            titulo: titulo, 
            modelo: modelo, 
            link: link 
          })
          .eq('id', idEdicao); // ONDE o id for igual ao que estamos editando

        if (error) throw error;
        setMensagemSucesso("Vaga atualizada com sucesso! 🎉");
        
        // Se quiser que ele volte pra tela de lista após editar:
        // setTimeout(() => navigate('/dashboard/editar'), 1500);

      } else {
        // MODO NOVA VAGA (Insert)
        const { error } = await supabase
          .from('vagas_info')
          .insert([
            { 
              titulo: titulo, 
              modelo: modelo, 
              link: link,
              cliques: 0 
            }
          ]);

        if (error) throw error; 
        setMensagemSucesso("Vaga publicada com sucesso! 🎉");
        
        // Limpa a tela só se for vaga nova
        setTitulo('');
        setModelo('Presencial');
        setLink('');
      }

      // Esconde a mensagem de sucesso depois de 3 segundos
      setTimeout(() => {
        setMensagemSucesso(false);
      }, 3000);

    } catch (error) {
      console.error("Erro ao salvar vaga:", error.message);
      alert("Erro ao salvar a vaga. Verifique o console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSair = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Variáveis para trocar os textos da tela dinamicamente
  const isEditando = idEdicao !== null;
  const textoBotaoPrincipal = isEditando ? "Salvar Alterações" : "Publicar Vaga";

  return (
    <main className="flex-grow flex flex-col items-center justify-start pt-10 pb-20 px-4 sm:px-6">
      
      {/* Abas de Navegação */}
      <div className="w-full max-w-2xl mb-6">
        <nav aria-label="Tabs" className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1 shadow-inner">
          <Link 
            to="/dashboard" 
            className="flex items-center justify-center gap-2 w-full rounded-lg bg-white dark:bg-surface-dark shadow-sm py-2.5 text-sm font-bold text-primary dark:text-primary ring-1 ring-black/5 dark:ring-white/10 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            {isEditando ? 'Voltar' : 'Criar Vaga'} 
          </Link>
          <Link 
            to="/dashboard/editar" 
            className="flex items-center justify-center gap-2 w-full rounded-lg py-2.5 text-sm font-medium text-text-secondary dark:text-gray-400 hover:text-text-main hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Editar
          </Link>
        </nav>
      </div>

      {/* Cartão do Formulário */}
      <div className="w-full max-w-2xl bg-surface-light dark:bg-surface-dark rounded-2xl shadow-soft border border-border-light dark:border-border-dark overflow-hidden">
        <div className="p-8 sm:p-10">
          
          <form className="space-y-8" onSubmit={handlePublicar}>
            
            {/* Input do Título */}
            <div className="group">
              <label className="block text-sm font-semibold text-text-main dark:text-gray-200 mb-2" htmlFor="job-title">
                Título
              </label>
              <div className="relative">
                <input 
                  id="job-title" 
                  type="text"
                  required
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex: Desenvolvedor Front-end Júnior" 
                  className="block w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-main dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3 px-4 transition-all placeholder:text-gray-400 outline-none" 
                />
              </div>
              <p className="mt-1.5 text-xs text-text-secondary dark:text-gray-500">Seja específico. Títulos como "Dev" são muito genéricos.</p>
            </div>

            {/* Select do Modelo de Trabalho */}
            <div className="group">
              <label className="block text-sm font-semibold text-text-main dark:text-gray-200 mb-2" htmlFor="work-model">
                Modelo
              </label>
              <div className="relative">
                <select 
                  id="work-model"
                  value={modelo}
                  onChange={(e) => setModelo(e.target.value)}
                  className="block w-full appearance-none rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-main dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3 pl-4 pr-10 transition-all cursor-pointer outline-none"
                >
                  <option value="Presencial">Presencial</option>
                  <option value="Híbrido">Híbrido</option>
                  <option value="Home Office">Home Office (Remoto)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[24px]">arrow_drop_down</span>
                </div>
              </div>
            </div>

            {/* Input do Link */}
            <div className="group">
              <label className="block text-sm font-semibold text-text-main dark:text-gray-200 mb-2" htmlFor="job-link">
                Link da vaga
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="text-gray-400 sm:text-sm material-symbols-outlined text-[18px]">link</span>
                </div>
                <input 
                  id="job-link" 
                  name="job-link" 
                  type="url"
                  required
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://exemplo.com/vaga/123" 
                  className="block w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-main dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3 pl-11 pr-4 transition-all placeholder:text-gray-400 outline-none" 
                />
              </div>
            </div>

            {/* Divisor e Botões */}
            <div className="border-t border-border-light dark:border-border-dark pt-6 mt-8">
              <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                <button 
                  type="button" 
                  onClick={handleSair}
                  className="w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-lg border border-transparent px-6 py-3 text-sm font-semibold text-text-secondary hover:text-text-main hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                  Sair
                </button>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-lg bg-primary px-8 py-3 text-sm font-bold text-white shadow-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-surface-dark transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span>{isSubmitting ? 'Salvando...' : textoBotaoPrincipal}</span>
                  {!isSubmitting && <span className="material-symbols-outlined text-[20px]">send</span>}
                </button>
              </div>

              {/* Mensagem de Sucesso Condicional */}
              {mensagemSucesso && (
                <div className="mt-4 flex items-center justify-end text-green-600 dark:text-green-400 text-sm font-bold animate-pulse">
                  <span className="material-symbols-outlined text-[18px] mr-1">check_circle</span>
                  {mensagemSucesso}
                </div>
              )}

            </div>
          </form>

        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-text-secondary dark:text-gray-500">
         Todos os direitos reservados 2025 - 2026
        </p>
      </div>

    </main>
  );
};

export default CriarVaga;