const mysql = require('mysql2/promise');
async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'xueyuanhui',
    charset: 'utf8mb4'
  });
  const [result] = await connection.query("DELETE FROM user WHERE username LIKE '%****%'");
  console.log(`Deleted ${result.affectedRows} corrupted users`);
  await connection.end();
}
main().catch(console.error);
