import { createClient } from '@supabase/supabase-js'

// Pegando as variáveis do Netlify
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Criando o cliente do Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
