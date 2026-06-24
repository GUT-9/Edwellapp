/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Resource, UserProfile, Comment } from './types';

export const STAGES = [
  { id: 'primary', name: '小学' },
  { id: 'middle', name: '初中' },
  { id: 'high', name: '高中' }
] as const;

export const STAGE_GRADES = {
  primary: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
  middle: ['七年级', '八年级', '九年级'],
  high: ['高一', '高二', '高三']
} as const;

export const STAGE_SUBJECTS = {
  primary: ['语文', '数学', '英语', '道德与法治', '科学', '音乐', '美术', '体育'],
  middle: ['语文', '数学', '英语', '道德与法治', '历史', '地理', '物理', '化学', '生物'],
  high: ['语文', '数学', '英语', '思想政治', '历史', '地理', '物理', '化学', '生物', '信息技术']
} as const;

export const SUBJECT_COLORS = {
  '语文': { bg: 'bg-red-50 text-red-600 border-red-100', text: 'text-red-600', tagBg: 'bg-red-100' },
  '数学': { bg: 'bg-blue-50 text-blue-600 border-blue-100', text: 'text-blue-600', tagBg: 'bg-blue-100' },
  '英语': { bg: 'bg-purple-50 text-purple-600 border-purple-100', text: 'text-purple-600', tagBg: 'bg-purple-100' },
  '物理': { bg: 'bg-emerald-50 text-emerald-600 border-emerald-100', text: 'text-emerald-600', tagBg: 'bg-emerald-100' },
  '化学': { bg: 'bg-slate-100 text-slate-600 border-slate-200', text: 'text-slate-600', tagBg: 'bg-slate-100' },
  '生物': { bg: 'bg-green-50 text-green-600 border-green-100', text: 'text-green-600', tagBg: 'bg-green-100' },
  '科学': { bg: 'bg-teal-50 text-teal-600 border-teal-100', text: 'text-teal-600', tagBg: 'bg-teal-100' },
  '历史': { bg: 'bg-amber-50 text-amber-700 border-amber-100', text: 'text-amber-700', tagBg: 'bg-amber-100' },
  '地理': { bg: 'bg-cyan-50 text-cyan-600 border-cyan-100', text: 'text-cyan-600', tagBg: 'bg-cyan-100' },
  '道德与法治': { bg: 'bg-rose-50 text-rose-600 border-rose-100', text: 'text-rose-600', tagBg: 'bg-rose-100' }
} as Record<string, { bg: string; text: string; tagBg: string }>;

export const DEFAULT_COLOR = { bg: 'bg-gray-50 text-gray-600 border-gray-100', text: 'text-gray-600', tagBg: 'bg-gray-100' };

export const getSubjectColor = (subject: string) => {
  return SUBJECT_COLORS[subject] || DEFAULT_COLOR;
};

export const INITIAL_USER: UserProfile = {
  name: '张同学',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARBMS77J_hxhMvEqhR7sTZKQMjeBuw40YkG5q9ugL1HBLZLcNh9XHPp-vgDWCFHaKBxluJ5bzT0-w5tFx07YaXQcXskcXcWmIYGooiMejXd-XJjUDnoVBDyC984acbWwHOGsEJPf9q82JunHFY6VqpMiH-B1hbwpQev5jvtlVuG_wAykFoGG2CH-Cr3m-R9kaQsRaRDfysK4WlhH2xrlem8_jsBn_UsEjSFDkf-t4d7T2bMKE1tBRf0M9LjYrTN8UCkSot4LLqo8E',
  points: 1250,
  downloadedIds: ['1', '4', '7'],
  uploadedIds: ['10', '11'],
  favoritedIds: ['5', '1', '2', '3'],
  historyIds: ['1', '2', '5'],
  role: 'student',
  grade: '高二理科',
  vipStatus: true
};

const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1',
    author: '王老师 (特级教师)',
    rating: 5,
    content: '讲义结构严谨，例题非常有代表性，适合用来作为期末总复习的复习大纲，极力推荐！',
    date: '2026-06-12'
  },
  {
    id: 'c2',
    author: '李同学',
    rating: 4.8,
    content: '配合视频看太容易懂了，理想斜面实验的3D动画效果做得很生动，对概念理解帮助很大。',
    date: '2026-06-20'
  }
];

export const INITIAL_RESOURCES: Resource[] = [
  {
    id: '5',
    title: '人教版初二物理下册：牛顿第一定律精讲与实验演示',
    description: '本视频详细讲解了牛顿第一定律的起源、内容及实际应用。结合伽利略理想斜面实验的3D动画演示，帮助学生直观理解“惯性”的概念，突破学习重难点。适合初二学生课前预习或课后复习使用。',
    stage: 'middle',
    grade: '八年级',
    subject: '物理',
    fileType: 'MP4',
    rating: 4.9,
    downloads: 856,
    views: 12000,
    points: 10,
    author: '刘老师',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFwOCedqHslA64b14zmZqhE3c53Pgtb86yFXkwFalWvDk3psrJwDZnwZdSEpi82ZQuhdnT6qCfjBdIiw1ZmfIyLhuzl4e4ki66dgnVB5Zn8k4fGbaUsqYwBdjGQV32JCUh01FVQDRjYskbuuHC0-U-Dusg3_6dfruKrxNhcI6pSJCLF3BsSoXV4gY9XXuPUwQmYHhMvPXhxbhw_B_KSWO0DOL0LRrk9hxj5ka9tFmzKrpiMmEr26ArX9mU7vVT2A0A50DMfkaM5N8',
    status: 'approved',
    createdAt: '2026-06-10',
    comments: MOCK_COMMENTS
  },
  {
    id: '1',
    title: '高二数学必修一：函数与导数综合复习讲义',
    description: '本讲义涵盖了高二数学必修一中函数、基本初等函数以及导数的核心考点。包含思维导图梳理、经典例题解析以及10套精选模拟训练，帮助学生突破导数压轴题瓶颈。',
    stage: 'high',
    grade: '高二',
    subject: '数学',
    fileType: 'PDF',
    rating: 4.8,
    downloads: 1250,
    views: 3500,
    points: 10,
    author: '陈老师',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnCVnZJFfEd7kHFNFAKDRq7NqizLHP4KgWUfGh3hhhkx-D3025gFcxNLzrSw5axM8Q1XtF3PBHeJVUdwE3XzklMmhLRq1aKxzoA-oqTcUcVnxKy9IW232d1UodH4X_eEfVkCl13pKxbX_YmnI_87xl_g4TLUOS3OOFs6nNoHDDD1v2o7vO7OrmevoJrSHzRlvTPO61pDMlXQtCZc_YhoA87sXDpU3QEDmm5kRFoC6xoARYvWweFUC7oZYGxJoY1oOQcpp4G2vbbxs',
    status: 'approved',
    createdAt: '2026-06-22',
    comments: [
      {
        id: 'c1_1',
        author: '张同学',
        rating: 4.8,
        content: '题目有点难，但是解析超级详细！好评！',
        date: '2026-06-23'
      }
    ]
  },
  {
    id: '2',
    title: '初三物理：光学折射与反射核心考点精讲视频',
    description: '针对中考物理高频考点“光的折射与反射”进行深度剖析。通过趣味小实验和白板画图，形象解释折射规律，并梳理常见常考题型，快速提升解题得分率。',
    stage: 'middle',
    grade: '九年级',
    subject: '物理',
    fileType: 'MP4',
    rating: 4.9,
    downloads: 856,
    views: 2800,
    points: 5,
    author: '王老师',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCFacj-jlLiGGC9_AtxHAuR9CHASm6YtZnryASj9wcf42xBmh9OjFnizNKAjafu8XgCGVmerH_jLBew2fpBXuH_vWUclW6Rykvx5wz-JZR25tPMW5zRz31U76yDMj4f2NE8GWks97Sx7RtG-I7hMJnZYKhhN-TlwUvH2tkfNHb_Jr3oi3e6_Ht2XnydNZjb1U5qJGlH_FFkmScExk4AP7s5D_FyLg7oFq1s0AV79u4WQTuNhRk5ODwvp1O9FMaFQcOwTLXY6vCj8c',
    status: 'approved',
    createdAt: '2026-06-21'
  },
  {
    id: '3',
    title: '高一英语必修二单元词汇测试卷及答案详解',
    description: '高一英语必修二同步精品词汇检测，严格贴合新教材。题型包括单词拼写、单句改错、完形填空以及词汇微写作，并附赠全套词汇背诵清单和答案详解。',
    stage: 'high',
    grade: '高一',
    subject: '英语',
    fileType: 'DOCX',
    rating: 4.5,
    downloads: 2100,
    views: 4200,
    points: 0,
    author: 'Emily老师',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBv5GLpxrA2pBCvxofL03mMT1jaErwDDK3_UbG8Ok96gl3oeyDi5VKTydm4aEd6EX_SVr_M6WX-0_6mMCSnFwxoLlIWp3yfLxv10w1OBf6sdN9rgRaHK2coptlU-sGb7XJ_JKssFARF8kmJ3cnWVZU11Np_OU3Ob8TZ9SGNYc-hvXVo1rCXoborSAVGGSbXs9gJKvrVEJtVOGhPb3s3j2UIzXKZ6wG4HcICgT70Cvzp4UMfqA5m5nhltMY7nvz_MdlNXj6KAQAVQtQ',
    status: 'approved',
    createdAt: '2026-06-18'
  },
  {
    id: '4',
    title: '初二语文：文言文阅读理解答题技巧课件',
    description: '针对部编版初中语文文言文阅读，梳理常见常考文言实词、虚词及特殊句式。并独家提炼“文言文翻译三字诀”与“内容分析三步法”，让文言文不再是失分项。',
    stage: 'middle',
    grade: '八年级',
    subject: '语文',
    fileType: 'PPT',
    rating: 5.0,
    downloads: 432,
    views: 1500,
    points: 10,
    author: '郭老师',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcRA1W8Myvm56kfeWAYmaIYyzN15wgJ8H5QM38Rcii0N_04orXxF3s0ETw93v74cnIvIjanxIoO3_U9CxNZpyRORG7lBhoAmEg_WaGwa8U65bEBGYaaie0TPcPkI5g7QIGBGoPLmM8VVVnsfHNMYLTbCHLjG53mOvdDMmaYskB11rX9OMHHnMUs32glk2HuAHj1hB5zNHEL2zDY5z_WpWMQKlV_1vT7NAfshpZwqkisdVcD4mSoVac9KIUUEFZuAm6LYS-5eB03lY',
    status: 'approved',
    createdAt: '2026-06-15'
  },
  {
    id: '6',
    title: '二力平衡专项练习题集（含解析）',
    description: '本练习集精心搜集了近年全国各地中考中关于“二力平衡条件及其应用”的100道典型真题与模拟题。配有详尽的受力分析图和核心解题思路，适合学生巩固突破。',
    stage: 'middle',
    grade: '八年级',
    subject: '物理',
    fileType: 'PDF',
    rating: 4.7,
    downloads: 2100,
    views: 4500,
    points: 0,
    author: '刘老师',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCab9e-XcB6TXhv7eqQm8lWUx4HsK35q6M15HiAtZBVXIQKfzl5E02Lvde_mK8Dq2vi9ABf29b8frNscXEqpaXdGJggA0g6xOOAb3GvVsvX7n1yRM_DZq-8_SNhV2YDll7VRX9QTstHP0ZE9lqMqy3y_211XOiKLVQmTy1qxBlVfMmrEoefopaK-vITtn1MxBSdwtmu6IPr7enlfU17Zjhzt3jObkvvuQOK7UpcB9cOAz5h77CCp7Ox9ObiFd5dLMwxv-45b0ZlZQc',
    status: 'approved',
    createdAt: '2026-06-08'
  },
  {
    id: '7',
    title: '摩擦力实验全纪录与数据分析',
    description: '物理核心探究性实验“影响滑动摩擦力大小的因素”全纪录。通过高精度拉力传感器和数字化分析软件，展示木块在不同接触面、不同压力下的真实拉力曲线。',
    stage: 'middle',
    grade: '八年级',
    subject: '物理',
    fileType: 'MP4',
    rating: 4.8,
    downloads: 856,
    views: 1800,
    points: 5,
    author: '刘老师',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_G4s8L3F6VTOKwtQfDf54wKkEcV29z-DduzZNbx1zrkOA38ZbqQbIir1VD_N4Is0YmJYdB2-DiSFFOOXgEElo2meC5Uufac0PobIQJTeltAFMkb3w0sJ6STNu5HgMvw5J4FSENXuOwixjtvgEkF73Tkfczd3EPmktfLjER3IgzQTNjEUrhFo29St4TN-FCNDwJVsgE-uZrKQ6BqGt9ZsxkNYX5WzYvBdvZUkrifUpmymVTrcbqXHTFeywNigNXpCvH3m9xUf7YF4',
    status: 'approved',
    createdAt: '2026-06-05'
  },
  {
    id: '8',
    title: '2023秋季人教版八年级物理上册核心知识点精讲讲义',
    description: '本套讲义是针对初二物理上册（机械运动、声现象、物态变化、光现象、透镜及其应用、质量与密度）量身打造的高分讲义。内容图文并茂，完美贴合考纲。',
    stage: 'middle',
    grade: '八年级',
    subject: '物理',
    fileType: 'PDF',
    rating: 4.9,
    downloads: 1200,
    views: 3200,
    points: 10,
    author: '刘老师',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwdV_pF69igUrB99j2jLpbSoYHeWVp-rdkc8UI6yoEfY_upBdCSSL7hTcW7hAcnNTnIVuEqWBBjkZTggeUKtnVuRa0RCDJ6zpQWIxkoKd5x0dAYDRmCA-_ab_znBmF-ptjOp4YwyQYzfFD74LIEipvGL9XMZMxBuLa00L6fnqTbShc--p78t0KKKghv_Fn1T7n-7ll25zJqLJhjrJwYHudxwVBVPP9UxYYT4eGMNZTqkoPHgQj6nVizrXAU86cMN-945L0LWgaSN8',
    status: 'approved',
    createdAt: '2026-06-03'
  },
  {
    id: '9',
    title: '高中数学必修一：函数的基本性质与应用全解',
    description: '高考数学一轮复习奠基之作，系统精讲函数单调性、奇偶性、周期性与对称性。独家解析“复合函数性质推导”与“抽象函数解题套路”，打牢代数基础。',
    stage: 'high',
    grade: '高一',
    subject: '数学',
    fileType: 'MP4',
    rating: 4.8,
    downloads: 856,
    views: 2100,
    points: 5,
    author: '陈老师',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDL8ml5_puCueJWKI54b-jUuSKEMtIMebvNnbFsqZnnNjegw9oITBJYYgZTSFWbcvXRKTjTqz6nhJzhncizrx8V_ckzlZC7SSPiWKD0jtutamoeB_TvmJAeBDs5vmxBg8FUYaTbUX6H5ZtqdmsyJ0la9crOPWmv1cyDt1x8bvibLIHIVjD6tbu-ewP9lbpRjfx3VoifWk7iSPETSFmFrXCXRjPppXHCfDy6X1frridFx3pV8WpEguXwas1p7fieBcbv-Bb8W52vrwg',
    status: 'approved',
    createdAt: '2026-06-01'
  },
  {
    id: '10',
    title: '2023年全国统一高考数学真题卷（附详细解析）',
    description: '官方权威2023年全国高考新高考I卷数学真题。配有由知名特级教师团队撰写的逐题超级详解、考点深度解密以及阅卷标准给分步骤解读，高三备考必刷。',
    stage: 'high',
    grade: '高三',
    subject: '数学',
    fileType: 'PDF',
    rating: 4.9,
    downloads: 2100,
    views: 5600,
    points: 10,
    author: '陈老师',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_zKcDK7LRbzX5YDKn4f4pInf43w5yRj_5VGAyq-17926erYlpyuZybZfgC8CJuUwvi1D78PZe8pHJJRMnLnBuf5rPMQrHgfn1aEzRZQO2eT5hexdE4BTioPJFm851wSUbf1RGd6LdjesoUba5gGptts-zCRsch5137GEhZFWzRy-WIbZ4pFgucqgjkgK2egRiFgi8GU1WPUUeTU-WnMNyCAFfuVcjwWz-2KyjnbHOwFbi8GqOqKeLSYbpimo91v_lWYFq7in4oTU',
    status: 'approved',
    createdAt: '2026-05-28'
  },
  {
    id: '11',
    title: '新概念英语第三册核心词汇与长难句分析背诵手册',
    description: '专为英语进阶及高考提分设计的辅导手册。精选《新概念英语第三册》30篇经典课文，深度提炼高考高频词汇并解析60个考点长难句，大幅提升读写能力。',
    stage: 'high',
    grade: '高一',
    subject: '英语',
    fileType: 'DOCX',
    rating: 5.0,
    downloads: 3200,
    views: 7800,
    points: 10,
    author: 'Emily老师',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBv5GLpxrA2pBCvxofL03mMT1jaErwDDK3_UbG8Ok96gl3oeyDi5VKTydm4aEd6EX_SVr_M6WX-0_6mMCSnFwxoLlIWp3yfLxv10w1OBf6sdN9rgRaHK2coptlU-sGb7XJ_JKssFARF8kmJ3cnWVZU11Np_OU3Ob8TZ9SGNYc-hvXVo1rCXoborSAVGGSbXs9gJKvrVEJtVOGhPb3s3j2UIzXKZ6wG4HcICgT70Cvzp4UMfqA5m5nhltMY7nvz_MdlNXj6KAQAVQtQ',
    status: 'approved',
    createdAt: '2026-05-25'
  },
  {
    id: '12',
    title: '高二语文必修上册：《赤壁赋》优质公开课课件',
    description: '全国一等奖公开课《赤壁赋》精美配套多媒体课件。采用中国风水墨墨韵视觉设计，深度融入“主客问答”核心主线。课件交互感强，重点文言句式、哲理探究一目了然。',
    stage: 'high',
    grade: '高二',
    subject: '语文',
    fileType: 'PPTX',
    rating: 4.7,
    downloads: 1500,
    views: 3200,
    points: 5,
    author: '郭老师',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcRA1W8Myvm56kfeWAYmaIYyzN15wgJ8H5QM38Rcii0N_04orXxF3s0ETw93v74cnIvIjanxIoO3_U9CxNZpyRORG7lBhoAmEg_WaGwa8U65bEBGYaaie0TPcPkI5g7QIGBGoPLmM8VVVnsfHNMYLTbCHLjG53mOvdDMmaYskB11rX9OMHHnMUs32glk2HuAHj1hB5zNHEL2zDY5z_WpWMQKlV_1vT7NAfshpZwqkisdVcD4mSoVac9KIUUEFZuAm6LYS-5eB03lY',
    status: 'approved',
    createdAt: '2026-05-20'
  }
];
