/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Play, Eye, Download, Star, ChevronRight, Heart, FileText, Check, AlertCircle } from 'lucide-react';
import { Resource } from '../types';
import { getSubjectColor } from '../data';

interface DetailViewProps {
  resourceId: string;
  resources: Resource[];
  userPoints: number;
  downloadedIds: string[];
  favoritedIds: string[];
  onBack: () => void;
  onSelectResource: (id: string) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onConfirmDownload: (id: string, cost: number) => void;
}

export const DetailView: React.FC<DetailViewProps> = ({
  resourceId,
  resources,
  userPoints,
  downloadedIds,
  favoritedIds,
  onBack,
  onSelectResource,
  onToggleFavorite,
  onConfirmDownload
}) => {
  const resource = resources.find(r => r.id === resourceId);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!resource) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-slate-500 text-sm">找不到该资源</p>
        <button onClick={onBack} className="mt-4 bg-primary text-white px-4 py-2 rounded-lg text-xs font-semibold">
          返回上一页
        </button>
      </div>
    );
  }

  const isDownloaded = downloadedIds.includes(resource.id);
  const isFavorited = favoritedIds.includes(resource.id);
  const subjectColor = getSubjectColor(resource.subject);

  // Filter physics or related resources (same subject, excluding current one)
  const relatedResources = resources
    .filter(r => r.subject === resource.subject && r.id !== resource.id && r.status === 'approved')
    .slice(0, 3);

  const handleDownloadClick = () => {
    if (isDownloaded) {
      triggerToast('您已下载过该资源，可直接查看', 'success');
      return;
    }
    setIsModalOpen(true);
  };

  const triggerToast = (text: string, type: 'success' | 'error') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleConfirmDownloadAction = () => {
    if (userPoints < resource.points) {
      triggerToast('您的账户积分不足，无法下载该资源', 'error');
      setIsModalOpen(false);
      return;
    }

    setDownloadLoading(true);

    setTimeout(() => {
      setDownloadLoading(false);
      setIsModalOpen(false);
      onConfirmDownload(resource.id, resource.points);
      triggerToast('下载成功！已存入您的下载记录', 'success');
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50 relative">
      {/* Sub-page Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md w-full h-14 flex items-center justify-between px-4 border-b border-slate-100 shrink-0">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-sm font-bold text-slate-800 truncate flex-1 text-center pr-6">
          资源详情
        </h1>
        <div className="w-8"></div>
      </header>

      {/* Detail Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {/* Preview Area */}
        <section className="w-full aspect-video bg-slate-900 relative overflow-hidden flex items-center justify-center">
          {isPlaying ? (
            <div className="absolute inset-0 bg-black flex flex-col items-center justify-center text-white">
              <span className="animate-pulse text-sm font-semibold text-teal-400">正在播放模拟视频...</span>
              <div className="w-1/2 bg-slate-800 h-1 rounded-full overflow-hidden mt-4">
                <div className="bg-teal-400 h-full w-2/3 animate-[progress_5s_infinite_linear]"></div>
              </div>
              <button 
                onClick={() => setIsPlaying(false)}
                className="mt-6 text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors font-medium cursor-pointer"
              >
                停止播放
              </button>
            </div>
          ) : (
            <>
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-80 mix-blend-overlay"
                style={{ backgroundImage: `url(${resource.coverUrl})` }}
              />
              {/* Play Button Overlay */}
              <button 
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 m-auto w-16 h-16 bg-white/25 hover:bg-white/35 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <Play className="w-8 h-8 fill-current ml-1" />
              </button>
              {/* Format Badge */}
              <div className="absolute top-4 right-4 px-2 py-1 bg-black/70 backdrop-blur text-white text-[10px] font-bold tracking-wider rounded uppercase flex items-center gap-1 shadow-md">
                <FileText className="w-3.5 h-3.5" />
                <span>{resource.fileType}</span>
              </div>
            </>
          )}
        </section>

        {/* Metadata Section */}
        <section className="bg-white px-5 py-6 flex flex-col gap-4 border-b border-slate-100">
          <h2 className="font-display text-base font-bold text-slate-800 leading-snug">
            {resource.title}
          </h2>

          {/* Academic Tags */}
          <div className="flex flex-wrap gap-1.5">
            <span className={`px-2.5 py-1 rounded-full font-sans text-[11px] font-semibold ${subjectColor.bg}`}>
              {resource.subject}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-sans text-[11px] font-semibold">
              {resource.grade}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-50 text-slate-500 font-sans text-[11px] border border-slate-200/50 font-medium">
              知识点讲解
            </span>
          </div>

          {/* Stats details */}
          <div className="flex items-center gap-6 text-slate-400 font-sans text-xs">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-bold">{resource.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4 text-slate-400" />
              <span>{resource.views >= 1000 ? `${(resource.views / 1000).toFixed(1)}w` : resource.views} 次浏览</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-4 h-4 text-slate-400" />
              <span>{resource.downloads} 次下载</span>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Description */}
          <div className="space-y-1">
            <h3 className="font-display text-[14px] font-bold text-slate-800">资源简介</h3>
            <p className="font-sans text-xs text-slate-500 leading-relaxed">
              {resource.description}
            </p>
          </div>
        </section>

        {/* Related Recommendations (Card scroll) */}
        <section className="py-5 bg-transparent">
          <div className="px-5 mb-3 flex items-center justify-between">
            <h3 className="font-display text-[14px] font-bold text-slate-800">相关推荐</h3>
            <button className="text-primary hover:text-primary-container font-sans text-xs font-semibold flex items-center transition-colors">
              查看更多 <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex overflow-x-auto gap-3 px-5 pb-3 snap-x no-scrollbar">
            {relatedResources.map((rel) => (
              <div 
                key={rel.id}
                onClick={() => onSelectResource(rel.id)}
                className="w-48 shrink-0 snap-start bg-white rounded-xl border border-slate-200/50 overflow-hidden shadow-sm flex flex-col hover:shadow-md hover:border-primary/20 transition-all cursor-pointer"
              >
                <div 
                  className="h-28 w-full bg-cover bg-center bg-slate-100 relative"
                  style={{ backgroundImage: `url(${rel.coverUrl})` }}
                  referrerPolicy="no-referrer"
                >
                  <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white px-1 rounded text-[10px] font-semibold">
                    {rel.fileType}
                  </span>
                </div>
                <div className="p-3 flex flex-col gap-1.5 flex-1 justify-between">
                  <h4 className="font-sans text-xs font-bold text-slate-800 line-clamp-2 leading-tight">
                    {rel.title}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] mt-2">
                    <span className="font-semibold text-primary">
                      {rel.points === 0 ? '免费' : `${rel.points} 积分`}
                    </span>
                    <span className="text-slate-400">{rel.downloads} 下载</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-100 px-4 py-3 pb-safe z-30 flex items-center justify-between shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
        {/* Points Display */}
        <div className="flex items-baseline gap-0.5">
          <span className="font-display text-2xl font-bold text-primary tracking-tight">
            {resource.points}
          </span>
          <span className="font-sans text-[11px] font-semibold text-slate-500">积分</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={(e) => onToggleFavorite(resource.id, e)}
            className={`w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 border border-slate-200 transition-colors active:scale-95 cursor-pointer ${
              isFavorited ? 'text-rose-500 border-rose-100 bg-rose-50' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
          
          <button 
            onClick={handleDownloadClick}
            className={`px-8 py-2.5 rounded-full font-display text-sm font-bold shadow-sm cursor-pointer transition-all active:scale-95 ${
              isDownloaded
                ? 'bg-slate-100 text-slate-500 border border-slate-200'
                : 'bg-primary hover:bg-primary-container text-white'
            }`}
          >
            {isDownloaded ? '下载成功' : '立即下载'}
          </button>
        </div>
      </div>

      {/* Download Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            onClick={() => setIsModalOpen(false)}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity"
          />

          {/* Dialog Container */}
          <div className="relative bg-white w-80 rounded-2xl shadow-xl flex flex-col p-6 border border-slate-100 mx-4">
            <div className="flex flex-col items-center text-center gap-2 mb-5">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-1">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="font-display text-base font-bold text-slate-800">确认下载资源</h3>
              <p className="font-sans text-xs text-slate-400 leading-relaxed">
                下载此资源将扣除您的账户积分，确认继续操作吗？
              </p>
            </div>

            {/* Cost Details */}
            <div className="bg-slate-50 rounded-xl p-3 mb-5 flex justify-between items-center border border-slate-100">
              <span className="font-sans text-xs text-slate-400">本次消耗</span>
              <div className="flex items-baseline gap-0.5 text-primary">
                <span className="font-display text-base font-bold">-{resource.points}</span>
                <span className="font-sans text-[10px] font-semibold">积分</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-sans text-xs font-semibold cursor-pointer text-center"
              >
                取消
              </button>
              <button 
                onClick={handleConfirmDownloadAction}
                disabled={downloadLoading}
                className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white font-sans text-xs font-semibold shadow-sm cursor-pointer text-center flex items-center justify-center"
              >
                {downloadLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  '确认下载'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 bg-slate-900/90 text-white rounded-xl shadow-lg flex items-center gap-2 transition-all">
          {toastMessage.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span className="font-sans text-xs font-medium">{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
};
