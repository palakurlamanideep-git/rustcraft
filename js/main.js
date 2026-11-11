/* ============================================================
   RUSTCRAFT — shared engine: progress, XP, achievements, sfx,
   lesson renderer, code highlighting, toasts, day/night theme,
   player-panel modal.
   Loads AFTER data files, BEFORE page scripts.
   ============================================================ */
"use strict";

const RC = (() => {

  /* ---------------- save state ---------------- */
  const SAVE_KEY = "rustcraft_save_v1";
  function fresh() {
    return { xp:0, lessons:{}, problems:{}, ach:{}, challenges:{}, last:null, sound:true, theme:null };
  }
  let save = fresh();
  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        save = Object.assign(fresh(), p);
        save.lessons = save.lessons || {};
        save.problems = save.problems || {};
        save.ach = save.ach || {};
      }
    } catch (e) { save = fresh(); }
  }
  function persist() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) {}
  }
  load();

  /* ---------------- audio (WebAudio blips) ---------------- */
  let actx = null;
  function tone(freq, dur = 0.06, type = "square", vol = 0.028, delay = 0) {
    if (!save.sound) return;
    try {
      if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
      const t0 = actx.currentTime + delay;
      const o = actx.createOscillator();
      const g = actx.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.setValueAtTime(vol, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(actx.destination);
      o.start(t0); o.stop(t0 + dur + 0.02);
    } catch (e) {}
  }
  const sfx = {
    click(){ tone(560, .04); },
    ok(){ tone(660,.06); tone(990,.09,"square",.028,.07); },
    err(){ tone(170,.14,"sawtooth",.03); },
    level(){ [523,659,784,1046].forEach((f,i)=>tone(f,.09,"square",.03,i*.085)); },
    pop(){ tone(940,.03); },
  };

  /* ---------------- day / night theme ----------------
     save.theme: null = follow the system, "dark" = night forced,
     "light" = sunrise forced. Applied as data-theme on <html>. */
  function systemTheme() {
    try {
      return (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) ? "light" : "dark";
    } catch (e) { return "dark"; }
  }
  function themePref() { return save.theme || systemTheme(); }
  function applyTheme() {
    document.documentElement.setAttribute("data-theme", themePref());
  }
  function setTheme(t, announce) {
    save.theme = t; persist(); applyTheme();
    syncThemeButton();
    if (announce !== false) {
      toast(t === "light" ? "☀️ Sunrise! The sun peaks over the flower field." : "🌙 Night falls. Back to the mine.", "green");
      sfx.ok();
    }
  }
  function cycleTheme() { setTheme(themePref() === "light" ? "dark" : "light"); }
  let systemHooked = false;
  function hookSystem() {
    if (systemHooked || !window.matchMedia) return;
    systemHooked = true;
    try {
      window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", () => {
        if (!save.theme) applyTheme();
      });
    } catch (e) {}
  }
  function syncThemeButton() {
    const b = document.getElementById("btn-theme");
    if (!b) return;
    const t = themePref();
    // while dark, offer the sun (click → day). while light, offer the moon.
    b.title = t === "light" ? "Switch to night" : "Switch to sunrise";
    b.setAttribute("aria-label", b.title);
    b.classList.toggle("is-light", t === "light");
    b.innerHTML = t === "light" ? PIXEL_MOON : PIXEL_SUN;
  }
  /* self-drawn pixel sun & moon (svg, crisp, no external assets) */
  const PIXEL_SUN =
    '<svg viewBox="0 0 16 16" aria-hidden="true"><rect class="ps-core" x="5" y="5" width="6" height="6"/>' +
    '<rect class="ps-ray" x="7" y="2" width="2" height="2"/><rect class="ps-ray" x="7" y="12" width="2" height="2"/>' +
    '<rect class="ps-ray" x="2" y="7" width="2" height="2"/><rect class="ps-ray" x="12" y="7" width="2" height="2"/>' +
    '<rect class="ps-ray" x="3" y="3" width="2" height="2"/><rect class="ps-ray" x="11" y="3" width="2" height="2"/>' +
    '<rect class="ps-ray" x="3" y="11" width="2" height="2"/><rect class="ps-ray" x="11" y="11" width="2" height="2"/>' +
    '<rect class="ps-face" x="6" y="6" width="4" height="4"/></svg>';
  const PIXEL_MOON =
    '<svg viewBox="0 0 16 16" aria-hidden="true"><rect class="pm-core" x="4" y="2" width="8" height="12"/>' +
    '<rect class="pm-core" x="3" y="4" width="10" height="8"/>' +
    '<rect class="pm-core" x="2" y="7" width="12" height="4"/>' +
    '<rect class="pm-crater" x="5" y="5" width="2" height="2"/>' +
    '<rect class="pm-crater" x="8" y="8" width="2" height="2"/>' +
    '<rect class="pm-crater" x="7" y="4" width="1" height="1"/></svg>';

  /* ---------------- levels ---------------- */
  const LEVEL_TITLES = ["Grass Block","Cobblestone","Iron Pick","Golden Apple",
    "Diamond","Emerald","Obsidian","Netherite","Wither Slayer","Ender Dragon Rider","Rust Wizard"];
  function levelInfo(xp = save.xp) {
    const lvl = Math.floor(Math.sqrt(xp / 40));
    const need = 40 * (lvl + 1) * (lvl + 1);
    const start = 40 * lvl * lvl;
    const pct = Math.min(100, Math.round(((xp - start) / (need - start)) * 100));
    const title = LEVEL_TITLES[Math.min(lvl, LEVEL_TITLES.length - 1)];
    return { lvl, title, xp, need, pct };
  }

  /* ---------------- toasts ---------------- */
  function toast(msg, kind = "") {
    let zone = document.querySelector(".toast-zone");
    if (!zone) {
      zone = document.createElement("div");
      zone.className = "toast-zone";
      document.body.appendChild(zone);
    }
    const t = document.createElement("div");
    t.className = "toast " + kind;
    t.textContent = msg;
    zone.appendChild(t);
    sfx.pop();
    setTimeout(() => { t.classList.add("out"); }, 2600);
    setTimeout(() => { t.remove(); }, 3100);
  }

  /* ---------------- achievements ---------------- */
  const ACHIEVEMENTS = [
    { id:"first_lesson", icon:"📖", title:"Getting Wood", desc:"Complete your very first lesson.",
      check: s => lessonDoneCount(s) >= 1 },
    { id:"own_hero", icon:"🌲", title:"Ownership Overlord", desc:"Finish every lesson in the Forest (Ownership).",
      check: s => worldDone(s, "ownership") },
    { id:"worlds_all", icon:"🏛️", title:"Server Admin", desc:"Finish all 8 core worlds.",
      check: s => WORLDS.every(w => worldDone(s, w.id)) },
    { id:"first_problem", icon:"🛠️", title:"Crafting Table Time", desc:"Mark your first problem as solved.",
      check: s => solveCount(s) >= 1 },
    { id:"iron_pick", icon:"⛏️", title:"Iron Pickaxe", desc:"Solve 5 problems.",
      check: s => solveCount(s) >= 5 },
    { id:"diamond_pick", icon:"💎", title:"Diamond Pickaxe", desc:"Solve 10 problems.",
      check: s => solveCount(s) >= 10 },
    { id:"netherite_pick", icon:"🕳️", title:"Netherite Pickaxe", desc:"Solve 15 problems.",
      check: s => solveCount(s) >= 15 },
    { id:"grindstone", icon:"🪨", title:"Grindstone", desc:"Solve every Wood AND Stone tier problem.",
      check: s => PROBLEMS.filter(p=>p.tier==="wood"||p.tier==="stone").every(p => s.problems[p.id]) },
    { id:"ui_master", icon:"🖥️", title:"Master Builder", desc:"Complete the UI track.",
      check: s => trackDone(s, "ui") },
    { id:"db_master", icon:"🗄️", title:"Vault Keeper", desc:"Complete the Database track.",
      check: s => trackDone(s, "db") },
    { id:"sec_master", icon:"🛡️", title:"Fortress Warden", desc:"Complete the Cyber Security track.",
      check: s => trackDone(s, "sec") },
    { id:"fullstack", icon:"🧙", title:"Full Stack Wizard", desc:"Complete ALL three specialized tracks.",
      check: s => trackDone(s,"ui") && trackDone(s,"db") && trackDone(s,"sec") },
    { id:"xp_1000", icon:"🏆", title:"Legend of the Craft", desc:"Reach 1000 XP.",
      check: s => (s.xp||0) >= 1000 },
  ];
  function lessonDoneCount(s){ return Object.keys(s.lessons||{}).length; }
  function solveCount(s){ return Object.keys(s.problems||{}).length; }
  function worldDone(s, wid){
    const w = WORLDS.find(w=>w.id===wid); if(!w) return false;
    return w.lessons.every(l => s.lessons[l.id]);
  }
  function trackDone(s, tid){
    const t = (typeof TRACKS !== "undefined") ? TRACKS.find(t=>t.id===tid) : null;
    if(!t) return false;
    return t.lessons.every(l => s.lessons[l.id]);
  }
  function achCheck() {
    let unlockedAny = false;
    for (const a of ACHIEVEMENTS) {
      if (!save.ach[a.id]) {
        let ok = false;
        try { ok = a.check(save); } catch (e) {}
        if (ok) { save.ach[a.id] = Date.now(); queueAch(a); unlockedAny = true; }
      }
    }
    if (unlockedAny) persist();
  }
  const achQueue = [];
  let achShowing = false;
  const ACH_HEAD = "Advancement Made!";
  /* any popup in the same Minecraft banner style. p = {icon, head, title, desc, cls} */
  function queuePop(p) {
    achQueue.push(Object.assign({ head: ACH_HEAD, cls: "pop-adv" }, p));
    drain();
  }
  function queueAch(a){ queuePop({ icon:a.icon, title:a.title, desc:a.desc, head:ACH_HEAD, cls:"pop-adv" }); }
  function drain(){
    if (achShowing) return;
    const p = achQueue.shift();
    if (!p) return;
    achShowing = true;
    let pop = document.querySelector(".ach-pop");
    if (!pop) {
      pop = document.createElement("div");
      pop.className = "ach-pop";
      document.body.appendChild(pop);
    }
    pop.innerHTML = "";
    const ic = document.createElement("div"); ic.className="ai"; ic.textContent=p.icon;
    const body = document.createElement("div");
    const at = document.createElement("div"); at.className="at"; at.textContent=p.head;
    const an = document.createElement("div"); an.className="an"; an.textContent=p.title;
    const ad = document.createElement("div"); ad.className="ad"; ad.textContent=p.desc;
    body.appendChild(at); body.appendChild(an); body.appendChild(ad);
    pop.appendChild(ic); pop.appendChild(body);
    pop.classList.remove("pop-adv","pop-lesson","pop-world");
    pop.classList.add("show", "anim", p.cls || "pop-adv");
    sfx.level();
    setTimeout(()=>{ pop.classList.remove("show","anim", p.cls || "pop-adv"); achShowing=false; drain(); }, 3400);
  }

  /* lesson / unit completion popups (fires for EVERY completed lesson,
     and a bigger "World Clear!" banner when a world or track is finished) */
  function lessonSource(id) {
    if (typeof WORLDS !== "undefined") {
      for (const w of WORLDS) { const l = w.lessons.find(l => l.id === id); if (l) return { kind:"world", world:w, lesson:l }; }
    }
    if (typeof TRACKS !== "undefined") {
      for (const t of TRACKS) { const l = t.lessons.find(l => l.id === id); if (l) return { kind:"track", track:t, lesson:l }; }
    }
    return null;
  }
  function queueLessonPop(id, label) {
    const src = lessonSource(id);
    if (!src) { queuePop({ icon:"📜", head:"Lesson Complete!", title:(label || "Lesson complete."), desc:"+25 XP mined.", cls:"pop-lesson" }); return; }
    const container = (src.kind === "world") ? src.world : src.track;
    const allDone = container.lessons.every(l => save.lessons[l.id]);
    if (allDone) {
      queuePop({ icon: container.icon, head:"World Clear! Goal Reached!",
                 title: container.name,
                 desc:"All " + container.lessons.length + " lessons complete — onto the next world!",
                 cls:"pop-world" });
    } else {
      queuePop({ icon: (container.icon || "📜"), head:"Lesson Complete!",
                 title: src.lesson.title, desc:(container.name || label) + " · +25 XP.",
                 cls:"pop-lesson" });
    }
  }

  /* ---------------- XP / events ---------------- */
  function addXP(n, label) {
    const before = levelInfo(save.xp);
    save.xp += n;
    const after = levelInfo(save.xp);
    persist();
    achCheck();
    updateHUD();
    toast(label + " +" + n + " XP", "green");
    if (after.lvl > before.lvl) {
      sfx.level();
      setTimeout(() => toast("LEVEL UP!  Lv." + after.lvl + " — " + after.title, "green"), 500);
    }
  }
  function completeLesson(id, label) {
    if (save.lessons[id]) return;
    save.lessons[id] = Date.now();
    persist();
    queueLessonPop(id, label);   // Minecraft-style banner for every lesson / world clear
    achCheck();                  // real advancements (queued after the lesson banner)
    addXP(25, (label || "Lesson complete."));
  }
  function solveProblem(id) {
    if (save.problems[id]) { toast("Already solved!", ""); return; }
    const p = (typeof PROBLEMS !== "undefined") ? PROBLEMS.find(p=>p.id===id) : null;
    const xp = p ? (TIER_XP[p.tier] || 20) : 20;
    save.problems[id] = { at: Date.now(), peeked:false };
    persist();
    addXP(xp, (p ? p.title : "Problem") + " SOLVED!");
  }
  function markPeeked(id){ if (save.problems[id]) { save.problems[id].peeked = true; persist(); } }

  /* ================= html helpers ================= */
  function el(tag, cls, text) {
    const d = document.createElement(tag);
    if (cls) d.className = cls;
    if (text !== undefined && text !== null) d.textContent = text;
    return d;
  }
  function esc(s) {
    return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }
  function inlineMd(s) {
    let out = esc(s);
    out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
    out = out.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
    return out;
  }

  /* rust syntax highlighting (single pass, post-escape) */
  const RUST_RE = new RegExp([
    "(\\/\\/[^\\n]*)",                                   // comments
    '("(?:[^"\\\\\\n]|\\\\.)*")',                        // strings
    "(\\b[a-z_][a-zA-Z0-9_]*!)\\b",                      // macros
    "(\\b(?:as|async|await|break|const|continue|crate|dyn|else|enum|extern|false|fn|for|if|impl|in|let|loop|match|mod|move|mut|pub|ref|return|struct|super|trait|true|type|unsafe|use|where|while|self|Self)\\b)",
    "(\\b[A-Z][A-Za-z0-9_]*)\\b",                        // types/constants
    "(\\b\\d[\\d_]*(?:\\.\\d+)?)\\b"                     // numbers
  ].join("|"), "g");
  function highlight(code) {
    let out = "";
    let last = 0;
    code.replace(RUST_RE, (m, cmt, str, mac, kw, ty, num, off) => {
      out += esc(code.slice(last, off));
      const cls = cmt?t_name("tk-cmt", m): str?t_name("tk-str", m): mac?t_name("tk-mac", m):
                  kw?t_name("tk-kw", m): ty?t_name("tk-ty", m): num?t_name("tk-num", m): "";
      out += cls;
      last = off + m.length;
      return m;
    });
    out += esc(code.slice(last));
    return out;
  }
  function t_name(cls, m){ return "<span class=\""+cls+"\">"+esc(m)+"</span>"; }

  /* code box with copy + playground buttons */
  function playgroundURL(code) {
    return "https://play.rust-lang.org/?version=stable&mode=debug&edition=2021&code=" + encodeURIComponent(code);
  }
  function copyText(text, okMsg) {
    const done = () => toast(okMsg || "Copied to clipboard!", "green");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, () => fallback());
    } else fallback();
    function fallback() {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.position="fixed"; ta.style.opacity="0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch(e) {}
      ta.remove();
    }
  }
  function codeBox(code, label) {
    const box = el("div","codebox");
    const head = el("div","codebox-head");
    head.appendChild(el("span","cl", "🧱 " + (label || "rust")));
    const bCopy = el("button","cb","COPY");
    bCopy.addEventListener("click", () => { sfx.click(); copyText(code, "Code copied — paste into a .rs file"); });
    const bRun = el("button","cb","▶ RUN IN PLAYGROUND");
    bRun.addEventListener("click", () => { sfx.click(); window.open(playgroundURL(code), "_blank"); });
    head.appendChild(bCopy); head.appendChild(bRun);
    const pre = el("pre");
    const c = el("code");
    c.innerHTML = highlight(code);
    pre.appendChild(c);
    box.appendChild(head); box.appendChild(pre);
    return box;
  }

  /* ================= lesson renderer ================= */
  function renderBlocks(blocks, mount) {
    for (const b of blocks) {
      if (b.t === "text") {
        mount.appendChild(Object.assign(el("p","block-text"), { } ) );
        mount.lastChild.innerHTML = inlineMd(b.c);
      } else if (b.t === "note" || b.t === "warn" || b.t === "tip") {
        const d = el("div","block-note" + (b.t==="warn"?" warn":b.t==="tip"?" tip":""));
        d.innerHTML = (b.icon ? "<span>" + b.icon + "</span> " : "") + inlineMd(b.c);
        mount.appendChild(d);
      } else if (b.t === "list") {
        const ul = el("ul");
        for (const it of b.items) {
          const li = el("li");
          li.innerHTML = inlineMd(it);
          ul.appendChild(li);
        }
        mount.appendChild(ul);
      } else if (b.t === "code") {
        mount.appendChild(codeBox(b.c, b.label));
      }
    }
  }

  function renderQuiz(quizBlock, mount, onAllCorrect) {
    const quiz = el("div","quiz panel tight");
    quiz.appendChild(el("h3", null, "⚔️ Trial Run"));
    quiz.appendChild(el("p","mut","Correct answers feed the XP cauldron once the full set passes."));
    let qStates = null;
    function done() {
      if (qStates.every(s => s.correct)) {
        onAllCorrect();
        const bar = el("div","quiz-passed","✔ Trial passed! Knowledge absorbed.");
        quiz.appendChild(bar);
      }
    }
    qStates = quizBlock.map((q, qi) => {
      const card = el("div","q-card");
      card.appendChild(Object.assign(el("p","q-text"), {}));
      card.lastChild.innerHTML = inlineMd((qi+1) + ") " + q.q);
      const opts = el("div","q-opts");
      const state = { correct:false, wrong:false };
      q.opts.forEach((opt, oi) => {
        const b = el("button","q-opt");
        b.innerHTML = inlineMd(opt);
        b.addEventListener("click", () => {
          if (state.correct) return;
          if (oi === q.a) {
            state.correct = true;
            [...opts.children].forEach(c => c.disabled = true);
            b.classList.add("correct");
            const ex = el("div","q-expl good");
            ex.innerHTML = inlineMd("✅ " + (q.e || ""));
            card.appendChild(ex);
            sfx.ok();
            done();
          } else {
            state.wrong = true;
            b.classList.add("wrong");
            b.disabled = true;
            if (!card.querySelector(".q-expl.bad")) {
              const ex = el("div","q-expl bad");
              ex.innerHTML = inlineMd("❌ Not that one. Try again — rethink the mechanic.");
              card.appendChild(ex);
            }
            sfx.err();
          }
        });
        opts.appendChild(b);
      });
      card.appendChild(opts);
      quiz.appendChild(card);
      return state;
    });
    mount.appendChild(quiz);
  }

  /**
   * Full lesson view renderer.
   * opts = { crumb, onComplete(lessonId), onNext, onPrev, nextTitle, prevTitle }
   */
  function renderLesson(lesson, mount, opts) {
    opts = opts || {};
    mount.innerHTML = "";
    const wrap = el("div","lesson");
    const isDone = !!save.lessons[lesson.id];

    if (opts.crumb) {
      const c = el("div","crumb", "⛏ " + opts.crumb + (isDone ? "   ✅ completed" : ""));
      wrap.appendChild(c);
    }
    wrap.appendChild(el("h1", null, lesson.title));

    const body = el("div");
    renderBlocks(lesson.blocks, body);
    wrap.appendChild(body);

    if (lesson.quiz && lesson.quiz.length) {
      let passedFirstTime = false;
      renderQuiz(lesson.quiz, wrap, () => {
        if (!isDone && !passedFirstTime) {
          passedFirstTime = true;
          if (opts.onComplete) opts.onComplete(lesson.id);
        }
      });
      const skip = el("p","skip-complete mut");
      skip.appendChild(el("a", null, "Mark lesson complete without quiz →"));
      skip.querySelector("a").href = "javascript:void(0)";
      skip.querySelector("a").addEventListener("click", () => {
        if (!isDone && opts.onComplete) opts.onComplete(lesson.id);
      });
      wrap.appendChild(skip);
    } else {
      // no quiz: complete via button
      const b = el("button","btn btn-grass","MARK COMPLETE");
      b.addEventListener("click", () => { if (!isDone && opts.onComplete) opts.onComplete(lesson.id); });
      wrap.appendChild(b);
    }

    // prev / next
    const nav = el("div","lesson-nav");
    if (opts.onPrev) {
      const prev = el("button","btn","◀ " + (opts.prevTitle || "previous"));
      prev.addEventListener("click", opts.onPrev);
      nav.appendChild(prev);
    } else {
      nav.appendChild(el("span"));
    }
    if (opts.onNext) {
      const next = el("button","btn btn-grass",(opts.nextTitle || "next") + " ▶");
      next.addEventListener("click", opts.onNext);
      nav.appendChild(next);
    } else {
      nav.appendChild(el("span"));
    }
    wrap.appendChild(nav);

    mount.appendChild(wrap);
  }

  /* ================= player panel (avatar modal) ================= */
  const ROUTE_COPY =
    "<p style=\"margin-top:8px\">1) Worlds 1–3 teach the language core (be honest with the quizzes — they re-lock nothing, but mastery compounds).&nbsp;" +
    " 2) Start the Workshop alongside World 4 (collections) — the tiers line up with what you've learned.&nbsp;" +
    " 3) Worlds 5–8 finish the language; take every “Open in Playground” detour.&nbsp;" +
    " 4) Pick one specialized track (UI / Database / Security) and finish its projects.&nbsp;" +
    " 5) Crack the Vault, then connect all three tracks for the <b style=\"color:var(--purp)\">Full Stack Wizard</b> advancement.</p>";
  let playerModal = null;
  function ensurePlayerModal() {
    if (playerModal) return playerModal;
    playerModal = document.createElement("div");
    playerModal.className = "modal-bg";
    playerModal.id = "player-modal";
    document.body.appendChild(playerModal);
    playerModal.addEventListener("click", e => { if (e.target === playerModal) closePlayer(); });
    return playerModal;
  }
  function renderPlayerPanel(modal) {
    const info = levelInfo();
    let totalL = 0, doneL = 0;
    if (typeof WORLDS !== "undefined") WORLDS.forEach(w => w.lessons.forEach(l => { totalL++; if (save.lessons[l.id]) doneL++; }));
    if (typeof TRACKS !== "undefined") TRACKS.forEach(t => t.lessons.forEach(l => { totalL++; if (save.lessons[l.id]) doneL++; }));
    const solvedP = Object.keys(save.problems).length;
    const achCount = Object.keys(save.ach).length;
    const totalP = (typeof PROBLEMS !== "undefined") ? PROBLEMS.length : 0;

    const m = document.createElement("div");
    m.className = "modal";
    m.innerHTML = "";

    const head = document.createElement("div");
    head.className = "modal-head";
    head.innerHTML =
      '<div class="avatar" style="width:64px;height:64px;font-size:2rem">⛏</div>' +
      '<div style="flex:1">' +
      '<h1 style="color:var(--gold)">PLAYER CARD</h1>' +
      '<div class="mut" id="pm-next"></div>' +
      '</div>';
    const x = document.createElement("button");
    x.className = "modal-x"; x.textContent = "✕ ESC";
    x.addEventListener("click", closePlayer);
    head.appendChild(x);
    m.appendChild(head);

    const bar = document.createElement("div");
    bar.className = "big-xp";
    bar.style.marginTop = "10px";
    const barFill = document.createElement("i");
    barFill.style.width = info.pct + "%";
    bar.appendChild(barFill);
    m.appendChild(bar);

    const stats = document.createElement("div");
    stats.className = "player-stats";
    stats.innerHTML =
      '<div class="pstat" style="color:var(--xp)">LEVEL <b id="pm-level"></b></div>' +
      '<div class="pstat" style="color:var(--leaf)">TITLE <b id="pm-title"></b></div>' +
      '<div class="pstat" style="color:var(--dia)">XP <b id="pm-xp"></b></div>' +
      '<div class="pstat" style="color:var(--gold)">LESSONS <b id="pm-lessons"></b></div>' +
      '<div class="pstat" style="color:var(--purp)">PROBLEMS <b id="pm-problems"></b></div>' +
      '<div class="pstat" style="color:var(--red)">ADVANCEMENTS <b id="pm-ach"></b></div>';
    m.appendChild(stats);

    const grid = document.createElement("div");
    grid.className = "grid g2";
    grid.style.marginTop = "18px";
    ACHIEVEMENTS.forEach(a => {
      const locked = !save.ach[a.id];
      const c = document.createElement("div");
      c.className = "ach" + (locked ? "" : " unlocked");
      c.innerHTML = '<div class="ai">' + a.icon + '</div><div><div class="at">' + esc(a.title) + '</div>' +
        '<div class="ad">' + esc(a.desc) + '</div></div>';
      grid.appendChild(c);
    });
    m.appendChild(grid);

    const route = document.createElement("div");
    route.className = "panel tight";
    route.style.marginTop = "16px";
    route.innerHTML = '<h3 style="color:var(--gold)">🗺️ RECOMMENDED ROUTE</h3>' + ROUTE_COPY;
    m.appendChild(route);

    const foot = document.createElement("div");
    foot.style.marginTop = "16px";
    foot.innerHTML =
      '<button class="btn btn-red" id="pm-reset">🗑 RESET WORLD (wipe all local progress)</button>' +
      ' <button class="btn" id="pm-close">CLOSE</button>';
    m.appendChild(foot);

    modal.innerHTML = "";
    modal.appendChild(m);

    document.getElementById("pm-level").textContent = "Lv." + info.lvl;
    document.getElementById("pm-title").textContent = info.title;
    document.getElementById("pm-xp").textContent = info.xp + " XP";
    document.getElementById("pm-next").textContent = (info.need - info.xp) + " XP to Lv." + (info.lvl + 1) +
      " — " + ACHIEVEMENTS.length + " advancements · " + totalP + " logic problems";
    document.getElementById("pm-lessons").textContent = doneL + "/" + totalL;
    document.getElementById("pm-problems").textContent = solvedP + "/" + totalP;
    document.getElementById("pm-ach").textContent = achCount + "/" + ACHIEVEMENTS.length;

    document.getElementById("pm-reset").addEventListener("click", () => {
      if (confirm("Wipe ALL local progress (XP, lessons, solved problems, advancements)?")) {
        localStorage.removeItem(SAVE_KEY);
        localStorage.removeItem("rustcraft_playground_draft");
        closePlayer();
        toast("World deleted. Reloading...", "red");
        setTimeout(() => location.reload(), 900);
      }
    });
    document.getElementById("pm-close").addEventListener("click", closePlayer);
  }
  function openPlayer() {
    const modal = ensurePlayerModal();
    renderPlayerPanel(modal);
    modal.classList.add("open");
    sfx.ok();
  }
  function closePlayer() {
    if (playerModal) playerModal.classList.remove("open");
  }
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closePlayer();
  });

  /* ================= HUD / nav / boot ================= */
  function updateHUD() {
    const info = levelInfo();
    const lv = document.getElementById("hud-lv");
    const fill = document.getElementById("hud-xpf");
    if (lv) lv.textContent = "Lv." + info.lvl + " · " + info.title;
    if (fill) fill.style.width = info.pct + "%";
  }
  function initNav(active) {
    const links = document.querySelectorAll(".hotbar a");
    let matched = false;
    links.forEach(a => {
      const page = (a.getAttribute("href") || "").replace(".html","").split("/").pop() || "index";
      a.classList.toggle("active", page === active);
      if (page === active) matched = true;
    });
    /* inject sun/moon + player buttons into every page's top bar */
    const actions = document.querySelector(".top-actions");
    if (actions) {
      const snd = document.getElementById("btn-sound");
      const themeBtn = document.createElement("button");
      themeBtn.id = "btn-theme";
      themeBtn.className = "btn-icon-pix";
      themeBtn.addEventListener("click", cycleTheme);
      actions.insertBefore(themeBtn, snd || null);
      const ava = document.createElement("button");
      ava.id = "btn-player";
      ava.className = "btn-avatar";
      ava.title = "Open player card";
      ava.setAttribute("aria-label", "Open player card");
      ava.innerHTML = '<i class="pix-face"></i>';
      ava.addEventListener("click", openPlayer);
      actions.insertBefore(ava, themeBtn);
    }
    const snd = document.getElementById("btn-sound");
    if (snd) {
      const sync = () => { snd.textContent = save.sound ? "🔊" : "🔇"; };
      sync();
      snd.addEventListener("click", () => {
        save.sound = !save.sound; persist(); sync();
        toast(save.sound ? "Sound ON — the server hums." : "Sound OFF — silent mining.", "");
        sfx.click();
      });
    }
    applyTheme();
    hookSystem();
    syncThemeButton();
    updateHUD();
  }
  function init() {
    const page = (document.body.getAttribute("data-page") || "index").replace(".html","");
    applyTheme();
    initNav(page);
    achCheck();
  }
  document.addEventListener("DOMContentLoaded", () => {
    init();
    document.addEventListener("click", e => {
      if (e.target.closest && e.target.closest(".btn, .btn-icon-pix, .btn-avatar, .tab-btn, .q-opt, .world-head, .rail-chip, .cb, .modal-x")) sfx.click();
    });
  });

  /* public API */
  return {
    save, persist, addXP, completeLesson, solveProblem, markPeeked,
    levelInfo, toast, achCheck, queuePop,
    ACHIEVEMENTS, renderLesson, renderBlocks, codeBox, code_fragment: codeBox,
    highlight, esc, inlineMd, el, copyText, playgroundURL,
    updateHUD, sfx,
    themePref, setTheme, cycleTheme, openPlayer, closePlayer,
  };
})();

/* tiny DOM helper used by page scripts */
const $id = (id) => document.getElementById(id);
