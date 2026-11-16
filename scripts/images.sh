#!/bin/sh
# SPDX-License-Identifier: MIT
#
# The renders of the case, made fit for the web: WebP at two widths, and the
# front view with a screen of the device on its panel. The originals are
# 6000 x 4000 PNGs of about 120 MB each and are only read.
#
#     scripts/images.sh <folder of renders>
#
# Needs ffmpeg and cwebp. Writes into public/renders.

set -eu

SOURCE=${1:?usage: scripts/images.sh <folder of renders>}
HERE=$(cd "$(dirname "$0")/.." && pwd)
OUT="$HERE/public/renders"
WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT
mkdir -p "$OUT"

# One render at the widths the pages ask for.
webp() {
    name=$1
    input=$2
    for width in 800 1600; do
        cwebp -quiet -q 80 -resize "$width" 0 "$input" -o "$OUT/$name-$width.webp"
    done
}

for render in "$SOURCE"/perinkpheral_*.png; do
    name=$(basename "$render" .png | sed 's/^perinkpheral_//')
    webp "$name" "$render"
done

# The front view with a screen on the panel. The visible window of the
# render is 1587..4430 x 915..3030 px; the panel's active area is 0.5 mm
# larger on every side, so the picture is scaled past the window and cut to
# it. Multiplied into the render, so that its light and shade stay.
SCREEN="$HERE/public/screens/sun.png"
ffmpeg -loglevel error -y \
    -i "$SOURCE/perinkpheral_front.png" -i "$SCREEN" \
    -filter_complex "
        color=white:s=6000x4000,format=gbrp[paper];
        [1:v]scale=2877:2149:flags=neighbor,crop=2843:2115:17:17,format=gbrp[screen];
        [paper][screen]overlay=1587:915,format=gbrp[mask];
        [0:v]format=gbrp[render];
        [render][mask]blend=all_mode=multiply,format=rgb24" -frames:v 1 -update 1 \
    "$WORK/hero.png"
webp hero "$WORK/hero.png"

ls -la "$OUT"
