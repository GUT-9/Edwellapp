const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'xueyuanhui',
    charset: 'utf8mb4'
  });

  const sqls = [
    `INSERT IGNORE INTO \`user\` (id, phone, password, username, role, points, avatar_url, create_time) VALUES
    ('u-admin-1', '13800000000', '123456', '系统管理员', 'admin', 9999, 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', NOW()),
    ('u-test-1', '13900000000', '123456', '测试老师', 'user', 100, 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher', NOW())`,

    `INSERT IGNORE INTO \`resource\` (id, title, description, file_url, cover_url, file_type, stage, grade, subject, author_id, author_name, points, downloads, views, status, create_time) VALUES
    ('res-mock-1', '小学语文三年级下册第一单元教案', '包含完整的PPT和教案设计', 'http://example.com/mock.pdf', 'https://img.yzcdn.cn/vant/cat.jpeg', 'PDF', 'primary', '三年级', '语文', 'u-admin-1', '系统管理员', 5, 120, 350, 'approved', NOW()),
    ('res-mock-2', '初中数学中考真题汇编', '2020-2023年中考数学真题', 'http://example.com/mock.pdf', 'https://img.yzcdn.cn/vant/cat.jpeg', 'WORD', 'middle', '九年级', '数学', 'u-admin-1', '系统管理员', 10, 890, 1200, 'approved', NOW()),
    ('res-mock-3', '高中物理必修一知识点总结', '牛顿运动定律核心归纳', 'http://example.com/mock.pdf', 'https://img.yzcdn.cn/vant/cat.jpeg', 'PPT', 'high', '高一', '物理', 'u-test-1', '测试老师', 0, 45, 110, 'approved', NOW()),
    ('res-mock-4', '小学英语启蒙儿歌视频合集', '适合一二年级的英语启蒙教学素材', 'http://example.com/mock.mp4', 'https://img.yzcdn.cn/vant/cat.jpeg', 'VIDEO', 'primary', '一年级', '英语', 'u-admin-1', '系统管理员', 20, 320, 890, 'approved', NOW()),
    ('res-mock-5', '高中化学实验演示视频大全', '高一高二核心化学实验视频记录', 'http://example.com/mock.mp4', 'https://img.yzcdn.cn/vant/cat.jpeg', 'VIDEO', 'high', '高二', '化学', 'u-test-1', '测试老师', 15, 60, 200, 'pending', NOW())`
  ];

  for (const sql of sqls) {
    await connection.query(sql);
  }
  
  console.log("Mock data inserted successfully!");
  await connection.end();
}

main().catch(console.error);
