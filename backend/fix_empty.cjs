const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'xueyuanhui',
    charset: 'utf8mb4'
  });
  const [result] = await connection.query("UPDATE resource SET cover_url = '' WHERE cover_url = 'https://img.yzcdn.cn/vant/cat.jpeg'");
  console.log(`Reverted ${result.affectedRows} cat covers to empty`);
  await connection.end();
}

main().catch(console.error);
