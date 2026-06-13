const sharp = require('sharp');
const path = require('path');

async function createOgImage() {
  const logoPath = path.join(__dirname, 'src', 'assets', 'herflowmate-logo-white.png');
  const outPath = path.join(__dirname, 'public', 'og-image.png');

  try {
    const resizedLogo = await sharp(logoPath)
      .resize({ width: 800, height: 400, fit: 'inside' })
      .toBuffer();

    await sharp({
      create: {
        width: 1200,
        height: 630,
        channels: 4,
        // Lavender purple background
        background: { r: 187, g: 168, b: 255, alpha: 1 }
      }
    })
    .composite([
      { input: resizedLogo, gravity: 'center' }
    ])
    .png()
    .toFile(outPath);
    
    console.log("SUCCESS");
  } catch (err) {
    console.error("ERROR", err);
  }
}

createOgImage();
