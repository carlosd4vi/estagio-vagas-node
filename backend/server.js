const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const express = require('express');
const app = express()
const port = 3000
const cors = require('cors');
app.use(cors());

app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// LOGIN

app.get('/api/login', async (req, res) => {
  const { email, password } = req.query;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error('Erro de autenticação:', error.message);
    return res.status(401).json({ erro: 'Falha na autenticação', detalhes: error.message });
  }
  res.json(data);
});

// MOSTRAR VAGAS

app.get('/api/vagas', async (req, res) => { 
  try {
    const ordem = req.query.ordem || 'recent';
    const page = parseInt(req.query.page) || 0;
    const busca = req.query.busca || ''; 

    // MÁGICA: Tira os acentos da palavra que o usuário digitou no Frontend!
    // Ex: "informática" vira "informatica"
    const buscaSemAcento = busca.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const from = page * 9;
    const to = from + 8;

    // AGORA BUSCAMOS NA VIEW FANTASMA (vagas_busca)
    let query = supabase.from('vagas_busca').select('*');

    if (buscaSemAcento) {
      // Usamos o .ilike normal, mas olhando para a coluna que não tem acentos!
      query = query.ilike('titulo_limpo', `%${buscaSemAcento}%`);
    }

    if (ordem === 'most_viewed') {
      query = query.order('cliques', { ascending: false, nullsFirst: false });
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

// Rota para registrar um novo clique na vaga
app.post('/api/vagas/:id/clique', async (req, res) => {
  try {
    const vagaId = req.params.id;

    // 1. Busca os cliques atuais
    const { data: vaga, error: selectError } = await supabase
      .from('vagas_info')
      .select('cliques')
      .eq('id', vagaId)
      .single();

    if (selectError) throw selectError;

    // 2. A CORREÇÃO ESTÁ AQUI: Força a conversão para número matemático
    const cliquesAtuais = Number(vaga.cliques) || 0; 
    const novosCliques = cliquesAtuais + 1;

    // 3. Atualiza no banco
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
  console.log(`Exemplo de app rodando em http://localhost:${port}`)
})