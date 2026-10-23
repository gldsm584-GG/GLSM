// Motor comum dos vídeos de anúncio: linha do tempo, animação, desenho em SVG, efeitos sonoros
// sintetizados (Web Audio), narração e a prévia no navegador.
//
// Cada vídeo (pasta video-N-nome/) tem um video.html que carrega este arquivo e chama, na ordem:
//   definirCenas(ORDEM, MINIMO)   -> monta a tabela T (começo de cada cena, em segundos) e o TOTAL
//   iniciarVideo({ desenhar, sons, aoBuscar })
// Nos elementos, data-anim="pop .5 p1+.3 back; sai .3 p2" anima com tempos da tabela T.

const NS = "http://www.w3.org/2000/svg";
const EASE = {
  out: "cubic-bezier(.22,1,.36,1)", back: "cubic-bezier(.34,1.56,.64,1)",
  in: "cubic-bezier(.55,0,1,.45)", inout: "cubic-bezier(.65,0,.35,1)", linear: "linear",
};
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));

// ===================== TEMPO =====================
// Narração gerada pelo narrar.py (voz/voz.js). Com ?semvoz no endereço, o vídeo sai sem ela.
const VOZ = new URLSearchParams(location.search).has("semvoz") ? null : window.VOZ || null;
const ATRASO_VOZ = .15; // a fala começa logo depois da cena entrar
const T = {};
let ORDEM = [];
let TOTAL = 0;

// Cada cena dura o mínimo que a animação dela pede ou, com narração, o que a fala pedir.
// folgas: tempo extra depois da fala, por cena (padrão .3 s; na última, 1.2 s para o acorde final).
function definirCenas(ordem, minimo, folgas = {}) {
  ORDEM = ordem;
  TOTAL = 0;
  for (const cena of ordem) {
    T[cena] = TOTAL;
    const folga = folgas[cena] ?? (cena === ordem[ordem.length - 1] ? 1.2 : .3);
    TOTAL += Math.max(minimo[cena], VOZ ? ATRASO_VOZ + VOZ[cena].dur + folga : 0);
  }
  TOTAL = Math.round(TOTAL * 10) / 10;
}

// "p2+.3" -> 6.7
function tempo(expr) {
  const conta = String(expr).replace(/[a-z]\w*/g, (nome) => {
    if (!(nome in T)) throw new Error("Cena desconhecida: " + nome);
    return T[nome];
  });
  return Function("return (" + conta + ")")();
}

// data-anim="pop .5 p1+.3 back; sai .3 p2" -> animation CSS com atraso absoluto.
// A 1ª animação preenche antes e depois (both); as seguintes só depois (forwards).
function animar(el, spec) {
  el.style.animation = spec.split(";").map((s) => s.trim()).filter(Boolean).map((parte, i) => {
    const [nome, dur, quando, ease = "out", rep] = parte.split(/\s+/);
    return `${nome} ${dur}s ${EASE[ease]} ${tempo(quando)}s ${rep === "inf" ? "infinite" : 1} ${i === 0 ? "both" : "forwards"}`;
  }).join(", ");
}

// Quando cada fala começa (o render.mjs mistura a voz com os efeitos no ffmpeg)
function linhaDaVoz() {
  return VOZ ? ORDEM.map((cena) => ({ cena, arquivo: VOZ[cena].arquivo, inicio: T[cena] + ATRASO_VOZ })) : [];
}

// Volume da narração no instante t (0 a 1), para mexer a boca de personagem junto com a fala
function nivelDaVoz(t) {
  for (const f of linhaDaVoz()) {
    const env = VOZ[f.cena].env;
    const i = Math.floor((t - f.inicio) * 30);
    if (env && i >= 0 && i < env.length) return env[i];
  }
  return 0;
}

// ===================== DESENHO =====================
function svg(tag, attrs, pai) {
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  if (pai) pai.appendChild(el);
  return el;
}
function usar(id, attrs, pai) { return svg("use", { href: "#" + id, ...attrs }, pai); }

// Sorteio com semente fixa: o vídeo sai igual toda vez.
function sorteio(semente) {
  return () => {
    semente |= 0; semente = (semente + 0x6d2b79f5) | 0;
    let t = Math.imul(semente ^ (semente >>> 15), 1 | semente);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Títulos (class="palavras" data-t="p1+.1") entram palavra por palavra
function dividirPalavras(el) {
  const novos = [];
  const andar = (no, destaque) => {
    for (const n of [...no.childNodes]) {
      if (n.nodeType === 3) {
        for (const p of n.textContent.split(/(\s+)/)) {
          if (!p) continue;
          if (/^\s+$/.test(p)) { novos.push(document.createTextNode(" ")); continue; }
          const s = document.createElement("span");
          s.className = "w" + (destaque ? " destaque" : "");
          s.textContent = p;
          novos.push(s);
        }
      } else andar(n, destaque || n.tagName === "EM");
    }
  };
  andar(el, false);
  el.replaceChildren(...novos);
  const inicio = tempo(el.dataset.t);
  novos.filter((n) => n.nodeType === 1).forEach((s, i) => animar(s, `sobe .5 ${(inicio + i * .06).toFixed(3)} out`));
}

// ===================== SOM =====================
// Tudo sintetizado aqui. O sons(ctx, m, t0) de cada vídeo agenda os efeitos na linha do tempo.
function ruidoBuffer(ctx, seg = 2) {
  const b = ctx.createBuffer(1, ctx.sampleRate * seg, ctx.sampleRate);
  const d = b.getChannelData(0), r = sorteio(99);
  for (let i = 0; i < d.length; i++) d[i] = r() * 2 - 1;
  return b;
}
function impulso(ctx, seg, decai) {
  const n = Math.floor(ctx.sampleRate * seg), b = ctx.createBuffer(2, n, ctx.sampleRate), r = sorteio(5);
  for (let c = 0; c < 2; c++) {
    const d = b.getChannelData(c);
    for (let i = 0; i < n; i++) d[i] = (r() * 2 - 1) * Math.pow(1 - i / n, decai);
  }
  return b;
}
function montarMixer(ctx) {
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -14; comp.knee.value = 8; comp.ratio.value = 3.5; comp.attack.value = .004; comp.release.value = .2;
  comp.connect(ctx.destination);
  const master = ctx.createGain(); master.gain.value = .9; master.connect(comp);
  const rev = ctx.createConvolver(); rev.buffer = impulso(ctx, 1.8, 3.2);
  const revVol = ctx.createGain(); revVol.gain.value = .3; rev.connect(revVol).connect(master);
  const musica = ctx.createGain(); musica.gain.value = .45; musica.connect(master);
  const sfx = ctx.createGain(); sfx.gain.value = 1; sfx.connect(master);
  return { ctx, master, rev, musica, sfx, ruido: ruidoBuffer(ctx) };
}
function envelope(param, at, pico, ataque, decai) {
  param.setValueAtTime(0.0001, at);
  param.linearRampToValueAtTime(pico, at + ataque);
  param.exponentialRampToValueAtTime(0.0001, at + ataque + decai);
}
// Liga um nó na saída, com um pouco de eco (reverb) se pedir
function ligar(m, no, destino, eco = 0) {
  no.connect(destino);
  if (eco) { const g = m.ctx.createGain(); g.gain.value = eco; no.connect(g).connect(m.rev); }
}
function osc(m, tipo, f, at, dur) {
  const o = m.ctx.createOscillator(); o.type = tipo; o.frequency.setValueAtTime(f, at);
  o.start(at); o.stop(at + dur + .05);
  return o;
}
function ruido(m, at, dur) {
  const s = m.ctx.createBufferSource(); s.buffer = m.ruido; s.loop = true;
  s.start(at, (at * 7.3) % 1.5); s.stop(at + dur + .05);
  return s;
}
const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);

const SOM = {
  pop(m, at, f = 520, vol = .45) {
    const o = osc(m, "sine", f * 1.9, at, .2), g = m.ctx.createGain();
    o.frequency.exponentialRampToValueAtTime(f, at + .07);
    envelope(g.gain, at, vol, .004, .14);
    ligar(m, o.connect(g), m.sfx, .15);
  },
  ding(m, at, f = 1046.5, vol = .28, dur = 1.1) {
    [[1, 1], [2, .28], [3.01, .1]].forEach(([mult, v]) => {
      const o = osc(m, "sine", f * mult, at, dur), g = m.ctx.createGain();
      envelope(g.gain, at, vol * v, .004, dur / mult);
      ligar(m, o.connect(g), m.sfx, .45);
    });
  },
  certo(m, at) { SOM.ding(m, at, 1046.5, .24); SOM.ding(m, at + .09, 1568, .24); },
  errado(m, at) {
    [[311, 0, .12], [233, .15, .24]].forEach(([f, d, dur]) => {
      const o = osc(m, "triangle", f, at + d, dur), g = m.ctx.createGain(), lp = m.ctx.createBiquadFilter();
      lp.type = "lowpass"; lp.frequency.value = 1400;
      g.gain.setValueAtTime(0.0001, at + d); g.gain.linearRampToValueAtTime(.26, at + d + .01);
      g.gain.setValueAtTime(.26, at + d + dur * .7); g.gain.exponentialRampToValueAtTime(0.0001, at + d + dur);
      ligar(m, o.connect(lp).connect(g), m.sfx, .1);
    });
  },
  whoosh(m, at, dur = .45, vol = .35, sobe = true) {
    const s = ruido(m, at, dur), bp = m.ctx.createBiquadFilter(), g = m.ctx.createGain(), pan = m.ctx.createStereoPanner();
    bp.type = "bandpass"; bp.Q.value = 1.1;
    bp.frequency.setValueAtTime(sobe ? 350 : 3200, at); bp.frequency.exponentialRampToValueAtTime(sobe ? 3500 : 300, at + dur);
    g.gain.setValueAtTime(0.0001, at); g.gain.linearRampToValueAtTime(vol, at + dur * .6); g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    pan.pan.setValueAtTime(sobe ? -.6 : .6, at); pan.pan.linearRampToValueAtTime(sobe ? .6 : -.6, at + dur);
    ligar(m, s.connect(bp).connect(g).connect(pan), m.sfx, .1);
  },
  baque(m, at, vol = .75) {
    const o = osc(m, "sine", 150, at, .4), g = m.ctx.createGain();
    o.frequency.exponentialRampToValueAtTime(46, at + .2);
    envelope(g.gain, at, vol, .003, .32);
    ligar(m, o.connect(g), m.sfx);
    const s = ruido(m, at, .08), lp = m.ctx.createBiquadFilter(), g2 = m.ctx.createGain();
    lp.type = "lowpass"; lp.frequency.value = 500; envelope(g2.gain, at, vol * .5, .002, .07);
    ligar(m, s.connect(lp).connect(g2), m.sfx);
  },
  pedras(m, at, n = 16, dur = .55) {
    const r = sorteio(Math.floor(at * 1000));
    for (let i = 0; i < n; i++) {
      const t = at + r() * dur, s = ruido(m, t, .05), bp = m.ctx.createBiquadFilter(), g = m.ctx.createGain();
      bp.type = "bandpass"; bp.frequency.value = 1500 + r() * 2500; bp.Q.value = 5;
      envelope(g.gain, t, .5 + r() * .5, .001, .035 + r() * .03);
      ligar(m, s.connect(bp).connect(g), m.sfx, .05);
    }
  },
  terra(m, at, dur = 1) {
    const s = ruido(m, at, dur + .2), lp = m.ctx.createBiquadFilter(), g = m.ctx.createGain();
    lp.type = "lowpass"; lp.frequency.value = 900;
    g.gain.setValueAtTime(0.0001, at); g.gain.linearRampToValueAtTime(.3, at + .12);
    g.gain.setValueAtTime(.3, at + dur * .75); g.gain.exponentialRampToValueAtTime(0.0001, at + dur + .2);
    ligar(m, s.connect(lp).connect(g), m.sfx);
    const r = sorteio(321);
    for (let i = 0; i < 30; i++) {
      const t = at + r() * dur, s2 = ruido(m, t, .04), bp = m.ctx.createBiquadFilter(), g2 = m.ctx.createGain();
      bp.type = "bandpass"; bp.frequency.value = 600 + r() * 1400; bp.Q.value = 3;
      envelope(g2.gain, t, .25 + r() * .25, .001, .03);
      ligar(m, s2.connect(bp).connect(g2), m.sfx);
    }
  },
  gota(m, at, f = 900, vol = .3) {
    const o = osc(m, "sine", f, at, .15), g = m.ctx.createGain();
    o.frequency.exponentialRampToValueAtTime(f * 2.3, at + .05);
    envelope(g.gain, at, vol, .002, .09);
    ligar(m, o.connect(g), m.sfx, .35);
  },
  agua(m, at, dur) {
    const s = ruido(m, at, dur + .2), bp = m.ctx.createBiquadFilter(), g = m.ctx.createGain();
    bp.type = "bandpass"; bp.frequency.value = 2400; bp.Q.value = .8;
    g.gain.setValueAtTime(0.0001, at); g.gain.linearRampToValueAtTime(.09, at + .2);
    g.gain.setValueAtTime(.09, at + dur - .2); g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    ligar(m, s.connect(bp).connect(g), m.sfx, .2);
  },
  tique(m, at, f = 1900, vol = .22) {
    const o = osc(m, "square", f, at, .04), g = m.ctx.createGain(), lp = m.ctx.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.value = 3500;
    envelope(g.gain, at, vol, .001, .035);
    ligar(m, o.connect(lp).connect(g), m.sfx);
  },
  brilho(m, at, vol = .14) {
    [2093, 2637, 3136, 3520, 4186].forEach((f, i) => {
      const t = at + i * .045, o = osc(m, "sine", f, t, .3), g = m.ctx.createGain();
      envelope(g.gain, t, vol, .002, .28);
      ligar(m, o.connect(g), m.sfx, .5);
    });
  },
  // Cadeado fechando: estalo curto e grave
  trava(m, at, vol = .5) {
    const s = ruido(m, at, .05), bp = m.ctx.createBiquadFilter(), g = m.ctx.createGain();
    bp.type = "bandpass"; bp.frequency.value = 1300; bp.Q.value = 4;
    envelope(g.gain, at, vol, .001, .04);
    ligar(m, s.connect(bp).connect(g), m.sfx, .1);
    const o = osc(m, "sine", 260, at, .12), g2 = m.ctx.createGain();
    o.frequency.exponentialRampToValueAtTime(140, at + .08);
    envelope(g2.gain, at, vol * .8, .002, .09);
    ligar(m, o.connect(g2), m.sfx);
  },
  // "Hum?": sobe e termina num toque no ar, sem resolver
  duvida(m, at) {
    SOM.subida(m, at, .32, 392, 740, .14);
    SOM.ding(m, at + .3, 1108.7, .22, 1.3);
  },
  subida(m, at, dur = .8, de = 220, ate = 880, vol = .16) {
    const o = osc(m, "triangle", de, at, dur), g = m.ctx.createGain(), lfo = osc(m, "sine", 9, at, dur), lg = m.ctx.createGain();
    o.frequency.exponentialRampToValueAtTime(ate, at + dur);
    lg.gain.value = 12; lfo.connect(lg).connect(o.frequency);
    g.gain.setValueAtTime(0.0001, at); g.gain.linearRampToValueAtTime(vol, at + dur * .7); g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    ligar(m, o.connect(g), m.sfx, .3);
  },
};

// Trilha leve (marimba + baixo + batida), em colcheias. Padrão: 120 BPM, acordes C G Am F.
function musica(m, t0, {
  bpm = 120, batidaDesde = 0, volume = .2,
  acordes = [[60, 64, 67, 72], [59, 62, 67, 71], [60, 64, 69, 72], [60, 65, 69, 72]],
  baixos = [48, 43, 45, 41], desenho = [0, 1, 2, 3, 2, 1, 2, 3],
  final = [48, 60, 64, 67, 72, 76],
} = {}) {
  const tocar = (at, nota, vol, dur = .35, harm = .12) => {
    const f = midi(nota), o1 = osc(m, "sine", f, at, dur), o2 = osc(m, "sine", f * 4, at, dur * .4), g = m.ctx.createGain(), g2 = m.ctx.createGain();
    envelope(g.gain, at, vol, .003, dur); envelope(g2.gain, at, vol * harm, .002, dur * .3);
    ligar(m, o1.connect(g), m.musica, .25); ligar(m, o2.connect(g2), m.musica, .25);
  };
  const colcheia = 30 / bpm;
  const fimMusica = TOTAL - 1.4;
  for (let k = 0; ; k++) {
    const t = k * colcheia; if (t >= fimMusica - .01) break;
    const compasso = Math.floor(k / 8), ac = acordes[compasso % acordes.length], at = t0 + t;
    tocar(at, ac[desenho[k % 8]], volume);
    if (k % 4 === 0) tocar(at, baixos[compasso % baixos.length], .4, .5, .3);
    if (t >= batidaDesde - .05) {
      if (k % 4 === 0) { // bumbo
        const o = osc(m, "sine", 110, at, .25), g = m.ctx.createGain();
        o.frequency.exponentialRampToValueAtTime(42, at + .12); envelope(g.gain, at, .55, .002, .2); ligar(m, o.connect(g), m.musica);
      }
      if (k % 2 === 1) { // chimbal
        const s = ruido(m, at, .05), hp = m.ctx.createBiquadFilter(), g = m.ctx.createGain();
        hp.type = "highpass"; hp.frequency.value = 7000; envelope(g.gain, at, .12, .001, .04); ligar(m, s.connect(hp).connect(g), m.musica);
      }
    }
  }
  // Acorde final
  final.forEach((n, i) => tocar(t0 + fimMusica + i * .03, n, n < 50 ? .4 : .14, 1.6, .08));
}

// ===================== VÍDEO =====================
let animacoes = [];
let VIDEO = null;

function seek(t) {
  for (const a of animacoes) a.currentTime = t * 1000;
  if (VIDEO.aoBuscar) VIDEO.aoBuscar(t);
}

// Gera a trilha inteira (para o render.mjs) e devolve um WAV 16 bits em base64
async function gerarAudioWav() {
  const sr = 48000, off = new OfflineAudioContext(2, Math.ceil(TOTAL * sr), sr);
  VIDEO.sons(off, montarMixer(off), 0);
  const buf = await off.startRendering();
  const L = buf.getChannelData(0), R = buf.getChannelData(1);
  let pico = 0;
  for (let i = 0; i < L.length; i++) pico = Math.max(pico, Math.abs(L[i]), Math.abs(R[i]));
  const ganho = pico > 0 ? .89 / pico : 1; // pico em -1 dB
  const n = L.length, dados = new DataView(new ArrayBuffer(44 + n * 4));
  const txt = (o, s) => [...s].forEach((c, i) => dados.setUint8(o + i, c.charCodeAt(0)));
  txt(0, "RIFF"); dados.setUint32(4, 36 + n * 4, true); txt(8, "WAVE"); txt(12, "fmt ");
  dados.setUint32(16, 16, true); dados.setUint16(20, 1, true); dados.setUint16(22, 2, true);
  dados.setUint32(24, sr, true); dados.setUint32(28, sr * 4, true); dados.setUint16(32, 4, true); dados.setUint16(34, 16, true);
  txt(36, "data"); dados.setUint32(40, n * 4, true);
  for (let i = 0; i < n; i++) {
    dados.setInt16(44 + i * 4, clamp(L[i] * ganho, -1, 1) * 32767, true);
    dados.setInt16(46 + i * 4, clamp(R[i] * ganho, -1, 1) * 32767, true);
  }
  const bytes = new Uint8Array(dados.buffer);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return { base64: btoa(bin), pico };
}

// Prévia no navegador: botão Tocar (com som e narração) e barra para arrastar o tempo
function montarPrevia() {
  const modoRender = new URLSearchParams(location.search).has("render");
  if (modoRender) { document.body.classList.add("render"); return; }

  const palco = document.getElementById("palco-video");
  const ajustarTela = () => {
    const altura = window.innerHeight - 56, esc = Math.min(altura / 1920, window.innerWidth / 1080);
    palco.style.transform = `scale(${esc})`;
    palco.style.left = (window.innerWidth - 1080 * esc) / 2 + "px";
  };
  window.addEventListener("resize", ajustarTela);
  ajustarTela();

  const controles = document.createElement("div");
  controles.id = "controles";
  controles.innerHTML = '<button>▶ Tocar</button><input type="range" min="0" max="1000" value="0"><span>0.0 s</span>';
  document.body.appendChild(controles);
  const [tocar, barra, relogio] = controles.children;

  let audio = null, inicioAudio = 0, falas = [];
  const pararFalas = () => {
    falas.forEach((f) => { clearTimeout(f.espera); f.el.pause(); });
    falas = [];
  };
  const mostrar = (t) => {
    seek(t);
    barra.value = Math.round((t / TOTAL) * 1000);
    relogio.textContent = t.toFixed(1) + " s";
  };
  tocar.addEventListener("click", () => {
    if (audio) audio.close();
    pararFalas();
    audio = new AudioContext();
    inicioAudio = audio.currentTime + .15;
    VIDEO.sons(audio, montarMixer(audio), inicioAudio);
    for (const f of linhaDaVoz()) {
      const el = new Audio("voz/" + f.arquivo);
      falas.push({ el, espera: setTimeout(() => el.play(), (f.inicio + .15) * 1000) });
    }
    const quadro = () => {
      if (!audio) return;
      const t = audio.currentTime - inicioAudio;
      mostrar(clamp(t, 0, TOTAL));
      if (t < TOTAL) requestAnimationFrame(quadro);
    };
    requestAnimationFrame(quadro);
  });
  barra.addEventListener("input", () => {
    if (audio) { audio.close(); audio = null; }
    pararFalas();
    mostrar((barra.value / 1000) * TOTAL);
  });
}

// desenhar(): monta o SVG gerado por código. sons(ctx, m, t0): agenda os efeitos.
// aoBuscar(t): o que não é animação CSS (contadores, boca da personagem...).
function iniciarVideo(video) {
  VIDEO = video;
  if (video.desenhar) video.desenhar();
  document.querySelectorAll(".palavras").forEach(dividirPalavras);
  document.querySelectorAll("[data-anim]").forEach((el) => animar(el, el.dataset.anim));
  getComputedStyle(document.body).opacity; // força o navegador a criar as animações
  animacoes = document.getAnimations();
  animacoes.forEach((a) => a.pause());
  seek(0);
  montarPrevia();
  window.TOTAL = TOTAL;
  window.linhaDaVoz = linhaDaVoz;
  window.seek = seek;
  window.gerarAudioWav = gerarAudioWav;
  window.pronto = true;
}
