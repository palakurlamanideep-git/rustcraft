/* practice.js — the workshop: problem grid + detail modal */
"use strict";

(function () {

  const state = { tier: "all", status: "all", q: "" };

  function hearts(h) {
    return "❤".repeat(h) + '<span class="off">' + "❤".repeat(Math.max(0, 6 - h)) + "</span>";
  }

  function buildGrid() {
    const grid = document.getElementById("prob-grid");
    grid.innerHTML = "";
    let shown = 0;
    for (const p of PROBLEMS) {
      if (state.tier !== "all" && p.tier !== state.tier) continue;
      const solved = !!RC.save.problems[p.id];
      if (state.status === "todo" && solved) continue;
      if (state.status === "solved" && !solved) continue;
      if (state.q && !(p.title.toLowerCase().includes(state.q) || p.tags.join(" ").toLowerCase().includes(state.q))) continue;
      shown++;

      const c = RC.el("div", "card prob-card slot" + (solved ? " solved" : ""));
      c.innerHTML =
        '<div class="prob-top"><span class="tier t-' + p.tier + '">' + TIER_LABEL[p.tier] + '</span><span class="hearts">' + hearts(p.hearts) + '</span></div>' +
        '<h3>' + RC.esc(p.title) + '</h3>' +
        '<p>' + RC.esc(p.story.replace(/\s+/g, " ").slice(1, 150)).trim() + String(p.story.length > 150 ? "…" : "") + '</p>' +
        '<div class="ptags">' + p.tags.map(t => '<span class="tag">' + RC.esc(t) + '</span>').join("") + '</div>' +
        (solved ? '<span class="badge-done" style="margin-top:10px">✔ SOLVED</span>' : '');
      c.addEventListener("click", () => openProblem(p.id));
      grid.appendChild(c);
    }
    if (shown === 0) {
      grid.appendChild(RC.el("p", "mut", "No matching quests. Adjust your filters, miner."));
    }
    document.getElementById("shown-count").textContent = shown + "/" + PROBLEMS.length;
  }

  /* ------------------ modal ------------------ */
  let hintIndex = 0;

  function openProblem(id) {
    const p = problemById(id);
    if (!p) return;
    hintIndex = 0;
    const m = document.getElementById("prob-modal");
    m.classList.add("open");
    const body = m.querySelector(".modal-body");

    const head = m.querySelector(".modal-head");
    head.innerHTML = "";
    const tier = RC.el("span", "tier t-" + p.tier, TIER_LABEL[p.tier]);
    const h = RC.el("h1", null, p.title + "  ");
    head.appendChild(h);
    head.appendChild(tier);
    head.appendChild(RC.el("span", "hearts", " " + hearts(p.hearts)));
    const x = RC.el("button", "modal-x", "✕");
    x.addEventListener("click", closeModal);
    head.appendChild(x);

    body.innerHTML = "";
    body.appendChild(RC.el("div", "story", "📖 " + RC.esc(p.story.replace(/\s+/g, " ").trim())));

    // spec
    const spec = RC.el("div", "spec");
    spec.appendChild(RC.el("h4", null, "QUEST BRIEF"));
    const sp = RC.el("p");
    sp.innerHTML = RC.inlineMd(p.spec);
    spec.appendChild(sp);
    if (p.io && p.io.length) {
      const table = RC.el("table");
      const trh = RC.el("tr");
      const t1 = RC.el("th", null, "CALL");
      const t2 = RC.el("th", null, "RESULT");
      trh.appendChild(t1); trh.appendChild(t2);
      table.appendChild(trh);
      for (const [inp, out] of p.io) {
        const tr = RC.el("tr");
        const a = RC.el("td", null, "x"); a.innerHTML = RC.esc(inp).replace(/`([^`]+)`/g, "<code>$1</code>");
        const b = RC.el("td", null, "x"); b.innerHTML = RC.esc(out).replace(/`([^`]+)`/g, "<code>$1</code>");
        tr.appendChild(a); tr.appendChild(b);
        table.appendChild(tr);
      }
      spec.appendChild(table);
    }
    body.appendChild(spec);

    // actions row
    const acts = RC.el("div", "pg-bar");
    const copy = RC.el("button", "btn", "📋 COPY STARTER CODE");
    copy.addEventListener("click", () => RC.copyText(p.starter, "Starter code copied!"));
    const pg = RC.el("button", "btn btn-grass", "▶ TRY IN PLAYGROUND");
    pg.addEventListener("click", () => window.open(RC.playgroundURL(p.starter), "_blank"));
    acts.appendChild(copy); acts.appendChild(pg);
    body.appendChild(acts);

    // starter code
    body.appendChild(RC.codeBox(p.starter, "starter — paste into src/main.rs"));

    // hints
    if (p.hints && p.hints.length) {
      const hz = RC.el("div");
      hz.appendChild(RC.el("h4", null, "HINTS (torch by torch)"));
      const hbtn = RC.el("button", "btn btn-small", "🕯️ REVEAL NEXT HINT (0/" + p.hints.length + ")");
      const hintz = RC.el("div");
      hbtn.addEventListener("click", () => {
        if (hintIndex >= p.hints.length) { toastNow("All hints lit."); return; }
        const h = RC.el("div", "hint");
        h.innerHTML = '<span class="hl">HINT ' + (hintIndex + 1) + '</span><br>' + RC.inlineMd(p.hints[hintIndex]);
        hintz.appendChild(h);
        hintIndex++;
        hbtn.textContent = hintIndex >= p.hints.length ? "🕯️ ALL HINTS REVEALED" : "🕯️ REVEAL NEXT HINT (" + hintIndex + "/" + p.hints.length + ")";
        if (hintIndex >= p.hints.length) hbtn.disabled = true;
        toastNow("Hint revealed.", "");
      });
      hz.appendChild(hbtn);
      hz.appendChild(hintz);
      body.appendChild(hz);
    }

    // solution
    const sol = RC.el("details", "sol");
    const sum = RC.el("summary", null, "🕳️ DEEP CHEST — REVEAL FULL SOLUTION");
    sol.appendChild(sum);
    sol.addEventListener("toggle", () => { if (sol.open && !RC.save.problems[p.id]) RC.markPeeked(p.id); });
    const sw = RC.el("div", "solwrap");
    sw.appendChild(RC.codeBox(p.solution, "reference solution"));
    sol.appendChild(sw);
    body.appendChild(sol);

    // mark solved
    const solvedZone = RC.el("div", "center");
    solvedZone.style.marginTop = "18px";
    if (RC.save.problems[p.id]) {
      solvedZone.appendChild(RC.el("div", "quiz-passed center", "✔ Already solved — the counter remembers."));
    } else {
      const doneBtn = RC.el("button", "btn btn-grass", "🏁 MARK AS SOLVED (+" + (TIER_XP[p.tier] || 20) + " XP)");
      doneBtn.addEventListener("click", () => {
        RC.solveProblem(p.id);
        closeModal();
        buildGrid();
        toastNow("Flag planted. Try the next tier!", "green");
      });
      solvedZone.appendChild(doneBtn);
      solvedZone.appendChild(RC.el("p", "mut", "Honor system: only after your version really works. The playground will confirm."));
    }
    body.appendChild(solvedZone);
  }

  function toastNow(msg, kind) { RC.toast(msg, kind || ""); }

  function closeModal() {
    document.getElementById("prob-modal").classList.remove("open");
  }

  /* ------------------ init ------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    buildGrid();

    document.getElementById("f-tier").addEventListener("change", e => { state.tier = e.target.value; buildGrid(); });
    document.getElementById("f-status").addEventListener("change", e => { state.status = e.target.value; buildGrid(); });
    document.getElementById("f-search").addEventListener("input", e => { state.q = e.target.value.trim().toLowerCase(); buildGrid(); });

    document.getElementById("prob-modal").addEventListener("click", e => {
      if (e.target.id === "prob-modal") closeModal();
    });
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

    document.getElementById("solved-count").textContent =
      Object.keys(RC.save.problems).length + "/" + PROBLEMS.length;
    document.getElementById("tier-xp-note").textContent =
      "XP per tier: Wood 15 · Stone 25 · Iron 35 · Gold 50 · Diamond 70 · Netherite 100";
  });
})();
