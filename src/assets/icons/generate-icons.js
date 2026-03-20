// Generate simple LinkedIn-style icons as SVG->PNG placeholders
const { createCanvas } = require('canvas');
// We'll use a simple approach - create colored squares with "Li" text
// Since we can't use canvas in Node without packages, we'll create SVG files
const fs = require('fs');

const sizes = [16, 48, 128];
sizes.forEach(size => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${size*0.15}" fill="#0a66c2"/>
    <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial,sans-serif" font-weight="bold" font-size="${size*0.45}">Li</text>
    <text x="50%" y="82%" dominant-baseline="middle" text-anchor="middle" fill="#70b5f9" font-family="Arial,sans-serif" font-weight="600" font-size="${size*0.18}">POST</text>
  </svg>`;
  fs.writeFileSync(`icon-${size}.svg`, svg);
});
