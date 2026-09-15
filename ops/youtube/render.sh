#!/usr/bin/env bash
# LaneCash board-tutor style video (v2 poses via PNG sequence if present)
# Usage: ./ops/youtube/render.sh title.txt script.txt out.mp4
set -euo pipefail
TITLE_FILE="${1:?title file}"
SCRIPT_FILE="${2:?script file}"
OUT="${3:-out.mp4}"
VOICE="${EDGE_TTS_VOICE:-en-US-GuyNeural}"
ASSETS="ops/youtube/assets"
WORKDIR="$(mktemp -d)"
trap 'rm -rf "$WORKDIR"' EXIT

TITLE="$(head -n1 "$TITLE_FILE" | tr -d '\r')"
# edge-tts
pip install -q edge-tts 2>/dev/null || true
edge-tts --voice "$VOICE" --file "$SCRIPT_FILE" --write-media "$WORKDIR/voice.mp3"

DUR="$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$WORKDIR/voice.mp3" | cut -d. -f1)"
DUR="${DUR:-30}"
if [ "$DUR" -lt 15 ]; then DUR=20; fi

# Background + optional tutor overlay (present.png = main pose)
BG="$ASSETS/bg.png"
TUTOR="$ASSETS/tutor_present.png"
if [ ! -f "$BG" ]; then
  ffmpeg -y -f lavfi -i "color=c=0x0a0a0f:s=1080x1920:d=${DUR}" "$WORKDIR/bg.mp4"
else
  ffmpeg -y -loop 1 -i "$BG" -t "$DUR" -vf "scale=1080:1920" "$WORKDIR/bg.mp4"
fi

# Text title (escape basic chars)
SAFE_TITLE="$(echo "$TITLE" | sed 's/:/ /g' | sed "s/'/'\\''/g" | cut -c1-60)"

if [ -f "$TUTOR" ]; then
  ffmpeg -y -i "$WORKDIR/bg.mp4" -i "$TUTOR" -i "$WORKDIR/voice.mp3" \
    -filter_complex "[1:v]scale=420:-1[t];[0:v][t]overlay=40:H-h-120[v];[v]drawtext=text='${SAFE_TITLE}':fontcolor=white:fontsize=42:x=(w-text_w)/2:y=180:box=1:boxcolor=black@0.45:boxborderw=16" \
    -map 2:a -c:v libx264 -c:a aac -shortest -pix_fmt yuv420p "$OUT"
else
  ffmpeg -y -i "$WORKDIR/bg.mp4" -i "$WORKDIR/voice.mp3" \
    -vf "drawtext=text='${SAFE_TITLE}':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=200:box=1:boxcolor=black@0.5:boxborderw=20" \
    -c:v libx264 -c:a aac -shortest -pix_fmt yuv420p "$OUT"
fi

echo "Wrote $OUT"
