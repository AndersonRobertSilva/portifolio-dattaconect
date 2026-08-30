# Mapa do site

## Hierarquia

```text
Início (/)
├── Sobre nós (/sobre)
├── Projetos (/projetos)
├── Laboratório (/laboratorio)
├── Treinamentos (/treinamentos)
│   ├── Cadastro (/cadastro)
│   ├── Login (/login)
│   └── Área do aluno (/membros) [autenticada]
│       ├── Meus cursos
│       ├── Detalhes do curso
│       └── Reprodução/conclusão de aula
├── Administração (/admin) [admin]
│   ├── Indicadores
│   ├── Cursos
│   ├── Módulos e aulas
│   └── Usuários
└── Política de privacidade (/privacidade)
```

## Inventário de páginas

| URL | Arquivo | Público | Objetivo |
|---|---|---:|---|
| `/` | `index.html` | Sim | Apresentação, soluções e conversão via WhatsApp |
| `/sobre` | `sobre.html` | Sim | História e posicionamento da empresa |
| `/projetos` | `projetos.html` | Sim | Portfólio de projetos |
| `/laboratorio` | `laboratorio.html` | Sim | Laboratório e iniciativas |
| `/treinamentos` | `treinamentos.html` | Sim | Catálogo consumido da API |
| `/cadastro` | `cadastro.html` | Sim | Criação de conta |
| `/login` | `login.html` | Sim | Autenticação |
| `/membros` | `membros.html` | JWT | Cursos, matrícula, aulas e progresso |
| `/admin` | `admin.html` | JWT + admin | Gestão da plataforma |
| `/privacidade` | `privacidade.html` | Sim | Política de privacidade |

## Jornadas principais

1. **Cliente institucional:** Início → solução/projeto → WhatsApp.
2. **Novo aluno:** Treinamentos → Cadastro → Área do aluno → Matrícula → Aula.
3. **Aluno recorrente:** Login → Área do aluno → Curso → Concluir aula.
4. **Administrador:** Login → Administração → gerenciar conteúdo ou consultar usuários.

## Observações

- O menu público está duplicado nos HTMLs; alterações devem ser replicadas.
- O Nginx oferece URLs sem extensão `.html`.
- Verificar o link `/projetos-realizado` da home, divergente de `/projetos`.
