# 🔍 Onde Encontrar a API Key do Supabase

## 📍 **Passo a Passo Visual**

### 1. 🌐 **Acesse o Dashboard do Supabase**
```
👉 Vá para: https://supabase.com/dashboard
👉 Faça login na sua conta
```

### 2. 📂 **Selecione seu Projeto**
```
👉 Clique no projeto: yqirewbwerkhpgetzrmg
👉 Ou acesse direto: https://supabase.com/dashboard/project/yqirewbwerkhpgetzrmg
```

### 3. ⚙️ **Vá para Settings → API**
```
👉 No menu lateral esquerdo, clique em "Settings" (ícone de engrenagem)
�� Depois clique em "API"
```

### 4. 🔑 **Copie a Chave Correta**

Na seção **"Project API keys"** você verá:

```
📋 Project URL
✅ https://yqirewbwerkhpgetzrmg.supabase.co

🔑 anon public
👉 ESTA É A QUE VOCÊ PRECISA! 
👉 Começa com: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
👉 Clique no ícone 📋 para copiar

🛡️ service_role 
👉 Esta é opcional (para operações admin)
👉 NUNCA exponha esta no frontend!
```

## 🎯 **O que Fazer Depois**

Depois de copiar a chave `anon public`:

### No Netlify:
1. **Vá para seu site no Netlify**
2. **Site Settings → Environment Variables** 
3. **Edite** a variável `VITE_SUPABASE_ANON_KEY`
4. **Cole a chave real** (substitua "SUPABASE_CLIENT_API_KEY")
5. **Save** e aguarde redeploy

### Resultado:
```env
ANTES: VITE_SUPABASE_ANON_KEY=SUPABASE_CLIENT_API_KEY
DEPOIS: VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🚀 **Atalho Direto**

Se você já está logado no Supabase:

**👉 [CLIQUE AQUI PARA IR DIRETO](https://supabase.com/dashboard/project/yqirewbwerkhpgetzrmg/settings/api)**

## ✅ **Como Saber se Deu Certo**

Após configurar a chave correta:
1. ✅ **O site não mostrará erros de conexão**
2. ✅ **Você poderá fazer cadastro/login**
3. ✅ **O sistema funcionar�� 100%**

## 🆘 **Se Ainda Não Conseguir**

**Tire um print da tela do Supabase** mostrando a seção de API keys e me envie. Assim posso te ajudar especificamente! 📸

---

**🎯 Resumo**: Você precisa da chave que começa com `eyJhbGciOiJI...` na seção **API** do projeto Supabase!
