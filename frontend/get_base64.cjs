const fs = require('fs');
['icon-2f0716a5.svg', 'icon-0bb4aee4.svg', 'icon-0645a973.svg', 'icon-bf44f6f0.svg'].forEach(file => {
  const content = fs.readFileSync('static/icons/' + file, 'utf8').replace(/width="100%" height="100%" /, '');
  console.log(file, Buffer.from(content).toString('base64'));
});
