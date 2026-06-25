<template>
  <view class="flex-1 flex flex-col bg-slate-50 min-h-screen pb-20">
    <!-- Search and Filter Bar -->
    <view class="bg-white border-b border-slate-100 px-4 py-3 flex flex-row items-center justify-between gap-3 sticky top-0 z-20">
      <view :class="['flex-1 flex flex-row items-center bg-slate-100 rounded-lg px-3 py-2 border transition-all duration-200', isFocused ? 'border-[#00685f] bg-white shadow-sm ring-light' : 'border-slate-200/50']">
        <image src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICAgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5NGEzYjgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMSIgY3k9IjExIiByPSI4Ij48L2NpcmNsZT48bGluZSB4MT0iMjEiIHkxPSIyMSIgeDI9IjE2LjY1IiB5Mj0iMTYuNjUiPjwvbGluZT48L3N2Zz4=" class="text-slate-400 mr-2 shrink-0" style="width: 16px; height: 16px; flex-shrink: 0;" mode="aspectFit" />
        <input 
          type="text" 
          v-model="searchQuery" 
          @focus="isFocused = true"
          @blur="isFocused = false"
          placeholder="搜索资源、教案、试卷..." 
          class="flex-1 bg-transparent font-sans text-xs text-slate-700 outline-none"
        />
        <view v-if="searchQuery" @click="searchQuery = ''" class="text-slate-400 font-sans text-xs font-bold px-1 cursor-pointer">
          <image src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICAgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5NGEzYjgiIHN0cm9rZS13aWR0aD0iMi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxsaW5lIHgxPSIxOCIgeTE9IjYiIHgyPSI2IiB5Mj0iMTgiPjwvbGluZT48bGluZSB4MT0iNiIgeTE9IjYiIHgyPSIxOCIgeTI9IjE4Ij48L2xpbmU+PC9zdmc+" class="text-slate-400" style="width: 14px; height: 14px; flex-shrink: 0;" mode="aspectFit" />
        </view>
      </view>

      <view 
        @click="isFilterOpen = true"
        :class="['flex flex-row items-center justify-center gap-1 font-sans text-xs font-semibold px-4 py-2.5 rounded-lg border shadow-sm transition-all cursor-pointer', 
          isAnyFilterActive ? 'bg-[#00685f]/10 text-[#00685f] border-[#00685f]/20' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
        ]"
      >
        <image src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48bGluZSB4MT0iMjEiIHkxPSI0IiB4Mj0iMTQiIHkyPSI0Ij48L2xpbmU+PGxpbmUgeDE9IjEwIiB5MT0iNCIgeDI9IjMiIHkyPSI0Ij48L2xpbmU+PGxpbmUgeDE9IjIxIiB5MT0iMTIiIHgyPSIxMiIgeTI9IjEyIj48L2xpbmU+PGxpbmUgeDE9IjgiIHkxPSIxMiIgeDI9IjMiIHkyPSIxMiI+PC9saW5lPjxsaW5lIHgxPSIyMSIgeTE9IjIwIiB4Mj0iMTYiIHkyPSIyMCI+PC9saW5lPjxsaW5lIHgxPSIxMiIgeTE9IjIwIiB4Mj0iMyIgeTI9IjIwIj48L2xpbmU+PGxpbmUgeDE9IjE0IiB5MT0iMiIgeDI9IjE0IiB5Mj0iNiI+PC9saW5lPjxsaW5lIHgxPSI4IiB5MT0iMTAiIHgyPSI4IiB5Mj0iMTQiPjwvbGluZT48bGluZSB4MT0iMTYiIHkxPSIxOCIgeDI9IjE2IiB5Mj0iMjIiPjwvbGluZT48L3N2Zz4="  style="width: 14px; height: 14px; flex-shrink: 0;" mode="aspectFit" />
        <text>筛选</text>
        <view v-if="isAnyFilterActive" class="w-2 h-2 rounded-full bg-[#00685f] ml-1"></view>
      </view>
    </view>

    <!-- Category Tabs (Horizontal Scroll) -->
    <scroll-view scroll-x class="whitespace-nowrap px-4 py-3 bg-white border-b border-slate-100/50" show-scrollbar="false">
      <view 
        v-for="cat in categories" 
        :key="cat"
        @click="activeCategory = cat"
        :class="['inline-block shrink-0 font-sans text-xs font-semibold px-4 py-1.5 rounded-full mr-2 border transition-all cursor-pointer',
          activeCategory === cat ? 'bg-[#00685f] text-white border-[#00685f] shadow-sm' : 'bg-slate-100 text-slate-600 border-slate-200/50 hover:bg-slate-200/50'
        ]"
      >
        {{ cat }}
      </view>
    </scroll-view>

    <!-- Header info -->
    <view class="px-4 py-3 flex flex-row justify-between items-center bg-white/40">
      <view class="flex flex-row items-center gap-1">
        <text class="font-display text-[15px] font-bold text-slate-800">
          {{ activeCategory === '全部' ? '最新资源' : activeCategory }}
        </text>
        <text class="text-xs text-slate-400 ml-1">({{ filteredResources.length }} 个)</text>
      </view>

      <view 
        @click="sortBy = sortBy === 'time' ? 'downloads' : 'time'"
        class="flex flex-row items-center text-slate-500 font-sans text-xs font-medium gap-1 hover:text-[#00685f] transition-colors cursor-pointer"
      >
        <text>{{ sortBy === 'time' ? '最新发布' : '下载量高' }}</text>
        <image src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICAgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5NGEzYjgiIHN0cm9rZS13aWR0aD0iMi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Im0yMSAxNi00IDQtNC00Ij48L3BhdGg+PHBhdGggZD0iTTE3IDIwVjQiPjwvcGF0aD48cGF0aCBkPSJtMyA4IDQtNCA0IDQiPjwvcGF0aD48cGF0aCBkPSJNNyA0djE2Ij48L3BhdGg+PC9zdmc+" class="text-slate-400" style="width: 14px; height: 14px; flex-shrink: 0;" mode="aspectFit" />
      </view>
    </view>

    <!-- Active Tags Row -->
    <view v-if="isAnyFilterActive" class="px-4 pb-2 flex flex-row flex-wrap gap-1.5 items-center">
      <text class="text-[10px] font-semibold text-slate-400 mr-1 uppercase tracking-wider">已筛:</text>
      <text v-if="appliedStage !== 'all'" class="bg-[#00685f]/10 text-[#00685f] text-[10px] font-semibold px-2 py-0.5 rounded-full mr-1">
        {{ STAGES.find(s => s.id === appliedStage)?.name }}
      </text>
      <text v-if="appliedGrade !== 'all'" class="bg-[#00685f]/10 text-[#00685f] text-[10px] font-semibold px-2 py-0.5 rounded-full mr-1">
        {{ appliedGrade }}
      </text>
      <text v-if="appliedSubject !== 'all'" class="bg-[#00685f]/10 text-[#00685f] text-[10px] font-semibold px-2 py-0.5 rounded-full mr-1">
        {{ appliedSubject }}
      </text>
      <view @click="handleClearAllFilters" class="text-[#00685f] hover:text-[#008378] text-[11px] font-semibold ml-1 underline flex flex-row items-center gap-0.5 cursor-pointer">
        <image src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICAgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDY4NWYiIHN0cm9rZS13aWR0aD0iMi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0zIDEyYTkgOSAwIDEgMCA5LTkgOS43NSA5Ljc1IDAgMCAwLTYuNzQgMi43NEwzIDgiPjwvcGF0aD48cG9seWxpbmUgcG9pbnRzPSIzIDMgMyA4IDggOCI+PC9wb2x5bGluZT48L3N2Zz4=" class="text-[#00685f]" style="width: 12px; height: 12px; flex-shrink: 0;" mode="aspectFit" />
        <text>重置</text>
      </view>
    </view>

    <!-- Main Resource Grid -->
    <view v-if="filteredResources.length > 0" class="grid grid-cols-2 gap-3 px-4 py-2">
      <view 
        v-for="res in filteredResources" 
        :key="res.id"
        @click="navigateToDetail(res.id)"
        class="group bg-white rounded-xl overflow-hidden border border-slate-200/60 flex flex-col cursor-pointer hover:border-[#00685f]/40 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-300"
      >
        <view class="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
          <image :src="res.coverUrl" mode="aspectFill" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <view class="absolute top-2 right-2 z-10">
            <text class="bg-slate-900/80 backdrop-blur-sm text-white text-[9px] font-display font-bold px-1.5 py-0.5 rounded tracking-wider uppercase">
              {{ res.fileType }}
            </text>
          </view>
          <view class="absolute bottom-2 left-2 z-10">
            <text class="bg-white/90 backdrop-blur-sm text-[9px] px-1.5 py-0.5 rounded-full font-medium text-[#00685f] shadow-xs">
              {{ res.points === 0 ? '免费' : `${res.points} 积分` }}
            </text>
          </view>
        </view>
        <view class="p-3 flex-1 flex flex-col gap-2">
          <text class="font-sans text-xs font-semibold text-slate-800 line-clamp-2 leading-snug transition-colors duration-200 group-hover:text-[#00685f] h-[32px]">
            {{ res.title }}
          </text>
          
          <view class="flex flex-row flex-wrap gap-1 mt-auto pt-1">
            <text :class="['font-sans text-[9px] px-2 py-0.5 rounded-full font-medium border', getSubjectClass(res.subject)]">
              {{ res.subject }}
            </text>
            <text class="bg-slate-100 text-slate-600 font-sans text-[9px] px-2 py-0.5 rounded-full font-medium">
              {{ res.grade }}
            </text>
          </view>

          <view class="flex flex-row justify-between items-center mt-2 border-t border-slate-100 pt-2 text-[10px] text-slate-500">
            <view class="flex flex-row items-center gap-2">
              <view class="flex flex-row items-center gap-0.5 text-amber-500 font-bold">
                <image src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICAgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmNTllMGIiIHN0cm9rZS13aWR0aD0iMi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5Z29uIHBvaW50cz0iMTIgMiAxNS4wOSA4LjI2IDIyIDkuMjcgMTcgMTQuMTQgMTguMTggMjEuMDIgMTIgMTcuNzcgNS44MiAyMS4wMiA3IDE0LjE0IDIgOS4yNyA4LjkxIDguMjYgMTIgMiI+PC9wb2x5Z29uPjwvc3ZnPg==" class="fill-current text-amber-500" style="width: 12px; height: 12px; flex-shrink: 0;" mode="aspectFit" />
                <text>{{ (res.rating || 5.0).toFixed(1) }}</text>
              </view>
              <view class="flex flex-row items-center gap-0.5 text-slate-400">
                <image src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICAgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5NGEzYjgiIHN0cm9rZS13aWR0aD0iMi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMSAxNXY0YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0ydi00Ij48L3BhdGg+PHBvbHlsaW5lIHBvaW50cz0iNyAxMCAxMiAxNSAxNyAxMCI+PC9wb2x5bGluZT48bGluZSB4MT0iMTIiIHkxPSIxNSIgeDI9IjEyIiB5Mj0iMyI+PC9saW5lPjwvc3ZnPg==" class="text-slate-400" style="width: 12px; height: 12px; flex-shrink: 0;" mode="aspectFit" />
                <text>{{ res.downloads >= 1000 ? `${(res.downloads / 1000).toFixed(1)}k` : res.downloads }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- Empty State -->
    <view v-else class="flex flex-col items-center justify-center py-20 px-6 text-center">
      <view class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <image src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICAgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5NGEzYjgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMSIgY3k9IjExIiByPSI4Ij48L2NpcmNsZT48bGluZSB4MT0iMjEiIHkxPSIyMSIgeDI9IjE2LjY1IiB5Mj0iMTYuNjUiPjwvbGluZT48L3N2Zz4=" class="text-slate-400" style="width: 40px; height: 40px; flex-shrink: 0;" mode="aspectFit" />
      </view>
      <text class="font-display text-base font-bold text-slate-700 mb-1">暂无相关资源</text>
      <text class="font-sans text-xs text-slate-400 max-w-xs leading-relaxed">
        尝试调整筛选条件或重新搜索，探索更多K12精选备课资料。
      </text>
      <button 
        @click="handleClearAllFilters"
        class="mt-6 font-sans text-xs font-semibold text-[#00685f] bg-[#00685f]/10 hover:bg-[#00685f]/20 px-6 py-2.5 rounded-lg active:scale-95 border-none transition-colors cursor-pointer"
      >
        重置所有条件
      </button>
    </view>

    <!-- Filter Drawer (Overlay + Panel) -->
    <view v-if="isFilterOpen" class="fixed inset-0 z-[100] flex flex-row justify-end">
      <!-- Backdrop -->
      <view @click="isFilterOpen = false" class="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"></view>

      <!-- Panel -->
      <view class="relative w-80 max-w-full bg-white h-full shadow-2xl flex flex-col z-[101]">
        <!-- Header -->
        <view class="flex flex-row justify-between items-center px-6 py-4 border-b border-slate-100 shrink-0">
          <text class="font-display text-base font-bold text-slate-800">资源筛选</text>
          <view @click="isFilterOpen = false" class="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer">
            <image src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48bGluZSB4MT0iMTgiIHkxPSI2IiB4Mj0iNiIgeTI9IjE4Ij48L2xpbmU+PGxpbmUgeDE9IjYiIHkxPSI2IiB4Mj0iMTgiIHkyPSIxOCI+PC9saW5lPjwvc3ZnPg=="  style="width: 20px; height: 20px; flex-shrink: 0;" mode="aspectFit" />
          </view>
        </view>

        <!-- Scrollable Options Content -->
        <scroll-view scroll-y class="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar">
          <!-- Stage Section -->
          <view class="space-y-3 mb-6">
            <view class="flex flex-row items-center gap-1.5 text-[#00685f] font-sans text-xs font-semibold">
              <image src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICAgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDY4NWYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjEuNDIgMTAuOTIyYTEgMSAwIDAgMC0uMDE5LTEuODM4TDEyLjgzIDUuMThhMiAyIDAgMCAwLTEuNjYgMEwyLjYgOS4wOGExIDEgMCAwIDAgMCAxLjgzMmw4LjU3IDMuOTA4YTIgMiAwIDAgMCAxLjY2IDB6Ij48L3BhdGg+PHBhdGggZD0iTTYgMTJ2NWMwIDIgMiAzIDYgM3M2LTEgNi0zdi01Ij48L3BhdGg+PC9zdmc+" class="text-[#00685f]" style="width: 16px; height: 16px; flex-shrink: 0;" mode="aspectFit" />
              <text>学段选择</text>
            </view>
            <view class="grid grid-cols-3 gap-2">
              <view 
                @click="tempStage = 'all'"
                :class="['py-2 rounded-full font-sans text-xs font-medium border text-center transition-all cursor-pointer',
                  tempStage === 'all' ? 'bg-[#00685f]/10 text-[#00685f] border-[#00685f]/30 font-bold' : 'text-slate-600 border-slate-200 hover:bg-slate-50'
                ]"
              >
                全部
              </view>
              <view 
                v-for="stage in STAGES" 
                :key="stage.id"
                @click="tempStage = stage.id"
                :class="['py-2 rounded-full font-sans text-xs font-medium border text-center transition-all cursor-pointer',
                  tempStage === stage.id ? 'bg-[#00685f]/10 text-[#00685f] border-[#00685f]/30 font-bold' : 'text-slate-600 border-slate-200 hover:bg-slate-50'
                ]"
              >
                {{ stage.name }}
              </view>
            </view>
          </view>

          <!-- Grade Section (Cascading) -->
          <view class="space-y-3 mb-6">
            <view class="flex flex-row items-center gap-1.5 text-[#00685f] font-sans text-xs font-semibold">
              <image src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICAgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDY4NWYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJtMTIgMy0xMCA1TDEyIDEzbDEwLTUtMTAtNVoiPjwvcGF0aD48cGF0aCBkPSJtMiAxNyAxMCA1IDEwLTUiPjwvcGF0aD48cGF0aCBkPSJtMiAxMiAxMCA1IDEwLTUiPjwvcGF0aD48L3N2Zz4=" class="text-[#00685f]" style="width: 16px; height: 16px; flex-shrink: 0;" mode="aspectFit" />
              <text>年级选择</text>
            </view>
            <view class="grid grid-cols-3 gap-2">
              <view 
                @click="tempGrade = 'all'"
                :class="['py-2 rounded-lg font-sans text-xs font-medium border text-center transition-all cursor-pointer',
                  tempGrade === 'all' ? 'bg-[#00685f]/10 text-[#00685f] border-[#00685f]/30 font-bold' : 'text-slate-600 border-slate-200 hover:bg-slate-50'
                ]"
              >
                全部
              </view>
              <view 
                v-for="grade in availableGrades" 
                :key="grade"
                @click="tempGrade = grade"
                :class="['py-2 rounded-lg font-sans text-xs font-medium border text-center transition-all cursor-pointer',
                  tempGrade === grade ? 'bg-[#00685f]/10 text-[#00685f] border-[#00685f]/30 font-bold' : 'text-slate-600 border-slate-200 hover:bg-slate-50'
                ]"
              >
                {{ grade }}
              </view>
            </view>
          </view>

          <!-- Subject Section (Cascading) -->
          <view class="space-y-3 mb-6">
            <view class="flex flex-row items-center gap-1.5 text-[#00685f] font-sans text-xs font-semibold">
              <image src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICAgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDY4NWYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMiAzaDZhNCA0IDAgMCAxIDQgNHYxNGEzIDMgMCAwIDAtMy0zSDJ6Ij48L3BhdGg+PHBhdGggZD0iTTIyIDNoLTZhNCA0IDAgMCAwLTQgNHYxNGEzIDMgMCAwIDEgMy0zaDd6Ij48L3BhdGg+PC9zdmc+" class="text-[#00685f]" style="width: 16px; height: 16px; flex-shrink: 0;" mode="aspectFit" />
              <text>学科分类</text>
            </view>
            <view class="grid grid-cols-3 gap-2">
              <view 
                @click="tempSubject = 'all'"
                :class="['py-2 rounded-lg font-sans text-xs font-medium border text-center transition-all cursor-pointer',
                  tempSubject === 'all' ? 'bg-[#00685f]/10 text-[#00685f] border-[#00685f]/30 font-bold' : 'text-slate-600 border-slate-200 hover:bg-slate-50'
                ]"
              >
                全部
              </view>
              <view 
                v-for="subject in availableSubjects" 
                :key="subject"
                @click="tempSubject = subject"
                :class="['py-2 rounded-lg font-sans text-xs font-medium border text-center transition-all cursor-pointer',
                  tempSubject === subject ? 'bg-[#00685f]/10 text-[#00685f] border-[#00685f]/30 font-bold' : 'text-slate-600 border-slate-200 hover:bg-slate-50'
                ]"
              >
                {{ subject }}
              </view>
            </view>
          </view>
        </scroll-view>

        <!-- Footer -->
        <view class="p-4 border-t border-slate-100 bg-slate-50 flex flex-row gap-3 shrink-0 pb-safe">
          <view 
            @click="handleResetFilters"
            class="flex-1 flex flex-row items-center justify-center gap-1 text-slate-600 font-sans text-xs font-semibold py-3 rounded-xl border border-slate-200 bg-white cursor-pointer hover:text-slate-800"
          >
            <image src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICAgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2NDc0OGIiIHN0cm9rZS13aWR0aD0iMi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0zIDEyYTkgOSAwIDEgMCA5LTkgOS43NSA5Ljc1IDAgMCAwLTYuNzQgMi43NEwzIDgiPjwvcGF0aD48cG9seWxpbmUgcG9pbnRzPSIzIDMgMyA4IDggOCI+PC9wb2x5bGluZT48L3N2Zz4=" class="text-slate-500" style="width: 14px; height: 14px; flex-shrink: 0;" mode="aspectFit" />
            <text>重置</text>
          </view>
          <view 
            @click="handleApplyFilters"
            class="flex-[2] bg-[#00685f] hover:bg-[#008378] text-white font-sans text-xs font-semibold py-3 rounded-xl shadow-md text-center cursor-pointer active:scale-[0.98] transition-all"
          >
            查看结果 ({{ tempFilteredCount }}个)
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { request } from '../../utils/request'

// Config Data from API
const STAGES = ref([])
const STAGE_GRADES = ref({})
const STAGE_SUBJECTS = ref({})

// State
const searchQuery = ref('')
const activeCategory = ref('全部')
const sortBy = ref('time')
const isFilterOpen = ref(false)
const isFocused = ref(false)

const tempStage = ref('all')
const tempGrade = ref('all')
const tempSubject = ref('all')

const appliedStage = ref('all')
const appliedGrade = ref('all')
const appliedSubject = ref('all')

const categories = ['全部', '教案设计', '同步练习', '期末真题', '课件PPT']

const resources = ref([])

onShow(() => {
  const initStage = uni.getStorageSync('search_init_stage')
  if (initStage) {
    appliedStage.value = initStage
    tempStage.value = initStage
    uni.removeStorageSync('search_init_stage')
  }

  const initSubject = uni.getStorageSync('search_init_subject')
  if (initSubject) {
    appliedSubject.value = initSubject
    tempSubject.value = initSubject
    uni.removeStorageSync('search_init_subject')
  }

  const initQuery = uni.getStorageSync('search_init_query')
  if (initQuery) {
    searchQuery.value = initQuery
    uni.removeStorageSync('search_init_query')
  }

  fetchConfig()
  fetchResources()
})

const fetchConfig = async () => {
  try {
    const [stagesRes, gradesRes, subjectsRes] = await Promise.all([
      request({ url: '/stages', method: 'GET' }),
      request({ url: '/grades', method: 'GET' }),
      request({ url: '/subjects', method: 'GET' })
    ])
    STAGES.value = stagesRes.data || []
    STAGE_GRADES.value = gradesRes.data || {}
    STAGE_SUBJECTS.value = subjectsRes.data || {}
  } catch (err) {
    console.error(err)
  }
}

const fetchResources = async () => {
  try {
    const res = await request({
      url: '/resources',
      method: 'GET'
    })
    resources.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const getGradeStage = (grade) => {
  for (const [stageId, gradesArr] of Object.entries(STAGE_GRADES.value)) {
    if (gradesArr.includes(grade)) return stageId
  }
  return undefined
}

const getSubjectStages = (subj) => {
  const list = []
  for (const [stageId, subjectsArr] of Object.entries(STAGE_SUBJECTS.value)) {
    if (subjectsArr.includes(subj)) list.push(stageId)
  }
  return list
}

const getSubjectClass = (subject) => {
  const mapping = {
    '语文': 'bg-red-100 text-red-600 border-red-300',
    '数学': 'bg-blue-100 text-blue-600 border-blue-300',
    '英语': 'bg-purple-100 text-purple-600 border-purple-300',
    '物理': 'bg-green-100 text-green-600 border-green-300',
    '化学': 'bg-slate-100 text-slate-600 border-slate-300',
    '生物': 'bg-emerald-100 text-emerald-700 border-emerald-300',
    '科学': 'bg-teal-100 text-teal-600 border-teal-300',
    '历史': 'bg-amber-100 text-amber-700 border-amber-300',
    '地理': 'bg-cyan-100 text-cyan-600 border-cyan-300',
    '道德与法治': 'bg-rose-100 text-rose-600 border-rose-300'
  }
  return mapping[subject] || 'bg-slate-50 text-slate-500 border-slate-200'
}

watch(tempStage, (newStage) => {
  if (newStage !== 'all' && STAGE_GRADES.value[newStage]) {
    const grades = STAGE_GRADES.value[newStage]
    if (!grades.includes(tempGrade.value) && tempGrade.value !== 'all') {
      tempGrade.value = 'all'
    }
    const subjects = STAGE_SUBJECTS.value[newStage]
    if (subjects && !subjects.includes(tempSubject.value) && tempSubject.value !== 'all') {
      tempSubject.value = 'all'
    }
  }
})

watch(tempGrade, (newGrade) => {
  if (newGrade !== 'all' && tempSubject.value !== 'all') {
    const gradeStage = getGradeStage(newGrade)
    if (gradeStage) {
      const allowedSubjs = STAGE_SUBJECTS.value[gradeStage] || []
      if (!allowedSubjs.includes(tempSubject.value)) {
        tempSubject.value = 'all'
      }
    }
  }
})

watch(tempSubject, (newSubj) => {
  if (newSubj !== 'all' && tempGrade.value !== 'all') {
    const allowedStages = getSubjectStages(newSubj)
    const gradeStage = getGradeStage(tempGrade.value)
    if (gradeStage && !allowedStages.includes(gradeStage)) {
      tempGrade.value = 'all'
    }
  }
})

const availableGrades = computed(() => {
  let baseGrades = []
  if (tempStage.value === 'all') {
    Object.values(STAGE_GRADES.value).forEach(arr => {
      baseGrades.push(...arr)
    })
  } else {
    baseGrades = [...(STAGE_GRADES.value[tempStage.value] || [])]
  }

  if (tempSubject.value !== 'all') {
    const allowedStages = getSubjectStages(tempSubject.value)
    return baseGrades.filter(g => {
      const gStage = getGradeStage(g)
      return gStage && allowedStages.includes(gStage)
    })
  }

  return baseGrades
})

const availableSubjects = computed(() => {
  let baseSubjects = []
  if (tempStage.value === 'all') {
    const allSubs = []
    Object.values(STAGE_SUBJECTS.value).forEach(arr => {
      allSubs.push(...arr)
    })
    baseSubjects = Array.from(new Set(allSubs))
  } else {
    baseSubjects = [...(STAGE_SUBJECTS.value[tempStage.value] || [])]
  }

  if (tempGrade.value !== 'all') {
    const gradeStage = getGradeStage(tempGrade.value)
    if (gradeStage) {
      const stageSubjs = STAGE_SUBJECTS.value[gradeStage] || []
      return baseSubjects.filter(sub => stageSubjs.includes(sub))
    }
  }

  return baseSubjects
})

const tempFilteredCount = computed(() => {
  let result = resources.value.filter(r => r.status === 'approved')
  if (tempStage.value !== 'all') {
    result = result.filter(r => r.stage === tempStage.value)
  }
  if (tempGrade.value !== 'all') {
    result = result.filter(r => r.grade === tempGrade.value)
  }
  if (tempSubject.value !== 'all') {
    result = result.filter(r => r.subject === tempSubject.value)
  }
  return result.length
})

const isAnyFilterActive = computed(() => {
  return appliedStage.value !== 'all' || appliedGrade.value !== 'all' || appliedSubject.value !== 'all'
})

const handleResetFilters = () => {
  tempStage.value = 'all'
  tempGrade.value = 'all'
  tempSubject.value = 'all'
}

const handleApplyFilters = () => {
  appliedStage.value = tempStage.value
  appliedGrade.value = tempGrade.value
  appliedSubject.value = tempSubject.value
  isFilterOpen.value = false
}

const handleClearAllFilters = () => {
  appliedStage.value = 'all'
  appliedGrade.value = 'all'
  appliedSubject.value = 'all'
  tempStage.value = 'all'
  tempGrade.value = 'all'
  tempSubject.value = 'all'
  searchQuery.value = ''
  activeCategory.value = '全部'
}

const filteredResources = computed(() => {
  let result = resources.value.filter(r => r.status === 'approved')

  if (searchQuery.value.trim() !== '') {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(r => 
      r.title.toLowerCase().includes(q) || 
      r.subject.toLowerCase().includes(q)
    )
  }

  if (activeCategory.value !== '全部') {
    if (activeCategory.value === '教案设计') {
      result = result.filter(r => r.title.includes('讲义') || r.title.includes('教案'))
    } else if (activeCategory.value === '同步练习') {
      result = result.filter(r => r.title.includes('练习') || r.title.includes('测试'))
    } else if (activeCategory.value === '期末真题') {
      result = result.filter(r => r.title.includes('真题'))
    } else if (activeCategory.value === '课件PPT') {
      result = result.filter(r => r.fileType === 'PPT' || r.fileType === 'PPTX')
    }
  }

  if (appliedStage.value !== 'all') {
    result = result.filter(r => r.stage === appliedStage.value)
  }
  if (appliedGrade.value !== 'all') {
    result = result.filter(r => r.grade === appliedGrade.value)
  }
  if (appliedSubject.value !== 'all') {
    result = result.filter(r => r.subject === appliedSubject.value)
  }

  if (sortBy.value === 'downloads') {
    result.sort((a, b) => b.downloads - a.downloads)
  } else {
    result.sort((a, b) => {
      const timeA = a.createTime || a.createdAt || ''
      const timeB = b.createTime || b.createdAt || ''
      return String(timeB).localeCompare(String(timeA))
    })
  }

  return result
})

const navigateToDetail = (id) => {
  uni.navigateTo({
    url: `/pages/detail/detail?id=${id}`
  })
}
</script>

<style scoped>
.font-display {
  font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
