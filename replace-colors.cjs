const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'app', 'components');

const colorMap = {
  '#48B0B0': '#F8C8D1', // Teal -> Soft Pink Pastel
  '#F5B7B1': '#B0C4DE', // Pink Pastel -> Blue Pastel
  '#D4AF37': '#FFFFFF', // Gold -> White
  '#E6F7F7': '#FDF1F3', // Light Mint -> Light Pink
  '#FDFCFD': '#FAFAFA', // Soft Off-White -> White-ish
  '#112E2E': '#2C3E50'  // Dark Teal -> Slate
};

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      processDirectory(filePath);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.css')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      Object.entries(colorMap).forEach(([oldColor, newColor]) => {
        const regex = new RegExp(oldColor, 'gi');
        if (regex.test(content)) {
          content = content.replace(regex, newColor);
          modified = true;
        }
      });

      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
      }
    }
  });
}

processDirectory(directoryPath);

// Also check App.tsx and main.tsx
['App.tsx', 'main.tsx', 'app/App.tsx'].forEach(file => {
  const filePath = path.join(__dirname, 'src', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    Object.entries(colorMap).forEach(([oldColor, newColor]) => {
      const regex = new RegExp(oldColor, 'gi');
      if (regex.test(content)) {
        content = content.replace(regex, newColor);
        modified = true;
      }
    });
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});

console.log("Color replacement complete.");
