# Histórico e continuidade

Este é o ponto de retomada oficial do projeto. Atualize este arquivo ao encerrar cada sessão relevante, sem depender do histórico de conversas com agentes de IA.

## Estado atual — 2026-08-30

- Repositório: `AndersonRobertSilva/portifolio-dattaconect`.
- Branch principal: `main`.
- Base analisada: commit `ca3928b`.
- Stack: HTML/CSS/JavaScript, Nginx, Node.js/Express e PostgreSQL 15.
- Entrega: contêineres Docker; o manual existente informa integração do GitHub com Easypanel.
- Site público, catálogo, cadastro/login, área do aluno e painel administrativo já existem.
- Documentação estrutural criada em `docs/` e README principal adicionado.

## Trabalho realizado nesta sessão

1. Repositório clonado em `a_site_institucional`.
2. Estrutura, páginas, API, banco, Docker e proxy Nginx inventariados.
3. Criados documentos de arquitetura, mapa, API/dados e operação/deploy.
4. Registrados riscos e próximos passos abaixo.
5. Criado `AGENTS.md` com instruções permanentes de continuidade.
6. Criado `docs/PROMPT_HISTORY.md` para preservar um resumo cronológico das solicitações do projeto.
7. Corrigida a falha de deploy causada pelo upstream inexistente `n8n_dattaconect-api`: o proxy passou a usar `API_HOST`/`API_PORT`, resolução dinâmica do DNS Docker e padrão `api:3001` compatível com o Compose.

## Decisões conhecidas

- URLs amigáveis sem `.html` são resolvidas pelo Nginx.
- Chamadas do navegador usam `/api`, e o Nginx encaminha para a API.
- Autenticação usa JWT com validade de sete dias, guardado no `localStorage`.
- Papéis disponíveis: `aluno` e `admin`.
- O banco pode ser inicializado por `database/init.sql`; a API também possui inicialização de contingência embutida.

## Riscos e dívida técnica prioritária

- **Crítico:** há credenciais padrão e segredos de desenvolvimento versionados e valores fallback no backend. Usar secrets do ambiente em produção e remover fallbacks inseguros.
- **Crítico:** a conta inicial usa `admin@dattaconect.com.br` / `admin123`. Trocar imediatamente em qualquer banco publicado.
- **Alto:** `cors()` aceita qualquer origem; restringir aos domínios oficiais.
- **Alto:** endpoints de autenticação não têm rate limit, confirmação de e-mail nem recuperação de senha.
- **Alto:** não há testes automatizados nem pipeline CI visível.
- **Resolvido:** o endereço do upstream do Nginx agora é configurável por ambiente e usa `api:3001` no Compose.
- **Médio:** o `Dockerfile` do frontend copia todo o contexto; criar `.dockerignore`.
- **Médio:** existem sinais de codificação incorreta no backend, banco e manual; padronizar UTF-8.
- **Médio:** scripts das páginas autenticadas são inline e duplicados; modularizar.
- **Baixo:** o link de projetos na home aponta para `/projetos-realizado`, diferente da rota local `/projetos`.

## Próximos passos recomendados

1. Corrigir segredos, conta administrativa e CORS antes de ampliar o uso público.
2. Confirmar os nomes/URLs internos usados no Easypanel e separar configuração local da produção.
3. Padronizar UTF-8 e revisar conteúdo, links e SEO.
4. Adicionar testes de API e smoke tests via GitHub Actions.
5. Definir backup/restauração do PostgreSQL e política de retenção.
6. Implementar redefinição de senha e logs de auditoria.

## Modelo para a próxima atualização

```text
Data:
Responsável/agente:
Objetivo:
Mudanças concluídas:
Arquivos principais:
Validações executadas:
Decisões tomadas:
Pendências/riscos:
Próximo passo exato:
Último commit:
```
