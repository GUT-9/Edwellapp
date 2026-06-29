const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    const dirent = fs.statSync(dirFile);
    if (dirent.isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.vue')) {
        filelist.push(dirFile);
      }
    }
  }
  return filelist;
};

const vueFiles = walkSync('pages');
let counter = 0;

vueFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // regex to match our generated view tags
  const regex = /<view[^>]*style="([^"]*)"[^>]*><\/view>/gi;

  content = content.replace(regex, (match, styleAttr) => {
    // Find base64 URL
    const b64Match = styleAttr.match(/url\('data:image\/svg\+xml;base64,([^']+)'\)/);
    if (!b64Match) return match;
    const b64 = b64Match[1];
    
    const svgContent = Buffer.from(b64, 'base64').toString('utf8');
    const hash = crypto.createHash('md5').update(svgContent).digest('hex').substring(0, 8);
    const filename = `icon-${hash}.svg`;
    const filepath = path.join('static', 'icons', filename);
    
    if (!fs.existsSync(filepath)) {
      fs.writeFileSync(filepath, svgContent, 'utf8');
    }

    // reconstruct class
    const classMatch = match.match(/class="([^"]*)"/);
    const cls = classMatch ? classMatch[1] : '';

    changed = true;
    counter++;
    return `<image src="/static/icons/${filename}" class="${cls}" mode="aspectFit" />`;
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Extracted SVGs to static/icons in', file);
  }
});
console.log('Extracted', counter, 'icons in total.');
