const fs = require('fs');
const path = require('path');

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

vueFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Regex to match a tag starting with <view style="background-image: url('data:image/svg+xml;base64,...
  const regex = /<view\s+style="background-image:\s*url\('data:image\/svg\+xml;base64,[^']+'\);\s*background-size:\s*contain;\s*background-repeat:\s*no-repeat;\s*background-position:\s*center;"([^>]+)><\/view>/gi;

  content = content.replace(regex, (match, otherAttrs) => {
    // Extract base64 URL
    const b64Match = match.match(/url\('data:image\/svg\+xml;base64,([^']+)'\)/);
    if (!b64Match) return match;
    const b64 = b64Match[1];

    // Find all style attributes
    const styleMatches = [...match.matchAll(/style="([^"]*)"/g)];
    let combinedStyle = '';
    for (const m of styleMatches) {
        if (!m[1].includes('background-image')) {
            combinedStyle += m[1] + (m[1].endsWith(';') ? ' ' : '; ');
        }
    }
    
    // add background-image back
    combinedStyle += `background-image: url('data:image/svg+xml;base64,${b64}'); background-size: contain; background-repeat: no-repeat; background-position: center;`;

    // Extract class
    const classMatch = match.match(/class="([^"]*)"/);
    const cls = classMatch ? `class="${classMatch[1]}"` : '';

    changed = true;
    return `<view ${cls} style="${combinedStyle.trim()}"></view>`;
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed styles in', file);
  }
});
