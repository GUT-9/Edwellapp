const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const qiniu = require('qiniu');

// Qiniu Setup
const accessKey = 'zfc9y0LL6rUe5b6dz0c43yOx7cKOxtHn4bON76rz';
const secretKey = 'yoJYJH0AnqKFFcSVJUONwA-OSxwP4jzFvAlefJwL';
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const config = new qiniu.conf.Config();
const bucket = 'edwell-k12';
const domain = 'http://oss.gut9.cn/';

function uploadFile(localFile, key) {
  return new Promise((resolve, reject) => {
    const putPolicy = new qiniu.rs.PutPolicy({ scope: bucket + ":" + key });
    const uploadToken = putPolicy.uploadToken(mac);
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();
    
    formUploader.putFile(uploadToken, key, localFile, putExtra, function(respErr, respBody, respInfo) {
      if (respErr) {
        reject(respErr);
      } else if (respInfo.statusCode === 200) {
        resolve(domain + key);
      } else {
        reject(new Error("Qiniu upload failed: " + respInfo.statusCode));
      }
    });
  });
}

const sourceDir = 'F:\\小学资料';

async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'xueyuanhui',
    charset: 'utf8mb4'
  });

  const files = fs.readdirSync(sourceDir);
  console.log(`Found ${files.length} files. Beginning upload to Qiniu and DB insert...`);

  let count = 0;
  for (const file of files) {
    const ext = path.extname(file).toUpperCase().replace('.', '');
    if (!['PDF', 'DOC', 'DOCX', 'PPT', 'PPTX', 'MP4'].includes(ext)) continue;

    const title = path.basename(file, path.extname(file));

    // Check if already in DB
    const [rows] = await connection.query('SELECT id FROM `resource` WHERE title = ?', [title]);
    if (rows.length > 0) {
      continue;
    }

    // Parse metadata
    let stage = 'primary';
    let grade = '小学';
    if (title.includes('新一')) grade = '一年级';
    if (title.includes('新二')) grade = '二年级';
    if (title.includes('新三')) grade = '三年级';
    if (title.includes('新四')) grade = '四年级';
    if (title.includes('新五')) grade = '五年级';
    if (title.includes('新六')) grade = '六年级';
    
    let subject = '综合';
    if (title.includes('语文')) subject = '语文';
    if (title.includes('数学')) subject = '数学';
    if (title.includes('英语')) subject = '英语';
    if (title.includes('科学')) subject = '科学';

    // Upload to Qiniu
    const key = `resources/${Date.now()}_${crypto.randomUUID().substring(0,8)}${path.extname(file)}`;
    const localFilePath = path.join(sourceDir, file);
    
    let fileUrl = '';
    try {
      fileUrl = await uploadFile(localFilePath, key);
      console.log(`Uploaded ${title} to Qiniu: ${fileUrl}`);
    } catch (e) {
      console.error(`Failed to upload ${title}:`, e);
      continue;
    }

    const id = "res" + crypto.randomUUID().replace(/-/g, "").substring(0, 10);
    const authorId = 'u-admin-1';
    const authorName = '系统管理员';
    const downloads = Math.floor(Math.random() * 500);
    const points = Math.floor(Math.random() * 10);
    const views = Math.floor(Math.random() * 1000) + 100;
    const coverUrl = ext === 'PDF' ? 'https://img.yzcdn.cn/vant/cat.jpeg' : '';

    await connection.query(
      `INSERT INTO \`resource\` 
      (id, title, description, file_url, cover_url, file_type, stage, grade, subject, author_id, author_name, points, downloads, views, status, create_time) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', NOW())`,
      [id, title, '批量导入资料', fileUrl, coverUrl, ext, stage, grade, subject, authorId, authorName, points, downloads, views]
    );

    count++;
  }

  console.log(`Successfully uploaded and inserted ${count} resources into MySQL!`);
  await connection.end();
}

main().catch(console.error);
