# Manual de Manutenção do Site

Este documento serve como guia rápido para você mesmo realizar manutenções, edições de texto, trocas de imagens e publicações no seu portfólio.

---

## 1. Como editar o site localmente (no seu computador)

1. **Abra o VS Code:** Acesse a pasta `c:\Visual Studio Code\Antigravity\portifolio-site`.
2. **Edite os arquivos:**
   - **`index.html`**: A página inicial (Home).
   - **`sobre.html`, `projetos.html`, etc**: As outras páginas.
   - **`style.css`**: Onde estão as cores, margens e fontes.
3. **Visualize as mudanças:** Clique duas vezes em qualquer arquivo `.html` para abrir no seu navegador e ver como ficou antes de mandar pro ar.

---

## 2. Como adicionar Novas Imagens

1. Salve a sua imagem dentro da pasta `assets/`. Dê nomes simples, sem espaços (ex: `projeto-financeiro.png`).
2. Abra o arquivo `.html` onde você quer colocar a imagem (ex: `projetos.html`).
3. Substitua a classe de marcação que eu deixei `<div class="img-placeholder">...</div>` pela imagem real usando a tag de imagem HTML:
   ```html
   <img src="assets/projeto-financeiro.png" alt="Descrição do projeto">
   ```

---

## 3. Como colocar as alterações no ar (Deploy via GitHub)

Como o Easypanel está vigiando o seu repositório no GitHub, você só precisa mandar os novos códigos para lá, e o site atualiza sozinho na internet!

1. Abra o **Terminal** do VS Code (Aperte `` Ctrl + ` `` ou vá em *Terminal > Novo Terminal*).
2. **⚠️ MUITO IMPORTANTE:** Certifique-se de que o terminal está dentro da pasta do site. O caminho no terminal deve terminar com `portifolio-site>`. Se não estiver, digite:
   ```bash
   cd portifolio-site
   ```
3. Rode estes três comandos na sequência, um de cada vez:
   
   ```bash
   # Prepara todos os arquivos modificados
   git add .

   # Salva com uma mensagem explicando o que você fez (edite o texto entre aspas)
   git commit -m "Troquei o texto da página sobre"

   # Envia para a nuvem
   git push
   ```

4. Aguarde de 1 a 2 minutos. O Easypanel vai puxar essas alterações lá na sua VPS e o seu site online estará atualizado!

---

## 4. Estrutura de Pastas Explicada
- `assets/` -> Onde ficam todas as suas imagens e ícones.
- `*.html` -> O esqueleto e os textos de cada página.
- `style.css` -> Onde a mágica do design e cores acontece.
- `script.js` -> Arquivo de interatividade (usado nas animações de scroll e no menu de celular).
- `Dockerfile` -> O arquivo de configuração do seu servidor no Easypanel (NÃO APAGUE, NEM EDITE).
- `.gitignore` -> Protege arquivos sensíveis de irem para a internet.
