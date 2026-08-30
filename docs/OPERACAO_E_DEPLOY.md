# Operação e deploy

## Ambiente local

```bash
docker compose up --build
```

Verificações:

```bash
curl http://localhost/
curl http://localhost/api/health
docker compose ps
docker compose logs api
```

Encerre sem apagar o banco com `docker compose down`. Não use `down -v` salvo quando houver intenção explícita de apagar o volume PostgreSQL.

## Checklist antes do deploy

- Revisar mudanças e validar navegação desktop/mobile.
- Testar health check e os fluxos afetados.
- Configurar segredos no provedor, nunca no Git.
- Confirmar backup recente do banco.
- Confirmar o host de `proxy_pass` na rede do ambiente.
- Verificar logs após a implantação.

## Segurança obrigatória

Configure `JWT_SECRET` longo e aleatório, credenciais exclusivas do PostgreSQL e nova senha administrativa. Restrinja CORS ao domínio real, habilite HTTPS e aplique rate limiting em login/cadastro. Os valores do Compose são apenas para desenvolvimento; os fallbacks da API também precisam ser removidos antes de dados reais.

## Publicação pelo GitHub

```bash
git pull --ff-only
git add .
git commit -m "descrição objetiva"
git push origin main
```

O push na `main` pode acionar o Easypanel. Confirme serviço, `/api/health` e uma página pública após o deploy.

## Backup e restauração

Exemplo conceitual, a adaptar ao ambiente:

```bash
pg_dump -Fc -U datta dattaconect > dattaconect.dump
pg_restore --clean --if-exists -U datta -d dattaconect dattaconect.dump
```

Teste a restauração em ambiente isolado e não versione dumps com dados pessoais.

## Diagnóstico rápido

- Site abre, API falha: confira proxy, rede Docker, API e PostgreSQL.
- API reinicia: confira logs e variáveis; há dez tentativas de conexão.
- Login falha: confira usuário ativo, hash, relógio e `JWT_SECRET`.
- Página volta à home: confira o HTML e `try_files`.
- Dados sumiram: confirme banco e volume montados.
