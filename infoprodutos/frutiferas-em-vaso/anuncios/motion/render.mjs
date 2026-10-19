// Gera o vídeo a partir de video-jeito-facil.html (1080x1920, 30 fps, com som) em ../videos/:
//   video-4-jeito-facil-narrado.mp4  com a narração da pasta voz/ (gerada pelo narrar.py)
//   video-4-jeito-facil.mp4          com --sem-voz (só efeitos e música)
// Uso: node render.mjs [--sem-voz]   (dentro desta pasta)
// Precisa do Playwright (npm i -g playwright && npx playwright install chromium) e do ffmpeg no PATH.
// Com --prints 3,8.5,20 ele só salva prints desses segundos (para conferir sem gerar o vídeo).
import { spawn, execSync, execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { once } from "node:events";
import { mkdirSync, writeFileSync, rmSync, mkdtempSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { tmpdir } from "node:os";

const AQUI = dirname(fileURLToPath(import.meta.url));
const HTML = join(AQUI, "video-jeito-facil.html");
const COM_VOZ = !process.argv.includes("--sem-voz") && existsSync(join(AQUI, "voz", "voz.js"));
const SAIDA = join(AQUI, "..", "videos", COM_VOZ ? "video-4-jeito-facil-narrado.mp4" : "video-4-jeito-facil.mp4");
const FPS = 30;

// Acha o Playwright instalado na pasta ou globalmente
function carregarPlaywright() {
  try { return createRequire(import.meta.url)("playwright"); } catch {}
  const global = execSync("npm root -g").toString().trim();
  return createRequire(join(global, "x.js"))("playwright");
}

const { chromium } = carregarPlaywright();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(HTML).href + (COM_VOZ ? "?render" : "?render&semvoz"));
await page.waitForFunction(() => window.pronto === true);
await page.evaluate(() => document.fonts.ready);
const TOTAL = await page.evaluate(() => window.TOTAL);

const iPrints = process.argv.indexOf("--prints");
if (iPrints > 0) {
  for (const s of process.argv[iPrints + 1].split(",").map(Number)) {
    await page.evaluate((t) => window.seek(t), s);
    const png = join(AQUI, `print-${s}.png`);
    await page.screenshot({ path: png });
    console.log("Print:", png);
  }
  await browser.close();
  process.exit(0);
}

// 1. Som: a própria página sintetiza efeitos e música e devolve um WAV
const tmp = mkdtempSync(join(tmpdir(), "video-"));
let wav = join(tmp, "trilha.wav");
const { base64, pico } = await page.evaluate(() => window.gerarAudioWav());
writeFileSync(wav, Buffer.from(base64, "base64"));
console.log(`Som pronto (${TOTAL} s, pico antes de normalizar: ${pico.toFixed(2)})`);

// 1b. Narração: cada fala entra no seu tempo e a trilha abaixa enquanto ela fala
if (COM_VOZ) {
  const falas = await page.evaluate(() => window.linhaDaVoz());
  const entradas = falas.flatMap((f) => ["-i", join(AQUI, "voz", f.arquivo)]);
  const atrasos = falas.map((f, i) => {
    const ms = Math.round(f.inicio * 1000);
    return `[${i + 1}:a]aresample=48000,aformat=channel_layouts=stereo,adelay=${ms}|${ms}[f${i}]`;
  });
  const filtro = [
    "[0:a]volume=0.5[trilha]",
    ...atrasos,
    `${falas.map((_, i) => `[f${i}]`).join("")}amix=inputs=${falas.length}:normalize=0,apad,asplit=2[voz1][voz2]`,
    "[trilha][voz1]sidechaincompress=threshold=0.02:ratio=6:attack=10:release=400[abaixada]",
    "[abaixada][voz2]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[final]",
  ].join(";");
  const mix = join(tmp, "trilha-com-voz.wav");
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", wav, ...entradas,
    "-filter_complex", filtro, "-map", "[final]", "-c:a", "pcm_s16le", mix]);
  wav = mix;
  console.log(`Narração misturada (${falas.length} falas)`);
}

// 2. Imagem: um print por quadro, direto para o ffmpeg
mkdirSync(dirname(SAIDA), { recursive: true });
const ff = spawn("ffmpeg", [
  "-y", "-loglevel", "error",
  "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "png", "-i", "-",
  "-i", wav, "-map", "0:v", "-map", "1:a",
  "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p",
  "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", SAIDA,
], { stdio: ["pipe", "inherit", "inherit"] });

const quadros = Math.round(TOTAL * FPS);
for (let i = 0; i < quadros; i++) {
  await page.evaluate((t) => window.seek(t), i / FPS);
  const png = await page.screenshot({ type: "png" });
  if (!ff.stdin.write(png)) await once(ff.stdin, "drain");
  if (i % FPS === 0) process.stdout.write(`\rQuadro ${i}/${quadros}`);
}
ff.stdin.end();
const [codigo] = await once(ff, "close");
await browser.close();
rmSync(tmp, { recursive: true, force: true });
if (codigo !== 0) throw new Error("ffmpeg falhou (código " + codigo + ")");
console.log("\nVídeo:", SAIDA);
