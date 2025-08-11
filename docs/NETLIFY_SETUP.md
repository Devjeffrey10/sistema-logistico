# 🚀 Configuração Netlify + Supabase

Este documento contém todas as instruções para configurar e fazer deploy do TransporteManager no Netlify com integração Supabase.

## 📋 Pré-requisitos

- Conta no [Netlify](https://netlify.com)
- Conta no [Supabase](https://supabase.com)
- Projeto Supabase criado com URL: `https://yqirewbwerkhpgetzrmg.supabase.co`

## 🔧 Configuração das Variáveis de Ambiente

### 1. No Netlify Dashboard

Acesse **Site Settings → Environment Variables** e adicione:

```env
# Variáveis para o Frontend (VITE_*)
VITE_SUPABASE_URL=https://yqirewbwerkhpgetzrmg.supabase.co
VITE_SUPABASE_ANON_KEY=[sua-chave-publica-aqui]

# Variáveis para o Backend/Functions
SUPABASE_URL=https://yqirewbwerkhpgetzrmg.supabase.co
SUPABASE_ANON_KEY=[sua-chave-publica-aqui]
SUPABASE_SERVICE_KEY=[sua-chave-de-servico-aqui]
```

### 2. Como encontrar as chaves do Supabase

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Settings → API**
4. Copie:
   - **anon/public key** → Use para `VITE_SUPABASE_ANON_KEY` e `SUPABASE_ANON_KEY`
   - **service_role key** → Use para `SUPABASE_SERVICE_KEY` (⚠️ **NUNCA** exponha esta chave no frontend)

## 🗄️ Configuração do Banco de Dados

### Tabela de Usuários

Execute este SQL no Supabase SQL Editor:

```sql
-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS public.usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  nome VARCHAR(255) NOT NULL,
  função VARCHAR(50) NOT NULL CHECK (função IN ('admin', 'operator', 'viewer')),
  telefone VARCHAR(20),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_login TIMESTAMP WITH TIME ZONE
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura para usuários autenticados
CREATE POLICY "Enable read access for authenticated users" ON public.usuarios
FOR SELECT USING (auth.role() = 'authenticated');

-- Política para permitir inserção para usuários admin
CREATE POLICY "Enable insert for admin users" ON public.usuarios
FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Política para permitir atualização para usuários admin
CREATE POLICY "Enable update for admin users" ON public.usuarios
FOR UPDATE USING (auth.role() = 'service_role');

-- Inserir usuário admin padrão
INSERT INTO public.usuarios (id, email, nome, função, telefone, status)
VALUES (
  gen_random_uuid(),
  'admin@transportadora.com',
  'Admin User',
  'admin',
  '(11) 99999-9999',
  'active'
) ON CONFLICT (email) DO NOTHING;
```

### Configuração de Autenticação

1. No Supabase Dashboard, vá em **Authentication → Settings**
2. Configure os **Site URLs**:
   - **Site URL**: `https://seu-site.netlify.app`
   - **Redirect URLs**: 
     - `https://seu-site.netlify.app/**`
     - `http://localhost:8080/**` (para desenvolvimento)

3. Habilite os provedores de autenticação desejados (Email, Google, etc.)

## 📦 Deploy no Netlify

### 1. Via Netlify CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### 2. Via Git (Recomendado)

1. Conecte seu repositório GitHub ao Netlify
2. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/spa`
   - **Functions directory**: `netlify/functions`

### 3. Configurações Automáticas

O arquivo `netlify.toml` já está configurado com:

```toml
[build]
  command = "npm run build:client"
  functions = "netlify/functions"
  publish = "dist/spa"

[functions]
  external_node_modules = ["express"]
  node_bundler = "esbuild"
  
[[redirects]]
  force = true
  from = "/api/*"
  status = 200
  to = "/.netlify/functions/api/:splat"
```

## 🔄 Configuração de CI/CD

### GitHub Actions (Opcional)

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Netlify
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2.0
        with:
          publish-dir: './dist/spa'
          production-branch: main
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🧪 Testes

### Teste Local

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente localmente
# Crie um arquivo .env.local com as variáveis

# Executar em modo desenvolvimento
npm run dev

# Teste o build de produção
npm run build
npm run start
```

### Teste de Deploy

```bash
# Deploy de teste
netlify deploy

# Deploy de produção
netlify deploy --prod
```

## 🔐 Segurança

### Variáveis de Ambiente

- ✅ **VITE_SUPABASE_URL**: Pode ser pública
- ✅ **VITE_SUPABASE_ANON_KEY**: Pode ser pública (limitada por RLS)
- ⚠️ **SUPABASE_SERVICE_KEY**: **NUNCA** exponha no frontend

### Row Level Security (RLS)

O RLS está habilitado para proteger os dados. As políticas garantem que:

- Apenas usuários autenticados podem ler dados
- Apenas operações do servidor (service_role) podem modificar dados
- Os dados são isolados por contexto de autenticação

## 🚨 Troubleshooting

### Erro de CORS

Se encontrar erros de CORS, verifique:

1. URLs de redirect configuradas no Supabase
2. Variáveis de ambiente corretas
3. Configuração do `netlify.toml`

### Erro de Autenticação

1. Verifique se as chaves estão corretas
2. Confirme se o RLS está configurado
3. Teste a conectividade com o Supabase

### Build Falha

1. Verifique se todas as dependências estão instaladas
2. Confirme se as variáveis de ambiente estão configuradas
3. Teste o build localmente primeiro

### Functions Não Funcionam

1. Verifique se o `netlify.toml` está configurado
2. Confirme se as redirects estão corretas
3. Teste as functions localmente com `netlify dev`

## 📞 Suporte

Para problemas específicos:

1. **Netlify**: [Netlify Support](https://www.netlify.com/support/)
2. **Supabase**: [Supabase Support](https://supabase.com/support)
3. **Documentação**: 
   - [Netlify Docs](https://docs.netlify.com/)
   - [Supabase Docs](https://supabase.com/docs)

## 🔄 Próximos Passos

Após o deploy bem-sucedido:

1. ✅ Teste todas as funcionalidades
2. ✅ Configure monitoramento (Netlify Analytics)
3. ✅ Configure domínio customizado (opcional)
4. ✅ Configure SSL (automático no Netlify)
5. ✅ Configure branch deploys para staging
6. ✅ Configure webhook para deploy automático
