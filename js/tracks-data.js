/* ============================================================
   RUSTCRAFT — Specialized tracks: UI, Database, Cyber Security
   Same lesson schema as WORLDS so the shared renderer works.
   ============================================================ */
"use strict";

const TRACKS = [
  /* ==================== UI TRACK ==================== */
  {
    id:"ui", name:"The Crafting Table — UI in Rust", icon:"🖥️", accent:"#4f9cf9",
    tagline:"Ship desktop apps, WASM frontends and native widgets — all without Electron's 400MB of RAM.",
    desc:"Four families of UI tools in Rust: egui (immediate mode), iced (Elm-style), Tauri (web frontend + Rust core) and Slint (declarative DSL).",
    lessons:[
      {
        id:"ui-1", title:"Render Loop Economics",
        blocks:[
          {t:"text", c:"Two big app architectures: **retained mode** (iced, Slint, Qt-style: you build a widget tree, the framework keeps it) and **immediate mode** (egui/Dear-ImGui-style: every frame you re- describe the entire UI in one function)."},
          {t:"text", c:"Immediate mode is perfect for tools and game editors — no state sync bugs, UI IS the state. Retained/Elm is better for complex apps: fewer redraws, cleaner separation."},
          {t:"list", items:[
            "**egui** — immediate mode; easiest mental model; web + desktop (eframe).",
            "**iced** — Elm architecture (update/msg/view); production-friendly.",
            "**Slint** — declarative .slint markup; strong embedded story.",
            "**Tauri** — REAL web frontend (your HTML/CSS/JS skills) + Rust backend commands; small binaries vs Electron.",
            "**Yew / Leptos** — full WASM web frameworks (React-like component model).",
          ]},
          {t:"note", icon:"💡", c:"Choosing: interactive tool → egui. Long-lived product UI → iced or Slint. Existing web team → Tauri or WASM frameworks."},
        ],
        quiz:[
          {q:"Which library re-renders the whole UI every frame from a single function?",
           opts:["iced","egui (immediate mode)","Tauri","Slint"], a:1,
           e:"Immediate mode redraws each frame; state lives in your struct, not in widget trees."},
          {q:"Which option targets shipping a web-tech frontend with a small native binary?",
           opts:["Tauri","egui","clap","diesel"], a:0,
           e:"Tauri uses the OS webview; only your Rust core is compiled — binaries stay tiny."},
        ]
      },
      {
        id:"ui-2", title:"egui — Immediate Mode Counter",
        blocks:[
          {t:"text", c:"egui apps are ONE function called every frame. State just lives in your struct — no listeners, no diffing."},
          {t:"code", label:"src/main.rs (eframe + egui)", c:`use eframe::egui;

struct App {
    count: i32,
}

impl eframe::App for App {
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        egui::CentralPanel::default().show(ctx, |ui| {
            ui.heading("Crafter Counter");
            ui.horizontal(|ui| {
                if ui.button("-").clicked() { self.count -= 1; }
                ui.label(format!("{}", self.count));
                if ui.button("+").clicked() { self.count += 1; }
            });
            if self.count < 0 {
                ui.colored_label(egui::Color32::RED, "Over-extracted!");
            }
        });
    }
}

fn main() -> eframe::Result {
    let app = App { count: 0 };
    eframe::run_native(
        "counter",
        eframe::NativeOptions::default(),
        Box::new(move |_cc| Ok(Box::new(app))),
    )
}`},
          {t:"text", c:"Deployment: `cargo run` gives a native window; `trunk serve` (or eframe's web target) hosts the same app as WASM in a browser."},
          {t:"list", items:[
            "`ui.add(...)` for widgets you keep handles on.",
            "Layout: `ui.horizontal`, `ui.columns`, `egui::Grid`.",
            "State that survives outside App? `ui.memory()` or stores keyed by Id.",
          ]},
        ],
        quiz:[
          {q:"In egui, where does UI state conventionally live?",
           opts:["In widgets","In the DOM","In your own App struct, mutated in update()","In CSS variables"], a:2,
           e:"Immediate mode: your struct is the single source of truth; update() writes straight into it."},
          {q:"T/F: the same egui `update` body runs every frame (60+ times a second).",
           opts:["True","False"], a:0,
           e:"Yes — cheap calls each frame; layout is recomputed, which is why immediate mode loves simple branches."},
        ]
      },
      {
        id:"ui-3", title:"iced — Elm Architecture",
        blocks:[
          {t:"text", c:"iced splits the app into: Model (state), Message (events), update (msg -> state changes with side-effect Commands), view (state -> widgets)."},
          {t:"code", label:"src/main.rs (iced)", c:`use iced::{Element, Task, widget::{button, column, text}};

#[derive(Default)]
struct Counter {
    count: i32,
}

#[derive(Debug, Clone)]
enum Message {
    Increment,
    Decrement,
}

fn update(state: &mut Counter, message: Message) -> Task<Message> {
    match message {
        Message::Increment => state.count += 1,
        Message::Decrement => state.count -= 1,
    }
    Task::none()
}

fn view(state: &Counter) -> Element<Message> {
    column![
        text(state.count).size(48),
        button("add").on_press(Message::Increment),
        button("remove").on_press(Message::Decrement),
    ]
    .into()
}

fn main() -> iced::Result {
    iced::run("counter", update, view)
}`},
          {t:"text", c:"Side effects (HTTP, files, timers) become `Command`s returned from update — fully testable: assert on (state, messages) without a window."},
          {t:"list", items:[
            "Subscription system for event streams (time, keyboard, websockets).",
            "Theming via `theme::Palette`; custom widgets implement `Widget`.",
          ]},
        ],
        quiz:[
          {q:"In Elm-style (iced) apps, the update function...",
           opts:["mutates the DOM directly","acts purely on (state, Message) and returns Commands for effects","does UI layout","parses input files"], a:1,
           e:"update owns state transitions; effects are data (Commands) the runtime executes — testable by construction."},
          {q:"Which is NOT an iced concept?",
           opts:["Message","Command","Element","Borrow group"], a:3,
           e:"Messages, Commands and Elements are real; 'Borrow group' is nonsense."},
        ]
      },
      {
        id:"ui-4", title:"Tauri — Rust Core + Web Skin",
        blocks:[
          {t:"text", c:"Tauri: frontend = standard web app (anything you've built before). Backend = Rust. They talk over a command bridge: JS calls `invoke`, Rust executes an annotated command."},
          {t:"code", label:"src-tauri/src/main.rs", c:`use tauri::Manager;

#[tauri::command]
fnchest_count(app: tauri::AppHandle) -> Result<u32, String> {
    // real work happens here: fs, db, api - the webview never touches it
    let count = std::fs::read_to_string("save.txt")
        .map(|s| s.lines().count() as u32)
        .map_err(|e| e.to_string())?;
    Ok(count)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![chest_count])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}`},
          {t:"code", label:"frontend (JS)", c:`import { invoke } from '@tauri-apps/api/core';

const count = await invoke('chest_count');
console.log(\`\${count} chests on disk\`);`},
          {t:"list", items:[
            "Security front and center: explicit allowlists (capabilities) for fs/shell/http scope.",
            "Bundle: `tauri build` produces .exe/.dmg/.AppImage with a tiny footprint (~5-10MB).",
            "State: `tauri::State<T>` managed; also great with sqlx/reqwest for real tools.",
          ]},
          {t:"warn", c:"The command name in `invoke('chest_count')` must match EXACTLY the Rust fn name (kebab-case conversion applies in v2). Typos fail at runtime, not compile time."},
        ],
        quiz:[
          {q:"In Tauri, heavy lifting (DB, filesystem, hashing) should happen...",
           opts:["In the webview JS","In Rust commands, exposed via invoke handler","In CSS workers","Nowhere - it's unsafe"], a:1,
           e:"The Rust process owns privileged operations; the webview only displays and calls commands."},
          {q:"What makes Tauri apps smaller than Electron apps?",
           opts:["Compression","They reuse the OS webview instead of bundling Chromium","No icons","Minified Rust"], a:1,
           e:"Electron ships a whole Chromium; Tauri uses the system web view (WebView2/WKWebView/WebKitGTK)."},
        ]
      },
      {
        id:"ui-5", title:"Slint — Declarative Markup",
        blocks:[
          {t:"text", c:"Slint compiles a `.slint` markup file into Rust types: components, properties, callbacks — a .ui DSL with good embedded & designer tooling."},
          {t:"code", label:"ui.slint", c:`export component AppWindow inherits Window {
    in property <int> count;
    in-out property <string> name;
    callback clicked-decrement();
    callback clicked-increment();
    VerticalLayout {
        Text { text: "count: " + count; }
        HorizontalLayout {
            Button { text: "+"; clicked => root.clicked-increment(); }
            Button { text: "-"; clicked => root.clicked-decrement(); }
        }
    }
}`},
          {t:"code", label:"main.rs", c:`slint::include_modules!();

fn main() {
    let ui = AppWindow::new().unwrap();
    let ui_h = ui.as_weak();
    ui.on_clicked_increment(move || {
        let ui = ui_h.upgrade().unwrap();
        ui.set_count(ui.get_count() + 1);
    });
    ui.run().unwrap();
}`},
          {t:"text", c:"Templates also generate a JS/WASM binding — same UI can ship to the browser. Great for embedded dashboards: targets MCUs which egui/iced do not."},
        ],
        quiz:[
          {q:"In Slint, what does `slint::include_modules!()` do?",
           opts:["Imports JS widgets","Generates Rust bindings from the compiled .slint UI","Installs the DSL","Creates the window handle"], a:1,
           e:"The build compiles .slint into native code; include_modules brings those types into your crate."},
          {q:"Slint is strongest when...",
           args:null,
           opts:["Parsing huge logs","Rendering scroll-heavy 3D","Declarative dashboards & embedded targets","Writing shaders"], a:2,
           e:"Designer-friendly markup + tiny footprint = dashboards and MCUs."},
        ]
      },
      {
        id:"ui-6", title:"Crafting Quests — UI Projects",
        blocks:[
          {t:"text", c:"Mine your skills with real builds. Pick one, keep the scope small, ship it."},
          {t:"list", items:[
            "**Slot Inventory (egui)** — a 9x3 inventory grid; drag & drop between slots; tooltips with item names. Concepts: immediate mode, state maps, mousedown routing.",
            "**Server Status Widget (Slint)** — pings a Minecraft server every 30s, shows player count as a bar chart. Concepts: Slint callbacks, timer loops, serde.",
            "**Chest Archiver (Tauri+sqlx)** — web UI that stores/retrieves text notes in SQLite. Concepts: commands, state, migrations, pagination.",
            "**Terminal极其 Portfolio (Web/WASM)** — a hacker-style terminal page in Rust compiled to WASM (Yew or Dioxus) that parses fake commands (ls, cd, sudo deploy).",
          ]},
          {t:"note", icon:"🏆", c:"Allowed extras: splash screens, themes, animations — but a WORKING feature list beats a pretty shell. Prototype loop: 1 command → 1 view → polish."},
        ],
        quiz:[
          {q:"Which project brief mixes Tauri AND a database track?",
           opts:["Slot Inventory","Chest Archiver","Terminal Portfolio","Server Status Widget"], a:1,
           e:"The Archiver uses Tauri commands backed by SQLite (check the Database track for sqlx)."},
          {q:"Best first step for ANY of these projects?",
           opts:["Start with animations","Ship the ugliest end-to-end version, then decorate","Read all crates docs page by page","Write the design doc for a week"], a:1,
           e:"End-to-end skeleton first (one button, one action), then iterate outward."},
        ]
      },
    ]
  },

  /* ==================== DATABASE TRACK ==================== */
  {
    id:"db", name:"The Underground Vault — Databases", icon:"🗄️", accent:"#c9a227",
    tagline:"SQLite to SQLx: sockets, compile-time-verified queries and migrations that don't fire you.",
    desc:"Three database layers in Rust: rusqlite (embedded), sqlx (async + compile-time checked), diesel (classic ORM). Plus design patterns that survive real deployments.",
    lessons:[
      {
        id:"db-1", title:"Chest or Librarian?",
        blocks:[
          {t:"text", c:"Two storage families: **embedded** (SQLite: the DB is a FILE — perfect for apps, tools, embedded) and **client-server** (PostgreSQL/MySQL — concurrent multi-user services)."},
          {t:"list", items:[
            "**rusqlite** — sync driver for SQLite, zero server, bundling easy.",
            "**sqlx (async)** — drivers for Postgres/MySQL/SQLite + optional COMPILE-TIME query checks.",
            "**diesel** — the schema-first ORM: mappings in table! macros; type-safe DSL.",
            "**sea-orm** — dynamic ORM on sqlx (entities, relations, migrations).",
          ]},
          {t:"text", c:"Rule of thumb: local app data → SQLite (rusqlite). Web services/async stacks → sqlx. Complex domain models & you want codegen → diesel/sea-orm."},
          {t:"tip", c:"Whichever you choose, learn plain SQL first — ORMs shine only when you know what they generate."},
        ],
        quiz:[
          {q:"Which library stores data inside a plain file, no server?",
           opts:["sqlx","rusqlite","reqwest","tokio"], a:1,
           e:"rusqlite drives SQLite, an embedded database engine over a file."},
          {q:"sqlx's star feature is...",
           opts:["ORM models","Compile-time verified SQL (macro queries checked against the live schema)","In-memory only","ORM models only"], a:1,
           e:"query! macros type-check SQL against the schema at build time — typos die in CI."},
        ]
      },
      {
        id:"db-2", title:"rusqlite — The Save File Engine",
        blocks:[
          {t:"text", c:"Open a connection, execute DDL, use prepared statements for anything tunable."},
          {t:"code", c:`use rusqlite::{Connection, params};

fn main() -> rusqlite::Result<()> {
    let conn = Connection::open("players.db")?;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS player_info (
            id   INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            xp   INTEGER NOT NULL DEFAULT 0
        )",
        [],
    )?;

    conn.execute("INSERT INTO player_info (name, xp) VALUES (?1, ?2)",
                 params!["Steve", 1000])?;

    let mut stmt = conn.prepare("SELECT id, name, xp FROM player_info WHERE xp > ?1")?;
    let rows = stmt.query_map(params![500], |r| {
        Ok(format!("{} has {} xp", r.get::<_, String>(1)?, r.get::<_, i64>(2)?))
    })?;
    for row in rows { println!("{}", row?); }
    Ok(())
}`},
          {t:"text", c:"Transactions: `let tx = conn.transaction()?;` …do work… `tx.commit()?;` — atomic all-or-nothing, and the borrow checker FORBIDS prepared stmts from leaking outside tx — the famous 'grid is guarded' pattern."}
          ,
          {t:"warn", c:"`?1` placeholders with params![] avoid injection by construction. NEVER format! user strings into SQL — that's the classic injection hole (see the Cyber Security track)."},
        ],
        quiz:[
          {q:"Why does rusqlite prevent using `&Statement` after the parent transaction ends?",
           opts:["Performance hints","The borrows tie statement lifetime to the transaction — uses-after-free at compile time","Random rule","Statements are Copy"], a:1,
           e:"Borrowing rules (statement borrows from conn/tx) make misuse a compile error, not a 3AM corruption."},
          {q:"The safe way to bind user input in SQL is...",
           opts:["format! into the query string","Parameters (params![])","Base-64 encoding","String escaping by hand"], a:1,
           e:"Parameterized statements keep untrusted data as DATA, never as code."},
        ]
      },
      {
        id:"db-3", title:"sqlx — Async + Type-Checked Queries",
        blocks:[
          {t:"text", c:"sqlx is async-first (tokio) and optionally checks your SQL at COMPILE time against a real schema. Your typo becomes a build error."},
          {t:"code", c:`use sqlx::sqlite::{SqlitePool, SqlitePoolOptions};

#[derive(Debug, sqlx::FromRow)]
struct PlayerInfo { id: i64, name: String, xp: i64 }

#[tokio::main]
async fn main() -> Result<(), sqlx::Error> {
    let pool = SqlitePoolOptions::new().max_connections(5)
        .connect("sqlite://players.db?mode=rwc").await?;

    sqlx::query("INSERT INTO player_info (name, xp) VALUES (?, ?)")
        .bind("Alex").bind(250).execute(&pool).await?;

    let rich: Vec<PlayerInfo> = sqlx::query_as(
        "SELECT id, name, xp FROM player_info WHERE xp > ?")
        .bind(200)
        .fetch_all(&pool).await?;

    println!("{:?}", rich);
    Ok(())
}`},
          {t:"list", items:[
            "`sqlx::query!` / `query_as!` macros validate against schema (needs DATABASE_URL or offline .sqlx cache).",
            "Migrations: `sqlx migrate add init`, `sqlx migrate run`.",
            "Postgres/MySQL work the same way with a different pool type.",
          ]},
          {t:"note", icon:"💡", c:"Pool sizing: default 10 per replica is often too high for shared Postgres instances — tune to (cores * 2..4) + monitor for pool wait time."},
        ],
        quiz:[
          {q:"`sqlx::query_as::<_, Player>(...)` got a column name wrong. When do you find out?",
           opts:["At runtime when executing","At COMPILE time (macro verified)","Never","On the first deploy"], a:1,
           e:"The query! / query_as! macros parse SQL and validate types/columns during build."},
          {q:"Connection pools exist mainly to...",
           opts:["Look cool","Avoid per-request socket setup cost and cap DB concurrency","Compress queries","Skip migrations"], a:1,
           e:"Establishing connections is expensive and unbounded concurrency kills DBs — a pool fixes both."},
        ]
      },
      {
        id:"db-4", title:"diesel — The Type-Safe DSL",
        blocks:[
          {t:"text", c:"diesel maps tables into Rust structs via `table!` macros (schema.rs), turning your queries into composable builder chains checked by the compiler."},
          {t:"code", c:`diesel::table! {
    player_info (id) {
        id -> Integer,
        name -> Text,
        xp -> Integer,
    }
}

#[derive(Queryable, Selectable, Insertable, Debug)]
#[diesel(table_name = player_info)]
struct NewPlayer { name: String, xp: i64 }

fn insert(conn: &mut SqliteConnection) -> QueryResult<usize> {
    diesel::insert_into(player_info::table)
        .values(&NewPlayer { name: String::from("Notch"), xp: 9_000 })
        .execute(conn)
}

fn rich(conn: &mut SqliteConnection) -> QueryResult<Vec<(i64, String, i64)>> {
    player_info::table
        .filter(player_info::xp.gt(100))
        .order(player_info::xp.desc())
        .select((player_info::id, player_info::name, player_info::xp))
        .load(conn)
}`},
          {t:"text", c:"Column renames become compile errors at every CALL SITE. Migrations automate via diesel_cli (`diesel migration run`). The docs' tutorial is a must-read: it explains Queryable vs Identifiable vs Associations."},
        ],
        quiz:[
          {q:"In diesel, `#[diesel(table_name = ...)]` on a struct links it to...",
           opts:["A connection","The generated table mapping","A database file","A migration file number"], a:1,
           e:"table_name ties the struct to the inserted/selected table macro columns."},
          {q:"`diesel::insert_into(...).values(&new_player).execute(conn)` returns...",
           opts:["The inserted row always","QueryResult<usize> — affected row count or error","A JSON string","Nothing"], a:1,
           e:"execute gives affected count; get_result(s) fetch back rows."},
        ]
      },
      {
        id:"db-5", title:"Vault Design — Patterns That Scale",
        blocks:[
          {t:"list", items:[
            "**Repository pattern**: wrap queries in a `trait PlayerRepo` — swap SQLite for Postgres in tests, one impl change.",
            "**Migrations are code**: numbered, forward-only in prod; use down-migrations only in dev.",
            "**Testing**: SQLite `:memory:` DB per test + migrations → hermetic DB tests in ms.",
            "**Pooling configs**: max_connections, acquire timeouts, statement caching.",
            "**Backups**: SQLite file copy for local data; Postgres: WAL archiving or managed snapshots.",
            "**Never** trust timestamps from clients; set them server-side.",
          ]},
          {t:"code", c:`// Repo trait sketch — testable, swappable:
trait PlayerRepo {
    fn find(&self, id: i64) -> impl Future<Output = Result<Option<PlayerInfo>, DbErr>>;
    fn add_xp(&self, id: i64, delta: i64) -> impl Future<Output = Result<(), DbErr>>;
}
// SQLite in unit tests, Postgres in prod: two impls, same business code.`},
        ],
        quiz:[
          {q:"The repository pattern's main benefit is...",
           opts:["Faster SQL","Isolating data access behind an interface (testable, swappable backends)","Fewer SQL keywords","Automatic backups"], a:1,
           e:"Business logic depends on a trait, not a concrete driver — mocks & backends swap out."},
          {q:"For fast hermetic tests you typically...",
           opts:["Run Postgres in docker for every unit test","Use SQLite :memory: + migrations per test","Skip DB tests and pray","Randomize test order"], a:1,
           e:"In-memory SQLite gives millisecond, isolated DB tests; heavier stacks run in CI."},
        ]
      },
      {
        id:"db-6", title:"Crafting Quests — Database Projects",
        blocks:[
          {t:"list", items:[
            "**Player Save Store (rusqlite)** — the classic: serialize a game save (name, position, inventory) to SQLite; schema versioning mental model.",
            "**Inventory API (sqlx + axum)** — REST endpoints: crates in/out, item counts, ETag-like optimistic locking with `xp`-style columns.",
            "**Analytics CLI (diesel/sea-orm)** — read a CSV of trades, insert into a DB, query top sellers, generate a markdown summary.",
          ]},
          {t:"text", c:"Acceptance criteria: schema in migrations; at least 5 tests (2 DB, 2 API, 1 E2E happy run); README with setup commands. Treat every project like a mini production service."},
          {t:"note", icon:"🗄️", c:"Remember — the Vault teaches STATEFUL craft. Every serious app eventually needs it; do it once properly and reuse forever."},
        ],
        quiz:[
          {q:"A good acceptance criterion for any of these quests?",
           opts:["Use ten crates","Migrations + tests + README","Skip error handling","One giant main.rs"], a:1,
           e:"Schema-as-code + tests + docs is the skill that transfers to real jobs."},
          {q:"For the CLI analytics quest, parsing CSV is elegantly done with...",
           opts:["split(',') forever and tears","String escapes","The csv crate (handles quoting!)","A regex per row"], a:2,
           e:"Quoted fields, commas inside cells, BOMs — csv crate eats that for breakfast."},
        ]
      },
    ]
  },

  /* ==================== CYBER SECURITY TRACK ==================== */
  {
    id:"sec", name:"The Nether Fortress — Cyber Security", icon:"🛡️", accent:"#ff5757",
    tagline:"Why the entire world is rewriting security-critical code in Rust — and how to start.",
    desc:"Memory safety as a security property, secure coding patterns, applied crypto, network tools, forensics/CTF puzzles and fuzzing.",
    lessons:[
      {
        id:"sec-1", title:"Why Rust Owns the Security Endgame",
        blocks:[
          {t:"text", c:"Microsoft & Google report that ~70% of serious CVEs in their C/C++ codebases are MEMORY SAFETY issues: buffer overflows, use-after-free, double free, dangling pointers. Rust removes whole classes at compile time — zero-cost peace of mind."},
          {t:"list", items:[
            "No use-after-free, no wild pointers, no double frees — the borrow checker is the bouncer.",
            "No data races — Send/Sync + one-writer-rule enforced at compile time.",
            "Bounds-checked arrays/Vecs by default; unchecked access requires `unsafe`.",
            "`cargo audit` checks dependency CVEs; `cargo deny` licenses + advisories.",
            "Values are initialized before use; integer overflow panics in debug builds (catch bugs early).",
          ]},
          {t:"text", c:"That is why Chrome, Android, Windows kernels, Linux drivers and cloud stuff (Firecracker, Discord, Cloudflare) ship Rust in security-critical paths."},
          {t:"note", icon:"🛡️", c:"Security mindset: memory safety kills EXPLOITATION TECHNIQUES, not threats. Input validation, least privilege and safe crypto still apply — Rust gives you better foundations, not miracles."},
        ],
        quiz:[
          {q:"Which bug CLASS does Rust largely eliminate at compile time?",
           opts:["Social engineering","Memory safety issues (UAF, overflows on stack, dangling pointers)","Weak passwords","All CVEs"], a:1,
           e:"Rust's borrow checker makes whole bug classes unrepresentable; logic flaws still need good engineering."},
          {q:"Which cargo subcommand checks your dependencies for known vulnerabilities?",
           opts:["cargo audit","cargo test","cargo fmt","cargo tree"], a:0,
           e:"cargo audit matches your Cargo.lock against the RustSec advisory database."},
        ]
      },
      {
        id:"sec-2", title:"Secure Coding Patterns for Rust",
        blocks:[
          {t:"list", items:[
            "**Validate input at the trust boundary**: parse to a strong type ASAP (Newtype: `struct Email(String)` + `Email::parse`), everything inward trusts static types instead of re-checking.",
            "**Bounds & overflow**: arithmetic that may exceed needs checked_*().or saturating — release builds wrap silently (unless overflow-checks = true).",
            "**Zeroize secrets**: passwords/keys in memory should be wiped (zeroize crate) — never rely on String drop semantics.",
            "**Constant-time comparisons** for MAC/password tokens: `subtle` crate (avoid timing leaks of ==).",
            "**Fail closed**: errors -> deny; prefer `?`/Result over unwrap in prod paths.",
            "**Least privilege**: drop Linux capabilities, parse-what-you-need, sandbox with seccomp/landlock where possible.",
          ]},
          {t:"code", c:`// Timing-safe MAC check (subtle):
use subtle::ConstantTimeEq;

fn verify_mac(computed: &[u8], provided: &[u8]) -> bool {
    computed.ct_eq(provided).into()
}
// NOTE: == on &[u8] short-circuits at the first mismatch -> timing oracle.

// Zeroize-on-drop secret:
use secrecy::{SecretBox, ExposeSecret};
let token = SecretBox::new(String::from("ghp_super_secret"));
println!("len={}", token.expose_secret().len());  // wipe happens on Drop`},
          {t:"text", c:"Also: `split_at` and indexing panic (denial vectors in servers); catch_unwind IS the wrong tool for handling hostile input — shape errors as Results and shut connections down."},
        ],
        quiz:[
          {q:"Why use ConstantTimeEq (subtle crate) for MAC verification?",
           opts:["It's faster","== leaks timing info about the number of matching prefix bytes","To save battery","It's required by std"], a:1,
           e:"Timing side channels reveal how much of a token matched — constant-time compare removes the oracle."},
          {q:"The Newtype-at-the-boundary idiom...",
           opts:["was deprecated","Validates once at the edge; interior code trusts the type","Compiles slower always","Replaces crypto"], a:1,
           e:"Parse, don't validate everywhere: strong types carry proofs the rest of the program can rely on."},
        ]
      },
      {
        id:"sec-3", title:"Applied Crypto in Rust (RustCrypto)",
        blocks:[
          {t:"text", c:"The RustCrypto ecosystem is the standard toolkit: hashes, HMAC, AEAD ciphers, KDFs — all pure Rust, well-audited patterns."},
          {t:"code", label:"Cargo.toml", c:`[dependencies]
sha2 = "0.10"
hmac = "0.12"
argon2 = "0.5"
rand = "0.9"`},
          {t:"code", c:`use sha2::{Sha256, Digest};
use hmac::{Hmac, Mac};

fn sha256(data: &[u8]) -> String {
    let mut h = Sha256::new();
    h.update(data);
    hex::encode(h.finalize())
}

fn hmac_sha256(key: &[u8], msg: &[u8]) -> Vec<u8> {
    let mut mac = <Hmac<Sha256>>::new_from_slice(key).expect("HMAC accepts any key size");
    mac.update(msg);
    mac.finalize().into_bytes().to_vec()
}`},
          {t:"code", label:"passwords (argon2)", c:`use argon2::{Argon2, PasswordHasher, PasswordVerifier, password_hash::{SaltString, PasswordHash}};

fn hash_password(pw: &str) -> String {
    let salt = SaltString::generate(&mut rand::rng());
    Argon2::default().hash_password(pw.as_bytes(), &salt).unwrap().to_string()
}

fn verify_password(pw: &str, stored: &str) -> bool {
    let parsed = PasswordHash::new(stored).unwrap();
    Argon2::default().verify_password(pw.as_bytes(), &parsed).is_ok()
}`},
          {t:"list", items:[
            "Grain: SHA-256 for INTEGRITY, HMAC for AUTHENTICITY, Argon2id for PASSWORDS (memory-hard, slow on GPUs).",
            "Never roll your own ciphers; always random salts (SaltString::generate); NEVER store plaintext passwords.",
            "AEADRails-style: aes-gcm / chacha20poly1305 with a fresh random 12-byte nonce per message.",
          ]},
          {t:"warn", c:"Nonce reuse destroys AES-GCM (keystream reuse → recovery attacks). Generate with rand; never counters you reseed."},
        ],
        quiz:[
          {q:"Which primitive is the right tool for storing login passwords?",
           opts:["SHA-256 alone","Argon2id (memory-hard KDF)","Base64","AES-GCM with a fixed key"], a:1,
           e:"Passwords need slow, memory-hard hashing with unique salts — Argon2id. Fast hashes are for integrity, not credential storage."},
          {q:"HMAC provides...",
           opts:["Encryption","Integrity + authenticity with a shared secret key","Compression","Anonymity"], a:1,
           e:"HMAC = keyed integrity/authenticity. It doesn't encrypt; it proves the data came from a key holder and wasn't altered."},
        ]
      },
      {
        id:"sec-4", title:"Network Muscles — Sockets & Scanners",
        blocks:[
          {t:"text", c:"std::net is enough for TCP tools: listeners, streams, timeouts. async needs only tokio + same concepts."},
          {t:"code", label:"TCP echo server", c:`use std::io::{Read, Write};
use std::net::{TcpListener, TcpStream};

fn handle(mut stream: TcpStream) {
    let mut buf = [0u8; 512];
    if let Ok(n) = stream.read(&mut buf) {
        let _ = stream.write_all(&buf[..n]);   // echo back
    }
    let _ = stream.shutdown(std::net::Shutdown::Both);
}

fn main() -> std::io::Result<()> {
    let listener = TcpListener::bind("127.0.0.1:25565")?;
    for conn in listener.incoming() {
        if let Ok(s) = conn {
            std::thread::spawn(move || handle(s));
        }
    }
    Ok(())
}`},
          {t:"code", label:"port scanner sketch", c:`use std::net::{TcpStream, SocketAddr};
use std::time::Duration;

fn open(addr: SocketAddr) -> Option<TcpStream> {
    TcpStream::connect_timeout(&addr, Duration::from_millis(300)).ok()
}

fn scan(host: &str, ports: &[u16]) -> Vec<u16> {
    ports.iter()
        .filter(|&&p| open(format!("{}:{}", host, p).parse().unwrap()).is_some())
        .map(|&p| p)
        .collect()
}

fn main() {
    let ports = vec![22, 80, 443, 25565, 3306];
    println!("open: {:?}", scan("scanme.nmap.org", &ports));
}`},
          {t:"warn", c:"Scan only targets you OWN or are explicitly allowed to test (lab VMs, scanme.nmap.org, TryHackMe ranges). Unlisted scanning may be illegal — constructor ethics matter. Also connect_timeout + rate limiting keeps you polite."},
        ],
        quiz:[
          {q:"`TcpStream::connect_timeout` is important for scanners because...",
           opts:["TCP has a limit","Default connect can hang ~minutes on filtered ports","It encrypts the scan","It rate-limits automatically"], a:1,
           e:"Without timeouts a hostile/firewalled host stalls your scanner thread forever."},
          {q:"Scanning practice targets is OK when...",
           opts:["They're famous","You own them or they explicitly allow testing (scanme.nmap.org, labs)","Only at night","Targets have banners"], a:1,
           e:"Authorization is the line: own it or be invited. Everything else can be a crime."},
          ]
      },
      {
        id:"sec-5", title:"Forensics Workshop — Hex, XOR & Ciphers",
        blocks:[
          {t:"text", c:"Classic CTF forensics is string surgery over binary data. Tools to build (and try live in this site's Tools section):"},
          {t:"code", label:"hexdump + strings", c:`fn hexdump(data: &[u8]) {
    for (i, chunk) in data.chunks(16).enumerate() {
        let hex: String = chunk.iter().map(|b| format!("{:02x}", b)).collect();
        let ascii: String = chunk.iter()
            .map(|b| if b.is_ascii_graphic() || *b == b' ' { *b as char } else { '.' })
            .collect();
        println!("{:08x}  {:<32}  {}", i * 16, hex, ascii);
    }
}

fn extract_strings(data: &[u8], min: usize) -> Vec<String> {
    let mut out = Vec::new();
    let mut cur = String::new();
    for &b in data {
        if b.is_ascii_graphic() { cur.push(b as char); }
        else { if cur.chars().count() >= min { out.push(cur.clone()); } cur.clear(); }
    }
    out
}`},
          {t:"text", c:"XOR is the weakest classic cipher — and still common in ransomware junk. A single-byte key hides in the printable / high-frequency statistics; brute force all 256 keys and eyeball:"},
          {t:"code", label:"single-byte xor brute", c:`fn xor(data: &[u8], key: u8) -> Vec<u8> {
    data.iter().map(|b| b ^ key).collect()
}

fn best_key(data: &[u8]) -> Vec<u8> {
    let mut best = Vec::new(); let mut best_score = -1.0f32;
    for k in 0..=255u8 {
        let plain = xor(data, k);
        let printable = plain.iter().filter(|b| b.is_ascii_graphic() || **b == b' ').count();
        let score = printable as f32 / data.len() as f32;
        if score > best_score { best_score = score; best = plain; }
    }
    best
}`},
          {t:"tip", c:"These tools power the in-browser Challenges below — build them in Rust, then crack the flags here using the JS mini-tools."},
        ],
        quiz:[
          {q:"In a hexdump, what do the `.`-dots in the ASCII column represent?",
           opts:["Zero bytes","Non-printable bytes","Null pointers","Padding errors"], a:1,
           e:"Bytes without a graphic ASCII glyph show as '.' — the shape of the data becomes visible."},
          {q:"A single-byte XOR ciphertext leaks its key because...",
           opts:["XOR is invertible by addition","You can try all 256 keys and score printability/frequency","The file size changes","Key length is burned into header"], a:1,
           e:"Keyspace is tiny (256) and human text is statistically obvious — brute force + scoring cracks it."},
        ]
      },
      {
        id:"sec-6", title:"Fuzzing & Hybrid Defense",
        blocks:[
          {t:"text", c:"Fuzzing feeds garbage into your code hoping for crashes. cargo-fuzz builds with libFuzzer + ASan and mutates inputs automatically."},
          {t:"code", label:"fuzz/fuzz_targets/parse.rs", c:`// cargo install cargo-fuzz && cargo fuzz init
// src must expose a parse() for hostile input:
#![no_main]
use libfuzzer_sys::fuzz_target;

fuzz_target!(|data: &[u8]| {
    // The target: JSON-ish parser under attack
    let _ = crude_json_parse(std::str::from_utf8(data).unwrap_or(""));
});`},
          {t:"list", items:[
            "**proptest** — property-based tests:runs thousands of random cases against invariants (e.g. roundtrip: decode(encode(x)) == x).",
            "**miri** — interprets and checks for UB (undefined behavior) — run unsafe code through it.",
            "**sanitizers**: RUSTFLAGS='-Zsanitizer=address' (nightly) for memory bugs in unsafe.",
            "**cargo deny / audit** keep dependency risk visible.",
          ]},
        ],
        quiz:[
          {q:"What distinguishes proptest from classic unit tests?",
           opts:["It's faster","It generates thousands of random inputs and checks properties/invariants","It avoids running code","It replaces fuzzing entirely"], a:1,
           e:"You state a property (e.g. parse(serialize(x)) == x) and the framework hunts counterexamples to it."},
          {q:"Miri primarily detects...",
           opts:["Logic bugs","Undefined behavior by executing your program","SQL injections","Missing README files"], a:1,
           e:"Miri interprets MIR and flags UB: aliasing violations, out-of-bounds, uninitialized reads."},
        ]
      },
      {
        id:"sec-7", title:"The Vault — Challenges",
        blocks:[
          {t:"text", c:"One vault, many locks. Crack with the in-page tools (scroll down to the Vault Tools) or hand-crafted Rust. Enter the decoded answer under each lock."},
          {t:"list", items:[
            "**LOCK 1 — base64**: seasoned rune: 'Y3JhZnRub3R3YXI='",
            "**LOCK 2 — Caesar +3**: fortress password: 'qhwkhu'",
            "**LOCK 3 — hex**: beacon msg: '676c6f7773746f6e65'",
          ]},
          {t:"note", icon:"⚠️", c:"Answers are checked in your browser only — like reverse shells should be."},
          {t:"text", c:"Extend the hunt in Rust: base64 decode each 'rune' with the base64 crate, Caesar-shift via byte arithmetic, and hex-decode with the hex crate. Then score yourself with assert_eq! tests."},
        ],
        quiz:[
          {q:"base64 encoding serves which purpose?",
           opts:["Encryption","Encoding binary into printable text for transport","Hashing","Compression"], a:1,
           e:"base64 is encoding, NOT crypto: reversible by anyone, convenient for bytes-over-text channels."},
          {q:"3 turns of Caesar on 'cave' gives...",
           opts:["fdyh","bzsa","dcwf","dywf"], a:0,
           e:"c→f, a→d, v→y, e→h: 'fdyh'. Shifts are rotations of the alphabet."},
        ]
      },
    ]
  },
];

/* Cyber-security in-browser vault challenges */
const SEC_CHALLENGES = [
  { id:"c1", title:"Lock 1 — Base64", encoding:"base64",
    encoded:"Y3JhZnRub3R3YXI=", hint:"Paste into the Base64 tool and press Decode.", answer:"craftnotwar" },
  { id:"c2", title:"Lock 2 — Caesar +3", encoding:"caesar",
    encoded:"qhwkhu", hint:"Set the Caesar shift to 3 backwards (or try shifts until it reads right).", answer:"nether" },
  { id:"c3", title:"Lock 3 — Hex", encoding:"hex",
    encoded:"676c6f7773746f6e65", hint:"Use Hex -> Text.", answer:"glowstone" },
];
