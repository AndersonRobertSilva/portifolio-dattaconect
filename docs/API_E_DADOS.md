# API e dados

Prefixo: `/api`. **JWT** exige `Authorization: Bearer <token>`; **admin** exige também papel `admin`.

## Endpoints

| Método e rota | Acesso | Função |
|---|---|---|
| `POST /auth/register` | Público | Criar aluno e emitir token |
| `POST /auth/login` | Público | Autenticar e emitir token |
| `GET /auth/me` | JWT | Retornar usuário atual |
| `GET /courses` | Público | Listar cursos ativos |
| `GET /courses/:id` | Público | Curso, módulos e metadados de aulas |
| `POST /courses/:id/enroll` | JWT | Matricular usuário |
| `GET /my-courses` | JWT | Listar matrículas |
| `GET /courses/:id/progress` | JWT | Consultar progresso |
| `GET /lessons/:id` | JWT | Obter aula conforme matrícula/gratuidade |
| `POST /lessons/:id/complete` | JWT | Concluir aula e recalcular progresso |
| `POST/PUT/DELETE /admin/courses[/:id]` | admin | Gerenciar cursos |
| `POST/PUT/DELETE /admin/modules[/:id]` | admin | Gerenciar módulos |
| `POST/PUT/DELETE /admin/lessons[/:id]` | admin | Gerenciar aulas |
| `GET /admin/users` | admin | Listar usuários |
| `POST /admin/users` | `manage_users` | Criar aluno ou administrador |
| `PUT /admin/users/:id` | `manage_users` | Editar perfil, papel e permissões |
| `PATCH /admin/users/:id/status` | `manage_users` | Pausar ou reativar perfil |
| `POST /admin/users/:id/reset-password` | `manage_users` | Redefinir senha |
| `DELETE /admin/users/:id` | `manage_users` | Excluir perfil |
| `GET /admin/enrollments` | `manage_enrollments` | Listar matrículas e desempenho por aluno/curso |
| `GET /admin/enrollments/options` | `manage_enrollments` | Listar alunos e cursos ativos para matrícula manual |
| `POST /admin/enrollments` | `manage_enrollments` | Matricular manualmente um aluno ativo |
| `POST /admin/enrollments/:id/reset-progress` | `manage_enrollments` | Reiniciar conclusões e progresso do curso |
| `DELETE /admin/enrollments/:id` | `manage_enrollments` | Remover matrícula e seu progresso associado |
| `GET /admin/stats` | admin | Indicadores administrativos |
| `GET /health` | Público | Verificar disponibilidade |

## Modelo relacional

```text
users 1---N user_courses N---1 courses
users 1---N user_lessons N---1 lessons
courses 1---N modules 1---N lessons
```

- `users`: identidade, hash, papel, permissões administrativas e status.
- `courses`: catálogo.
- `modules`: agrupamento ordenado no curso.
- `lessons`: conteúdo, vídeo e gratuidade.
- `user_courses`: matrícula e percentual.
- `user_lessons`: conclusão individual.

## Regras relevantes

- E-mail único; uma matrícula por usuário/curso; um progresso por usuário/aula.
- Todo cadastro público em `POST /auth/register` é criado obrigatoriamente como `aluno`, sem permissões administrativas; campos de papel enviados pelo cliente são ignorados.
- A promoção para administrador só pode ocorrer pelo painel/API protegida com `manage_users`.
- Aulas não gratuitas exigem matrícula, exceto para administradores.
- Percentual recalculado ao concluir uma aula; JWT expira em sete dias.
- Administradores podem receber `manage_courses`, `manage_users` e `manage_enrollments` de forma independente. As permissões são consultadas no banco a cada ação administrativa.
- A gestão de matrículas exibe percentual, aulas concluídas, datas de início e última atividade; somente alunos e cursos ativos podem ser vinculados manualmente.
- Reiniciar ou remover uma matrícula apaga as conclusões das aulas daquele curso para manter os indicadores consistentes.
- O administrador não pode pausar, rebaixar ou excluir o próprio perfil; o último administrador ativo não pode ser excluído.

## Mudanças de esquema

Ainda não há ferramenta de migração. Preserve instalações existentes, escreva SQL incremental, faça backup, mantenha `database/init.sql` compatível com instalações novas e evite divergência com `runInlineInit()`.
