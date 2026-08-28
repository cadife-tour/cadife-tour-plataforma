# Estratégia de Testes

## Níveis de Teste

1. **Estático (CI & Pre-commit)**:
   - TypeScript `tsc --noEmit` (tipagem estrita sem `@ts-ignore`).
   - ESLint 9 com `eslint-plugin-jsx-a11y` e `eslint-plugin-react-hooks`.
   - Prettier para padronização de formatação.
2. **Componentes e Acessibilidade (Vitest + Testing Library)**:
   - Renderização semântica de elementos compartilhados (`src/shared/ui/`).
   - Validação de links, atributos `aria-*` e estados de foco.
3. **Build & Integridade de Rotas**:
   - `next build` para validação de integridade de rotas e tipos estáticos.
4. **Performance & Core Web Vitals**:
   - Medição de baseline antes e depois da introdução de camadas visuais.
