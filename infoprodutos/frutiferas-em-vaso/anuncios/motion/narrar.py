# Gera a narração de um vídeo (voz feminina, pt-BR) a partir do falas.json da pasta dele:
# <pasta>/voz/<cena>.wav e <pasta>/voz/voz.js, com a duração de cada fala e o volume quadro a quadro
# (que mexe a boca de personagem). O video.html lê o voz.js e estica cada cena até a fala caber.
#
# Voz: Kokoro (modelo aberto, licença Apache 2.0, pode usar em anúncio), voz "pf_dora".
# Instalar uma vez:  pip install kokoro-onnx soundfile
# Baixar os 2 arquivos do modelo para a pasta modelos/ (fica fora do git, ~350 MB):
#   https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
#   https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
# Uso: python narrar.py video-4-jeito-facil   (dentro desta pasta). Depois rode node render.mjs <pasta>.
#
# No falas.json, números por extenso, para a voz ler certo. Os dados vêm do ebook, com fonte.
import json
import sys
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

VOZ = "pf_dora"
VELOCIDADE = 1.15
QUADROS_POR_SEGUNDO = 30

AQUI = Path(__file__).resolve().parent
MODELOS = AQUI / "modelos"


def aparar(audio, sr, limite=0.003, margem=0.08):
    """Corta o silêncio do começo e do fim, deixando uma margem curta."""
    som = np.flatnonzero(np.abs(audio) > limite)
    if not len(som):
        return audio
    m = int(margem * sr)
    return audio[max(0, som[0] - m): som[-1] + m]


def volume_por_quadro(audio, sr):
    """Volume da fala em cada quadro do vídeo, de 0 a 1."""
    passo = sr // QUADROS_POR_SEGUNDO
    rms = [float(np.sqrt(np.mean(audio[i:i + passo] ** 2))) for i in range(0, len(audio), passo)]
    topo = max(rms) or 1
    return [round(min(1, v / topo), 2) for v in rms]


def main():
    if len(sys.argv) < 2 or not (AQUI / sys.argv[1] / "falas.json").exists():
        sys.exit("Uso: python narrar.py <pasta-do-video>  (a pasta precisa ter um falas.json)")
    if not (MODELOS / "kokoro-v1.0.onnx").exists():
        sys.exit("Falta o modelo em modelos/ (veja os links no começo deste arquivo).")
    pasta = AQUI / sys.argv[1]
    falas = json.loads((pasta / "falas.json").read_text(encoding="utf-8"))
    kokoro = Kokoro(str(MODELOS / "kokoro-v1.0.onnx"), str(MODELOS / "voices-v1.0.bin"))
    saida = pasta / "voz"
    saida.mkdir(exist_ok=True)
    tempos = {}
    for cena, texto in falas.items():
        # trim=False: o corte automático do Kokoro come a primeira consoante; o aparar() faz isso melhor
        audio, sr = kokoro.create(texto, voice=VOZ, speed=VELOCIDADE, lang="pt-br", trim=False)
        audio = aparar(audio, sr)
        audio = audio * (0.7 / max(1e-6, np.abs(audio).max()))  # pico em -3 dB
        arquivo = f"{cena}.wav"
        sf.write(saida / arquivo, audio, sr, subtype="PCM_16")
        tempos[cena] = {"arquivo": arquivo, "dur": round(len(audio) / sr, 3), "texto": texto,
                        "env": volume_por_quadro(audio, sr)}
        print(f"{cena}: {tempos[cena]['dur']:.2f} s  {texto}")
    (saida / "voz.js").write_text(
        "// Gerado pelo narrar.py. Não edite à mão.\nwindow.VOZ = "
        + json.dumps(tempos, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
    print("Total de fala:", round(sum(t["dur"] for t in tempos.values()), 1), "s")


if __name__ == "__main__":
    main()
