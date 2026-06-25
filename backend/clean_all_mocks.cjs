const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'xueyuanhui',
    charset: 'utf8mb4'
  });

  const idsToDelete = ['1', '2', '3', '4', '5', 'res-mock-1', 'res-mock-2', 'res-mock-3', 'res-mock-4', 'res-mock-5'];

  for (const id of idsToDelete) {
      await connection.query('DELETE FROM favorite WHERE resource_id = ?', [id]);
      await connection.query('DELETE FROM download_record WHERE resource_id = ?', [id]);
      await connection.query('DELETE FROM `resource` WHERE id = ?', [id]);
  }
  
  console.log(`Deleted all remaining mock resources completely!`);
  await connection.end();
}

main().catch(console.error);
