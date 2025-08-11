-- =====================================================
-- CONFIGURAÇÃO COMPLETA DO SUPABASE
-- TransporteManager - Sistema de Gestão de Transportadora
-- =====================================================

-- Limpar tabelas existentes (se necessário)
DROP TABLE IF EXISTS public.usuarios CASCADE;

-- =====================================================
-- TABELA DE USUÁRIOS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  nome VARCHAR(255) NOT NULL,
  função VARCHAR(50) NOT NULL CHECK (função IN ('admin', 'operator', 'viewer')),
  telefone VARCHAR(20),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_login TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON public.usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_auth_user_id ON public.usuarios(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_status ON public.usuarios(status);
CREATE INDEX IF NOT EXISTS idx_usuarios_função ON public.usuarios(função);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS na tabela
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Limpar políticas existentes
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.usuarios;
DROP POLICY IF EXISTS "Enable insert for service role" ON public.usuarios;
DROP POLICY IF EXISTS "Enable update for own profile" ON public.usuarios;
DROP POLICY IF EXISTS "Enable update for admin users" ON public.usuarios;
DROP POLICY IF EXISTS "Enable delete for admin users" ON public.usuarios;

-- Política para leitura - usuários autenticados podem ver todos os usuários
CREATE POLICY "Enable read access for authenticated users" ON public.usuarios
FOR SELECT USING (
  auth.role() = 'authenticated' OR 
  auth.role() = 'service_role'
);

-- Política para inserção - apenas service_role pode criar usuários
CREATE POLICY "Enable insert for service role" ON public.usuarios
FOR INSERT WITH CHECK (
  auth.role() = 'service_role' OR
  (auth.role() = 'authenticated' AND auth.uid() IS NOT NULL)
);

-- Política para atualização - usuários podem atualizar próprio perfil
CREATE POLICY "Enable update for own profile" ON public.usuarios
FOR UPDATE USING (
  auth.uid() = auth_user_id OR
  auth.role() = 'service_role'
) WITH CHECK (
  auth.uid() = auth_user_id OR
  auth.role() = 'service_role'
);

-- Política para exclusão - apenas service_role pode deletar
CREATE POLICY "Enable delete for admin users" ON public.usuarios
FOR DELETE USING (
  auth.role() = 'service_role'
);

-- =====================================================
-- TRIGGERS E FUNÇÕES
-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_usuarios_updated_at ON public.usuarios;
CREATE TRIGGER update_usuarios_updated_at
    BEFORE UPDATE ON public.usuarios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Função para criar perfil de usuário automaticamente após registro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.usuarios (
    auth_user_id, 
    email, 
    nome, 
    função,
    status
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'operator'),
    'active'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- DADOS INICIAIS
-- =====================================================

-- Inserir usuário admin padrão (será criado via Auth se não existir)
-- O perfil será criado automaticamente pelo trigger acima

-- =====================================================
-- FUNÇÕES AUXILIARES
-- =====================================================

-- Função para buscar usuário por email
CREATE OR REPLACE FUNCTION get_user_by_email(user_email text)
RETURNS TABLE(
  id UUID,
  email VARCHAR,
  nome VARCHAR,
  função VARCHAR,
  telefone VARCHAR,
  status VARCHAR,
  created_at TIMESTAMPTZ,
  last_login TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.nome,
    u.função,
    u.telefone,
    u.status,
    u.created_at,
    u.last_login
  FROM public.usuarios u
  WHERE u.email = user_email AND u.status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para atualizar último login
CREATE OR REPLACE FUNCTION update_last_login(user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.usuarios 
  SET last_login = timezone('utc'::text, now())
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View para estatísticas de usuários
CREATE OR REPLACE VIEW user_stats AS
SELECT 
  função,
  status,
  COUNT(*) as total,
  COUNT(CASE WHEN last_login > now() - interval '30 days' THEN 1 END) as active_last_30_days
FROM public.usuarios
GROUP BY função, status;

-- =====================================================
-- COMENTÁRIOS NA TABELA
-- =====================================================

COMMENT ON TABLE public.usuarios IS 'Tabela de usuários do sistema TransporteManager';
COMMENT ON COLUMN public.usuarios.id IS 'Identificador único do usuário';
COMMENT ON COLUMN public.usuarios.email IS 'Email do usuário (único)';
COMMENT ON COLUMN public.usuarios.nome IS 'Nome completo do usuário';
COMMENT ON COLUMN public.usuarios.função IS 'Função do usuário: admin, operator, viewer';
COMMENT ON COLUMN public.usuarios.telefone IS 'Telefone de contato (opcional)';
COMMENT ON COLUMN public.usuarios.status IS 'Status: active, inactive';
COMMENT ON COLUMN public.usuarios.auth_user_id IS 'Referência ao usuário na tabela auth.users';
COMMENT ON COLUMN public.usuarios.created_at IS 'Data de criação do registro';
COMMENT ON COLUMN public.usuarios.last_login IS 'Data do último login';
COMMENT ON COLUMN public.usuarios.updated_at IS 'Data da última atualização';

-- =====================================================
-- CONFIGURAÇÕES DE SEGURANÇA ADICIONAIS
-- =====================================================

-- Remover acesso público direto às funções
REVOKE ALL ON FUNCTION update_last_login(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION get_user_by_email(text) FROM PUBLIC;

-- Conceder acesso apenas para authenticated e service_role
GRANT EXECUTE ON FUNCTION update_last_login(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_user_by_email(text) TO authenticated, service_role;

-- =====================================================
-- VERIFICAÇÕES FINAIS
-- =====================================================

-- Verificar se RLS está habilitado
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'usuarios';

-- Verificar políticas criadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'usuarios';

-- =====================================================
-- MENSAGEM DE SUCESSO
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Configuração do Supabase concluída com sucesso!';
  RAISE NOTICE '🔐 RLS habilitado e políticas de segurança configuradas';
  RAISE NOTICE '🚀 Sistema pronto para uso com autenticação Supabase';
  RAISE NOTICE '📧 Configurar autenticação por email nas configurações do projeto';
END $$;
