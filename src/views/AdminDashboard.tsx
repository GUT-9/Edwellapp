/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, Users, Library, ShieldAlert, Settings, Bell, LogOut, 
  TrendingUp, AlertTriangle, UserCheck, CheckCircle2, XCircle, ChevronRight,
  Eye, FileText, Check, HelpCircle, X
} from 'lucide-react';
import { Resource } from '../types';

interface AdminDashboardProps {
  resources: Resource[];
  onApproveResource: (id: string) => void;
  onRejectResource: (id: string, reason: string) => void;
  onCloseAdmin: () => void;
}

type AdminTab = 'dashboard' | 'users' | 'resources' | 'audit' | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  resources,
  onApproveResource,
  onRejectResource,
  onCloseAdmin
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [selectedAuditRes, setSelectedAuditRes] = useState<Resource | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectInputOpen, setIsRejectInputOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState<'7' | '30'>('7');

  // Calculate metrics
  const totalUsers = 12450;
  const platformResourcesCount = resources.filter(r => r.status === 'approved').length + 45800;
  
  const pendingResources = useMemo(() => {
    return resources.filter(r => r.status === 'pending');
  }, [resources]);

  const sidebarItems = [
    { id: 'dashboard' as const, label: '仪表盘', icon: LayoutDashboard },
    { id: 'users' as const, label: '用户管理', icon: Users },
    { id: 'resources' as const, label: '资源管理', icon: Library },
    { 
      id: 'audit' as const, 
      label: '审核中心', 
      icon: ShieldAlert, 
      badge: pendingResources.length 
    },
    { id: 'settings' as const, label: '系统设置', icon: Settings }
  ];

  // SVG Chart data points
  const chartData7Days = [65, 89, 72, 105, 90, 130, 150];
  const chartLabels7Days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

  const chartData30Days = [320, 390, 420, 310, 480, 520, 490, 610, 580, 650, 720, 810];
  const chartLabels30Days = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

  const chartPoints = timeFilter === '7' ? chartData7Days : chartData30Days;
  const chartLabels = timeFilter === '7' ? chartLabels7Days : chartLabels30Days;

  // Render responsive SVG line graph
  const renderSVGGraph = () => {
    const width = 500;
    const height = 220;
    const padding = 30;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const maxVal = Math.max(...chartPoints) * 1.1;
    const pointsCount = chartPoints.length;

    // Calculate (x, y) coordinates
    const coordinates = chartPoints.map((val, idx) => {
      const x = padding + (idx / (pointsCount - 1)) * chartWidth;
      const y = padding + chartHeight - (val / maxVal) * chartHeight;
      return { x, y, val };
    });

    // SVG path string (Spline spline curve calculation)
    let pathD = '';
    coordinates.forEach((coor, idx) => {
      if (idx === 0) {
        pathD += `M ${coor.x} ${coor.y}`;
      } else {
        const prev = coordinates[idx - 1];
        const cpX1 = prev.x + (coor.x - prev.x) / 2;
        const cpY1 = prev.y;
        const cpX2 = prev.x + (coor.x - prev.x) / 2;
        const cpY2 = coor.y;
        pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${coor.x} ${coor.y}`;
      }
    });

    // Fill area below spline
    const fillD = `${pathD} L ${coordinates[pointsCount - 1].x} ${padding + chartHeight} L ${coordinates[0].x} ${padding + chartHeight} Z`;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00685f" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="#00685f" stopOpacity="0.0"/>
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = padding + chartHeight * ratio;
          return (
            <line 
              key={idx} 
              x1={padding} 
              y1={y} 
              x2={width - padding} 
              y2={y} 
              className="stroke-slate-100" 
              strokeDasharray="4,4" 
            />
          );
        })}

        {/* Fill Area */}
        <path d={fillD} fill="url(#chartGrad)" />

        {/* Spline Path Line */}
        <path d={pathD} fill="none" stroke="#00685f" strokeWidth="2.5" strokeLinecap="round" />

        {/* Data points */}
        {coordinates.map((coor, idx) => (
          <g key={idx} className="group/dot cursor-pointer">
            <circle 
              cx={coor.x} 
              cy={coor.y} 
              r="4" 
              className="fill-white stroke-primary" 
              strokeWidth="2.5" 
            />
            {/* Hover tooltip bubble */}
            <rect 
              x={coor.x - 20} 
              y={coor.y - 28} 
              width="40" 
              height="20" 
              rx="4" 
              className="fill-slate-800 opacity-0 group-hover/dot:opacity-100 transition-opacity"
            />
            <text 
              x={coor.x} 
              y={coor.y - 15} 
              textAnchor="middle" 
              className="text-[9px] font-bold fill-white opacity-0 group-hover/dot:opacity-100 transition-opacity font-display"
            >
              {coor.val}
            </text>
          </g>
        ))}

        {/* X axis labels */}
        {coordinates.map((coor, idx) => (
          <text 
            key={idx} 
            x={coor.x} 
            y={height - 8} 
            textAnchor="middle" 
            className="text-[10px] fill-slate-400 font-sans font-medium"
          >
            {chartLabels[idx]}
          </text>
        ))}
      </svg>
    );
  };

  const handleAuditApprove = (id: string) => {
    onApproveResource(id);
    setSelectedAuditRes(null);
  };

  const handleAuditReject = () => {
    if (!selectedAuditRes) return;
    if (!rejectReason.trim()) return;
    onRejectResource(selectedAuditRes.id, rejectReason);
    setRejectReason('');
    setIsRejectInputOpen(false);
    setSelectedAuditRes(null);
  };

  return (
    <div className="flex-1 bg-[#f7f9fc] text-slate-800 min-h-screen flex font-sans select-none">
      {/* Sidebar Panel */}
      <aside className="w-60 bg-white border-r border-slate-200/80 flex-shrink-0 flex flex-col h-screen sticky top-0">
        {/* Title branding */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 shrink-0">
          <span className="font-display text-base font-bold text-primary tracking-tight">学源汇 Admin</span>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 py-4 overflow-y-auto no-scrollbar space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <div 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center px-6 py-3.5 text-sm font-semibold cursor-pointer transition-all duration-150 relative ${
                  isActive 
                    ? 'text-primary bg-primary/5 font-bold border-r-4 border-primary' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4.5 h-4.5 mr-3" />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-auto bg-rose-500 text-white font-sans text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm shadow-rose-200">
                    {item.badge}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* User identification info */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold font-display text-sm border border-primary/20">
              A
            </div>
            <div>
              <div className="font-sans text-xs font-bold text-slate-800">Admin User</div>
              <div className="font-sans text-[10px] text-slate-400 font-semibold mt-0.5">超级管理员</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto no-scrollbar">
        {/* Header toolbar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-15 shrink-0">
          <div className="font-display text-base font-bold text-slate-800">
            {sidebarItems.find(i => i.id === activeTab)?.label}概览
          </div>
          
          <div className="flex items-center gap-5">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors relative cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
            <button 
              onClick={onCloseAdmin}
              className="flex items-center gap-1.5 text-slate-500 hover:text-primary font-sans text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>退出后台</span>
            </button>
          </div>
        </header>

        {/* Tab specific workspace views */}
        {activeTab === 'dashboard' && (
          <div className="p-8 max-w-[1200px] w-full mx-auto flex flex-col gap-6 animate-[fadeIn_0.3s]">
            {/* Metric counters bento grids */}
            <section className="grid grid-cols-3 gap-6">
              {/* Users counter */}
              <div className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm flex items-start justify-between relative overflow-hidden">
                <div className="space-y-1.5">
                  <div className="font-sans text-xs text-slate-400 font-bold">总计用户数</div>
                  <div className="font-display text-2xl font-bold text-slate-800">{totalUsers.toLocaleString()}</div>
                  <div className="flex items-center text-emerald-600 font-sans text-[10px] font-bold gap-0.5 pt-0.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+5.2% 较上周</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-slate-50 text-primary flex items-center justify-center border border-slate-100 shrink-0">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              {/* Resources counter */}
              <div className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm flex items-start justify-between relative overflow-hidden">
                <div className="space-y-1.5">
                  <div className="font-sans text-xs text-slate-400 font-bold">平台总资源</div>
                  <div className="font-display text-2xl font-bold text-slate-800">{platformResourcesCount.toLocaleString()}</div>
                  <div className="flex items-center text-emerald-600 font-sans text-[10px] font-bold gap-0.5 pt-0.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+124 今日新增</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-slate-50 text-indigo-500 flex items-center justify-center border border-slate-100 shrink-0">
                  <Library className="w-5 h-5" />
                </div>
              </div>

              {/* High-priority Warnings */}
              <div className="bg-rose-50 rounded-xl p-5 border border-rose-100 shadow-sm flex items-start justify-between relative overflow-hidden">
                <div className="space-y-1.5">
                  <div className="font-sans text-xs text-rose-700 font-bold">待审核资源</div>
                  <div className="font-display text-2xl font-bold text-rose-700">{pendingResources.length}</div>
                  <div className="flex items-center text-rose-600 font-sans text-[10px] font-bold gap-0.5 pt-0.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>积压警告，需及时处理</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-white text-rose-600 flex items-center justify-center border border-rose-200 shrink-0 shadow-sm">
                  <ShieldAlert className="w-5 h-5" />
                </div>
              </div>
            </section>

            {/* Spline Chart and Tasks rows */}
            <section className="grid grid-cols-3 gap-6">
              {/* Custom SVG Line Spline Chart (2/3 columns) */}
              <div className="col-span-2 bg-white rounded-xl p-6 border border-slate-200/60 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-6 shrink-0">
                  <h2 className="font-display text-[14px] font-bold text-slate-800">资源上传增长趋势</h2>
                  <select 
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value as any)}
                    className="bg-slate-50 border border-slate-200 text-slate-600 font-sans text-xs font-semibold rounded-lg px-3 py-1 outline-none cursor-pointer hover:bg-slate-100/50"
                  >
                    <option value="7">最近7天</option>
                    <option value="30">本年度走势</option>
                  </select>
                </div>
                
                <div className="flex-1 min-h-[220px] flex items-center justify-center">
                  {renderSVGGraph()}
                </div>
              </div>

              {/* Pending Work Items (1/3 columns) */}
              <div className="bg-white rounded-xl p-6 border border-slate-200/60 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-6 shrink-0">
                  <h2 className="font-display text-[14px] font-bold text-slate-800">最近待处理事项</h2>
                  <button 
                    onClick={() => setActiveTab('audit')}
                    className="text-primary font-sans text-xs font-bold hover:underline"
                  >
                    全部
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 max-h-[220px]">
                  {/* Task Audit Item mapping if pending items exist */}
                  {pendingResources.length > 0 ? (
                    pendingResources.map((res) => (
                      <div 
                        key={res.id} 
                        onClick={() => setSelectedAuditRes(res)}
                        className="p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group flex flex-col gap-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-amber-200/50">
                            资源审核
                          </span>
                          <span className="text-[10px] text-slate-400 font-sans font-semibold">刚刚</span>
                        </div>
                        <h3 className="font-sans text-xs font-bold text-slate-800 group-hover:text-primary transition-colors line-clamp-1">
                          《{res.title}》
                        </h3>
                        <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                          <span className="font-semibold text-slate-500">上传者: {res.author}</span>
                          <button className="text-white bg-primary hover:bg-primary-container px-2 py-1 rounded font-bold transition-colors">
                            去审核
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 flex flex-col gap-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          资源审核
                        </span>
                        <span className="text-[10px] text-slate-400 font-sans">10分钟前</span>
                      </div>
                      <h3 className="font-sans text-xs font-bold text-slate-800">
                        《高二物理期末复习真题汇编》
                      </h3>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                        <span>李老师上传</span>
                        <span className="text-emerald-500 font-bold">已处理</span>
                      </div>
                    </div>
                  )}

                  {/* Static Mock feed items to maintain high visual fidelity to screenshot */}
                  <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 flex flex-col gap-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        用户反馈
                      </span>
                      <span className="text-[10px] text-slate-400 font-sans">1小时前</span>
                    </div>
                    <h3 className="font-sans text-xs font-bold text-slate-800">
                      视频播放卡顿问题报告
                    </h3>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                      <span>学生A反馈</span>
                      <button className="text-primary hover:underline font-bold">查看详情</button>
                    </div>
                  </div>

                  <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 flex flex-col gap-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="bg-purple-50 text-purple-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-purple-100">
                        系统警告
                      </span>
                      <span className="text-[10px] text-slate-400 font-sans">2小时前</span>
                    </div>
                    <h3 className="font-sans text-xs font-bold text-slate-800 font-medium">
                      存储空间容量已达 85%
                    </h3>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                      <span>系统监控</span>
                      <button className="text-primary hover:underline font-bold">处理</button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Audit list interface view */}
        {activeTab === 'audit' && (
          <div className="p-8 max-w-[1200px] w-full mx-auto flex flex-col gap-6 animate-[fadeIn_0.3s]">
            <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="font-display text-sm font-bold text-slate-800">待审核资源大厅</h2>
                <p className="font-sans text-xs text-slate-400 mt-1">审核教师及同学上传的学习资源，确保其内容的高考合规性与排版合规性。</p>
              </div>

              {pendingResources.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {pendingResources.map((res) => (
                    <div key={res.id} className="p-6 flex items-start justify-between hover:bg-slate-50/30 transition-all gap-6">
                      <div className="flex gap-4">
                        <div className="w-16 aspect-[4/3] rounded bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                          <img src={res.coverUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <h3 className="font-sans text-sm font-bold text-slate-800">{res.title}</h3>
                            <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                              {res.fileType}
                            </span>
                          </div>
                          <p className="font-sans text-xs text-slate-400 line-clamp-2 max-w-2xl">{res.description}</p>
                          <div className="flex gap-1.5 text-[10px] text-slate-400 font-sans">
                            <span className="font-semibold text-slate-500">作者: {res.author}</span>
                            <span>•</span>
                            <span>学段: {res.stage === 'high' ? '高中' : res.stage === 'middle' ? '初中' : '小学'}</span>
                            <span>•</span>
                            <span>年级: {res.grade}</span>
                            <span>•</span>
                            <span>学科: {res.subject}</span>
                            <span>•</span>
                            <span>设置积分: {res.points}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 pt-1">
                        <button 
                          onClick={() => setSelectedAuditRes(res)}
                          className="bg-primary hover:bg-primary-container text-white px-4 py-2 rounded-lg font-sans text-xs font-semibold shadow-sm cursor-pointer"
                        >
                          审核操作
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 mb-3 text-slate-300 shadow-sm">
                    <Check className="w-6 h-6 text-slate-400" />
                  </div>
                  <h3 className="font-display text-sm font-bold text-slate-700">暂无待审核资源</h3>
                  <p className="font-sans text-xs text-slate-400 mt-1 max-w-xs">当前所有的上传资源都已完成了审核，干得漂亮！</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dummy placeholder fallback views */}
        {(activeTab === 'users' || activeTab === 'resources' || activeTab === 'settings') && (
          <div className="p-8 max-w-[1200px] w-full mx-auto animate-[fadeIn_0.3s]">
            <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 mb-3 text-slate-300 shadow-sm">
                <Settings className="w-6 h-6 text-slate-400 animate-spin-slow" />
              </div>
              <h3 className="font-display text-sm font-bold text-slate-700">模块开发中</h3>
              <p className="font-sans text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                此模块（{sidebarItems.find(i => i.id === activeTab)?.label}）专供管理员高级功能。前端精美UI框架已预设，敬请期待后续同步！
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Audit Detail Modal */}
      {selectedAuditRes && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div 
            onClick={() => {
              setSelectedAuditRes(null);
              setIsRejectInputOpen(false);
              setRejectReason('');
            }}
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
          />

          {/* Dialog Body */}
          <div className="relative bg-white w-[480px] max-w-full rounded-2xl shadow-2xl flex flex-col p-6 border border-slate-100 mx-4 animate-[scaleUp_0.2s]">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-display text-base font-bold text-slate-800">资源合规性审核</h3>
              <button 
                onClick={() => {
                  setSelectedAuditRes(null);
                  setIsRejectInputOpen(false);
                  setRejectReason('');
                }}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Main Info */}
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="font-sans text-xs font-bold text-slate-800 mb-1">《{selectedAuditRes.title}》</h4>
                <p className="font-sans text-[11px] text-slate-500 leading-relaxed line-clamp-3 mb-2">{selectedAuditRes.description}</p>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10px] text-slate-400 pt-2 border-t border-slate-200/55 font-medium">
                  <div><span className="text-slate-500">作者:</span> {selectedAuditRes.author}</div>
                  <div><span className="text-slate-500">文件格式:</span> {selectedAuditRes.fileType}</div>
                  <div><span className="text-slate-500">分类:</span> {selectedAuditRes.stage === 'high' ? '高中' : '初中'} / {selectedAuditRes.grade} / {selectedAuditRes.subject}</div>
                  <div><span className="text-slate-500">所需积分:</span> {selectedAuditRes.points} 积分</div>
                </div>
              </div>

              {/* Reject Reason input field */}
              {isRejectInputOpen ? (
                <div className="space-y-2 animate-[fadeIn_0.15s]">
                  <label className="block font-sans text-xs font-bold text-slate-700">驳回的具体原因 <span className="text-rose-500">*</span></label>
                  <textarea 
                    rows={3}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="请输入拒绝原因，如：讲义缺少答案、水印过多、格式不符..."
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-sans text-xs text-slate-800 bg-slate-50/20"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button 
                      onClick={() => {
                        setIsRejectInputOpen(false);
                        setRejectReason('');
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-sans text-[11px] font-semibold"
                    >
                      取消
                    </button>
                    <button 
                      onClick={handleAuditReject}
                      disabled={!rejectReason.trim()}
                      className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-sans text-[11px] font-semibold shadow-sm"
                    >
                      确认驳回
                    </button>
                  </div>
                </div>
              ) : (
                /* Audit Actions */
                <div className="flex gap-3 pt-3">
                  <button 
                    onClick={() => setIsRejectInputOpen(true)}
                    className="flex-1 py-3 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-sans text-xs font-semibold cursor-pointer text-center flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>驳回上传</span>
                  </button>
                  <button 
                    onClick={() => handleAuditApprove(selectedAuditRes.id)}
                    className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-container text-white font-sans text-xs font-semibold shadow-md cursor-pointer text-center flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>同意并发布</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
