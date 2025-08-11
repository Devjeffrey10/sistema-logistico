# 🚛 TransporteManager

Sistema completo de gestão para transportadoras, desenvolvido com React + TypeScript + Supabase.

## 🌟 Funcionalidades

- **👤 Gestão de Usuários**: Criação, edição e controle de acesso
- **🚚 Gestão de Veículos**: Controle completo da frota
- **⛽ Gestão de Combustível**: Monitoramento de abastecimentos
- **📦 Gestão de Produtos**: Controle de inventário
- **🏢 Gestão de Fornecedores**: Cadastro e relacionamento
- **📊 Relatórios**: Dashboards e relatórios detalhados
- **🔐 Autenticação**: Sistema seguro com Supabase Auth
- **🌙 Tema Escuro**: Interface adaptável

## 🛠️ Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + Netlify Functions
- **Banco de Dados**: Supabase (PostgreSQL)
- **UI**: Radix UI + TailwindCSS
- **Autenticação**: Supabase Auth
- **Deploy**: Netlify
- **Validação**: Zod

## 🚀 Deploy Rápido

### Netlify + Supabase (Recomendado)

1. **Clone o repositório**
   ```bash
   git clone [seu-repositório]
   cd transporte-manager
   ```

2. **Configure o Supabase**
   - Crie um projeto no [Supabase](https://supabase.com)
   - Execute o SQL fornecido em `docs/NETLIFY_SETUP.md`
   - Anote as chaves da API

3. **Deploy no Netlify**
   - Conecte seu repo no [Netlify](https://netlify.com)
   - Configure as variáveis de ambiente:
     ```env
     VITE_SUPABASE_URL=https://yqirewbwerkhpgetzrmg.supabase.co
     VITE_SUPABASE_ANON_KEY=[sua-chave-publica]
     SUPABASE_URL=https://yqirewbwerkhpgetzrmg.supabase.co
     SUPABASE_ANON_KEY=[sua-chave-publica]
     SUPABASE_SERVICE_KEY=[sua-chave-de-servico]
     ```

4. **Primeiro Deploy**
   - Build automático será executado
   - Site estará disponível em poucos minutos

📖 **Documentação completa**: Ver `docs/NETLIFY_SETUP.md`

## 💻 Desenvolvimento Local

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta Supabase configurada

### Instalação

```bash
# Clone o repositório
git clone [seu-repositório]
cd transporte-manager

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Crie um arquivo .env.local com as variáveis do Supabase

# Inicie o servidor de desenvolvimento
npm run dev
```

### Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm test            # Executar testes
npm run typecheck   # Verificação de tipos
```

## 🏗️ Arquitetura

```
├── client/                    # Frontend React
│   ├── components/ui/         # Componentes base (Radix UI)
│   ├── contexts/             # Context Providers
│   ├── hooks/                # Custom Hooks
│   ├── lib/                  # Utilitários e configurações
│   ├── pages/                # Páginas da aplicação
│   └── App.tsx               # App principal
├── server/                   # Backend Express
│   ├── lib/                  # Configurações (Supabase)
│   ├── routes/               # Rotas da API
│   └── index.ts              # Servidor principal
├── netlify/functions/        # Netlify Functions
├── shared/                   # Types compartilhados
└── docs/                     # Documentação
```

## 🔐 Autenticação e Segurança

- **Row Level Security (RLS)** habilitado no Supabase
- **Políticas de segurança** configuradas por função
- **Variáveis de ambiente** separadas por contexto
- **Validação** com Zod em todas as entradas

### Usuário Padrão

```
Email: admin@transportadora.com
Senha: [configurar no Supabase Auth]
Função: admin
```

## 📊 Funcionalidades Detalhadas

### Dashboard
- Visão geral da operação
- Métricas em tempo real
- Gráficos interativos

### Gestão de Usuários
- Criação de usuários com roles
- Controle de status (ativo/inativo)
- Histórico de acessos

### Gestão de Veículos
- Cadastro completo da frota
- Manutenções e revisões
- Histórico de abastecimentos

### Relatórios
- Consumo de combustível
- Custos operacionais
- Performance da frota

## 🔧 Configuração Avançada

### Variáveis de Ambiente

**Frontend (VITE_*)**
```env
VITE_SUPABASE_URL=https://yqirewbwerkhpgetzrmg.supabase.co
VITE_SUPABASE_ANON_KEY=[chave-publica]
```

**Backend**
```env
SUPABASE_URL=https://yqirewbwerkhpgetzrmg.supabase.co
SUPABASE_ANON_KEY=[chave-publica]
SUPABASE_SERVICE_KEY=[chave-privada]
```

### Customização do Tema

Edite `client/global.css` para personalizar cores e estilos:

```css
:root {
  --primary: 199 89% 48%;        # Cor primária
  --secondary: 210 40% 96.1%;    # Cor secundária
  --accent: 217 91% 60%;         # Cor de destaque
}
```

## 📈 Monitoramento

### Netlify Analytics
- Acesse o dashboard do Netlify
- Habilite Analytics para métricas detalhadas

### Supabase Monitoring
- Dashboard do Supabase
- Logs de API em tempo real
- Métricas de performance

## 🚨 Troubleshooting

### Problemas Comuns

**1. Erro de CORS**
```bash
# Verifique as URLs permitidas no Supabase
# Authentication > Settings > Site URLs
```

**2. Build Falha**
```bash
# Verifique se todas as variáveis estão configuradas
# Teste local primeiro
npm run build
```

**3. Functions Não Funcionam**
```bash
# Teste localmente
netlify dev
```

### Logs e Debug

```bash
# Netlify Function Logs
netlify functions:log

# Build Logs
netlify open --site

# Supabase Logs
# Vá para o dashboard do Supabase > Logs
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

- **Documentação**: `docs/NETLIFY_SETUP.md`
- **Issues**: [GitHub Issues](https://github.com/[seu-usuario]/[seu-repo]/issues)
- **Email**: suporte@transportadora.com

---

🚛 **Desenvolvido por NexcodePE** - Sistema profissional para gestão de transportadoras
