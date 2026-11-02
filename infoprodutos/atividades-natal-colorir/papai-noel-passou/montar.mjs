// Monta o order bump Kit "Papai Noel passou aqui" (A4, colorido): roteiro para os adultos, carta, certificado, placa,
// bilhetes, etiquetas e molde de pegadas. Gera kit.html, ../entregaveis/Kit Papai Noel passou aqui.pdf, previa/p<N>.png e
// as imagens da Wiapy. Uso: node montar.mjs   (dentro desta pasta)
// O Papai Noel escrevendo veio do GPT (arte/papai-noel-escrevendo.webp); os outros personagens são os das caixinhas.
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { VERMELHO, VERDE, DOURADO, TEMAS, PADROES, ESTRELA, brilho, criarAdesivos, foto, juntarPdf } from "../comum.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
criarAdesivos(join(AQUI, "arte"), ["papai-noel-escrevendo"]);
criarAdesivos(join(AQUI, "..", "caixinhas", "arte"), TEMAS.map(t => t.id));

const CONT = "#2b1d17", CREME = "#fdf8ee";
const ESCREVENDO = "arte/papai-noel-escrevendo-adesivo.png";
const ades = id => `../caixinhas/arte/${id}-adesivo.png`;
const f2 = n => +n.toFixed(2);
const tr = (w = 1.2) => `stroke="${CONT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const fundo = (t, w, h) => `<svg class="fundo" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><rect width="${w}" height="${h}" fill="${t.base}"/><rect width="${w}" height="${h}" fill="url(#pad-${t.id})"/></svg>`;
const imagem = (src, x, y, w, h = w, extra = "") => `<image href="${src}" x="${x}" y="${y}" width="${w}" height="${h}" ${extra}/>`;

// gerador pseudoaleatório com semente fixa: os flocos de neve saem sempre no mesmo lugar
let semente = 7;
const acaso = () => (semente = (semente * 16807) % 2147483647) / 2147483647;

// ---------- desenhos em código ----------
const FOLHA = "M0,0 Q3,-4.5 5,-2.2 Q7.5,-6.5 10,-3 Q12.5,-6.5 15,-2.2 Q17,-4.5 21,0 Q17,4.5 15,2.2 Q12.5,6.5 10,3 Q7.5,6.5 5,2.2 Q3,4.5 0,0Z";
const azevinho = (x, y, giro, esc = 1) => `<g transform="translate(${x} ${y}) rotate(${giro}) scale(${esc})" filter="url(#sombra-leve)">
  ${[-150, -30, -95].map(a => `<g transform="rotate(${a})"><path d="${FOLHA}" fill="#2f7d4f" ${tr(.7)}/><path d="M2,0 L19,0" stroke="${VERDE}" stroke-width=".6"/></g>`).join("")}
  ${[[-2.6, -.6], [2.6, -.6], [0, 2.8]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="2.7" fill="${VERMELHO}" ${tr(.6)}/><circle cx="${a - .8}" cy="${b - .9}" r=".7" fill="#fff" opacity=".8"/>`).join("")}</g>`;

// selo de cera dourado com estrela
const selo = (x, y, r) => {
  const borda = Array.from({ length: 120 }, (_, k) => { const a = k / 120 * 2 * Math.PI, rr = r * (.92 + .08 * Math.cos(13 * a)); return `${f2(x + rr * Math.cos(a))},${f2(y + rr * Math.sin(a))}`; }).join(" ");
  return `<g filter="url(#sombra-leve)"><polygon points="${borda}" fill="url(#ouro)" ${tr(r * .035)}/><circle cx="${x}" cy="${y}" r="${f2(r * .66)}" fill="none" stroke="#b8860b" stroke-width="${f2(r * .05)}"/>
    <path d="${ESTRELA}" transform="translate(${x} ${y}) scale(${f2(r * .052)})" fill="#fff3c4" stroke="#b8860b" stroke-width="1"/></g>`;
};

// carimbo redondo do correio do Polo Norte
const carimbo = (id, x, y, r, giro, cor = VERMELHO) => `<g transform="translate(${x} ${y}) rotate(${giro})" opacity=".85">
  <path id="arco-${id}" d="M${f2(-r * .69)},${f2(r * .4)} A${f2(r * .8)},${f2(r * .8)} 0 1 1 ${f2(r * .69)},${f2(r * .4)}" fill="none"/>
  <circle r="${r}" fill="none" stroke="${cor}" stroke-width="${f2(r * .06)}"/><circle r="${f2(r * .62)}" fill="none" stroke="${cor}" stroke-width="${f2(r * .03)}"/>
  <text class="svg-t" font-size="${f2(r * .19)}" fill="${cor}" letter-spacing="${f2(r * .01)}"><textPath href="#arco-${id}" startOffset="50%" text-anchor="middle">CORREIO DO POLO NORTE</textPath></text>
  <text y="${f2(-r * .02)}" class="svg-t" font-size="${f2(r * .28)}" fill="${cor}">24 DEZ</text><text y="${f2(r * .3)}" class="svg-t" font-size="${f2(r * .24)}" fill="${cor}">2026</text>
  ${[0, 1, 2].map(k => brilho(f2((k - 1) * r * .32), f2(r * .78), f2(r * .07), cor)).join("")}
  ${[-.34, 0, .34].map(k => `<path d="M${f2(r * 1.1)},${f2(k * r)} q${f2(r * .2)},${f2(-r * .14)} ${f2(r * .4)},0 t${f2(r * .4)},0 t${f2(r * .4)},0" fill="none" stroke="${cor}" stroke-width="${f2(r * .045)}"/>`).join("")}</g>`;

// pegada de rena: 2 dedos do casco e as 2 unhinhas de trás
const casco = (x, y, esc, giro, cor = "#7a4a2a") => `<g transform="translate(${x} ${y}) rotate(${giro}) scale(${esc})" fill="${cor}"><path d="M-.7,-7 C-5.5,-6.5 -7,-.5 -6.2,3.5 C-5.6,6.8 -2.4,7.6 -.7,5.6Z"/><path d="M.7,-7 C5.5,-6.5 7,-.5 6.2,3.5 C5.6,6.8 2.4,7.6 .7,5.6Z"/><ellipse cx="-4.6" cy="10.2" rx="1.4" ry="1.7"/><ellipse cx="4.6" cy="10.2" rx="1.4" ry="1.7"/></g>`;

// forma mordida: a máscara tira os círculos das mordidas e o contorno delas é redesenhado só do lado que sobrou
let nMordida = 0;
const mordido = (d, conteudo, esp, mordidas, rm) => {
  const id = "mord" + ++nMordida, furos = mordidas.map(([x, y]) => `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(rm)}"/>`).join("");
  return `<mask id="${id}" maskUnits="userSpaceOnUse" x="-500" y="-500" width="1000" height="1000"><rect x="-500" y="-500" width="1000" height="1000" fill="#fff"/><g fill="#000">${furos}</g></mask><clipPath id="${id}c"><path d="${d}"/></clipPath>
    <g mask="url(#${id})">${conteudo}<g clip-path="url(#${id}c)" fill="none" stroke="${CONT}" stroke-width="${f2(esp * 2)}">${furos}</g></g>`;
};

// biscoito de gotas de chocolate, com ou sem mordida
const biscoito = (x, y, R, mordida = true, achatar = 1) => {
  const d = `M${-R},0 A${R},${R} 0 1 1 ${R},0 A${R},${R} 0 1 1 ${-R},0Z`, P = a => [R * Math.cos(a * Math.PI / 180), R * Math.sin(a * Math.PI / 180)];
  const corpo = `<path d="${d}" fill="#dfa25a" ${tr(R * .07)}/><circle r="${f2(R * .78)}" fill="none" stroke="#cf9048" stroke-width="${f2(R * .05)}"/>
    ${[[-.42, -.28], [.08, .38], [-.3, .46], [.46, .22], [-.04, -.08], [-.55, .12]].map(([a, b]) => `<circle cx="${f2(a * R)}" cy="${f2(b * R)}" r="${f2(R * .1)}" fill="#5a3220"/>`).join("")}`;
  return `<g transform="translate(${x} ${y}) scale(1 ${achatar})" filter="url(#sombra-leve)">${mordida ? mordido(d, corpo, R * .07, [-62, -38, -14].map(P), R * .27) : corpo}
    ${mordida ? [[1.18, -.98], [1.4, -.4], [.7, -1.38]].map(([a, b]) => `<circle cx="${f2(a * R)}" cy="${f2(b * R)}" r="${f2(R * .07)}" fill="#dfa25a" ${tr(R * .03)}/>`).join("") : ""}</g>`;
};

// copo de leite (cheio ou só com o restinho)
const copo = (x, y, h, cheio = true) => {
  const a = f2(h * .33), b = f2(h * .27), m = cheio ? h * .14 : h * .8, am = f2(a - (a - b) * m / h);
  return `<g transform="translate(${x} ${y})" filter="url(#sombra-leve)"><path d="M${-a},0 L${a},0 L${b},${h} L${-b},${h}Z" fill="#e3f0fa"/>
    <path d="M${-am},${f2(m)} L${am},${f2(m)} L${b},${h} L${-b},${h}Z" fill="#fff"/><ellipse cy="${f2(m)}" rx="${am}" ry="${f2(h * .05)}" fill="#f4f8fb" stroke="#c9dbe8" stroke-width="${f2(h * .02)}"/>
    <path d="M${-a},0 L${a},0 L${b},${h} L${-b},${h}Z" fill="none" ${tr(h * .035)}/><path d="M${f2(-a * .6)},${f2(h * .2)} L${f2(-b * .6)},${f2(h * .85)}" stroke="#fff" stroke-width="${f2(h * .05)}" stroke-linecap="round" opacity=".9"/></g>`;
};

// cenoura deitada, com a ponta mordida ou inteira
const CENOURA = "M0,-7 Q22,-6 40,0 Q22,6 0,7 Q-2.5,0 0,-7Z";
const cenoura = (x, y, esc, giro, mordida = false) => {
  const corpo = `<path d="${CENOURA}" fill="#f08a24" ${tr(.8)}/>${[[6, -5.8, 9.5, -3.6], [14, 4.2, 17.5, 2.2], [21, -3.8, 24, -2.2], [28, 2.4, 30.5, 1.2]].map(([a, b, c, d]) => `<path d="M${a},${b} L${c},${d}" stroke="#c4621a" stroke-width=".8" stroke-linecap="round"/>`).join("")}`;
  return `<g transform="translate(${x} ${y}) rotate(${giro}) scale(${esc})" filter="url(#sombra-leve)">
  ${[-30, 0, 30].map(a => `<path d="M1,0 C-3,-3.6 -10,-4.6 -15,-2 C-10,.6 -3,1.4 1,0Z" transform="rotate(${a})" fill="#3f9a52" ${tr(.7)}/>`).join("")}
  ${mordida ? mordido(CENOURA, corpo, .4, [[35, -3.2], [34, 3.4], [38.5, .2]], 4.4) : corpo}</g>`;
};

// presente com fita e laço
const presente = (x, y, w, h, cor, fita) => `<g transform="translate(${x} ${y})" filter="url(#sombra-leve)">
  <rect y="${f2(h * .24)}" width="${w}" height="${f2(h * .76)}" fill="${cor}" ${tr(.9)}/><rect x="-1.5" y="${f2(h * .1)}" width="${w + 3}" height="${f2(h * .18)}" rx="1" fill="${cor}" ${tr(.9)}/>
  <rect x="${f2(w / 2 - 2)}" y="${f2(h * .1)}" width="4" height="${f2(h * .9)}" fill="${fita}" ${tr(.6)}/>
  <ellipse cx="${f2(w / 2 - 4.5)}" cy="${f2(h * .06)}" rx="5" ry="3" transform="rotate(-20 ${f2(w / 2 - 4.5)} ${f2(h * .06)})" fill="${fita}" ${tr(.7)}/><ellipse cx="${f2(w / 2 + 4.5)}" cy="${f2(h * .06)}" rx="5" ry="3" transform="rotate(20 ${f2(w / 2 + 4.5)} ${f2(h * .06)})" fill="${fita}" ${tr(.7)}/><circle cx="${f2(w / 2)}" cy="${f2(h * .08)}" r="1.8" fill="${fita}" ${tr(.6)}/></g>`;

// miniatura de uma página do kit (a prévia de verdade), com sombra
const mini = (n, x, y, w, giro = 0) => { const h = f2(w * 297 / 210), x0 = f2(-w / 2), y0 = f2(-h / 2); return `<g transform="translate(${x} ${y}) rotate(${giro})" filter="url(#sombra-pag)">${imagem(`previa/p${n}.png`, x0, y0, w, h, `preserveAspectRatio="none"`)}<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="none" stroke="#d9cfc3" stroke-width=".3"/></g>`; };
const fita = (x, y, giro) => `<rect x="${x - 7}" y="${y - 2.2}" width="14" height="4.4" fill="#f6e3a1" opacity=".88" transform="rotate(${giro} ${x} ${y})"/>`;

// sola da bota do Papai Noel (pé direito, bico para cima), numa caixa de 100 x 250 mm
const BOTA = "M46,3 C70,1 90,18 94,46 C97,68 92,88 85,104 C80,116 78,128 79,148 L24,148 C24,130 20,116 14,102 C6,84 3,62 6,42 C9,20 25,4 46,3Z";
const SALTO = "M23,160 L80,160 C82,182 82,206 77,224 C72,240 30,240 25,224 C20,206 20,182 23,160Z";
// pegadas de farinha num caminho curvo (curva quadrática), menores ao fundo e achatadas pela perspectiva do chão
const trilha = ([[x0, y0], [x1, y1], [x2, y2]], n, e0, e1, achatar = .5) => `<g filter="url(#farinha)" fill="#fffdf6">${Array.from({ length: n }, (_, i) => {
  const t = i / (n - 1), u = 1 - t, x = u * u * x0 + 2 * u * t * x1 + t * t * x2, y = u * u * y0 + 2 * u * t * y1 + t * t * y2;
  const dx = 2 * u * (x1 - x0) + 2 * t * (x2 - x1), dy = (2 * u * (y1 - y0) + 2 * t * (y2 - y1)) / achatar, L = Math.hypot(dx, dy);
  const e = e0 + (e1 - e0) * t, lado = i % 2 ? 1 : -1, d = 34 * e;
  return `<g transform="translate(${f2(x)} ${f2(y)}) scale(1 ${achatar}) translate(${f2(-dy / L * d * lado)} ${f2(dx / L * d * lado)}) rotate(${f2(Math.atan2(dy, dx) * 180 / Math.PI + 90)}) scale(${f2(lado * e)} ${f2(e)}) translate(-50 -120)"><path d="${BOTA}"/><path d="${SALTO}"/></g>`;
}).join("")}</g>`;

// sala com parede e chão de madeira (ilustrações de 200 x 92, ou mais altas com alto)
const cena = (noite = false, alto = 92) => `<rect width="200" height="58" fill="${noite ? "#2f3b63" : "#f6e8d4"}"/>${Array.from({ length: 11 }, (_, k) => `<rect x="${k * 20 + 8}" width="4" height="58" fill="${noite ? "#35426d" : "#f1dfc6"}"/>`).join("")}
  <rect y="58" width="200" height="${alto - 58}" fill="${noite ? "#6b4630" : "#a8693f"}"/>
  ${Array.from({ length: 13 }, (_, k) => `<line x1="${100 + (k - 6) * 14}" y1="58" x2="${100 + (k - 6) * 14 * (1 + (alto - 58) / 20)}" y2="${alto}" stroke="${noite ? "#57382a" : "#8f5733"}" stroke-width=".5"/>`).join("")}
  ${[66, 78, 96].filter(y => y < alto).map(y => `<line x1="0" y1="${y}" x2="200" y2="${y}" stroke="${noite ? "#57382a" : "#8f5733"}" stroke-width=".4"/>`).join("")}
  <rect y="55" width="200" height="3.5" fill="${noite ? "#c9c2d8" : "#fffaf1"}" stroke="${CONT}" stroke-width=".4"/>`;
const arvore = (x, y, w) => imagem(ades("arvore"), x, y, w);

// ---------- roteiro (página 2) ----------
const passo = (n, titulo, desenho, texto) => `<figure class="passo"><svg class="ilu" viewBox="0 0 200 92"><rect width="200" height="92" fill="url(#fundo-ilu)"/>${desenho}</svg><div class="corpo"><h3><b>${n}</b>${titulo}</h3><p>${texto}</p></div></figure>`;
const prato = (x, y, rx) => `<g filter="url(#sombra-leve)"><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${f2(rx * .3)}" fill="#fff" ${tr(.8)}/><ellipse cx="${x}" cy="${y}" rx="${f2(rx * .72)}" ry="${f2(rx * .2)}" fill="none" stroke="#ddd3c7" stroke-width=".6"/></g>`;
const PASSOS = [
  ["Dias antes", `<rect x="56" y="2" width="88" height="92" fill="#f3e3cc" ${tr(1)}/><rect x="62" y="7" width="76" height="90" fill="#a0603a" ${tr(1.1)}/>
    <rect x="68" y="12" width="64" height="30" rx="2" fill="#8c522f" ${tr(.6)}/><rect x="68" y="48" width="64" height="40" rx="2" fill="#8c522f" ${tr(.6)}/><circle cx="130" cy="56" r="3" fill="url(#ouro)" ${tr(.6)}/>
    ${mini(5, 100, 44, 40, -3)}${fita(87, 16, -28)}${fita(114, 15, 24)}${azevinho(58, 6, 20, .7)}${azevinho(142, 6, -20, .7)}${brilho(30, 30, 6)}${brilho(170, 60, 5)}${brilho(20, 70, 3.5)}`,
    "Cole a placa <i>\"Papai Noel, pare aqui!\"</i> na porta ou na janela, para ele não errar a casa."],
  ["Na noite de Natal", `${cena()}${arvore(126, 4, 72)}${prato(66, 78, 40)}${cenoura(36, 79, .85, -8)}${biscoito(62, 75, 10, false, .55)}${biscoito(80, 77, 10, false, .55)}${biscoito(72, 68, 10, false, .55)}${copo(110, 48, 30)}`,
    "A criança deixa biscoitos e leite para o Papai Noel e uma cenoura para as renas, perto da árvore."],
  ["Quando ela dormir", `${cena(true)}${arvore(142, 6, 58)}${prato(60, 78, 40)}${biscoito(70, 74, 12, true, .6)}${cenoura(32, 80, .85, -8, true)}${copo(104, 50, 28, false)}
    ${[[44, 84], [52, 73], [88, 82], [92, 76]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r=".9" fill="#dfa25a"/>`).join("")}${mini(6, 136, 64, 28, 8)}${brilho(30, 20, 4, "#fff")}${brilho(80, 12, 2.5, "#fff")}${brilho(110, 28, 3, "#fff")}`,
    "Coma um pedaço do biscoito, morda a cenoura e deixe os bilhetes de agradecimento no prato."],
  ["As pegadas", `${cena()}${arvore(140, 2, 60)}${trilha([[10, 100], [92, 90], [146, 66]], 7, .13, .075, .6)}`,
    "Com o molde e um pouco de farinha, marque o caminho da porta até a árvore."],
  ["Os presentes", `${cena()}${arvore(118, 0, 70)}${presente(112, 62, 22, 22, VERMELHO, DOURADO)}${presente(162, 66, 20, 18, VERDE, VERMELHO)}${presente(138, 72, 18, 16, "#4f97d1", "#fff")}
    ${mini(4, 46, 62, 30, -9)}${mini(3, 70, 58, 30, 6)}`,
    "Cole as etiquetas <i>\"Do Papai Noel\"</i> nos presentes e deixe a carta e o certificado por cima."],
  ["A descoberta", `${imagem(ades("papai-noel"), 6, 10, 70)}${imagem(ades("rena"), 126, 12, 68)}${mini(3, 100, 46, 46, -4)}${brilho(84, 10, 5)}${brilho(118, 82, 4)}${brilho(20, 82, 3.5)}${brilho(186, 10, 4)}`,
    "Deixe a criança encontrar tudo. Depois, leiam a carta juntos, em voz alta."],
];

// ---------- carta (página 3) ----------
const CARTA = [
  "Aqui do Polo Norte, eu acompanho você o ano inteiro pela minha luneta mágica. Vi quando você ajudou alguém, dividiu um brinquedo e deu aquele abraço apertado em quem precisava. Tudo isso deixou o meu coração quentinho, igual chocolate quente em noite de neve.",
  "Este ano a oficina não parou: os duendes martelaram, pintaram e embrulharam até tarde da noite, e o seu presente foi feito com um carinho especial. Espero que você goste muito!",
  "Continue sendo essa pessoa curiosa, carinhosa e cheia de imaginação. E nunca se esqueça: a magia do Natal mora em cada gesto de bondade.",
];

// ---------- certificado (página 4) ----------
const medalha = `<svg class="medalha" viewBox="0 0 60 62">
  <path d="M22,36 L13,60 L19,56.5 L23,61 L30,38Z" fill="${VERMELHO}" ${tr(.6)}/><path d="M38,36 L47,60 L41,56.5 L37,61 L30,38Z" fill="${VERMELHO}" ${tr(.6)}/>
  ${selo(30, 28, 25)}<circle cx="30" cy="28" r="16" fill="#fff" ${tr(.6)}/>${imagem(ades("papai-noel"), 14.5, 12.5, 31)}</svg>`;
const ESTRELAS = ["Ajudou em casa", "Dividiu os brinquedos", "Foi gentil com todo mundo", "Espalhou muita alegria"];
const estrelinha = `<svg viewBox="-12 -12 24 24"><path d="${ESTRELA}" fill="${DOURADO}" stroke="#b8860b" stroke-width="1.4" stroke-linejoin="round"/></svg>`;

// ---------- placa (página 5) ----------
const octogono = (cx, cy, meia) => { const R = meia / Math.cos(Math.PI / 8); return Array.from({ length: 8 }, (_, k) => { const a = (22.5 + 45 * k) * Math.PI / 180; return `${f2(cx + R * Math.cos(a))},${f2(cy + R * Math.sin(a))}`; }).join(" "); };
const floco = (x, y, r) => `<g transform="translate(${f2(x)} ${f2(y)})" stroke="#fff" stroke-width="${f2(r * .16)}" stroke-linecap="round">${[0, 60, 120].map(a => `<line x1="${-r}" x2="${r}" transform="rotate(${a})"/>`).join("")}${[0, 60, 120, 180, 240, 300].map(a => `<path d="M${f2(r * .55)},${f2(-r * .25)} L${f2(r * .75)},0 L${f2(r * .55)},${f2(r * .25)}" fill="none" transform="rotate(${a})"/>`).join("")}</g>`;
const NEVE = Array.from({ length: 70 }, () => { const x = acaso() * 210, y = acaso() * 240, r = .5 + acaso() * 1.3; return acaso() < .14 ? floco(x, y, r * 2.4) : `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(r)}" fill="#fff"/>`; }).join("");
const placa = `<svg class="cheia" viewBox="0 0 210 297">
  <rect width="210" height="297" fill="#d9e9f6"/>${NEVE}
  <path d="M0,262 Q46,248 104,258 Q160,268 210,252 L210,297 L0,297Z" fill="#fff" stroke="#b9d3ea" stroke-width=".8"/>
  <path d="M0,282 Q70,272 130,280 Q176,286 210,278" fill="none" stroke="#d3e4f2" stroke-width="1.2"/>
  <rect x="99" y="200" width="12" height="68" fill="url(#metal)" ${tr(.8)}/><ellipse cx="105" cy="268" rx="16" ry="4.5" fill="#fff" stroke="#b9d3ea" stroke-width=".6"/>
  <g transform="translate(0 14)"><g filter="url(#sombra-forte)"><polygon points="${octogono(105, 110, 86)}" fill="#fff" ${tr(1.3)}/><polygon points="${octogono(105, 110, 80)}" fill="${VERMELHO}"/>
  <polygon points="${octogono(105, 110, 77.5)}" fill="none" stroke="#fff" stroke-width=".7" opacity=".55"/></g>
  <path d="M64,27 Q66,17 77,19 Q84,11 95,16 Q105,8 116,15 Q127,10 134,18 Q146,17 147,27 Q150,33 144,34 Q136,30 128,34 Q119,30 110,34 Q100,30 91,34 Q82,30 73,34 Q64,34 64,27Z" fill="#fff" ${tr(1)}/>
  <path d="M71,30 Q82,27 92,30 M112,30 Q124,27 136,30" fill="none" stroke="#c9ddef" stroke-width="1.2" stroke-linecap="round"/>
  <text x="105" y="70" class="svg-t" font-size="15" fill="#fff" letter-spacing=".4">PAPAI NOEL,</text>
  <text x="105" y="133" class="svg-t" font-size="52" fill="#fff" letter-spacing="1">PARE</text>
  <text x="105" y="166" class="svg-t" font-size="24" fill="#fff" letter-spacing=".6">AQUI!</text>
  ${brilho(46, 88, 3.4, "#fff")}${brilho(166, 140, 3, "#fff")}${brilho(60, 160, 2.2, "#fff")}${azevinho(105, 21, 0, 1)}</g>
  <g filter="url(#sombra-leve)"><rect x="68" y="228" width="74" height="28" rx="3.5" fill="#fffaf1" ${tr(.8)}/></g>
  <text x="105" y="238" class="svg-t" font-size="6.8" fill="${VERDE}">Aqui mora:</text><line x1="75" y1="249" x2="135" y2="249" stroke="#9a8a80" stroke-width=".4"/>
  ${imagem(ades("papai-noel"), 0, 200, 70)}${imagem(ades("rena"), 140, 202, 70)}</svg>`;

// ---------- bilhetes (página 6) ----------
const bilhete = (t, topo, img, titulo, texto, assinatura, desenho) => `<div class="bilhete" style="top:${topo}mm">
  <div class="faixa">${fundo(t, 190, 9)}</div>
  <div class="esq"><img src="${img}" alt=""><svg viewBox="0 0 60 34">${desenho}</svg></div>
  <div class="dir"><h2 style="color:${t.escuro}">${titulo}</h2><p>${texto}</p><div class="assin" style="color:${t.escuro}">${assinatura}</div></div></div>`;

// ---------- etiquetas (página 7) ----------
const etiqueta = t => `<div class="etq"><div class="etq-topo">${fundo(t, 45, 40)}<img src="${ades(t.id)}" alt=""></div><div class="etq-txt"><p>Para:<span></span></p><b>Do Papai Noel</b>
  <svg viewBox="-16 -13 32 17">${azevinho(0, 0, 0, .55)}</svg></div>
  <svg class="linhas" viewBox="0 0 45 72"><path d="M9,0 L36,0 L45,9 L45,72 L0,72 L0,9Z" class="corte"/><circle cx="22.5" cy="6.5" r="2.3" class="corte"/></svg></div>`;

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Kit Papai Noel passou aqui</title>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600&family=Nunito:wght@600;700;800&family=Dancing+Script:wght@700&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { margin: 0; font-family: Nunito, sans-serif; color: #3a2a24; }
  .pag { width: 210mm; height: 297mm; position: relative; overflow: hidden; break-after: page; background: #fff; }
  /* prévia: com #pN na URL, só aquela página aparece */
  body:has(.pag:target) .pag:not(:target) { display: none; }
  .bump { display: none; } .bump:target { display: block; } body:has(.bump:target) .pag { display: none; }
  .fundo { position: absolute; inset: 0; width: 100%; height: 100%; }
  .cheia { position: absolute; inset: 0; width: 100%; height: 100%; }
  .linhas { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
  .corte { fill: none; stroke: #333; stroke-width: .3; }
  circle.corte { fill: #fff; }
  .svg-t { font-family: Fredoka, sans-serif; font-weight: 600; text-anchor: middle; }
  .svg-n { font-family: Nunito, sans-serif; font-weight: 700; }
  .marca { display: inline-block; background: ${VERMELHO}; color: #fff; border-radius: 99px; padding: 1.6mm 5mm; font: 600 11pt Fredoka, sans-serif; letter-spacing: .1em; }
  .marca.verde { background: ${VERDE}; font-size: 9pt; padding: 1mm 4mm; letter-spacing: .12em; }
  .linha { display: inline-block; border-bottom: .4mm solid #9a8a80; }

  .capa { background: ${CREME}; text-align: center; padding-top: 16mm; }
  .capa h1 { font: 600 38pt/1.02 Fredoka, sans-serif; color: ${VERMELHO}; margin: 6mm 0 2mm; position: relative; }
  .capa h2 { font: 500 17pt Fredoka, sans-serif; color: ${VERDE}; margin: 0; position: relative; }
  .capa .heroi { width: 84mm; margin: 2mm auto 0; display: block; position: relative; }
  .capa .itens { display: grid; grid-template-columns: repeat(3, 52mm); justify-content: center; gap: 4mm 6mm; margin-top: 4mm; position: relative; }
  .capa figure { margin: 0; }
  .capa figure img { width: 33mm; display: block; margin: 0 auto; box-shadow: 0 .8mm 2.2mm rgba(58,42,36,.3); border: .3mm solid #e6dccf; }
  .capa figure:nth-child(odd) img { transform: rotate(-3deg); } .capa figure:nth-child(even) img { transform: rotate(3deg); }
  .capa figcaption { font: 600 10.5pt/1.15 Fredoka, sans-serif; color: ${VERDE}; margin-top: 2.2mm; }
  .capa .uso-rodape { position: absolute; left: 20mm; right: 20mm; bottom: 7mm; font-size: 8.5pt; color: #8a7a70; margin: 0; }

  .guia { padding: 10mm 13mm 0; background: #fffdf8; }
  .guia .topo { display: flex; align-items: center; justify-content: space-between; }
  .guia .topo img { width: 26mm; margin: -3mm 0; }
  .guia h1 { font: 600 22pt/1.1 Fredoka, sans-serif; color: ${VERMELHO}; margin: 2mm 0 0; }
  .passos { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm 6mm; margin-top: 5mm; }
  .passo { margin: 0; background: #fff; border-radius: 5mm; overflow: hidden; box-shadow: 0 .8mm 2.5mm rgba(58,42,36,.14); }
  .passo .ilu { display: block; width: 100%; }
  .passo .corpo { padding: 2.2mm 3.5mm 3mm; }
  .passo h3 { display: flex; align-items: center; gap: 2mm; margin: 0 0 1mm; font: 600 12.5pt Fredoka, sans-serif; color: ${VERDE}; }
  .passo h3 b { flex: 0 0 7mm; height: 7mm; border-radius: 50%; background: ${VERMELHO}; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 11pt; }
  .passo p { margin: 0; font-size: 10pt; line-height: 1.32; color: #4a3a33; }
  .dicas { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; margin-top: 6mm; }
  .dicas div { background: #fdf1dc; border-radius: 4mm; padding: 3mm 4mm; font-size: 9.5pt; line-height: 1.35; }
  .dicas b { display: block; font: 600 11.5pt Fredoka, sans-serif; color: ${VERMELHO}; margin-bottom: .6mm; }
  .rodape-guia { position: absolute; left: 0; right: 0; bottom: 5mm; text-align: center; font-size: 8pt; color: #b5a89e; margin: 0; }

  .carta { background: repeating-linear-gradient(45deg, ${VERMELHO} 0 5mm, #fff 5mm 10mm); }
  .papel { position: absolute; inset: 9mm; background: #fffaf0; border-radius: 4mm; box-shadow: 0 1mm 3mm rgba(0,0,0,.3); padding: 9mm 19mm 0; text-align: center; }
  .papel::before { content: ""; position: absolute; inset: 3.5mm; border: .5mm solid ${DOURADO}; border-radius: 2.5mm; }
  .papel > * { position: relative; }
  .papel .enfeite { position: absolute; inset: 0; width: 100%; height: 100%; }
  .carta .heroi { width: 72mm; display: block; margin: 0 auto; }
  .carta h1 { font: 600 26pt/1.1 Fredoka, sans-serif; color: ${VERMELHO}; margin: 1mm 0 0; }
  .carta .local { font: 700 12pt Nunito, sans-serif; color: ${VERDE}; margin: 1.5mm 0 3mm; }
  .carta .texto { text-align: left; font: 600 14.5pt/1.5 Nunito, sans-serif; color: #3a2a24; }
  .carta .texto p { margin: 0 0 3.4mm; }
  .carta .ola { font-size: 18pt; display: flex; align-items: flex-end; gap: 2mm; }
  .carta .ola .linha { width: 88mm; height: 10mm; }
  .carta .assin { display: flex; align-items: center; justify-content: flex-end; gap: 3mm; margin-top: -2mm; }
  .carta .assin div { text-align: right; }
  .carta .assin span { font: 600 30pt/1 Fredoka, sans-serif; color: ${VERMELHO}; display: block; }
  .carta .assin svg { width: 28mm; height: 28mm; }
  .carta .ps { text-align: left; font: 700 12.5pt/1.3 Nunito, sans-serif; color: ${VERDE}; margin: 1mm 0 0; }

  .cert { background: ${VERMELHO}; }
  .cert .painel { position: absolute; inset: 10mm; background: ${CREME}; border-radius: 3mm; box-shadow: 0 1mm 3mm rgba(0,0,0,.3); text-align: center; padding: 10mm 14mm 14mm; display: flex; flex-direction: column; align-items: center; }
  .cert .painel::before { content: ""; position: absolute; inset: 3mm; border: .9mm solid ${DOURADO}; border-radius: 2mm; }
  .cert .painel::after { content: ""; position: absolute; inset: 5mm; border: .3mm solid ${DOURADO}; border-radius: 1.5mm; }
  .cert .painel > * { position: relative; z-index: 1; }
  .cert .enfeite { position: absolute; inset: 0; width: 100%; height: 100%; }
  .cert .medalha { width: 60mm; display: block; margin: 0 auto; }
  .cert .oficial { font: 600 11pt Fredoka, sans-serif; letter-spacing: .32em; color: ${VERDE}; margin: 2mm 0 0; }
  .cert h1 { font: 600 50pt/1 Fredoka, sans-serif; color: ${VERMELHO}; margin: 1mm 0 2mm; }
  .cert .ano { display: inline-block; background: ${VERDE}; color: ${DOURADO}; font: 600 17pt Fredoka, sans-serif; letter-spacing: .2em; padding: 1mm 9mm; border-radius: 1mm; position: relative; }
  .cert .ano::before, .cert .ano::after { content: ""; position: absolute; top: 2mm; width: 7mm; height: 100%; background: #143f2a; z-index: -1; }
  .cert .ano::before { left: -5mm; clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 35% 50%); }
  .cert .ano::after { right: -5mm; clip-path: polygon(0 0, 100% 0, 65% 50%, 100% 100%, 0 100%); }
  .cert .frase { font: 700 14pt/1.45 Nunito, sans-serif; color: #4a3a33; margin: 9mm 0 0; }
  .cert .nome { width: 140mm; height: 20mm; margin: 0 auto 3mm; }
  .cert .estrelas { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm 5mm; margin: auto 0 0; width: 100%; padding: 0 2mm; }
  .cert .estrelas div { display: flex; align-items: center; gap: 2.5mm; background: #fff; border-radius: 99px; padding: 2.8mm 4mm 2.8mm 2.8mm; font: 600 13pt Fredoka, sans-serif; color: ${VERDE}; text-align: left; box-shadow: 0 .5mm 1.5mm rgba(58,42,36,.15); }
  .cert .estrelas svg { width: 8mm; height: 8mm; flex: none; }
  .cert .assinaturas { margin-top: auto; width: 100%; padding: 0 2mm; display: flex; justify-content: space-between; align-items: flex-end; }
  .cert .assinatura { width: 56mm; }
  .cert .traco { height: 17mm; border-bottom: .4mm solid #6b5a52; display: flex; align-items: flex-end; justify-content: center; font: 700 26pt/1.1 'Dancing Script', cursive; color: ${VERMELHO}; }
  .cert .traco svg { width: 40mm; height: 14mm; }
  .cert .assinatura small { display: block; font: 700 9.5pt Nunito, sans-serif; color: #6b5a52; margin-top: 1.2mm; }

  .bilhetes { background: #fff; }
  .bilhete { position: absolute; left: 10mm; width: 190mm; height: 130mm; background: #fffaf0; border-radius: 5mm; overflow: hidden; border: .5mm solid #eadcc4; display: grid; grid-template-columns: 70mm 1fr; padding: 12mm 10mm 4mm 5mm; gap: 4mm; }
  .bilhete .faixa { position: absolute; left: 0; right: 0; top: 0; height: 9mm; }
  .bilhete .esq { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2mm; }
  .bilhete .esq img { width: 60mm; }
  .bilhete .esq svg { width: 66mm; height: 37mm; }
  .bilhete .dir { display: flex; flex-direction: column; justify-content: center; }
  .bilhete h2 { font: 600 25pt/1.05 Fredoka, sans-serif; margin: 0 0 3mm; }
  .bilhete p { font: 600 15pt/1.45 Nunito, sans-serif; margin: 0; color: #3a2a24; }
  .bilhete .assin { font: 600 26pt/1 Fredoka, sans-serif; text-align: right; margin-top: 3mm; display: flex; justify-content: flex-end; align-items: center; gap: 2mm; }
  .bilhete .assin svg { width: 20mm; height: 12mm; }
  .corte-meio { position: absolute; left: 6mm; right: 6mm; top: 148.5mm; border-top: .35mm dashed #b5a89e; }
  .corte-meio span { position: absolute; left: 10mm; top: -3.2mm; font-size: 12pt; color: #8a7a70; background: #fff; padding: 0 1mm; line-height: 1; }

  .etqs-pag { padding: 11mm 9mm 0; text-align: center; background: #fffdf8; }
  .etqs-pag h1 { font: 600 24pt/1.1 Fredoka, sans-serif; color: ${VERMELHO}; margin: 2.5mm 0 1mm; }
  .etqs-pag .aviso { font-size: 10pt; color: #6b5a52; margin: 0 0 6mm; }
  .etqs { display: grid; grid-template-columns: repeat(4, 45mm); justify-content: center; gap: 9mm 5mm; }
  .etq { position: relative; width: 45mm; height: 72mm; background: #fff; clip-path: polygon(9mm 0, 36mm 0, 100% 9mm, 100% 100%, 0 100%, 0 9mm); }
  .etq-topo { position: relative; height: 40mm; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 1mm; }
  .etq-topo img { width: 28mm; position: relative; }
  .etq-txt { padding: 2.5mm 4mm 0; text-align: left; }
  .etq-txt p { margin: 0; display: flex; gap: 1.5mm; align-items: flex-end; font: 700 9.5pt Nunito, sans-serif; }
  .etq-txt span { flex: 1; border-bottom: .3mm solid #9a8a80; height: 1.1em; }
  .etq-txt b { display: block; text-align: center; font: 600 13.5pt/1 Fredoka, sans-serif; color: ${VERMELHO}; margin-top: 3.5mm; }
  .etq-txt svg { display: block; width: 13mm; margin: 1.5mm auto 0; }

  .molde { background: #fffdf8; }
  .molde .txt { position: absolute; left: 11mm; top: 11mm; width: 84mm; }
  .molde h1 { font: 600 24pt/1.08 Fredoka, sans-serif; color: ${VERMELHO}; margin: 2.5mm 0 1.5mm; }
  .molde .aviso { font-size: 9.5pt; color: #6b5a52; margin: 0 0 4mm; }
  .molde .aviso b { color: ${VERMELHO}; }
  .molde ol { list-style: none; padding: 0; margin: 0; counter-reset: n; }
  .molde li { counter-increment: n; display: flex; gap: 2.5mm; font-size: 11pt; line-height: 1.35; margin-bottom: 2.8mm; color: #4a3a33; }
  .molde li::before { content: counter(n); flex: 0 0 6.5mm; height: 6.5mm; border-radius: 50%; background: ${VERMELHO}; color: #fff; display: flex; align-items: center; justify-content: center; font: 600 10pt Fredoka, sans-serif; }
  .molde .cartao { margin-top: 4mm; border-radius: 4mm; overflow: hidden; box-shadow: 0 .8mm 2.5mm rgba(58,42,36,.16); }
  .molde .cartao svg { display: block; width: 100%; }
  .molde .dica { margin-top: 4mm; background: #fdf1dc; border-radius: 4mm; padding: 3mm 4mm; font-size: 9.5pt; line-height: 1.35; }
  .molde .ajudante { display: block; width: 46mm; margin: 4mm auto 0; }
  .molde .dica b { display: block; font: 600 11pt Fredoka, sans-serif; color: ${VERDE}; margin-bottom: .5mm; }
  .molde .bota { position: absolute; left: 101mm; top: 20mm; width: 100mm; height: 250mm; overflow: visible; }
  .molde .pe { position: absolute; left: 101mm; width: 100mm; top: 262mm; text-align: center; font: 600 10pt Fredoka, sans-serif; color: ${VERDE}; margin: 0; }

  /* imagens da Wiapy */
  .vitrine { position: relative; overflow: hidden; background: ${CREME}; text-align: center; }
  .vitrine > svg.cheia { position: absolute; }
  .vitrine .pg { position: absolute; box-shadow: 0 10px 26px rgba(58,42,36,.35); border: 1px solid #e6dccf; }
  .vitrine .marca-v { position: relative; display: inline-block; background: ${VERMELHO}; color: #fff; border-radius: 99px; font: 600 Fredoka, sans-serif; font-family: Fredoka, sans-serif; letter-spacing: .1em; }
  .vitrine h1 { position: relative; font-family: Fredoka, sans-serif; font-weight: 600; color: ${VERMELHO}; margin: 0; line-height: 1.02; }
  .vitrine .sub { position: relative; font-family: Fredoka, sans-serif; font-weight: 500; color: ${VERDE}; margin: 0; }
  .vitrine .heroi { position: absolute; filter: drop-shadow(0 8px 14px rgba(58,42,36,.25)); }
  .vitrine .pilula { position: absolute; left: 50%; transform: translateX(-50%); background: ${VERDE}; color: #fff; border-radius: 99px; font-family: Nunito, sans-serif; font-weight: 800; white-space: nowrap; }
</style></head><body>
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  ${PADROES}
  <filter id="sombra-leve" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="1.4" stdDeviation="1.3" flood-color="#3a2a24" flood-opacity=".28"/></filter>
  <filter id="sombra-forte" x="-10%" y="-10%" width="120%" height="125%"><feDropShadow dx="0" dy="2.5" stdDeviation="2.5" flood-color="#1c2a3a" flood-opacity=".35"/></filter>
  <filter id="sombra-pag" x="-25%" y="-20%" width="150%" height="140%"><feDropShadow dx="0" dy="1.2" stdDeviation="1.4" flood-color="#3a2a24" flood-opacity=".35"/></filter>
  <filter id="farinha" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="1.1" xChannelSelector="R" yChannelSelector="G"/><feGaussianBlur stdDeviation=".18"/></filter>
  <linearGradient id="metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8d969e"/><stop offset=".45" stop-color="#f7f9fa"/><stop offset="1" stop-color="#8d969e"/></linearGradient>
  <radialGradient id="ouro" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff7d6"/><stop offset=".35" stop-color="${DOURADO}"/><stop offset="1" stop-color="#b8860b"/></radialGradient>
  <linearGradient id="fundo-ilu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffaf1"/><stop offset="1" stop-color="#f7ead3"/></linearGradient>
</defs></svg>

<section class="pag capa" id="p1">
  <svg class="cheia" viewBox="0 0 210 297" aria-hidden="true">${azevinho(14, 14, 135, 1.3)}${azevinho(196, 14, -135, 1.3)}${brilho(30, 58, 4)}${brilho(182, 64, 5)}${brilho(170, 48, 2.6)}${brilho(40, 132, 3)}${brilho(176, 128, 3.4)}</svg>
  <span class="marca">NATAL MÁGICO</span>
  <h1>Papai Noel<br>passou aqui!</h1>
  <h2>kit para a noite de Natal</h2>
  <img class="heroi" src="${ESCREVENDO}" alt="">
  <div class="itens">${[[3, "Carta do Papai Noel"], [4, "Certificado Criança do Bem"], [5, "Placa \"Papai Noel, pare aqui!\""], [6, "Bilhetes de agradecimento"], [7, "12 etiquetas de presente"], [8, "Molde de pegadas"]].map(([n, nome]) => `<figure><img src="previa/p${n}.png" alt=""><figcaption>${nome}</figcaption></figure>`).join("")}</div>
  <p class="uso-rodape"><b>Uso pessoal:</b> imprima quantas vezes quiser para a sua família. Não é permitido revender nem repassar este arquivo.</p>
</section>

<section class="pag guia" id="p2">
  <div class="topo"><div><span class="marca verde">PARA OS ADULTOS</span><h1>Como fazer a magia<br>na noite de Natal</h1></div><img src="${ades("papai-noel")}" alt=""></div>
  <div class="passos">${PASSOS.map(([t, d, x], k) => passo(k + 1, t, d, x)).join("")}</div>
  <div class="dicas"><div><b>A letra entrega!</b>Para a criança não reconhecer a sua letra, peça para outro adulto escrever o nome dela na carta, no certificado e nas etiquetas.</div>
    <div><b>Papai Noel chega à meia-noite?</b>Chame a criança para procurar o trenó no céu, pela janela, enquanto outro adulto arruma tudo.</div></div>
  <p class="rodape-guia">Natal Mágico · Kit Papai Noel passou aqui</p>
</section>

<section class="pag carta" id="p3"><div class="papel">
  <svg class="enfeite" viewBox="0 0 192 279" aria-hidden="true">${azevinho(10, 10, 135, 1.05)}${azevinho(182, 10, -135, 1.05)}${azevinho(10, 269, 45, 1.05)}${azevinho(182, 269, -45, 1.05)}${carimbo("carta", 152, 58, 14, -14)}${brilho(30, 40, 3.4)}${brilho(40, 28, 2)}</svg>
  <img class="heroi" src="${ESCREVENDO}" alt="">
  <h1>Uma cartinha do Papai Noel</h1>
  <p class="local">Polo Norte, 24 de dezembro de 2026</p>
  <div class="texto"><p class="ola">Olá, <span class="linha"></span>!</p>${CARTA.map(p => `<p>${p}</p>`).join("")}</div>
  <div class="assin"><div><p class="local" style="margin:0">Com muito amor,</p><span>Papai Noel</span></div><svg viewBox="0 0 40 40">${selo(20, 20, 17)}</svg></div>
  <p class="ps">P.S.: As renas mandaram um beijo e pediram mais cenouras no ano que vem!</p>
</div></section>

<section class="pag cert" id="p4">${fundo(TEMAS[0], 210, 297)}<div class="painel">
  <svg class="enfeite" viewBox="0 0 190 277" aria-hidden="true">${azevinho(12, 12, 135, 1)}${azevinho(178, 12, -135, 1)}${brilho(48, 44, 3.6)}${brilho(142, 52, 4)}${brilho(150, 38, 2.4)}</svg>
  ${medalha}
  <p class="oficial">CERTIFICADO OFICIAL</p>
  <h1>Criança do Bem</h1>
  <span class="ano">2026</span>
  <p class="frase">O Papai Noel e os duendes do Polo Norte certificam que</p>
  <div class="nome linha"></div>
  <p class="frase" style="margin:0">foi uma criança do bem em 2026 e ganhou um lugar<br>especial na Lista do Bem do Papai Noel.</p>
  <div class="estrelas">${ESTRELAS.map(e => `<div>${estrelinha}${e}</div>`).join("")}</div>
  <div class="assinaturas">
    <div class="assinatura"><div class="traco">Papai Noel</div><small>Papai Noel</small></div>
    <svg viewBox="-24 -24 48 48" style="width:30mm;height:30mm;margin-bottom:-2mm">${carimbo("cert", 0, 0, 20, -10)}</svg>
    <div class="assinatura"><div class="traco"><svg viewBox="0 0 60 20">${casco(22, 9, .72, -14)}${casco(40, 7, .72, 12)}</svg></div><small>As renas</small></div>
  </div>
</div></section>

<section class="pag" id="p5">${placa}</section>

<section class="pag bilhetes" id="p6">
  ${bilhete(TEMAS[0], 9, ades("papai-noel"), "Obrigado pelos biscoitos!", "Estavam deliciosos! E o leite estava geladinho, do jeito que eu gosto. Recarreguei as energias para entregar presentes a noite inteira. Obrigado pelo carinho!", "Papai Noel",
    `${prato(24, 25, 21)}${biscoito(23, 21, 9.5, true, .62)}${[[9, 27], [12, 22], [38, 27], [36, 21]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r=".7" fill="#dfa25a"/>`).join("")}${copo(52, 6, 24, false)}`)}
  <div class="corte-meio"><span>✂</span></div>
  ${bilhete(TEMAS[1], 158, ades("rena"), "Obrigado pelas cenouras!", "Crunch, crunch! Estavam fresquinhas e muito gostosas. Com a barriga cheia, voamos mais rápido do que nunca para entregar todos os presentes.", `As renas <svg viewBox="0 0 36 20">${casco(11, 9, .62, -14, TEMAS[1].escuro)}${casco(26, 7, .62, 12, TEMAS[1].escuro)}</svg>`,
    `${prato(30, 25, 24)}${cenoura(16, 21, .78, -6, true)}${cenoura(22, 27, .7, 6, true)}`)}
</section>

<section class="pag etqs-pag" id="p7">
  <span class="marca verde">ETIQUETAS</span>
  <h1>Etiquetas de presente</h1>
  <p class="aviso">Recorte na linha, fure a bolinha e amarre no presente com uma fitinha (ou cole com fita dupla face).</p>
  <div class="etqs">${Array.from({ length: 12 }, (_, k) => etiqueta(TEMAS[(k + Math.floor(k / 4)) % 4])).join("")}</div>
</section>

<section class="pag molde" id="p8">
  <div class="txt">
    <span class="marca verde">MOLDE</span>
    <h1>Pegadas do<br>Papai Noel</h1>
    <p class="aviso">Imprima em <b>tamanho real (100%)</b>, de preferência em papel mais grosso ou cartolina.</p>
    <ol>
      <li><span>Recorte as partes cinzas da bota. Elas viram buracos no papel.</span></li>
      <li><span>Coloque o molde no chão, peneire farinha de trigo (ou talco) por cima e levante devagar.</span></li>
      <li><span>Para o outro pé, vire a folha ao contrário.</span></li>
      <li><span>Faça um caminho da porta até a árvore, como se o Papai Noel tivesse andado pela casa.</span></li>
    </ol>
    <div class="cartao"><svg viewBox="0 0 200 120">${cena(false, 120)}${arvore(138, 2, 62)}${trilha([[6, 128], [86, 112], [146, 68]], 7, .17, .085, .6)}</svg></div>
    <p class="dica"><b>Dica</b>Funciona melhor em chão escuro ou tapete. Para começar o corte de dentro, dobre o papel de leve no meio da bota e faça um pique com a tesoura. Corte com a ajuda de um adulto.</p>
    <img class="ajudante" src="${ades("papai-noel")}" alt="">
  </div>
  <svg class="bota" viewBox="0 0 100 250"><path d="${BOTA}" fill="#ece5dc" ${tr(.6)}/><path d="${SALTO}" fill="#ece5dc" ${tr(.6)}/>
    <text x="50" y="78" class="svg-t" font-size="8" fill="#b3a79b" letter-spacing="1.5" transform="rotate(-90 50 78)">RECORTE</text>
    <text x="51" y="203" class="svg-t" font-size="6" fill="#b3a79b" letter-spacing="1">RECORTE</text></svg>
  <p class="pe">pé direito · vire a folha para o pé esquerdo</p>
</section>

<!-- imagem do order bump na Wiapy (800 x 800), fora do PDF -->
<section class="bump" id="bump"><div class="vitrine" style="width:800px;height:800px;padding-top:44px">
  <svg class="cheia" viewBox="0 0 200 200" aria-hidden="true">${azevinho(6, 6, 135, .6)}${azevinho(194, 6, -135, .6)}${brilho(20, 52, 3.5)}${brilho(182, 50, 3)}${brilho(14, 120, 2.4)}</svg>
  <h1 style="font-size:58px">Papai Noel passou aqui!</h1>
  <p class="sub" style="font-size:30px;margin-top:8px">Kit para a noite de Natal</p>
  <img class="pg" src="previa/p4.png" style="width:220px;left:60px;top:250px;transform:rotate(-11deg)" alt="">
  <img class="pg" src="previa/p5.png" style="width:220px;left:520px;top:236px;transform:rotate(10deg)" alt="">
  <img class="pg" src="previa/p6.png" style="width:200px;left:110px;top:400px;transform:rotate(-4deg)" alt="">
  <img class="pg" src="previa/p3.png" style="width:270px;left:265px;top:200px;transform:rotate(2deg)" alt="">
  <img class="heroi" src="${ESCREVENDO}" style="width:290px;right:6px;bottom:72px" alt="">
  <div class="pilula" style="bottom:26px;font-size:22px;padding:10px 30px">PDF colorido para imprimir em casa</div>
</div></section>

<!-- capa do conteúdo na Wiapy (1080 x 1920), fora do PDF -->
<section class="bump" id="capa-wiapy"><div class="vitrine" style="width:1080px;height:1920px;padding-top:150px">
  <svg class="cheia" viewBox="0 0 200 356" aria-hidden="true">${azevinho(12, 12, 135, 1.2)}${azevinho(188, 12, -135, 1.2)}${brilho(24, 70, 4)}${brilho(176, 64, 3.4)}${brilho(18, 200, 2.6)}${brilho(186, 230, 3)}</svg>
  <span class="marca-v" style="font-size:36px;padding:12px 40px">NATAL MÁGICO</span>
  <h1 style="font-size:130px;margin-top:44px">Papai Noel<br>passou aqui!</h1>
  <p class="sub" style="font-size:52px;margin-top:20px">kit para a noite de Natal</p>
  <img class="pg" src="previa/p4.png" style="width:330px;left:70px;top:720px;transform:rotate(-11deg)" alt="">
  <img class="pg" src="previa/p5.png" style="width:330px;left:680px;top:700px;transform:rotate(10deg)" alt="">
  <img class="pg" src="previa/p6.png" style="width:300px;left:110px;top:960px;transform:rotate(-4deg)" alt="">
  <img class="pg" src="previa/p3.png" style="width:410px;left:335px;top:660px;transform:rotate(2deg)" alt="">
  <img class="heroi" src="${ESCREVENDO}" style="width:440px;right:20px;top:1070px" alt="">
  <p class="sub" style="position:absolute;left:0;right:0;top:1580px;font-size:40px">carta · certificado · placa · bilhetes<br>etiquetas · molde de pegadas</p>
  <div class="pilula" style="bottom:90px;font-size:38px;padding:18px 54px">PDF colorido para imprimir em casa</div>
</div></section>

</body></html>`;

const arquivo = join(AQUI, "kit.html");
writeFileSync(arquivo, html);
const url = pathToFileURL(arquivo).href;
mkdirSync(join(AQUI, "..", "entregaveis"), { recursive: true });
mkdirSync(join(AQUI, "previa"), { recursive: true });
const PAGINAS = 8;
// a capa (1) e o roteiro (2) mostram miniaturas das outras páginas: saem por último
for (const p of [3, 4, 5, 6, 7, 8, 1, 2]) foto(url + "#p" + p, join(AQUI, "previa", `p${p}.png`), 794, 1123, 3.125);
foto(url + "#bump", join(AQUI, "..", "thumb-bump-papai-noel.png"), 800, 800);
foto(url + "#capa-wiapy", join(AQUI, "..", "capa-bump-papai-noel-1080x1920.png"), 1080, 1920);
const pdf = join(AQUI, "..", "entregaveis", "Kit Papai Noel passou aqui.pdf");
juntarPdf(AQUI, Array.from({ length: PAGINAS }, (_, k) => `previa/p${k + 1}.png`), pdf, "Kit Papai Noel passou aqui");
console.log("ok:", pdf);
