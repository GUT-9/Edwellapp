/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X, RotateCcw, BookOpen, Layers, GraduationCap } from 'lucide-react';
import { Resource } from '../types';
import { ResourceCard } from '../components/ResourceCard';
import { STAGES, STAGE_GRADES, STAGE_SUBJECTS } from '../data';

interface LibraryViewProps {
  resources: Resource[];
  favoritedIds: string[];
  onSelectResource: (id: string) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  initialFilters?: { stage?: string; subject?: string; search?: string };
  clearInitialFilters?: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  resources,
  favoritedIds,
  onSelectResource,
  onToggleFavorite,
  initialFilters,
  clearInitialFilters
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部'); // '全部', '教案设计', '同步练习', '期末真题', '课件PPT'
  const [sortBy, setSortBy] = useState<'time' | 'downloads'>('time'); // 'time' (最新上传), 'downloads' (按下载排序)
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter Drawer State
  const [tempStage, setTempStage] = useState<'primary' | 'middle' | 'high' | 'all'>('all');
  const [tempGrade, setTempGrade] = useState<string>('all');
  const [tempSubject, setTempSubject] = useState<string>('all');

  // Applied Filters
  const [appliedStage, setAppliedStage] = useState<'primary' | 'middle' | 'high' | 'all'>('all');
  const [appliedGrade, setAppliedGrade] = useState<string>('all');
  const [appliedSubject, setAppliedSubject] = useState<string>('all');

  // Load initial filters if navigated from homepage
  useEffect(() => {
    if (initialFilters) {
      if (initialFilters.stage) {
        setAppliedStage(initialFilters.stage as any);
        setTempStage(initialFilters.stage as any);
      }
      if (initialFilters.subject) {
        setAppliedSubject(initialFilters.subject);
        setTempSubject(initialFilters.subject);
      }
      if (initialFilters.search) {
        setSearchQuery(initialFilters.search);
      }
      if (clearInitialFilters) {
        clearInitialFilters();
      }
    }
  }, [initialFilters]);

  // Helper to determine which stage a grade belongs to
  const getGradeStage = (grade: string): 'primary' | 'middle' | 'high' | undefined => {
    if ((STAGE_GRADES.primary as readonly string[]).includes(grade)) return 'primary';
    if ((STAGE_GRADES.middle as readonly string[]).includes(grade)) return 'middle';
    if ((STAGE_GRADES.high as readonly string[]).includes(grade)) return 'high';
    return undefined;
  };

  // Helper to get stages containing a subject
  const getSubjectStages = (subj: string): ('primary' | 'middle' | 'high')[] => {
    const list: ('primary' | 'middle' | 'high')[] = [];
    if ((STAGE_SUBJECTS.primary as readonly string[]).includes(subj)) list.push('primary');
    if ((STAGE_SUBJECTS.middle as readonly string[]).includes(subj)) list.push('middle');
    if ((STAGE_SUBJECTS.high as readonly string[]).includes(subj)) list.push('high');
    return list;
  };

  // Handle Cascading in Filter Drawer: 
  // If tempStage changes, we reset tempGrade and tempSubject if they are not compatible
  useEffect(() => {
    if (tempStage !== 'all') {
      const grades = STAGE_GRADES[tempStage];
      if (!(grades as readonly string[]).includes(tempGrade) && tempGrade !== 'all') {
        setTempGrade('all');
      }
      const subjects = STAGE_SUBJECTS[tempStage];
      if (!(subjects as readonly string[]).includes(tempSubject) && tempSubject !== 'all') {
        setTempSubject('all');
      }
    }
  }, [tempStage]);

  // Auto-correct incompatible grade and subject selections when stage is set to 'all' or when values change
  useEffect(() => {
    if (tempGrade !== 'all' && tempSubject !== 'all') {
      const gradeStage = getGradeStage(tempGrade);
      if (gradeStage) {
        const allowedSubjects = STAGE_SUBJECTS[gradeStage];
        if (!(allowedSubjects as readonly string[]).includes(tempSubject)) {
          setTempSubject('all');
        }
      }
    }
  }, [tempGrade]);

  useEffect(() => {
    if (tempSubject !== 'all' && tempGrade !== 'all') {
      const allowedStages = getSubjectStages(tempSubject);
      const gradeStage = getGradeStage(tempGrade);
      if (gradeStage && !allowedStages.includes(gradeStage)) {
        setTempGrade('all');
      }
    }
  }, [tempSubject]);

  // Category tags
  const categories = ['全部', '教案设计', '同步练习', '期末真题', '课件PPT'];

  // Grades list for current tempStage, dynamically filtered by selected subject
  const availableGrades = useMemo(() => {
    let baseGrades: string[] = [];
    if (tempStage === 'all') {
      baseGrades = [...STAGE_GRADES.primary, ...STAGE_GRADES.middle, ...STAGE_GRADES.high];
    } else {
      baseGrades = [...STAGE_GRADES[tempStage]];
    }

    if (tempSubject !== 'all') {
      const allowedStages = getSubjectStages(tempSubject);
      return baseGrades.filter(grade => {
        const gradeStage = getGradeStage(grade);
        return gradeStage && allowedStages.includes(gradeStage);
      });
    }

    return baseGrades;
  }, [tempStage, tempSubject]);

  // Subjects list for current tempStage, dynamically filtered by selected grade
  const availableSubjects = useMemo(() => {
    let baseSubjects: string[] = [];
    if (tempStage === 'all') {
      baseSubjects = Array.from(new Set([
        ...STAGE_SUBJECTS.primary,
        ...STAGE_SUBJECTS.middle,
        ...STAGE_SUBJECTS.high
      ]));
    } else {
      baseSubjects = [...STAGE_SUBJECTS[tempStage]];
    }

    if (tempGrade !== 'all') {
      const gradeStage = getGradeStage(tempGrade);
      if (gradeStage) {
        const stageSubjs = STAGE_SUBJECTS[gradeStage];
        return baseSubjects.filter(sub => (stageSubjs as readonly string[]).includes(sub));
      }
    }

    return baseSubjects;
  }, [tempStage, tempGrade]);

  // Reset Filters logic
  const handleResetFilters = () => {
    setTempStage('all');
    setTempGrade('all');
    setTempSubject('all');
  };

  // Apply filters from drawer
  const handleApplyFilters = () => {
    setAppliedStage(tempStage);
    setAppliedGrade(tempGrade);
    setAppliedSubject(tempSubject);
    setIsFilterOpen(false);
  };

  // Helper to check if any advanced filter is active
  const isAnyFilterActive = appliedStage !== 'all' || appliedGrade !== 'all' || appliedSubject !== 'all';

  const handleClearAllFilters = () => {
    setAppliedStage('all');
    setAppliedGrade('all');
    setAppliedSubject('all');
    setTempStage('all');
    setTempGrade('all');
    setTempSubject('all');
    setSearchQuery('');
    setActiveCategory('全部');
  };

  // Process resources with search, horizontal categories, advanced filters and sorting
  const filteredResources = useMemo(() => {
    let result = resources.filter(r => r.status === 'approved');

    // Search query filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => 
        r.title.toLowerCase().includes(q) || 
        r.description.toLowerCase().includes(q) ||
        r.subject.toLowerCase().includes(q)
      );
    }

    // Horizontal category filter mapping
    if (activeCategory !== '全部') {
      // Map category name to file types or text tags
      if (activeCategory === '教案设计') {
        result = result.filter(r => r.title.includes('讲义') || r.title.includes('教案') || r.description.includes('讲义'));
      } else if (activeCategory === '同步练习') {
        result = result.filter(r => r.title.includes('练习') || r.title.includes('测试') || r.title.includes('真题卷'));
      } else if (activeCategory === '期末真题') {
        result = result.filter(r => r.title.includes('真题') || r.title.includes('考点') || r.createdAt > '2026-06-15');
      } else if (activeCategory === '课件PPT') {
        result = result.filter(r => r.fileType.startsWith('PPT'));
      }
    }

    // Advanced drawer filters
    if (appliedStage !== 'all') {
      result = result.filter(r => r.stage === appliedStage);
    }
    if (appliedGrade !== 'all') {
      result = result.filter(r => r.grade === appliedGrade);
    }
    if (appliedSubject !== 'all') {
      result = result.filter(r => r.subject === appliedSubject);
    }

    // Sorting
    if (sortBy === 'time') {
      result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } else if (sortBy === 'downloads') {
      result.sort((a, b) => b.downloads - a.downloads);
    }

    return result;
  }, [resources, searchQuery, activeCategory, appliedStage, appliedGrade, appliedSubject, sortBy]);

  // Preview counts for the "Show Results" button in the filter drawer
  const tempFilteredCount = useMemo(() => {
    let result = resources.filter(r => r.status === 'approved');
    if (tempStage !== 'all') {
      result = result.filter(r => r.stage === tempStage);
    }
    if (tempGrade !== 'all') {
      result = result.filter(r => r.grade === tempGrade);
    }
    if (tempSubject !== 'all') {
      result = result.filter(r => r.subject === tempSubject);
    }
    return result.length;
  }, [resources, tempStage, tempGrade, tempSubject]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50">
      {/* Sub-header: Search & Filter bar */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between gap-3 sticky top-0 z-20">
        {/* Search input bar */}
        <div className="flex-1 flex items-center bg-slate-100 rounded-lg px-3 py-2 border border-slate-200/50 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 transition-all">
          <Search className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索资源、教案、试卷..."
            className="w-full bg-transparent border-none p-0 focus:ring-0 font-sans text-sm text-slate-700 placeholder:text-slate-400 outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-0.5 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Drawer Trigger */}
        <button 
          onClick={() => setIsFilterOpen(true)}
          className={`flex items-center justify-center gap-1 font-sans text-xs font-semibold px-4 py-2.5 rounded-lg active:scale-95 transition-all cursor-pointer border shadow-sm ${
            isAnyFilterActive 
              ? 'bg-primary/10 text-primary border-primary/20' 
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>筛选</span>
          {isAnyFilterActive && (
            <span className="w-2 h-2 rounded-full bg-primary inline-block ml-0.5"></span>
          )}
        </button>
      </div>

      {/* Main content scroll area */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* Category Chips (Horizontal Scroll) */}
        <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar bg-white border-b border-slate-100/50">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 font-sans text-xs font-semibold px-4 py-1.5 rounded-full transition-all border duration-200 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-slate-100 text-slate-600 border-slate-200/50 hover:bg-slate-200/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filters status and count row */}
        <div className="px-4 py-3 flex justify-between items-center bg-white/40">
          <div className="flex items-center gap-1.5">
            <h2 className="font-display text-[15px] font-bold text-slate-800">
              {activeCategory === '全部' ? '最新资源' : activeCategory}
            </h2>
            <span className="text-xs text-slate-400">({filteredResources.length} 个)</span>
          </div>

          <button 
            onClick={() => setSortBy(sortBy === 'time' ? 'downloads' : 'time')}
            className="flex items-center text-slate-500 font-sans text-xs font-medium gap-1 hover:text-primary transition-colors cursor-pointer"
          >
            <span>{sortBy === 'time' ? '最新发布' : '下载量高'}</span>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* Tag Filters display if active */}
        {isAnyFilterActive && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider mr-1">已筛:</span>
            {appliedStage !== 'all' && (
              <span className="bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                {STAGES.find(s => s.id === appliedStage)?.name}
              </span>
            )}
            {appliedGrade !== 'all' && (
              <span className="bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                {appliedGrade}
              </span>
            )}
            {appliedSubject !== 'all' && (
              <span className="bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                {appliedSubject}
              </span>
            )}
            <button 
              onClick={handleClearAllFilters}
              className="text-primary hover:text-primary-container text-[11px] font-semibold ml-1 underline flex items-center gap-0.5"
            >
              <RotateCcw className="w-3 h-3" />
              <span>清空</span>
            </button>
          </div>
        )}

        {/* Resource card grid layout */}
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 px-4 py-2">
            {filteredResources.map((res) => (
              <ResourceCard 
                key={res.id}
                resource={res}
                onSelect={onSelectResource}
                onToggleFavorite={onToggleFavorite}
                isFavorited={favoritedIds.includes(res.id)}
              />
            ))}
          </div>
        ) : (
          /* Empty State component */
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="font-display text-base font-bold text-slate-700 mb-1">暂无相关资源</h3>
            <p className="font-sans text-xs text-slate-400 max-w-xs leading-relaxed">
              尝试调整筛选条件或搜索关键词，发现更多精彩教学内容。
            </p>
            <button 
              onClick={handleClearAllFilters}
              className="mt-6 font-sans text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-6 py-2.5 rounded-lg transition-colors active:scale-95"
            >
              重置所有条件
            </button>
          </div>
        )}
      </div>

      {/* Filter Sidebar Drawer Overlay */}
      {isFilterOpen && (
        <div 
          onClick={() => setIsFilterOpen(false)}
          className="fixed inset-0 bg-slate-900/40 z-[100] backdrop-blur-sm transition-opacity duration-300"
        />
      )}

      {/* Filter Drawer Panel */}
      <aside 
        className={`fixed inset-y-0 right-0 w-80 max-w-full bg-white shadow-2xl flex flex-col h-full z-[101] transform transition-transform duration-300 ease-in-out ${
          isFilterOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 shrink-0">
          <h2 className="font-display text-base font-bold text-slate-800">资源筛选</h2>
          <button 
            onClick={() => setIsFilterOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Filter Options */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
          {/* 学段选择 */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-primary font-sans text-xs font-semibold">
              <GraduationCap className="w-4 h-4" />
              <span>学段选择</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setTempStage('all')}
                className={`py-2 rounded-full font-sans text-xs font-medium border text-center transition-all duration-200 cursor-pointer ${
                  tempStage === 'all'
                    ? 'bg-primary/10 text-primary border-primary/30 font-bold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 border-slate-200'
                }`}
              >
                全部
              </button>
              {STAGES.map(stage => (
                <button 
                  key={stage.id}
                  onClick={() => setTempStage(stage.id)}
                  className={`py-2 rounded-full font-sans text-xs font-medium border text-center transition-all duration-200 cursor-pointer ${
                    tempStage === stage.id
                      ? 'bg-primary/10 text-primary border-primary/30 font-bold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  {stage.name}
                </button>
              ))}
            </div>
          </div>

          {/* 年级选择 */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-primary font-sans text-xs font-semibold">
              <Layers className="w-4 h-4" />
              <span>年级选择</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setTempGrade('all')}
                className={`py-2 rounded-lg font-sans text-xs font-medium border text-center transition-all duration-200 cursor-pointer ${
                  tempGrade === 'all'
                    ? 'bg-primary/10 text-primary border-primary/30 font-bold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 border-slate-200'
                }`}
              >
                全部
              </button>
              {availableGrades.map(grade => (
                <button 
                  key={grade}
                  onClick={() => setTempGrade(grade)}
                  className={`py-2 rounded-lg font-sans text-xs font-medium border text-center transition-all duration-200 cursor-pointer ${
                    tempGrade === grade
                      ? 'bg-primary/10 text-primary border-primary/30 font-bold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>

          {/* 学科分类 */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-primary font-sans text-xs font-semibold">
              <BookOpen className="w-4 h-4" />
              <span>学科分类</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setTempSubject('all')}
                className={`py-2 rounded-lg font-sans text-xs font-medium border text-center transition-all duration-200 cursor-pointer ${
                  tempSubject === 'all'
                    ? 'bg-primary/10 text-primary border-primary/30 font-bold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 border-slate-200'
                }`}
              >
                全部
              </button>
              {availableSubjects.map(subject => (
                <button 
                  key={subject}
                  onClick={() => setTempSubject(subject)}
                  className={`py-2 rounded-lg font-sans text-xs font-medium border text-center transition-all duration-200 cursor-pointer ${
                    tempSubject === subject
                      ? 'bg-primary/10 text-primary border-primary/30 font-bold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer controls */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3 shrink-0 pb-safe">
          <button 
            onClick={handleResetFilters}
            className="flex-1 flex items-center justify-center gap-1 text-slate-600 hover:text-slate-800 font-sans text-xs font-semibold py-3 rounded-xl border border-slate-200 hover:bg-white active:bg-slate-100 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>重置</span>
          </button>
          <button 
            onClick={handleApplyFilters}
            className="flex-[2] bg-primary hover:bg-primary-container text-white font-sans text-xs font-semibold py-3 rounded-xl shadow-md active:scale-[0.98] transition-transform cursor-pointer text-center"
          >
            查看 {tempFilteredCount} 个结果
          </button>
        </div>
      </aside>
    </div>
  );
};
