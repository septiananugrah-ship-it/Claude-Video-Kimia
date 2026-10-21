# Sidik Jari Molekul — versi Claude

Film edukasi **kimia kuantum** tentang getaran molekul dan spektroskopi FTIR, dibuat ulang dari nol dengan [Remotion](https://remotion.dev).
1920 × 1080 · 30 FPS · **±13 menit** · 14 bab + pembuka, judul, dan penutup.

> Gaya visual terinspirasi video referensi "sarang lebah": panggung gelap, objek yang bertransformasi dengan mulus, kisi heksagonal halus, dan subtitle kata-per-kata dengan kata kunci yang disorot emas.

## Alur cerita

| Waktu | Bab | Isi |
|---|---|---|
| 00:00 | Pembuka | Dua lembar plastik kembar (PE dan PET): bagaimana membedakannya? |
| 00:36 | Judul | *Sidik Jari Molekul* |
| 00:43 | 01 · Tidak ada yang benar-benar diam | Perbesaran plastik → rantai polimer → atom yang bergetar |
| 01:18 | 02 · Ikatan kimia sebagai pegas | Panjang ikatan setimbang, gaya pemulih, hukum Hooke, awan elektron |
| 02:10 | 03 · Kekakuan dan massa | C–C / C=C / C≡C, massa tereduksi, ν = (1/2π)√(k/μ), H–Cl vs D–Cl |
| 03:18 | 04 · Lanskap energi | Parabola harmonik → potensial Morse, disosiasi |
| 04:07 | 05 · Lompatan kuantum | Klasik vs kuantum, persamaan Schrödinger, Eᵥ = (v + ½)hν |
| 04:59 | 06 · Awan kemungkinan | Fungsi gelombang ψ, \|ψ\|², simpul, awan probabilitas |
| 05:40 | 07 · Energi titik nol | E₀ = ½hν, 0 K, prinsip ketidakpastian Heisenberg |
| 06:20 | 08 · Bertemu cahaya inframerah | Spektrum EM, foton cocok vs tidak cocok, Δv = ±1, syarat dipol (HCl vs N₂/O₂) |
| 07:23 | 09 · Banyak atom, banyak irama | Mode normal 3N−5/3N−6, empat mode CO₂, efek rumah kaca |
| 08:34 | 10 · Di dalam alat FTIR | Interferometer Michelson, interferogram, transformasi Fourier |
| 09:30 | 11 · Membaca spektrum | Bilangan gelombang, wilayah X–H, karbonil, wilayah sidik jari |
| 10:13 | 12 · PE lawan PET | Struktur dan spektrum: pita C=O 1715 cm⁻¹ hanya pada PET |
| 11:11 | 13 · FTIR di laboratorium mutu | Identitas bahan baku, kontaminan, oksidasi, ATR, kehati-hatian, pustaka rujukan |
| 11:58 | 14 · Merangkai semuanya | Rangkuman lima langkah, botol plastik yang "bernyanyi" |
| 12:51 | Penutup | Rujukan |

## Naskah & voice-over

- **`naskah/NASKAH_VOICEOVER.md`** — naskah teleprompter: timecode tiap baris, perkiraan durasi baca, jeda setelah baris, dan kata kunci (tebal) yang perlu ditekankan. Ikuti ini saat merekam suara.
- `naskah/naskah-polos.txt` — teks narasi polos per bab.
- `naskah/narasi.srt` — subtitle (bisa diunggah ke YouTube).

Timing dihitung otomatis dari jumlah suku kata (±5,3 suku kata/detik ≈ 120–125 kata/menit — tempo narator edukasi yang tenang) ditambah jeda tanda baca dan jeda antar-baris yang diatur di naskah. **Seluruh animasi menempel pada penanda baris dan kata**, jadi jika naskah diubah, visual, subtitle, dan musik ikut bergeser.

### Mengubah naskah

Edit `src/script.ts` (teks, kata yang disorot `hl`, dan `pause` sesudah baris), lalu:

```bash
npm run timeline   # perbarui naskah VO, SRT, dan peta musik
npm run music      # sintesis ulang backsound agar pas dengan durasi baru
```

### Voice-over

**Rekam sendiri (disarankan):** baca `naskah/NASKAH_VOICEOVER.md` sambil memutar video (subtitle berfungsi sebagai teleprompter), lalu tumpuk rekaman di editor video. Atau rekam per baris dengan nama `public/voiceover/<kode-baris>.mp3` (mis. `hook-00.mp3`), kemudian:

```bash
npm run voiceover -- --measure   # ukur rekaman → src/voiceover.ts; timeline menyesuaikan durasi asli
npm run timeline && npm run music
npx remotion render src/index.ts SidikJariMolekul out/final.mp4 --props='{"voiceover":true,"musicVolume":0.35}'
```

**ElevenLabs (opsional):** isi kunci API, maka setiap baris dibuat otomatis (model `eleven_multilingual_v2`, bahasa Indonesia):

```bash
ELEVENLABS_API_KEY=xxxx ELEVENLABS_VOICE_ID=<voice-id> npm run voiceover
npm run timeline && npm run music
```

## Musik

`public/music.mp3` adalah backsound **orisinal** yang disintesis oleh `scripts/make-music.py` (numpy + ffmpeg, tanpa sampel berlisensi). Setiap bab punya suasana sendiri — misterius, megah, penuh rasa ingin tahu, "kuantum" yang berkilau, tegang, cerah, dan resolusi — dengan *whoosh* lembut di setiap pergantian bab dan dentuman pada judul. Kenyaringan ±−21 LUFS agar aman ditimpa narasi.

## Menjalankan

```bash
npm ci
npm run dev          # Remotion Studio: pilih "SidikJariMolekul", atau folder "Adegan" untuk tiap bab
npm run render       # ekspor MP4 1080p ke out/
npm run render:preview   # pratinjau cepat 960×540
```

Props komposisi: `showCaptions` (subtitle on/off), `musicVolume` (0–1), `voiceover` (putar file di `public/voiceover/`).
Render juga bisa dijalankan di GitHub Actions: tab **Actions → Render video → Run workflow**, lalu unduh artefaknya.

Di lingkungan Linux tanpa Chrome lengkap, arahkan Remotion ke *headless shell*: `CHROME_PATH=/path/ke/headless_shell npm run render`.

## Struktur kode

```
src/script.ts            naskah: scene, baris, kata kunci, jeda
src/timeline.ts          naskah → waktu scene/baris/kata (tanpa dependensi Remotion)
src/SceneContext.tsx     useScene(): waktu lokal + cue(i), wordOf(i, "kata") untuk sinkronisasi
src/Composition.tsx      susunan film: latar, scene + transisi kamera, heading bab, subtitle, audio
src/components/          latar & grain, subtitle kata-per-kata, heading bab, primitif (atom, pegas, ikatan, panah, kartu), visual sains (spektrum, foton, fungsi gelombang, sidik jari)
src/scenes/              satu file per bab
scripts/                 export-timeline, make-music.py, generate-voiceover, qa-stills
```

Semua gerak digerakkan oleh frame (`useCurrentFrame` → detik → `interpolate`/easing), tanpa animasi CSS, sehingga render deterministik.

## Catatan ilmiah

Model bola-pegas dan parabola adalah pendekatan; kurva fungsi gelombang memakai fungsi Hermite osilator harmonik sebenarnya. Angka acuan: H³⁵Cl ≈ 2886 cm⁻¹, D³⁵Cl ≈ 2091 cm⁻¹; CO₂ ν₃ ≈ 2349 cm⁻¹, ν₂ ≈ 667 cm⁻¹, ν₁ ≈ 1388 cm⁻¹ (aktif Raman); PET C=O ≈ 1715 cm⁻¹, C–O ≈ 1240/1095 cm⁻¹; PE C–H ≈ 2915/2848, 1470, 720 cm⁻¹. Spektrum di layar bersifat skematis untuk tujuan edukasi.
