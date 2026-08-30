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
- `script.js` controla menu móvel, animações e comportamentos gerais.
- Páginas da plataforma incluem lógica própria inline.
- Fontes Google e Font Awesome são dependências externas do navegador.

### Servidor web

- Nginx serve os arquivos estáticos.
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

O Compose define `frontend`, `api` e `db`, além do volume persistente `pgdata`. O manual informa que o Easypanel observa o GitHub e reconstrói o deploy após push.

## Configuração

| Variável | Finalidade |
|---|---|
| `PORT` | Porta HTTP da API |
| `JWT_SECRET` | Assinatura dos tokens; secreto em produção |
| `DATABASE_URL` | String completa de conexão PostgreSQL |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Conexão em campos separados |
| `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` | Nomes PostgreSQL equivalentes |
| `DB_SSL` | `true` quando o provedor exigir TLS |

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
