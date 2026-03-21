// src/supabase.js
import { createClient } from '@supabase/supabase-js';

// Substitua pelos seus dados REAIS do painel do Supabase
const supabaseUrl = 'https://gwocynxaeyeabakxkutk.supabase.co';
const supabaseKey = 'sb_publishable_Vhojht--RBB3BThcZwIrSA_9NQn37t5';

export const supabase = createClient(supabaseUrl, supabaseKey);