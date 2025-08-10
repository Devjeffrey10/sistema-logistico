-- ========================================
-- SCRIPT PARA CONFIGURAR SUPABASE - SISTEMA LOGISTICO
-- Execute este script no SQL Editor do Supabase
-- ========================================

-- 1. Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'operator', 'viewer')),
  phone VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- 2. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- 3. Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 4. Habilitar Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 5. Criar política de acesso (permite todas as operações por enquanto)
-- Você pode restringir isso depois conforme necessário
CREATE POLICY "Allow all operations on users" ON users
  FOR ALL USING (true) WITH CHECK (true);

-- 6. Inserir usuário administrador padrão
INSERT INTO users (name, email, password, role, phone, status)
VALUES (
  'Administrador Sistema',
  'admin@sistema.com',
  '123456',
  'admin',
  '(11) 99999-9999',
  'active'
) ON CONFLICT (email) DO NOTHING;

-- 7. Inserir seu usuário específico
INSERT INTO users (name, email, password, role, phone, status)
VALUES (
  'Jefferson',
  'professorjeffersoninfor@gmail.com',
  'jeff123',
  'admin',
  '(11) 99999-9999',
  'active'
) ON CONFLICT (email) DO NOTHING;

-- ========================================
-- INSTRUÇÕES:
-- 1. Copie todo este script
-- 2. Acesse seu painel Supabase: https://supabase.com
-- 3. Vá em "SQL Editor"
-- 4. Cole e execute este script
-- 5. Verifique se a tabela foi criada em "Table Editor"
-- ========================================

-- Verificar se tudo foi criado corretamente
SELECT 'Tabela users criada com sucesso!' as status;
SELECT COUNT(*) as total_usuarios FROM users;
SELECT email, role, status FROM users;
