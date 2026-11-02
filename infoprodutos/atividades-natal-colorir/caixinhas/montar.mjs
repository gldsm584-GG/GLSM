// Monta o order bump "Caixinhas de Natal para presentear" (A4, colorido) a partir dos 4 desenhos do GPT em arte/.
// Gera caixinhas.html, ../entregaveis/Caixinhas de Natal para presentear.pdf e previa/p<N>.png. Uso: node montar.mjs   (dentro desta pasta)
// Na 1ª vez (ou se apagar arte/*-adesivo.png) tira o fundo branco dos desenhos e põe a borda branca de adesivo.
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { VERMELHO, VERDE, DOURADO, TEMAS, PADROES, ESTRELA, brilho, criarAdesivos, foto, juntarPdf } from "../comum.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));

const DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  ${PADROES}
  <marker id="seta-v" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="3.2" markerHeight="3.2" orient="auto-start-reverse"><path d="M0,0.5 L10,5 L0,9.5 L2.5,5Z" fill="${VERMELHO}" stroke="${VERMELHO}" stroke-width="1" stroke-linejoin="round"/></marker>
  <marker id="seta-g" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="3.2" markerHeight="3.2" orient="auto-start-reverse"><path d="M0,0.5 L10,5 L0,9.5 L2.5,5Z" fill="${VERDE}" stroke="${VERDE}" stroke-width="1" stroke-linejoin="round"/></marker>
  <filter id="borrao" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.6"/></filter>
  <filter id="sombra-leve" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="1.4" stdDeviation="1.3" flood-color="#3a2a24" flood-opacity=".28"/></filter>
  <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7f9fa"/><stop offset=".55" stop-color="#bfc7ce"/><stop offset="1" stop-color="#8d969e"/></linearGradient>
  <radialGradient id="ouro" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff7d6"/><stop offset=".35" stop-color="${DOURADO}"/><stop offset="1" stop-color="#b8860b"/></radialGradient>
  <linearGradient id="fundo-ilu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffaf1"/><stop offset="1" stop-color="#f7ead3"/></linearGradient>
  <clipPath id="clip-tag"><path d="M8,0 L32,0 L40,8 L40,60 L0,60 L0,8Z"/></clipPath>
  <clipPath id="clip-dobra"><rect x="-2" y="36" width="124" height="110"/></clipPath>
  <clipPath id="clip-cola"><rect x="-4" y="46" width="70" height="86"/></clipPath>
</defs></svg>`;
const fundo = (t, w, h) => `<svg class="fundo" viewBox="0 0 ${w} ${h}" aria-hidden="true"><rect width="${w}" height="${h}" fill="${t.base}"/><rect width="${w}" height="${h}" fill="url(#pad-${t.id})"/></svg>`;

// ---------- adesivos: desenho sem o fundo branco, com borda branca e sombra leve ----------
criarAdesivos(join(AQUI, "arte"), TEMAS.map(t => t.id));

// ---------- peças ----------
const adesivo = (t, mm, extra = "") => `<img class="adesivo" src="arte/${t.id}-adesivo.png" style="width:${mm}mm;${extra}" alt="">`;
const paraDe = (w, h, fs) => `<div class="parade" style="width:${w}mm;height:${h}mm;font-size:${fs}pt"><p>Para:<span></span></p><p>De:<span></span></p></div>`;
const estrela = (mm, cor) => `<svg width="${mm}mm" height="${mm}mm" viewBox="-12 -12 24 24"><path d="${ESTRELA}" fill="${cor}" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
const face = (t, x, y, conteudo) => `<div class="face" style="left:${x}mm;top:${y}mm">${fundo(t, 50, 50)}${conteudo}</div>`;

// Caixinha cúbica de 5 cm com tampa de encaixe em cima e embaixo. Desenhada deitada (210 x 180 mm), girada 90° na folha.
// Colunas: aba de cola 0-10 | lateral 10-60 | frente 60-110 | lateral 110-160 | fundo 160-210. Corpo de y 65 a 115.
const CORTE = "M10,65 L14,47 L56,47 L60,65 L110,65 L114,47 L156,47 L160,65 L160,15 L161,15 L161,6 Q161,0 167,0 L203,0 Q209,0 209,6 L209,15 L210,15 L210,115 L160,115 L156,133 L114,133 L110,115 L110,165 L109,165 L109,174 Q109,180 103,180 L67,180 Q61,180 61,174 L61,165 L60,165 L60,115 L56,133 L14,133 L10,115 L0,110 L0,70 Z";
const DOBRAS = [[10, 65, 10, 115], [60, 65, 60, 115], [110, 65, 110, 115], [160, 65, 160, 115], [10, 65, 60, 65], [110, 65, 160, 65], [160, 65, 210, 65],
  [10, 115, 60, 115], [60, 115, 110, 115], [110, 115, 160, 115], [160, 15, 210, 15], [60, 165, 110, 165]];
const caixa = t => `<div class="caixa"><div class="planta">
  <svg class="abas" viewBox="0 0 210 180">
    <path d="M10,65 L0,70 L0,110 L10,115Z" fill="#fff"/>
    <path d="M10,65 L14,47 L56,47 L60,65Z M110,65 L114,47 L156,47 L160,65Z M10,115 L14,133 L56,133 L60,115Z M110,115 L114,133 L156,133 L160,115Z" fill="${t.base}"/>
    <path d="M161,15 L161,6 Q161,0 167,0 L203,0 Q209,0 209,6 L209,15Z M61,165 L61,174 Q61,180 67,180 L103,180 Q109,180 109,174 L109,165Z" fill="${t.escuro}"/>
    <text x="5" y="90" font-size="3" fill="#999" text-anchor="middle" transform="rotate(-90 5 90)">cole aqui</text>
  </svg>
  ${face(t, 10, 65, `<div class="selo" style="color:${t.escuro}">Feliz<br>Natal!</div>`)}
  ${face(t, 60, 65, adesivo(t, 46))}
  ${face(t, 110, 65, adesivo(t, 36))}
  ${face(t, 160, 65, paraDe(42, 30, 10))}
  ${face(t, 160, 15, estrela(30, t.id === "arvore" ? VERMELHO : DOURADO))}
  ${face(t, 60, 115, "")}
  <svg class="linhas" viewBox="0 0 210 180"><path d="${CORTE}" class="corte"/>${DOBRAS.map(([a, b, c, d]) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" class="dobra"/>`).join("")}</svg>
</div></div>`;

// Tag de 40 x 60 mm com furo para a fitinha
const tag = t => `<div class="tag"><div class="tag-topo">${fundo(t, 40, 38)}${adesivo(t, 28)}</div>${paraDe(32, 16, 9)}
  <svg class="linhas" viewBox="0 0 40 60"><path d="M8,0 L32,0 L40,8 L40,60 L0,60 L0,8Z" class="corte"/><circle cx="20" cy="6" r="2.2" fill="#fff" class="corte"/></svg></div>`;

// ---------- passo a passo ilustrado ----------
// Desenhos em viewBox 200 x 110. A caixinha aparece com a arte de verdade (mesmos fundos e adesivos das peças),
// e em 3D cada face é a arte da peça projetada em perspectiva isométrica.
const T = TEMAS[0];
const CONT = "#2b1d17", PAPEL = "#f4efe7";
const f2 = n => +n.toFixed(2), f4 = n => +n.toFixed(4);
const pts = a => a.map(([x, y]) => `${f2(x)},${f2(y)}`).join(" ");
const tr = (w = 1.2) => `stroke="${CONT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const seta = (d, cor = VERMELHO) => `<path d="${d}" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".85"/><path d="${d}" fill="none" stroke="${cor}" stroke-width="2.4" stroke-linecap="round" marker-end="url(#${cor === VERMELHO ? "seta-v" : "seta-g"})"/>`;
const legenda = (x, y, texto, anc = "middle", cor = "#6b5a52") => `<text x="${x}" y="${y}" class="svg-n" font-size="6" text-anchor="${anc}" fill="${cor}">${texto}</text>`;

// arte das faces, em mm (igual às peças)
const fundoArte = (t, w, h) => `<rect width="${w}" height="${h}" fill="${t.base}"/><rect width="${w}" height="${h}" fill="url(#pad-${t.id})"/>`;
const etiqueta = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="#fff"/>` + [.4, .78].map(f => `<line x1="${f2(x + w * .12)}" y1="${f2(y + h * f)}" x2="${f2(x + w * .88)}" y2="${f2(y + h * f)}" stroke="#9a8a80" stroke-width=".6"/>`).join("");
const ARTE = {
  frente: t => fundoArte(t, 50, 50) + `<image href="arte/${t.id}-adesivo.png" x="3" y="3" width="44" height="44"/>`,
  mini: t => fundoArte(t, 50, 50) + `<image href="arte/${t.id}-adesivo.png" x="7" y="7" width="36" height="36"/>`,
  lado: t => fundoArte(t, 50, 50) + `<rect x="9" y="14" width="32" height="22" rx="5" fill="#fff"/><text x="25" y="23.8" class="svg-t" font-size="8" fill="${t.escuro}">Feliz</text><text x="25" y="32" class="svg-t" font-size="8" fill="${t.escuro}">Natal!</text>`,
  tampa: t => fundoArte(t, 50, 50) + `<path d="${ESTRELA}" transform="translate(25 25) scale(1.5)" fill="${t.id === "arvore" ? VERMELHO : DOURADO}" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/>`,
  verso: t => fundoArte(t, 50, 50) + etiqueta(4, 10, 42, 30),
  liso: t => fundoArte(t, 50, 50),
};

// planta da caixinha (210 x 180 mm, deitada)
const rede = (t, corte = 2) => `<path d="M10,65 L0,70 L0,110 L10,115Z" fill="#fff"/>
  <path d="M10,65 L14,47 L56,47 L60,65Z M110,65 L114,47 L156,47 L160,65Z M10,115 L14,133 L56,133 L60,115Z M110,115 L114,133 L156,133 L160,115Z" fill="${t.base}"/>
  <path d="M161,15 L161,6 Q161,0 167,0 L203,0 Q209,0 209,6 L209,15Z M61,165 L61,174 Q61,180 67,180 L103,180 Q109,180 109,174 L109,165Z" fill="${t.escuro}"/>
  ${[[10, 65, "lado"], [60, 65, "frente"], [110, 65, "mini"], [160, 65, "verso"], [160, 15, "tampa"], [60, 115, "liso"]].map(([x, y, a]) => `<g transform="translate(${x} ${y})">${ARTE[a](t)}</g>`).join("")}
  <text x="5" y="90" font-size="3.2" fill="#999" text-anchor="middle" transform="rotate(-90 5 90)" class="svg-n">cole aqui</text>
  <path d="${CORTE}" fill="none" stroke="${CONT}" stroke-width="${corte}" stroke-linejoin="round"/>
  ${DOBRAS.map(([a, b, c, d]) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="${CONT}" stroke-width="${f2(corte * .55)}" stroke-dasharray="${f2(corte * 2)} ${f2(corte * 1.5)}" opacity=".75"/>`).join("")}`;
// perspectiva isométrica em mm: x vai para a direita-baixo, y para a esquerda-baixo, z para cima
const isoDe = (k, ox, oy) => ([x, y, z]) => [ox + (x - y) * .866 * k, oy + (x + y) * .5 * k - z * k];
const menos = (a, b) => [a[0] - b[0], a[1] - b[1]];
const poli = (I, arr, attrs) => `<polygon points="${pts(arr.map(I))}" ${attrs}/>`;
// a arte (w x h) vai para a face cujo canto de cima à esquerda é a, de cima à direita é b e de baixo à esquerda é c
const naFace = (I, a, b, c, conteudo, w, h) => {
  const o = I(a), u = menos(I(b), o), v = menos(I(c), o);
  return `<g transform="matrix(${f4(u[0] / w)} ${f4(u[1] / w)} ${f4(v[0] / h)} ${f4(v[1] / h)} ${f2(o[0])} ${f2(o[1])})">${conteudo}</g>`;
};
const sombraChao = (I, cx, cy, rx, ry) => { const [x, y] = I([cx, cy, 0]); return `<ellipse cx="${f2(x + 2)}" cy="${f2(y + 3)}" rx="${f2(rx)}" ry="${f2(ry)}" fill="#3a2a24" opacity=".22" filter="url(#borrao)"/>`; };

const bombom = (x, y, r) => `<g transform="translate(${f2(x)} ${f2(y)})" filter="url(#sombra-leve)">
  <path d="M${-r * .8},0 L${-r * 2.1},${-r * .8} Q${-r * 1.8},0 ${-r * 2.1},${r * .8}Z" fill="url(#ouro)" ${tr(.9)}/><path d="M${r * .8},0 L${r * 2.1},${-r * .8} Q${r * 1.8},0 ${r * 2.1},${r * .8}Z" fill="url(#ouro)" ${tr(.9)}/>
  <circle r="${r}" fill="url(#ouro)" ${tr(.9)}/><path d="M${-r * .5},${-r * .5} Q${-r * .1},${-r * .8} ${r * .3},${-r * .6}" stroke="#fff" stroke-width="1.1" fill="none" stroke-linecap="round"/></g>`;

// caixinha de 50 mm: "tubo" (só o corpo), "aberta" (abas e tampa em pé), "docinho" (aberta com o bombom) e "fechada"
const caixa3D = (estado, k, ox, oy, t = T) => {
  const I = isoDe(k, ox, oy), p = (x, y, z) => [x * 50, y * 50, z * 50];
  const aberta = estado === "aberta" || estado === "docinho";
  let s = sombraChao(I, 25, 25, 50 * k * 1.05, 50 * k * .5);
  if (estado !== "fechada") {
    s += poli(I, [p(0, 0, 1), p(0, 1, 1), p(0, 1, 0), p(0, 0, 0)], `fill="#efe8dd"`);
    s += poli(I, [p(0, 0, 1), p(1, 0, 1), p(1, 0, 0), p(0, 0, 0)], `fill="#ddd2c2"`);
  }
  if (aberta) {
    s += poli(I, [p(0, 0, 1), p(0, 1, 1), p(.16, .84, 1.36), p(.16, .16, 1.36)], `fill="${PAPEL}" ${tr()}`);
    s += poli(I, [p(0, 0, 1), p(1, 0, 1), p(1, 0, 2), p(0, 0, 2)], `fill="${PAPEL}" ${tr()}`);
    s += poli(I, [p(.04, 0, 2), p(.96, 0, 2), p(.9, 0, 2.28), p(.1, 0, 2.28)], `fill="${PAPEL}" ${tr()}`);
  }
  s += naFace(I, p(0, 1, 1), p(1, 1, 1), p(0, 1, 0), ARTE.frente(t), 50, 50);
  s += naFace(I, p(1, 1, 1), p(1, 0, 1), p(1, 1, 0), ARTE.lado(t) + `<rect width="50" height="50" fill="#000" opacity=".17"/>`, 50, 50);
  s += poli(I, [p(0, 1, 0), p(1, 1, 0), p(1, 1, 1), p(0, 1, 1)], `fill="none" ${tr()}`);
  s += poli(I, [p(1, 0, 0), p(1, 1, 0), p(1, 1, 1), p(1, 0, 1)], `fill="none" ${tr()}`);
  if (estado === "tubo") s += poli(I, [p(0, 0, 1), p(1, 0, 1), p(1, 1, 1), p(0, 1, 1)], `fill="none" ${tr()}`);
  if (aberta) s += poli(I, [p(1, 0, 1), p(1, 1, 1), p(.84, .84, 1.36), p(.84, .16, 1.36)], `fill="${t.escuro}" ${tr()}`);
  if (estado === "fechada") {
    s += naFace(I, p(0, 0, 1), p(1, 0, 1), p(0, 1, 1), ARTE.tampa(t) + `<rect width="50" height="50" fill="#fff" opacity=".08"/>`, 50, 50);
    s += poli(I, [p(0, 0, 1), p(1, 0, 1), p(1, 1, 1), p(0, 1, 1)], `fill="none" ${tr()}`);
  }
  if (estado === "docinho") { const [x, y] = I(p(.5, .5, 1.75)); s += bombom(x, y, 5.5) + seta(`M${f2(x)},${f2(y + 9)} L${f2(x)},${f2(y + 20)}`); }
  return { svg: s, I, p };
};

const tesoura = (x, y, giro, esc = 1) => `<g transform="translate(${x} ${y}) rotate(${giro}) scale(${esc})" filter="url(#sombra-leve)">
  <path d="M-1,-1.6 L31,-8.2 Q33.5,-7.6 32,-6 L1,2Z" fill="url(#metal)" ${tr(1)}/><path d="M-1,1.6 L31,8.2 Q33.5,7.6 32,6 L1,-2Z" fill="url(#metal)" ${tr(1)}/>
  <path d="M1,-2.5 C-5,-13 -21,-13 -21,-6 C-21,-1 -10,0 1,-.8Z" fill="${DOURADO}" ${tr(1.1)}/><ellipse cx="-11.5" cy="-6.3" rx="5.2" ry="3" fill="#fffaf1" ${tr(.9)}/>
  <path d="M1,2.5 C-5,13 -21,13 -21,6 C-21,1 -10,0 1,.8Z" fill="#4f97d1" ${tr(1.1)}/><ellipse cx="-11.5" cy="6.3" rx="5.2" ry="3" fill="#fffaf1" ${tr(.9)}/>
  <circle cx="1" cy="0" r="1.7" fill="#8d969e" ${tr(.8)}/></g>`;
const cola = (x, y, giro, esc = 1) => `<g transform="translate(${x} ${y}) rotate(${giro}) scale(${esc})" filter="url(#sombra-leve)">
  <path d="M-9,0 L-9,-23 Q-9,-30 -3,-31 L3,-31 Q9,-30 9,-23 L9,0 Q9,3 6,3 L-6,3 Q-9,3 -9,0Z" fill="#fff" ${tr(1.1)}/>
  <rect x="-9" y="-20" width="18" height="11" fill="${VERMELHO}"/><text x="0" y="-12.6" class="svg-t" font-size="5.4" fill="#fff">COLA</text>
  <path d="M-9,0 L-9,-23 Q-9,-30 -3,-31 L3,-31 Q9,-30 9,-23 L9,0 Q9,3 6,3 L-6,3 Q-9,3 -9,0Z" fill="none" ${tr(1.1)}/>
  <path d="M-4.5,-31 L4.5,-31 L3,-37 L-3,-37Z" fill="${DOURADO}" ${tr(1)}/><path d="M-1.4,-37 L1.4,-37 L.6,-43 L-.6,-43Z" fill="${DOURADO}" ${tr(.9)}/>
  <path d="M-6,-27 Q-6,-29 -3.5,-29.5" stroke="#fff" stroke-width="1" fill="none"/></g>`;
const regua = (x, y, giro, comp = 90) => `<g transform="translate(${x} ${y}) rotate(${giro})" filter="url(#sombra-leve)"><rect width="${comp}" height="11" rx="1.5" fill="#ffe08a" fill-opacity=".93" ${tr(1)}/>${Array.from({ length: Math.floor(comp / 3) - 1 }, (_, k) => `<line x1="${3 * (k + 1)}" y1="0" x2="${3 * (k + 1)}" y2="${k % 5 === 4 ? 5 : 3}" stroke="${CONT}" stroke-width=".55"/>`).join("")}</g>`;
const caneta = (x, y, giro) => `<g transform="translate(${x} ${y}) rotate(${giro})" filter="url(#sombra-leve)">
  <path d="M0,0 L7,-2.6 L7,2.6Z" fill="#e8e2d8" ${tr(.9)}/><rect x="7" y="-3.2" width="40" height="6.4" rx="1.6" fill="#4f97d1" ${tr(1)}/>
  <rect x="39" y="-3.8" width="11" height="7.6" rx="2" fill="#2c6a9e" ${tr(1)}/><rect x="41" y="-6.6" width="13" height="2.4" rx="1" fill="#2c6a9e" ${tr(.8)}/></g>`;
const tagPendurada = (x, y, giro, esc, t = T) => `<g transform="translate(${x} ${y}) rotate(${giro}) scale(${esc})" filter="url(#sombra-leve)">
  <g clip-path="url(#clip-tag)"><rect width="40" height="60" fill="#fff"/>${fundoArte(t, 40, 38)}<image href="arte/${t.id}-adesivo.png" x="6" y="8" width="28" height="29"/>
  <line x1="5" y1="46" x2="35" y2="46" stroke="#9a8a80" stroke-width=".7"/><line x1="5" y1="53" x2="35" y2="53" stroke="#9a8a80" stroke-width=".7"/></g>
  <path d="M8,0 L32,0 L40,8 L40,60 L0,60 L0,8Z" fill="none" ${tr(1.1)}/><circle cx="20" cy="6" r="2.5" fill="#fffaf1" ${tr(.9)}/></g>`;
const laco = (x, y, esc = 1, cor = VERMELHO) => `<g transform="translate(${f2(x)} ${f2(y)}) scale(${esc})" filter="url(#sombra-leve)">
  <path d="M0,0 C-4,-9 -15,-9 -13,-2 C-12,2 -5,2 0,0Z" fill="${cor}" ${tr(1)}/><path d="M0,0 C4,-9 15,-9 13,-2 C12,2 5,2 0,0Z" fill="${cor}" ${tr(1)}/>
  <path d="M0,0 L-5,9 L-2,8 L0,1 L2,8 L5,9Z" fill="${cor}" ${tr(1)}/><circle r="2.6" fill="${cor}" ${tr(1)}/></g>`;
const papel = `<svg viewBox="0 0 30 36"><rect x="8" y="2" width="19" height="27" fill="#fff" ${tr(1.2)} transform="rotate(8 17 15)"/><rect x="4" y="5" width="19" height="27" fill="#fff" ${tr(1.2)}/><rect x="7" y="9" width="13" height="9" fill="${VERMELHO}"/><circle cx="10" cy="12" r="1" fill="#fff"/><circle cx="16" cy="15" r="1" fill="#fff"/></svg>`;
const PRECISA = [
  [papel, "Papel 180 g ou sulfite"],
  [`<svg viewBox="-24 -14 60 28">${tesoura(0, 0, 0)}</svg>`, "Tesoura sem ponta"],
  [`<svg viewBox="-14 -46 28 52">${cola(0, 0, 0)}</svg>`, "Cola"],
  [`<svg viewBox="-3 -3 46 17">${regua(0, 0, 0, 40)}</svg>`, "Régua"],
];

const passo = (n, titulo, desenho, texto) => `<figure class="passo"><svg class="ilu" viewBox="0 0 200 110"><rect width="200" height="110" fill="url(#fundo-ilu)"/>${desenho}</svg><div class="corpo"><h3><b>${n}</b>${titulo}</h3><p>${texto}</p></div></figure>`;

const fechada = caixa3D("fechada", .82, 86, 62), [tx, ty] = fechada.I(fechada.p(1, .5, 1));
const PASSOS_CAIXA = [
  ["Recorte", `<g transform="translate(43 6) scale(.54)" filter="url(#sombra-leve)">${rede(T, 2.4)}</g>
    <path d="M24,96 l9,-3 l2,6 l-8,4Z" fill="#fff" ${tr(.8)}/><path d="M172,84 l10,2 l-3,7 l-8,-3Z" fill="${T.base}" ${tr(.8)}/><path d="M166,96 l7,-2 l1,5 l-6,2Z" fill="#fff" ${tr(.8)}/>
    ${tesoura(30, 88, -12, .95)}`,
    "Corte em cima da linha preta contínua, contornando todas as abas. A linha tracejada não é para cortar."],
  ["Vinque as dobras", `<g transform="translate(38 -35)" filter="url(#sombra-leve)"><g clip-path="url(#clip-dobra)">${rede(T, 1.4)}</g></g>
    <line x1="98" y1="30" x2="98" y2="80" stroke="${VERDE}" stroke-width="2.4" stroke-dasharray="4 3"/>
    ${regua(111, 4, 90, 100)}${caneta(97.5, 64, -58)}${seta("M84,7 Q64,-1 56,20", VERDE)}
    ${legenda(180, 56, "caneta", "middle", VERDE)}${legenda(180, 64, "sem tinta", "middle", VERDE)}`,
    "Com a régua, passe uma caneta sem tinta nas linhas tracejadas e dobre todas para dentro."],
  ["Cole a aba", `<g transform="translate(12.4 -51) scale(1.1)" filter="url(#sombra-leve)"><g clip-path="url(#clip-cola)">${rede(T, 1.3)}</g></g>
    <path d="M18,40 q3,3 0,6 q-3,3 0,6 q3,3 0,6 q-3,3 0,6 q3,3 0,6" fill="none" stroke="#a89c8c" stroke-width="3.6" stroke-linecap="round"/><path d="M18,40 q3,3 0,6 q-3,3 0,6 q3,3 0,6 q-3,3 0,6 q3,3 0,6" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>
    ${cola(44.7, 2.8, -145, .9)}
    ${caixa3D("tubo", .62, 158, 52).svg}${seta("M82,44 Q105,28 128,42")}
    ${legenda(158, 103, "a aba fica por dentro")}`,
    "Passe cola na aba \"cole aqui\" e cole por dentro da outra ponta da peça. Segure alguns segundos."],
  ["Feche o fundo", `${caixa3D("aberta", .6, 108, 74).svg}
    <circle cx="40" cy="44" r="20" fill="#fff" ${tr(1)}/><path d="M28,40 A13,13 0 0 1 52,38" fill="none" stroke="${VERMELHO}" stroke-width="2.6" stroke-linecap="round" marker-end="url(#seta-v)"/><path d="M52,49 A13,13 0 0 1 28,51" fill="none" stroke="${VERMELHO}" stroke-width="2.6" stroke-linecap="round" marker-end="url(#seta-v)"/>
    ${legenda(40, 76, "vire a caixinha", "middle", VERMELHO)}${seta("M150,34 Q140,30 135,40", VERDE)}${seta("M70,30 Q80,26 86,36", VERDE)}`,
    "Vire a caixinha. Dobre as 2 abinhas para dentro e feche a tampa de baixo com a lingueta."],
  ["Coloque o docinho", (() => { const c = caixa3D("docinho", .6, 100, 74); return c.svg + seta(`M${pts([c.I(c.p(.5, 0, 2.35))])} Q${pts([c.I(c.p(.5, .75, 2.9))])} ${pts([c.I(c.p(.5, 1.15, 1.55))])}`, VERDE) + brilho(150, 22, 4) + brilho(160, 34, 2.5); })(),
    "Desvire, coloque o bombom, dobre as abinhas e feche a tampa de cima com a lingueta."],
  ["Pronto para presentear!", `${fechada.svg}<path d="M${f2(tx)},${f2(ty)} C${f2(tx + 14)},${f2(ty - 20)} 140,10 147,29" fill="none" stroke="${VERMELHO}" stroke-width="1.6"/>
    ${laco(tx, ty, .9)}${tagPendurada(133, 21, 12, .78)}${brilho(36, 26, 5)}${brilho(46, 14, 3)}${brilho(176, 88, 4)}`,
    "Recorte uma tag, fure a bolinha, escreva o nome e amarre na caixinha com uma fitinha."],
];
const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Caixinhas de Natal para presentear</title>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600&family=Nunito:wght@600;700&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { margin: 0; font-family: Nunito, sans-serif; color: #3a2a24; }
  .pag { width: 210mm; height: 297mm; position: relative; overflow: hidden; break-after: page; background: #fff; }
  /* prévia: com #pN na URL, só aquela página aparece */
  body:has(.pag:target) .pag:not(:target) { display: none; }
  .linhas { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
  .corte { fill: none; stroke: #333; stroke-width: .3; }
  circle.corte { fill: #fff; }
  .dobra { stroke: #333; stroke-width: .3; stroke-dasharray: 1.5 1.2; opacity: .75; }
  .adesivo { display: block; }

  .caixa { position: absolute; left: 15mm; top: 9mm; width: 180mm; height: 210mm; }
  .planta { position: absolute; left: 0; top: 0; width: 210mm; height: 180mm; transform-origin: 0 0; transform: translate(180mm, 0) rotate(90deg); }
  .abas { position: absolute; inset: 0; width: 100%; height: 100%; }
  .face { position: absolute; width: 50mm; height: 50mm; display: flex; align-items: center; justify-content: center; }
  .selo { background: #fff; border-radius: 6mm; padding: 2.5mm 4mm; text-align: center; font: 600 17pt/1.05 Fredoka, sans-serif; box-shadow: 0 .6mm 1.2mm rgba(0,0,0,.2); }
  .parade { background: #fff; border-radius: 3mm; padding: 2mm 3mm; display: flex; flex-direction: column; justify-content: space-around; font-weight: 700; box-shadow: 0 .6mm 1.2mm rgba(0,0,0,.2); }
  .parade p { margin: 0; display: flex; gap: 1.5mm; align-items: flex-end; }
  .parade span { flex: 1; border-bottom: .3mm solid #9a8a80; height: 1em; }

  .tags { position: absolute; left: 0; right: 0; top: 226mm; display: flex; justify-content: center; gap: 12mm; }
  .tag { position: relative; width: 40mm; height: 60mm; background: #fff; clip-path: polygon(8mm 0, 32mm 0, 100% 8mm, 100% 100%, 0 100%, 0 8mm); }
  .tag-topo { height: 38mm; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 1mm; }
  .tag .parade { margin: 2.5mm auto 0; box-shadow: none; padding: 0; }

  .capa { background: #fdf8ee; text-align: center; padding: 22mm 18mm 0; }
  .capa .marca { display: inline-block; background: ${VERMELHO}; color: #fff; border-radius: 99px; padding: 2mm 6mm; font: 600 12pt Fredoka, sans-serif; letter-spacing: .08em; }
  .capa h1 { font: 600 40pt/1.05 Fredoka, sans-serif; color: ${VERMELHO}; margin: 8mm 0 3mm; }
  .capa h2 { font: 500 20pt Fredoka, sans-serif; color: ${VERDE}; margin: 0 0 8mm; }
  .capa .grade { display: grid; grid-template-columns: repeat(2, 72mm); justify-content: center; gap: 4mm 10mm; }
  .capa .grade img { width: 72mm; }
  .capa ul { list-style: none; padding: 0; margin: 8mm 0 0; font-size: 14pt; font-weight: 700; color: ${VERDE}; }
  .capa .uso { margin: 8mm auto 0; max-width: 140mm; text-align: left; }

  .bump { display: none; } .bump:target { display: block; } body:has(.bump:target) .pag { display: none; }
  .fundo { position: absolute; inset: 0; width: 100%; height: 100%; }
  .face > :not(.fundo), .tag-topo > :not(.fundo) { position: relative; }
  .tag-topo { position: relative; }

  .svg-t { font-family: Fredoka, sans-serif; font-weight: 600; text-anchor: middle; }
  .svg-n { font-family: Nunito, sans-serif; font-weight: 700; }
  .guia { padding: 10mm 13mm 0; background: #fffdf8; }
  .guia .topo { display: flex; align-items: center; justify-content: space-between; }
  .guia .topo img { width: 24mm; margin: -2mm 0; }
  .guia .marca { display: inline-block; background: ${VERDE}; color: #fff; border-radius: 99px; padding: 1mm 4mm; font: 600 9pt Fredoka, sans-serif; letter-spacing: .12em; }
  .guia h1 { font: 600 24pt/1.1 Fredoka, sans-serif; color: ${VERMELHO}; margin: 2mm 0 0; }
  .precisa { display: flex; align-items: center; gap: 2.5mm; margin-top: 3mm; background: #fdf1dc; border-radius: 4mm; padding: 2mm 3.5mm; font-size: 9pt; }
  .precisa > b { font: 600 10.5pt Fredoka, sans-serif; color: ${VERDE}; white-space: nowrap; }
  .precisa span { display: flex; align-items: center; gap: 1.5mm; background: #fff; border-radius: 99px; padding: .8mm 3mm .8mm 1.5mm; font-weight: 700; white-space: nowrap; }
  .precisa svg { width: 7.5mm; height: 7.5mm; }
  .aviso { margin: 2.5mm 0 0; font-size: 9.5pt; color: #6b5a52; }
  .aviso b { color: ${VERMELHO}; }
  .passos { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm 6mm; margin-top: 3.5mm; }
  .passo { margin: 0; background: #fff; border-radius: 5mm; overflow: hidden; box-shadow: 0 .8mm 2.5mm rgba(58,42,36,.14); }
  .passo .ilu { display: block; width: 100%; }
  .passo .corpo { padding: 2.2mm 3.5mm 3mm; }
  .passo h3 { display: flex; align-items: center; gap: 2mm; margin: 0 0 1mm; font: 600 12.5pt Fredoka, sans-serif; color: ${VERDE}; }
  .passo h3 b { flex: 0 0 7mm; height: 7mm; border-radius: 50%; background: ${VERMELHO}; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 11pt; }
  .passo p { margin: 0; font-size: 9.5pt; line-height: 1.32; color: #4a3a33; }
  .uso { margin: 0; align-self: center; background: #fdf1dc; border-radius: 5mm; padding: 5mm; font-size: 10pt; line-height: 1.4; }
  .uso b { display: block; font: 600 12.5pt Fredoka, sans-serif; color: ${VERDE}; margin-bottom: 1mm; }
  .rodape-guia { position: absolute; left: 0; right: 0; bottom: 5mm; text-align: center; font-size: 8pt; color: #b5a89e; }
</style></head><body>
${DEFS}

<section class="pag capa" id="p1">
  <span class="marca">NATAL MÁGICO</span>
  <h1>Caixinhas de Natal</h1>
  <h2>para presentear</h2>
  <div class="grade">${TEMAS.map(t => `<img src="arte/${t.id}-adesivo.png" alt="">`).join("")}</div>
  <ul><li>4 caixinhas para bombom</li><li>12 tags de presente</li></ul>
  <p class="uso"><b>Uso pessoal</b>Imprima quantas vezes quiser para a sua família. Não é permitido revender nem repassar este arquivo.</p>
</section>

<section class="pag guia" id="p2">
  <div class="topo"><div><span class="marca">PASSO A PASSO</span><h1>Como montar a caixinha</h1></div><img src="arte/${T.id}-adesivo.png" alt=""></div>
  <div class="precisa"><b>Você vai precisar:</b>${PRECISA.map(([i, t]) => `<span>${i}${t}</span>`).join("")}</div>
  <p class="aviso">Imprima em <b>tamanho real (100%)</b>, não "ajustar à página". Recorte com a ajuda de um adulto.</p>
  <div class="passos">${PASSOS_CAIXA.map(([t, d, x], k) => passo(k + 1, t, d, x)).join("")}</div>
  <p class="rodape-guia">Natal Mágico · Caixinhas de Natal para presentear</p>
</section>

${TEMAS.map((t, k) => `<section class="pag" id="p${k + 3}">${caixa(t)}<div class="tags">${tag(t)}${tag(t)}${tag(t)}</div></section>`).join("\n")}

<!-- imagem do order bump na Wiapy (800 x 800), fora do PDF -->
<section class="bump" id="bump"><svg viewBox="0 0 200 200" width="800" height="800">
  <rect width="200" height="200" fill="#fdf8ee"/>
  <text x="100" y="29" class="svg-t" font-size="20" fill="${VERMELHO}">Caixinhas de Natal</text>
  <text x="100" y="43" class="svg-n" font-size="8.5" text-anchor="middle" fill="${VERDE}">4 caixinhas + 12 tags para imprimir</text>
  ${[[1, 66, 92], [3, 134, 92], [0, 64, 141], [2, 136, 141]].map(([i, x, y]) => caixa3D("fechada", .7, x, y, TEMAS[i]).svg).join("")}
  ${tagPendurada(158, 46, 14, .55, TEMAS[2])}${brilho(28, 64, 5)}${brilho(38, 54, 3)}${brilho(100, 112, 4)}${brilho(176, 150, 4)}
  <rect x="45" y="180" width="110" height="13" rx="6.5" fill="${VERDE}"/><text x="100" y="188.6" class="svg-n" font-size="6.5" text-anchor="middle" fill="#fff">PDF colorido para imprimir em casa</text>
</svg></section>

<!-- capa do conteúdo na Wiapy (1080 x 1920), fora do PDF -->
<section class="bump" id="capa-wiapy"><svg viewBox="0 0 200 356" width="1080" height="1920">
  <rect width="200" height="356" fill="#fdf8ee"/>
  <rect x="62" y="38" width="76" height="14" rx="7" fill="${VERMELHO}"/><text x="100" y="47.6" class="svg-t" font-size="7" fill="#fff" letter-spacing=".6">NATAL MÁGICO</text>
  <text x="100" y="80" class="svg-t" font-size="25" fill="${VERMELHO}">Caixinhas</text><text x="100" y="105" class="svg-t" font-size="25" fill="${VERMELHO}">de Natal</text>
  <text x="100" y="121" class="svg-t" font-size="11" fill="${VERDE}">para presentear</text>
  <g transform="translate(0 110)">${[[1, 66, 92], [3, 134, 92], [0, 64, 141], [2, 136, 141]].map(([i, x, y]) => caixa3D("fechada", .7, x, y, TEMAS[i]).svg).join("")}${tagPendurada(156, 40, 14, .55, TEMAS[2])}${brilho(28, 64, 5)}${brilho(38, 54, 3)}${brilho(100, 112, 4)}${brilho(176, 150, 4)}</g>
  <text x="100" y="318" class="svg-n" font-size="9" text-anchor="middle" fill="${VERDE}">4 caixinhas + 12 tags</text>
  <rect x="40" y="326" width="120" height="14" rx="7" fill="${VERDE}"/><text x="100" y="335.4" class="svg-n" font-size="6.8" text-anchor="middle" fill="#fff">PDF colorido para imprimir em casa</text>
</svg></section>

</body></html>`;

const arquivo = join(AQUI, "caixinhas.html");
writeFileSync(arquivo, html);
const url = pathToFileURL(arquivo).href;
mkdirSync(join(AQUI, "..", "entregaveis"), { recursive: true });
mkdirSync(join(AQUI, "previa"), { recursive: true });
const pdf = join(AQUI, "..", "entregaveis", "Caixinhas de Natal para presentear.pdf");
const PAGINAS = 6;
for (let p = 1; p <= PAGINAS; p++) foto(url + "#p" + p, join(AQUI, "previa", `p${p}.png`), 794, 1123, 3.125);
foto(url + "#bump", join(AQUI, "..", "thumb-bump-caixinhas.png"), 800, 800);
foto(url + "#capa-wiapy", join(AQUI, "..", "capa-bump-caixinhas-1080x1920.png"), 1080, 1920);
juntarPdf(AQUI, Array.from({ length: PAGINAS }, (_, k) => `previa/p${k + 1}.png`), pdf, "Caixinhas de Natal para presentear");
console.log("ok:", pdf);
