// Gera imagem-1.png, imagem-2.png... a partir de anuncios.html (um PNG por .slide, 1080x1350).
// Uso: node render.mjs   (dentro desta pasta)
import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { homedir } from "node:os";

const AQUI = dirname(fileURLToPath(import.meta.url));
const HTML = join(AQUI, "anuncios.html");
// Mesmo Chromium que o montar-pdf.mjs do ebook usa
const CHROME = join(homedir(), "AppData/Local/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-win64/chrome-headless-shell.exe");
if (!existsSync(CHROME)) throw new Error("Chromium do Playwright não encontrado em " + CHROME);

const total = (readFileSync(HTML, "utf8").match(/class="slide"/g) || []).length;
for (let n = 1; n <= total; n++) {
  const png = join(AQUI, `imagem-${n}.png`);
  execFileSync(CHROME, [
    "--headless", "--disable-gpu", "--hide-scrollbars", "--window-size=1080,1350",
    "--virtual-time-budget=8000", `--screenshot=${png}`, `${pathToFileURL(HTML).href}#s${n}`,
  ], { stdio: "ignore" });
  console.log("PNG:", png);
}
