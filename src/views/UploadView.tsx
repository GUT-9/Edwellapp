/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UploadCloud, FileText, Plus, Minus, AlertCircle, CheckCircle } from 'lucide-react';
import { Resource } from '../types';
import { STAGES, STAGE_GRADES, STAGE_SUBJECTS } from '../data';

interface UploadViewProps {
  onAddPendingResource: (resource: Resource) => void;
  onNavigateToTab: (tab: 'home' | 'library' | 'upload' | 'profile') => void;
}

export const UploadView: React.FC<UploadViewProps> = ({
  onAddPendingResource,
  onNavigateToTab
}) => {
  // Basic Info State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Category Cascading State
  const [stage, setStage] = useState<'primary' | 'middle' | 'high' | ''>('');
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');

  // File and cover state (Mocked)
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [fileType, setFileType] = useState<'PDF' | 'MP4' | 'DOCX' | 'PPT' | 'PPTX' | 'WORD' | 'ZIP' | ''>('');
  const [coverUrl, setCoverUrl] = useState('');

  // Points and declarations
  const [points, setPoints] = useState(0);
  const [isCopyrightChecked, setIsCopyrightChecked] = useState(false);

  // Interaction State
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  // Handle cascading logic: when stage changes, reset grade and subject
  useEffect(() => {
    setGrade('');
    setSubject('');
  }, [stage]);

  // Generate grade choices based on chosen stage
  const gradeChoices = stage ? STAGE_GRADES[stage] : [];
  // Generate subject choices based on chosen stage
  const subjectChoices = stage ? STAGE_SUBJECTS[stage] : [];

  // Mock File Selection
  const triggerMockFileSelect = () => {
    const mockFiles = [
      { name: '2026年高二数学期末综合模拟卷及名师解析.pdf', size: '4.8MB', type: 'PDF' as const },
      { name: '九年级化学一轮复习：酸碱盐核心反应精析.mp4', size: '124.5MB', type: 'MP4' as const },
      { name: '新版八年级下册英语全册词汇与例句听写表.docx', size: '1.2MB', type: 'DOCX' as const },
      { name: '小学六年级语文下册：古诗词诵读鉴赏公开课.pptx', size: '18.4MB', type: 'PPTX' as const }
    ];
    // Random select a file to make it interactive and fun
    const file = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    setFileName(file.name);
    setFileSize(file.size);
    setFileType(file.type);
    
    // Set matching stage/subject to help user autofill
    if (file.name.includes('数学')) {
      setStage('high');
      setTimeout(() => {
        setGrade('高二');
        setSubject('数学');
      }, 50);
    } else if (file.name.includes('化学')) {
      setStage('middle');
      setTimeout(() => {
        setGrade('九年级');
        setSubject('化学');
      }, 50);
    } else if (file.name.includes('英语')) {
      setStage('middle');
      setTimeout(() => {
        setGrade('八年级');
        setSubject('英语');
      }, 50);
    } else if (file.name.includes('语文')) {
      setStage('primary');
      setTimeout(() => {
        setGrade('六年级');
        setSubject('语文');
      }, 50);
    }
  };

  const handlePointsChange = (val: number) => {
    if (val < 0) return;
    if (val > 100) return;
    setPoints(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!title.trim()) {
      setError('请输入资源标题');
      return;
    }
    if (!description.trim()) {
      setError('请输入资源简介');
      return;
    }
    if (!stage) {
      setError('请选择学段');
      return;
    }
    if (!grade) {
      setError('请选择年级');
      return;
    }
    if (!subject) {
      setError('请选择学科');
      return;
    }
    if (!fileName) {
      setError('请点击并上传您的资源文件');
      return;
    }
    if (!isCopyrightChecked) {
      setError('请阅读并勾选原创或授权承诺条款');
      return;
    }

    // Set mock cover images based on subject for aesthetic completeness
    let subjectCover = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnCVnZJFfEd7kHFNFAKDRq7NqizLHP4KgWUfGh3hhhkx-D3025gFcxNLzrSw5axM8Q1XtF3PBHeJVUdwE3XzklMmhLRq1aKxzoA-oqTcUcVnxKy9IW232d1UodH4X_eEfVkCl13pKxbX_YmnI_87xl_g4TLUOS3OOFs6nNoHDDD1v2o7vO7OrmevoJrSHzRlvTPO61pDMlXQtCZc_YhoA87sXDpU3QEDmm5kRFoC6xoARYvWweFUC7oZYGxJoY1oOQcpp4G2vbbxs'; // Math
    if (subject === '物理') {
      subjectCover = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFwOCedqHslA64b14zmZqhE3c53Pgtb86yFXkwFalWvDk3psrJwDZnwZdSEpi82ZQuhdnT6qCfjBdIiw1ZmfIyLhuzl4e4ki66dgnVB5Zn8k4fGbaUsqYwBdjGQV32JCUh01FVQDRjYskbuuHC0-U-Dusg3_6dfruKrxNhcI6pSJCLF3BsSoXV4gY9XXuPUwQmYHhMvPXhxbhw_B_KSWO0DOL0LRrk9hxj5ka9tFmzKrpiMmEr26ArX9mU7vVT2A0A50DMfkaM5N8';
    } else if (subject === '英语') {
      subjectCover = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBv5GLpxrA2pBCvxofL03mMT1jaErwDDK3_UbG8Ok96gl3oeyDi5VKTydm4aEd6EX_SVr_M6WX-0_6mMCSnFwxoLlIWp3yfLxv10w1OBf6sdN9rgRaHK2coptlU-sGb7XJ_JKssFARF8kmJ3cnWVZU11Np_OU3Ob8TZ9SGNYc-hvXVo1rCXoborSAVGGSbXs9gJKvrVEJtVOGhPb3s3j2UIzXKZ6wG4HcICgT70Cvzp4UMfqA5m5nhltMY7nvz_MdlNXj6KAQAVQtQ';
    } else if (subject === '语文') {
      subjectCover = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcRA1W8Myvm56kfeWAYmaIYyzN15wgJ8H5QM38Rcii0N_04orXxF3s0ETw93v74cnIvIjanxIoO3_U9CxNZpyRORG7lBhoAmEg_WaGwa8U65bEBGYaaie0TPcPkI5g7QIGBGoPLmM8VVVnsfHNMYLTbCHLjG53mOvdDMmaYskB11rX9OMHHnMUs32glk2HuAHj1hB5zNHEL2zDY5z_WpWMQKlV_1vT7NAfshpZwqkisdVcD4mSoVac9KIUUEFZuAm6LYS-5eB03lY';
    }

    // Trigger animated uploading progress
    let currentProgress = 0;
    setUploadProgress(0);
    const interval = setInterval(() => {
      currentProgress += 10;
      setUploadProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        
        // Assemble final pending resource object
        const newResource: Resource = {
          id: `p_${Date.now()}`,
          title,
          description,
          stage: stage as any,
          grade,
          subject,
          fileType: fileType as any || 'PDF',
          rating: 5.0,
          downloads: 0,
          views: 1,
          points,
          author: '张同学', // Current logged in user
          coverUrl: coverUrl || subjectCover,
          status: 'pending',
          createdAt: new Date().toISOString().split('T')[0]
        };

        // Push resource up to state
        onAddPendingResource(newResource);
        setUploadProgress(null);
        setIsSuccessOpen(true);
      }
    }, 150);
  };

  const handleResetForm = () => {
    setTitle('');
    setDescription('');
    setStage('');
    setGrade('');
    setSubject('');
    setFileName('');
    setFileSize('');
    setFileType('');
    setCoverUrl('');
    setPoints(0);
    setIsCopyrightChecked(false);
    setIsSuccessOpen(false);
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24 bg-slate-50/50">
      <div className="px-4 pt-5 pb-3">
        <h1 className="font-display text-lg font-bold text-slate-800">上传学习资源</h1>
        <p className="font-sans text-xs text-slate-400 mt-1">分享您的优质学习资料，助力K12教育生态。</p>
      </div>

      <form onSubmit={handleSubmit} className="px-4 pb-6 space-y-4">
        {/* Error notification */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-rose-600 text-xs font-semibold animate-shake">
            <AlertCircle className="w-4.5 h-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. 基础信息 */}
        <section className="bg-white rounded-xl p-5 border border-slate-200/50 shadow-sm space-y-4">
          <h2 className="font-display text-sm font-bold text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
            <span className="w-1.5 h-4 bg-primary rounded-full"></span>
            <span>1. 基础信息</span>
          </h2>

          <div className="space-y-3.5">
            <div>
              <label className="block font-sans text-xs font-bold text-slate-700 mb-1.5">
                资源标题 <span className="text-rose-500">*</span>
              </label>
              <input 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="请输入清晰准确的资源标题，如“2026年高二数学期中试卷”"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-sans text-xs text-slate-800 placeholder:text-slate-400/80 transition-all bg-slate-50/20"
              />
            </div>

            <div>
              <label className="block font-sans text-xs font-bold text-slate-700 mb-1.5">
                资源简介 <span className="text-rose-500">*</span>
              </label>
              <textarea 
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="简要描述资源内容、适用对象及亮点，让其他老师和同学更好地发现您的作品..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-sans text-xs text-slate-800 placeholder:text-slate-400/80 transition-all bg-slate-50/20 resize-none leading-relaxed"
              />
            </div>
          </div>
        </section>

        {/* 2. 分类归属 (Cascading Dropdowns) */}
        <section className="bg-white rounded-xl p-5 border border-slate-200/50 shadow-sm space-y-4">
          <h2 className="font-display text-sm font-bold text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
            <span className="w-1.5 h-4 bg-primary rounded-full"></span>
            <span>2. 分类归属</span>
          </h2>

          <div className="grid grid-cols-1 gap-3.5">
            {/* 学段 Choice */}
            <div>
              <label className="block font-sans text-xs font-bold text-slate-700 mb-1.5">
                学段 <span className="text-rose-500">*</span>
              </label>
              <select 
                value={stage}
                onChange={(e) => setStage(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/20 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-sans text-xs cursor-pointer outline-none appearance-none"
              >
                <option value="">请选择学段</option>
                {STAGES.map(st => (
                  <option key={st.id} value={st.id}>{st.name}</option>
                ))}
              </select>
            </div>

            {/* 年级 Choice */}
            <div>
              <label className="block font-sans text-xs font-bold text-slate-700 mb-1.5">
                年级 <span className="text-rose-500">*</span>
              </label>
              <select 
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                disabled={!stage}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/20 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-sans text-xs cursor-pointer outline-none appearance-none disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                <option value="">{stage ? '请选择年级' : '请先选择学段'}</option>
                {gradeChoices.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* 学科 Choice */}
            <div>
              <label className="block font-sans text-xs font-bold text-slate-700 mb-1.5">
                学科 <span className="text-rose-500">*</span>
              </label>
              <select 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={!stage}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/20 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-sans text-xs cursor-pointer outline-none appearance-none disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                <option value="">{stage ? '请选择学科' : '请先选择学段'}</option>
                {subjectChoices.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* 3. 文件与封面上传 */}
        <section className="bg-white rounded-xl p-5 border border-slate-200/50 shadow-sm space-y-4">
          <h2 className="font-display text-sm font-bold text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
            <span className="w-1.5 h-4 bg-primary rounded-full"></span>
            <span>3. 文件与封面</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block font-sans text-xs font-bold text-slate-700 mb-1.5">
                资源文件 <span className="text-rose-500">*</span>
              </label>

              {fileName ? (
                /* Selected File Info Card */
                <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg text-primary flex items-center justify-center font-display text-[11px] font-bold">
                      {fileType}
                    </div>
                    <div>
                      <p className="font-sans text-xs font-bold text-slate-800 line-clamp-1 max-w-[180px]">{fileName}</p>
                      <p className="text-[10px] text-slate-400 font-sans mt-0.5">{fileSize}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setFileName(''); setFileType(''); }}
                    className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 outline-none"
                  >
                    删除
                  </button>
                </div>
              ) : (
                /* Empty upload clickable area */
                <div 
                  onClick={triggerMockFileSelect}
                  className="w-full bg-slate-50 rounded-xl p-6 text-center cursor-pointer hover:border-primary hover:bg-slate-100/40 border-2 border-dashed border-slate-200/80 transition-all flex flex-col items-center justify-center"
                >
                  <UploadCloud className="w-10 h-10 text-slate-400 mb-2 block" />
                  <p className="font-sans text-xs font-bold text-slate-700">点击或拖拽文件至此</p>
                  <p className="font-sans text-[10px] text-slate-400 mt-1 max-w-xs leading-relaxed">
                    支持 PDF, Word, PPT, MP4 等格式，单个文件不超过 500MB
                  </p>
                </div>
              )}
            </div>

            {/* Optional Cover URL Mock */}
            <div>
              <label className="block font-sans text-xs font-bold text-slate-700 mb-1.5">
                封面图片地址 (可选)
              </label>
              <input 
                type="text"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="若空缺，系统将自适应抓取或匹配学科默认精美封面"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-sans text-xs text-slate-800 placeholder:text-slate-400/80 transition-all bg-slate-50/20"
              />
            </div>
          </div>
        </section>

        {/* 4. 设置与声明 */}
        <section className="bg-white rounded-xl p-5 border border-slate-200/50 shadow-sm space-y-4">
          <h2 className="font-display text-sm font-bold text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
            <span className="w-1.5 h-4 bg-primary rounded-full"></span>
            <span>4. 设置与声明</span>
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="space-y-0.5 max-w-[160px]">
                <p className="font-sans text-xs font-bold text-slate-700">下载所需积分</p>
                <p className="font-sans text-[10px] text-slate-400 leading-normal">设置其他用户下载本资源需消耗的积分数量。</p>
              </div>

              {/* Number counter selector */}
              <div className="flex items-center gap-1.5 bg-white rounded-lg border border-slate-200 px-2 py-1">
                <button 
                  type="button"
                  onClick={() => handlePointsChange(points - 5)}
                  className="p-1 text-slate-500 hover:text-primary outline-none hover:bg-slate-50 rounded"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input 
                  type="number"
                  value={points}
                  onChange={(e) => handlePointsChange(parseInt(e.target.value) || 0)}
                  className="w-10 text-center border-none bg-transparent font-sans text-xs font-bold text-slate-800 focus:ring-0 p-0"
                />
                <button 
                  type="button"
                  onClick={() => handlePointsChange(points + 5)}
                  className="p-1 text-slate-500 hover:text-primary outline-none hover:bg-slate-50 rounded"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Copyright check checkbox */}
            <div className="flex items-start gap-2.5">
              <div className="relative flex items-center pt-0.5 shrink-0">
                <input 
                  id="copyright-check"
                  type="checkbox"
                  checked={isCopyrightChecked}
                  onChange={(e) => setIsCopyrightChecked(e.target.checked)}
                  className="w-4 h-4 text-primary bg-white border-slate-200 rounded focus:ring-primary focus:ring-2 cursor-pointer"
                />
              </div>
              <label 
                htmlFor="copyright-check"
                className="font-sans text-[11px] text-slate-500 leading-relaxed cursor-pointer"
              >
                我承诺此资源由本人原创或已获得合法授权，不存在侵犯他人知识产权的情况。若有违规，平台有权随时下架处理。 <span className="text-rose-500 font-bold">*</span>
              </label>
            </div>
          </div>
        </section>

        {/* Upload Button */}
        <div className="pt-2">
          <button 
            type="submit"
            className="w-full bg-primary hover:bg-primary-container text-white font-sans text-sm font-bold py-3.5 rounded-xl shadow-md cursor-pointer transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
          >
            <UploadCloud className="w-5 h-5" />
            <span>开始上传</span>
          </button>
        </div>
      </form>

      {/* Uploading progress overlay modal */}
      {uploadProgress !== null && (
        <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white w-72 rounded-2xl shadow-xl p-6 text-center border border-slate-100 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              <UploadCloud className="w-6 h-6 animate-bounce" />
            </div>
            <h3 className="font-display text-sm font-bold text-slate-800">正在打包并上传文件</h3>
            <p className="font-sans text-[11px] text-slate-400 mt-1">请勿关闭或退出当前页面...</p>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-5 overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-150"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <span className="font-display text-xs font-bold text-primary mt-2">{uploadProgress}%</span>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isSuccessOpen && (
        <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white w-80 rounded-2xl shadow-xl p-6 text-center border border-slate-100 flex flex-col items-center mx-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 fill-emerald-50" />
            </div>
            <h3 className="font-display text-base font-bold text-slate-800">资源上传提交成功</h3>
            <p className="font-sans text-xs text-slate-400 mt-2 leading-relaxed">
              您的资源已提交至系统后台审核中心。通过后将自动向全站师生发布，并增加您的贡献积分！
            </p>

            <div className="flex gap-3 w-full mt-6">
              <button 
                onClick={handleResetForm}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-sans text-xs font-semibold cursor-pointer text-center"
              >
                再传一集
              </button>
              <button 
                onClick={() => {
                  setIsSuccessOpen(false);
                  onNavigateToTab('profile');
                }}
                className="flex-1 py-2.5 rounded-xl bg-primary text-white font-sans text-xs font-semibold shadow-sm cursor-pointer text-center"
              >
                查看上传
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
