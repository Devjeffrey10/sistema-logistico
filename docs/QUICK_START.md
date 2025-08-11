# 🚀 Guia Rápido - Deploy Netlify + Supabase

## ⚡ Configuração Rápida (5 minutos)

### 1. Configurar Supabase Database

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá para seu projeto: https://yqirewbwerkhpgetzrmg.supabase.co
3. Vá em **SQL Editor**
4. Execute o script completo: `docs/supabase_setup.sql`

### 2. Obter Chaves da API

1. Vá em **Settings → API**
2. Copie as seguintes chaves:
   - **URL**: `https://yqirewbwerkhpgetzrmg.supabase.co` ✅
   - **anon public**: `eyJhbGciOiJI...` (copie aqui)
   - **service_role**: `eyJhbGciOiJI...` (copie aqui)

### 3. Configurar Variáveis no Netlify

Acesse **Site Settings → Environment variables** e adicione:

```env
VITE_SUPABASE_URL=https://yqirewbwerkhpgetzrmg.supabase.co
VITE_SUPABASE_ANON_KEY=[sua-chave-anon-aqui]
SUPABASE_URL=https://yqirewbwerkhpgetzrmg.supabase.co
SUPABASE_ANON_KEY=[sua-chave-anon-aqui]
SUPABASE_SERVICE_KEY=[sua-chave-service-aqui]
```

### 4. Configurar Autenticação

1. No Supabase, vá em **Authentication → Settings**
2. Configure **Site URL**: `https://seu-site.netlify.app`
3. Adicione **Redirect URLs**:
   - `https://seu-site.netlify.app/**`
   - `http://localhost:8080/**`

### 5. Deploy

1. **Trigger Deploy** no Netlify
2. ✅ **Sistema funcionando!**

## 🧪 Teste Rápido

### Login de Teste

1. Acesse seu site
2. Vá na aba "Cadastro"
3. Crie uma conta com seu email
4. Confirme o email (check sua caixa de entrada)
5. Faça login! 🎉

### Primeiro Login Admin

Para criar um usuário admin:

1. Cadastre-se normalmente
2. No Supabase Dashboard → **Table Editor → usuarios**
3. Encontre seu usuário e mude `função` para `admin`

## 🔧 Configurações Avançadas

### Adicionar Domínio Personalizado

1. Netlify **Domain Settings**
2. **Add custom domain**
3. Configure DNS conforme instruções
4. **Atualizar Site URL** no Supabase

### Configurar Email Templates

1. Supabase **Authentication → Email Templates**
2. Customize confirmation e recovery emails
3. Adicione seu domínio

### Monitoramento

- **Netlify**: Analytics habilitado automaticamente
- **Supabase**: Dashboard com métricas em tempo real

## 🚨 Troubleshooting Rápido

### Erro "Invalid API Key"
- ✅ Verifique se as variáveis estão corretas
- ✅ Redeploy após configurar variáveis

### Erro de CORS
- ✅ Configure Site URLs no Supabase
- ✅ Inclua protocolo (https://)

### Email não chega
- ✅ Verifique spam/promoções
- ✅ Configure SMTP personalizado no Supabase

### Build falha
- ✅ Verifique se todas as variáveis VITE_* estão configuradas
- ✅ Teste build local: `npm run build`

## 📞 Suporte

- 📖 **Documentação completa**: `docs/NETLIFY_SETUP.md`
- 🔧 **SQL Setup**: `docs/supabase_setup.sql`
- 💬 **Suporte Netlify**: https://netlify.com/support
- 💬 **Suporte Supabase**: https://supabase.com/support

---

✅ **Sistema configurado com sucesso!** Sua aplicação está rodando com autenticação segura via Supabase e hospedada no Netlify.
