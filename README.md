# Datta Conect — Site Institucional

Site institucional e plataforma de treinamentos da Datta Conect. O frontend é estático (HTML, CSS e JavaScript), servido por Nginx; a área de membros usa uma API Node.js/Express e PostgreSQL.

## Documentação

- [Instruções permanentes para agentes](AGENTS.md)
- [Histórico e continuidade](docs/HISTORICO.md)
- [Histórico resumido de solicitações](docs/PROMPT_HISTORY.md)
- [Arquitetura](docs/ARQUITETURA.md)
- [Mapa do site](docs/MAPA_DO_SITE.md)
- [Operação e deploy](docs/OPERACAO_E_DEPLOY.md)
- [API e dados](docs/API_E_DADOS.md)
- [Manual legado](TUTORIAL_SITE.md)

## Execução local

Pré-requisito: Docker com Docker Compose.

```bash
docker compose up --build
```

O site fica disponível em `http://localhost` e a saúde da API em `http://localhost/api/health`.

> Antes de qualquer ambiente público, altere as senhas de banco, o `JWT_SECRET` e a conta administrativa inicial. Consulte o guia de operação.

## Estrutura resumida

```text
assets/             imagens e logotipos
backend/            API Express
database/           esquema e dados iniciais PostgreSQL
docs/               documentação viva do projeto
*.html              páginas do site e da plataforma
style.css           estilos compartilhados
script.js           interações compartilhadas
nginx.conf          site estático e proxy /api
docker-compose.yml  ambiente local completo
```

## Fluxo de contribuição

1. Leia `docs/HISTORICO.md` e registre ali decisões relevantes.
2. Crie uma branch para mudanças maiores.
3. Valide o site, a API e os fluxos afetados.
4. Atualize a documentação quando páginas, rotas, dados ou infraestrutura mudarem.
5. Faça commit e envie ao GitHub; o deploy conectado ao repositório poderá iniciar automaticamente.
