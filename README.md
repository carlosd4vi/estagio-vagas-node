# 🌴 Estágio Fortaleza - Portal de Vagas

![Capa do Projeto](https://archive.org/download/print_21_03_26_19_17/print_21_03_26_19_17.PNG)

O **Estágio Fortaleza** é uma plataforma moderna e responsiva focada em conectar talentos a oportunidades de estágio e emprego (Presencial, Híbrido e Home Office). O sistema atende a dois públicos: candidatos em busca de vagas e recrutadores que precisam de um painel ágil para gerenciar seus anúncios.

## ✨ Funcionalidades

### Para o Candidato (Área Pública)
* **Busca Inteligente:** Pesquisa tolerante a falhas que ignora espaços extras, letras maiúsculas/minúsculas e acentuação (utilizando Views e `unaccent` no PostgreSQL).
* **Filtros Avançados:** Ordenação dinâmica por "Mais Recentes" ou "Mais Vistos".
* **Paginação Inteligente:** Botão "Carregar Mais" com limite de requisições para performance.
* **Identificação Automática de Plataforma:** O sistema lê o link da vaga e exibe automaticamente a logomarca da fonte (Gupy, LinkedIn, Indeed, Infojobs, Catho, etc.).
* **Contador de Cliques e Tempo:** Exibição em tempo real de quantas pessoas se interessaram pela vaga e cálculo de tempo amigável (ex: "Há 2 horas", "Há 3 dias").
* **Alerta Anti-Golpe:** Modal educativo de segurança com controle de exibição via `localStorage` (Cache de 30 dias).
* **Dark Mode:** Suporte nativo a tema claro e escuro.

### Para o Recrutador (Área Restrita / Dashboard)
* **Autenticação Segura:** Sistema de Login protegido com bloqueio de rotas (Route Guards).
* **CRUD Completo:** Criação, visualização, edição e exclusão de vagas em tempo real.
* **Preenchimento Automático:** Ao editar uma vaga, o formulário carrega os dados anteriores automaticamente, incluindo o tratamento rígido de campos `<select>`.
* **Feedback Visual:** Alertas de sucesso temporários sem travamento de tela (UX aprimorada).

## 🛠️ Tecnologias Utilizadas

**Frontend:**
* [React.js](https://reactjs.org/) - Biblioteca principal da interface.
* [React Router Dom](https://reactrouter.com/) - Gerenciamento de rotas e navegação SPA.
* [Tailwind CSS](https://tailwindcss.com/) - Estilização utilitária e responsividade.

**Backend & Banco de Dados:**
* [Supabase](https://supabase.com/) - Autenticação e Banco de Dados PostgreSQL.
* **RLS (Row Level Security):** Políticas de segurança aplicadas diretamente no banco de dados para proteger operações de `INSERT`, `UPDATE` e `DELETE`.
* **PostgreSQL Views:** Utilização de `Views` com a extensão `unaccent` para otimização do motor de busca.

## 🚀 Como executar o projeto localmente

### Pré-requisitos
* Node.js instalado na máquina.
* Uma conta no [Supabase](https://supabase.com/) com um projeto criado.

### Passo a passo

1. **Clone o repositório**
   ```bash
   git clone [https://github.com/carlosd4vi/estagio-fortaleza.git](https://github.com/carlosd4vi/estagio-fortaleza.git)
