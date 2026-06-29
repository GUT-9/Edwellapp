const fs = require('fs');
const http = require('https');
const path = require('path');

const dir = path.join(__dirname, 'static', 'tabbar');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const icons = {
  'home.png': 'https://img.icons8.com/ios-filled/50/94a3b8/home.png',
  'home_active.png': 'https://img.icons8.com/ios-filled/50/00685f/home.png',
  'book.png': 'https://img.icons8.com/ios-filled/50/94a3b8/book.png',
  'book_active.png': 'https://img.icons8.com/ios-filled/50/00685f/book.png',
  'upload.png': 'https://img.icons8.com/ios-filled/50/94a3b8/upload.png',
  'upload_active.png': 'https://img.icons8.com/ios-filled/50/00685f/upload.png',
  'user.png': 'https://img.icons8.com/ios-filled/50/94a3b8/user.png',
  'user_active.png': 'https://img.icons8.com/ios-filled/50/00685f/user.png',
};

async function download(url, filename) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      const file = fs.createWriteStream(path.join(dir, filename));
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function main() {
  for (const [filename, url] of Object.entries(icons)) {
    console.log(`Downloading ${filename}...`);
    await download(url, filename);
  }
  console.log("All icons downloaded.");
}

main().catch(console.error);
