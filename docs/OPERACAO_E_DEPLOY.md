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
docker compose logs frontend
```

Encerre sem apagar o banco com `docker compose down`. Não use `down -v` salvo quando houver intenção explícita de apagar o volume PostgreSQL.

## Checklist antes do deploy

- Revisar mudanças e validar navegação desktop/mobile.
- Testar health check e os fluxos afetados.
- Configurar segredos no provedor, nunca no Git.
- Confirmar backup recente do banco.
- Confirmar que Nginx e API iniciaram nos logs do mesmo serviço.
- Verificar logs após a implantação.

## Segurança obrigatória

Configure `JWT_SECRET` longo e aleatório, credenciais exclusivas do PostgreSQL e nova senha administrativa. Restrinja CORS ao domínio real, habilite HTTPS e aplique rate limiting em login/cadastro. Os valores do Compose são apenas para desenvolvimento; os fallbacks da API também precisam ser removidos antes de dados reais.

## Variáveis obrigatórias no Easypanel

O serviço construído pelo `Dockerfile` da raiz já contém site e API. Configure nele:

```text
DATABASE_URL=postgresql://USUARIO:SENHA@HOST:5432/BANCO
JWT_SECRET=um-segredo-longo-aleatorio-e-exclusivo
ADMIN_EMAIL=email-do-administrador
ADMIN_PASSWORD=senha-forte-com-no-minimo-12-caracteres
DB_SSL=true
```

O Easypanel pode definir `PORT=80` automaticamente para a porta pública. A API ignora esse valor no processo supervisionado e usa internamente a porta `3001`; não altere `API_PORT=3001`.

Use `DB_SSL=false` apenas se o PostgreSQL interno não exigir TLS. A aplicação sincroniza a conta indicada por `ADMIN_EMAIL` em cada inicialização.

Depois do deploy, valide `/api/health`, entre em `/login` com as variáveis administrativas e confirme o redirecionamento para `/admin`. No painel, cadastre primeiro o curso, depois seus módulos e aulas.

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
- Log mostra `host not found in upstream`: confirme que `API_HOST` não foi sobrescrito; no deploy integrado ele deve ser `127.0.0.1`.
- API reinicia: confira logs e variáveis; há dez tentativas de conexão.
- Erro `EADDRINUSE :::80`: confirme que o deploy contém a versão atual de `supervisord.conf`, que fixa a API em `3001` enquanto o Nginx ocupa a porta `80`.
- Login falha: confira usuário ativo, hash, relógio e `JWT_SECRET`.
- Página volta à home: confira o HTML e `try_files`.
- Dados sumiram: confirme banco e volume montados.
