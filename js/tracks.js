/* tracks.js — specialized tracks: tab switching, lesson player, cyber tools */
"use strict";

(function () {

  /* ------------------ tabs + lesson rail ------------------ */
  let current = "ui";

  function chipLabel(t, l) {
    return RC.esc(l.title) + (RC.save.lessons[l.id] ? ' <span class="ok">✓</span>' : "");
  }

  function buildRail(t) {
    const rail = document.getElementById("track-rail");
    rail.innerHTML = "";
    t.lessons.forEach((l, i) => {
      const c = RC.el("button", "rail-chip" + (l.id === visibleLesson ? " active" : ""));
      c.innerHTML = "0" + (i + 1) + " · " + chipLabel(t, l);
      c.addEventListener("click", () => { visibleLesson = l.id; buildRail(t); buildBody(t); });
      rail.appendChild(c);
    });
  }

  let visibleLesson = null;

  function buildBody(t) {
    const body = document.getElementById("track-body");
    const lesson = t.lessons.find(l => l.id === visibleLesson) || t.lessons[0];
    visibleLesson = lesson.id;
    const idx = t.lessons.indexOf(lesson);
    RC.renderLesson(lesson, body, {
      crumb: t.icon + " " + t.name,
      prevTitle: t.lessons[idx - 1] ? t.lessons[idx - 1].title : null,
      nextTitle: t.lessons[idx + 1] ? t.lessons[idx + 1].title : null,
      onPrev: t.lessons[idx - 1] ? () => { visibleLesson = t.lessons[idx - 1].id; buildRail(t); buildBody(t); } : null,
      onNext: t.lessons[idx + 1] ? () => { visibleLesson = t.lessons[idx + 1].id; buildRail(t); buildBody(t); } : null,
      onComplete: (lid) => {
        RC.completeLesson(lid, lesson.title + " complete.");
        buildRail(t);
        updateTrackProgress(t);
      },
    });
  }

  function updateTrackProgress(t) {
    const done = t.lessons.filter(l => RC.save.lessons[l.id]).length;
    document.getElementById("track-count").textContent = done + "/" + t.lessons.length + " lessons";
    document.getElementById("track-fill").style.width = Math.round(done / t.lessons.length * 100) + "%";
  }

  function switchTab(tid) {
    current = tid;
    const t = TRACKS.find(x => x.id === tid);
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b.dataset.t === tid));
    document.getElementById("track-icon").textContent = t.icon;
    document.getElementById("track-name").textContent = t.name;
    document.getElementById("track-tag").textContent = t.tagline || t.desc || "";
    updateTrackProgress(t);
    visibleLesson = t.lessons.find(l => !RC.save.lessons[l.id]) ? t.lessons.find(l => !RC.save.lessons[l.id]).id : t.lessons[0].id;
    buildRail(t);
    buildBody(t);
    const tools = document.getElementById("sec-tools");
    if (tools) tools.style.display = tid === "sec" ? "block" : "none";
    location.hash = t.id;
  }

  /* ------------------ cyber tools ------------------ */
  const bytesToB64 = (bytes) => {
    let s = "";
    bytes.forEach(b => s += String.fromCharCode(b));
    return btoa(s);
  };
  const b64ToBytes = (str) => {
    const norm = str.trim().replace(/\s+/g, "");
    const bin = atob(norm);
    const out = [];
    for (let i = 0; i < bin.length; i++) out.push(bin.charCodeAt(i));
    return out;
  };

  function initTools() {
    /* base64 */
    const b64in = document.getElementById("b64-in");
    const b64out = document.getElementById("b64-out");
    document.getElementById("b64-dec").addEventListener("click", () => {
      try { b64out.textContent = new TextDecoder().decode(new Uint8Array(b64ToBytes(b64in.value))); }
      catch (e) { b64out.textContent = "⛔ not valid base64: " + e.message; }
    });
    document.getElementById("b64-enc").addEventListener("click", () => {
      try { b64out.textContent = bytesToB64(Array.from(new TextEncoder().encode(b64in.value))); }
      catch (e) { b64out.textContent = "⛔ " + e.message; }
    });

    /* caesar */
    const cin = document.getElementById("caesar-in");
    const cshift = document.getElementById("caesar-shift");
    const cout = document.getElementById("caesar-out");
    function caesarApply() {
      const s = parseInt(cshift.value || "0", 10) || 0;
      const label = document.getElementById("caesar-shift-n");
      if (label) label.textContent = String(s);
      cout.textContent = cin.value.replace(/[a-zA-Z]/g, ch => {
        const base = ch <= "Z" ? 65 : 97;
        return String.fromCharCode((ch.charCodeAt(0) - base + s + 26 * 4) % 26 + base);
      });
    }
    cin.addEventListener("input", caesarApply);
    cshift.addEventListener("input", caesarApply);
    caesarApply();

    /* hex */
    const hexin = document.getElementById("hex-in");
    const hexout = document.getElementById("hex-out");
    document.getElementById("hex-dec").addEventListener("click", () => {
      try {
        hexout.textContent = /[^0-9a-fA-F\s]/.test(hexin.value)
          ? "⛔ hex only, please (0-9 a-f)"
          : hexin.value.trim().split(/\s+/).filter(Boolean).map(h => String.fromCharCode(parseInt(h, 16))).join("");
      } catch (e) { hexout.textContent = "⛔ " + e.message; }
    });
    document.getElementById("hex-enc").addEventListener("click", () => {
      hexout.textContent = Array.from(new TextEncoder().encode(hexin.value))
        .map(b => b.toString(16).padStart(2, "0")).join(" ");
    });

    /* xor brute */
    const xorin = document.getElementById("xor-in");
    const xorout = document.getElementById("xor-out");
    document.getElementById("xor-run").addEventListener("click", () => {
      const raw = Array.from(new TextEncoder().encode(xorin.value.trim()));
      const scores = [];
      for (let k = 0; k <= 255; k++) {
        let s = 0;
        const txt = raw.map(b => String.fromCharCode(b ^ k));
        txt.forEach(c => { if (/[a-zA-Z0-9 \n]/.test(c)) s++; });
        scores.push({ k, s, txt: txt.join("") });
      }
      scores.sort((a, b) => b.s - a.s);
      xorout.textContent = scores.slice(0, 5)
        .map(x => "key 0x" + x.k.toString(16).padStart(2, "0") + " (" + x.s + "/" + raw.length + " printable): " + x.txt.slice(0, 90))
        .join("\n");
    });
  }

  /* ------------------ challenge locks ------------------ */
  function initChallenges() {
    const zone = document.getElementById("challenge-zone");
    if (!zone) return;
    for (const ch of SEC_CHALLENGES) {
      const card = RC.el("div", "card challenge");
      card.style.marginBottom = "12px";
      const h = RC.el("h3", null, "🔒 " + ch.title);
      const enc = RC.el("div", "out", ch.encoded);
      const hint = RC.el("p", "mut", "💡 " + ch.hint);
      const row = RC.el("div", "tool-row");
      const input = RC.el("input");
      input.type = "text";
      input.placeholder = "decoded key...";
      input.style.flex = "1";
      const btn = RC.el("button", "btn btn-small", "UNLOCK");
      row.appendChild(input); row.appendChild(btn);
      const status = RC.el("span", "mut", RC.save.challenges[ch.id] ? " unlocked ✓ " : "");
      if (RC.save.challenges[ch.id]) { card.style.borderColor = "#2c5d14"; input.value = ch.answer; input.disabled = true; btn.disabled = true; }
      btn.addEventListener("click", () => {
        const guess = input.value.trim().toLowerCase();
        if (guess === ch.answer.toLowerCase()) {
          if (!RC.save.challenges[ch.id]) {
            RC.save.challenges[ch.id] = true;
            RC.save.lessons["sec-chal-" + ch.id] = Date.now();
            RC.persist();
            RC.addXP(15, "🔓 " + ch.title + " unlocked!");
            card.style.borderColor = "#2c5d14";
            status.textContent = " unlocked ✓ ";
            input.disabled = true; btn.disabled = true;
            checkAll();
          } else {
            RC.toast("Already unlocked.", "green");
          }
        } else {
          RC.sfx.err();
          RC.toast("🔒 Still locked. Wrong key.", "red");
        }
      });
      card.appendChild(h); card.appendChild(enc); card.appendChild(hint); card.appendChild(row); card.appendChild(status);
      zone.appendChild(card);
    }
    function checkAll() {
      if (SEC_CHALLENGES.every(c => RC.save.challenges[c.id])) {
        setTimeout(() => RC.toast('🏆 THE VAULT IS YOURS. "rustcraft flag{craft_not_war}"', "green"), 900);
      }
    }
  }

  /* ------------------ boot ------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".tab-btn");
    tabs.forEach(b => b.addEventListener("click", () => switchTab(b.dataset.t)));

    const initial = (location.hash || "").replace(/^#/, "");
    const valid = TRACKS.some(t => t.id === initial);
    switchTab(valid ? initial : "ui");

    initTools();
    initChallenges();
  });
})();
