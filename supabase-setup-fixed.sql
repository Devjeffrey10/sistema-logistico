-- ========================================
-- SCRIPT CORRIGIDO PARA CONFIGURAR SUPABASE - SISTEMA LOGISTICO
-- Este script evita conflitos com objetos já existentes
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

-- 2. Criar índices para performance (só se não existirem)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- 3. Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. Remover trigger se existir e criar novamente
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 5. Habilitar Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 6. Remover política se existir e criar novamente
DROP POLICY IF EXISTS "Allow all operations on users" ON users;
CREATE POLICY "Allow all operations on users" ON users
  FOR ALL USING (true) WITH CHECK (true);

-- 7. Inserir usuário administrador padrão
INSERT INTO users (name, email, password, role, phone, status)
VALUES (
  'Administrador Sistema',
  'admin@sistema.com',
  '123456',
  'admin',
  '(11) 99999-9999',
  'active'
) ON CONFLICT (email) DO NOTHING;

-- 8. Inserir seu usuário específico
INSERT INTO users (name, email, password, role, phone, status)
VALUES (
  'Jefferson',
  'professorjeffersoninfor@gmail.com',
  'jeff123',
  'admin',
  '(11) 99999-9999',
  'active'
) ON CONFLICT (email) DO NOTHING;

-- 9. Verificar se tudo foi criado corretamente
SELECT 'Configuração completada com sucesso!' as status;
SELECT COUNT(*) as total_usuarios FROM users;
SELECT email, role, status, created_at FROM users ORDER BY created_at;
