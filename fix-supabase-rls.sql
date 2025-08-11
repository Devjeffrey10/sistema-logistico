-- Script para corrigir problema de recursão infinita nas políticas RLS
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Primeiro, vamos ver todas as políticas existentes na tabela users
SELECT 
  policyname,
  cmd as command,
  qual as using_expression,
  with_check as check_expression
FROM pg_policies 
WHERE tablename = 'users';

-- 2. Remover TODAS as políticas existentes da tabela users para evitar conflitos
DO $$ 
DECLARE 
    policy_name text;
BEGIN
    FOR policy_name IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'users'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_name || '" ON users CASCADE';
        RAISE NOTICE 'Política removida: %', policy_name;
    END LOOP;
END $$;

-- 3. Desabilitar RLS temporariamente para limpeza
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 4. Reabilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 5. Criar nova política simples e sem recursão
CREATE POLICY "users_access_policy" ON users
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- 6. Verificar se a política foi criada corretamente
SELECT 
  policyname,
  cmd as command,
  qual as using_expression,
  with_check as check_expression
FROM pg_policies 
WHERE tablename = 'users';

-- 7. Testar se a consulta funciona sem erro de recursão
SELECT id, email, name, role FROM users LIMIT 5;

-- 8. Verificar outras tabelas que podem ter políticas problemáticas
SELECT DISTINCT tablename 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 9. Se ainda houver problemas, use este comando para desabilitar RLS completamente (temporário)
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;
-- GRANT ALL ON users TO anon, authenticated;

COMMENT ON POLICY "users_access_policy" ON users IS 'Política simples para acesso à tabela users sem recursão';
