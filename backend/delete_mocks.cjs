const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'xueyuanhui',
    charset: 'utf8mb4'
  });

  // Delete all resources where the ID starts with 'res-mock' 
  // and also delete any records in point_record, download_record, favorite that point to them.
  const [mocks] = await connection.query('SELECT id FROM `resource` WHERE id LIKE "res-mock%"');
  for (let mock of mocks) {
      await connection.query('DELETE FROM favorite WHERE resource_id = ?', [mock.id]);
      await connection.query('DELETE FROM download_record WHERE resource_id = ?', [mock.id]);
  }
  
  const [result] = await connection.query('DELETE FROM `resource` WHERE id LIKE "res-mock%"');
  
  console.log(`Deleted ${result.affectedRows} fake mock resources successfully!`);
  await connection.end();
}

main().catch(console.error);
