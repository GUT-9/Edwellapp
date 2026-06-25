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

const sourceDir = 'F:\\初高中资料';

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

    // Default values
    let stage = 'high'; // Defaulting to high school since most are high school
    let grade = '通用'; // Default to generic
    let subject = '综合';

    // Parse Stage and Grade
    if (title.includes('初中') || title.includes('中考')) {
      stage = 'middle';
      if (title.includes('七年级') || title.includes('初一')) grade = '七年级';
      else if (title.includes('八年级') || title.includes('初二')) grade = '八年级';
      else if (title.includes('九年级') || title.includes('初三')) grade = '九年级';
      else if (title.includes('中考')) grade = '中考复习';
      else if (title.includes('竞赛') || title.includes('奥林匹克')) grade = '竞赛';
    } else {
      stage = 'high';
      if (title.includes('高一')) grade = '高一';
      else if (title.includes('高二')) grade = '高二';
      else if (title.includes('高三')) grade = '高三';
      else if (title.includes('高考')) grade = '高考复习';
      else if (title.includes('竞赛') || title.includes('奥林匹克') || title.includes('联赛') || title.includes('高联')) grade = '竞赛';
    }

    // Parse Subject
    if (title.includes('语文')) subject = '语文';
    else if (title.includes('数学')) subject = '数学';
    else if (title.includes('英语')) subject = '英语';
    else if (title.includes('物理') || title.includes('动力学') || title.includes('动量') || title.includes('牛顿') || title.includes('力学')) subject = '物理';
    else if (title.includes('化学')) subject = '化学';
    else if (title.includes('生物')) subject = '生物';
    else if (title.includes('地理')) subject = '地理';
    else if (title.includes('历史')) subject = '历史';
    else if (title.includes('政治')) subject = '政治';

    // Upload to Qiniu
    const key = `resources/${Date.now()}_${crypto.randomUUID().substring(0,8)}${path.extname(file)}`;
    const localFilePath = path.join(sourceDir, file);
    
    let fileUrl = '';
    try {
      fileUrl = await uploadFile(localFilePath, key);
      console.log(`Uploaded ${title} to Qiniu: ${fileUrl}`);
    } catch (e) {
      console.error(`Failed to upload ${title}:`, e);
      continue; // Skip db insert if upload fails
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
      [id, title, '初高中优化版批量导入资料', fileUrl, coverUrl, ext, stage, grade, subject, authorId, authorName, points, downloads, views]
    );

    count++;
  }

  console.log(`Successfully uploaded and inserted ${count} primary/middle/high school resources!`);
  await connection.end();
}

main().catch(console.error);
