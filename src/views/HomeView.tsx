/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Flame, ChevronRight, GraduationCap, School, BookOpen } from 'lucide-react';
import { Resource } from '../types';
import { ResourceCard } from '../components/ResourceCard';

interface HomeViewProps {
  resources: Resource[];
  favoritedIds: string[];
  onSelectResource: (id: string) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onNavigateToLibrary: (filter?: { stage?: string; subject?: string; search?: string }) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  resources,
  favoritedIds,
  onSelectResource,
  onToggleFavorite,
  onNavigateToLibrary
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Get featured resources (status approved, sorted by rating desc, top 4)
  const featuredResources = [...resources]
    .filter(r => r.status === 'approved')
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateToLibrary({ search: searchQuery });
  };

  const hotSubjects = [
    { name: '语文', bg: 'bg-red-50 text-red-600 border-red-200/60' },
    { name: '数学', bg: 'bg-blue-50 text-blue-600 border-blue-200/60' },
    { name: '英语', bg: 'bg-purple-50 text-purple-600 border-purple-200/60' },
    { name: '物理', bg: 'bg-emerald-50 text-emerald-600 border-emerald-200/60' },
    { name: '化学', bg: 'bg-slate-100 text-slate-700 border-slate-300/60' }
  ];

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
      {/* Search Section */}
      <section className="px-4 pt-5 pb-3">
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索课程、教案、试卷..."
            className="block w-full pl-10 pr-20 py-3.5 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm shadow-sm transition-all"
          />
          <div className="absolute inset-y-0 right-0 pr-1.5 flex items-center">
            <button 
              type="submit"
              className="text-white font-sans text-xs bg-primary hover:bg-primary-container px-4 py-2 rounded-lg font-semibold transition-all shadow-sm active:scale-95"
            >
              搜索
            </button>
          </div>
        </form>
      </section>

      {/* Quick Access Grid */}
      <section className="px-4 py-3">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div 
            onClick={() => onNavigateToLibrary({ stage: 'primary' })}
            className="flex flex-col items-center justify-center p-4 bg-emerald-50/40 rounded-xl border border-emerald-100/40 hover:bg-emerald-50 hover:border-emerald-100 transition-all duration-300 active:scale-95 cursor-pointer group shadow-sm"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2 text-primary group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="font-sans text-xs font-semibold text-slate-700">小学</span>
          </div>

          <div 
            onClick={() => onNavigateToLibrary({ stage: 'middle' })}
            className="flex flex-col items-center justify-center p-4 bg-indigo-50/40 rounded-xl border border-indigo-100/40 hover:bg-indigo-50 hover:border-indigo-100 transition-all duration-300 active:scale-95 cursor-pointer group shadow-sm"
          >
            <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center mb-2 text-indigo-500 group-hover:scale-110 transition-transform">
              <School className="w-5 h-5" />
            </div>
            <span className="font-sans text-xs font-semibold text-slate-700">初中</span>
          </div>

          <div 
            onClick={() => onNavigateToLibrary({ stage: 'high' })}
            className="flex flex-col items-center justify-center p-4 bg-amber-50/30 rounded-xl border border-amber-100/30 hover:bg-amber-50 hover:border-amber-100 transition-all duration-300 active:scale-95 cursor-pointer group shadow-sm"
          >
            <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mb-2 text-amber-600 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-sans text-xs font-semibold text-slate-700">高中</span>
          </div>
        </div>

        {/* Hot Subjects */}
        <div className="flex items-center gap-1 text-slate-800 font-display text-[15px] font-bold mb-3">
          <Flame className="w-5 h-5 text-rose-500 fill-current" />
          <h2>热门学科</h2>
        </div>
        
        <div className="flex overflow-x-auto no-scrollbar pb-1 gap-2">
          {hotSubjects.map((sub) => (
            <button 
              key={sub.name}
              onClick={() => onNavigateToLibrary({ subject: sub.name })}
              className={`whitespace-nowrap px-4 py-2 rounded-full font-sans text-xs font-semibold border transition-all duration-200 active:scale-95 cursor-pointer shadow-sm ${sub.bg}`}
            >
              {sub.name}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Resources */}
      <section className="px-4 py-5 bg-slate-50/50 mt-2 border-t border-slate-100/80">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-base font-bold text-slate-800">精选资源</h2>
          <button 
            onClick={() => onNavigateToLibrary()}
            className="font-sans text-xs font-semibold text-primary hover:text-primary-container flex items-center transition-colors"
          >
            查看全部 <ChevronRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {featuredResources.map(res => (
            <ResourceCard 
              key={res.id}
              resource={res}
              onSelect={onSelectResource}
              onToggleFavorite={onToggleFavorite}
              isFavorited={favoritedIds.includes(res.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
