// Banner do cabeçalho do checkout da Wiapy: a capa do kit (img/capa.webp, a mesma do topo da página de venda) à
// esquerda, sumindo no verde com neve da página, e à direita o nome e o que vem no kit, nas fontes da página.
// O checkout é aberto quase sempre no celular (~340 px de largura), então o texto é grande: o título sai com ~26 px
// e as linhas com ~15 px na tela do celular.
// Gera pagina-de-venda/img/banner-checkout.webp (1440x640), servido em
// https://natal-magico-gamma.vercel.app/img/banner-checkout.webp e colado no elemento Imagem do cabeçalho do checkout.
// Uso (nesta pasta): node banner-checkout.mjs
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { CHROME, VERDE, DOURADO, VERMELHO } from "./comum.mjs";

const AQUI = import.meta.dirname;
const IMG = join(AQUI, "pagina-de-venda", "img");
const capa = "data:image/webp;base64," + readFileSync(join(IMG, "capa.webp")).toString("base64");
const L = 1080, A = 480, ESCALA = 4 / 3; // sai com 1440x640

const linha = (n, txt) => `<div class="linha"><span class="n">${n}</span>${txt}</div>`;
const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Nunito:wght@700;800&display=block" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; }
  body { width: ${L}px; height: ${A}px; overflow: hidden; }
  .b { position: relative; width: ${L}px; height: ${A}px; overflow: hidden;
    background-color: ${VERDE};
    background-image:
      radial-gradient(circle at 20% 30%, rgba(255,255,255,.16) 3px, transparent 4px),
      radial-gradient(circle at 70% 60%, rgba(255,255,255,.11) 3px, transparent 4px),
      radial-gradient(ellipse at 78% 40%, #2a7a52 0%, transparent 65%);
    background-size: 70px 70px, 105px 105px, 100% 100%; }
  .foto { position: absolute; left: 0; top: 0; width: 520px; height: ${A}px; object-fit: cover; object-position: 0% 50%;
    -webkit-mask-image: linear-gradient(90deg, #000 68%, transparent 100%); mask-image: linear-gradient(90deg, #000 68%, transparent 100%); }
  .texto { position: absolute; left: 530px; right: 26px; top: 0; bottom: 0; display: flex; flex-direction: column; justify-content: center; }
  .selo { align-self: flex-start; font: 800 24px/1 Nunito, sans-serif; letter-spacing: .06em; color: ${VERDE}; background: ${DOURADO};
    padding: 9px 18px; border-radius: 99px; margin-bottom: 14px; box-shadow: 0 3px 0 #c99a1e; }
  h1 { font: 700 84px/1 Fredoka, sans-serif; color: #fff; text-shadow: 0 4px 0 #143f2a, 0 8px 22px rgba(0,0,0,.35); margin-bottom: 22px; white-space: nowrap; }
  h1 em { font-style: normal; color: ${DOURADO}; }
  .linha { display: flex; align-items: center; gap: 16px; font: 800 46px/1 Nunito, sans-serif; color: #fdf8ee; margin-top: 14px; }
  .n { display: inline-flex; align-items: center; justify-content: center; min-width: 76px; height: 56px; padding: 0 10px; border-radius: 16px;
    font: 700 40px/1 Fredoka, sans-serif; color: #fff; background: ${VERMELHO}; box-shadow: 0 4px 0 #a92219; }
  .faixa { position: absolute; left: 0; right: 0; bottom: 0; height: 10px;
    background: repeating-linear-gradient(135deg, ${VERMELHO} 0 22px, #fff 22px 44px); }
</style></head><body><div class="b">
  <img class="foto" src="${capa}">
  <div class="texto">
    <div class="selo">KIT DIGITAL PARA IMPRIMIR</div>
    <h1>Natal <em>Mágico</em></h1>
    ${linha(15, "desenhos")}
    ${linha(20, "moldes")}
    ${linha(10, "atividades")}
  </div>
  <div class="faixa"></div>
</div></body></html>`;

const tmpHtml = join(AQUI, "_banner.html"), tmpPng = join(AQUI, "_banner.png");
writeFileSync(tmpHtml, html);
execFileSync(CHROME, ["--headless", "--disable-gpu", "--hide-scrollbars", `--window-size=${L},${A}`,
  `--force-device-scale-factor=${ESCALA}`, "--virtual-time-budget=8000", "--screenshot=" + tmpPng, pathToFileURL(tmpHtml).href], { stdio: "ignore" });

// PNG -> WebP pelo canvas do próprio Chrome (sem programa extra), qualidade 0,86
const png = "data:image/png;base64," + readFileSync(tmpPng).toString("base64");
writeFileSync(tmpHtml, `<!doctype html><body><pre id=o></pre><script>
const i=new Image();i.onload=()=>{const c=document.createElement('canvas');c.width=i.width;c.height=i.height;
c.getContext('2d').drawImage(i,0,0);document.getElementById('o').textContent=c.toDataURL('image/webp',0.86);};i.src=${JSON.stringify(png)};
</script>`);
const dom = execFileSync(CHROME, ["--headless", "--disable-gpu", "--virtual-time-budget=5000", "--dump-dom", pathToFileURL(tmpHtml).href],
  { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
rmSync(tmpHtml); rmSync(tmpPng);
const b64 = dom.match(/data:image\/webp;base64,([A-Za-z0-9+/=]+)/)[1];
const saida = join(IMG, "banner-checkout.webp");
writeFileSync(saida, Buffer.from(b64, "base64"));
console.log(saida, Math.round(Buffer.from(b64, "base64").length / 1024) + " KB");
