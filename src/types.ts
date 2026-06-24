/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Comment {
  id: string;
  author: string;
  rating: number;
  content: string;
  date: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  stage: 'primary' | 'middle' | 'high'; // 小学, 初中, 高中
  grade: string; // e.g., "八年级", "高二", "三年级"
  subject: string; // e.g., "数学", "物理", "英语", "语文", "化学"
  fileType: 'PDF' | 'MP4' | 'DOCX' | 'PPT' | 'PPTX' | 'WORD' | 'ZIP';
  rating: number;
  downloads: number;
  views: number;
  points: number; // 下载所需积分
  author: string;
  coverUrl: string;
  isFavorited?: boolean;
  comments?: Comment[];
  status: 'approved' | 'pending' | 'rejected'; // For admin auditing
  rejectReason?: string;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  avatarUrl: string;
  points: number;
  downloadedIds: string[];
  uploadedIds: string[];
  favoritedIds: string[];
  historyIds: string[];
  role: 'student' | 'teacher' | 'admin';
  grade?: string;
  vipStatus: boolean;
}

export interface AuditItem {
  id: string;
  resourceId: string;
  uploadedBy: string;
  timeAgo: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface SystemFeedback {
  id: string;
  user: string;
  type: string;
  content: string;
  timeAgo: string;
  status: 'pending' | 'resolved';
}

export interface SystemWarning {
  id: string;
  type: string;
  content: string;
  timeAgo: string;
}
