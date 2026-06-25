const mysql = require('mysql2/promise');
async function fix() {
  const c = await mysql.createConnection({host:'127.0.0.1',user:'root',password:'root',database:'xueyuanhui'});
  await c.query("UPDATE resource SET cover_url = REPLACE(cover_url, 'http://oss.gut9.cn', 'https://oss.gut9.cn')");
  await c.query("UPDATE resource SET file_url = REPLACE(file_url, 'http://oss.gut9.cn', 'https://oss.gut9.cn')");
  await c.query("UPDATE user SET avatar_url = REPLACE(avatar_url, 'http://oss.gut9.cn', 'https://oss.gut9.cn')");
  console.log("Fixed http links");
  process.exit();
}
fix();
