/* ══════════════════════════════════════
   data.js — Menu categories & items
   Tisoy Sushi Maki — Full Menu
   Items with price: 0 = "See staff / contact us for pricing"
══════════════════════════════════════ */

const categories = [
  { id: 'bakedsushi',   label: 'Baked Sushi',        emoji: '🫙',  desc: 'Creamy baked sushi trays — served with nori' },
  { id: 'maki',         label: 'Maki Rolls',          emoji: '🌀',  desc: 'Classic and specialty maki rolls (a la carte)' },
  { id: 'platters',     label: 'Maki Platters',       emoji: '🍱',  desc: 'Assorted maki platters for groups' },
  { id: 'kanisalad',    label: 'Kani Salad',          emoji: '🥗',  desc: 'Fresh and creamy kani salad platters' },
  { id: 'haru',         label: 'Haru Maki Salad',     emoji: '🌿',  desc: 'Light and fresh haru maki salad rolls' },
  { id: 'birthdaysets', label: 'Birthday Sets',       emoji: '🎂',  desc: 'Celebration sets with free dedication message, nori & chopsticks' },
  { id: 'partysets',    label: 'Party Sets',          emoji: '🎉',  desc: 'Large group party packages' },
  { id: 'bulk',         label: 'Large Orders & Bulk', emoji: '📦',  desc: 'Big platters — 90 pcs and above' },
];

const menu = {

  // ─────────────────────────────────────────
  // BAKED SUSHI
  // ─────────────────────────────────────────
  bakedsushi: [
    { id: 1,  name: 'California Baked Sushi (Small)',   desc: 'Creamy California-flavor baked sushi. Good for 1–2 pax · 2 nori included.',                  price: 299, emoji: '🫙' },
    { id: 2,  name: 'California Baked Sushi (Medium)',  desc: 'Creamy California-flavor baked sushi. Good for 2–3 pax · 3 nori included.',                  price: 399, emoji: '🫙' },
    { id: 3,  name: 'California Baked Sushi (Large)',   desc: 'Creamy California-flavor baked sushi. Good for 4–5 pax · 4 nori included.',                  price: 569, emoji: '🫙', tag: 'bestseller' },
    { id: 4,  name: 'Spicy Baked Sushi (Small)',        desc: 'Spicy-flavor baked sushi. Good for 1–2 pax · 2 nori included.',                              price: 319, emoji: '🌶️', tag: 'spicy' },
    { id: 5,  name: 'Spicy Baked Sushi (Medium)',       desc: 'Spicy-flavor baked sushi. Good for 2–3 pax · 3 nori included.',                              price: 419, emoji: '🌶️', tag: 'spicy' },
    { id: 6,  name: 'Spicy Baked Sushi (Large)',        desc: 'Spicy-flavor baked sushi. Good for 4–5 pax · 4 nori included.',                              price: 599, emoji: '🌶️', tag: 'spicy' },
    { id: 7,  name: 'Spicy Cheese Baked Sushi',         desc: 'Baked sushi loaded with spicy cheese topping. Contact us for pricing.',                      price: 0,   emoji: '🌶️', tag: 'spicy' },
    { id: 8,  name: '3-Flavor Baked Sushi',             desc: 'Three flavors of baked sushi in one tray, served with 6 pcs nori. Contact us for pricing.',  price: 0,   emoji: '🫙' },
  ],

  // ─────────────────────────────────────────
  // MAKI ROLLS – A LA CARTE
  // ─────────────────────────────────────────
  maki: [
    { id: 9,  name: 'California Maki',                      desc: 'Classic California roll (10 pcs).',                                          price: 159, emoji: '🌀', tag: 'bestseller' },
    { id: 10, name: 'Spicy California Maki',                desc: 'California roll with a spicy kick (~10 pcs).',                               price: 169, emoji: '🌶️', tag: 'spicy' },
    { id: 11, name: 'Veggie / Mango Maki',                  desc: 'Fresh veggie or sweet mango maki roll (~10 pcs).',                           price: 159, emoji: '🥭' },
    { id: 12, name: 'Vegan Mango Maki',                     desc: 'Plant-based mango maki roll (10 pcs).',                                      price: 159, emoji: '🥭' },
    { id: 13, name: 'Kani Cheese / Veggie Mango Maki',      desc: 'Kani with cheese or veggie mango combination roll (15 pcs).',                price: 259, emoji: '🌀' },
    { id: 14, name: 'Veggie / Cheesey / Kani Maki',         desc: 'Choice of veggie, cheesy, or kani maki roll (15 pcs).',                     price: 279, emoji: '🌀' },
    { id: 15, name: 'Spicy Kani Cheese Maki',               desc: 'Kani cheese roll with spicy seasoning (10 pcs).',                           price: 179, emoji: '🌶️', tag: 'spicy' },
    { id: 16, name: 'Futo & California Maki',               desc: 'Combo of futo and California rolls (15 pcs).',                              price: 259, emoji: '🌀' },
    { id: 17, name: 'Cheesey / Haru / Kani Cheese Maki',    desc: 'Creamy cheesy, haru, or kani cheese roll (15 pcs).',                        price: 269, emoji: '🧀' },
    { id: 18, name: 'Veggie / Haru / Crazy Maki',           desc: 'Your choice of veggie, haru, or crazy roll (~15 pcs).',                     price: 219, emoji: '🌀' },
    { id: 19, name: 'Overload Maki',                        desc: 'Generously loaded maki roll — a crowd favorite (per order).',               price: 199, emoji: '⭐', tag: 'bestseller' },
    { id: 20, name: 'Crazy / Overload Maki',                desc: 'Crazy and overload combo — best-seller pairing (15 pcs).',                  price: 279, emoji: '⭐', tag: 'bestseller' },
    { id: 21, name: 'Spicy Crazy Maki Roll',                desc: 'Spicy version of our popular crazy maki roll. Contact us for pricing.',     price: 0,   emoji: '🌶️', tag: 'spicy' },
    { id: 22, name: 'Spicy Cheese Crunchy Roll',            desc: 'Crunchy roll with a spicy cheese coating (per order).',                     price: 199, emoji: '🌶️', tag: 'spicy' },
    { id: 23, name: 'Spicy Cheese Crazy Maki',              desc: 'Crazy maki with spicy cheese flair. Contact us for pricing.',               price: 0,   emoji: '🌶️', tag: 'spicy' },
    { id: 24, name: 'Spicy Cheese / Overload Maki',         desc: 'Spicy cheese and overload combo roll (per order).',                         price: 199, emoji: '🌶️', tag: 'spicy' },
    { id: 25, name: 'Overload & Kani Spicy Maki',           desc: 'Overload and spicy kani combination (15 pcs).',                             price: 269, emoji: '🌶️', tag: 'spicy' },
    { id: 26, name: 'Crazy / K. Cheese / Overload Maki',    desc: 'Mix of crazy, kani cheese, and overload rolls. Contact us for pricing.',    price: 0,   emoji: '🌀' },
    { id: 27, name: 'Crunchy Maki Roll',                    desc: 'Maki rolled with a crunchy coating (per order).',                           price: 199, emoji: '🌀' },
    { id: 28, name: 'Veggie-Mango / Overload & Crazy Maki', desc: 'Trio of veggie-mango, overload, and crazy rolls (per order).',              price: 269, emoji: '🌀' },
    { id: 29, name: 'Cheesy Maki Roll',                     desc: 'Rich cheesy maki roll (per order).',                                        price: 199, emoji: '🧀' },
  ],

  // ─────────────────────────────────────────
  // MAKI PLATTERS
  // ─────────────────────────────────────────
  platters: [
    { id: 30, name: 'Assorted Maki Platter (30 pcs)',               desc: 'Mixed assorted maki rolls. Good for 3–4 pax.',                                            price: 499,  emoji: '🍱' },
    { id: 31, name: 'Assorted Maki Platter (40 pcs)',               desc: 'Mixed assorted maki rolls. Good for 4–5 pax.',                                            price: 749,  emoji: '🍱' },
    { id: 32, name: 'Assorted Maki Platter (42 pcs)',               desc: 'Mixed assorted maki rolls. Good for 4–5 pax.',                                            price: 719,  emoji: '🍱' },
    { id: 33, name: 'Assorted Maki Platter (50 pcs)',               desc: 'Mixed assorted maki rolls. Good for 5–6 pax.',                                            price: 999,  emoji: '🍱' },
    { id: 34, name: 'Assorted Maki Platter – Mini (50 pcs)',        desc: 'Mini-style maki platter. Good for 3–4 pax.',                                              price: 700,  emoji: '🍱' },
    { id: 35, name: 'Assorted Maki Platter (60 pcs)',               desc: 'Mixed assorted maki rolls. Good for 6–7 pax.',                                            price: 1149, emoji: '🍱' },
    { id: 36, name: 'Assorted Maki Platter (70 pcs)',               desc: 'Mixed assorted maki rolls. Good for 8–9 pax.',                                            price: 1299, emoji: '🍱' },
    { id: 37, name: 'Assorted Maki Platter (80 pcs)',               desc: 'Mixed assorted maki rolls. Good for 8–9 pax.',                                            price: 1299, emoji: '🍱' },
    { id: 38, name: 'Assorted Maki Platter (90 pcs)',               desc: 'Mixed assorted maki rolls. Good for 9–10 pax.',                                           price: 1599, emoji: '🍱', tag: 'bestseller' },
    { id: 39, name: 'Assorted Maki w/ Baked Sushi (80 pcs)',        desc: 'Assorted maki rolls with baked sushi included. Good for 8–9 pax.',                        price: 1479, emoji: '🍱' },
    { id: 40, name: 'Assorted – Cali / Spicy Overload / Futo (30 pcs)', desc: 'Three-flavor combo platter. Good for 3–4 pax.',                                      price: 559,  emoji: '🍱' },
    { id: 41, name: 'Assorted – Overload / Crazy / California (30 pcs)', desc: 'Best-seller trio platter.',                                                          price: 539,  emoji: '⭐', tag: 'bestseller' },
    { id: 42, name: 'Assorted Maki w/ Baked Sushi (30 pcs)',        desc: 'Mixed maki rolls combined with baked sushi. Good for 5–6 pax.',                           price: 899,  emoji: '🍱' },
    { id: 43, name: 'Assorted – Cali / Futo / Veggies (50 pcs)',    desc: 'Light trio of California, Futo, and veggie rolls. Good for 5–6 pax.',                    price: 999,  emoji: '🍱' },
    { id: 44, name: 'Assorted – Futo / Maru / Veggies (42 pcs)',    desc: 'Hearty combo of futo, maru, and veggie maki. Good for 4–5 pax. Contact us for pricing.', price: 0,    emoji: '🍱' },
    { id: 45, name: '30 pcs Maki Roll – All Baked (Regular)',        desc: 'Full tray of baked maki rolls in regular flavor. Good for 7–8 pax.',                     price: 1349, emoji: '🫙' },
  ],

  // ─────────────────────────────────────────
  // KANI SALAD
  // ─────────────────────────────────────────
  kanisalad: [
    { id: 46, name: 'Kani Salad Platter (Small)',          desc: 'Fresh and creamy kani salad. Good for 4–5 pax.',                                 price: 419, emoji: '🥗' },
    { id: 47, name: 'Kani Salad Platter (Medium)',         desc: 'Fresh and creamy kani salad. Good for 6–7 pax.',                                 price: 499, emoji: '🥗', tag: 'bestseller' },
    { id: 48, name: 'Kani Salad Platter (Large)',          desc: 'Fresh and creamy kani salad. Good for 7–8 pax. Contact us for pricing.',         price: 0,   emoji: '🥗' },
    { id: 49, name: 'Kani Salad Platter (XL)',             desc: 'Fresh and creamy kani salad. Good for 8–9 pax.',                                 price: 799, emoji: '🥗' },
    { id: 50, name: 'Kani / Overload / Haru Maki (32 pcs)', desc: 'Kani, overload, and haru roll combo.',                                         price: 569, emoji: '🥗' },
    { id: 51, name: '30 pcs Maki w/ Kani Salad',          desc: 'Assorted maki rolls served with kani salad on the side.',                        price: 699, emoji: '🍱' },
    { id: 52, name: '50 pcs Maki w/ Kani Salad',          desc: 'Larger maki set paired with kani salad.',                                        price: 699, emoji: '🍱' },
  ],

  // ─────────────────────────────────────────
  // HARU MAKI SALAD
  // ─────────────────────────────────────────
  haru: [
    { id: 53, name: 'Haru Maki Salad (30 pcs)',                    desc: 'Light and fresh haru maki salad rolls. Good for 2–3 pax.',          price: 459,  emoji: '🌿' },
    { id: 54, name: 'Haru Maki Salad (36 pcs)',                    desc: 'Light and fresh haru maki salad rolls. Good for 3–5 pax.',          price: 549,  emoji: '🌿' },
    { id: 55, name: 'Haru Maki Salad (42 pcs)',                    desc: 'Light and fresh haru maki salad rolls. Good for 4–5 pax.',          price: 629,  emoji: '🌿' },
    { id: 56, name: 'Haru Maki Salad (48 pcs)',                    desc: 'Light and fresh haru maki salad rolls. Good for 6–7 pax.',          price: 699,  emoji: '🌿' },
    { id: 57, name: 'Haru Maki Salad (60 pcs)',                    desc: 'Light and fresh haru maki salad rolls. Good for 8–9 pax.',          price: 889,  emoji: '🌿' },
    { id: 58, name: 'Assorted Maki w/ Haru Salad (42 pcs)',        desc: 'Assorted maki and haru maki salad combo. Good for 4–5 pax.',        price: 759,  emoji: '🍱' },
    { id: 59, name: 'Assorted Maki w/ Haru Salad (54 pcs)',        desc: 'Assorted maki and haru maki salad combo. Good for 5–6 pax.',        price: 889,  emoji: '🍱' },
    { id: 60, name: 'Assorted Maki w/ Haru Salad (60 pcs)',        desc: 'Assorted maki and haru maki salad combo. Good for 6–7 pax.',        price: 1149, emoji: '🍱' },
    { id: 61, name: 'Veggie / California / Haru Maki (42–45 pcs)', desc: 'Light trio of veggie, California, and haru rolls. Good for 4–5 pax.', price: 649, emoji: '🌿' },
    { id: 62, name: 'California & Haru Maki (54 pcs)',             desc: 'California and haru maki combo platter. Good for 5–6 pax.',         price: 889,  emoji: '🌿' },
    { id: 63, name: 'Maki w/ Haro Salad (60 pcs)',                 desc: 'Assorted maki rolls paired with haro salad.',                       price: 1447, emoji: '🍱' },
  ],

  // ─────────────────────────────────────────
  // BIRTHDAY SETS
  // ─────────────────────────────────────────
  birthdaysets: [
    { id: 64, name: 'Birthday Set A',           desc: '30 pcs assorted maki + small baked sushi. Includes dedication card, nori & chopsticks. Good for 7–8 pax.',                                         price: 1349, emoji: '🎂', tag: 'bestseller' },
    { id: 65, name: 'Birthday Set B',           desc: 'Assorted maki + large baked sushi + haru maki salad (48 pcs). Includes dedication, nori & chopsticks. Good for 16–18 pax. Contact us for pricing.', price: 0,    emoji: '🎂' },
    { id: 66, name: 'Birthday Set (17–19 pax)', desc: 'Assorted maki, baked sushi & kani salad. Includes dedication & chopsticks. Contact us for pricing.',                                                price: 0,    emoji: '🎂' },
    { id: 67, name: 'Birthday Set (24–25 pax)', desc: '90 pcs assorted maki + 48 pcs haru maki salad. Includes dedication, nori & chopsticks. Contact us for pricing.',                                   price: 0,    emoji: '🎂' },
    { id: 68, name: 'Birthday Set (15–16 pax)', desc: '80 pcs assorted maki + 60 pcs haru maki salad + baked sushi. Includes dedication, nori & free chopsticks. Contact us for pricing.',                price: 0,    emoji: '🎂' },
    { id: 69, name: 'Birthday Set (18–20 pax)', desc: 'Assorted maki + 3-flavor baked sushi + kani salad. Includes dedication & chopsticks. Good for 18–20 pax.',                                        price: 3099, emoji: '🎂' },
  ],

  // ─────────────────────────────────────────
  // PARTY SETS
  // ─────────────────────────────────────────
  partysets: [
    { id: 70, name: 'Party Set (28–30 pax)',            desc: '48 pcs haro maki salad + 70 pcs assorted maki + 2 big baked sushi w/ spicy + kani salad. Free mini haru schiiro included.',             price: 4099, emoji: '🎉', tag: 'bestseller' },
    { id: 71, name: 'Party Set (36–38 pax)',            desc: 'Assorted maki and haru maki salad. Includes mini kani salad (small). Contact us for pricing.',                                          price: 0,    emoji: '🎉' },
    { id: 72, name: 'Party Set (50–52 pax)',            desc: '90 pcs maki + 48 pcs haru maki salad + kani salad. Free nori and chopsticks. Contact us for pricing.',                                  price: 0,    emoji: '🎉' },
    { id: 73, name: 'Party Set Platter (15–17 pax)',    desc: 'Baked sushi (overload maki – best seller), 4 pcs nori & free chopsticks. 30 pcs mini party platter included. Contact us for pricing.', price: 0,    emoji: '🎉' },
    { id: 74, name: 'Birthday Set Platter (20–22 pax)', desc: '90 pcs assorted maki + baked sushi + kani salad + haru maki salad + 70 pc dedication platter. Free nori, chopsticks & dedication card.', price: 2799, emoji: '🎉' },
  ],

  // ─────────────────────────────────────────
  // LARGE ORDERS & BULK
  // ─────────────────────────────────────────
  bulk: [
    { id: 75, name: '90 pcs Assorted Maki Roll',            desc: 'Massive maki platter for big gatherings. Good for 9–10 pax.',         price: 1599, emoji: '📦', tag: 'bestseller' },
    { id: 76, name: '90 pcs Assorted Maki Roll (w/ Spicy)', desc: 'Extra-large assorted platter with spicy option. Good for 10–12 pax.', price: 1959, emoji: '📦', tag: 'spicy' },
  ],

};
