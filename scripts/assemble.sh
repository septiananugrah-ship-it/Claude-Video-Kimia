#!/usr/bin/env bash
# Gabungkan semua chunk video + render audio penuh → out/sidik-jari-molekul-2k.mp4
set -euo pipefail
cd "$(dirname "$0")/.."
PROPS="${PROPS:-{\}}"
OUT="${OUT:-out/sidik-jari-molekul-2k.mp4}"

ls out/chunks/chunk-*.mp4 | sort > /tmp/chunks.txt
sed "s|^|file '$PWD/|; s|$|'|" /tmp/chunks.txt > out/chunks/list.txt
cat out/chunks/list.txt
ffmpeg -v error -y -f concat -safe 0 -i out/chunks/list.txt -c copy out/video-only.mp4

# Audio: musik (+ voice-over bila voiceover:true) dirakit langsung dengan ffmpeg.
PROPS="$PROPS" node --experimental-strip-types scripts/build-audio.ts out/audio.m4a

ffmpeg -v error -y -i out/video-only.mp4 -i out/audio.m4a -map 0:v:0 -map 1:a:0 -c:v copy -c:a copy -movflags +faststart -shortest "$OUT"
ffprobe -v error -show_entries stream=codec_type,width,height,r_frame_rate:format=duration,size -of compact "$OUT"

# Verifikasi jumlah frame terhadap timeline
EXPECTED=$(node --experimental-strip-types -e "import('./src/timeline.ts').then(m=>console.log(m.TOTAL_FRAMES))" 2>/dev/null)
ACTUAL=$(ffprobe -v error -count_packets -select_streams v:0 -show_entries stream=nb_read_packets -of csv=p=0 "$OUT")
echo "Frame: $ACTUAL / $EXPECTED"
if [ "$ACTUAL" != "$EXPECTED" ]; then echo "Jumlah frame tidak lengkap!"; exit 1; fi
