# Gera a narração do vídeo (voz feminina, pt-BR) em voz/<cena>.wav e o voz/voz.js com a duração de cada fala.
# O vídeo (video-jeito-facil.html) lê o voz.js e estica cada cena até a fala dela caber.
#
# Voz: Kokoro (modelo aberto, licença Apache 2.0, pode usar em anúncio), voz "pf_dora".
# Instalar uma vez:  pip install kokoro-onnx soundfile
# Baixar os 2 arquivos do modelo para a pasta modelos/ (fica fora do git, ~350 MB):
#   https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
#   https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
# Uso: python narrar.py   (dentro desta pasta). Depois rode node render.mjs.
#
# Números por extenso, para a voz ler certo. Os dados vêm do ebook (caps. 1, 3, 5 e 6).
import json
import sys
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

FALAS = {
    "gancho": "Quer um pé de fruta no vaso? Olha o jeito fácil, em cinco passos.",
    "p1": "Compre muda enxertada. A jabuticabeira de semente leva de oito a quinze anos pra dar fruto.",
    "p2": "Tela no furo, e nada de pedra no fundo: ela atrapalha a drenagem e encharca a raiz.",
    "p3": "Deixe o colo no nível da terra, com o enxerto sempre de fora.",
    "p4": "Então, regue até a água sair pelo furo. Depois, use o teste do dedo.",
    "p5": "E no mínimo seis horas de sol direto por dia.",
    "fim": "Começou certo? Agora é só cuidar.",
    "cta": "O passo a passo completo está no guia Sua Frutífera Vai Dar Fruto. Só vinte reais. Toque em saiba mais.",
}
VOZ = "pf_dora"
VELOCIDADE = 1.15

AQUI = Path(__file__).resolve().parent
MODELOS = AQUI / "modelos"
SAIDA = AQUI / "voz"


def aparar(audio, sr, limite=0.003, margem=0.08):
    """Corta o silêncio do começo e do fim, deixando uma margem curta."""
    som = np.flatnonzero(np.abs(audio) > limite)
    if not len(som):
        return audio
    m = int(margem * sr)
    return audio[max(0, som[0] - m): som[-1] + m]


def main():
    if not (MODELOS / "kokoro-v1.0.onnx").exists():
        sys.exit("Falta o modelo em modelos/ (veja os links no começo deste arquivo).")
    kokoro = Kokoro(str(MODELOS / "kokoro-v1.0.onnx"), str(MODELOS / "voices-v1.0.bin"))
    SAIDA.mkdir(exist_ok=True)
    tempos = {}
    for cena, texto in FALAS.items():
        audio, sr = kokoro.create(texto, voice=VOZ, speed=VELOCIDADE, lang="pt-br")
        audio = aparar(audio, sr)
        audio = audio * (0.7 / max(1e-6, np.abs(audio).max()))  # pico em -3 dB
        arquivo = f"{cena}.wav"
        sf.write(SAIDA / arquivo, audio, sr, subtype="PCM_16")
        tempos[cena] = {"arquivo": arquivo, "dur": round(len(audio) / sr, 3), "texto": texto}
        print(f"{cena}: {tempos[cena]['dur']:.2f} s  {texto}")
    (SAIDA / "voz.js").write_text(
        "// Gerado pelo narrar.py. Não edite à mão.\nwindow.VOZ = "
        + json.dumps(tempos, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
    print("Total de fala:", round(sum(t["dur"] for t in tempos.values()), 1), "s")


if __name__ == "__main__":
    main()
