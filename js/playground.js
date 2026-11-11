/* playground.js — draft editor + Rust Playground launcher */
"use strict";

(function () {

  const DRAFT_KEY = "rustcraft_playground_draft";

  const SNIPPETS = [
    { name: "Hello, Crafter!", code:
`fn main() {
    println!("Hello, Crafter!");
    let mut slots: Vec<&str> = vec!["sword", "torch", "steak"];
    slots.push("compass");
    println!("hotbar: {:?}", slots);
}` },
    { name: "Ownership Demo", code:
`fn consume(s: String) {
    println!("now owned by fn: {}", s);
} // 's' is dropped here

fn main() {
    let a = String::from("diamond");
    let b = a; // move!
    // println!("{}", a);  // <- works only when commented out
    consume(b);
    let healed = String::from("golden apple");
    let healed2 = healed.clone(); // deep copy
    println!("{} {}", healed, healed2);
}` },
    { name: "Structs & Traits", code:
`trait Furnace {
    fn smelt(&self) -> u16;
}

struct Blast { temp: u16 }
impl Furnace for Blast {
    fn smelt(&self) -> u16 { self.temp * 2 }
}

fn main() {
    let blast = Blast { temp: 100 };
    println!("yields {} ingots", blast.smelt());
    let furnaces: Vec<Box<dyn Furnace>> = vec![Box::new(blast), Box::new(Blast { temp: 50 })];
    for f in furnaces { println!("dyn: {}", f.smelt()); }
}` },
    { name: "Threads & Channel", code:
`use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    for i in 0..4 {
        let tx = tx.clone();
        thread::spawn(move || {
            tx.send(format!("mob #{} spawned", i)).unwrap();
        });
    }
    drop(tx);
    for msg in rx {
        println!("{}", msg);
    }
}` },
    { name: "Mini FizzBuzz (Creeper/TNT)", code:
`fn main() {
    for n in 1..=20 {
        let say = if n % 15 == 0 { "BOOM" }
            else if n % 3 == 0 { "Creeper" }
            else if n % 5 == 0 { "TNT" }
            else { "?" };
        if say == "?" { println!("{}", n); } else { println!("{}", say); }
    }
}` },
    { name: "Iterators Gauntlet", code:
`fn main() {
    let ore = vec![4_u32, 8, 15, 16, 23, 42];
    let evens_sq: Vec<u32> = ore.iter().filter(|&&n| n % 2 == 0).map(|&n| n * n).collect();
    let total: u32 = ore.iter().sum();
    let maxv = ore.iter().max();
    println!("evens squared: {:?}", evens_sq);
    println!("total: {}, max: {:?}", total, maxv);
    let words = ["creeper", "tnt", "redstone"];
    let shout: String = words.iter().map(|w| w.to_uppercase()).collect::<Vec<_>>().join("!");
    println!("{}", shout);
}` },
  ];

  let editor, results;

  function setCode(code) {
    editor.value = code;
    saveDraft();
  }

  function saveDraft() {
    try { localStorage.setItem(DRAFT_KEY, editor.value); } catch (e) {}
    const d = document.getElementById("pg-save-note");
    d.textContent = "draft saved " + new Date().toLocaleTimeString();
  }

  function openPlayground(code) {
    window.open(RC.playgroundURL(code), "_blank");
  }

  document.addEventListener("DOMContentLoaded", () => {
    editor = document.getElementById("pg-editor");
    results = document.getElementById("pg-side");

    // load draft or default
    let draft = null;
    try { draft = localStorage.getItem(DRAFT_KEY); } catch (e) {}
    editor.value = draft || SNIPPETS[0].code;

    // snippet list
    for (const sn of SNIPPETS) {
      const b = RC.el("button", "snip", "🧱 " + sn.name);
      b.addEventListener("click", () => { setCode(sn.code); RC.toast("Loaded: " + sn.name); });
      results.appendChild(b);
    }

    const info = RC.el("div", "panel tight pg-side");
    info.style.marginTop = "14px";
    info.innerHTML =
      '<h4 style="margin-bottom:8px">HOW THE AETHER WORKS</h4>' +
      '<p style="font-size:1.15rem" class="mut">This realm sends your code to the official <b style="color:var(--txt)">Rust Playground</b> (play.rust-lang.org) in a new tab, pre-filled and ready to run. Nothing is uploaded to a server beyond the playground itself.</p>' +
      '<p style="font-size:1.15rem" class="mut">Keyboard: <span class="kbd">CTRL</span>+<span class="kbd">ENTER</span> = run.</p>';
    results.appendChild(info);

    // toolbar
    document.getElementById("pg-run").addEventListener("click", () => {
      openPlayground(editor.value);
      RC.toast("Portal opened — press RUN on the playground.", "green");
    });
    document.getElementById("pg-copy").addEventListener("click", () => RC.copyText(editor.value, "Full draft copied."));
    document.getElementById("pg-clear").addEventListener("click", () => {
      if (confirm("Clear the whole draft?")) { setCode(""); editor.focus(); }
    });

    editor.addEventListener("keydown", e => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        openPlayground(editor.value);
        RC.toast("Portal opened.", "green");
      }
      if (e.key === "Tab") {
        e.preventDefault();
        const s = editor.selectionStart, epos = editor.selectionEnd;
        editor.value = editor.value.slice(0, s) + "    " + editor.value.slice(epos);
        editor.selectionStart = editor.selectionEnd = s + 4;
      }
    });

    let t = null;
    editor.addEventListener("input", () => {
      clearTimeout(t);
      t = setTimeout(saveDraft, 500);
    });
    document.getElementById("pg-save-note").textContent = draft ? "draft loaded from last session" : "drafting...";
  });
})();
