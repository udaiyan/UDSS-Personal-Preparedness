import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Crisp official insignia for UDSS Personal Preparedness
// Deep navy (#1B2A4A), muted gold/cream accent (#D4AF37 / #EAE6DF), muted red (#8B1A1A)
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="#1B2A4A"/>
  
  <!-- Outer subtle institutional ring -->
  <circle cx="256" cy="256" r="236" fill="none" stroke="#D0D0D0" stroke-width="2" opacity="0.3"/>
  <circle cx="256" cy="256" r="216" fill="none" stroke="#FFFFFF" stroke-width="3" opacity="0.8"/>
  
  <!-- Inner Shield / Defence Crest -->
  <path d="M 256 90 L 370 145 C 370 270 256 360 256 410 C 256 360 142 270 142 145 Z" 
        fill="#0E1726" stroke="#FFFFFF" stroke-width="4"/>
  
  <!-- Red accent stripe in centre of shield representing resilience -->
  <path d="M 256 115 L 285 130 C 285 240 256 320 256 375 C 256 320 227 240 227 130 Z" 
        fill="#8B1A1A" opacity="0.95"/>

  <!-- Official Compass / Star of Strategic Defence -->
  <polygon points="256,150 266,220 336,230 266,240 256,310 246,240 176,230 246,220" 
           fill="#FFFFFF"/>

  <!-- Central core dot -->
  <circle cx="256" cy="230" r="4.5" fill="#1B2A4A"/>

  <!-- UDSS Acronym in classical serif style -->
  <text x="256" y="450" 
        text-anchor="middle" 
        font-family="Georgia, 'Times New Roman', serif" 
        font-size="34" 
        font-weight="bold" 
        letter-spacing="5" 
        fill="#FFFFFF">UDSS</text>

  <text x="256" y="475" 
        text-anchor="middle" 
        font-family="system-ui, -apple-system, sans-serif" 
        font-size="13" 
        font-weight="600" 
        letter-spacing="3" 
        fill="#D0D0D0">RESILIENCE BRIEF</text>
</svg>`;

// Maskable icon with safe margins (central 80%)
const svgMaskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="#1B2A4A"/>
  
  <!-- Safe zone contained content (inside 410x410) -->
  <circle cx="256" cy="256" r="185" fill="none" stroke="#FFFFFF" stroke-width="3" opacity="0.8"/>
  
  <path d="M 256 120 L 350 165 C 350 265 256 340 256 380 C 256 340 162 265 162 165 Z" 
        fill="#0E1726" stroke="#FFFFFF" stroke-width="4"/>
  
  <path d="M 256 140 L 280 152 C 280 240 256 308 256 352 C 256 308 232 240 232 152 Z" 
        fill="#8B1A1A" opacity="0.95"/>

  <polygon points="256,170 264,228 322,236 264,244 256,302 248,244 190,236 248,228" 
           fill="#FFFFFF"/>

  <circle cx="256" cy="236" r="4" fill="#1B2A4A"/>

  <text x="256" y="416" 
        text-anchor="middle" 
        font-family="Georgia, 'Times New Roman', serif" 
        font-size="28" 
        font-weight="bold" 
        letter-spacing="4" 
        fill="#FFFFFF">UDSS</text>
</svg>`;

async function generate() {
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon, 'utf-8');
  console.log('Wrote public/icon.svg');

  // Convert to PNGs
  const buffer = Buffer.from(svgIcon);
  const maskableBuffer = Buffer.from(svgMaskable);

  await sharp(buffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Wrote public/pwa-512x512.png');

  await sharp(buffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Wrote public/pwa-192x192.png');

  await sharp(buffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Wrote public/apple-touch-icon.png');

  await sharp(buffer)
    .resize(48, 48)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));
  console.log('Wrote public/favicon.png');

  await sharp(maskableBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Wrote public/pwa-maskable-512x512.png');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
