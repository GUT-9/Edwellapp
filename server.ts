import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';

// --- MOCK DATABASE ---
let users = [
  {
    id: 'u1',
    name: '张同学',
    phone: '13800138000',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARBMS77J_hxhMvEqhR7sTZKQMjeBuw40YkG5q9ugL1HBLZLcNh9XHPp-vgDWCFHaKBxluJ5bzT0-w5tFx07YaXQcXskcXcWmIYGooiMejXd-XJjUDnoVBDyC984acbWwHOGsEJPf9q82JunHFY6VqpMiH-B1hbwpQev5jvtlVuG_wAykFoGG2CH-Cr3m-R9kaQsRaRDfysK4WlhH2xrlem8_jsBn_UsEjSFDkf-t4d7T2bMKE1tBRf0M9LjYrTN8UCkSot4LLqo8E',
    points: 1250,
    downloadedIds: ['1', '4', '7'],
    uploadedIds: ['10', '11'],
    favoritedIds: ['5', '1', '2', '3'],
    historyIds: ['1', '2', '5'],
    role: 'student',
    grade: '高二理科',
    vipStatus: true
  }
];

let resources = [
  { id: '1', title: '高二数学必修一：函数与导数综合复习讲义', stage: 'high', grade: '高二', subject: '数学', fileType: 'PDF', downloads: 1250, points: 10, coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnCVnZJFfEd7kHFNFAKDRq7NqizLHP4KgWUfGh3hhhkx-D3025gFcxNLzrSw5axM8Q1XtF3PBHeJVUdwE3XzklMmhLRq1aKxzoA-oqTcUcVnxKy9IW232d1UodH4X_eEfVkCl13pKxbX_YmnI_87xl_g4TLUOS3OOFs6nNoHDDD1v2o7vO7OrmevoJrSHzRlvTPO61pDMlXQtCZc_YhoA87sXDpU3QEDmm5kRFoC6xoARYvWweFUC7oZYGxJoY1oOQcpp4G2vbbxs', status: 'approved', author: '李老师', views: 3400, description: '包含核心考点和历年真题解析。', createdAt: '2026-06-22', tags: ['函数', '导数'] },
  { id: '2', title: '初三物理：光学折射与反射核心考点精讲视频', stage: 'middle', grade: '九年级', subject: '物理', fileType: 'MP4', downloads: 856, points: 5, coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCFacj-jlLiGGC9_AtxHAuR9CHASm6YtZnryASj9wcf42xBmh9OjFnizNKAjafu8XgCGVmerH_jLBew2fpBXuH_vWUclW6Rykvx5wz-JZR25tPMW5zRz31U76yDMj4f2NE8GWks97Sx7RtG-I7hMJnZYKhhN-TlwUvH2tkfNHb_Jr3oi3e6_Ht2XnydNZjb1U5qJGlH_FFkmScExk4AP7s5D_FyLg7oFq1s0AV79u4WQTuNhRk5ODwvp1O9FMaFQcOwTLXY6vCj8c', status: 'approved', author: '王老师', views: 1200, description: '光学核心考点。', createdAt: '2026-06-21', tags: ['光学'] },
  { id: '3', title: '高一英语必修二单元词汇测试卷及答案详解', stage: 'high', grade: '高一', subject: '英语', fileType: 'DOCX', downloads: 2100, points: 0, coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBv5GLpxrA2pBCvxofL03mMT1jaErwDDK3_UbG8Ok96gl3oeyDi5VKTydm4aEd6EX_SVr_M6WX-0_6mMCSnFwxoLlIWp3yfLxv10w1OBf6sdN9rgRaHK2coptlU-sGb7XJ_JKssFARF8kmJ3cnWVZU11Np_OU3Ob8TZ9SGNYc-hvXVo1rCXoborSAVGGSbXs9gJKvrVEJtVOGhPb3s3j2UIzXKZ6wG4HcICgT70Cvzp4UMfqA5m5nhltMY7nvz_MdlNXj6KAQAVQtQ', status: 'approved', author: '赵老师', views: 4200, description: '包含详解。', createdAt: '2026-06-18', tags: ['词汇'] },
  { id: '4', title: '初二语文：文言文阅读理解答题技巧课件', stage: 'middle', grade: '八年级', subject: '语文', fileType: 'PPT', downloads: 432, points: 10, coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcRA1W8Myvm56kfeWAYmaIYyzN15wgJ8H5QM38Rcii0N_04orXxF3s0ETw93v74cnIvIjanxIoO3_U9CxNZpyRORG7lBhoAmEg_WaGwa8U65bEBGYaaie0TPcPkI5g7QIGBGoPLmM8VVVnsfHNMYLTbCHLjG53mOvdDMmaYskB11rX9OMHHnMUs32glk2HuAHj1hB5zNHEL2zDY5z_WpWMQKlV_1vT7NAfshpZwqkisdVcD4mSoVac9KIUUEFZuAm6LYS-5eB03lY', status: 'approved', author: '孙老师', views: 800, description: '文言文技巧。', createdAt: '2026-06-15', tags: ['文言文'] },
  { id: '5', title: '人教版初二物理下册：牛顿第一定律精讲与实验演示', stage: 'middle', grade: '八年级', subject: '物理', fileType: 'MP4', downloads: 856, points: 10, coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFwOCedqHslA64b14zmZqhE3c53Pgtb86yFXkwFalWvDk3psrJwDZnwZdSEpi82ZQuhdnT6qCfjBdIiw1ZmfIyLhuzl4e4ki66dgnVB5Zn8k4fGbaUsqYwBdjGQV32JCUh01FVQDRjYskbuuHC0-U-Dusg3_6dfruKrxNhcI6pSJCLF3BsSoXV4gY9XXuPUwQmYHhMvPXhxbhw_B_KSWO0DOL0LRrk9hxj5ka9tFmzKrpiMmEr26ArX9mU7vVT2A0A50DMfkaM5N8', status: 'approved', author: '王老师', views: 1250, description: '牛顿第一定律。', createdAt: '2026-06-10', tags: ['力学'] }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: '学源汇 Backend API is running' });
  });

  // 1. Auth / User
  app.post('/api/login', (req, res) => {
    const { phone, code } = req.body;
    if (!phone || !code) {
      return res.status(400).json({ error: 'Missing phone or code' });
    }
    
    // Find or mock register
    let user = users.find(u => u.phone === phone);
    if (!user) {
      user = {
        id: `u${Date.now()}`,
        name: phone.slice(0, 3) + '****' + phone.slice(7),
        phone: phone,
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARBMS77J_hxhMvEqhR7sTZKQMjeBuw40YkG5q9ugL1HBLZLcNh9XHPp-vgDWCFHaKBxluJ5bzT0-w5tFx07YaXQcXskcXcWmIYGooiMejXd-XJjUDnoVBDyC984acbWwHOGsEJPf9q82JunHFY6VqpMiH-B1hbwpQev5jvtlVuG_wAykFoGG2CH-Cr3m-R9kaQsRaRDfysK4WlhH2xrlem8_jsBn_UsEjSFDkf-t4d7T2bMKE1tBRf0M9LjYrTN8UCkSot4LLqo8E',
        points: 100, // New user bonus
        downloadedIds: [],
        uploadedIds: [],
        favoritedIds: [],
        historyIds: [],
        role: 'student',
        grade: '未设置',
        vipStatus: false
      };
      users.push(user);
    }
    
    res.json({ success: true, user });
  });

  app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  });

  // 2. Resources
  app.get('/api/resources', (req, res) => {
    const { stage, grade, subject, status } = req.query;
    let result = [...resources];
    
    if (stage && stage !== 'all') result = result.filter(r => r.stage === stage);
    if (grade && grade !== 'all') result = result.filter(r => r.grade === grade);
    if (subject && subject !== 'all') result = result.filter(r => r.subject === subject);
    if (status) result = result.filter(r => r.status === status);
    
    res.json(result);
  });

  app.get('/api/resources/:id', (req, res) => {
    const resource = resources.find(r => r.id === req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    
    // Auto increment views
    resource.views += 1;
    res.json(resource);
  });

  app.post('/api/resources', (req, res) => {
    const newResource = {
      ...req.body,
      id: `res${Date.now()}`,
      status: 'pending',
      downloads: 0,
      views: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    resources.push(newResource);
    res.json({ success: true, resource: newResource });
  });

  // 3. User Actions
  app.post('/api/users/:id/favorite', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    const { resourceId } = req.body;
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const isFav = user.favoritedIds.includes(resourceId);
    if (isFav) {
      user.favoritedIds = user.favoritedIds.filter(id => id !== resourceId);
    } else {
      user.favoritedIds.push(resourceId);
    }
    
    res.json({ success: true, favoritedIds: user.favoritedIds });
  });

  app.post('/api/users/:id/download', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    const { resourceId } = req.body;
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    
    if (user.points < resource.points && !user.downloadedIds.includes(resourceId)) {
      return res.status(403).json({ error: 'Insufficient points' });
    }
    
    if (!user.downloadedIds.includes(resourceId)) {
      user.points -= resource.points;
      user.downloadedIds.push(resourceId);
      resource.downloads += 1;
    }
    
    res.json({ success: true, points: user.points, downloadedIds: user.downloadedIds });
  });

  app.post('/api/users/:id/history', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    const { resourceId } = req.body;
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    user.historyIds = user.historyIds.filter(id => id !== resourceId);
    user.historyIds.push(resourceId);
    
    res.json({ success: true, historyIds: user.historyIds });
  });

  // 4. Admin Actions
  app.post('/api/admin/resources/:id/approve', (req, res) => {
    const resource = resources.find(r => r.id === req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    
    resource.status = 'approved';
    res.json({ success: true, resource });
  });

  app.post('/api/admin/resources/:id/reject', (req, res) => {
    const resource = resources.find(r => r.id === req.params.id);
    const { reason } = req.body;
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    
    resource.status = 'rejected';
    resource.rejectReason = reason || '内容不合规';
    res.json({ success: true, resource });
  });


  // --- VITE MIDDLEWARE & STATIC SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
