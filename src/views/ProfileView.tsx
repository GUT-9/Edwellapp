/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Settings, Award, Layers, Clock, Download, Upload, Star, Heart, HelpCircle } from 'lucide-react';
import { Resource, UserProfile } from '../types';
import { ResourceCard } from '../components/ResourceCard';

interface ProfileViewProps {
  user: UserProfile;
  resources: Resource[];
  onSelectResource: (id: string) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onLogout: () => void;
  onSwitchToAdmin: () => void;
}

type TabType = 'favorites' | 'history' | 'downloads' | 'uploads';

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  resources,
  onSelectResource,
  onToggleFavorite,
  onLogout,
  onSwitchToAdmin
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('favorites');

  // Filter lists based on user profile collections
  const favoriteResources = useMemo(() => {
    return resources.filter(r => user.favoritedIds.includes(r.id) && r.status === 'approved');
  }, [resources, user.favoritedIds]);

  const historyResources = useMemo(() => {
    // Return in order of appearance in historyIds, avoiding duplicate renders
    const uniqueHistoryIds = Array.from(new Set(user.historyIds)).reverse();
    return uniqueHistoryIds
      .map(id => resources.find(r => r.id === id))
      .filter((r): r is Resource => r !== undefined && r.status === 'approved');
  }, [resources, user.historyIds]);

  const downloadedResources = useMemo(() => {
    return resources.filter(r => user.downloadedIds.includes(r.id) && r.status === 'approved');
  }, [resources, user.downloadedIds]);

  // Uploaded resources includes ALL statuses (approved, pending, rejected) for the current user
  const uploadedResources = useMemo(() => {
    return resources.filter(r => r.author === user.name);
  }, [resources, user.name]);

  // Tab count metrics
  const tabConfig = [
    { id: 'favorites' as const, label: '收藏列表', icon: Heart, list: favoriteResources },
    { id: 'history' as const, label: '浏览历史', icon: Clock, list: historyResources },
    { id: 'downloads' as const, label: '下载记录', icon: Download, list: downloadedResources },
    { id: 'uploads' as const, label: '我的上传', icon: Upload, list: uploadedResources }
  ];

  const activeTabResources = tabConfig.find(t => t.id === activeTab)?.list ?? [];

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24 bg-slate-50/50">
      {/* Profile Header section */}
      <section className="p-4">
        <div className="bg-white rounded-2xl border border-slate-200/50 p-5 flex flex-col gap-4 shadow-sm">
          {/* User main info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-100 shrink-0 shadow-inner">
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <div className="flex items-center gap-1.5">
                <h2 className="font-display text-base font-bold text-slate-800">{user.name}</h2>
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <Award className="w-3 h-3" />
                  <span>VIP 会员</span>
                </span>
              </div>
              <div className="flex gap-1.5">
                <span className="bg-blue-50 text-blue-600 font-sans text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {user.grade}
                </span>
              </div>
            </div>
            
            {/* Quick action buttons */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Secret Admin switcher for convenience */}
              <button 
                onClick={onSwitchToAdmin}
                className="p-1.5 text-slate-400 hover:text-primary rounded-full hover:bg-slate-50 transition-colors"
                title="切换后台"
              >
                <Settings className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          <div className="h-[1px] w-full bg-slate-100"></div>

          {/* Bento metrics counters */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-50/80 hover:bg-slate-50 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-100 transition-colors cursor-pointer">
              <span className="font-display text-base font-bold text-primary mb-0.5">
                {user.points.toLocaleString()}
              </span>
              <span className="font-sans text-[10px] text-slate-400 font-semibold">我的积分</span>
            </div>

            <div className="bg-slate-50/80 hover:bg-slate-50 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-100 transition-colors cursor-pointer">
              <span className="font-display text-base font-bold text-slate-800 mb-0.5">
                {user.downloadedIds.length + 39}
              </span>
              <span className="font-sans text-[10px] text-slate-400 font-semibold">已下载</span>
            </div>

            <div className="bg-slate-50/80 hover:bg-slate-50 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-100 transition-colors cursor-pointer">
              <span className="font-display text-base font-bold text-slate-800 mb-0.5">
                {uploadedResources.length}
              </span>
              <span className="font-sans text-[10px] text-slate-400 font-semibold">贡献资源</span>
            </div>
          </div>
        </div>
      </section>

      {/* Segmented Control Tabs (Sticky bar) */}
      <div className="px-4 sticky top-0 z-20 bg-slate-50/95 backdrop-blur-sm py-2 border-b border-slate-100/50">
        <div className="bg-slate-200/55 rounded-xl p-1 flex">
          {tabConfig.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 text-center py-2.5 font-sans text-xs font-semibold rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center gap-1 ${
                  isActive
                    ? 'bg-white shadow-sm text-primary font-bold'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'fill-current text-primary' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area listing resource grid */}
      <section className="px-4 py-4">
        {activeTabResources.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {activeTabResources.map((res) => (
              <div key={res.id} className="relative group">
                <ResourceCard 
                  resource={res}
                  onSelect={onSelectResource}
                  onToggleFavorite={onToggleFavorite}
                  isFavorited={user.favoritedIds.includes(res.id)}
                />

                {/* If displaying user's uploads, show audit status badge overlay */}
                {activeTab === 'uploads' && (
                  <div className="absolute top-2 left-2 z-10 shrink-0">
                    {res.status === 'pending' && (
                      <span className="bg-amber-100 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-amber-200/50">
                        审核中
                      </span>
                    )}
                    {res.status === 'approved' && (
                      <span className="bg-emerald-100 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-emerald-200/50">
                        已通过
                      </span>
                    )}
                    {res.status === 'rejected' && (
                      <div className="relative group/tooltip">
                        <span className="bg-rose-100 text-rose-700 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-rose-200/50 cursor-help flex items-center gap-0.5">
                          已驳回
                          <HelpCircle className="w-2.5 h-2.5" />
                        </span>
                        {/* Custom tooltip hover showing reject reason */}
                        <div className="absolute top-full left-0 mt-1 bg-slate-900 text-white text-[10px] p-2 rounded shadow-lg z-20 w-36 pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-opacity leading-relaxed font-normal">
                          驳回原因: {res.rejectReason || '文件格式不符/无法打开'}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Empty Space matching current tab */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-slate-100 mb-3 text-slate-400 shadow-sm">
              <Layers className="w-6 h-6 text-slate-300" />
            </div>
            <p className="font-sans text-xs text-slate-400">
              暂无相应记录
            </p>
          </div>
        )}

        {/* Secret Admin login and exit buttons */}
        <div className="mt-8 flex justify-center gap-3">
          <button 
            onClick={onLogout}
            className="font-sans text-xs font-semibold text-slate-500 bg-white hover:bg-slate-50 px-5 py-2.5 border border-slate-200 rounded-xl shadow-sm active:scale-95 transition-transform"
          >
            退出登录
          </button>
          <button 
            onClick={onSwitchToAdmin}
            className="font-sans text-xs font-semibold text-primary bg-primary/5 hover:bg-primary/10 px-5 py-2.5 border border-primary/20 rounded-xl shadow-sm active:scale-95 transition-transform"
          >
            进入管理员后台
          </button>
        </div>
      </section>
    </div>
  );
};
