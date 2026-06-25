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

  // 1. Fix the ones I already converted to <image src="data:image/svg+xml,...">
  content = content.replace(/<image src="data:image\/svg\+xml;base64,([^"]+)"([^>]*)\/>/g, (match, b64, rest) => {
    try {
      changed = true;
      let classMatch = rest.match(/class="([^"]*)"/);
      let styleMatch = rest.match(/style="([^"]*)"/);
      let cls = classMatch ? `class="${classMatch[1]}"` : '';
      let existingStyle = styleMatch ? styleMatch[1] : '';
      let stl = `style="${existingStyle}${existingStyle && !existingStyle.endsWith(';') ? ';' : ''} background-image: url('data:image/svg+xml;base64,${b64}'); background-size: contain; background-repeat: no-repeat; background-position: center;"`;
      
      // Remove the old class and style from rest
      let cleanRest = rest.replace(/class="[^"]*"/, '').replace(/style="[^"]*"/, '').replace(/mode="[^"]*"/, '');

      return `<view ${cls} ${stl} ${cleanRest}></view>`;
    } catch (e) {
      return match;
    }
  });

  // 2. Find remaining <svg> tags and convert them
  // This is a naive regex for SVGs without nested <svg> tags
  content = content.replace(/<svg\s([^>]*)>([\s\S]*?)<\/svg>/gi, (match, svgAttrs, innerContent) => {
    // Determine color from class if present, or use currentColor
    let strokeColor = 'currentColor';
    let fillColor = 'none';

    if (svgAttrs.includes('fill="currentColor"')) {
      fillColor = 'currentColor';
    } else if (svgAttrs.includes('fill="none"')) {
      fillColor = 'none';
    }

    if (svgAttrs.includes('text-rose-500')) strokeColor = '#f43f5e';
    if (svgAttrs.includes('text-amber-500')) strokeColor = '#f59e0b';
    if (svgAttrs.includes('text-emerald-500')) strokeColor = '#10b981';
    if (svgAttrs.includes('text-indigo-500')) strokeColor = '#6366f1';
    if (svgAttrs.includes('text-slate-400')) strokeColor = '#94a3b8';
    if (svgAttrs.includes('text-slate-500')) strokeColor = '#64748b';
    if (svgAttrs.includes('text-[#00685f]')) strokeColor = '#00685f';
    if (svgAttrs.includes('text-white')) strokeColor = '#ffffff';

    if (svgAttrs.includes('fill="currentColor"')) {
        if (svgAttrs.includes('text-rose-500')) fillColor = '#f43f5e';
        if (svgAttrs.includes('text-amber-500')) fillColor = '#f59e0b';
        if (svgAttrs.includes('text-emerald-500')) fillColor = '#10b981';
        if (svgAttrs.includes('text-indigo-500')) fillColor = '#6366f1';
        if (svgAttrs.includes('text-slate-400')) fillColor = '#94a3b8';
        if (svgAttrs.includes('text-slate-500')) fillColor = '#64748b';
        if (svgAttrs.includes('text-[#00685f]')) fillColor = '#00685f';
        if (svgAttrs.includes('text-white')) fillColor = '#ffffff';
    }

    // reconstruct svg
    let cleanSvgAttrs = svgAttrs.replace(/class="[^"]*"/, '').replace(/style="[^"]*"/, '');
    cleanSvgAttrs = cleanSvgAttrs.replace(/stroke="currentColor"/, `stroke="${strokeColor}"`);
    cleanSvgAttrs = cleanSvgAttrs.replace(/fill="currentColor"/, `fill="${fillColor}"`);

    const finalSvg = `<svg xmlns="http://www.w3.org/2000/svg" ${cleanSvgAttrs}>${innerContent}</svg>`;
    const b64 = Buffer.from(finalSvg).toString('base64');

    // Extract class and style
    let classMatch = svgAttrs.match(/class="([^"]*)"/);
    let styleMatch = svgAttrs.match(/style="([^"]*)"/);
    let cls = classMatch ? `class="${classMatch[1]}"` : '';
    
    let existingStyle = styleMatch ? styleMatch[1] : '';
    let stl = `style="${existingStyle}${existingStyle && !existingStyle.endsWith(';') ? ';' : ''} background-image: url('data:image/svg+xml;base64,${b64}'); background-size: contain; background-repeat: no-repeat; background-position: center;"`;

    changed = true;
    return `<view ${cls} ${stl}></view>`;
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated SVGs in ${file}`);
  }
});

console.log('Done');
