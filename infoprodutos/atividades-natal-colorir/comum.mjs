// Peças comuns dos order bumps (caixinhas/ e papai-noel-passou/): cores, fundos dos temas, adesivos e PDF feito de imagens.
import { execFileSync } from "node:child_process";
import { writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { homedir } from "node:os";

export const CHROME = join(homedir(), "AppData/Local/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-win64/chrome-headless-shell.exe");

export const VERMELHO = "#d4332b", VERDE = "#1d5a3c", DOURADO = "#f5c542";
// Fundos em <pattern> de SVG (medidas em mm), só com cores opacas. Degradê de CSS vira "ShadingType 1" no PDF, e padrão
// com transparência apagava partes do desenho: os dois falham em vários leitores de PDF.
export const TEMAS = [
  { id: "papai-noel", base: VERMELHO, escuro: "#a92219", tam: 7, padrao: `<circle cx="1.75" cy="1.75" r="1" fill="#fbebea"/><circle cx="5.25" cy="5.25" r="1" fill="#fbebea"/>` },
  { id: "rena", base: VERDE, escuro: "#143f2a", tam: 9, padrao: `<rect width="9" height="2.5" fill="#824533"/><rect width="2.5" height="9" fill="#824533"/><rect width="2.5" height="2.5" fill="#af3b2e"/><rect y="5.5" width="9" height=".5" fill="#6c9480"/><rect y="5.5" width="2.5" height=".5" fill="#ae867a"/>` },
  { id: "boneco-de-neve", base: "#4f97d1", escuro: "#2c6a9e", tam: 9, padrao: `<circle cx="2.25" cy="2.25" r="1.3" fill="#fff"/><circle cx="6.75" cy="6.75" r=".7" fill="#d3e5f4"/>` },
  { id: "arvore", base: DOURADO, escuro: VERDE, tam: 7, giro: 45, padrao: `<rect width="2.5" height="7" fill="#fbe5aa"/>` },
];
export const PADROES = TEMAS.map(t => `<pattern id="pad-${t.id}" width="${t.tam}" height="${t.tam}" patternUnits="userSpaceOnUse"${t.giro ? ` patternTransform="rotate(${t.giro})"` : ""}>${t.padrao}</pattern>`).join("\n  ");

export const ESTRELA = "M0-10 2.9-4 9.5-3.1 4.7 1.5 5.9 8.1 0 5 -5.9 8.1 -4.7 1.5 -9.5-3.1 -2.9-4Z";
export const brilho =(x, y, r, cor = DOURADO) => `<path d="M${x},${y - r} Q${x + r * .15},${y - r * .15} ${x + r},${y} Q${x + r * .15},${y + r * .15} ${x},${y + r} Q${x - r * .15},${y + r * .15} ${x - r},${y} Q${x - r * .15},${y - r * .15} ${x},${y - r}Z" fill="${cor}"/>`;

// ---------- adesivos: desenho sem o fundo branco, com borda branca e sombra leve ----------
// Lê arte/<id>.webp e grava arte/<id>-adesivo.png, só para os que ainda não existem.
export function criarAdesivos(arte, ids) {
  const falta = ids.filter(id => !existsSync(join(arte, id + "-adesivo.png")));
  if (!falta.length) return;
  const fontes = Object.fromEntries(falta.map(id => [id, "data:image/webp;base64," + readFileSync(join(arte, id + ".webp")).toString("base64")]));
  const tmp = join(arte, "_adesivos.html");
  writeFileSync(tmp, `<!doctype html><body><pre id=o></pre><script>
const fontes=${JSON.stringify(fontes)};
const carregar=s=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.src=s;});
async function adesivo(src){
  const im=await carregar(src),W=im.width,H=im.height;
  const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');x.drawImage(im,0,0);
  const d=x.getImageData(0,0,W,H),p=d.data,visto=new Uint8Array(W*H),fila=[];
  for(let i=0;i<W;i++)fila.push(i,(H-1)*W+i);for(let j=0;j<H;j++)fila.push(j*W,j*W+W-1);
  // apaga o branco ligado à borda; o branco de dentro do contorno (barba, neve) fica
  while(fila.length){const k=fila.pop();if(visto[k])continue;visto[k]=1;const i=k*4;
    if(!(p[i]>225&&p[i+1]>225&&p[i+2]>225))continue;p[i+3]=0;const a=k%W,b=(k/W)|0;
    if(a>0)fila.push(k-1);if(a<W-1)fila.push(k+1);if(b>0)fila.push(k-W);if(b<H-1)fila.push(k+W);}
  x.putImageData(d,0,0);
  const R=34,P=R+30,h=document.createElement('canvas');h.width=W+2*P;h.height=H+2*P;const y=h.getContext('2d');
  for(const r of [R/2,R])for(let a=0;a<360;a+=6)y.drawImage(c,P+r*Math.cos(a*Math.PI/180),P+r*Math.sin(a*Math.PI/180));
  y.globalCompositeOperation='source-in';y.fillStyle='#fff';y.fillRect(0,0,h.width,h.height);
  const f=document.createElement('canvas');f.width=h.width;f.height=h.height;const z=f.getContext('2d');
  z.shadowColor='rgba(0,0,0,.28)';z.shadowBlur=18;z.shadowOffsetY=8;z.drawImage(h,0,0);
  z.shadowColor='transparent';z.drawImage(c,P,P);
  const o=document.createElement('canvas');o.width=900;o.height=Math.round(900*f.height/f.width);
  const q=o.getContext('2d');q.imageSmoothingQuality='high';q.drawImage(f,0,0,o.width,o.height);
  return o.toDataURL('image/png');
}
(async()=>{const r={};for(const k in fontes)r[k]=await adesivo(fontes[k]);document.getElementById('o').textContent=JSON.stringify(r);})();
</script></body>`);
  const dom = execFileSync(CHROME, ["--headless", "--disable-gpu", "--virtual-time-budget=60000", "--dump-dom", pathToFileURL(tmp).href], { maxBuffer: 1 << 29 }).toString();
  rmSync(tmp); // leva os desenhos em base64: não fica na pasta
  const prontos = JSON.parse(dom.match(/<pre id="o">([^<]*)<\/pre>/)[1].replace(/&quot;/g, '"'));
  for (const [id, url] of Object.entries(prontos)) writeFileSync(join(arte, id + "-adesivo.png"), Buffer.from(url.split(",")[1], "base64"));
  console.log("adesivos:", Object.keys(prontos).join(", "));
}

// Print da URL em PNG. Página A4 a 300 dpi: foto(url, saida, 794, 1123, 3.125).
export const foto = (url, saida, w, h, escala = 1) => execFileSync(CHROME, ["--headless", "--disable-gpu", "--hide-scrollbars", "--virtual-time-budget=8000", `--window-size=${w},${h}`, `--force-device-scale-factor=${escala}`, "--screenshot=" + saida, url], { stdio: "ignore" });

// Cada página vira imagem de 300 dpi e o PDF só junta as imagens. Impresso direto em vetor, leitores como o pdf.js
// apagavam partes da página (o "Para/De"); a imagem sai igual em qualquer leitor e impressora.
export function juntarPdf(pasta, imagens, pdf, titulo) {
  const juntar = join(pasta, "_juntar.html");
  writeFileSync(juntar, `<!doctype html><html><head><meta charset="utf-8"><title>${titulo}</title><style>@page { size: A4; margin: 0; } body { margin: 0; } img { display: block; width: 210mm; height: 297mm; break-after: page; }</style></head><body>
${imagens.map(i => `<img src="${i}" alt="">`).join("\n")}</body></html>`);
  execFileSync(CHROME, ["--headless", "--disable-gpu", "--virtual-time-budget=15000", "--no-pdf-header-footer", "--print-to-pdf=" + pdf, pathToFileURL(juntar).href], { stdio: "ignore" });
  rmSync(juntar);
}
