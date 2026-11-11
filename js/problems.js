/* ============================================================
   RUSTCRAFT — Practice problems (logic building, Exercism-style)
   Every solution is a full, std-only, compiling Rust program.
   ============================================================ */
"use strict";

const TIER_ORDER = ["wood","stone","iron","gold","diamond","netherite"];
const TIER_XP = { wood:15, stone:25, iron:35, gold:50, diamond:70, netherite:100 };
const TIER_LABEL = { wood:"Wood", stone:"Stone", iron:"Iron", gold:"Gold", diamond:"Diamond", netherite:"Netherite" };

const PROBLEMS = [
  /* ================= TIER: WOOD ================= */
  {
    id:"wood-1", tier:"wood", hearts:1, tags:["basics","math"],
    title:"First Chest",
    story:" Steve opens his very first chest. Inside are batches of oak slabs. The chest won't tell him the totals — craft a function that does.",
    spec:"Write a function `crate_report(drops: &[u32]) -> Option<(u32, f64)>` that returns `None` for an empty slice, otherwise `Some((sum, average))`.",
    io:[
      ["crate_report(&[3, 5, 1])", "Some((9, 3.0))"],
      ["crate_report(&[])", "None"],
    ],
    starter:`fn crate_report(drops: &[u32]) -> Option<(u32, f64)> {
    // TODO: empty slice -> None, else Some((sum, average))
    todo!()
}

fn main() {
    println!("{:?}", crate_report(&[3, 5, 1]));
    println!("{:?}", crate_report(&[]));
}`,
    hints:[
      "`drops.iter().sum::<u32>()` gives the sum without a loop.",
      "`len()` returns usize — cast to f64 with `as f64`.",
    ],
    solution:`fn crate_report(drops: &[u32]) -> Option<(u32, f64)> {
    if drops.is_empty() {
        return None;
    }
    let sum: u32 = drops.iter().sum();
    let avg = sum as f64 / drops.len() as f64;
    Some((sum, avg))
}

fn main() {
    println!("{:?}", crate_report(&[3, 5, 1]));
    println!("{:?}", crate_report(&[]));
    println!("{:?}", crate_report(&[64, 64, 64]));
}`
  },
  {
    id:"wood-2", tier:"wood", hearts:1, tags:["basics","control-flow"],
    title:"Creeper or TNT?",
    story:" The number bus rolls by: creepers on 3s, TNT on 5s — both and it's BOOM. Print the landing zone.",
    spec:"Write `fn landing_zone()` that prints numbers 1..=100, one per line, but replacing any number divisible by 3 with `Creeper`, by 5 with `TNT`, and by both with `BOOM`.",
    io:[
      ["(line for 15)", "BOOM"],
      ["(line for 9)", "Creeper"],
      ["(line for 10)", "TNT"],
    ],
    starter:`fn landing_zone() {
    // TODO: 1..=100, swap numbers for Creeper / TNT / BOOM
    todo!()
}

fn main() {
    landing_zone();
}`,
    hints:[
      "You can make `if` produce a value: `let say = if a { .. } else { .. };`",
      "Check the BOTH case first, or combine with `match`.",
    ],
    solution:`fn landing_zone() {
    for n in 1..=100 {
        let say = if n % 15 == 0 {
            "BOOM"
        } else if n % 3 == 0 {
            "Creeper"
        } else if n % 5 == 0 {
            "TNT"
        } else {
            "..."
        };
        if say == "..." {
            println!("{}", n);
        } else {
            println!("{}", say);
        }
    }
}

fn main() {
    landing_zone();
}`
  },
  {
    id:"wood-3", tier:"wood", hearts:1, tags:["strings"],
    title:"Mirror Room",
    story:" The enchanted glass shows signs that read the same both ways. Which signs are enchanted?",
    spec:"Write `fn is_mirror(word: &str) -> bool` that returns true if the word reads the same forwards and backwards (case-sensitive).",
    io:[
      ["is_mirror(\"level\")", "true"],
      ["is_mirror(\"torch\")", "false"],
      ["is_mirror(\"TNT\")", "true"],
    ],
    starter:`fn is_mirror(word: &str) -> bool {
    // TODO: compare with its reverse
    todo!()
}

fn main() {
    for w in ["level", "torch", "TNT", "door"] {
        println!("{}: {}", w, is_mirror(w));
    }
}`,
    hints:[
      "`s.chars().rev()` walks a string backwards — collect into a String or zip-compare.",
      "`String::from_iter(...)` or `collect::<String>()` builds text back up.",
    ],
    solution:`fn is_mirror(word: &str) -> bool {
    let fwd: Vec<char> = word.chars().collect();
    let rev: Vec<char> = word.chars().rev().collect();
    fwd == rev
}

fn main() {
    for w in ["level", "torch", "TNT", "door"] {
        println!("{}: {}", w, is_mirror(w));
    }
}`
  },
  {
    id:"wood-4", tier:"wood", hearts:1, tags:["basics","iterators"],
    title:"Inventory Dump",
    story:" You dump the inventory chest across the floor. Which item stack is heaviest, which is lightest?",
    spec:"Write `fn heaviest_lightest(stacks: &[i32]) -> Option<(i32, i32)>` returning `Some((max, min))`, or `None` for an empty chest.",
    io:[
      ["heaviest_lightest(&[4, 9, 1, 7])", "Some((9, 1))"],
      ["heaviest_lightest(&[])", "None"],
    ],
    starter:`fn heaviest_lightest(stacks: &[i32]) -> Option<(i32, i32)> {
    // TODO
    todo!()
}

fn main() {
    println!("{:?}", heaviest_lightest(&[4, 9, 1, 7]));
    println!("{:?}", heaviest_lightest(&[]));
}`,
    hints:[
      "`iter().max()` and `iter().min()` exist — but they return Option<&i32>.",
      "Copy the values out with `*x` after unwrapping.",
    ],
    solution:`fn heaviest_lightest(stacks: &[i32]) -> Option<(i32, i32)> {
    let maxv = (*stacks.iter().max()?) as i32;
    let minv = (*stacks.iter().min()?) as i32;
    Some((maxv, minv))
}

fn main() {
    println!("{:?}", heaviest_lightest(&[4, 9, 1, 7]));
    println!("{:?}", heaviest_lightest(&[]));
    println!("{:?}", heaviest_lightest(&[5]));
}`
  },
  {
    id:"wood-5", tier:"wood", hearts:2, tags:["arrays","in-place"],
    title:"Gravel Falls",
    story:" Gravel obeys gravity: every solid block sinks DOWN — wait, reverse it: gravel falls to the END of the row, solids stay in order at the front.",
    spec:"Write `fn gravel_falls(row: &mut Vec<u8>)` that moves every `0` (gravel slide gap) to the END of the vector while preserving the relative order of the non-zero numbers, in place.",
    io:[
      ["row = [1, 0, 2, 0, 3] -> row becomes [1, 2, 3, 0, 0]"],
    ],
    starter:`fn gravel_falls(row: &mut Vec<u8>) {
    // TODO: compact non-zeros to the front, fill the rest with 0
    todo!()
}

fn main() {
    let mut row = vec![1, 0, 2, 0, 3];
    gravel_falls(&mut row);
    println!("{:?}", row); // [1, 2, 3, 0, 0]
}`,
    hints:[
      "Walk once with a write cursor: copy every non-zero to position `write`, bumping it.",
      "After the pass, fill indices from `write` to the end with 0.",
    ],
    solution:`fn gravel_falls(row: &mut Vec<u8>) {
    let mut write = 0;
    for read in 0..row.len() {
        if row[read] != 0 {
            row[write] = row[read];
            write += 1;
        }
    }
    while write < row.len() {
        row[write] = 0;
        write += 1;
    }
}

fn main() {
    let mut row = vec![1, 0, 2, 0, 3];
    gravel_falls(&mut row);
    println!("{:?}", row);
    let mut row2 = vec![0, 0, 7];
    gravel_falls(&mut row2);
    println!("{:?}", row2);
}`
  },
  {
    id:"wood-6", tier:"wood", hearts:1, tags:["strings","closures"],
    title:"Sheep Shearer",
    story:" Every woolly 'a', 'e', 'i', 'o', 'u' in the flock awaits shearing. Count them.",
    spec:"Write `fn shear_flock(text: &str) -> u32` that counts uppercase and lowercase vowels (ASCII a, e, i, o, u).",
    io:[
      ["shear_flock(\"Creeper Ambush\")", "4"],
      ["shear_flock(\"xyz\")", "0"],
    ],
    starter:`fn shear_flock(text: &str) -> u32 {
    // TODO: count aeiou / AEIOU
    todo!()
}

fn main() {
    println!("{}", shear_flock("Creeper Ambush"));
    println!("{}", shear_flock("xyz"));
}`,
    hints:[
      "Iterate chars: `text.chars().filter(...).count()`.",
      "`matches!(c.to_ascii_lowercase(), 'a' | 'e' | 'i' | 'o' | 'u')` is a neat one-liner.",
    ],
    solution:`fn shear_flock(text: &str) -> u32 {
    text.chars()
        .filter(|c| matches!(c.to_ascii_lowercase(), 'a' | 'e' | 'i' | 'o' | 'u'))
        .count() as u32
}

fn main() {
    println!("{}", shear_flock("Creeper Ambush"));
    println!("{}", shear_flock("xyz"));
    println!("{}", shear_flock("AEIOUaeiou"));
}`
  },

  /* ================= TIER: STONE ================= */
  {
    id:"stone-1", tier:"stone", hearts:2, tags:["math","loops"],
    title:"Golden Levers",
    story:" The lever puzzle in the desert temple only opens on Fibonacci numbers. Flip the nth lever.",
    spec:"Write `fn lever(n: u32) -> u64` returning the nth Fibonacci number (F(0)=0, F(1)=1).",
    io:[
      ["lever(0)", "0"],
      ["lever(1)", "1"],
      ["lever(10)", "55"],
    ],
    starter:`fn lever(n: u32) -> u64 {
    // TODO: iterate, don't recurse — the compiler is watching
    todo!()
}

fn main() {
    for n in [0u32, 1, 2, 10, 40] {
        println!("lever({}) = {}", n, lever(n));
    }
}`,
    hints:[
      "Keep two rolling variables, a and b = 0, 1.",
      "Swap with tuple destructuring: `(a, b) = (b, a + b);` n times.",
    ],
    solution:`fn lever(n: u32) -> u64 {
    let (mut a, mut b) = (0u64, 1u64);
    for _ in 0..n {
        (a, b) = (b, a + b);
    }
    a
}

fn main() {
    for n in [0u32, 1, 2, 10, 40] {
        println!("lever({}) = {}", n, lever(n));
    }
}`
  },
  {
    id:"stone-2", tier:"stone", hearts:2, tags:["math","sieve"],
    title:"Sieve of Steve",
    story:" The diamond detector only hums on primes. Build the ancient sieve and hum along.",
    spec:"Write `fn hum(n: u32) -> Vec<u32>` returning every prime up to and including n, using a Sieve of Eratosthenes.",
    io:[
      ["hum(10)", "[2, 3, 5, 7]"],
      ["hum(2)", "[2]"],
      ["hum(1)", "[]"],
    ],
    starter:`fn hum(n: u32) -> Vec<u32> {
    // TODO: sieve of eratosthenes
    todo!()
}

fn main() {
    println!("{:?}", hum(10));
    println!("{:?}", hum(2));
    println!("{:?}", hum(1));
}`,
    hints:[
      "`vec![true; len]` makes the 'maybe prime' table; 0 and 1 are not prime.",
      "For each p while p*p <= n: if p is prime, walk p*p, step p, marking false.",
    ],
    solution:`fn hum(n: u32) -> Vec<u32> {
    if n < 2 {
        return Vec::new();
    }
    let len = (n + 1) as usize;
    let mut is_prime = vec![true; len];
    is_prime[0] = false;
    is_prime[1] = false;
    let mut p = 2u32;
    while p * p <= n {
        if is_prime[p as usize] {
            let mut m = p * p;
            while m <= n {
                is_prime[m as usize] = false;
                m += p;
            }
        }
        p += 1;
    }
    (2..=n).filter(|&k| is_prime[k as usize]).collect()
}

fn main() {
    println!("{:?}", hum(10));
    println!("{:?}", hum(2));
    println!("{:?}", hum(1));
    println!("{:?}", hum(30));
}`
  },
  {
    id:"stone-3", tier:"stone", hearts:2, tags:["search","binary-search"],
    title:"Nether Portal Lock",
    story:" The portal coordinates are sorted but locked. Binary search bisects fast — brute force wakes the fortress.",
    spec:"Write `fn portal(shots: &[i32], target: i32) -> Option<usize>` returning the index of `target` in the sorted slice, or `None`.",
    io:[
      ["portal(&[1, 3, 5, 7], 5)", "Some(2)"],
      ["portal(&[1, 3, 5, 7], 4)", "None"],
      ["portal(&[], 4)", "None"],
    ],
    starter:`fn portal(shots: &[i32], target: i32) -> Option<usize> {
    // TODO: binary search - O(log n)
    todo!()
}

fn main() {
    println!("{:?}", portal(&[1, 3, 5, 7], 5));
    println!("{:?}", portal(&[1, 3, 5, 7], 4));
    println!("{:?}", portal(&[], 4));
}`,
    hints:[
      "Keep `lo` and `hi` pointers; loop while lo < hi with mid = (lo + hi) / 2.",
      "When shots[mid] < target move lo = mid + 1; if equal, found.",
    ],
    solution:`fn portal(shots: &[i32], target: i32) -> Option<usize> {
    let mut lo = 0usize;
    let mut hi = shots.len();
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        match shots[mid] {
            found if found == target => return Some(mid),
            x if x < target => lo = mid + 1,
            _ => hi = mid,
        }
    }
    None
}

fn main() {
    println!("{:?}", portal(&[1, 3, 5, 7], 5));
    println!("{:?}", portal(&[1, 3, 5, 7], 4));
    println!("{:?}", portal(&[], 4));
    println!("{:?}", portal(&[1, 3, 5, 7], 1));
}`
  },
  {
    id:"stone-4", tier:"stone", hearts:2, tags:["strings","greedy"],
    title:"Enchanting Table Numbers",
    story:" The enchanting table only writes Roman numerals. Translate stack counts from Arabic to Roman.",
    spec:"Write `fn rune(count: u32) -> String` converting a number (1..=3999) to Roman numerals.",
    io:[
      ["rune(9)", "IX"],
      ["rune(14)", "XIV"],
      ["rune(1990)", "MCMXC"],
    ],
    starter:`fn rune(count: u32) -> String {
    // TODO: greedy mapping 1000=M, 900=CM, ... 1=I
    todo!()
}

fn main() {
    for n in [9u32, 14, 40, 90, 400, 1990] {
        println!("{} -> {}", n, rune(n));
    }
}`,
    hints:[
      "March a value-minus list from biggest to smallest, appending runes while it still fits.",
      "The critical pairs: 1000 M, 900 CM, 500 D, 400 CD, 100 C, 90 XC, 50 L, 40 XL, 10 X, 9 IX, 5 V, 4 IV, 1 I.",
    ],
    solution:`fn rune(count: u32) -> String {
    const PAIRS: [(u32, &str); 13] = [
        (1000, "M"), (900, "CM"), (500, "D"), (400, "CD"),
        (100, "C"), (90, "XC"), (50, "L"), (40, "XL"),
        (10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I"),
    ];
    let mut n = count;
    let mut out = String::new();
    for (value, sym) in PAIRS {
        while n >= value {
            out.push_str(sym);
            n -= value;
        }
    }
    out
}

fn main() {
    for n in [9u32, 14, 40, 90, 400, 1990] {
        println!("{} -> {}", n, rune(n));
    }
}`
  },
  {
    id:"stone-5", tier:"stone", hearts:2, tags:["hashmap","arrays"],
    title:"Mushroom Stew",
    story:" Two mushrooms in the pot must sum to EXACTLY the dinner target. Find their positions.",
    spec:"Write `fn stew(bowls: &[i32], target: i32) -> Option<(usize, usize)>` returning indices (i < j) of two values summing to target, or None.",
    io:[
      ["stew(&[2, 7, 11, 15], 9)", "Some((0, 1))"],
      ["stew(&[3, 2, 4], 6)", "Some((1, 2))"],
      ["stew(&[3, 3], 6)", "Some((0, 1))"],
      ["stew(&[1, 2], 99)", "None"],
    ],
    starter:`fn stew(bowls: &[i32], target: i32) -> Option<(usize, usize)> {
    // TODO: one pass with a HashMap (value -> index)
    todo!()
}

fn main() {
    println!("{:?}", stew(&[2, 7, 11, 15], 9));
    println!("{:?}", stew(&[3, 2, 4], 6));
    println!("{:?}", stew(&[3, 3], 6));
    println!("{:?}", stew(&[1, 2], 99));
}`,
    hints:[
      "Walk once; for each bowl, check if `target - bowl` is already in the map.",
      "`map.get(&complement).copied()` gives Option<usize> of a previous index.",
      "Store current value -> current index AFTER the check to avoid pairing a bowl with itself.",
    ],
    solution:`use std::collections::HashMap;

fn stew(bowls: &[i32], target: i32) -> Option<(usize, usize)> {
    let mut seen: HashMap<i32, usize> = HashMap::new();
    for (i, &b) in bowls.iter().enumerate() {
        if let Some(&j) = seen.get(&(target - b)) {
            return Some((j, i));
        }
        seen.insert(b, i);
    }
    None
}

fn main() {
    println!("{:?}", stew(&[2, 7, 11, 15], 9));
    println!("{:?}", stew(&[3, 2, 4], 6));
    println!("{:?}", stew(&[3, 3], 6));
    println!("{:?}", stew(&[1, 2], 99));
}`
  },
  {
    id:"stone-6", tier:"stone", hearts:2, tags:["sorting","algorithms"],
    title:"Chicken Sort",
    story:" The chickens scattered across the pen. Bubble them into size order — the O(n²) pen is fine for 12 birds.",
    spec:"Write `fn bubble_chickens(pen: &mut [i32])` sorting the slice in place with bubble sort (do NOT call .sort()).",
    io:[
      ["[5, 1, 4, 2, 8] -> [1, 2, 4, 5, 8]"],
    ],
    starter:`fn bubble_chickens(pen: &mut [i32]) {
    // TODO: swap neighbors until no swaps happen
    todo!()
}

fn main() {
    let mut pen = [5, 1, 4, 2, 8];
    bubble_chickens(&mut pen);
    println!("{:?}", pen);
}`,
    hints:[
      "Two loops: for i in 0..n, inner j up to n - i - 1.",
      "Swapping in Rust: `pen.swap(j, j + 1);`",
      "Track a `swapped` flag; if a full pass makes none, the pen is sorted — break early.",
    ],
    solution:`fn bubble_chickens(pen: &mut [i32]) {
    let n = pen.len();
    for i in 0..n {
        let mut swapped = false;
        for j in 0..n - 1 - i {
            if pen[j] > pen[j + 1] {
                pen.swap(j, j + 1);
                swapped = true;
            }
        }
        if !swapped {
            break;
        }
    }
}

fn main() {
    let mut pen = [5, 1, 4, 2, 8];
    bubble_chickens(&mut pen);
    println!("{:?}", pen);
    let mut pen2 = [9, 8, 7, 6];
    bubble_chickens(&mut pen2);
    println!("{:?}", pen2);
}`
  },

  /* ================= TIER: IRON ================= */
  {
    id:"iron-1", tier:"iron", hearts:3, tags:["hashmap","sorting"],
    title:"Chest Counter",
    story:" Every crafter logs their pickups. Rank the items by how often they appear.",
    spec:"Write `fn rank_chests(log: &[&str]) -> Vec<(String, usize)>` returning items sorted by count (descending), then alphabetically for ties.",
    io:[
      ["rank_chests(&[\"torch\",\"brick\",\"torch\"]) -> [(\"torch\", 2), (\"brick\", 1)]"],
    ],
    starter:`fn rank_chests(log: &[&str]) -> Vec<(String, usize)> {
    // TODO: count with HashMap, then sort with tie-break
    todo!()
}

fn main() {
    let log = ["torch", "brick", "torch", "glass", "brick", "torch"];
    for (item, n) in rank_chests(&log) {
        println!("{} x{}", item, n);
    }
}`,
    hints:[
      "Count with `entry(k).or_insert(0) += 1`.",
      "Collect into Vec first, then `.sort_by(...)` comparing counts reversed, then keys.",
      "`b.1.cmp(&a.1).then_with(|| a.0.cmp(b.0))` is the tie-break shape.",
    ],
    solution:`use std::collections::HashMap;

fn rank_chests(log: &[&str]) -> Vec<(String, usize)> {
    let mut counts: HashMap<&str, usize> = HashMap::new();
    for item in log {
        *counts.entry(*item).or_insert(0) += 1;
    }
    let mut ranked: Vec<(String, usize)> = counts
        .into_iter()
        .map(|(k, v)| (k.to_string(), v))
        .collect();
    ranked.sort_by(|a, b| b.1.cmp(&a.1).then_with(|| a.0.cmp(&b.0)));
    ranked
}

fn main() {
    let log = ["torch", "brick", "torch", "glass", "brick", "torch"];
    for (item, n) in rank_chests(&log) {
        println!("{} x{}", item, n);
    }
}`
  },
  {
    id:"iron-2", tier:"iron", hearts:3, tags:["arrays"],
    title:"Carousel of Carts",
    story:" The minecart carousel rotates n carts k steps. Everyone boards the same relative order.",
    spec:"Write `fn spin(carts: &mut [i32], k: usize)` rotating the slice RIGHT by k steps (in place, no extra full copy). Handle k >= len. Hint: `&mut Vec<i32>` coerces to `&mut [i32]` automatically.",
    io:[
      ["[1,2,3,4,5] k=2 -> [4,5,1,2,3]"],
    ],
    starter:`fn spin(carts: &mut [i32], k: usize) {
    // TODO
    todo!()
}

fn main() {
    let mut carts = vec![1, 2, 3, 4, 5];
    spin(&mut carts, 2);
    println!("{:?}", carts); // [4, 5, 1, 2, 3]
}`,
    hints:[
      "k %= carts.len(); — a spinning past the end is a wasted loop.",
      "Reverse the whole slice, then reverse the first k, then the rest. It's magic.",
      "`carts.reverse()` reverses in place; slices too.",
    ],
    solution:`fn spin(carts: &mut [i32], k: usize) {
    if carts.is_empty() {
        return;
    }
    let k = k % carts.len();
    carts.reverse();
    let (left, right) = carts.split_at_mut(k);
    left.reverse();
    right.reverse();
}

fn main() {
    let mut carts = vec![1, 2, 3, 4, 5];
    spin(&mut carts, 2);
    println!("{:?}", carts);
    let mut carts2 = vec![1, 2, 3];
    spin(&mut carts2, 7);
    println!("{:?}", carts2); // same as k=1
}`
  },
  {
    id:"iron-3", tier:"iron", hearts:3, tags:["strings","security","closures"],
    title:"Password Validator",
    story:" The whitelist of the server flag is harsher than the Nether. Enforce ALL the rules.",
    spec:"Write `fn check_rules(pass: &str) -> Vec<&'static str>` returning the MISSING rules from: `\"length\"` (>= 8 chars), `\"digit\"`, `\"upper\"`, `\"lower\"`, `\"symbol\"` (non-alphanumeric). Empty vec = accepted.",
    io:[
      ["check_rules(\"P4ssw0rd!\")", "[]"],
      ["check_rules(\"weak\")", "[\"length\",\"digit\",\"upper\",\"symbol\"]"],
    ],
    starter:`fn check_rules(pass: &str) -> Vec<&'static str> {
    // TODO: check each rule, push names of the failing ones
    todo!()
}

fn main() {
    println!("{:?}", check_rules("P4ssw0rd!"));
    println!("{:?}", check_rules("weak"));
    println!("{:?}", check_rules("nodigitshere"));
}`,
    hints:[
      "`pass.chars().any(|c| c.is_ascii_digit())` is the digit check.",
      "`c.is_ascii_alphabetic()` plus equality on the case gives upper/lower.",
      "`c.is_alphanumeric()` false = symbol-ish character.",
    ],
    solution:`fn check_rules(pass: &str) -> Vec<&'static str> {
    let mut missing = Vec::new();
    if pass.chars().count() < 8 { missing.push("length"); }
    if !pass.chars().any(|c| c.is_ascii_digit()) { missing.push("digit"); }
    if !pass.chars().any(|c| c.is_ascii_uppercase()) { missing.push("upper"); }
    if !pass.chars().any(|c| c.is_ascii_lowercase()) { missing.push("lower"); }
    if !pass.chars().any(|c| !c.is_alphanumeric()) { missing.push("symbol"); }
    missing
}

fn main() {
    println!("{:?}", check_rules("P4ssw0rd!"));
    println!("{:?}", check_rules("weak"));
    println!("{:?}", check_rules("nodigitshere"));
}`
  },
  {
    id:"iron-4", tier:"iron", hearts:3, tags:["strings","algorithms"],
    title:"Run-Length Mining",
    story:" Tally miners repeat: 'aaa' = a3. Compress the mining log, then decompress it back.",
    spec:"Write two functions: `fn carve(log: &str) -> String` (RLE compress: same 4+ repeats only) and `fn uncarve(compressed: &str) -> String`.",
    io:[
      ["carve(\"aabbbcc\")", "a2b3cc"],
      ["uncarve(\"a2b3cc\")", "aabbbcc"],
    ],
    starter:`fn carve(log: &str) -> String {
    // TODO: run-length encode (singletons stay bare)
    todo!()
}

fn uncarve(compressed: &str) -> String {
    // TODO: expand letter+digits
    todo!()
}

fn main() {
    let c = carve("aabbbcc");
    println!("{}", c);        // a2b3cc
    println!("{}", uncarve(&c)); // aabbbcc
}`,
    hints:[
      "Walk groups: use chars().peekable() or fold with a state machine (last char, run length).",
      "When the run ends: push the char, and counts > 1 push the digits.",
      "To decode: digits accumulate into a number; a letter means 'push char count times' (default 1).",
    ],
    solution:`fn carve(log: &str) -> String {
    let mut out = String::new();
    let mut chars = log.chars().peekable();
    while let Some(c) = chars.next() {
        let mut run = 1usize;
        while chars.peek() == Some(&c) {
            chars.next();
            run += 1;
        }
        out.push(c);
        if run > 1 {
            out.push_str(&run.to_string());
        }
    }
    out
}

fn uncarve(compressed: &str) -> String {
    // grammar produced by carve(): letter, optionally followed by its count digits
    let mut out = String::new();
    let mut chars = compressed.chars().peekable();
    while let Some(c) = chars.next() {
        if c.is_ascii_digit() {
            continue; // stray digit at the top (shouldn't happen)
        }
        let mut num = String::new();
        while let Some(&d) = chars.peek() {
            if d.is_ascii_digit() {
                num.push(d);
                chars.next();
            } else {
                break;
            }
        }
        let n: usize = num.parse().unwrap_or(1);
        for _ in 0..n {
            out.push(c);
        }
    }
    out
}

fn main() {
    let c = carve("aabbbcc");
    println!("{}", c);
    println!("{}", uncarve(&c));
    println!("{}", carve("abc"));
    println!("{}", uncarve("a10b"));
}`
  },

  /* ================= TIER: GOLD ================= */
  {
    id:"gold-1", tier:"gold", hearts:3, tags:["stack","parsing"],
    title:"Trapdoor Brackets",
    story:" Locked trapdoors open only with perfectly nested iron `{}` and `[()]` keys. Check the lock.",
    spec:"Write `fn lock_valid(seq: &str) -> bool` — true if every `{}`, `[]`, `()` in the sequence opens, nests correctly, and closes.",
    io:[
      ["lock_valid(\"{[]()}\")", "true"],
      ["lock_valid(\"([)]\")", "false"],
      ["lock_valid(\"}{\")", "false"],
      ["lock_valid(\"\")", "true"],
    ],
    starter:`fn lock_valid(seq: &str) -> bool {
    // TODO: stack the openers, pop on closers
    todo!()
}

fn main() {
    println!("{}", lock_valid("{[]()}"));
    println!("{}", lock_valid("([)]"));
    println!("{}", lock_valid("}{"));
    println!("{}", lock_valid(""));
}`,
    hints:[
      "Push openers with `stack.push(c)`.",
      "On a closer, pop (handle empty!) and check the pair: `('(', ')')`, `('[', ']')`, `('{', '}')`.",
      "Valid iff the stack is empty at the end.",
    ],
    solution:`fn lock_valid(seq: &str) -> bool {
    let mut stack: Vec<char> = Vec::new();
    for c in seq.chars() {
        match c {
            '(' | '[' | '{' => stack.push(c),
            ')' | ']' | '}' => {
                let opener = stack.pop();
                let ok = match (opener, c) {
                    (Some('('), ')') | (Some('['), ']') | (Some('{'), '}') => true,
                    _ => false,
                };
                if !ok {
                    return false;
                }
            }
            _ => {}
        }
    }
    stack.is_empty()
}

fn main() {
    println!("{}", lock_valid("{[]()}"));
    println!("{}", lock_valid("([)]"));
    println!("{}", lock_valid("}{"));
    println!("{}", lock_valid(""));
}`
  },
  {
    id:"gold-2", tier:"gold", hearts:3, tags:["recursion","bitmask"],
    title:"Power Set Crafting",
    story:" Every subset of tools is a legal crafting combo. List them all — the order matters not, completeness does.",
    spec:"Write `fn combos(items: &[&str]) -> Vec<Vec<String>>` returning ALL subsets (each in the same input order), including the empty set.",
    io:[
      ["combos(&[\"axe\",\"pick\"]) -> [[], [\"axe\"], [\"pick\"], [\"axe\",\"pick\"]]"],
    ],
    starter:`fn combos(items: &[&str]) -> Vec<Vec<String>> {
    // TODO: bitmask or recursion
    todo!()
}

fn main() {
    for set in combos(&["axe", "pick"]) {
        println!("{:?}", set);
    }
}`,
    hints:[
      "Bitmask: for mask in 0..(1 << n), include item i if `mask & (1 << i) != 0`.",
      "Or recursive: subsets(with x) = subsets(without) + [each without one + x appended].",
    ],
    solution:`fn combos(items: &[&str]) -> Vec<Vec<String>> {
    let n = items.len();
    let mut out = Vec::new();
    for mask in 0u32..(1u32 << n) {
        let set: Vec<String> = items
            .iter()
            .enumerate()
            .filter(|(i, _)| mask & (1 << i) != 0)
            .map(|(_, name)| name.to_string())
            .collect();
        out.push(set);
    }
    out
}

fn main() {
    for set in combos(&["axe", "pick"]) {
        println!("{:?}", set);
    }
    println!("total {}", combos(&["a", "b", "c"]).len());
}`
  },
  {
    id:"gold-3", tier:"gold", hearts:4, tags:["matrix","in-place"],
    title:"Skyscraper Levels",
    story:" The fortress tower rotates 90° clockwise — every floor slab turns with it.",
    spec:"Write `fn rotate_tower(floor: &mut Vec<Vec<i32>>)` rotating the SQUARE matrix 90° clockwise in place.",
    io:[
      ["[[1,2],[3,4]] -> [[3,1],[4,2]]"],
    ],
    starter:`fn rotate_tower(floor: &mut Vec<Vec<i32>>) {
    // TODO: transpose then reverse each row
    todo!()
}

fn main() {
    let mut floor = vec![vec![1, 2, 3], vec![4, 5, 6], vec![7, 8, 9]];
    rotate_tower(&mut floor);
    for row in &floor {
        println!("{:?}", row);
    }
}`,
    hints:[
      "Transpose: swap floor[i][j] with floor[j][i] for i < j.",
      "Then reverse each row with `row.reverse()`.",
      "`i < j` (not `!=`) so each pair swaps exactly once.",
    ],
    solution:`fn rotate_tower(floor: &mut Vec<Vec<i32>>) {
    let n = floor.len();
    if n == 0 {
        return;
    }
    // transpose
    for i in 0..n {
        for j in (i + 1)..n {
            floor[i][j] ^= floor[j][i];
            floor[j][i] ^= floor[i][j];
            floor[i][j] ^= floor[j][i];
        }
    }
    // reverse each row
    for row in floor.iter_mut() {
        row.reverse();
    }
}

fn main() {
    let mut floor = vec![vec![1, 2, 3], vec![4, 5, 6], vec![7, 8, 9]];
    rotate_tower(&mut floor);
    for row in &floor {
        println!("{:?}", row);
    }
    let mut small = vec![vec![1, 2], vec![3, 4]];
    rotate_tower(&mut small);
    println!("{:?}", small);
}`
  },
  {
    id:"gold-4", tier:"gold", hearts:4, tags:["graph","bfs"],
    title:"Word Ladder Cavern",
    story:" Turning one letter at a time, from CAVE reach LAKE through real dictionary words.",
    spec:"Write `fn ladder_len(start: &str, goal: &str, dict: &[&str]) -> Option<usize>` — fewest single-letter change steps from start to goal using dict words. Return None when unreachable.",
    io:[
      ["ladder_len(\"cave\", \"lake\", [\"cave\",\"calx\",\"cake\",\"lake\",\"calk\"])", "Some(2)"],
      ["ladder_len(\"cave\", \"zinc\", [\"cave\",\"calx\"])", "None"],
    ],
    starter:`fn ladder_len(start: &str, goal: &str, dict: &[&str]) -> Option<usize> {
    // TODO: BFS over one-letter neighbors
    todo!()
}

fn main() {
    let dict = ["cave", "calx", "cake", "lake", "calk"];
    println!("{:?}", ladder_len("cave", "lake", &dict));
    println!("{:?}", ladder_len("cave", "zinc", &["cave", "calx"]));
}`,
    hints:[
      "Neighbors = words of the same length differing in exactly one letter. Helper: count differences.",
      "BFS with a visited set (HashSet) and a queue of (word, steps) starting at (start, 0).",
      "First time you pop the goal — that's the shortest path length.",
    ],
    solution:`use std::collections::{HashSet, VecDeque};

fn differs(word: &str, other: &str) -> bool {
    if word.len() != other.len() {
        return false;
    }
    word.chars().zip(other.chars()).filter(|(a, b)| a != b).count() == 1
}

fn ladder_len(start: &str, goal: &str, dict: &[&str]) -> Option<usize> {
    let mut visited: HashSet<&str> = HashSet::new();
    let mut queue = VecDeque::new();
    queue.push_back((start, 0usize));
    visited.insert(start);
    while let Some((word, steps)) = queue.pop_front() {
        if word == goal {
            return Some(steps);
        }
        for candidate in dict {
            if !visited.contains(candidate) && differs(word, candidate) {
                visited.insert(candidate);
                queue.push_back((candidate, steps + 1));
            }
        }
    }
    None
}

fn main() {
    let dict = ["cave", "calx", "cake", "lake", "calk"];
    println!("{:?}", ladder_len("cave", "lake", &dict));
    println!("{:?}", ladder_len("cave", "zinc", &["cave", "calx"]));
}`
  },

  /* ================= TIER: DIAMOND ================= */
  {
    id:"dia-1", tier:"diamond", hearts:5, tags:["ownership","recursion","data-structures"],
    title:"Minecart Chain",
    story:" Build a linked list of minecarts where every cart OWNS the cart behind it. Rust's borrow checker is the track.",
    spec:"Implement a persistent singly-linked list:"
    + " `enum Chain { Cons(i32, Box<Chain>), Empty }` with methods `fn push_front(self, v: i32) -> Chain` (O(1)), "
    + "`fn pop_front(self) -> (Option<i32>, Chain)` (value removed + remaining chain), `fn len(&self) -> usize`, and "
    + "`fn to_vec(&self) -> Vec<i32>` in order.",
    io:[
      ["chain = Empty.push_front(2).push_front(1); chain.to_vec() -> [1, 2]"],
      ["chain.pop_front() -> (Some(1), chain [2])"],
    ],
    starter:`#[derive(Debug)]
enum Chain {
    Empty,
    Cons(i32, Box<Chain>),
}

impl Chain {
    // TODO: push_front, pop_front, len, to_vec
}

fn main() {
    let chain = Chain::Empty.push_front(2).push_front(1);
    println!("{:?} len={}", chain.to_vec(), chain.len());
    let (popped, rest) = chain.pop_front();
    println!("popped {:?}, rest {:?}", popped, rest.to_vec());
}`,
    hints:[
      "`push_front` hands ownership OF THE WHOLE CHAIN to the new Cons node — pure move semantics.",
      "Recursion is your friend: `Chain::Cons(v, box) => ... recurse ...`",
      "`pop_front` consumes self: match, and return `(val, *box)` — the owned inner chain.",
    ],
    solution:`#[derive(Debug)]
enum Chain {
    Empty,
    Cons(i32, Box<Chain>),
}

impl Chain {
    fn push_front(self, v: i32) -> Chain {
        Chain::Cons(v, Box::new(self))
    }

    fn pop_front(self) -> (Option<i32>, Chain) {
        match self {
            Chain::Empty => (None, Chain::Empty),
            Chain::Cons(v, rest) => (Some(v), *rest),
        }
    }

    fn len(&self) -> usize {
        match self {
            Chain::Empty => 0,
            Chain::Cons(_, rest) => 1 + rest.len(),
        }
    }

    fn to_vec(&self) -> Vec<i32> {
        let mut out = Vec::new();
        let mut cursor = self;
        loop {
            match cursor {
                Chain::Empty => break,
                Chain::Cons(v, rest) => {
                    out.push(*v);
                    cursor = rest;
                }
            }
        }
        out
    }
}

fn main() {
    let chain = Chain::Empty.push_front(2).push_front(1);
    println!("{:?} len={}", chain.to_vec(), chain.len());
    let (popped, rest) = chain.pop_front();
    println!("popped {:?}, rest {:?}", popped, rest.to_vec());
}`
  },
  {
    id:"dia-2", tier:"diamond", hearts:5, tags:["concurrency","threads"],
    title:"Mob Spawner",
    story:" Four spawners hammer the same counter server-side. Without locks, the count lies. Make the count TRUE.",
    spec:"Write `fn spawn_herd(n_threads: usize, ticks: usize) -> (usize, Vec<String>)` — n threads each increment a shared counter `ticks` times (Arc + Mutex), and also log 'tick' lines into a shared channel. Return `(final_count, logs)`.",
    io:[
      ["spawn_herd(4, 25) -> (100, 100 log lines)"],
    ],
    starter:`use std::sync::{Arc, Mutex, mpsc};
use std::thread;

fn spawn_herd(n_threads: usize, ticks: usize) -> (usize, Vec<String>) {
    // TODO: shared Arc<Mutex<usize>> counter + mpsc channel for logs
    todo!()
}

fn main() {
    let (count, logs) = spawn_herd(4, 25);
    println!("count = {}", count);
    println!("logs  = {}", logs.len());
}`,
    hints:[
      "`Arc::clone(&counter)` per thread gives a shared handle; `*lock.lock().unwrap() += 1` mutates.",
      "The sending half `tx` can be cloned per thread, then moved into each thread's closure.",
      "The receiving loop: `for log in rx { ... }` drains the channel after all senders drop.",
    ],
    solution:`use std::sync::{Arc, Mutex, mpsc};
use std::thread;

fn spawn_herd(n_threads: usize, ticks: usize) -> (usize, Vec<String>) {
    let counter = Arc::new(Mutex::new(0usize));
    let (tx, rx) = mpsc::channel();

    let mut handles = Vec::new();
    for _ in 0..n_threads {
        let c = Arc::clone(&counter);
        let tx = tx.clone();
        handles.push(thread::spawn(move || {
            for _ in 0..ticks {
                *c.lock().unwrap() += 1;
                tx.send(String::from("tick")).unwrap();
            }
        }));
    }
    drop(tx); // original sender gone; channel closes when all clones drop

    let mut logs = Vec::new();
    for log in rx {
        logs.push(log);
    }
    for h in handles {
        h.join().unwrap();
    }
    let final_count = *counter.lock().unwrap();
    (final_count, logs)
}

fn main() {
    let (count, logs) = spawn_herd(4, 25);
    println!("count = {}", count);
    println!("logs  = {}", logs.len());
}`
  },

  /* ================= TIER: NETHERITE ================= */
  {
    id:"ttl-1", tier:"netherite", hearts:6, tags:["parser","recursion","serde-like"],
    title:"Crafting Recipe Parser",
    story:" Recipes arrive as JSON. No serde this time — be the library. Build a real recursive-descent parser.",
    spec:"Implement a JSON-subset parser: an enum `Json { Null, Bool(bool), Num(f64), Str(String), Arr(Vec<Json>), Obj(Vec<(String, Json)>) }` and `fn parse(src: &str) -> Result<Json, String>`. Grammar: `null`, `true`/`false`, ints/floats (no exponents), strings WITHOUT escapes, arrays `[.., ..]`, objects `{key: value, ..}`. Whitespace around tokens is allowed.",
    io:[
      ["parse(\"[1, 2.5, null]\")", "Ok(Arr [1, 2.5, Null])"],
      ["parse(\"{\\\"iron\\\": 9}\")", "Ok(Obj iron=Num(9))"],
      ["parse(\"[1,\")", "Err(..)"],
    ],
    starter:`#[derive(Debug, PartialEq)]
enum Json {
    Null,
    Bool(bool),
    Num(f64),
    Str(String),
    Arr(Vec<Json>),
    Obj(Vec<(String, Json)>),
}

fn parse(src: &str) -> Result<Json, String> {
    // TODO: tokenizer or char-cursor + recursive descent
    todo!()
}

fn main() {
    println!("{:?}", parse("[1, 2.5, null]"));
    println!("{:?}", parse(r#"{"iron": 9}"#));
    println!("{:?}", parse("[1,"));
}`,
    hints:[
      "Get a cursor right: `struct P { s: Vec<char>, i: usize }` with `next`, `peek`, `skip_ws`.",
      "Value dispatch on the peeked char: digit/'-' -> number, '\"' -> string, 'n' -> null, 't'/'f' -> bool, '[' -> array, '{' -> object.",
      "Recursion mirrors the grammar: parse_array calls parse_value per comma; objects expect `\"key\"` then `:`.",
      "Error strings like `expected ',' at 12` make debugging pleasant.",
    ],
    solution:`#[derive(Debug, PartialEq)]
enum Json {
    Null,
    Bool(bool),
    Num(f64),
    Str(String),
    Arr(Vec<Json>),
    Obj(Vec<(String, Json)>),
}

struct P {
    s: Vec<char>,
    i: usize,
}

impl P {
    fn skip_ws(&mut self) {
        while self.i < self.s.len() && self.s[self.i].is_whitespace() {
            self.i += 1;
        }
    }
    fn peek(&mut self) -> Option<char> {
        self.skip_ws();
        self.s.get(self.i).copied()
    }
    fn bump(&mut self) -> Option<char> {
        let c = self.peek();
        if c.is_some() {
            self.i += 1;
        }
        c
    }
    fn expect(&mut self, c: char) -> Result<(), String> {
        match self.bump() {
            Some(x) if x == c => Ok(()),
            other => Err(format!("expected {:?}, got {:?}", c, other)),
        }
    }
    fn parse_string(&mut self) -> Result<String, String> {
        self.expect('"')?;
        let mut out = String::new();
        while self.i < self.s.len() {
            let c = self.s[self.i];
            self.i += 1;
            if c == '"' {
                return Ok(out);
            }
            out.push(c);
        }
        Err(String::from("unterminated string"))
    }
    fn parse_number(&mut self) -> Result<Json, String> {
        let mut text = String::new();
        if let Some('-') = self.peek() {
            text.push('-');
            self.i += 1;
        }
        while let Some(c) = self.peek() {
            if c.is_ascii_digit() || c == '.' {
                text.push(c);
                self.i += 1;
            } else {
                break;
            }
        }
        text.parse::<f64>()
            .map(Json::Num)
            .map_err(|_| format!("bad number {:?}", text))
    }
    fn parse_value(&mut self) -> Result<Json, String> {
        match self.peek() {
            Some('n') => {
                self.expect_lit("null")?;
                Ok(Json::Null)
            }
            Some('t') => {
                self.expect_lit("true")?;
                Ok(Json::Bool(true))
            }
            Some('f') => {
                self.expect_lit("false")?;
                Ok(Json::Bool(false))
            }
            Some('"') => Ok(Json::Str(self.parse_string()?)),
            Some(c) if c.is_ascii_digit() => self.parse_number(),
            Some('-') => self.parse_number(),
            Some('[') => self.parse_array(),
            Some('{') => self.parse_object(),
            other => Err(format!("unexpected {:?}", other)),
        }
    }
    fn expect_lit(&mut self, lit: &str) -> Result<(), String> {
        for c in lit.chars() {
            self.expect(c)?;
        }
        Ok(())
    }
    fn parse_array(&mut self) -> Result<Json, String> {
        self.expect('[')?;
        let mut items = Vec::new();
        loop {
            if self.peek() == Some(']') {
                self.i += 1;
                return Ok(Json::Arr(items));
            }
            items.push(self.parse_value()?);
            match self.bump() {
                Some(',') => continue,
                Some(']') => return Ok(Json::Arr(items)),
                other => return Err(format!("expected , or ], got {:?}", other)),
            }
        }
    }
    fn parse_object(&mut self) -> Result<Json, String> {
        self.expect('{')?;
        let mut pairs = Vec::new();
        loop {
            if self.peek() == Some('}') {
                self.i += 1;
                return Ok(Json::Obj(pairs));
            }
            let key = self.parse_string()?;
            self.expect(':')?;
            let value = self.parse_value()?;
            pairs.push((key, value));
            match self.bump() {
                Some(',') => continue,
                Some('}') => return Ok(Json::Obj(pairs)),
                other => return Err(format!("expected , or }}, got {:?}", other)),
            }
        }
    }
}

fn parse(src: &str) -> Result<Json, String> {
    let mut p = P { s: src.chars().collect(), i: 0 };
    let v = p.parse_value()?;
    p.skip_ws();
    if p.i != p.s.len() {
        return Err(format!("trailing input at {}", p.i));
    }
    Ok(v)
}

fn main() {
    println!("{:?}", parse("[1, 2.5, null]"));
    println!("{:?}", parse(r#"{"iron": 9}"#));
    println!("{:?}", parse("true"));
    println!("{:?}", parse("[1,"));
}`
  },
  {
    id:"ttl-2", tier:"netherite", hearts:6, tags:["interpreter","algorithms"],
    title:"Redstone Computer",
    story:" Deep beneath the temple, a redstone computer awaits its soul: a tiny stack-VM. Give it life.",
    spec:"Interpret a stack machine. Program: `Vec<Op>` with `Op::Push(i32), Add, Sub, Mul, Dup, Swap, JmpIf(usize), Jmp(usize), Print, Halt`."
    + " `fn run(program: &[Op]) -> ` returns a `Vec<String>` of printed lines. Arithmetic pops two; first pop = RIGHT operand. `JmpIf(addr)` jumps when popped value is non-zero.",
    io:[
      ["program [Push(6), Push(7), Mul, Print, Halt] prints \"42\""],
      ["program [Push(1), JmpIf(4), Push(0), Jmp(6), Push(77), Print, Halt] prints \"77\""],
    ],
    starter:`#[derive(Debug, Clone)]
enum Op {
    Push(i32),
    Add,
    Sub,
    Mul,
    Dup,
    Swap,
    JmpIf(usize),
    Jmp(usize),
    Print,
    Halt,
}

fn run(program: &[Op]) -> Vec<String> {
    // TODO: pc + stack loop, step the machine
    todo!()
}

fn main() {
    let prog = vec![Op::Push(6), Op::Push(7), Op::Mul, Op::Print, Op::Halt];
    println!("{:?}", run(&prog));
}`,
    hints:[
      "Loop with a program counter `pc`; fetch `program[pc]` and advance pc each step (jump ops overwrite it).",
      "For Add: `let b = stack.pop()?; let a = stack.pop()?; stack.push(a + b);` — b pops first (right operand).",
      "Print: format and push to the output vector, not println! (we return the lines).",
    ],
    solution:`#[derive(Debug, Clone)]
enum Op {
    Push(i32),
    Add,
    Sub,
    Mul,
    Dup,
    Swap,
    JmpIf(usize),
    Jmp(usize),
    Print,
    Halt,
}

fn run(program: &[Op]) -> Vec<String> {
    let mut out = Vec::new();
    let mut stack: Vec<i32> = Vec::new();
    let mut pc = 0usize;
    while let Some(op) = program.get(pc) {
        pc += 1;
        match op {
            Op::Push(v) => stack.push(*v),
            Op::Add | Op::Sub | Op::Mul => {
                let b = stack.pop().expect("stack underflow (right op)");
                let a = stack.pop().expect("stack underflow (left op)");
                stack.push(match op {
                    Op::Add => a + b,
                    Op::Sub => a - b,
                    _ => a * b,
                });
            }
            Op::Dup => {
                let v = *stack.last().expect("dup on empty stack");
                stack.push(v);
            }
            Op::Swap => {
                let b = stack.pop().expect("swap underflow");
                let a = stack.pop().expect("swap underflow");
                stack.push(b);
                stack.push(a);
            }
            Op::JmpIf(addr) => {
                let v = stack.pop().unwrap_or(0);
                if v != 0 {
                    pc = *addr;
                }
            }
            Op::Jmp(addr) => pc = *addr,
            Op::Print => out.push(stack.pop().expect("print on empty stack").to_string()),
            Op::Halt => break,
        }
    }
    out
}

fn main() {
    let prog = vec![Op::Push(6), Op::Push(7), Op::Mul, Op::Print, Op::Halt];
    println!("{:?}", run(&prog));

    let prog2 = vec![
        Op::Push(1),
        Op::JmpIf(4),
        Op::Push(0),
        Op::Jmp(6),
        Op::Push(77),
        Op::Print,
        Op::Halt,
    ];
    println!("{:?}", run(&prog2));
}`
  },
];

function problemById(id){
  return PROBLEMS.find(p => p.id === id) || null;
}
