# ADR 0002: Diretrizes de Negócio, KPIs, Integridade de Conteúdo e Anti-Escopo

- **Status**: Aceito
- **Data**: 2026-08-28
- **Decisores**: Equipe de Engenharia e Produto CADIFE Tour

## Contexto

Após a consolidação da Fase 1, foi realizada uma rodada de alinhamento estratégico de negócio para garantir que a aplicação entregue valor comercial real para a CADIFE Tour e para os viajantes, evitando *feature creep* ou distorções de comunicação comercial.

## Decisões

1. **Princípios Centrais Estritos**:
   - `CORE FIRST`
   - `PROGRESSIVE ENHANCEMENT ALWAYS`
   - `BUILD FOR VALUE`
   - `NO FAKE INTELLIGENCE`
   - `NO FAKE PRODUCT`

2. **Integridade Absoluta do Conteúdo Comercial**:
   - O time e os agentes de desenvolvimento **nunca devem inventar conteúdo comercial** da CADIFE (preços, datas, inclusões, roteiros fechados, depoimentos, CADASTUR, métricas de clientes).
   - Quando um dado real não estiver disponível, utiliza-se a marcação explícita `[Conteúdo em homologação pela CADIFE]` ou schemas tipados preparados para receber o dado real.

3. **Performance Budgets vs. Metas Aspiracionais**:
   - **Hard Budget (Critério de Aceite / DoD)**:
     - LCP $< 2.5\text{s}$ (Mobile 4G)
     - CLS $< 0.1$
     - INP $< 200\text{ms}$
     - First Load JS controlado
   - **Metas Aspiracionais (Diretrizes de Excelência)**:
     - LCP $< 1.5\text{s}$
     - CLS próximo a $0.00$
     - Lighthouse $\ge 95$

4. **Conversão via WhatsApp Contextual**:
   - Todos os CTAs são parametrizados com a seção, o destino e o idioma da navegação (PT, EN, ES).
   - O registro do evento ocorre de forma não-bloqueante via fachada agnóstica de analytics antes do redirecionamento.

5. **Anti-Escopo Oficial**:
   - 🚫 Sem login / autenticação fake.
   - 🚫 Sem IA / chatbot fake.
   - 🚫 Sem banco de dados / CMS próprio.
   - 🚫 Sem calculadora de câmbio / simulador de preços.
   - 🚫 Sem mapas 3D de rotas aéreas no MVP.
