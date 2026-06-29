const fs = require('fs');

const files = ['pages/index/index.vue', 'pages/login/login.vue'];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace(/<view style="background-image: url\('data:image\/svg\+xml;base64,([^']+)'\); background-size: contain; background-repeat: no-repeat; background-position: center;"\s+class="([^"]*)"\s+style="([^"]*)"\s+mode="aspectFit"\s+><\/view>/g, (match, b64, cls, stl) => {
      return `<view class="${cls}" style="${stl}; background-image: url('data:image/svg+xml;base64,${b64}'); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>`;
    });
    fs.writeFileSync(f, c);
    console.log('Fixed', f);
  }
});
