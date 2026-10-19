// Monta o PDF do ebook a partir dos .md da pasta do ebook.
// Uso: node montar-pdf.mjs   (gera ../ebook/sua-frutifera-vai-dar-fruto.pdf)
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";
import { homedir } from "node:os";

const AQUI = dirname(fileURLToPath(import.meta.url));
const PASTA = join(AQUI, "..");
const SAIDA = join(PASTA, "ebook");
const HTML = join(SAIDA, "sua-frutifera-vai-dar-fruto.html");
const PDF = join(SAIDA, "sua-frutifera-vai-dar-fruto.pdf");
const CHROME = join(homedir(), "AppData/Local/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-win64/chrome-headless-shell.exe");

// ---------- Markdown -> HTML (só o que os capítulos usam) ----------
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function inline(s) {
  s = esc(s);
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return s;
}
function itemTexto(s) {
  if (s.startsWith("[ ] ")) return '<span class="caixa">☐</span> ' + inline(s.slice(4));
  if (s.startsWith("[x] ")) return '<span class="caixa">☑</span> ' + inline(s.slice(4));
  return inline(s);
}
function renderLista(lista) {
  const itens = lista.itens.map((it) => `<li>${itemTexto(it.texto)}${it.filhas.map(renderLista).join("")}</li>`).join("");
  return `<${lista.tipo}>${itens}</${lista.tipo}>`;
}
function md(texto) {
  const linhas = texto.replace(/\r/g, "").split("\n");
  const out = [];
  let i = 0;
  const marca = /^(\s*)([-*]|\d+\.)\s+(.*)$/;
  while (i < linhas.length) {
    const l = linhas[i];
    if (!l.trim()) { i++; continue; }
    let m;
    if ((m = l.match(/^(#{1,4})\s+(.*)$/))) { out.push(`<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`); i++; continue; }
    if (/^---\s*$/.test(l)) { out.push('<hr>'); i++; continue; }
    if (l.trim().startsWith("|")) {
      const rows = [];
      while (i < linhas.length && linhas[i].trim().startsWith("|")) rows.push(linhas[i++]);
      const cel = (r) => r.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      const [cab, , ...corpo] = rows;
      const thead = cel(cab).some(Boolean) ? `<thead><tr>${cel(cab).map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead>` : "";
      out.push(`<table>${thead}<tbody>${corpo.map((r) => `<tr>${cel(r).map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`);
      continue;
    }
    if (marca.test(l)) {
      const raiz = { indent: -1, itens: [], tipo: "ul" };
      const pilha = [];
      while (i < linhas.length && linhas[i].trim() && (marca.test(linhas[i]) || /^\s+\S/.test(linhas[i]))) {
        const x = linhas[i].match(marca);
        if (x) {
          const indent = x[1].length, tipo = /\d/.test(x[2]) ? "ol" : "ul";
          while (pilha.length && pilha[pilha.length - 1].indent > indent) pilha.pop();
          let topo = pilha[pilha.length - 1];
          if (!topo || indent > topo.indent) {
            const nova = { indent, tipo, itens: [] };
            if (topo) topo.itens[topo.itens.length - 1].filhas.push(nova); else raiz.itens.push(nova);
            pilha.push(nova); topo = nova;
          }
          topo.itens.push({ texto: x[3], filhas: [] });
        } else {
          const topo = pilha[pilha.length - 1];
          topo.itens[topo.itens.length - 1].texto += " " + linhas[i].trim();
        }
        i++;
      }
      out.push(raiz.itens.map(renderLista).join(""));
      continue;
    }
    const par = [];
    while (i < linhas.length && linhas[i].trim() && !/^(#{1,4}\s|---\s*$|\|)/.test(linhas[i].trim()) && !marca.test(linhas[i])) par.push(linhas[i++].trim());
    out.push(`<p>${inline(par.join(" "))}</p>`);
  }
  return out.join("\n");
}

// ---------- Capítulos ----------
const arquivos = readdirSync(PASTA).filter((f) => /^(00-introducao|cap-\d\d|bonus-\d\d).*\.md$/.test(f)).sort((a, b) => {
  const ordem = (f) => (f.startsWith("00") ? 0 : f.startsWith("cap") ? 1 : 2);
  return ordem(a) - ordem(b) || a.localeCompare(b);
});

const capitulos = arquivos.map((f, n) => {
  let txt = readFileSync(join(PASTA, f), "utf8").replace(/\r/g, "");
  if (f.startsWith("00")) txt = "# Introdução\n" + txt.slice(txt.indexOf("## Introdução") + "## Introdução".length);
  const titulo = txt.match(/^#\s+(.*)$/m)[1];
  txt = txt.replace(/^#\s+.*$/m, "");
  // Separa a lista de fontes do fim do capítulo
  const corte = txt.search(/^## Fontes? de(ste|sta) /m);
  const corpo = corte >= 0 ? txt.slice(0, corte) : txt;
  const fontes = corte >= 0 ? txt.slice(corte) : "";
  const [rotulo, nome] = titulo.includes(" — ") ? titulo.split(" — ") : ["", titulo];
  return { id: `c${n}`, titulo, rotulo, nome, corpo: md(corpo.replace(/^\s*---\s*/, "")), fontes: fontes ? md(fontes) : "" };
});

function montarHtml(paginas = {}) {
  const sumario = capitulos.map((c) => `<li><a href="#${c.id}"><span class="s-rotulo">${esc(c.rotulo)}</span> <span class="s-nome">${esc(c.nome)}</span><span class="s-pag">${paginas[c.id] ?? ""}</span></a></li>`).join("");
  const corpo = capitulos.map((c) => `
<section class="capitulo${c.rotulo.startsWith("Bônus") ? " imprimir" : ""}" id="${c.id}">
  <header class="abre"><span class="marca">@@${c.id}@@</span>${c.rotulo ? `<div class="rotulo">${esc(c.rotulo)}</div>` : ""}<h1>${esc(c.nome)}</h1></header>
  ${c.corpo}
  ${c.fontes ? `<div class="fontes">${c.fontes}</div>` : ""}
</section>`).join("\n");
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Sua Frutífera Vai Dar Fruto</title>
<style>${readFileSync(join(AQUI, "estilo.css"), "utf8")}</style></head><body>
<section class="capa">
  <div class="capa-topo">Guia prático de frutíferas em vaso</div>
  <h1>Sua Frutífera<br>Vai Dar Fruto</h1>
  <p class="capa-sub">Do vaso à colheita, mesmo em apartamento</p>
  <svg viewBox="0 0 110 110" width="190" height="190" aria-hidden="true">
    <circle cx="55" cy="38" r="30" fill="#4f9a5c"/><circle cx="40" cy="32" r="6" fill="#f2a33a"/>
    <circle cx="66" cy="28" r="6" fill="#f2a33a"/><circle cx="58" cy="48" r="6" fill="#f2a33a"/>
    <rect x="52" y="60" width="6" height="18" fill="#7a5233"/><path d="M30 76 h50 l-6 28 h-38 z" fill="#c8794a"/>
  </svg>
  <p class="capa-base">12 capítulos · 12 fichas de frutíferas · 4 bônus para imprimir<br>Com fontes da Embrapa e de universidades</p>
</section>
<section class="aviso-pag">
  <p><strong>Sua Frutífera Vai Dar Fruto</strong><br>Do vaso à colheita, mesmo em apartamento</p>
  <p>Este guia é um material de orientação para cultivo doméstico. Ele não substitui a avaliação de um engenheiro agrônomo, principalmente em casos de doença grave ou quando for necessário usar agrotóxico, que exige receita agronômica. Siga sempre o rótulo dos produtos que usar.</p>
  <p>As informações técnicas foram conferidas nas fontes listadas no fim de cada capítulo.</p>
  <p>Todos os direitos reservados. É proibido copiar, distribuir ou revender este material sem autorização.</p>
</section>
<section class="sumario"><h1>Sumário</h1><ol>${sumario}</ol></section>
${corpo}
</body></html>`;
}

function gerarPdf(html) {
  writeFileSync(HTML, html);
  execFileSync(CHROME, ["--headless", "--disable-gpu", "--no-pdf-header-footer", `--print-to-pdf=${PDF}`, pathToFileURL(HTML).href], { stdio: "ignore" });
}

mkdirSync(SAIDA, { recursive: true });
if (!existsSync(CHROME)) throw new Error("Chromium do Playwright não encontrado em " + CHROME);

// 1ª passada: descobre em que página cada capítulo começa, pela marca invisível @@id@@ na abertura
gerarPdf(montarHtml());
const paginasTexto = execFileSync("pdftotext", ["-enc", "UTF-8", PDF, "-"], { encoding: "utf8" }).split("\f");
const paginas = {};
for (const c of capitulos) {
  const p = paginasTexto.findIndex((t) => t.includes(`@@${c.id}@@`));
  if (p >= 0) paginas[c.id] = p + 1;
}
// 2ª passada: sumário com os números de página
gerarPdf(montarHtml(paginas));

// Checagem: nenhum capítulo sem página e nenhum markdown cru sobrando
const faltando = capitulos.filter((c) => !paginas[c.id]).map((c) => c.titulo);
const htmlFinal = readFileSync(HTML, "utf8");
console.assert(faltando.length === 0, "Capítulos sem página no sumário: " + faltando.join(", "));
console.assert(!/\*\*|^\s*\|/m.test(htmlFinal.replace(/<style>[\s\S]*?<\/style>/, "")), "Sobrou markdown sem converter no HTML");
console.log(`PDF: ${PDF}\nPáginas: ${paginasTexto.length - 1}\nCapítulos no sumário: ${Object.keys(paginas).length}/${capitulos.length}`);
