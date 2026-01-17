# Publisher 🚀

**Seu cronograma de posts inteligente** - Crie posts incríveis com IA e organize seu calendário de publicações em todas as redes sociais.

![Publisher Preview](./preview.png)

## ✨ Funcionalidades

- **🤖 Chat com IA** - Descreva seu post e receba 3 opções completas com texto e imagem
- **📅 Cronograma Inteligente** - Calendário visual e Kanban para organizar suas publicações
- **⚡ Publicação Rápida** - Agende posts para todas as plataformas
- **📊 Análise de Performance** - Acompanhe métricas e entenda o que funciona
- **🌐 Multi-plataforma** - Instagram, TikTok, Twitter, LinkedIn e mais

## 🛠️ Stack Tecnológica

- **Frontend**: Next.js 14, React 18, TypeScript
- **Estilização**: Tailwind CSS, Shadcn UI
- **Backend**: Next.js API Routes
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth (Google OAuth)
- **IA**: OpenAI GPT-4
- **Pagamentos**: Stripe
- **Animações**: Framer Motion
- **State Management**: TanStack Query, Zustand

## 🚀 Começando

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Supabase
- Conta no OpenAI
- Conta no Stripe

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/publisher.git
cd publisher
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:

Copie o arquivo `env.example.txt` para `.env.local` e preencha as variáveis:

```bash
cp env.example.txt .env.local
```

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key

# OpenAI
OPENAI_API_KEY=sua_chave_openai

# Stripe
STRIPE_SECRET_KEY=sua_chave_secreta_stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=sua_chave_publica_stripe
STRIPE_WEBHOOK_SECRET=seu_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Configure o banco de dados:

Execute o script SQL no Supabase:
- Acesse o SQL Editor no dashboard do Supabase
- Cole o conteúdo do arquivo `supabase/schema.sql`
- Execute o script

5. Configure a autenticação Google no Supabase:
- Vá em Authentication > Providers > Google
- Adicione seu Client ID e Client Secret do Google Cloud Console

6. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
publisher/
├── src/
│   ├── app/                    # App Router (páginas)
│   │   ├── (dashboard)/        # Rotas protegidas
│   │   ├── api/                # API Routes
│   │   ├── auth/               # Callback OAuth
│   │   └── login/              # Página de login
│   ├── components/
│   │   ├── motion/             # Componentes de animação
│   │   ├── providers.tsx       # Context providers
│   │   └── ui/                 # Componentes Shadcn
│   ├── hooks/                  # Custom hooks
│   ├── lib/
│   │   ├── auth/               # Contexto de autenticação
│   │   ├── supabase/           # Cliente Supabase
│   │   ├── axios.ts            # Cliente HTTP
│   │   └── utils.ts            # Utilitários
│   └── types/                  # Tipos TypeScript
├── supabase/
│   └── schema.sql              # Schema do banco
├── public/                     # Assets estáticos
└── package.json
```

## 🎨 Cores da Marca

| Nome         | Hex       | Uso                    |
|--------------|-----------|------------------------|
| Warm White   | `#FFFEF9` | Fundo principal        |
| Warm Black   | `#1C1C19` | Texto e elementos      |
| Warm Gray    | `#868680` | Texto secundário       |
| Orange Accent| `#FF5500` | Destaques e CTAs       |

## 💳 Planos

| Plano    | Preço      | Posts/mês | Recursos                     |
|----------|------------|-----------|------------------------------|
| Free     | Grátis     | 3         | IA básica, Calendário        |
| Pro      | R$ 49,90   | 50        | IA avançada, Kanban, Suporte |
| Business | R$ 149,90  | Ilimitado | Todos os recursos, API       |

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Verificar linting
```

## 📝 Configuração do Stripe

1. Crie produtos e preços no Stripe Dashboard
2. Configure o webhook para `/api/stripe/webhook`
3. Adicione os eventos:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👤 Autor

Desenvolvido com 💜 por **Publisher Team**

---

⭐ Se este projeto te ajudou, deixe uma estrela!

