# Produto na Kiwify: o que preencher

Criado em 2026-10-19. Copie e cole cada campo.

| Campo | O que colocar |
|---|---|
| **Nome do produto** | Sua Frutífera Vai Dar Fruto |
| **Preço** | R$ 20,00 |
| **Garantia** | 7 dias |
| **Imagem do produto** | `kiwify/capa-produto-300x250.png` (1080x900, a proporção 300x250 que a Kiwify recomenda). A quadrada `capa-produto.png` fica para outros usos |
| **Categoria** | Animais e Plantas |
| **Arquivo** | `ebook/sua-frutifera-vai-dar-fruto.pdf` (gere de novo com `node montar-pdf.mjs` dentro de `diagramacao/` se tiver editado algum capítulo) |
| **Página de vendas** | Ainda não publicada. Deixe em branco se der; se for obrigatório, ver o passo a passo |

**Descrição curta** (aparece no checkout; a Kiwify pede pelo menos 100 caracteres):

> Guia em PDF para a sua frutífera em vaso sair do "só folha" para a colheita: os 7 erros que
> impedem o fruto e como corrigir cada um.

**Descrição completa:**

> Sua planta cresce, fica bonita… e não dá um fruto? Quase sempre é um destes 7 erros: muda de
> semente, vaso errado, pouco sol, rega errada, adubo só de folha, poda na hora errada ou falta
> de polinização.
>
> Neste guia você aprende a reconhecer cada erro na sua planta e a corrigir: como escolher a muda,
> o vaso e o substrato, como plantar, regar, adubar e podar, e o que fazer da flor ao fruto.
>
> O que vem no guia:
> - 12 capítulos, do diagnóstico às pragas e doenças
> - Fichas de 12 frutíferas que dão bem em vaso (jabuticaba, acerola, limão, figo, maracujá e outras)
> - 4 bônus para imprimir: checklist "Minha planta não dá fruto", calendário mês a mês, ficha de
>   acompanhamento do vaso e tabela de 30 frutíferas para vaso
> - Informações conferidas em publicações da Embrapa e de universidades, com a fonte no fim de
>   cada capítulo

**Na área de membros:**

- Módulo: `Seu guia`
- Aula: `Baixe o seu ebook`, com o PDF anexado e este texto:

> Obrigado pela compra! Baixe o PDF abaixo. Ele abre no celular e no computador, e os 4 bônus
> (no fim do arquivo) estão em tamanho A4, prontos para imprimir.
>
> Comece pelo Capítulo 1 e pelo Bônus 1 (Checklist "Minha planta não dá fruto").

---

Gerar a capa de novo (dentro de `kiwify/`, no Git Bash). O tamanho da imagem é o `--window-size`:
`1080,900` para a da Kiwify, `1080,1080` para a quadrada.

```bash
"$HOME/AppData/Local/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-win64/chrome-headless-shell.exe" --headless --hide-scrollbars --window-size=1080,900 --virtual-time-budget=8000 --screenshot=capa-produto-300x250.png "file:///G:/GLSM/infoprodutos/frutiferas-em-vaso/kiwify/capa.html"
```
