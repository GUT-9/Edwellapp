const mysql = require('mysql2/promise');
async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'xueyuanhui',
    charset: 'utf8mb4'
  });
  const [result] = await connection.query("UPDATE resource SET cover_url = '' WHERE cover_url LIKE '%unsplash%'");
  console.log(`Updated ${result.affectedRows} rows`);
  await connection.end();
}
main().catch(console.error);
