# Sistema de Roteamento - Publisher Dev

Este projeto utiliza **React Router v7** para gerenciar a navegação entre páginas.

## Estrutura de Arquivos

```
src/
├── components/
│   └── Navigation.tsx      # Componente de navegação principal
├── pages/
│   ├── Home.tsx            # Página inicial (/)
│   ├── About.tsx           # Página sobre (/about)
│   ├── Dashboard.tsx       # Página do dashboard (/dashboard)
│   └── NotFound.tsx        # Página 404 (*)
├── routes/
│   └── index.tsx           # Configuração principal das rotas
├── hooks/
│   └── useNavigation.ts    # Hook customizado para navegação
├── styles/
│   ├── app.css             # Estilos gerais da aplicação
│   ├── navigation.css      # Estilos da navegação
│   └── pages.css           # Estilos das páginas
└── types/
    └── index.ts            # Definições de tipos TypeScript
```

## Como Funciona

### 1. Configuração Principal

- `main.tsx`: Configura o `BrowserRouter` que envolve toda a aplicação
- `App.tsx`: Renderiza o layout principal com navegação e rotas
- `routes/index.tsx`: Define todas as rotas disponíveis

### 2. Navegação

- `Navigation.tsx`: Barra de navegação com links para todas as páginas
- `useNavigation.ts`: Hook customizado para programaticamente navegar entre páginas

### 3. Páginas

Cada página é um componente React independente que pode:

- Usar o hook `useNavigation` para navegação programática
- Renderizar links usando o componente `Link` do React Router
- Acessar informações da rota atual via `useLocation`

## Adicionando Novas Rotas

1. **Criar a página** em `src/pages/`
2. **Adicionar a rota** em `src/routes/index.tsx`
3. **Adicionar link** na navegação em `src/components/Navigation.tsx`

### Exemplo:

```tsx
// 1. Criar src/pages/NewPage.tsx
export default function NewPage() {
  return <div>Nova página</div>
}

// 2. Adicionar em src/routes/index.tsx
import NewPage from '../pages/NewPage'

<Route path="/new-page" element={<NewPage />} />

// 3. Adicionar na navegação
<Link to="/new-page" className="nav-link">Nova Página</Link>
```

## Recursos Disponíveis

- ✅ Roteamento baseado em componentes
- ✅ Navegação programática via hooks
- ✅ Páginas 404 automáticas
- ✅ Navegação responsiva
- ✅ Estilos CSS organizados
- ✅ Suporte completo a TypeScript
- ✅ Estrutura escalável

## Comandos Úteis

```bash
# Instalar dependências
pnpm install

# Executar em desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Preview da build
pnpm preview
```

## Tecnologias Utilizadas

- **React 18** - Framework principal
- **React Router 7** - Roteamento
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **CSS** - Estilos customizados
