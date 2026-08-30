# Instruções permanentes para agentes

Este arquivo é a memória operacional do repositório para agentes de IA. Ele deve ser lido antes de analisar, alterar, testar ou publicar o projeto.

## Ordem de leitura obrigatória

1. `AGENTS.md` — regras permanentes deste repositório.
2. `docs/HISTORICO.md` — estado atual, decisões, riscos e próximos passos.
3. `docs/PROMPT_HISTORY.md` — histórico resumido das solicitações do usuário.
4. Documentos relacionados à tarefa:
   - `docs/ARQUITETURA.md`
   - `docs/MAPA_DO_SITE.md`
   - `docs/API_E_DADOS.md`
   - `docs/OPERACAO_E_DEPLOY.md`

## Continuidade obrigatória

Antes de começar:

- confira a branch, o último commit e o estado do Git;
- não apague nem sobrescreva alterações locais não relacionadas;
- compare a documentação com o código quando houver divergência;
- trate o código e a configuração executável como fonte técnica principal, registrando inconsistências encontradas.

Ao concluir uma tarefa relevante:

1. Atualize `docs/HISTORICO.md` com data, objetivo, mudanças, validações, decisões, pendências, próximo passo e commit quando disponível.
2. Acrescente em `docs/PROMPT_HISTORY.md` um resumo do pedido e do resultado. Não copie raciocínio interno, credenciais, tokens, dados pessoais ou todo o conteúdo do chat.
3. Atualize os demais documentos se a tarefa alterar arquitetura, páginas, rotas, banco, infraestrutura ou operação.
4. Execute validações proporcionais ao risco e registre o resultado.
5. Informe claramente o que foi ou não publicado.

## Política do histórico de prompts

- Registrar apenas solicitações que afetem o projeto ou suas decisões.
- Resumir o objetivo em linguagem clara; não é necessário armazenar o prompt literalmente.
- Preservar a ordem cronológica.
- Nunca registrar segredos, credenciais, chaves, tokens ou informações pessoais desnecessárias.
- Se o usuário corrigir uma solicitação anterior, registrar a correção como nova entrada sem apagar o histórico antigo.

## Convenções do projeto

- Idioma da documentação e dos commits: português, salvo exigência técnica.
- Codificação de texto: UTF-8.
- Segredos reais nunca devem ser versionados.
- URLs públicas amigáveis são servidas pelo Nginx sem a extensão `.html`.
- Alterações de páginas exigem revisão de `docs/MAPA_DO_SITE.md`.
- Alterações de endpoints ou tabelas exigem revisão de `docs/API_E_DADOS.md`.
- Alterações de contêineres, proxy ou deploy exigem revisão de `docs/ARQUITETURA.md` e `docs/OPERACAO_E_DEPLOY.md`.

## Segurança e publicação

- Não publicar credenciais padrão como se fossem adequadas à produção.
- Não executar operações destrutivas no banco ou nos arquivos sem autorização explícita.
- Antes de enviar para `main`, revisar o diff, executar os testes disponíveis e confirmar que nenhum segredo foi adicionado.
- Um pedido para modificar o projeto não autoriza automaticamente mudanças externas além do repositório. Publicar somente quando solicitado ou quando isso fizer parte explícita do fluxo em andamento.

## Definição de tarefa concluída

Uma tarefa só está concluída quando código/documentos solicitados foram criados, as validações pertinentes passaram, o histórico foi atualizado e o estado de publicação foi informado ao usuário.
