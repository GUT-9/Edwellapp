const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const sourceDir = 'F:\\小学资料';
const uploadsDir = path.join(__dirname, 'uploads');
const jsonFile = path.join(__dirname, 'resources.json');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

let existingResources = [];
try {
  if (fs.existsSync(jsonFile)) {
    existingResources = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
  }
} catch (e) {}

// Read original mock to get existing length or just start appending
let resources = existingResources.length > 0 ? existingResources : [
  { id: '1', title: '高二数学必修一：函数与导数综合复习讲义', stage: 'high', grade: '高二', subject: '数学', fileType: 'PDF', downloads: 1250, points: 10, coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnCVnZJFfEd7kHFNFAKDRq7NqizLHP4KgWUfGh3hhhkx-D3025gFcxNLzrSw5axM8Q1XtF3PBHeJVUdwE3XzklMmhLRq1aKxzoA-oqTcUcVnxKy9IW232d1UodH4X_eEfVkCl13pKxbX_YmnI_87xl_g4TLUOS3OOFs6nNoHDDD1v2o7vO7OrmevoJrSHzRlvTPO61pDMlXQtCZc_YhoA87sXDpU3QEDmm5kRFoC6xoARYvWweFUC7oZYGxJoY1oOQcpp4G2vbbxs', status: 'approved', author: '李老师', views: 3400, description: '包含核心考点和历年真题解析。', createdAt: '2026-06-22', tags: ['函数', '导数'] },
  { id: '2', title: '初三物理：光学折射与反射核心考点精讲视频', stage: 'middle', grade: '九年级', subject: '物理', fileType: 'MP4', downloads: 856, points: 5, coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCFacj-jlLiGGC9_AtxHAuR9CHASm6YtZnryASj9wcf42xBmh9OjFnizNKAjafu8XgCGVmerH_jLBew2fpBXuH_vWUclW6Rykvx5wz-JZR25tPMW5zRz31U76yDMj4f2NE8GWks97Sx7RtG-I7hMJnZYKhhN-TlwUvH2tkfNHb_Jr3oi3e6_Ht2XnydNZjb1U5qJGlH_FFkmScExk4AP7s5D_FyLg7oFq1s0AV79u4WQTuNhRk5ODwvp1O9FMaFQcOwTLXY6vCj8c', status: 'approved', author: '王老师', views: 1200, description: '光学核心考点。', createdAt: '2026-06-21', tags: ['光学'] },
  { id: '3', title: '高一英语必修二单元词汇测试卷及答案详解', stage: 'high', grade: '高一', subject: '英语', fileType: 'DOCX', downloads: 2100, points: 0, coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBv5GLpxrA2pBCvxofL03mMT1jaErwDDK3_UbG8Ok96gl3oeyDi5VKTydm4aEd6EX_SVr_M6WX-0_6mMCSnFwxoLlIWp3yfLxv10w1OBf6sdN9rgRaHK2coptlU-sGb7XJ_JKssFARF8kmJ3cnWVZU11Np_OU3Ob8TZ9SGNYc-hvXVo1rCXoborSAVGGSbXs9gJKvrVEJtVOGhPb3s3j2UIzXKZ6wG4HcICgT70Cvzp4UMfqA5m5nhltMY7nvz_MdlNXj6KAQAVQtQ', status: 'approved', author: '赵老师', views: 4200, description: '包含详解。', createdAt: '2026-06-18', tags: ['词汇'] },
  { id: '4', title: '初二语文：文言文阅读理解答题技巧课件', stage: 'middle', grade: '八年级', subject: '语文', fileType: 'PPT', downloads: 432, points: 10, coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcRA1W8Myvm56kfeWAYmaIYyzN15wgJ8H5QM38Rcii0N_04orXxF3s0ETw93v74cnIvIjanxIoO3_U9CxNZpyRORG7lBhoAmEg_WaGwa8U65bEBGYaaie0TPcPkI5g7QIGBGoPLmM8VVVnsfHNMYLTbCHLjG53mOvdDMmaYskB11rX9OMHHnMUs32glk2HuAHj1hB5zNHEL2zDY5z_WpWMQKlV_1vT7NAfshpZwqkisdVcD4mSoVac9KIUUEFZuAm6LYS-5eB03lY', status: 'approved', author: '孙老师', views: 800, description: '文言文技巧。', createdAt: '2026-06-15', tags: ['文言文'] },
  { id: '5', title: '人教版初二物理下册：牛顿第一定律精讲与实验演示', stage: 'middle', grade: '八年级', subject: '物理', fileType: 'MP4', downloads: 856, points: 10, coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFwOCedqHslA64b14zmZqhE3c53Pgtb86yFXkwFalWvDk3psrJwDZnwZdSEpi82ZQuhdnT6qCfjBdIiw1ZmfIyLhuzl4e4ki66dgnVB5Zn8k4fGbaUsqYwBdjGQV32JCUh01FVQDRjYskbuuHC0-U-Dusg3_6dfruKrxNhcI6pSJCLF3BsSoXV4gY9XXuPUwQmYHhMvPXhxbhw_B_KSWO0DOL0LRrk9hxj5ka9tFmzKrpiMmEr26ArX9mU7vVT2A0A50DMfkaM5N8', status: 'approved', author: '王老师', views: 1250, description: '牛顿第一定律。', createdAt: '2026-06-10', tags: ['力学'] }
];

let nextId = resources.length > 0 ? Math.max(...resources.map(r => parseInt(r.id) || 0)) + 1 : 1;

const files = fs.readdirSync(sourceDir);

for (const file of files) {
  if (resources.find(r => r.title === path.basename(file, path.extname(file)))) {
    continue; // already imported
  }
  
  const ext = path.extname(file).toUpperCase().replace('.', '');
  if (!['PDF', 'DOC', 'DOCX', 'PPT', 'PPTX', 'MP4'].includes(ext)) continue;
  
  const title = path.basename(file, path.extname(file));
  
  // Parse filename
  let stage = 'primary';
  let grade = '小学';
  if (title.includes('新一')) grade = '一年级';
  if (title.includes('新二')) grade = '二年级';
  if (title.includes('新三')) grade = '三年级';
  if (title.includes('新四')) grade = '四年级';
  if (title.includes('新五')) grade = '五年级';
  if (title.includes('新六')) grade = '六年级';
  
  if (title.includes('初一') || title.includes('七年级')) { stage = 'middle'; grade = '七年级'; }
  if (title.includes('初二') || title.includes('八年级')) { stage = 'middle'; grade = '八年级'; }
  if (title.includes('初三') || title.includes('九年级')) { stage = 'middle'; grade = '九年级'; }
  if (title.includes('高一')) { stage = 'high'; grade = '高一'; }
  if (title.includes('高二')) { stage = 'high'; grade = '高二'; }
  if (title.includes('高三')) { stage = 'high'; grade = '高三'; }
  
  let subject = '综合';
  if (title.includes('语文')) subject = '语文';
  if (title.includes('数学')) subject = '数学';
  if (title.includes('英语')) subject = '英语';
  if (title.includes('科学')) subject = '科学';
  if (title.includes('物理')) subject = '物理';
  if (title.includes('化学')) subject = '化学';
  if (title.includes('生物')) subject = '生物';
  
  const newFilename = crypto.randomUUID() + path.extname(file);
  fs.copyFileSync(path.join(sourceDir, file), path.join(uploadsDir, newFilename));
  
  resources.unshift({
    id: String(nextId++),
    title: title,
    stage: stage,
    grade: grade,
    subject: subject,
    fileType: ext,
    downloads: Math.floor(Math.random() * 500),
    points: Math.floor(Math.random() * 10),
    coverUrl: '',
    fileUrl: 'http://localhost:3000/uploads/' + newFilename,
    status: 'approved',
    author: '系统管理员',
    views: Math.floor(Math.random() * 1000) + 100,
    description: '自动批量导入资源',
    createdAt: new Date().toISOString().split('T')[0],
    tags: [subject, grade]
  });
}

fs.writeFileSync(jsonFile, JSON.stringify(resources, null, 2), 'utf8');
console.log(`Successfully imported ${files.length} resources!`);
