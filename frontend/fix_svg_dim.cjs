const fs = require('fs');
const path = require('path');
const iconsDir = 'static/icons';

if (fs.existsSync(iconsDir)) {
  fs.readdirSync(iconsDir).forEach(file => {
    if (file.endsWith('.svg')) {
      const filepath = path.join(iconsDir, file);
      let content = fs.readFileSync(filepath, 'utf8');
      if (!content.includes('width="')) {
        content = content.replace(/<svg\s/, '<svg width="100%" height="100%" ');
        fs.writeFileSync(filepath, content);
      }
    }
  });
  console.log('Fixed SVG dimensions in static/icons');
}
