# publisher-dev

Base do projeto em Next.js (App Router) com TypeScript, Tailwind CSS, ESLint e Prettier.

## Estrutura de pastas

```
app/         # Rotas e layouts (App Router)
components/  # Componentes reutilizáveis
hooks/       # Hooks customizados
lib/         # Utilidades compartilhadas
services/    # Clients e integrações externas
styles/      # Tokens e estilos globais
```

## Aliases de path

Os aliases estão configurados em `tsconfig.json`:

- `@/components/*`
- `@/lib/*`
- `@/services/*`
- `@/hooks/*`
- `@/styles/*`

## Padrões de componentes

- **Server components por padrão**: arquivos em `app/` e `components/` são server components
  a menos que precisem de interatividade.
- **Client components explícitos**: quando necessário, use `"use client"` no topo do arquivo.
- **Nomenclatura**: arquivos e componentes em PascalCase (`ClientCounter.tsx`).
- **Organização**: componentes de UI/feature podem ser agrupados em subpastas dentro de
  `components/`.

## Qualidade

- `npm run lint` para ESLint.
- `npm run format` para formatar com Prettier.
