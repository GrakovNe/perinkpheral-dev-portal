#!/bin/sh
# SPDX-License-Identifier: MIT
#
# The renders of the case, made fit for the web: WebP at two widths, with a
# screen of an app on the panel where the panel is in sight. The originals
# are 6000 x 4000 PNGs of about 120 MB each and are only read.
#
#     scripts/images.sh <folder of renders>
#
# Needs ffmpeg and cwebp. Writes into public/renders.

set -eu

SOURCE=${1:?usage: scripts/images.sh <folder of renders>}
HERE=$(cd "$(dirname "$0")/.." && pwd)
OUT="$HERE/public/renders"
SCREENS="$HERE/public/screens"
WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT
mkdir -p "$OUT"

# One picture at the widths the pages ask for.
webp() {
    name=$1
    input=$2
    for width in 800 1600; do
        cwebp -quiet -q 80 -resize "$width" 0 "$input" -o "$OUT/$name-$width.webp"
    done
}

# The window of the panel in each render that shows it, as its corners in
# pixels: top left, top right, bottom left, bottom right.
FRONT="1587:915:4430:915:1587:3030:4430:3030"
FRONT_LEFT="2454:1322:4532:945:2754:3274:4763:2745"
FRONT_RIGHT="1490:946:3538:1292:1243:2742:3266:3266"

# A frame of the panel put into the window of a render: stretched to the
# window's corners, multiplied into the render so that its light and shade
# stay, and kept inside the window by a mask warped the same way.
screen_on() {
    render=$1
    screen=$2
    corners=$3
    out=$4
    set -- $(echo "$corners" | tr ':' ' ')
    warp="perspective=x0=$1:y0=$2:x1=$3:y1=$4:x2=$5:y2=$6:x3=$7:y3=$8:sense=destination"
    ffmpeg -loglevel error -y \
        -i "$SOURCE/perinkpheral_$render.png" -i "$SCREENS/$screen.png" \
        -filter_complex "
            [1:v]scale=6000:4000:flags=neighbor,format=gbrp,$warp[screen];
            color=white:s=5992x3992,pad=6000:4000:4:4:black,format=gbrp,$warp[mask];
            [0:v]format=gbrp,split[render][base];
            [render][screen]blend=all_mode=multiply[lit];
            [base][lit][mask]maskedmerge,format=rgb24" -frames:v 1 -update 1 \
        "$WORK/$out.png"
    webp "$out" "$WORK/$out.png"
}

# The views with no panel in sight, as they are.
for name in back back34r buttons left right top; do
    webp "$name" "$SOURCE/perinkpheral_$name.png"
done

# The views of the gallery, an app each.
screen_on front clock "$FRONT" front
screen_on front34l weather "$FRONT_LEFT" front34l
screen_on front34r stocks "$FRONT_RIGHT" front34r

# The landing page turns through these.
screen_on front sun "$FRONT" hero-sun
screen_on front weather "$FRONT" hero-weather
screen_on front stocks "$FRONT" hero-stocks
screen_on front timer "$FRONT" hero-timer

ls -la "$OUT"
