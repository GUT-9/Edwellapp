/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Home, BookOpen, Upload, User, Menu, ShieldCheck, Eye, LogIn, CheckCircle2, ChevronRight } from 'lucide-react';
import { INITIAL_USER, INITIAL_RESOURCES } from './data';
import { Resource, UserProfile } from './types';
import { HomeView } from './views/HomeView';
import { LibraryView } from './views/LibraryView';
import { DetailView } from './views/DetailView';
import { UploadView } from './views/UploadView';
import { ProfileView } from './views/ProfileView';
import { LoginView } from './views/LoginView';
import { AdminDashboard } from './views/AdminDashboard';

export default function App() {
  // --- Persistent State ---
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('xyh_user_profile');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [resources, setResources] = useState<Resource[]>(() => {
    const saved = localStorage.getItem('xyh_resources');
    return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
  });

  // --- View Routing State ---
  const [currentTab, setCurrentTab] = useState<'home' | 'library' | 'upload' | 'profile'>('home');
  const [currentView, setCurrentView] = useState<'tab' | 'detail' | 'login'>('tab');
  const [selectedResourceId, setSelectedResourceId] = useState<string>('');
  
  // Navigation stack history for flawless back actions
  const [historyViews, setHistoryViews] = useState<{ tab: 'home' | 'library' | 'upload' | 'profile'; view: 'tab' | 'detail' | 'login'; resId?: string }[]>([]);

  // --- Mode State ---
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [initialFilters, setInitialFilters] = useState<{ stage?: string; subject?: string; search?: string } | undefined>(undefined);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('xyh_user_profile', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('xyh_resources', JSON.stringify(resources));
  }, [resources]);

  // --- Navigation Helpers ---
  const pushToHistory = (tab: typeof currentTab, view: typeof currentView, resId?: string) => {
    setHistoryViews(prev => [...prev, { tab: currentTab, view: currentView, resId: selectedResourceId }]);
  };

  const handleNavigateToDetail = (id: string) => {
    pushToHistory(currentTab, currentView, selectedResourceId);
    setSelectedResourceId(id);
    setCurrentView('detail');

    // Add to user browse history
    setUser(prev => {
      const hist = [...prev.historyIds];
      const filteredHist = hist.filter(h => h !== id); // Remove duplicates to bubble to top
      filteredHist.push(id);
      return { ...prev, historyIds: filteredHist };
    });

    // Increment resource views
    setResources(prev => prev.map(r => r.id === id ? { ...r, views: r.views + 1 } : r));
  };

  const handleNavigateToTab = (tab: 'home' | 'library' | 'upload' | 'profile') => {
    pushToHistory(currentTab, currentView, selectedResourceId);
    setCurrentTab(tab);
    setCurrentView('tab');
  };

  const handleNavigateToLibraryWithFilters = (filters?: { stage?: string; subject?: string; search?: string }) => {
    setInitialFilters(filters);
    handleNavigateToTab('library');
  };

  const handleBack = () => {
    if (historyViews.length > 0) {
      const prev = historyViews[historyViews.length - 1];
      setHistoryViews(prevList => prevList.slice(0, -1));
      setCurrentTab(prev.tab);
      setCurrentView(prev.view);
      if (prev.resId) {
        setSelectedResourceId(prev.resId);
      }
    } else {
      // Fallback
      setCurrentView('tab');
    }
  };

  // --- Favorites & Transactions Business Logic ---
  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUser(prev => {
      const isFav = prev.favoritedIds.includes(id);
      const favs = isFav 
        ? prev.favoritedIds.filter(fId => fId !== id)
        : [...prev.favoritedIds, id];
      return { ...prev, favoritedIds: favs };
    });
  };

  const handleConfirmDownload = (id: string, cost: number) => {
    setUser(prev => {
      const downloaded = prev.downloadedIds.includes(id) 
        ? prev.downloadedIds 
        : [...prev.downloadedIds, id];
      return { 
        ...prev, 
        points: prev.points - cost,
        downloadedIds: downloaded
      };
    });

    // Increment download metrics on resource
    setResources(prev => prev.map(r => r.id === id ? { ...r, downloads: r.downloads + 1 } : r));
  };

  // --- Upload Business Logic ---
  const handleAddPendingResource = (newRes: Resource) => {
    setResources(prev => [newRes, ...prev]);
    setUser(prev => ({
      ...prev,
      uploadedIds: [...prev.uploadedIds, newRes.id],
      points: prev.points + 20 // Reward user with 20 contribution points!
    }));
  };

  // --- Auth business logic ---
  const handleLoginSuccess = (phone: string) => {
    setUser(prev => ({
      ...prev,
      name: phone.slice(0, 3) + '****' + phone.slice(7),
      points: 1250,
      role: 'student'
    }));
    setCurrentView('tab');
    setCurrentTab('profile');
  };

  const handleLogout = () => {
    // Reset to mock guest
    setUser({
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
    });
    setCurrentView('tab');
    setCurrentTab('home');
  };

  // --- Admin Business Logic ---
  const handleApproveResource = (id: string) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
  };

  const handleRejectResource = (id: string, reason: string) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected', rejectReason: reason } : r));
  };

  // --- Admin overlay toggle widget ---
  const renderPlatformToggle = () => {
    return (
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 shrink-0">
        <button 
          onClick={() => setIsAdminMode(!isAdminMode)}
          className="bg-primary hover:bg-primary-container text-white px-3.5 py-2.5 rounded-full font-sans text-xs font-bold shadow-lg flex items-center gap-1.5 active:scale-95 transition-all select-none cursor-pointer border border-primary-container/20"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{isAdminMode ? '前台用户端' : '管理员后台'}</span>
        </button>
      </div>
    );
  };

  // If in admin mode, display the dashboard workspace
  if (isAdminMode) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans select-none relative">
        <AdminDashboard 
          resources={resources}
          onApproveResource={handleApproveResource}
          onRejectResource={handleRejectResource}
          onCloseAdmin={() => setIsAdminMode(false)}
        />
        {renderPlatformToggle()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center font-sans antialiased text-slate-800">
      {/* Platform Switcher floating button widget */}
      {renderPlatformToggle()}

      {/* Frame boundary mimicking mobile viewport size on larger screens */}
      <div className="w-full max-w-[480px] min-h-screen md:min-h-[850px] md:max-h-[900px] md:rounded-[40px] md:shadow-2xl md:border-[10px] md:border-slate-850 bg-white flex flex-col relative overflow-hidden">
        
        {/* Render Mobile Client top header except for detail and login view */}
        {currentView === 'tab' && (
          <header className="bg-white border-b border-slate-100 flex justify-between items-center h-16 px-4 w-full sticky top-0 z-40 shrink-0">
            <button 
              onClick={() => setIsAdminMode(true)}
              className="text-primary hover:bg-slate-50 transition-all p-2 rounded-full flex items-center justify-center shrink-0 cursor-pointer"
              title="管理后台"
            >
              <Menu className="w-5 h-5 text-slate-700" />
            </button>
            <div className="font-display text-base font-bold text-primary tracking-tight">
              学源汇
            </div>
            <button 
              onClick={() => handleNavigateToTab('profile')}
              className="text-slate-600 hover:bg-slate-50 transition-all p-1.5 rounded-full flex items-center justify-center shrink-0 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-200">
                <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
              </div>
            </button>
          </header>
        )}

        {/* View Switch Router */}
        {currentView === 'login' ? (
          <LoginView 
            onLoginSuccess={handleLoginSuccess}
            onClose={() => setCurrentView('tab')}
          />
        ) : currentView === 'detail' ? (
          <DetailView 
            resourceId={selectedResourceId}
            resources={resources}
            userPoints={user.points}
            downloadedIds={user.downloadedIds}
            favoritedIds={user.favoritedIds}
            onBack={handleBack}
            onSelectResource={handleNavigateToDetail}
            onToggleFavorite={handleToggleFavorite}
            onConfirmDownload={handleConfirmDownload}
          />
        ) : (
          /* View switch on Tab views */
          <>
            {currentTab === 'home' && (
              <HomeView 
                resources={resources}
                favoritedIds={user.favoritedIds}
                onSelectResource={handleNavigateToDetail}
                onToggleFavorite={handleToggleFavorite}
                onNavigateToLibrary={handleNavigateToLibraryWithFilters}
              />
            )}

            {currentTab === 'library' && (
              <LibraryView 
                resources={resources}
                favoritedIds={user.favoritedIds}
                onSelectResource={handleNavigateToDetail}
                onToggleFavorite={handleToggleFavorite}
                initialFilters={initialFilters}
                clearInitialFilters={() => setInitialFilters(undefined)}
              />
            )}

            {currentTab === 'upload' && (
              <UploadView 
                onAddPendingResource={handleAddPendingResource}
                onNavigateToTab={handleNavigateToTab}
              />
            )}

            {currentTab === 'profile' && (
              <ProfileView 
                user={user}
                resources={resources}
                onSelectResource={handleNavigateToDetail}
                onToggleFavorite={handleToggleFavorite}
                onLogout={handleLogout}
                onSwitchToAdmin={() => setIsAdminMode(true)}
              />
            )}

            {/* Bottom Tab Bar navigation */}
            <nav className="bg-white/95 backdrop-blur-md border-t border-slate-100 flex justify-around items-center h-16 pb-safe px-4 fixed bottom-0 w-full max-w-[480px] z-45 shadow-[0_-2px_12px_rgba(0,0,0,0.02)]">
              <button 
                onClick={() => handleNavigateToTab('home')}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-all cursor-pointer ${
                  currentTab === 'home' ? 'text-primary scale-105' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Home className={`w-5 h-5 mb-1 ${currentTab === 'home' ? 'fill-primary/10' : ''}`} />
                <span className="font-sans text-[10px] font-bold">首页</span>
              </button>

              <button 
                onClick={() => handleNavigateToTab('library')}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-all cursor-pointer ${
                  currentTab === 'library' ? 'text-primary scale-105' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <BookOpen className={`w-5 h-5 mb-1 ${currentTab === 'library' ? 'fill-primary/10' : ''}`} />
                <span className="font-sans text-[10px] font-bold">资源</span>
              </button>

              {/* Upload floating button action */}
              <button 
                onClick={() => handleNavigateToTab('upload')}
                className="flex flex-col items-center justify-center flex-1 h-full relative -top-3 cursor-pointer shrink-0"
              >
                <div className={`rounded-full p-3 shadow-md shadow-primary/20 flex items-center justify-center border transition-all ${
                  currentTab === 'upload' 
                    ? 'bg-primary text-white border-primary scale-110' 
                    : 'bg-white border-slate-100 text-slate-400 hover:text-slate-600 hover:scale-105'
                }`}>
                  <Upload className="w-5.5 h-5.5" />
                </div>
                <span className="font-sans text-[10px] font-bold mt-1 text-slate-500">上传</span>
              </button>

              <button 
                onClick={() => handleNavigateToTab('profile')}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-all cursor-pointer ${
                  currentTab === 'profile' ? 'text-primary scale-105' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <User className={`w-5 h-5 mb-1 ${currentTab === 'profile' ? 'fill-primary/10' : ''}`} />
                <span className="font-sans text-[10px] font-bold">我的</span>
              </button>
            </nav>
          </>
        )}
      </div>
    </div>
  );
}
