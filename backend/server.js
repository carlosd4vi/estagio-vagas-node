require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const rateLimit = require('express-rate-limit'); // IMPORT NOVO

const app = express();
const port = 3000;

app.use(express.json());

// 🛡️ MURALHA 1: CORS (Bloqueia sites de terceiros)
const dominiosPermitidos = [
  'http://localhost:5173', // Seu React local
  'https://estagiofortaleza.vercel.app' // Coloque o link do seu site hospedado aqui depois!
];

app.use(cors({
  origin: function (origin, callback) {
    // Permite se vier de um domínio aprovado ou se não tiver origem (ex: chamadas internas do servidor)
    if (!origin || dominiosPermitidos.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Acesso negado pelo CORS! 🛑'));
    }
  }
}));

// 🛡️ MURALHA 2: RATE LIMIT (Evita ataques de spam/robôs)
const limitadorGeral = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limita a 100 requisições por IP
  message: { erro: 'Você fez requisições demais.' }
});

const limitadorCliques = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // Limita a 5 cliques por minuto por IP
  message: { erro: 'Muitos cliques.' }
});

// Aplica o limitador geral em todas as rotas que começam com /api
app.use('/api', limitadorGeral);

// 🛡️ MURALHA 3: API KEY (Exige uma senha secreta para acessar os dados)
const verificarApiKey = (req, res, next) => {
  const chaveRecebida = req.headers['x-api-key'];
  // Pegamos a chave do .env, ou usamos uma padrão se esquecer de colocar
  const minhaChaveSecreta = process.env.API_SECRET_KEY;

  if (chaveRecebida === minhaChaveSecreta) {
    next(); // Senha correta, pode passar!
  } else {
    return res.status(401).json({ erro: 'Acesso não autorizado.' });
  }
};

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);


// ==========================================
// ROTAS DA API
// ==========================================

// LOGIN - ⚠️ CORREÇÃO SÊNIOR: Mudei de GET para POST!
app.post('/api/login', verificarApiKey, async (req, res) => {
  // Pegamos do req.body (seguro), e não do req.query (inseguro)
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error('Erro de autenticação:', error.message);
    return res.status(401).json({ erro: 'Falha na autenticação', detalhes: error.message });
  }
  res.json(data);
});


// MOSTRAR VAGAS - Protegida com a API Key
app.get('/api/vagas', verificarApiKey, async (req, res) => { 
  try {
    const ordem = req.query.ordem || 'recent';
    const page = parseInt(req.query.page) || 0;
    const busca = req.query.busca || ''; 

    const buscaSemAcento = busca.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const from = page * 9;
    const to = from + 8;

    let query = supabase.from('vagas_busca').select('*');

    if (buscaSemAcento) {
      query = query.ilike('titulo_limpo', `%${buscaSemAcento}%`);
    }

    if (ordem === 'most_viewed') {
      // Adicionamos um SEGUNDO .order() com o 'id' para ser o critério de desempate!
      query = query
        .order('cliques', { ascending: false, nullsFirst: false })
        .order('id', { ascending: false });
    } else {
      query = query.order('id', { ascending: false });
    }

    const { data, error } = await query.range(from, to);

    if (error) throw error;
    return res.json(data);

  } catch (err) {
    console.error('Erro no servidor:', err);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});


// Rota para registrar um novo clique na vaga - Protegida com Rate Limit Extra e API Key
app.post('/api/vagas/:id/clique', verificarApiKey, limitadorCliques, async (req, res) => {
  try {
    const vagaId = req.params.id;

    const { data: vaga, error: selectError } = await supabase
      .from('vagas_info')
      .select('cliques')
      .eq('id', vagaId)
      .single();

    if (selectError) throw selectError;

    const cliquesAtuais = Number(vaga.cliques) || 0; 
    const novosCliques = cliquesAtuais + 1;

    const { error: updateError } = await supabase
      .from('vagas_info')
      .update({ cliques: novosCliques })
      .eq('id', vagaId);

    if (updateError) throw updateError;

    return res.json({ sucesso: true, cliques: novosCliques });

  } catch (err) {
    console.error('Erro ao registrar clique:', err.message);
    return res.status(500).json({ erro: 'Falha ao registrar clique' });
  }
});

app.listen(port, () => {
  console.log(`🚀 API blindada rodando na porta ${port}`);
});