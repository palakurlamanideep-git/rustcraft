/* ============================================================
   RUSTCRAFT — Core curriculum data (Worlds 1-8)
   Lesson block types: text, code, note | warn | tip, list
   ============================================================ */
"use strict";

const LEVEL_ORDER = ["basics","ownership","structures","collections","errors","traits","advanced","mastery"];

const WORLDS = [
  /* ================= WORLD 1 — PLAINS ================= */
  {
    id:"basics", name:"Plains — Rust Basics", icon:"🌱", accent:"#7dbc2e",
    desc:"Wake up in the safest world in gaming: variables, types, functions and control flow.",
    lessons:[
      {
        id:"bas-1", title:"Hello, Crafter!",
        blocks:[
          {t:"text", c:"Welcome to Rust, the memory-safe systems language with no garbage collector. It wins the same fight Minecraft wins: crash-free survival. In Minecraft a creeper explosion levelled your base? Recover with a bed. In C a stray pointer corrupted your memory at 3AM? There is no bed." },
          {t:"text", c:"Rust compiles your entire game world (memory usage) to a machine-checked rulebook before you can even press Play. If it compiles, entire bug classes — use-after-free, data races, buffer overflows — are already eliminated." },
          {t:"text", c:"Create your world (project) with the package manager, then run it:" },
          {t:"code", label:"terminal", c:`cargo new my_world\ncd my_world\ncargo run`},
          {t:"text", c:`\`cargo new\` generates \`\`src/main.rs\`\` with one main function — the spawn point of every Rust program. \`rust-analyzer\`, the IDE extension, draws a red line under every mistake long before you press run.`},
          {t:"code", label:"src/main.rs", c:`fn main() {
    // Text goes in double quotes, like signs in-game.
    println!("Hello, Crafter!");
    println!("I chose {} hearts of damage", 10);
}`},
          {t:"note", c:`\`{}\` inside \`\`println!\`\` is a placeholder — Rust fills it from the values you pass. This is not string formatting by faith; it is checked at compile time.`},
        ],
        quiz:[
          {q:"Which command both creates a fresh Rust project and initializes a Cargo package?",
           opts:["cargo build","cargo new","cargo run","rust forge"], a:1,
           e:"cargo new creates the project folder, adds Cargo.toml, and inits git. cargo build/run act on an existing project."},
          {q:"What does `cargo run` do?",
           opts:["Only downloads crates","Only type-checks without producing a binary","Compiles the crate and then executes the resulting binary","Publishes your code to crates.io"], a:2,
           e:"cargo run = cargo build + execute ./target/debug/<crate-name>."},
        ]
      },
      {
        id:"bas-2", title:"Blocks & Buckets — Variables and Mutability",
        blocks:[
          {t:"text", c:`In Minecraft, placing a water bucket changes the world. In Rust, nothing changes unless you say \`mut\`. A \`let\` binding is a placed block: fixed, until you claim it differently.`},
          {t:"code", c:`fn main() {
    let health = 20;        // bound once, immutable by default
    let mut hunger = 20;    // 'mut' = can be changed later
    hunger = 17;
    // health = 19;        // <-- ERROR: cannot assign twice to immutable
    println!("hp={} hunger={}", health, hunger);
}`},
          {t:"text", c:`Why immutable by default? The Rust team bolted from C++'s 'everything can secretly change' philosophy. Defaulting to fixed blocks makes reasoning about your world — and letting other players borrow from it — dramatically safer.`},
          {t:"text", c:`***Shadowing***: you may reuse a name. The new binding completely replaces the old one — like building over an old block, the past stays beneath.`},
          {t:"code", c:`let blocks = 5;
let blocks = blocks * 2;        // now 10
let blocks = blocks.to_string(); // now "10" — even the TYPE may change
println!("{} x", blocks);`},
          {t:"text", c:`Constants are carved in obsidian: \`const MAX_STACK: i32 = 64;\` — the type must be written, the value must be computable at compile time, and it lives for the whole program. \`static\` is similar with a fixed memory address.`},
          {t:"note", icon:"💡", c:"Shadowing is not mutability. With shadowing you create a NEW binding (may even change type). With mut you mutate the same old binding (type fixed forever)."},
        ],
        quiz:[
          {q:"What keyword makes a variable changeable after binding?",
           opts:["const","static","mut","let"], a:2,
           e:"`let mut x = ...` allows re-assignment; plain `let` is immutable."},
          {q:"What's TRUE about shadowing?",
           opts:["It is only allowed with `mut`","It can change the variable's type","It mutates the original value in place","It only works for numbers"], a:1,
           e:"Shadowing rebinds the name; the new binding may have a different type entirely."},
        ]
      },
      {
        id:"bas-3", title:"Block Types — Data Types",
        blocks:[
          {t:"text", c:"Rust is statically typed: every block has a size the compiler knows exactly. Nothing is 'maybe 8 bytes, maybe 16'. The compiler can almost always infer types — you annotate them only when useful."},
          {t:"list", items:[
            "**Integers** — signed `i8 i16 i32 i64 i128 isize`, unsigned `u8 u16 u32 u64 u128 usize` (default `i32`). Like stack sizes: `u8` max 255 items.",
            "**Floats** — `f32`, `f64` (default `f64`).",
            "**bool** — `true`/`false`. **char** — one Unicode char, single quotes: `'A'`, `'™'`.",
            "**Tuple** — fixed mixed collection: `(i32, f64)`.",
            "**Array** — fixed-length, same type: `[i32; 5]` — sized at compile time, lives on the stack.",
          ]},
          {t:"code", c:`fn main() {
    let stacks: u8 = 27;          // u8 holds 0..=255
    let speed: f64 = 3.5;
    let key: char = 'x';
    let spawn = (0, 3.5, 'x');    // tuple of (i32, f64, char)
    let row: [i32; 3] = [1, 2, 3];
    let (x, y, z) = spawn;        // destructuring a tuple
    println!("{} {} {} {:?}", x, y, key, row);
}`},
          {t:"code", c:`// Fixed-size arrays know their length... and it is part of the type:
let hotbar: [char; 9] = ['a','b','c','d','e','f','g','h','i'];
println!("slots = {}", hotbar.len());

// Overflow behaves differently in debug vs release builds:
let mut n: u8 = 250;
// n += 10; // debug build: PANIC. release build: wraps to 4.
let n = n.wrapping_add(10); // ALWAYS wraps (250 + 10 = 4)`},
          {t:"note", icon:"⚠️", c:"Integer overflow panics in debug builds (visible bug early) and wraps in release (fast). Prefer explicit methods: wrapping_add, checked_add (returns Option), saturating_add."},
        ],
        quiz:[
          {q:"What is the type of `let x = (1, 3.5, 'a');`?",
           opts:["[i32; 3]","(i32, f64, char)","(i32, i32, i32)","Vec<char>"], a:1,
           e:"A tuple with an integer, float and char: (i32, f64, char)."},
          {q:"`let a: u8 = 255; let b = a.wrapping_add(1);` — what is b?",
           opts:["0","256","panics","-1"], a:0,
           e:"u8 wraps around: 255 + 1 = 0. wrapping_add never panics."},
        ]
      },
      {
        id:"bas-4", title:"Villager Trades — Functions",
        blocks:[
          {t:"text", c:"Functions are villager trades: you hand over inputs (arguments), receive goods (return value). Rust declares with `fn` and the community names them with snake_case."},
          {t:"code", c:`fn craft_pickup(steps: i32) -> i32 {
    steps * 2                     // expression = return value
}

fn main() {
    let doubled = craft_pickup(5);
    println!("{} planks", doubled);
}`},
          {t:"warn", c:"Names must be plain identifiers: `craft_pickup` is valid, but a spaced name (like writing fn craft pickup) is a compile error. Also rustfmt enforces snake_case for functions."},
          {t:"text", c:"The return type comes after an arrow `->`. The last expression of the function body is returned automatically if it has NO semicolon. A line ending in `;` becomes a statement — it returns the unit type `()` (Rust's empty hand)."},
          {t:"code", c:`fn is_solid(b: char) -> bool {
    if b == '#' { true } else { false }   // no semicolons -> returned
}

fn shout(msg: &str) {
    println!("{}!!!", msg);               // returns () — empty trade
}`},
          {t:"list", items:[
            "Argument types are mandatory: Rust never guesses at boundaries.",
            "`return` exists for early exits: `return Err(did_not_craft);`",
            "Style rule (rustfmt enforces it): snake_case functions, CamelCase types.",
          ]},
        ],
        quiz:[
          {q:"What does this function return? `fn f() -> i32 { let x = 3; x * 2; }`",
           opts:["6","3","It does not compile","The unit type ()"], a:2,
           e:"That trailing semicolon turns the final expression into a statement returning (), which mismatches i32. Remove the ';'."},
          {q:"Which naming style does the Rust community use for functions?",
           opts:["CamelCase","kebab-case","snake_case","SCREAMING_CASE"], a:2,
           e:"Functions and variables: snake_case. Types/enums/traits: CamelCase. Constants: SCREAMING_SNAKE."},
        ]
      },
      {
        id:"bas-5", title:"Redstone Gates — Control Flow",
        blocks:[
          {t:"text", c:"Conditions are redstone signals: on or off. But Rust adds a superpower — `if` is an EXPRESSION, so it produces a value like a furnace produces ingots."},
          {t:"code", c:`let hunger = 15;
let msg = if hunger > 17 { "full" } else if hunger > 10 { "peckish" } else { "starving" };
// all branches must produce the SAME type or the compiler refuses
println!("Steve is {}", msg);`},
          {t:"text", c:"Loops: `loop` (forever, breakable with a value!), `while`, and `for` over ranges and iterators."},
          {t:"code", c:`let mut fuel = 0;
let loaded = loop {          // loop can RETURN a value
    fuel += 1;
    if fuel >= 8 { break fuel; }   // break with payload
};

for i in 1..=5 {            // inclusive range 1,2,3,4,5
    println!("mining layer {}", i);
}
for layer in (1..=4).rev() { println!("climb out: {}", layer); }`},
          {t:"text", c:`You already met the tip of the iceberg of \`match\` — Rust's golden lever. It, too, is an expression, and it checks that you handled EVERY possible case. Exhaustiveness means forgotten scenarios are compile errors, not 3AM crashes.`},
          {t:"code", c:`let block = 'G'; // what did we hit?
let sound = match block {
    'G' => "grass",
    'S' => "stone",
    'W' => "wood",
    _ => "???",              // '_' = the preferred catch-all
};`},
        ],
        quiz:[
          {q:"Which is TRUE about Rust's `if`?",
           opts:["Only works with bool (no truthy numbers)","It is a statement and cannot produce a value","You can compare an integer directly to 1 like in C","Requires a semicolon"], a:0,
           e:"In Rust, conditions must be bool. There are no truthy integers — a classic C footgun that is gone. And `if` IS an expression."},
          {q:"What does `for i in 0..3 {}` print for i?",
           opts:["0,1,2,3","1,2,3","0,1,2","nothing"], a:2,
           e:"`..` is exclusive of the end: 0,1,2. `..=` would include 3."},
        ]
      },
      {
        id:"bas-6", title:"Workbench — Printing, Comments & Formatting",
        blocks:[
          {t:"text", c:"Your workbench has more tools than `println!`. Comments: `//` to end of line, `/* ... */` block (nestable), and `///` doc comments which rustdoc turns into a website for your crate."},
          {t:"code", c:`/// Laughs at the player.
/// # Examples
/// \`\`\`
/// laugh(3); // prints three "hehe"s
/// \`\`\`
fn laugh(times: u8) { for _ in 0..times { println!("hehe"); } }`},
          {t:"text", c:"Format mini-language (used in `println!`, `format!`, `panic!`, etc.):"},
          {t:"list", items:[
            "`{}` — Display, human-readable",
            "`{:?}` and `{:#?}` — Debug, machine-style dump (`{:#?}` pretty-printed)",
            "`{:5}` / `{:<5}` / `{:^5}` — width and alignment",
            "`{:.2}` — 2 decimals",
            "`{0} {0}` — positional index, `{name}` named args",
          ]},
          {t:"code", c:`let chest = ("gold", 64);
println!("{:?}", chest);        // ("gold", 64) — tuples need Debug
let hp = 9.5;
println!("hp is {:.1} and width is {:>6}!", hp, "wood"); // '  wood'
let s = format!("{}/{}", hp, 20); // builds a String, prints nothing`},
          {t:"tip", c:"Derived Debug on your own types (`#[derive(Debug)]`) plus `{:#?}` is the fastest 'just show me the state' tool while learning. Display means something prettier for players."},
        ],
        quiz:[
          {q:"Which placeholder pretty-prints a nested data structure for debugging?",
           opts:["`{}`","`{:?}`","`{:#?}`","`{:pretty}`"], a:2,
           e:"{:?} is Debug, {:#?} is 'alternate' Debug — indented, multi-line. Tuples/Vecs derive Debug for free."},
          {q:"`///` comments are used for...",
           opts:["hiding code from the compiler","generating rustdoc documentation for the item below","multi-line block comments","metaprogramming"], a:1,
           e:"/// (and //! for modules) attach docs to the following item; `cargo doc` renders them."},
        ]
      },
    ]
  },

  /* ================= WORLD 2 — FOREST ================= */
  {
    id:"ownership", name:"Forest — Ownership & Borrowing", icon:"🌲", accent:"#3f8f3f",
    desc:"The chapter that makes Rust Rust. Every resource is owned, borrowed, or moved — and never leaked.",
    lessons:[
      {
        id:"own-1", title:"The Fence Rule — Why Ownership",
        blocks:[
          {t:"text", c:"Languages fight the bug of two players claiming the same chest. C says 'both may open it' (use-after-free). Java/Python say 'a referee counts references' (garbage collector + pauses). Rust says: every chest has EXACTLY ONE owner. Borrowers may look inside, but never contradict the owner."},
          {t:"text", c:"Rust's three ownership rules:"},
          {t:"list", items:[
            "Each value has one owner (a variable).",
            "When the owner leaves scope, the value is DROPPED — its memory is freed deterministically, no GC.",
            "You may TRANSFER ownership (move) or LEND access (borrow) — never steal.",
          ]},
          {t:"code", c:`fn main() {
    let s = String::from("diamond"); // 's' owns the heap string
    use_it(s);                       // ownership MOVES into use_it
    // println!("{}", s);           // ERROR: value borrowed after move
}

fn use_it(item: String) {
    println!("holding: {}", item);
} // 'item' (and the diamond) is dropped here`},
          {t:"text", c:"When the owner goes out of scope, Rust calls `drop` automatically — this is RAII, and it is why the compiler refuses the code above: the diamond would be opened twice, once by a corpse. Rust's borrow checker is the fence."},
        ],
        quiz:[
          {q:"What happens when a value's owner goes out of scope?",
           opts:["It leaks until the GC runs","It is dropped and its memory freed immediately","It becomes null","Nothing"], a:1,
           e:"Drop runs at the end of scope, deterministically — no garbage collector needed."},
          {q:"How many owners may a value have (by default)?",
           opts:["Zero","One","Two","Unlimited"], a:1,
           e:"One owner. Move semantics transfer it; borrow non-exclusive: one writer XOR many readers."},
        ]
      },
      {
        id:"own-2", title:"Moving Day — Move, Clone & Copy",
        blocks:[
          {t:"text", c:"Assigning a non-trivial value (String, Vec) MOVES it: no bytes copied, just a change of address written in the metadata. The old name becomes unusable — the compiler enforces this."},
          {t:"code", c:`let a = String::from("pickaxe");
let b = a;              // MOVE: 'a' is now a shell
// println!("{}", a);   // ERROR: borrow of moved value 'a'
println!("{} held by b", b);`},
          {t:"text", c:`Want both? \`clone()\` makes a deep copy — a real second chest, second construction cost. Small plain values (integers, bools, floats, chars, tuples/arrays of them) implement the special \`Copy\` trait: they are bitwise-copied on assignment and never move. That's why \`let y = x;\` with numbers leaves \`x\` usable.`},
          {t:"code", c:`let s1 = String::from("gem"); 
let s2 = s1.clone();          // deep copy; s1 still valid
let n1 = 64_u8;
let n2 = n1;                  // Copy; n1 STILL valid
println!("{} {} {}", s1, s2, n2);`},
          {t:"text", c:`Function calls move too — passing a \`String\` by value transfers it. Passing \`&String\` borrows it. Rule of thumb: cheap plain data is Copy; resource-shaped data (heap pointers, file handles, locks) is move-only and requires cloning on purpose.`},
        ],
        quiz:[
          {q:"After `let s2 = s1;` (s1: String), can you still use s1?",
           opts:["Yes, strings are Copy","No — s1 moved and is invalidated","Only with `mut`","Only on stable Rust"], a:1,
           e:"String is not Copy; assignment moves it. s1 is out of the game (but memory is safe)."},
          {q:"Which of these implements Copy and stays usable after assignment?",
           opts:["Vec<u8>","String","HashMap","u32"], a:3,
           e:"Plain numbers/bools/chars/tuples-of-them are Copy. Vec/String/HashMap hold heap resources and move."},
        ]
      },
      {
        id:"own-3", title:"Borrowing — Lend, Don't Steal",
        blocks:[
          {t:"text", c:"Every function call that takes ownership forces the caller to give up its stuff. Instead, borrow: `&value` is an immutable loan (read-only), `&mut value` is an exclusive loan (write access)."},
          {t:"code", c:`fn length_s(word: &String) -> usize { word.len() }
fn shout(word: &mut String) { word.push_str("!"); }

fn main() {
    let mut s = String::from("tnt");
    let n = length_s(&s);   // immutable borrow, then released
    shout(&mut s);          // exclusive borrow
    println!("{} has {} letters(!)", s, n);
}`},
          {t:"text", c:"Rust's second golden rule: at any moment you may have EITHER any number of immutable borrows XOR exactly one mutable borrow. Never both at once. This one line is what compiles away data races."},
          {t:"code", c:`let mut v = vec![1, 2, 3];
let first = &v[0];      // immutable borrow starts
// v.push(4);           // ERROR: cannot borrow 'v' as mutable — 'first' is watching
println!("first = {}", first); // borrow ends here (NLL)
v.push(4);              // OK now`},
          {t:"note", icon:"💡", c:"NLL = Non-Lexical Lifetimes: a borrow's zone ends at its LAST use, not at the closing brace. Keep borrows short and honest and the checker stays invisible."},
          {t:"text", c:"Remember: references must always be valid (no dangling pointers to freed memory) — the compiler proves it. And `mut` on the binding itself is separate from `&mut` borrows."},
        ],
        quiz:[
          {q:"How many mutable borrows may exist at the same time?",
           opts:["One","Any number","Two, if regions differ","Unlimited while immutable ones exist"], a:0,
           e:"At most ONE &mut at any time; no & while it is alive. This is what prevents data races."},
          {q:"`let r = &v[0]; v.push(1); println!(\"{}\", r);` — what happens?",
           opts:["Compiles; borrow ends at push","Compile error: mutable borrow while 'r' is alive","Runs and prints garbage","Panics at runtime"], a:1,
           e:"'r' is used after the push, so it is still alive at the push — immutable+mutable conflict. Reorder or scope borrows."},
        ]
      },
      {
        id:"own-4", title:"String Slices & Borrowing Windows",
        blocks:[
          {t:"text", c:"A slice is a borrow *plus* a length — a fat pointer (data address, length) windowing into a collection. `&str` is a string slice; a window over any UTF-8 text. `&[T]` is a slice of T's."},
          {t:"code", c:`let world = String::from("deep dark");

let deep: &str = &world[0..4];   // "deep"
let dark: &str = &world[5..];    // "dark" — to end
let whole: &str = world.as_str();

// Slices also view arrays:
let arr = [10, 20, 30, 40];
let mid: &[i32] = &arr[1..3];    // [20, 30]
println!("{} {:?} {:?}", deep, mid, whole);`},
          {t:"text", c:"Function signatures strongly prefer slices because they accept BOTH owners and views:"},
          {t:"code", c:`fn first_word(s: &str) -> &str {
    match s.find(' ') { Some(i) => &s[..i], None => s }
}
// All of these compile:
// first_word("fall damage");      (a &str literal)
// first_word(&s);                 (&String derefs to &str)
// first_word(&s[3..])`},
          {t:"text", c:"Two caveats to remember forever: `&s[..i]` slices by BYTE OFFSET — for multi-byte characters this can panic; and indexing a String by integer (`s[0]`) is BANNED — a byte is not a character. Use `s.chars()` or `char_indices()`."},
        ],
        quiz:[
          {q:"What is `&str`?",
           opts:["A pointer to heap memory only","A string slice — data pointer + length","A growable string","A mutable string buffer"], a:1,
           e:"&str = borrowed window of UTF-8 data + length (a fat pointer). String = owned, growable buffer."},
          {q:"Why is `s[0]` on a String a compile error?",
           opts:["Strings are empty by default","Indexing panics in release builds","It would return a byte, not a character, and that lies about the type","s[0] is reserved for macros"], a:2,
           e:"String is UTF-8; s.as_bytes()[0] is honest about giving a u8. s.chars().next() gets the first char."},
        ]
      },
      {
        id:"own-5", title:"Lifetime Leashes — The 'a Notation",
        blocks:[
          {t:"text", c:"A reference must never outlive its data. Most of the time the compiler infers this by itself. Sometimes it needs help, and you annotate lifetimes — variables starting with an apostrophe like 'a. They describe SCOPE, not length of time."},
          {t:"code", c:`// This would dangle: x dies at fn end, returning &x is a lie.
// fn dangle() -> &i32 { let x = 5; &x }   // ERROR

// Annotation says: the returned ref is valid
// as long as BOTH inputs are still around.
fn longest<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() > b.len() { a } else { b }
}
let s1 = String::from("creeper");
let r;
{
    let s2 = String::from("tnt");
    r = longest(s1.as_str(), s2.as_str()); // 'r' can only live THIS block
} // s2 dies; 'r' was fettered to s2's scope
// println!("{}", r);   // ERROR: r does not live long enough`},
          {t:"text", c:"Read `'a` as 'the shorter of the two borrowed regions within this call'. The annotation does not change what compiles at runtime — it makes your INTENT explicit so the checker can prove it."},
          {t:"list", items:[
            "Structs holding references need lifetimes: `struct Chat<'a> { msg: &'a str }`",
            "Elision rules auto-fill most fn signatures (single input -> return; &self -> tied to self).",
            "'static means data living the whole program: literals, leaked memory.",
          ]},
        ],
        quiz:[
          {q:"What do lifetime parameters like 'a describe?",
           opts:["CPU timing","Relative scopes of references","The size of the type","A GC pause"], a:1,
           e:"They tie the validity regions of references together so the compiler can prove no reference outlives its data."},
          {q:"Which type of data has the 'static lifetime?",
           opts:["Any heap allocation","String literals like \"torch\"","All integers","return values"], a:1,
           e:"Literals live in read-only program memory for the whole run — &'static str."},
        ]
      },
    ]
  },

  /* ================= WORLD 3 — MOUNTAINS ================= */
  {
    id:"structures", name:"Mountains — Structs, Enums & Modules", icon:"🏔️", accent:"#8892a8",
    desc:"Shape your world: custom types, methods, patterns and code organization.",
    lessons:[
      {
        id:"strc-1", title:"Building Custom Blocks — Structs",
        blocks:[
          {t:"text", c:"Structs bundle related data like a crafting recipe groups ingredients. Three flavors:"},
          {t:"code", c:`struct Player {                 // named fields
    name: String,
    health: f32,
    is_afk: bool,
}

struct Point(i32, i32);         // tuple struct: unnamed fields
struct Marker;                  // unit struct: zero data, typed tag

fn main() {
    // Field names as parameter names: init shorthand
    let name = String::from("Steve");
    let mut p1 = Player { name, health: 20.0, is_afk: false };
    p1.health -= 2.5;

    // Struct update syntax: copy the rest from another value
    let p2 = Player { health: 9.5, ..p1 };
    // NOTE: 'p1.name' was MOVED out above; use clone for copies
    println!("{} {:?} {:?}", p2.name, p2.health, p1.is_afk);
}`},
          {t:"text", c:`Derived traits stamp extra behaviors: \`#[derive(Debug, Clone, PartialEq)]\` gives printing, copying and comparisons for free.Display always has to be hand-written — a design choice: display is an opinion.`},
        ],
        quiz:[
          {q:"What does `..p1` in a struct literal do?",
           opts:["Range from p1","Copy all remaining fields from p1 (moves Copy fields, and non-Copy too)","Delete p1","Inherit methods"], a:1,
           e:"Struct update syntax fills the unstated fields from p1 — moving what isn't Clone."},
          {q:"What is a unit struct?",
           opts:["A struct with one field","A struct with only tuple fields","A struct with no data at all","A struct implementing Copy"], a:2,
           e:"`struct Marker;` — a type that exists only to carry meaning in the type system."},
        ]
      },
      {
        id:"strc-2", title:"Trade Interfaces — Methods with impl",
        blocks:[
          {t:"text", c:"`impl` blocks attach behavior to types. Methods take `self`, `&self` (read), or `&mut self` (write). Associated functions (no self) are constructors — conventionally named `new`."},
          {t:"code", c:`struct Vec2 { x: f64, y: f64 }

impl Vec2 {
    // Associated function - called with ::
    fn new(x: f64, y: f64) -> Self { Self { x, y } }

    // Shared reference - read
    fn len(&self) -> f64 { (self.x * self.x + self.y * self.y).sqrt() }

    // Exclusive borrow - write
    fn scale(&mut self, k: f64) { self.x *= k; self.y *= k; }

    // Take ownership (consumes) - returns something else
    fn into_tuple(self) -> (f64, f64) { (self.x, self.y) }
}

fn main() {
    let mut v = Vec2::new(3.0, 4.0);
    v.scale(2.0);
    println!("len = {}", v.len());
}`},
          {t:"text", c:"One `impl` may also appear in another module/file; you may open same-crate types in multiple impl blocks. Methods called with dot syntax get auto-references (`v.len()` borrows `&v` for you)."},
          {t:"tip", tip:"tip", c:"Convention: `new()` for the main constructor, from_* for others (from_str, from_f64), into_*/to_* for conversions with ownership intents."},
        ],
        quiz:[
          {q:"Which receiver lets a method mutate its struct?",
           opts:["self","&self","&mut self","no receiver"], a:2,
           e:"&mut self = exclusive borrow; at most one at a time, and the binding itself must be mut."},
          {q:"How are associated functions (no self) called?",
           opts:["With a dot like methods","With double colon: Type::new(3)","Rust calls them automatically","Only with `mut`"], a:1,
           e:"Namespace resolution: Type::function(args). Methods with self use dot syntax."},
        ]
      },
      {
        id:"strc-3", title:"Mob Variants — Enums",
        blocks:[
          {t:"text", c:"Rust enums are algebraic data types: each variant may CARRY its own data. This one feature replaces half the design patterns you would write by interfaces."},
          {t:"code", c:`enum Mob {
    Zombie { hp: u8, burning: bool },   // struct-like variant
    Slime(u8),                          // tuple variant with size
    Creeper,                            // data-free variant
}

fn describe(m: &Mob) -> &'static str {
    match m {
        Mob::Zombie { burning: true, .. } => "burning zombie",
        Mob::Zombie { hp, .. } if *hp > 5 => "healthy zombie",
        Mob::Zombie { .. } => "weak zombie",
        Mob::Slime(1) => "tiny slime",
        Mob::Slime(_) => "slime",
        Mob::Creeper => "hssssss",
    }
}`},
          {t:"text", c:"Every variant is namespaced under the enum (no name collisions with a global Creeper elsewhere — modules on steroids). Enums carrying data + exhaustive match + methods via impl = the heart of idiomatic data modeling."},
          {t:"code", c:`impl Mob {
    fn is_hostile(&self) -> bool {
        !matches!(self, Mob::Slime(_) if true) // example trick
    }
}`},
          {t:"note", icon:"💡", c:"Option<T> and Result<T, E> — the type system's most famous enums — replace NULL and exceptions with matchable values."},
        ],
        quiz:[
          {q:"What can enum variants carry?",
           opts:["Nothing — only names","Their own data, differing per variant","Only integers","Only strings"], a:1,
           e:"Variants may be unit-like, tuple-like, or struct-like — each holds what it needs."},
          {q:"Which core enum replaces a nullable value?",
           opts:["Option<T>","Either<T>","Null<T>","Maybe<T>"], a:0,
           e:"Option<T> = Some(T) or None. Compiler forces handling before use."},
        ]
      },
      {
        id:"strc-4", title:"The Golden Lever — match",
        blocks:[
          {t:"text", c:"`match` compares a value against patterns in order and runs the first arm. Every arm's body must be the same type, and the match must cover every possibility — the compiler knows your enum's variants."},
          {t:"code", c:`fn chest_table(n: u8) -> &'static str {
    match n {
        0 => "empty",
        1..=26 => "half full",
        27..=64 => "nearly full",
        _ => "double chest",
    }
}`},
          {t:"warn", c:"Common mistake, worth tattooing on your toolbox: every arm must return the SAME type (here &str), and patterns use the `=>` arrow. A stray `27 => 87` arm returning an integer would fail the whole match to compile."},
          {t:"code", c:`#[derive(Debug)]
enum Key { Wood, Iron { amount: u8 }, Gold }

fn describe(k: &Key) -> String {
    match k {
        Key::Wood => "wood".to_string(),
        Key::Iron { amount } => format!("{} iron", amount),
        other => format!("{:?}", other),      // binding the whole value
    }
}

fn main() {
    println!("{}", describe(&Key::Iron { amount: 27 }));
    println!("{}", describe(&Key::Gold));
}
// Guards add conditions too:
// match n { x if x > 100 => "huge!", _ => "small" }`},
          {t:"list", items:[
            "Patterns: literals, ranges (1..=26), `|` alternatives, `x @ 1..=3` bind-and-match, destructuring, `_` wildcard.",
            "`if let` = single-arm match. Multiple: `else if let`. Newer: `let ... else` for bail-out flows.",
            "Non-exhaustive enum updates REQUIRE fixing matches (semantic versioning made visible).",
          ]},
        ],
        quiz:[
          {q:"What happens if a match misses a variant of an enum?",
           opts:["Runtime panic","Compiles with warning","Compile error","Falls to unit ()"], a:2,
           e:"Non-exhaustive matches are hard compile errors — total functions for free."},
          {q:"`match x { n if n < 5 => \"low\", _ => \"high\" }` — what is `if n < 5`?",
           opts:["A type ascription","A match guard (extra condition on the arm)","A loop","An error"], a:1,
           e:"Guards refine arms. Binding `n` then guarding lets you reuse the captured value in the arm body."},
        ]
      },
      {
        id:"strc-5", title:"Short Circuits — if let & let else",
        blocks:[
          {t:"text", c:"When you only care about ONE pattern, `if let` is the concise golden lever. It extracts and binds in one fallible swing."},
          {t:"code", c:`let chest: Option<u8> = Some(27);

// full match ceremony
match chest {
    Some(n) => println!("{} stacks", n),
    None => println!("empty"),
}
// if let — same meaning, half the noise
if let Some(n) = chest { println!("{} stacks", n); }

// when you DO need branches on more shapes, full match returns a value:
let msg = match chest {
    Some(n) if n >= 27 => format!("{} stacks — nearly full!", n),
    Some(n) => format!("{} stacks", n),
    None => "empty".to_string(),
};
println!("{}", msg);`},
          {t:"text", c:"`let ... else` (stable since Rust 1.65) is the 'get out of my function' pattern — early return on bad shape, keeping the happy path rounded left:"},
          {t:"code", c:`fn take_stacks(chest: Option<u8>) -> u8 {
    let Some(n) = chest else {
        return 0;               // else must diverge (return/break/panic)
    };
    n                            // n flows on — no nesting
}`},
          {t:"text", c:"`while let` loops while the pattern keeps matching — draining a queue:"},
          {t:"code", c:`let mut incoming = vec![1, 2, 3];
while let Some(top) = incoming.pop() {
    println!("crafted {}", top);
}`},
        ],
        quiz:[
          {q:"`let Some(x) = opt else { return; };` — what must the else block do?",
           opts:["Nothing in particular","Return the unit type","Diverge — return, break, continue, or panic","Declare x"], a:2,
           e:"let-else's else arm must not fall through; it must exit the flow. That's why the happy path continues unwrapped below."},
          {q:"`while let Some(v) = stack.pop()` is useful for...",
           opts:["Counting to 10","Draining until empty","Compiling faster","Ignoring None values forever"], a:1,
           e:"Each successful pop matches Some(v); when pop returns None the loop stops."},
        ]
      },
      {
        id:"strc-6", title:"Village Zoning — Modules, Packages & Crates",
        blocks:[
          {t:"text", c:"Scale needs districts. A package (made by cargo new) contains one or more crates (lib or bin). Inside, `mod` decl ares modules — folders and.rs files are the districts; `pub` is who may enter, `use` is the teleport map."},
          {t:"list", items:[
            "`crate root`: src/main.rs (binary) and/or src/lib.rs (library).",
            "`mod villagers;` loads src/villagers.rs or src/villagers/mod.rs.",
            "`pub` makes items visible outside their module; `pub(crate)` limits to the crate.",
            "`use crate::villagers::Heading;` shortcuts paths; `pub use` re-exports.",
            "External crates from crates.io go into Cargo.toml `[dependencies]`.",
          ]},
          {t:"code", c:`// src/lib.rs
pub mod crafting {
    pub fn table(pattern: &str) -> String { format!("crafted {}", pattern) }
    fn secret() {}                      // private to 'crafting'
}
// src/main.rs
use my_world::crafting::table;
fn main() { println!("{}", table("pickaxe")); }`},
          {t:"note", icon:"💡", c:"`cargo doc --open` and `cargo tree` are map tools. rust-analyzer jumps: Ctrl+Click a path to visit the module file."},
        ],
        quiz:[
          {q:"What does `mod` do in Rust?",
           opts:["Installs an external crate","Declares/includes a module into the tree","Marks a function as public","Serializes data"], a:1,
           e:"mod declares the module (and loads its file). pub/use then open doors and map shortcuts."},
          {q:"What's the default visibility of items in Rust?",
           opts:["public","protected","private to their module","global"], a:2,
           e:"Everything is private unless marked pub — explicit over accidental."},
        ]
      },
    ]
  },

  /* ================= WORLD 4 — DESERT ================= */
  {
    id:"collections", name:"Desert — Collections & Iterators", icon:"🏜️", accent:"#d9a23a",
    desc:"Store, string together and sieve: Vec, String, HashMap, closures and the iterator powerhouse.",
    lessons:[
      {
        id:"coll-1", title:"Shulker Boxes — Vec<T>",
        blocks:[
          {t:"text", c:"`Vec<T>` is the growable array — your default chest. Elements live contiguously on the heap; indexing is O(1); push may grow the allocation."},
          {t:"code", c:`let mut slots: Vec<i32> = Vec::new();
slots.push(64);
slots.push(1);
let stacked = vec![1, 2, 3];          // vec! macro for literals
let zeros = vec![0; 10];              // 10 zeros

let known: Option<&i32> = slots.get(0);   // returns Option — checked
let idx = &slots[0];                      // panics if out of bounds
if let Some(v) = slots.get(99) { println!("{}", v); } else { println!("slot 99 empty"); }

for v in &slots { println!("{}", v); }    // borrow each
slots.pop();                               // removes last -> Option`},
          {t:"text", c:"Indexing behaves exactly like borrows: holding `&v[0]` while pushing is forbidden (the Vec may reallocate and move its whole heap block). Deref first, then mutate. Also learn: iteration order is index order; `iter()` yields `&T`, `into_iter()` consumes."},
          {t:"tip", c:"Empty slot? `v.get(i)` returns Option<&T>. Certain (already-checked) index? `v[i]`. Never index in library code that others may reuse with hostile input."},
        ],
        quiz:[
          {q:"What does `v.get(99)` return when v has 3 elements?",
           opts:["Panics immediately","Option::None","zero","The last element"], a:1,
           e:"get returns Option<&T> — None instead of a panic. Index [] panics out of range."},
          {q:"Which iterator CONSUMES the Vec (moves elements out)?",
           opts:["v.iter()","v.iter_mut()","v.into_iter()","&v"], a:2,
           e:"into_iter yields owned T's and the Vec is gone after. iter() yields &T references."},
        ]
      },
      {
        id:"coll-2", title:"Signs & Books — Strings",
        blocks:[
          {t:"text", c:"Two string types: `String` (owned, growable, heap) and `&str` (borrowed slice). Every String can be read as a `&str` via `&`; struct literals of text start as `&'static str`."},
          {t:"code", c:`let mut sign = String::from("Welcome");
sign.push_str(" to the server");
let name = String::new();               // empty, grows on demand
let composed = format!("{} dia{}", sign, ' '); // builds new String
let upper = sign.to_uppercase();
let joined = vec!["a","b"].join("-");

let bytes = sign.as_bytes();            // &[u8] view
for c in "héllo".chars() { print!("{} ", c); }  // chars, not bytes!
let n = "héllo".chars().count();        // 5 chars (6 bytes in UTF-8)`},
          {t:"text", c:"UTF-8 means a character may occupy several bytes. That's why `s[i]` is banned (no lying about bytes being chars), and slicing can panic in mid-character. When you need random char access, work in bytes with ASCII or re-encode as chars in a Vec<char>."},
          {t:"code", c:`let lang = "rust";
let first: Option<char> = lang.chars().next();
let pos = lang.find('s');               // Some(2)
let owned = String::from("text") + " tail"; // consumes left String`},
        ],
        quiz:[
          {q:"When should a struct field be `&str` instead of `String`?",
           opts:["When the struct must own its data","When it just borrows existing text (cheaper, no allocation)","Never","Only in release builds"], a:1,
           e:"&str borrows unowned text; String owns it. Borrow when lifetime allows — fewer allocations."},
          {q:"`for c in s.chars()` iterates over...",
           opts:["bytes (u8)","Unicode scalar values (char)","words","lines"], a:1,
           e:"chars() yields char — real characters, not raw bytes."},
        ]
      },
      {
        id:"coll-3", title:"Enchanted Chests — HashMap & HashSet",
        blocks:[
          {t:"text", c:"`HashMap<K, V>` maps keys to values (hashed lookups ~O(1)). Keys must be hashable + Eq. The `entry` API is its killer feature for counting:"},
          {t:"code", c:`use std::collections::HashMap;

fn main() {
    let mut counts = HashMap::new();
    for word in ["brick", "glass", "brick"] {
        *counts.entry(word).or_insert(0) += 1;   // insert 0 then increment
    }
    // counts is something like {"brick": 2, "glass": 1}

    let mut inv = HashMap::new();
    inv.insert("diamond", 27);
    if let Some(n) = inv.get("diamond") { println!("{} diamonds", n); }
    inv.remove("diamond");

    for (k, v) in &counts {                 // iterate pairs
        println!("{} x{}", k, v);
    }
}`},
          {t:"list", items:[
            "`HashSet<T>` = set of unique values; `map.get(&k)` -> Option<&V>.",
            "entry().or_insert(default) — compute-or-store pattern.",
            "Standard hash map: not order-preserving; use BTreeMap for sorted keys.",
            "Concurrency alternative: DashMap (crates.io).",
          ]},
        ],
        quiz:[
          {q:"The one-liner pattern for counting word frequencies is...",
           opts:["map.entry(w).or_insert(0) += 1","map.insert(w, map[w]+1)","map.get(w)+1","map.push(w)"], a:0,
           e:"entry() looks up or creates; or_insert(0) seeds zero; then deref-increment."},
          {q:"Which map keeps keys in sorted order?",
           opts:["HashMap","BTreeMap","VecMap","SortedMap"], a:1,
           e:"BTreeMap is the ordered map (plus it keeps ranges efficient). HashMap orders keys by hashing."},
        ]
      },
      {
        id:"coll-4", title:"Ant Farm — Closures",
        blocks:[
          {t:"text", c:"Closures are functions that capture their surroundings — like ants carrying pieces of their nest. Syntax `|args| body`."},
          {t:"code", c:`fn main() {
    let double = |x: i32| x * 2;
    let k = 40;
    let add_k = |x: i32| x + k;     // captures 'k' by reference
    let mut counter = {
        let mut n = 0;
        move || { n += 1; n }       // 'move' forces owning captured vars
    };
    println!("{} {} {}", double(4), add_k(2), counter());
    println!("counter again: {}", counter());   // state kept!
}`},
          {t:"text", c:"Closures implement traits by HOW they use captures:"},
          {t:"list", items:[
            "**Fn** — reads environment; callable many times (most closures).",
            "**FnMut** — needs to MUTATE captures; callable many times (counter case).",
            "**FnOnce** — consumes captures; callable exactly once (e.g. returns or drops them).",
          ]},
          {t:"code", c:`fn apply(f: impl Fn(i32) -> i32, v: i32) -> i32 { f(v) }

fn main() {
    let r = apply(|x| x + 1, 41);          // 42 — the server enables this
    let owned = String::from("api");
    let printer = move || println!("{}", owned); // OWNED by the closure
    printer();
    println!("{}", r);
}`},
        ],
        quiz:[
          {q:"Which closure trait is for closures callable many times while MUTATING captures?",
           opts:["Fn","FnMut","FnOnce","Copy"], a:1,
           e:"FnMut borrows its captures mutably and remains callable; FnOnce self-destructs after one call."},
          {q:"What does the `move` keyword do in a closure?",
           opts:["Deletes variables","Takes ownership of captured variables instead of borrowing","Marks the closure async","Returns the closure"], a:1,
           e:"move forces capture-by-value — vital for spawning threads or returning closures."},
        ]
      },
      {
        id:"coll-5", title:"Conveyor Belts — Iterators",
        blocks:[
          {t:"text", c:"Iterators are lazy conveyor belts: nothing moves until you turn the crank (a consuming method). Adapters transform; consumers take."},
          {t:"code", c:`let ore = vec![4_u32, 8, 15, 16, 23, 42];

let even_squared: Vec<u32> = ore.iter()
    .filter(|&&n| n % 2 == 0)      // adapter: keep evens
    .map(|&n| n * n)               // adapter: transform
    .collect();                    // consumer: build Vec
// == [16, 64, 256, 1764]

let total: u32 = ore.iter().sum();
let maxv = ore.iter().max();
let chunks = (1..=9).step_by(3).collect::<Vec<_>>();  // [1,4,7]

// zip pairs two belts
let names = vec!["Steve"]; let hps = vec![20];
let pairs: Vec<(&&str, &i32)> = names.iter().zip(hps.iter()).collect();`},
          {t:"text", c:"Zero-cost: the optimizer compiles chain-of-adapters into a single tight loop — usually matching a hand-rolled for loop. That's why idiomatic Rust doesn't avoid iterators for speed."},
          {t:"code", c:`// Implementing your own iterator (library-grade):
struct Counter { n: u32 }
impl Iterator for Counter {
    type Item = u32;
    fn next(&mut self) -> Option<u32> {
        self.n += 1;
        if self.n < 6 { Some(self.n) } else { None }
    }
}`},
        ],
        quiz:[
          {q:"When do iterator adapters actually run?",
           opts:["Immediately when chained","Only when a consuming method (collect/sum/for) is called","Never","At compile time"], a:1,
           e:"Adapters are lazy; consumers drive the loop. This composes efficiently."},
          {q:"What does implementing Iterator require?",
           opts:["defining `len()`","Defining an `next()` method and an associated Item type","Deriving Display","A Vec field"], a:1,
           e:"type Item + fn next(&mut self) -> Option<Self::Item> gives you hundreds of adapter methods free."},
        ]
      },
    ]
  },

  /* ================= WORLD 5 — OCEAN ================= */
  {
    id:"errors", name:"Ocean — Error Handling", icon:"🌊", accent:"#3fc5d6",
    desc:"Sink-proof code: panic vs error values, the ? operator, and error types that mean something.",
    lessons:[
      {
        id:"err-1", title:"SURVIVAL vs. hardcore mode — panic!",
        blocks:[
          {t:"text", c:"Two error worlds: `panic!` (hardcore: crash immediately, unwinding the stack) vs `Result`/`Option` (survival: the type system makes you plan for failure)."},
          {t:"code", c:`// panic - for BUGS, broken invariants, no reasonable recovery:
let v = vec![1, 2, 3];
// let item = v[10];                // indexing out of bounds PANICS (any profile)
let hp: i32 = -1;
assert!(hp >= 0, "hp must not be negative, got {}", hp);   // custom message
debug_assert!(hp >= 0);           // checked only in debug builds

let r = std::panic::catch_unwind(|| { panic!("boom"); });
println!("rescued: {:?}", r.is_err());   // true — catch_unwind can hook a panic`},
          {t:"text", c:"Guideline: panic for programmer mistakes (index out of bounds, unreachable states); return Result for EXPECTED failures (file not found, bad input, network down). `panic::set_hook` can log crashes; abort-on-panic makes release builds crash the process hard (no stack unwinding, smaller binary)."},
          {t:"note", icon:"⚠️", c:"unwrap()/expect() also panic on the bad case. They are glue and prototype tools; real APIs prefer ? and match."},
        ],
        quiz:[
          {q:"When is panic! the RIGHT tool?",
           opts:["Expected user input issues","File not found","A broken invariant/bug outside the function's contract","Network timeouts"], a:2,
           e:"Panics signal bugs/invariant breaks. Recoverable/expected problems return Result."},
          {q:"What does `.expect(\"certain\")` do on a None Result?",
           opts:["Returns default","Logs and continues","Panics with the message 'certain'","Retries"], a:2,
           e:"expect unwraps Ok/Some or panics with the provided context message — better than bare unwrap."},
        ]
      },
      {
        id:"err-2", title:"Result & the ? Elevator",
        blocks:[
          {t:"text", c:"`Result<T, E>` = Ok(T) | Err(E). The `?` operator is an express elevator: on Ok it unwraps the value and proceeds; on Err it EARLY-RETURNS the error from your function."},
          {t:"code", c:`use std::fs::File;
use std::io::{self, Read};

fn read_config(path: &str) -> Result<String, io::Error> {
    let mut data = String::new();
    File::open(path)?.read_to_string(&mut data)?;   // elevates both steps
    Ok(data)
}

fn main() -> Result<(), Box<dyn std::error::Error>> {    // main can return Result!
    let cfg = read_config("world.toml")?;
    println!("config: {} bytes", cfg.len());
    Ok(())
}`},
          {t:"text", c:"`Box<dyn Error>` in main is the 'I accept any error type' cheat. The ? operator even converts error AUTOMATICALLY when the types can convert into each other via From — good libraries design for this."},
          {t:"tip", c:"`result?.field` chains beautifully. Without ?: `match File::open(p) { Ok(f) => f, Err(e) => return Err(e.into()) }` — ? is sugar with teeth."},
        ],
        quiz:[
          {q:"On an Err value, what does the ? operator do?",
           opts:["Ignores it","Panics Unconditionally","Returns the error from the current function immediately","Retries the operation"], a:2,
           e:"? is a typed early-return: propagates Err (after From-converting if needed), unwraps Ok."},
          {q:"Can `fn main` return Result?",
           opts:["No, never","Yes — Result<(), E> where E: Debug","Only with async","Yes, but only Ok"], a:1,
           e:"main can return Result<(), E: Debug> — a clean, typed process exit path."},
        ]
      },
      {
        id:"err-3", title:"Forge Your Own Error Types",
        blocks:[
          {t:"text", c:"Real programs need errors that CARRY CONTEXT: which file? which id? The idiom: define an error enum for your crate, implement Display and std::error::Error for it, and let ? convert library errors in."},
          {t:"code", c:`use std::fmt;

#[derive(Debug)]
enum CraftError {
    MissingIngredient { need: &'static str },
    TableFull(u8),
}

impl fmt::Display for CraftError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            CraftError::MissingIngredient { need } => write!(f, "missing {}", need),
            CraftError::TableFull(n) => write!(f, "table slots {} full", n),
        }
    }
}
impl std::error::Error for CraftError {}     // marker trait - enables Box<dyn Error>`},
          {t:"text", c:"This is exactly what the `thiserror` crate automates (you write `#[derive(thiserror::Error)]` and attributes instead of the Display impl). In apps, the `anyhow` crate's `anyhow::Error` (context + backtrace) is popular. Libraries expose specific types; applications aggregate."},
          {t:"list", items:[
            "Errors should becheap: prefer enums over Strings (structured matching > parsing text).",
            "Add context at boundaries: convert with `.map_err(|e| CraftContext::from(e))?`",
            "Downcast `Box<dyn Error>` when you must branch on a specific cause.",
          ]},
        ],
        quiz:[
          {q:"Why define a dedicated error enum instead of String messages?",
           opts:["Enums are cheaper to type","Callers can MATCH and branch on error variants","Strings are deprecated","It is faster to panic"], a:1,
           e:"Typed errors make handling exhaustive and cheap; strings only print."},
          {q:"Which trait marker makes your type usable as a std error (including Box<dyn Error>)?",
           opts:["Display","Debug","std::error::Error","ToString"], a:2,
           e:"Implement std::error::Error (which requires Display + Debug) so ? and dyn Error fit."},
        ]
      },
      {
        id:"err-4", title:"Option Flow — Combinators",
        blocks:[
          {t:"text", c:"Once everything is Option/Result, unwrap/expect becomes a smell. Combinators build pipelines instead:"},
          {t:"code", c:`fn main() {
    let inv: Option<u8> = Some(3);
    let empty: Option<u8> = None;

    println!("{:?}", inv.map(|n| n * 64));   // Some(192)
    println!("{:?}", empty.unwrap_or(0));    // 0
    println!("{:?}", inv.filter(|&n| n > 2)); // Some(3)
    println!("{:?}", inv.and_then(|n| if n > 0 { Some(n) } else { None }));
    println!("{:?}", inv.zip(empty));         // Option<(u8, u8)>
    println!("{:?}", inv.ok_or("empty inventory")); // Result<u8, &str>
}`},
          {t:"text", c:"The `Ok`-side twin set: `map`, `and_then` (the flat-map of results), `or_else` (fallback chain), `unwrap_or_default`."},
          {t:"code", c:`fn parse_count(s: Option<&str>) -> Result<u8, String> {
    s.ok_or("missing arg")?                     // Option -> Result<_, String>
     .trim()
     .parse::<u8>()
     .map_err(|e| format!("bad number: {}", e)) // polish E
}`},
          {t:"tip", c:"`if let`, `while let`, ? and combinators are the four pillars. unwrap is the scaffolding you remove before shipping."},
        ],
        quiz:[
          {q:"`opt.ok_or(\"empty\")` converts...",
           opts:["Option<T> into Result<T, &str>","Result into Option","None into Some","Err into Ok"], a:0,
           e:"ok_or maps None to Err(e), Some(v) to Ok(v) — the bridge from Option-world to ?-world."},
          {q:"Which combinator is like flatMap for fallible next steps?",
           opts:["map","filter","and_then","zip"], a:2,
           e:"and_then takes a fn returning Option/Result and flattens — chaining steps without nesting."},
        ]
      },
    ]
  },

  /* ================= WORLD 6 — NETHER ================= */
  {
    id:"traits", name:"Nether — Generics, Traits & Abstraction", icon:"🔥", accent:"#ff6b35",
    desc:"Forge abstractions that cost nothing: generics, trait bounds, dyn dispatch and operator overloading.",
    lessons:[
      {
        id:"gen-1", title:"Obsidian Molds — Generics",
        blocks:[
          {t:"text", c:"Generics are type molds: write the shape once, pour any compatible type into it. At compile time Rust MONOMORPHIZES — stamps out a specialized copy per concrete type. Zero runtime cost."},
          {t:"code", c:`fn tallest<'a, T: PartialOrd>(items: &'a [T]) -> Option<&'a T> {
    items.iter().max_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal))
}

struct Chest<T> { slots: Vec<T> }
impl<T> Chest<T> {
    fn new() -> Self { Chest { slots: Vec::new() } }
    fn add(&mut self, t: T) { self.slots.push(t); }
}
// Monomorphic: Chest<i32> and Chest<String> are separate stamped types`},
          {t:"text", c:"Bounds (the `T: Trait` part) are your item's required enchantments: which capabilities T must have. Without bounds, generic code can do NOTHING with T — no methods, no compare. Bounds unlock behavior."},
          {t:"code", c:`fn is_superuser<T: PartialEq + Clone>(a: &T, b: &T) -> bool { a == b }

// where clauses read better with many bounds:
fn combine<T>(a: &T, b: &T) -> String
where T: std::fmt::Debug + Clone + Send { format!("{:?} {:?}", a, b) }`},
        ],
        quiz:[
          {q:"What does Rust do with generic functions at compile time?",
           opts:["Interprets them","Monomorphizes — specializes per used concrete type","Boxes every T","Like Python: dynamic"], a:1,
           e:"Monomorphization duplicates the code per type — this is why generics are zero-cost."},
          {q:"Why add a trait bound like `T: PartialOrd`?",
           opts:["To make the binary smaller","To unlock methods on T inside the generic body","To allow mutating T","To disable Copy"], a:1,
           e:"Bounds say what T can do; the body may then compare/sort/etc."},
        ]
      },
      {
        id:"gen-2", title:"Contracts on Blocks — Defining a Trait",
        blocks:[
          {t:"text", c:"A trait is a contract: required method signatures plus optional default bodies. Types implement it with `impl Trait for Type`. Traits are Rust's interfaces — but stronger: they can be implemented for any type, including primitives."},
          {t:"code", c:`trait Furnace {
    fn smelt(&self) -> u16;              // required
    fn fuel_name(&self) -> String {      // default implementation
        String::from("coal")
    }
}

struct BlastFurnace { temp: u16 }
struct Smoker { wood: bool }

impl Furnace for BlastFurnace {
    fn smelt(&self) -> u16 { self.temp * 2 }
    fn fuel_name(&self) -> String { String::from("blaze rod") }
}
impl Furnace for Smoker {
    fn smelt(&self) -> u16 { 200 }
    // fuel_name() inherited default "coal"
}`},
          {t:"text", c:"Call trait methods like normal ones. Trait implementations for types you don't own are also fine (dispatch) — but Orphan Rule: at least one of trait or type must be in YOUR crate."},
          {t:"code", c:`struct Player { name: String }

// You own Player, so implementing a FOREIGN trait for it is fine:
impl std::fmt::Display for Player {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{} [player]", self.name)
    }
}

fn main() {
    let p = Player { name: String::from("Steve") };
    println!("{}", p);   // Steve [player]
}`},
        ],
        quiz:[
          {q:"Trait default method bodies...",
           opts:["Must be overridden by every implementor","Can be inherited by implementors unless overridden","Cannot exist","Only work with generics"], a:1,
           e:"Provided defaults giveimplementors a head start; override only when behavior must differ."},
          {q:"What does the orphan rule require for `impl SomeTrait for SomeType`?",
           opts:["Either the trait or the type is local to your crate","Both must be external","Nothing, any time","Ahead-of-time errors"], a:0,
           e:"Coherence: you may implement foreign traits only for your types (or own traits for anything)."},
        ]
      },
      {
        id:"gen-3", title:"Trait Bounds & impl Trait",
        blocks:[
          {t:"text", c:"Adapting functions to trait bounds has three spellings. Same power, different shot formats:"},
          {t:"code", c:`// 1. inline bounds
fn compute<T: Furnace>(f: &T) -> u16 { f.smelt() * 2 }

// 2. 'impl Trait' in argument position (shorthand for generics)
fn send(f: impl Furnace) -> u16 { f.smelt() }

// 3. where clause (scaling-friendly)
fn refill<T>(f: &mut T) where T: Furnace + Sized { /* ... */ }

// 4. impl Trait as return type — opaque, concrete, fast:
fn make_furnace() -> impl Furnace { BlastFurnace { temp: 200 } }
// (underlying type fixed; different arms may NOT return different types)`},
          {t:"text", c:"Multiple bounds: `T: A + B`. Conditional impls: `impl<T: Clone> Chest<T> { fn clone_all(&self) ... }`. Blanket impls apply to all conforming types: `impl<T: Display> ToString for T`."},
          {t:"tip", c:"Bounds express minimal-enough needs (imagine the SMALLEST enchantment set your body needs) — callers will thank you by passing us richer types."},
        ],
        quiz:[
          {q:"`fn f() -> impl Track` means...",
           opts:["Returns any trait object","Returns SOME concrete type implementing Track, decided by the compiler/body","Returns a function pointer","Cannot compile"], a:1,
           e:"Opaque concrete type: zero-cost and type-safe, but a single body must resolve to ONE type (no dynamic branches across types)."},
          {q:"How do you require two traits of a generic?",
           opts:["Two generic params","T: A + B","where T: A, B","impl<T: A> T: B"], a:1,
           e:"Plus-sign joins required bounds. Where clauses can also be comma-joined."},
        ]
      },
      {
        id:"gen-4", title:"Enchantment Library — Common Std Traits",
        blocks:[
          {t:"text", c:"Rust's standard trait set is its enchantment table. Derive cheap ones; implement others:"},
          {t:"list", items:[
            "**Debug** — {:?} printing (almost always derive).",
            "**Display** — {} user-facing (must hand-write).",
            "**PartialEq / Eq** — == and HashMap keys. Hash complements (HashMap requires Eq+Hash).",
            "**PartialOrd / Ord** — < > and sorts.",
            "**Clone / Copy** — deep copy / bitwise cheap copy.",
            "**Default** — zero/empty value via ::default().",
            "**From / Into / TryFrom** — lossless conversions (implement From; Into comes free).",
            "**Deref / Drop** — smart-pointer magic / cleanup timing.",
          ]},
          {t:"code", c:`#[derive(Debug, Clone, PartialEq, Eq, Hash, Default)]
struct Pos { x: i32, y: i32, z: i32 }   // ready for maps, sets, sorts

impl From<(i32, i32, i32)> for Pos {
    fn from(t: (i32, i32, i32)) -> Self { Pos { x: t.0, y: t.1, z: t.2 } }
}

fn main() {
    let p: Pos = (1, 2, 3).into();           // From powers into()
    println!("{:?}", p);
}`},
          {t:"note", icon:"💡", c:"From → Into (automatic), From → TryFrom differs: TryFrom returns Result for fallible conversions (e.g. string coordinates)."},
        ],
        quiz:[
          {q:"Implementing From<A> for B gives you...",
           opts:["A::into(B) — automatic","Nothing else","Borrowing","Into<A> for B"], a:0,
           e:"From is the primary: blanket Into provides a.into() for free."},
          {q:"Which derive lets a struct be a HashMap KEY?",
           opts:["Only Debug","Clone + Display","Eq + Hash (PartialEq+Eq suffices with derive)","Ord"], a:2,
           e:"Keys require Eq + Hash. #[derive(Eq, Hash)] is the standard pair printed above."},
        ]
      },
      {
        id:"gen-5", title:"Dynamic Dispatch — dyn Trait & Object Safety",
        blocks:[
          {t:"text", c:"Generics = static dispatch (compiler stamps N copies — fastest). Trait objects (`dyn Trait`) = dynamic dispatch (ONE function table lookup at runtime — flexible, like classic OOP)."},
          {t:"code", c:`// (trait and types from the previous lesson, kept small here:)
trait Furnace { fn fuel_name(&self) -> String; }
struct Blast { temp: u16 }
struct Smoker;
impl Furnace for Blast { fn fuel_name(&self) -> String { format!("{}°C", self.temp) } }
impl Furnace for Smoker { fn fuel_name(&self) -> String { String::from("coal") } }

fn main() {
    // static dispatch: one stamped copy per concrete type (fastest)
    fn show_static<T: Furnace>(f: &T) {}          
    // dynamic dispatch: ONE shared copy, vtable lookup at runtime
    fn show_dynamic(f: &dyn Furnace) {}

    let fns: Vec<Box<dyn Furnace>> = vec![
        Box::new(Blast { temp: 100 }),
        Box::new(Smoker),
    ];
    for f in &fns { println!("fuel: {}", f.fuel_name()); }
    show_static(&Blast { temp: 120 });
    show_dynamic(&Smoker);
}`},
          {t:"text", c:`Object safety (a.k.a. dyn-compatibility) rules: no generic methods, no \`Self: Sized\` returning by value, no associated consts. When a type is both possible, prefer gen erics for speed; choose dyn for plugin/ships-many-implementors collections (also: smaller code size, faster compile).`},
          {t:"list", items:[
            "Fat pointer: (data pointer, vtable pointer). Slices work too: &[&dyn Furnace].",
            "Generic sections + dyn sections can mix: boxed, unsized locals via Box.",
            "Is dyn slower? One pointer-chase — usually irrelevant, but hot loops may prefer monomorphized.",
          ]},
        ],
        quiz:[
          {q:"Which uses a vtable (runtime) function lookup?",
           opts:["Generic fn with T: Trait bound","dyn Trait references/Box<dyn Trait>","const fn","Enum matches"], a:1,
           e:"dyn stores a vtable pointer in the fat pointer; calls go through it. Generics compile to direct calls."},
          {q:"A trait is dyn-compatible when...",
           opts:["It has only methods satisfying object-safety rules (no generics, no returning Self by value, etc.)","It has default methods","It is exported","It derives Debug"], a:0,
           e:"Object safety: methods must work through a vtable — no type-level (compile-known) generics/Self: Sized returns."},
        ]
      },
      {
        id:"gen-6", title:"Redstone Operators — Operator Overloading",
        blocks:[
          {t:"text", c:"Overload math/logic operators by implementing std::ops traits — powerful but constrained: derive only the ops you honestly need, and types must line up with your operands."},
          {t:"code", c:`use std::ops::Add;

#[derive(Debug, Clone, Copy, PartialEq)]
struct Vec3 { x: f64, y: f64, z: f64 }

impl Add for Vec3 {
    type Output = Vec3;                        // the type that `+` yields
    fn add(self, o: Self) -> Self {
        Vec3 { x: self.x + o.x, y: self.y + o.y, z: self.z + o.z }
    }
}

fn main() {
    let a = Vec3 { x: 1.0, y: 0.0, z: 0.0 };
    let b = Vec3 { x: 0.0, y: 1.0, z: 0.0 };
    let ab = a + b;                            // Vec3 { x: 1.0, y: 1.0, z: 0.0 }
    println!("{:?} len {}", ab, (ab.x * ab.x + ab.y * ab.y + ab.z * ab.z).sqrt());
}
// Similar: Sub, Neg, Mul, Index/IndexMut (array-like), AddAssign (+=).`},
          {t:"text", c:"Real magic: implement `Index`, `IndexMut` (array-like), `Not/BitAnd` for set-like semantics, AddAssign (`+=`). Golden rule: operators should PRESERVE semantics of their symbol — surprise operators are cursed items."},
        ],
        quiz:[
          {q:"To support `+` for your type, implement which trait?",
           opts:["std::ops::Add","Plus","Eq","Iterator"], a:0,
           e:"std::ops::Add with associated Output and fn add(self, other)."},
          {q:"Operators should overload to...",
           opts:["anything fun","semantics matching the symbol's usual meaning","always mutate in place","return strings"], a:1,
           e:"+ means combine/add, == means equality. Astonishing mappings confuse readers."},
        ]
      },
    ]
  },

  /* ================= WORLD 7 — THE END ================= */
  {
    id:"advanced", name:"The End — Advanced Rust", icon:"🐲", accent:"#b06ff0",
    desc:"The end-game dimension: lifetimes deep, smart pointers, concurrency, async, unsafe and macros.",
    lessons:[
      {
        id:"adv-1", title:"Deep Lifetime Leashes",
        blocks:[
          {t:"text", c:"Structs borrowing data need explicit lifetimes — your type now borrows, so every holder inherits Leashes:"},
          {t:"code", c:`struct Chunk<'a> {              // Chunk cannot outlive its block refs
    name: &'a str,
    height: u16,
}

impl<'a> Chunk<'a> {
    fn label(&self) -> &'a str { self.name }   // return keeps 'a
}

fn main() {
    let label = String::from("plains");
    let chunk = Chunk { name: &label, height: 63 };
    println!("{}", chunk.label());            // ok; label outlives chunk
}`},
          {t:"list", items:[
            "Elision (auto-lifetimes): 1 input ref -> attach to all outputs; &self -> self's lifetime wins.",
            "Multiple params: `'a: 'b` means 'a outlives 'b (constraint system).",
            "Statics: `&'static str` literals; Box::leak turns owned data 'static (use rarely!).",
            "Rust 2021 + NLL means you rarely WRITE collapses — when you do, it is for struct/impl.",
          ]},
          {t:"warn", c:"Lifetimes never change runtime behavior. They are compile-time proof of borrow correctness. If a lifetime fight feels impossible, re-shape to own data (String/Vec) instead of shaving angles."},
        ],
        quiz:[
          {q:"When does a struct NEED an explicit lifetime parameter?",
           opts:["Always","When it stores references","When it contains String","For Copy types"], a:1,
           e:"Only borrowed-data fields force lifetime params, tying the struct's validity to that data."},
          {q:"'a: 'b expresses...",
           opts:["time","'a outlives 'b","memory","'b outlives 'a"], a:1,
           e:"Outlives constraints order validity regions for nested borrows."},
        ]
      },
      {
        id:"adv-2", title:"Smart Chests — Box, Rc, RefCell, Arc",
        blocks:[
          {t:"text", c:"Smart pointers = the compiler-blessed storage types. They own heap blocks and run Deref/Drop for you:"},
          {t:"list", items:[
            "**Box<T>** — single-owner heap allocation; recursives; big moves become pointer moves.",
            "**Rc<T>** — reference-counted shared ownership (single thread). `Rc::clone(&rc)` bumps the count.",
            "**RefCell<T>** — interior mutability: borrow rules checked at RUNTIME. Pair with Rc for shared mutation graphs.",
            "**Arc<T> + Mutex<T>** — the multi-thread beacon: atomic count + lock (fan-favorite).",
            "**Cow<T>** — borrow if possible, clone if forced (cheap lazy writes).",
          ]},
          {t:"code", c:`use std::rc::Rc;
use std::cell::RefCell;

fn main() {
    let shared = Rc::new(RefCell::new(vec![1u8]));
    let a = Rc::clone(&shared);         // same data, count = 2
    let b = Rc::clone(&shared);         // count = 3

    a.borrow_mut().push(2);             // runtime-checked mutable access
    println!("{:?}", b.borrow());       // [1, 2]
    println!("refs = {}", Rc::strong_count(&shared));  // 3
}`},
          {t:"warn", c:"RefCell enforces one-write-XOR-many-reads at runtime — breaking the rule panics with 'already borrowed'. Rc cycles leak (break them with Weak<T>). For threads, use Arc + Mutex instead. Never call borrow_mut() twice in the same statement — the classic double-borrow panic."},
          {t:"code", c:`// Recursive structure possible thanks to Box:
enum Tree { Leaf, Node(Box<Tree>, i32, Box<Tree>) }`},
        ],
        quiz:[
          {q:"Rc<RefCell<Vec<u8>>> is used for...",
           opts:["Thread-safe shared mutation","Single-thread shared ownership with interior mutability","Faster Copy","Decompression"], a:1,
           e:"Rc shares ownership on one thread; RefCell checked runtime mutation. Replace with Arc/Mutex across threads."},
          {q:"What happens if you borrow_mut() a RefCell while another borrow is active?",
           opts:["Silently waits","Panic: borrow conflicts are runtime errors here","Compile error","Returns None"], a:1,
           e:"RefCell trades compile-time checks for runtime panics on rule violation."},
        ]
      },
      {
        id:"adv-3", title:"Multiplayer — Threads, Channels & Mutex",
        blocks:[
          {t:"text", c:"Threads are players in one world. Channels = mail slots: communicate by SENDING, not sharing. Mutex = chest lock: share but guard."},
          {t:"code", c:`use std::sync::mpsc;
use std::thread;
use std::sync::{Arc, Mutex};

fn main() {
    // 1. Channels: pipeline without locks
    let (tx, rx) = mpsc::channel();
    thread::spawn(move || tx.send(42).unwrap());       // move tx into thread
    let msg = rx.recv().unwrap();                      // 42
    println!("received {}", msg);

    // 2. Shared state: Arc (shared owner) + Mutex (turn-taking)
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];
    for _ in 0..4 {
        let c = Arc::clone(&counter);
        handles.push(thread::spawn(move || {
            for _ in 0..100 { *c.lock().unwrap() += 1; }
        }));
    }
    for h in handles { h.join().unwrap(); }
    println!("count = {}", *counter.lock().unwrap());  // 400 — data-race-proof
}`},
          {t:"text", c:"`Send` marks types movable across threads; `Sync` marks &T as thread-shareable. The checker uses your closures' captures to PROVE thread safety — that's why `move` closures and Arc/Mutex pair up."},
          {t:"tip", c:"Scatter mpsc for pipelines; server workloads: crossbeam channels, rayon for data-parallel for_each, parking_lot if you need faster/rawer locks."},
        ],
        quiz:[
          {q:"Rust's mantra for safe concurrency is...",
           opts:["Share everything, trust the GC","Communicate by sending messages; or lock shared state via Arc+Mutex","Disable the borrow checker","One thread only"], a:1,
           e:"Both patterns are fully sized by the type system: Send/Sync + channels/Mutex compile away most races."},
          {q:"Why pair Arc with Mutex for shared counters?",
           opts:["Arc is faster alone","Mutex needs an owner shared across threads; Arc provides shared ownership, Mutex guards access","Arc deletes after read","Mutex copies data"], a:1,
           e:"Mutex alone can't be shared (moves); Arc allows N holders to reach the same lock."},
        ]
      },
      {
        id:"adv-4", title:"Async Aether — async/await & Tokio",
        blocks:[
          {t:"text", c:"async fn compiles to a state machine returning a Future — inert until polled. The runtime (Tokio) drives many futures over few threads: perfect for IO-bound servers."},
          {t:"code", c:`// Cargo.toml: tokio = { version = "1", features = ["full"] }

#[tokio::main]
async fn main() {
    let page1 = fetch("first");
    let page2 = fetch("second");
    let (r1, r2) = tokio::join!(page1, page2);       // concurrent, both finish
    println!("{} {}", r1, r2);
}

async fn fetch(url: &str) -> String {
    // awaits yield to the runtime — NOT blocking:
    tokio::time::sleep(std::time::Duration::from_millis(10)).await;
    format!("fetched {}", url)
}`},
          {t:"list", items:[
            "`.await` = 'yield here; resume when ready' — only inside async contexts.",
            "Blocking the thread in async fns (long loops, thread::sleep) starves the runtime: use spawn_blocking / tokio::fs for heavy CPU/IO.",
            "select! races futures; timeout() bounds them.",
            "For web servers: axum/actix-web. For HTTP client: reqwest.",
          ]},
          {t:"code", c:`use std::time::Duration;
// structuring with timeout:
let res = tokio::time::timeout(Duration::from_secs(2), fetch("slow")).await;
match res { Ok(Ok(v)) => println!("{}", v), _ => println!("too slow") }`},
        ],
        quiz:[
          {q:"An async fn returns...",
           opts:["The value immediately","A Future (state machine) that must be awaited/polled","A thread","A Result always"], a:1,
           e:"Async fns desugar into Futures. A runtime such as Tokio polls them to completion."},
          {q:"Which is an anti-pattern inside async code?",
           opts:["tokio::join!","Long CPU-bound loop on the executor thread / thread::sleep",".await on IO","select!"], a:1,
           e:"Blocking/starving the runtime thread stalls every task on it — use spawn_blocking."},
        ]
      },
      {
        id:"adv-5", title:"Unbreaking Blocks — unsafe & FFI",
        blocks:[
          {t:"text", c:"unsafe disables RUST'S GUARANTEES, not the type system: you, the archaeologist, are responsible for raw-pointer discipline."},
          {t:"code", c:`fn summarize(v: &[u8]) -> u8 {
    let (ptr, len) = (v.as_ptr(), v.len());
    unsafe {
        // raw pointers: *const T / *mut T
        let first = *ptr;              // deref raw — U.B. if invalid!
        let _all = std::slice::from_raw_parts(ptr, len); // trust: len valid
        first
    }
}`},
          {t:"list", items:[
            "unsafe actions: deref raw pointers, call extern fns, access static mut, impl unsafe traits.",
            "Golden pattern: wrap minimal unsafe in a SAFE function; validate all inputs (len/align/null); document `# Safety` contract.",
            "FFI: `extern \"C\" { fn abs(x: i32) -> i32; }` links C libraries. Bindgen generates headers; cbindgen exports ours.",
            "Tools: `cargo miri` ships Undefined Behavior Detection for unsafe tests.",
          ]},
          {t:"tip", c:"unsafe is a scalpel: isolated segment wrapped in a safe API. rust-analyzer greys unsafe code so it screams for review."},
        ],
        quiz:[
          {q:"What does an unsafe block disable?",
           opts:["The type system","Compiler optimizations","Rust's memory-safety guarantees for the actions inside","The borrow checker everywhere"], a:2,
           e:"Only in that block: raw derefs and FFI now trust YOU. Keep the surface tiny."},
          {q:"Calling C functions from Rust uses...",
           opts:["FFI via extern blocks (often generated by bindgen)","async","macros exclusively","serde"], a:0,
           e:"extern \"C\" declares ABI-compatible foreign functions; linking happens at build time."},
        ]
      },
      {
        id:"adv-6", title:"Enchanting Table — Macros",
        blocks:[
          {t:"text", c:"Macros expand tokens BEFORE type checking. Declarative macros use pattern matching on syntax trees (macro_rules!). They are why vec![] and println! work."},
          {t:"code", c:`macro_rules! stats {
    // ($name:ident, $($stat:ident),* -> repeat, comma-separated)
    ($name:ident, $($stat:ident),*) => {
        struct $name { $( $stat: i32 ),* }
        impl $name { fn all(&self) -> Vec<i32> { vec![ $( self.$stat ),* ] } }
    };
}

fn main() {
    stats!(Player, health, hunger, mana);   // defines a struct + helper
    let p = Player { health: 20, hunger: 10, mana: 5 };
    println!("{:?}", p.all());
}`},
          {t:"list", items:[
            "Fragment specifiers: ident, expr, ty, pat, tt, literal, path…",
            "$x:ident captures; $( ... ),* repeats (comma-separated); $( ... )? optional.",
            "Derive macros (`#[derive(Serialize)]`) generate impls via syn/quote — the proc-macro big leagues.",
            "Debug expansions: `cargo expand`.",
          ]},
          {t:"note", icon:"💡", c:"Rule of thumb: functions when possible, macros when the SHAPE of code must vary (repetition, variadic args, DSLs)."},
        ],
        quiz:[
          {q:"When do macros expand?",
           opts:["Runtime","Compile time, before type checking","When linked","On call"], a:1,
           e:"Macro rules rewrite token trees pre-typecheck — the ultimate syntactic abstraction."},
          {q:"`$($x:ident),*` in a macro rule matches...",
           opts:["one ident","a comma-separated repetition of idents","an expression","a block"], a:1,
           e:"( pattern ),* repeats zero or more times, capturing each match as $x."},
        ]
      },
    ]
  },

  /* ================= WORLD 8 — DEEP DARK ================= */
  {
    id:"mastery", name:"Deep Dark — Mastery", icon:"🕳️", accent:"#6d5bb0",
    desc:"Grad school: testing, project structure, performance, WASM and idioms. Then the server is yours.",
    lessons:[
      {
        id:"mas-1", title:"Mob Proofer — Testing",
        blocks:[
          {t:"text", c:"Rust ships with a built-in test framework: `#[test]` functions, run by cargo test. Unit tests sit beside the code; failures panic with diffs."},
          {t:"code", c:`fn rarity(score: u8) -> &'static str {
    match score { 0..=9 => "common", 10..=99 => "rare", _ => "legendary" }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_rarity() {                      // asserts, not returns
        assert_eq!(rarity(5), "common");
        assert_eq!(rarity(50), "rare");
        assert_eq!(rarity(100), "legendary");
    }

    #[test]
    #[should_panic(expected = "invalid")]
    fn panics_on_negative() { panic!("invalid layer"); }
}`},
          {t:"list", items:[
            "`cargo test` compiles test cfg separately (hidden from builds). `-- --nocapture` shows println.",
            "Integration tests live in tests/ directory; doc tests in /// run too: cargo test runs ALL.",
            "assert!(), assert_eq!, assert_ne!, and debug_assert variants.",
            "Property testing: proptest/quickcheck; coverage: tarpaulin/cargo-llvm-cov.",
          ]},
        ],
        quiz:[
          {q:"Where do unit tests conventionally live?",
           opts:["A tests/ unit file","source file, in a #[cfg(test)] mod, near the tested code","Cargo.toml","Doc comments only"], a:1,
           e:"Unit tests colocate; tests/*.rs bring integration tests."},
          {q:"Which annotations/commands run tests including doc examples?",
           opts:["cargo run --test","cargo test (docs included automatically)","rustc --test-docs","must be explicitly rustdoc --test"], a:1,
           e:"cargo test runs unit, integration, and doc tests in one sweep."},
        ]
      },
      {
        id:"mas-2", title:"Server Architecture — Workspaces & Tooling",
        blocks:[
          {t:"text", c:"Real projects split into a workspace of crates: `engine` (lib), `server` (bin), `world` (lib). Cargo.toml [workspace] names members; they share the target directory and dependency lockstep."},
          {t:"code", c:`# Cargo.toml (root - workspace)
[workspace]
members = ["engine", "server", "world"]

# server/Cargo.toml
[dependencies]
engine = { path = "../engine" }
world  = { path = "../world" }`},
          {t:"list", items:[
            "`cargo fmt` / `cargo fmt --check` — formatting, always. Non-negotiable.",
            "`cargo clippy` — hundreds of lint rules (correctness & ergonomics). `-W clippy::pedantic` for the hardcore.",
            "`cargo tree` — dependency visualization. `cargo audit` — security advisories check.",
            "Crates.io publish: cargo publish with semver (`^` caret reqs). Editions: 2015/2018/2021( modular best practices ).",
          ]},
        ],
        quiz:[
          {q:"The cargo workspace feature for LINT rules is...",
           opts:["cargo lint","cargo clippy","cargo fluff","cargo dust"], a:1,
           e:"clippy lints catch issues from needless borrows to suspicious arithmetic."},
          {q:"What does a workspace share among member crates?",
           opts:["Source files","target/ directory and a single Cargo.lock","Test names","Versions of Rust"], a:1,
           e:"Members share Cargo.lock/target — faster builds and consistent dependency graphs."},
        ]
      },
      {
        id:"mas-3", title:"Enchantments of Speed — Performance",
        blocks:[
          {t:"text", c:"Rust has no hidden costs: no GC pauses, no VM, no dynamic dispatch unless you pick it. Performance is about allocations and layout."},
          {t:"list", items:[
            "**Measure first**: cargo bench (criterion crate), flamegraphs via `cargo flamegraph`.",
            "Use `Vec` with reserve() (pre-allocate) for known growth; iteration beats index-walking.",
            "Prefer &str/&[T] over &String/&Vec in APIs (less deref hopping).",
            "Small Copy types beat heap boxes; struct field ordering packs cache lines.",
            "Use `--release`; lto = true, codegen-units = 1 for final builds.",
            "Inline hot functions with #[inline] when facts justify it; profile before/after.",
          ]},
          {t:"code", c:`fn sum_all(v: &[u64]) -> u64 {
    v.iter().sum()      // iterator = auto-vectorized loop in --release
}

// benchmark sketch (criterion):
// use criterion::{criterion_group, criterion_main, Criterion};
// fn bench_sum(c: &mut Criterion) { c.bench_function("sum", |b| b.iter(|| sum_all(&data))); }`},
          {t:"tip", c:"`cargo flamegraph` shows hot paths — trust measurements over intuition, ALWAYS."},
        ],
        quiz:[
          {q:"First step when optimizing Rust code?",
           opts:["Add #[inline] everywhere","Profile/measure (criterion/flamegraph)","Switch everything to dyn","Remove trait bounds"], a:1,
           e:"Optimize what's slow (measured), not what feels slow."},
          {q:"Which build settings target maximum speed?",
           opts:["debug with assertions","release + lto + codegen-units=1","test mode","wasm32 only"], a:1,
           e:"--release plus LTO and one codegen unit are the classic -O3 style knobs."},
        ]
      },
      {
        id:"mas-4", title:"Portal to the Web — WASM & Beyond",
        blocks:[
          {t:"text", c:"Rust compiles to WebAssembly: browser sandbox applications with native-grade speed. wasm-pack is the bridge."},
          {t:"code", c:`# Cargo.toml for a wasm lib:
[lib]
crate-type = ["cdylib", "rlib"]

[dependencies]
wasm-bindgen = "0.2"

// src/lib.rs
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn greet(name: &str) -> String { format!("Hello, {}!", name) }
// then: wasm-pack build --target web  -> .wasm + JS glue, importable by browsers`},
          {t:"list", items:[
            "Frontend frameworks in Rust: Yew, Leptos, Dioxus, Sycamore.",
            "Games/webcanvas: wasm-bindgen + WebGL/WebGPU (bevy can ship to web).",
            "Beyond the web: no_std + embedded (Rust on microcontrollers), kernel modules, blockchain clients.",
            "Server-side binary targets: cross-compile for Linux/ARM easily — one `cargo build --target`.",
          ]},
          {t:"note", icon:"💡", c:"Where to go next after RustCraft: build a CLI (clap), a web server (axum), a game (bevy), or an embedded toy — the worlds interconnect."},
        ],
        quiz:[
          {q:"Which tool bundles a Rust crate into a web-importable package?",
           opts:["wasm-pack","cargo web only","npm link","serde"], a:0,
           e:"wasm-pack builds with wasm-bindgen glue and packs for bundlers/node/web."},
          {q:"WASM targets are compiled with...",
           opts:["target = x86_64 only","--target wasm32-unknown-unknown (via rustup target)","an interpreter","the JVM"], a:1,
           e:"Rust is a multi-target compiler: wasm32-unknown-unknown is one target triple."},
        ]
      },
      {
        id:"mas-5", title:"Server Recipes — Idioms & Patterns",
        blocks:[
          {t:"text", c:"Adopt these idioms and your code reads like wiki-quality documentation:"},
          {t:"list", items:[
            "**Newtype**: `struct PlayerId(u64)` — cheap wrapper making wrong mixes unrepresentable.",
            "**Builder**: constructor for many-field structs (concatenating with chainable setters).",
            "**Typestate**: encode lifecycle states as type params — compile-time state machines.",
            "**RAII everywhere**: ties (locks) release on scope; Drop is your cleanup contract.",
            "**Accept generics, return concrete types**: flexible inputs, clear outputs (T: Into<String>).",
            "**? everywhere**: errors bubble once with context at layer boundaries.",
            "**clone() when in doubt**: optimize later; the borrow checker forgives clones, not fights.",
          ]},
          {t:"code", c:`// Newtype example
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
struct PlayerId(pub u64);   // passing raw u64 anywhere is now a smell

// Typestate sketch
struct World<S> { data: String, _state: S }
struct Building; struct Loaded;
impl World<Building> { fn build() -> Self { todo!() } }
impl World<Loaded> { fn run(&self) { todo!() } }`},
          {t:"note", icon:"🏆", c:"🎉 You cleared all 8 worlds! Try the Practice problems (Workshop tab) and the three special tracks: UI, Database, and Cyber Security. GG crafters!"},
        ],
        quiz:[
          {q:"What problem do NEWTYPES solve?",
           opts:["String formatting","Making raw primitives type-distinct (mixing u64 ids with counts becomes a compile error)","Faster iteration","Circular deps"], a:1,
           e:"uids units, ids and counts become distinct types; wrong mixes fail compile-time with zero cost."},
          {q:"Which pattern ties resource cleanup to variable scope?",
           opts:["Option","RAII via Drop","Builder","Iterator"], a:1,
           e:"Drop runs at scope end (RAII) — locks, files, inits, transactions all leverage it."},
        ]
      },
    ]
  },
];

/* Helper lookups shared across pages */
function worldOfLesson(lessonId){
  for (const w of WORLDS) { for (const l of w.lessons) if (l.id === lessonId) return w; }
  return null;
}
function allLessons(){
  const out = [];
  for (const w of WORLDS) for (const l of w.lessons) out.push({world:w, lesson:l});
  return out;
}
