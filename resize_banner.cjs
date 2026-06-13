const sharp = require('sharp');
const path = require('path');

async function resizeBanner() {
  try {
    const inputPath = "C:\\Users\\Michelle\\.gemini\\antigravity-ide\\brain\\8ba991a6-5e1a-4203-a914-b59e5cf1349a\\youtube_banner_slogan_1781043351906.png";
    const outputPath = "C:\\Users\\Michelle\\.gemini\\antigravity-ide\\brain\\8ba991a6-5e1a-4203-a914-b59e5cf1349a\\youtube_banner_slogan_2048x1152.png";

    // YouTube requires 2048 x 1152. We will resize to cover this area
    // and crop the center, which usually works well for abstract backgrounds.
    await sharp(inputPath)
      .resize({
        width: 2048,
        height: 1152,
        fit: 'cover',
        position: 'center'
      })
      .toFile(outputPath);

    console.log("Successfully created banner at:", outputPath);
  } catch (error) {
    console.error("Error resizing banner:", error);
  }
}

resizeBanner();
