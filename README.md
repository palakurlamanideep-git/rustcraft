# ⛏ RUSTCRAFT

A **Minecraft-themed, Exercism-style learning platform for Rust** — plain HTML/CSS/JS, zero
dependencies, zero build step. Everything runs locally and your progress is saved in your
own browser via `localStorage`.

## Quick start

Option A — just open it:

    open index.html          # or double-click it

Option B — serve it (recommended, so localStorage behaves nicely):

    cd rustcraft
    python3 -m http.server 8080
    # then visit http://localhost:8080

## What's inside

| Area | Page | Contents |
|------|------|----------|
| Core curriculum | `learn.html` | 8 "worlds", 43 lessons: basics → ownership → structs/enums → collections → errors → traits/generics → concurrency/async/unsafe/macros → testing/WASM/perf/idioms. Each lesson has code, notes and a quiz (25 XP). |
| The Workshop | `practice.html` | 24 logic problems in 6 tiers (Wood → Netherite), each with a story, spec, example I/O, starter code, candle-by-candle hints and a **verified-compiling reference solution**. One-click "run in the official Rust Playground". |
| Special tracks | `tracks.html` | UI (egui/iced/Tauri/Slint), Database (rusqlite/sqlx/diesel + design patterns), Cyber Security (memory safety, secure coding, crypto, network tools, forensics, fuzzing + in-browser base64/Caesar/hex/XOR-cracker tools and a 3-lock easter-egg vault). |
| Playground | `playground.html` | A draft editor (auto-saves locally) that launches code at play.rust-lang.org, with a snippet library. |
| Player card | ⛏ button (top bar, every page) | XP bar, level titles (Grass Block → Rust Wizard), lesson/problem counts, advancements, recommended route, reset save — all in one popup panel so the home page can stay short. |

## Day & night

- Sun/moon button in the top bar switches between the two hand-made themes:
  **night in the mines** (default) and **golden sunrise over the flower field** (light).
- New visitors follow their system preference automatically; a manual pick is saved
  and beats the system setting from then on. A tiny no-flash script applies the
  theme before first paint on every page.
- All "shader" effects (sun rays, drifting blocky clouds, twinkling stars, XP fills)
  are original CSS — no external/copyrighted assets.

## How progress works

- XP: **+25** per lesson, **+15/25/35/50/70/100** per problem tier, **+15** per unlocked vault lock.
- Every completed lesson fires a Minecraft-style banner: **"Lesson Complete!"** for a
  lesson, **"World Clear! Goal Reached!"** when you finish a whole world/track, and the
  classic **"Advancement Made!"** for the 13 achievements.
- Theme choice, sound toggle, XP and progress all live under the
  localStorage key `rustcraft_save_v1`.
- No accounts, no servers, no tracking.

## Structure

    rustcraft/
    ├── index.html             # short hero + world/track grids; details live in the player card
    ├── learn.html
    ├── practice.html
    ├── tracks.html
    ├── playground.html
    ├── css/style.css          # the whole Minecraft theme (day + night palettes, hotbar, XP bars)
    └── js/
        ├── data.js            # 8 worlds, 43 core lessons
        ├── tracks-data.js     # UI / Database / Cyber Security tracks
        ├── problems.js        # 24 practice problems + solutions
        ├── main.js            # progress, XP, pop-ups, day/night theme, player card, sfx, renderer
        ├── learn.js / practice.js / tracks.js / playground.js / index.js   # page logic

## Quality notes

- All 24 reference solutions compile standalone (`rustc --edition 2021`) and were executed
  to confirm expected outputs.
- Every std-only lesson code sample compiles; framework samples (sqlx, tokio, egui, Tauri…)
  are clearly labeled sketches and need their crate dependencies.

## Extending it

- Add a lesson: append to a world's `lessons` array in `js/data.js` (or a track in
  `js/tracks-data.js`) — the sidebar, prev/next, XP and achievements pick it up automatically.
- Add a problem: append to `js/problems.js` with `id/title/tier/hearts/tags/story/spec/io/starter/hints/solution`.
- Achievement: add to `RC.ACHIEVEMENTS` in `js/main.js` with an `check(save)` predicate.

*Fan-made learning project. Not affiliated with Mojang/Microsoft or the Rust Foundation.*
