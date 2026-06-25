const mysql = require('mysql2/promise');

async function main() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'xueyuanhui',
      charset: 'utf8mb4'
    });

    await connection.query("UPDATE resource SET cover_url = 'https://img.yzcdn.cn/vant/cat.jpeg' WHERE cover_url LIKE '%unsplash%'");
    console.log("Updated db successfully");
    await connection.end();
  } catch (err) {
    console.error(err);
  }
}

main();
