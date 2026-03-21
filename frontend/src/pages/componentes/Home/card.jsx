export default function Card({ 
  id = 1, 
  nome_site = 'default', 
  titulo = 'Não encontrado', 
  icone_modelo = 'apartment',
  link = 'https://google.com',
  modelo = 'Presencial', 
  cliques = 0, 
  dia = 'Hoje' 
}) {

  {/* Função que avisa a API que alguém clicou! */}

  const registrarClique = () => {
    fetch(`https://estagio-vagas-node.onrender.com/api/vagas/${id}/clique`, {
      method: 'POST'
    }).catch(err => console.error("Erro ao computar clique:", err));
  };

  {/* Função que Convete a Data no banco de dados */}

  function formatarTempoDecorrido(dataBanco) {
  // 1. Converte a data do banco (UTC) para o formato que o JS entende
  const dataVaga = new Date(dataBanco);
  const dataAtual = new Date();

  // 2. Calcula a diferença em milissegundos
  const diferencaMs = dataAtual - dataVaga;

  // 3. Converte milissegundos para horas e dias
  const diferencaHoras = Math.floor(diferencaMs / (1000 * 60 * 60));
  const diferencaDias = Math.floor(diferencaMs / (1000 * 60 * 60 * 24));

  // 4. Aplica a sua regra de negócio
  if (diferencaHoras < 24) {
    if (diferencaHoras === 0) {
      return 'Agora mesmo'; // Para vagas com menos de 1 hora
    }
    return `${diferencaHoras} hora${diferencaHoras > 1 ? 's' : ''} atrás`;
  } 
  
  if (diferencaDias < 3) {
    return `${diferencaDias} dia${diferencaDias > 1 ? 's' : ''} atrás`;
  } 
  
  // Se for 3 dias ou mais, mostra no formato DD/MM/YYYY
  return dataVaga.toLocaleDateString('pt-BR');
}

// 3. A NOVA Função que descobre a plataforma baseada no link
  const identificarPlataforma = (linkVaga) => {
    if (!linkVaga) return 'site';
    const url = linkVaga.toLowerCase();
    
    if (url.includes('gupy.io')) return 'gupy';
    if (url.includes('indeed.com')) return 'indeed';
    if (url.includes('linkedin.com')) return 'linkedin';
    if (url.includes('infojobs.com.br')) return 'infojobs';
    if (url.includes('catho.com.br')) return 'catho';
    
    return 'site';
  };

  // 4. Executamos a função para descobrir qual logo carregar!
  const plataforma = identificarPlataforma(link);

  const icone_calculado = modelo.toLowerCase() === 'presencial' ? 'apartment' : 'computer';

  return (
    <a 
      href={`${link}`} 
      target="_blank" 
      rel="nofollow noopener noreferrer" 
      className="block h-full"
      onClick={registrarClique} 
    >
    <article className="bg-card-light dark:bg-card-dark p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all group flex flex-col h-full relative overflow-hidden">
      
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <img 
            className="size-12 rounded-lg object-cover bg-gray-50" 
            src={`src/assets/img/${plataforma}.jpg`} 
            alt={`Logo da vaga ${titulo}`}
          />
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors text-lg leading-tight">
              {titulo}
            </h4>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">
          <span className="material-symbols-outlined text-[14px]">location_on</span>
          Fortaleza, CE
        </span>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-green-50 dark:bg-green-900/30 text-xs font-medium text-green-600 dark:text-green-300">
          <span className="material-symbols-outlined text-[14px]">{icone_calculado}</span>
          {modelo}
        </span>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">
          <span className="material-symbols-outlined text-[14px]"></span>
          💼 Estágio
        </span>
        
        <br />
        
        <div className="w-full flex items-center gap-1 mt-2 text-gray-500 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18" fill="currentColor">
            <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"></path>
          </svg>
          <span>{cliques}</span>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700/50">
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">schedule</span>
          {formatarTempoDecorrido(dia)}
        </span>
        <a 
          href={`${link}`} 
          target="_blank" 
          rel="nofollow noopener noreferrer" 
          className="text-sm font-bold text-primary hover:text-primary/80 dark:hover:text-teal-400 transition-colors"
        >
          Candidatar-se
        </a>
      </div>

      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
    </article>
    </a>
  );
}
