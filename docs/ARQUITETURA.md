# Arquitetura

## Visão geral

```text
Navegador
  |-- páginas e assets --> Nginx (frontend)
  |-- /api/* -----------> Nginx reverse proxy
                              |
                              v
                         Express API
                              |
                              v
                         PostgreSQL 15
```

## Componentes

### Frontend

- HTML multipágina, sem framework ou etapa de build.
- `style.css` concentra os estilos compartilhados.
- `modern.css` aplica o sistema visual institucional atual e sobrescreve progressivamente os estilos legados sem romper as telas funcionais.
- `script.js` controla menu móvel, animações e comportamentos gerais.
- Páginas da plataforma incluem lógica própria inline.
- Fontes Google e Font Awesome são dependências externas do navegador.

### Sistema visual

- Direção dark premium com azul profundo, índigo e verde como cores de ação e confirmação.
- Tipografia `Space Grotesk` em títulos e `Inter` em textos e controles.
- Componentes compartilhados para navegação, botões, cards, prova social, etapas, métricas e chamadas comerciais.
- Breakpoints principais em 960 px e 768 px, com suporte a `prefers-reduced-motion`.

### Contêiner da aplicação

- O `Dockerfile` principal empacota Nginx e API Node no mesmo contêiner para eliminar dependência de DNS entre serviços no Easypanel.
- Supervisor mantém os dois processos ativos e envia os logs para a saída do contêiner.
- Nginx serve apenas HTML, CSS, JavaScript e assets; backend e documentação não ficam na raiz pública.
- `try_files` transforma `/sobre` em `sobre.html` e mantém fallback para `index.html`.
- Requisições `/api/` são encaminhadas à API Express.

### API

- Node.js 20, Express, `bcryptjs`, `jsonwebtoken` e `pg`.
- Oferece autenticação, catálogo, matrícula, progresso e administração.
- Middlewares verificam autenticação e papel administrativo.

### Dados

- PostgreSQL 15 com UUIDs.
- Entidades: usuários, cursos, módulos, aulas, matrículas e progresso por aula.
- Exclusões propagam por chaves estrangeiras (`ON DELETE CASCADE`).

## Implantação

O Compose define a aplicação integrada (`frontend`) e o PostgreSQL (`db`), além do volume persistente `pgdata`. Em produção, o banco pode ser um serviço PostgreSQL separado, conectado por `DATABASE_URL`.

## Configuração

| Variável | Finalidade |
|---|---|
| `PORT` | Porta HTTP da API |
| `JWT_SECRET` | Assinatura dos tokens; secreto em produção |
| `DATABASE_URL` | String completa de conexão PostgreSQL |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Conexão em campos separados |
| `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` | Nomes PostgreSQL equivalentes |
| `DB_SSL` | `true` quando o provedor exigir TLS |
| `API_HOST` | Host interno da API usado pelo Nginx; padrão `127.0.0.1` |
| `API_PORT` | Porta interna da API usada pelo Nginx; padrão `3001` |
| `ADMIN_EMAIL` | E-mail da conta administrativa sincronizada no início |
| `ADMIN_PASSWORD` | Senha administrativa; mínimo de 12 caracteres em produção |

## Limites atuais

- Autenticação no navegador depende de `localStorage`.
- API e frontend são acoplados pelo caminho relativo `/api`.
- Não há migrações versionadas; a criação ocorre por SQL inicial ou rotina inline.
- Observabilidade se limita aos logs e ao endpoint `/api/health`.

## Regras para evolução

- Nunca versionar segredos reais.
- Sincronizar mapa ao criar/remover páginas e API/dados ao mudar endpoints ou tabelas.
- Preferir migrações incrementais a alterações destrutivas no SQL inicial.
- Validar acessibilidade, responsividade e papéis `aluno`/`admin`.
