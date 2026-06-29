const fs = require('fs');

const subjects = {
  'chinese': ['语文', '#fef2f2', '#dc2626'],
  'math': ['数学', '#eff6ff', '#2563eb'],
  'english': ['英语', '#f3e8ff', '#7c3aed'],
  'physics': ['物理', '#f0fdf4', '#16a34a'],
  'chemistry': ['化学', '#f8fafc', '#475569'],
  'biology': ['生物', '#ecfdf5', '#059669'],
  'history': ['历史', '#fffbeb', '#d97706'],
  'geography': ['地理', '#ecfeff', '#0891b2'],
  'science': ['科学', '#f0fdfa', '#0d9488'],
  'politics': ['道德与法治', '#fff1f2', '#e11d48'],
  'default': ['教学资料', '#f8fafc', '#64748b']
};

let jsContent = 'export const fallbackCovers = {\n';

for (const [key, [name, bg, text]] of Object.entries(subjects)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="${bg}"/><text x="50%" y="50%" font-family="sans-serif" font-size="48" font-weight="bold" fill="${text}" dominant-baseline="middle" text-anchor="middle">${name}</text><path d="M150 200 L250 200 M180 220 L220 220" stroke="${text}" stroke-width="4" stroke-linecap="round" opacity="0.5"/></svg>`;
  const base64 = Buffer.from(svg).toString('base64');
  jsContent += `  '${name}': 'data:image/svg+xml;base64,${base64}',\n`;
}

jsContent += '};\n\nexport const getFallbackCover = (subject) => {\n  return fallbackCovers[subject] || fallbackCovers["教学资料"];\n};\n';

fs.writeFileSync('G:/JAVA/shixun/EdWell/uniapp-project/utils/fallbackCovers.js', jsContent, 'utf8');
console.log('fallbackCovers.js created successfully.');
