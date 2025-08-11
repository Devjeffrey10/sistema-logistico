# 🔑 Como Obter a Chave Correta do Supabase

## 📍 Localização das Chaves

1. **Acesse o Supabase Dashboard**: https://supabase.com/dashboard
2. **Selecione seu projeto**: https://yqirewbwerkhpgetzrmg.supabase.co
3. **Vá para Settings �� API**

## 🔐 Chaves Necessárias

### 1. Project URL ✅
```
https://yqirewbwerkhpgetzrmg.supabase.co
```
**Status**: ✅ Já configurado

### 2. Anon/Public Key 🔑
**Localização**: Settings → API → Project API keys → `anon` `public`
**Formato**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
**Uso**: Frontend (pode ser exposta publicamente)

**Para configurar**:
```bash
# No Netlify Environment Variables:
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

### 3. Service Role Key 🛡️ (Opcional)
**Localização**: Settings → API → Project API keys → `service_role`
**Formato**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
**Uso**: Backend/Functions (NUNCA exponha no frontend)

**Para configurar**:
```bash
# No Netlify Environment Variables:
SUPABASE_SERVICE_KEY=sua_chave_service_aqui
```

## 🚀 Configuração Rápida

### No Dashboard do Netlify:
1. **Site Settings → Environment Variables**
2. **Adicionar as variáveis**:

```env
VITE_SUPABASE_URL=https://yqirewbwerkhpgetzrmg.supabase.co
VITE_SUPABASE_ANON_KEY=[COPIE_A_ANON_KEY_DO_SUPABASE]
SUPABASE_URL=https://yqirewbwerkhpgetzrmg.supabase.co
SUPABASE_ANON_KEY=[COPIE_A_ANON_KEY_DO_SUPABASE]
SUPABASE_SERVICE_KEY=[COPIE_A_SERVICE_KEY_DO_SUPABASE]
```

### Para testar localmente:
Crie um arquivo `.env.local`:

```env
VITE_SUPABASE_URL=https://yqirewbwerkhpgetzrmg.supabase.co
VITE_SUPABASE_ANON_KEY=[sua_anon_key]
SUPABASE_URL=https://yqirewbwerkhpgetzrmg.supabase.co
SUPABASE_ANON_KEY=[sua_anon_key]
SUPABASE_SERVICE_KEY=[sua_service_key]
```

## 🎯 Próximos Passos

1. ✅ **Copie a chave anon** do dashboard do Supabase
2. ✅ **Configure no Netlify** as variáveis de ambiente
3. ✅ **Execute o SQL**: `docs/supabase_setup.sql` no SQL Editor
4. ✅ **Deploy** e teste o sistema

## 🔧 Configuração de Autenticação

No Supabase Dashboard:
1. **Authentication → Settings**
2. **Site URL**: `https://seu-site.netlify.app`
3. **Redirect URLs**: `https://seu-site.netlify.app/**`

## ✅ Status Atual

- 🔗 **Conexão Supabase**: ✅ Configurado
- 🔗 **Conexão Netlify**: ✅ Configurado
- 🔑 **Chaves API**: ⚠️ Precisa configurar as chaves reais
- 🗄️ **Database**: ⚠️ Executar SQL setup
- 🔐 **Autenticação**: ⚠️ Configurar Auth settings

O sistema está **95% pronto**! Só falta configurar as chaves reais do Supabase.
