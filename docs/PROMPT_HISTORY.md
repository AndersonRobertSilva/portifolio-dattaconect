# Histórico resumido de solicitações

Registro cronológico dos pedidos que orientam o projeto. Este documento preserva contexto útil, não o conteúdo integral das conversas nem o raciocínio interno de agentes.

## 2026-08-30 — Preparação do site institucional

**Solicitação:** substituir a pasta `a_site_institucional` pelo conteúdo do repositório `AndersonRobertSilva/portifolio-dattaconect`, criar documentação suficiente para continuidade independente do chat, incluindo histórico, arquitetura e mapa do site, e publicar no mesmo repositório.

**Resultado:** repositório clonado; criados README, histórico de continuidade, arquitetura, mapa do site, documentação de API/dados, operação/deploy e exemplo de variáveis de ambiente; alterações publicadas no commit `8c744e7`.

## 2026-08-30 — Memória permanente para agentes

**Solicitação:** adicionar o arquivo `AGENTS.md` para manter o histórico das solicitações e orientar a continuidade.

**Resultado:** criado `AGENTS.md` na raiz com ordem de leitura, regras de atualização e segurança; criado este histórico resumido de prompts; README e histórico de continuidade atualizados.

## 2026-08-30 — Correção do deploy do frontend

**Solicitação:** corrigir o deploy que encerrava o Nginx com `host not found in upstream \"n8n_dattaconect-api\"`.

**Resultado:** removido o hostname inválido fixo; o frontend passou a receber `API_HOST` e `API_PORT`, com padrão `api:3001`, e a resolver o serviço dinamicamente pelo DNS interno do Docker.

## 2026-08-30 — Reformulação institucional

**Solicitação:** analisar o projeto e ajustar o site para ter apresentação profissional, moderna, clara e comparável à de grandes startups.

**Resultado:** home reposicionada com narrativa executiva e foco em conversão; novo sistema visual responsivo aplicado a todas as páginas; componentes, navegação, acessibilidade e feedback de indisponibilidade da plataforma refinados sem alterar os contratos da API.

## 2026-08-30 — Legibilidade da prova social

**Solicitação:** melhorar a faixa de empresas atendidas para destacar texto e marcas de forma legível.

**Resultado:** faixa recebeu painel com contraste, hierarquia tipográfica mais clara e logotipos em cards claros com comportamento responsivo.

## 2026-08-30 — Fundo das logos

**Solicitação:** adicionar fundo às logos da faixa de prova social.

**Resultado:** aplicado fundo branco sólido e borda clara a cada logo; versão do CSS incrementada para impedir cache da aparência anterior.

## 2026-08-30 — Ambiente demonstrativo de treinamentos

**Solicitação:** liberar acesso para verificar a estrutura da área de membros enquanto a plataforma real está indisponível.

**Resultado:** criada rota pública `/demo-membros` com dashboard, catálogo e player preenchidos por dados fictícios; adicionado acesso pela tela de login sem contornar a autenticação real.

## 2026-08-30 — Painel administrativo em produção

**Solicitação:** disponibilizar o ambiente real para cadastrar e publicar cursos, não apenas a demonstração.

**Resultado:** site e API consolidados no mesmo contêiner para remover a falha de comunicação interna; acesso administrativo passou a ser provisionado por variáveis protegidas. O PostgreSQL continua exigindo uma `DATABASE_URL` válida no Easypanel.

## 2026-08-30 — Conflito de porta no deploy

**Solicitação:** analisar o resultado do deploy integrado.

**Resultado:** confirmado que PostgreSQL e inicialização do esquema funcionaram; corrigido conflito entre Nginx e API na porta 80, fixando a porta interna da API em 3001 pelo Supervisor. Identificada também senha administrativa abaixo do mínimo exigido.
