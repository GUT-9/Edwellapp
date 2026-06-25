const fs = require('fs');
const path = require('path');
const iconsDir = 'static/icons';

if (fs.existsSync(iconsDir)) {
  fs.readdirSync(iconsDir).forEach(file => {
    if (file.endsWith('.svg')) {
      const filepath = path.join(iconsDir, file);
      let content = fs.readFileSync(filepath, 'utf8');
      
      // If it already has our injected width="100%", skip it
      if (!content.includes('width="100%"')) {
        // Find the first <svg ...> tag and insert width and height right after <svg
        content = content.replace(/<svg\s/i, '<svg width="100%" height="100%" ');
        fs.writeFileSync(filepath, content);
      }
    }
  });
  console.log('Fixed SVG dimensions correctly in static/icons');
}
