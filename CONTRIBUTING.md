# Guia de Contribuição — CADIFE Tour

Seja bem-vindo ao time de engenharia da **CADIFE Tour**!

## 1. Princípios do Projeto
1. **Core First, Progressive Enhancement Always**: O site institucional deve ser rápido, acessível e funcional em HTML puro. O 3D é uma camada estética que não pode travar o usuário.
2. **Critérios de Decisão**: Toda escolha deve gerar valor ao usuário, impacto ao negócio, baixo custo de manutenção ou facilidade de evolução.

## 2. Padrão de Commits (Conventional Commits)
Utilizamos mensagens no formato:
- `feat: adiciona componente de card de destino`
- `fix: corrige contraste de botão no footer`
- `docs: atualiza documentação de baseline`
- `refactor: reorganiza imports de tokens CSS`

## 3. Fluxo de Trabalho
1. Crie uma branch a partir de `main`: `git checkout -b feat/nome-da-feature`.
2. Desenvolva mantendo TypeScript e a11y em dia.
3. Valide localmente:
   ```bash
   npm run lint
   npm run typecheck
   npm run test
   npm run build
   ```
4. Abra um Pull Request utilizando o template padrão.
