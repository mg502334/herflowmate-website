const fs = require('fs');
const path = require('path');

const filePath = 'src/app/pages/CustomOrderPage.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace all unsplash links with placehold.co generic links that work
content = content.replace(/image: "https:\/\/images\.unsplash\.com\/[^"]+"/g, (match) => {
    // We can't easily extract brand names here via simple regex because brand name is lines above,
    // so we'll just use a generic working placeholder for all of them that matches the theme.
    return `image: "https://placehold.co/400x400/FDF1F3/2C3E50?font=playfair-display&text=Product\\nPackaging"`;
});

// Replace the single hardcoded image in handleAddBoxToCart
content = content.replace(
  /image: "https:\/\/images\.unsplash\.com\/photo-1601379327190-[^"]+"/,
  `image: "https://placehold.co/600x700/FDF1F3/2C3E50?font=playfair-display&text=Your\\nCustom\\nBox"`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed CustomOrderPage.tsx images!');
