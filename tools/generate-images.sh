#!/usr/bin/env bash
# tools/generate-images.sh
# Gera versões WebP e AVIF otimizadas a partir do logo.png e hero.png (ou outro arquivo fonte).
# Requer: cwebp (libwebp), avifenc (libavif / libaom), and imagemagick (optional)
# Uso: ./tools/generate-images.sh [source-logo.png] [source-hero.png]

set -euo pipefail

SRC_LOGO=${1:-logo.png}
SRC_HERO=${2:-hero.png}

# Output filenames
LOGO_WEBP=logo.webp
LOGO_AVIF=logo.avif
HERO_WEBP=hero.webp
HERO_AVIF=hero.avif

# Quality settings (ajuste conforme necessário)
WEBP_QUALITY=80
AVIF_QUALITY=45

echo "Gerando $LOGO_WEBP a partir de $SRC_LOGO (quality=$WEBP_QUALITY)"
if command -v cwebp >/dev/null 2>&1; then
  cwebp -q $WEBP_QUALITY "$SRC_LOGO" -o "$LOGO_WEBP" || echo "cwebp falhou para $SRC_LOGO"
else
  echo "Aviso: cwebp não encontrado. Instale libwebp-tools para gerar WebP." >&2
fi

echo "Gerando $LOGO_AVIF a partir de $SRC_LOGO (quality=$AVIF_QUALITY)"
if command -v avifenc >/dev/null 2>&1; then
  avifenc -q $AVIF_QUALITY "$SRC_LOGO" "$LOGO_AVIF" || echo "avifenc falhou para $SRC_LOGO"
else
  echo "Aviso: avifenc não encontrado. Instale libavif ou libaom para gerar AVIF." >&2
fi

if [ -f "$SRC_HERO" ]; then
  echo "Gerando $HERO_WEBP a partir de $SRC_HERO (quality=$WEBP_QUALITY)"
  if command -v cwebp >/dev/null 2>&1; then
    cwebp -q $WEBP_QUALITY "$SRC_HERO" -o "$HERO_WEBP" || echo "cwebp falhou para $SRC_HERO"
  fi

  echo "Gerando $HERO_AVIF a partir de $SRC_HERO (quality=$AVIF_QUALITY)"
  if command -v avifenc >/dev/null 2>&1; then
    avifenc -q $AVIF_QUALITY "$SRC_HERO" "$HERO_AVIF" || echo "avifenc falhou para $SRC_HERO"
  fi
else
  echo "Arquivo de hero ($SRC_HERO) não encontrado; pulando geração de hero images."
fi

echo "Pronto. Compare tamanhos e verifique qualidade antes de commitar."