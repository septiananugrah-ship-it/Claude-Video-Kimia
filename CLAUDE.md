# Konteks repo (untuk asisten AI)

- Video "Sidik Jari Molekul" (Kimia Kuantum Gerak Vibrasi) milik **Yayan** (Septian Anugrah) — video Claude yang pertama. Aturan umum & pelajaran teknis: repo `septiananugrah-ship-it/science-intro` → `CLAUDE.md`.
- Gaya: panggung gelap, aksen **emas–sian**, font Outfit + Source Serif 4 + JetBrains Mono, kisi heksagonal halus, subtitle kata-per-kata dengan kata kunci emas. Video teman harus tampil beda dari gaya ini.
- **Claude tidak menjalankan workflow GitHub Actions.** Setelah perubahan masuk ke `main`, berhenti dan minta Yayan menekan *Run workflow* sendiri.
- Voice-over yang ada di `public/voiceover/` direkam dengan suara Bagas. Mengubah teks naskah (`src/script.ts`) berarti baris itu harus dibuat ulang (untuk video baru: suara klon Yayan). Poles visual tidak menyentuh naskah, jadi voice-over tetap sinkron.

## Primitif efek (`src/components/primitives.tsx`)

- `Spark` — partikel bercahaya (inti putih + halo + jejak opsional) untuk bola/atom/titik yang bergerak.
- `Ripple` — riak cincin yang mengembang (foton diserap, simpul menyala).
- `Motes` — debu cahaya berkelip di sekitar objek fokus.
- `Atom` punya cahaya tepi; `Card` punya garis aksen atas + kilau sapuan saat muncul.

## QA

- `CHROME_PATH=<headless-shell> node scripts/qa-lines.mjs <dir> [sceneId ...]` — still di akhir setiap baris narasi (±220 still). Lebih andal daripada 2–3 still per adegan untuk menemukan label yang bertabrakan.
- Dua proses paralel boleh, tapi jangan mengedit berkas saat proses bundling berjalan.
