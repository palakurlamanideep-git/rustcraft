/* learn.js — world map + lesson player */
"use strict";

(function () {

  /* flat lesson order for prev/next */
  const FLAT = allLessons(); // [{world, lesson}]

  /* ------------------ sidebar ------------------ */
  function buildSidebar() {
    const sb = document.querySelector(".sidebar");
    sb.innerHTML = "";
    sb.appendChild(RC.el("div", "sb-label", "⛏ WORLD MAP"));

    const filter = document.createElement("input");
    filter.type = "search";
    filter.placeholder = "🔍 filter lessons...";
    filter.style.width = "100%";
    filter.addEventListener("input", () => {
      const q = filter.value.trim().toLowerCase();
      document.querySelectorAll(".l-btn").forEach(b => {
        b.style.display = !q || b.textContent.toLowerCase().includes(q) ? "flex" : "none";
      });
      document.querySelectorAll(".world-group").forEach(g => {
        const visible = [...g.querySelectorAll(".l-btn")].some(b => b.style.display !== "none");
        g.style.display = visible || !q ? "block" : "none";
      });
    });
    const fc = RC.el("div");
    fc.style.marginBottom = "10px";
    fc.appendChild(filter);
    sb.appendChild(fc);

    for (const w of WORLDS) {
      const prog = w.lessons.filter(l => RC.save.lessons[l.id]).length;
      const g = RC.el("div", "world-group");
      const head = RC.el("div", "world-head");
      head.innerHTML =
        '<span class="wi">' + w.icon + '</span>' +
        '<span class="wt">' + RC.esc(w.name) + '<br><span class="mut">' + prog + '/' + w.lessons.length + '</span></span>' +
        '<span class="arrow">▶</span>';
      if (prog === w.lessons.length) head.querySelector(".wt").innerHTML += ' <span style="color:var(--grass2)">✓</span>';
      head.addEventListener("click", () => g.classList.toggle("open"));
      g.appendChild(head);

      const list = RC.el("div", "world-lessons");
      w.lessons.forEach((l, i) => {
        const b = RC.el("button", "l-btn", "");
        b.dataset.id = l.id;
        b.innerHTML = '<span class="ln">' + String(i + 1).padStart(2, "0") + '</span><span>' + RC.esc(l.title) + '</span>' +
          (RC.save.lessons[l.id] ? '<span class="done">✅</span>' : '');
        b.addEventListener("click", () => { location.hash = "#" + l.id; });
        list.appendChild(b);
      });
      g.appendChild(list);
      sb.appendChild(g);
    }
  }

  function refreshSidebarMarks() {
    document.querySelectorAll(".l-btn").forEach(b => {
      const id = b.dataset.id;
      const has = b.querySelector(".done");
      if (RC.save.lessons[id] && !has) {
        const d = RC.el("span", "done", "✅");
        b.appendChild(d);
      }
      if (!RC.save.lessons[id] && has) has.remove();
    });
    // update counts
    for (const w of WORLDS) {
      const prog = w.lessons.filter(l => RC.save.lessons[l.id]).length;
      document.querySelectorAll(".world-head").forEach(h => {
        if (h.textContent.includes(w.name) || h.querySelector(".wt").textContent.split("<br")[0].includes(w.name)) {
          const c = h.querySelector(".wt .mut");
          if (c) c.textContent = prog + "/" + w.lessons.length;
        }
      });
    }
  }

  /* ------------------ lesson rendering ------------------ */
  function findLesson(id) {
    const i = FLAT.findIndex(x => x.lesson.id === id);
    return i < 0 ? null : { i, ...FLAT[i] };
  }

  function render(id) {
    const mount = document.getElementById("lesson-mount");
    const target = id ? findLesson(id) : FLAT[0];
    if (!target) { mount.innerHTML = "<p>Lesson vanished into the void. Pick one from the world map.</p>"; return; }

    location.hash = "#" + target.lesson.id; // normalize
    RC.save.last = target.lesson.id;
    RC.persist();

    const idx = target.i;
    const prev = FLAT[idx - 1], next = FLAT[idx + 1];

    RC.renderLesson(target.lesson, mount, {
      crumb: target.world.icon + " " + target.world.name,
      prevTitle: prev ? prev.lesson.title : null,
      nextTitle: next ? next.lesson.title : null,
      onPrev: prev ? () => { location.hash = "#" + prev.lesson.id; } : null,
      onNext: next ? () => { location.hash = "#" + next.lesson.id; } : null,
      onComplete: (lid) => {
        RC.completeLesson(lid, target.lesson.title + " complete.");
        refreshSidebarMarks();
      },
    });
    // mark sidebar active
    document.querySelectorAll(".l-btn").forEach(b => b.classList.toggle("active", b.dataset.id === target.lesson.id));
    const activeBtn = document.querySelector('.l-btn[data-id="' + target.lesson.id + '"]');
    if (activeBtn) {
      const group = activeBtn.closest(".world-group");
      if (group) group.classList.add("open");
      if (group && group.getBoundingClientRect().top > window.innerHeight) group.scrollIntoView();
    }
    window.scrollTo({ top: 0 });
  }

  function onHash() {
    const id = decodeURIComponent((location.hash || "").replace(/^#/, ""));
    if (id) render(id);
  }

  /* continue card */
  function initContinue() {
    const card = document.getElementById("continue-card");
    if (!card) return;
    const done = FLAT.filter(x => RC.save.lessons[x.lesson.id]).length;
    const total = FLAT.length;
    const target = RC.save.last ? findLesson(RC.save.last) : null;
    const nextTarget = target && !RC.save.lessons[target.lesson.id] ? target : (FLAT[done] || FLAT[0]);
    card.querySelector("#continue-text").textContent =
      done === 0 ? "Your journey starts in the Plains biome. Grow your first Rust block!" :
        done === total ? "All worlds cleared, legend. Revisit anything or head to the Workshop." :
          "You have cleared " + done + " of " + total + " lessons. Continue from: " + nextTarget.lesson.title;
    const btn = card.querySelector("#continue-btn");
    btn.textContent = done === 0 ? "START WORLD 1" : done === total ? "WORKSHOP ▶" : "CONTINUE ▶";
    btn.addEventListener("click", () => {
      location.hash = "#" + nextTarget.lesson.id;
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    buildSidebar();
    initContinue();
    const initial = decodeURIComponent((location.hash || "").replace(/^#/, ""));
    if (initial && findLesson(initial)) render(initial);
    else render(FLAT[0].lesson.id);
    window.addEventListener("hashchange", onHash);
    document.getElementById("total-lessons").textContent = FLAT.length;
  });
})();
