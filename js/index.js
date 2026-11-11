/* index.js — home page: world grid + track grid.
   Player stats / advancements / route live in the player-card modal
   (injected by main.js from the ⛏ button in the top bar). */
"use strict";

(function () {

  function xpBar(pct) {
    return '<div class="xpbar"><i style="width:' + pct + '%"></i></div>';
  }

  document.addEventListener("DOMContentLoaded", () => {

    /* ---------- worlds grid ---------- */
    const wg = document.getElementById("world-grid");
    if (wg) {
      WORLDS.forEach((w, wi) => {
        const done = w.lessons.filter(l => RC.save.lessons[l.id]).length;
        const pct = Math.round(done / w.lessons.length * 100);
        const c = RC.el("a", "card world");
        c.href = "learn.html#" + w.lessons[Math.min(done, w.lessons.length - 1)].id;
        c.innerHTML =
          '<div class="prob-top"><span class="wi" style="font-size:1.8rem">' + w.icon + '</span>' +
          '<span class="tag" style="border-color:' + w.accent + ';color:' + w.accent + '">WORLD ' + (wi + 1) + '</span></div>' +
          '<h3>' + RC.esc(w.name) + '</h3>' +
          '<p class="mut">' + RC.esc(w.desc) + '</p>' +
          xpBar(pct) +
          '<div class="stat">' + done + '/' + w.lessons.length + ' lessons · ' + pct + '%</div>';
        wg.appendChild(c);
      });
    }

    /* ---------- tracks ---------- */
    const tg = document.getElementById("track-grid");
    if (tg) {
      TRACKS.forEach(t => {
        const done = t.lessons.filter(l => RC.save.lessons[l.id]).length;
        const pct = Math.round(done / t.lessons.length * 100);
        const c = RC.el("a", "card world");
        c.href = "tracks.html#" + t.id;
        c.innerHTML =
          '<div class="prob-top"><span class="wi" style="font-size:1.8rem">' + t.icon + '</span>' +
          '<span class="tag">TRACK</span></div>' +
          '<h3>' + RC.esc(t.name) + '</h3>' +
          '<p class="mut">' + RC.esc((t.tagline || t.desc || "").slice(0, 130)) + '</p>' +
          xpBar(pct) +
          '<div class="stat">' + done + '/' + t.lessons.length + ' lessons</div>';
        tg.appendChild(c);
      });
    }
  });
})();
