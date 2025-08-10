# 🚀 Deploy no Netlify - Sistema Logistico

## Configurações Automáticas

Este projeto está configurado para deploy automático no Netlify com as seguintes configurações:

### Build Settings

```
Build command: npm run build
Publish directory: dist/spa
Functions directory: netlify/functions
Node version: 18
```

### Variáveis de Ambiente Necessárias

Configure as seguintes variáveis de ambiente no painel do Netlify:

```
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxaXJld2J3ZXJraHBnZXR6cm1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MjI0NTAsImV4cCI6MjA3MDE5ODQ1MH0.L-Nj-PePVfh5_XrfCMqK_WNtRZeiKkQmVIomLRO-QF0
SUPABASE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxaXJld2J3ZXJraHBnZXR6cm1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MjI0NTAsImV4cCI6MjA3MDE5ODQ1MH0.L-Nj-PePVfh5_XrfCMqK_WNtRZeiKkQmVIomLRO-QF0
```

### 🔑 Credenciais de Login

Usuários disponíveis para teste:

- **admin@sistema.com** / senha: **123456**
- **professorjeffersoninfor@gmail.com** / senha: **jeff123**

## Passos para Deploy

### 1. Via GitHub (Recomendado)

1. **Push do código:**

   - Clique no botão "Push/Create/PR" no canto superior direito
   - Ou merge o PR existente: `Devjeffrey10/sistema-20log/pull/1`

2. **Conectar ao Netlify:**

   - Acesse [netlify.com](https://netlify.com)
   - Clique em "New site from Git"
   - Selecione GitHub e seu repositório: `Devjeffrey10/sistema-20log`
   - Branch: `mystic-haven`

3. **Configurações automáticas:**

   - O Netlify detectará automaticamente as configurações do `netlify.toml`
   - Build command: `npm run build`
   - Publish directory: `dist/spa`

4. **Variáveis de ambiente:**

   - Vá em Site settings > Environment variables
   - Adicione: `VITE_SUPABASE_ANON_KEY` com o valor fornecido acima

5. **Deploy:**
   - Clique em "Deploy site"
   - Aguarde o build completar (2-5 minutos)

### 2. Via Netlify CLI (Alternativo)

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login no Netlify
netlify login

# Deploy direto
netlify deploy --prod --dir=dist/spa
```

## Funcionalidades Incluídas

✅ **Frontend React + Vite**

- SPA routing configurado
- Interface responsiva
- Estados de loading
- Tratamento de erros

✅ **Backend Express via Netlify Functions**

- API endpoints em `/api/*`
- Serverless functions
- CORS configurado

✅ **Banco de Dados Supabase**

- ✅ Usuários (autenticação)
- ✅ Motoristas
- ✅ Veículos
- ✅ Fornecedores
- ✅ Entrada de Produtos
- ✅ Gestão de Combustível

✅ **Segurança e Performance**

- Headers de segurança
- Minificação de assets
- Compressão automática
- HTTPS por padrão

## URLs de Acesso

Após o deploy, você receberá uma URL como:

- **Produção:** `https://your-app-name.netlify.app`
- **Preview:** URLs temporárias para cada deploy

## Monitoramento

- **Logs de build:** Disponíveis no painel do Netlify
- **Analytics:** Netlify Analytics (opcional)
- **Uptime:** Monitoramento automático

## Troubleshooting

### Build falha?

1. Verifique se todas as dependências estão no `package.json`
2. Confirme se a variável `VITE_SUPABASE_ANON_KEY` está configurada
3. Veja os logs de build no painel do Netlify

### App não carrega?

1. Verifique se os redirects estão funcionando (`/*` → `/index.html`)
2. Confirme se a chave do Supabase está válida
3. Teste localmente com `npm run build && npm run preview`

### API não funciona?

1. Verifique se as Netlify Functions estão sendo deployadas
2. Confirme se os redirects de `/api/*` estão corretos
3. Veja os logs das functions no painel do Netlify

## Support

- **Documentação Netlify:** https://docs.netlify.com
- **Supabase Docs:** https://supabase.com/docs
- **Builder.io Support:** https://www.builder.io/c/docs
