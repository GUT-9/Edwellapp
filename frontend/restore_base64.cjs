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

  // regex to match our generated image tags
  const regex = /<image src="\/static\/icons\/([^"]+)"\s*(class="[^"]*")?\s*mode="aspectFit"\s*\/>/gi;

  content = content.replace(regex, (match, svgFile, cls) => {
    const filepath = path.join('static', 'icons', svgFile);
    if (!fs.existsSync(filepath)) return match;
    
    let svgContent = fs.readFileSync(filepath, 'utf8');
    // Remove the injected width="100%" height="100%" just in case it breaks base64 rendering in some environments
    svgContent = svgContent.replace(/width="100%" height="100%" /, '');
    
    const b64 = Buffer.from(svgContent).toString('base64');
    changed = true;
    
    const clsStr = cls ? cls : '';
    return `<view ${clsStr} style="background-image: url('data:image/svg+xml;base64,${b64}'); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>`;
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Restored base64 SVGs in', file);
  }
});
