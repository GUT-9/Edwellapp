const fs = require('fs');

const files = [
  'pages/index/index.vue',
  'pages/login/login.vue'
];

files.forEach(f => {
  let code = fs.readFileSync(f, 'utf8');
  
  // Also fix Tailwind classes not applying to SVG by injecting inline styles
  code = code.replace(/<svg(.*?)class="([^"]*?)"(.*?)>/g, (match, p1, p2, p3) => {
    let size = 20;
    if (p2.includes('w-8')) size = 32;
    else if (p2.includes('w-6')) size = 24;
    else if (p2.includes('w-5')) size = 20;
    else if (p2.includes('w-4.5')) size = 18;
    else if (p2.includes('w-4')) size = 16;
    else if (p2.includes('w-3.5')) size = 14;
    else if (p2.includes('w-3')) size = 12;

    // Check if it already has inline style
    if (match.includes('style=')) return match;

    return `<svg${p1}class="${p2}" style="width: ${size}px; height: ${size}px; flex-shrink: 0;"${p3}>`;
  });
  
  fs.writeFileSync(f, code);
  console.log('Updated ' + f);
});
