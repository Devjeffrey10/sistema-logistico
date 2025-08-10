-- ========================================
-- SCRIPT FINAL CORRIGIDO - SISTEMA LOGISTICO
-- Este script verifica e ajusta a estrutura da tabela
-- ========================================

-- 1. Primeiro, vamos verificar se a tabela users já existe
DO $$ 
BEGIN
    -- Se a tabela não existir, criar do zero
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
        CREATE TABLE users (
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
        RAISE NOTICE 'Tabela users criada do zero';
    ELSE
        RAISE NOTICE 'Tabela users já existe, verificando colunas...';
    END IF;
END $$;

-- 2. Adicionar colunas que possam estar faltando
ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) CHECK (role IN ('admin', 'operator', 'viewer'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- 3. Criar índices para performance (só se não existirem)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- 4. Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Remover trigger se existir e criar novamente
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Habilitar Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 7. Remover política se existir e criar novamente
DROP POLICY IF EXISTS "Allow all operations on users" ON users;
CREATE POLICY "Allow all operations on users" ON users
  FOR ALL USING (true) WITH CHECK (true);

-- 8. Limpar dados existentes que possam estar incompletos
DELETE FROM users WHERE password IS NULL OR password = '';

-- 9. Inserir usuário administrador padrão
INSERT INTO users (name, email, password, role, phone, status)
VALUES (
  'Administrador Sistema',
  'admin@sistema.com',
  '123456',
  'admin',
  '(11) 99999-9999',
  'active'
) ON CONFLICT (email) 
DO UPDATE SET 
  password = EXCLUDED.password,
  role = EXCLUDED.role,
  phone = EXCLUDED.phone,
  status = EXCLUDED.status;

-- 10. Inserir seu usuário específico
INSERT INTO users (name, email, password, role, phone, status)
VALUES (
  'Jefferson',
  'professorjeffersoninfor@gmail.com',
  'jeff123',
  'admin',
  '(11) 99999-9999',
  'active'
) ON CONFLICT (email) 
DO UPDATE SET 
  password = EXCLUDED.password,
  role = EXCLUDED.role,
  phone = EXCLUDED.phone,
  status = EXCLUDED.status;

-- 11. Verificar se tudo foi criado corretamente
SELECT 'Configuração FINAL completada com sucesso!' as status;
SELECT COUNT(*) as total_usuarios FROM users;
SELECT email, role, status, created_at FROM users WHERE password IS NOT NULL ORDER BY created_at;
