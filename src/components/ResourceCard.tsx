/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, Download, Heart } from 'lucide-react';
import { Resource } from '../types';
import { getSubjectColor } from '../data';

interface ResourceCardProps {
  resource: Resource;
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  isFavorited: boolean;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  onSelect,
  onToggleFavorite,
  isFavorited
}) => {
  const { title, grade, subject, fileType, rating, downloads, coverUrl, points } = resource;
  const colors = getSubjectColor(subject);

  return (
    <article 
      onClick={() => onSelect(resource.id)}
      className="flex flex-col bg-white rounded-xl overflow-hidden border border-slate-200/60 hover:border-primary/50 hover:shadow-md transition-all duration-300 cursor-pointer group h-full"
    >
      {/* Cover Image Area */}
      <div className="aspect-[4/3] relative bg-slate-100 w-full overflow-hidden">
        <img 
          src={coverUrl} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        {/* Format Badge */}
        <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-sm text-white font-display text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase">
          {fileType}
        </div>
        {/* Free/Points badge */}
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-[10px] px-1.5 py-0.5 rounded-full font-medium text-primary">
          {points === 0 ? '免费' : `${points} 积分`}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3 flex flex-col flex-1 gap-2">
        <h3 className="font-sans text-sm font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-200">
          {title}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-auto pt-1">
          <span className={`font-sans text-[10px] px-2 py-0.5 rounded-full font-medium ${colors.bg}`}>
            {subject}
          </span>
          <span className="bg-slate-100 text-slate-600 font-sans text-[10px] px-2 py-0.5 rounded-full font-medium">
            {grade}
          </span>
        </div>

        {/* Footer info */}
        <div className="flex justify-between items-center mt-2 border-t border-slate-100 pt-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-0.5 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold">{rating.toFixed(1)}</span>
            </span>
            <span className="flex items-center gap-0.5">
              <Download className="w-3 h-3 text-slate-400" />
              <span>{downloads >= 1000 ? `${(downloads / 1000).toFixed(1)}k` : downloads}</span>
            </span>
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(resource.id, e);
            }}
            className={`p-1 rounded-full hover:bg-rose-50 transition-colors duration-200 ${
              isFavorited ? 'text-rose-500' : 'text-slate-300 hover:text-slate-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </article>
  );
};
