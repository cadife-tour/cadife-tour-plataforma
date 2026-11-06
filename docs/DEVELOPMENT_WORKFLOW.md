# Fluxo de Desenvolvimento (Branches e Pull Requests)

Este documento descreve o fluxo oficial de branches e Pull Requests do projeto **CADIFE Tour**.

## 1. Estratégia de Branches

```text
feature/*  ─┐
fix/*       ├──> developer ───> main
chore/*     ┘
docs/*
```

- **`feature/*`, `fix/*`, `chore/*`, `docs/*`**: branches temporárias de trabalho, criadas a partir da `developer`.
- **`developer`**: branch de integração contínua. É onde o trabalho das branches de feature é reunido para formar a próxima versão.
- **`main`**: linha estável, destinada a produção/release. Recebe código apenas via Pull Request vindo da `developer`.

Não desenvolva diretamente em `developer` ou `main`.

## 2. Fluxo padrão

```bash
git checkout developer
git pull --ff-only origin developer
git checkout -b feature/issue-XX-descricao
```

Depois de implementar:

```bash
git add .
git commit
git push -u origin feature/issue-XX-descricao
```

Abra uma Pull Request com `base: developer`.

Quando uma versão estiver pronta para release, abre-se uma Pull Request `developer → main`.

## 3. Convenção de nomes de branch

```text
feature/issue-19-trip-in-motion
fix/issue-XX-descricao
chore/issue-46-ci-branch-strategy
docs/issue-XX-descricao
```

## 4. Pull Requests

- PRs de desenvolvimento devem usar `base: developer` (não `main`), salvo situações excepcionais de release previamente combinadas.
- O CI (`.github/workflows/ci.yml`) é disparado automaticamente em pushes e Pull Requests para `developer` e `main`, executando: `format:check`, `lint`, `typecheck`, `test` e `build`.
- Um PR só deve ser mesclado com o CI aprovado (verde).

## 5. Branch Protection recomendada (configuração manual no GitHub)

Estas configurações dependem de acesso administrativo ao repositório e **não são aplicadas automaticamente**:

**`developer`**

- Exigir Pull Request antes de merge
- Exigir que o CI passe antes de merge
- Exigir branch atualizada antes do merge
- Impedir force push
- Impedir deleção acidental

**`main`**

- Exigir Pull Request antes de merge
- Exigir que o CI passe antes de merge
- Impedir push direto
- Impedir force push
- Impedir deleção
- Exigir ao menos 1 aprovação humana (squad ainda pequeno; revisar conforme o time crescer)
