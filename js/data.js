/* ══════════════════════════════════════
   data.js — Menu categories & items
══════════════════════════════════════ */

const categories = [
  { id: 'bestsellers', label: 'Best Sellers', emoji: '🔥', desc: 'Our most-ordered sushi and maki rolls' },
  { id: 'maki',        label: 'Maki Rolls',   emoji: '🌀', desc: 'Classic and specialty maki rolls' },
  { id: 'sushi',       label: 'Nigiri/Sushi', emoji: '🍣', desc: 'Premium fresh nigiri and sushi pieces' },
  { id: 'sets',        label: 'Sushi Sets',   emoji: '🍱', desc: 'Complete sushi sets — great for sharing!' },
  { id: 'extras',      label: 'Add-Ons',      emoji: '🥢', desc: 'Sides, sauces, and add-ons' },
  { id: 'drinks',      label: 'Drinks',       emoji: '🥤', desc: 'Refreshing beverages to go with your meal' },
];

const menu = {
  bestsellers: [
    { id: 1,  name: 'Dragon Roll',       desc: 'Crispy shrimp tempura, cucumber, topped with avocado & tobiko', price: 299, emoji: '🐉', tag: 'bestseller', image: 'images/dragon-roll.jpg' },
    { id: 2,  name: 'Spicy Tuna Maki',   desc: 'Fresh tuna with sriracha mayo and cucumber (8 pcs)',            price: 249, emoji: '🌶️', tag: 'spicy',      image: 'images/spicy-tuna-maki.jpg' },
    { id: 3,  name: 'California Roll',   desc: 'Crab stick, avocado, cucumber, sesame seeds (8 pcs)',           price: 199, emoji: '🌀', tag: 'bestseller', image: 'images/california-roll.jpg' },
    { id: 4,  name: 'Salmon Nigiri Set', desc: 'Premium fresh salmon slices over seasoned rice (6 pcs)',        price: 329, emoji: '🍣', tag: 'bestseller', image: 'images/salmon-nigiri-set.jpg' },
  ],
  maki: [
    { id: 5,  name: 'California Roll',    desc: 'Crab stick, avocado, cucumber, sesame seeds (8 pcs)', price: 199, emoji: '🌀',  image: 'images/california-roll.jpg' },
    { id: 6,  name: 'Spicy Tuna Roll',    desc: 'Tuna with spicy mayo and cucumber (8 pcs)',           price: 249, emoji: '🌶️', tag: 'spicy',      image: 'images/spicy-tuna-maki.jpg' },
    { id: 7,  name: 'Ebi Tempura Roll',   desc: 'Crispy shrimp tempura, kani, cucumber (8 pcs)',       price: 259, emoji: '🍤', tag: 'new',        image: 'images/ebi-tempura-roll.jpg' },
    { id: 8,  name: 'Philadelphia Roll',  desc: 'Cream cheese, salmon, cucumber (8 pcs)',               price: 279, emoji: '🧀',  image: 'images/philadelphia-roll.jpg' },
    { id: 9,  name: 'Rainbow Roll',       desc: 'Mixed toppings over California roll (8 pcs)',          price: 319, emoji: '🌈', tag: 'bestseller', image: 'images/rainbow-roll.jpg' },
    { id: 10, name: 'Avocado Roll',       desc: 'Fresh avocado and cucumber (8 pcs)',                   price: 179, emoji: '🥑',  image: 'images/avocado-roll.jpg' },
  ],
  sushi: [
    { id: 11, name: 'Salmon Nigiri', desc: 'Fresh salmon over seasoned sushi rice (2 pcs)',       price: 129, emoji: '🍣', tag: 'bestseller', image: 'images/salmon-nigiri.jpg' },
    { id: 12, name: 'Tuna Nigiri',   desc: 'Premium tuna over seasoned sushi rice (2 pcs)',       price: 139, emoji: '🍣',  image: 'images/tuna-nigiri.jpg' },
    { id: 13, name: 'Ebi Nigiri',    desc: 'Cooked shrimp over seasoned sushi rice (2 pcs)',      price: 119, emoji: '🍤',  image: 'images/ebi-nigiri.jpg' },
    { id: 14, name: 'Tamago Nigiri', desc: 'Japanese sweet egg over sushi rice (2 pcs)',          price:  99, emoji: '🥚', tag: 'new',        image: 'images/tamago-nigiri.jpg' },
  ],
  sets: [
    { id: 15, name: 'Sushi Platter A',  desc: '20 pcs assorted maki + 6 nigiri — perfect for 2–3 pax', price:  699, emoji: '🍱', tag: 'bestseller', image: 'images/sushi-platter-a.jpg' },
    { id: 16, name: 'Family Set',       desc: '40 pcs assorted maki + 12 nigiri — feeds 4–6 pax',      price: 1299, emoji: '👨‍👩‍👧‍👦',  image: 'images/family-set.jpg' },
    { id: 17, name: 'Solo Set',         desc: '8 pcs maki + 4 nigiri + 1 miso soup',                    price:  349, emoji: '👤',  image: 'images/solo-set.jpg' },
    { id: 18, name: 'Barkada Bundle',   desc: '32 pcs maki + 8 nigiri + 4 drinks',                      price:  999, emoji: '🎉', tag: 'new',        image: 'images/barkada-bundle.jpg' },
  ],
  extras: [
    { id: 19, name: 'Extra Wasabi',    desc: 'Side of fresh wasabi paste',               price: 25, emoji: '💚',  image: 'images/wasabi.jpg' },
    { id: 20, name: 'Extra Soy Sauce', desc: 'Premium soy sauce, 50ml',                  price: 20, emoji: '🫙',  image: 'images/soy-sauce.jpg' },
    { id: 21, name: 'Miso Soup',       desc: 'Traditional Japanese miso soup with tofu', price: 75, emoji: '🍵',  image: 'images/miso-soup.jpg' },
    { id: 22, name: 'Edamame',         desc: 'Steamed salted edamame beans',              price: 99, emoji: '🫛', tag: 'new', image: 'images/edamame.jpg' },
  ],
  drinks: [
    { id: 23, name: 'Japanese Green Tea', desc: 'Hot or iced authentic green tea',                 price: 69, emoji: '🍵',  image: 'images/green-tea.jpg' },
    { id: 24, name: 'Ramune Soda',        desc: 'Classic Japanese marble soda — assorted flavors', price: 89, emoji: '🫧', tag: 'new', image: 'images/ramune-soda.jpg' },
    { id: 25, name: 'Calamansi Juice',    desc: 'Fresh squeezed calamansi, lightly sweetened',     price: 55, emoji: '🍋',  image: 'images/calamansi-juice.jpg' },
    { id: 26, name: 'Bottled Water',      desc: '500ml chilled mineral water',                      price: 30, emoji: '💧',  image: 'images/water.jpg' },
  ],
};
