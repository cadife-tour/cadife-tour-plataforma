# Plano — Issue #1: Design system global e biblioteca visual

**Derivado de:** [SPEC — Issue #1](ISSUE-1-global-design-system.md)
**Estado:** aprovado pelo usuário, implementado, validado e revisado; pronto para PR draft.

## Abordagem mínima

Preservar os tokens já existentes e ampliar somente lacunas que os exemplos da biblioteca evidenciarem. Criar uma rota isolada de referência em `/design-system` e um registro explícito, tipado e testável em `src/shared/ui/`. As demonstrações consomem os componentes reais; a página expõe suas variantes sem mudar contratos funcionais do site. Documentar a obrigação de atualizar o catálogo no ponto de contribuição existente (README ou documentação curta dedicada, conforme a estrutura real após aprovação).

Não instalar Storybook ou outra dependência: a necessidade desta fatia é uma página de leitura/interação dentro do React já adotado.

## Arquivos/áreas prováveis

- `src/core/theme/tokens.css`: conferir cobertura e acrescentar tokens ausentes apenas se necessários à demonstração e consistência desta fatia.
- `src/core/theme/globals.css`: garantir defaults/foco/reduced motion sem substituir os padrões de componentes de feature.
- `src/shared/ui/`: revisar contratos atuais e adicionar o registro/demonstrações catalogadas.
- `src/app/design-system/page.tsx` e `src/shared/ui/design-system.module.css`: registrar metadata da rota e manter os estilos junto ao componente de biblioteca compartilhado, sem importar o layout principal de marketing como conteúdo do catálogo.
- `src/test/` ou `src/shared/ui/`: testes de render, cobertura do registro, acessibilidade e interação.
- `README.md` ou documentação específica: explicar como adicionar componente e mantê-lo visível na biblioteca.

Os caminhos finais podem ser ajustados aos padrões existentes, sem alterar o escopo ou os critérios.

## Sequência incremental

1. **Base de tokens e inventário — AC-01.** Mapear tokens existentes e contratos/exportações de `src/shared/ui/`; identificar como testar cobertura integral sem acoplar teste a detalhes frágeis.
2. **Registro — AC-02 e AC-04.** Definir um tipo pequeno para nome, descrição, origem e exemplo; registrar Button, Container, LanguageSelector e SkipToContent. Ligar o teste de cobertura ao mecanismo de export/registro adotado.
3. **Rota e demonstrações — AC-02 e AC-03.** Implementar `/design-system` com seções de tokens e componentes; incluir os controles de demonstração relevantes e metadata `noindex, nofollow`. Isolar efeitos de conversão/tracking das demonstrações.
4. **Acessibilidade, motion e adaptação — AC-05, AC-06 e AC-07.** Ajustar responsividade local, navegação sem mouse, nomes/semântica e redução de motion; não expandir animações fora da rota.
5. **Documentar e validar — AC-01 a AC-08.** Atualizar orientação de contribuição, executar testes focados e suíte/comandos do projeto, inspecionar o diff e revisar cada critério. Validar a rota em 1440px/768px/390px, teclado e movimento reduzido quando runtime estiver disponível.

## Testes e validações

- Unit/integration tests da página e do registro: todos os componentes do catálogo têm nome, fonte e demonstração; variantes/estados expostos refletem props reais.
- Interações focadas: seleção de idioma não dispara tracking de analytics na demo; controles de Button e navegação da página funcionam por teclado; ausência de efeitos de negócio.
- Teste de motion reduzido para exemplos animados e inspeção do estilo baseline.
- Executar `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` e `git diff --check`.
- Verificação visual desktop/tablet/mobile e revisão manual por teclado. Se o ambiente visual não estiver disponível, declarar AC-05/AC-06 parcial ou não verificado, sem inferir aceite pelo build.

## Integração e proteção do checkout

- Base confirmada: `68bb936`; implementação executada em worktree isolada `codex/issue-1-design-system`.
- Há uma alteração pré-existente em `.gitignore` não relacionada. Preservá-la; não incluir no escopo nem reverter/stagear em conjunto.
- O workflow de entrega da issue exige PR; manter a mudança em branch e não mesclar nem fechar a issue.

## Riscos e condições para parar

- Se não for possível testar completude do catálogo sem criar uma abstração grande ou tornar todos os componentes dependentes do catálogo, preferir contrato simples e documentar precisamente a cobertura residual; não reescrever a arquitetura de UI.
- Se a rota proposta tiver de ser privada/interna, parar antes de implementação de metadata/roteamento para confirmar o requisito de acesso, pois o projeto não tem autenticação.
- Se surgir necessidade de redefinir conteúdo oficial, identidade visual ou comportamento comercial, parar e registrar a decisão para o responsável; não preencher com conteúdo inventado.
- Se incluir cenas WebGL/vídeo revelar um segundo catálogo independente, manter esta fatia em `src/shared/ui/` e propor issue/fatia separada para os objetos de feature.
- Esta entrega cobre a primeira fatia do épico #1. Não marcar #1 como Done até as fatias remanescentes e validações do épico serem concluídas.

## Revisão da spec e plano

- Os critérios AC-01 a AC-08 possuem caminhos de validação.
- A exposição da rota e o catálogo explícito foram aprovados; a fronteira com o restante do épico permanece explícita.
- Implementação desta fatia concluída; resultados de validação e revisão devem ser registrados antes do PR.
