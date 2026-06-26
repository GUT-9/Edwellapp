<template>
  <view class="flex-1 flex flex-col bg-slate-50 min-h-screen pb-32">
    <!-- Sub-page Header -->
    <view class="sticky top-0 z-40 bg-white/90 backdrop-blur-md w-full box-border h-14 flex flex-row items-center justify-between px-4 border-b border-slate-100 shrink-0 mt-8">
      <view 
        @click="handleBack"
        class="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-all cursor-pointer"
      >
        <view class="text-slate-700" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICAgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGxpbmUgeDE9IjE5IiB5MT0iMTIiIHgyPSI1IiB5Mj0iMTIiPjwvbGluZT48cG9seWxpbmUgcG9pbnRzPSIxMiAxOSA1IDEyIDEyIDUiPjwvcG9seWxpbmU+PC9zdmc+'); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
      </view>
      <text class="font-display text-sm font-bold text-slate-800 truncate flex-1 text-center">
        资源详情
      </text>
      <view class="w-8 flex items-center justify-center">
        <view 
          v-if="resource && user && (user.role === 'admin' || user.id === resource.authorId)"
          @click="confirmDelete"
          class="p-2 -mr-2 rounded-full hover:bg-rose-50 transition-all cursor-pointer"
        >
          <view class="text-rose-500 w-5 h-5" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZjQzZjVlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTMgNmgyYTEgMSAwIDAgMCAxLTFoMTJhMSAxIDAgMCAwIDEtMWgybS00IDB2MTRhMiAyIDAgMCAxLTIgMkgyYTIgMiAwIDAgMS0yLTJWNmgyem01IDV2OG00LTh2OG00LTh2OCIvPjwvc3ZnPg=='); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
        </view>
      </view>
    </view>

    <view v-if="resource" class="flex-1 flex flex-col">
      <!-- Preview Area -->
      <view class="w-full aspect-video bg-slate-900 relative overflow-hidden flex items-center justify-center">
        <view v-if="isPlaying" class="absolute inset-0 bg-black flex flex-col items-center justify-center text-white p-4">
          <text class="animate-pulse text-sm font-semibold text-[#00685f]">正在播放模拟视频...</text>
          <view class="w-1/2 bg-slate-800 h-1 rounded-full overflow-hidden mt-4">
            <view class="bg-[#00685f] h-full w-2/3 animate-progress"></view>
          </view>
          <button 
            @click="isPlaying = false"
            class="mt-6 text-xs bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-full transition-colors font-medium border-none text-white cursor-pointer"
          >
            停止播放
          </button>
        </view>
        <view v-else class="absolute inset-0 flex items-center justify-center">
          <image :src="resource.coverUrl || getFallbackCover(resource.subject)" @error="resource.coverUrl = getFallbackCover(resource.subject)" mode="aspectFill" class="absolute inset-0 w-full h-full opacity-80" />
          
          <!-- Play Button Overlay if MP4 or VIDEO -->
          <view v-if="isVideo(resource.fileType)"
            @click="isPlaying = true"
            class="absolute inset-0 m-auto w-16 h-16 bg-white/25 hover:bg-white/35 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300 cursor-pointer"
            hover-class="opacity-80 scale-95"
          >
            <view class="fill-current text-white ml-1" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICAgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWdvbiBwb2ludHM9IjUgMyAxOSAxMiA1IDIxIDUgMyI+PC9wb2x5Z29uPjwvc3ZnPg=='); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
          </view>

          <!-- Document Icon Overlay if Document -->
          <view v-else
            class="absolute inset-0 m-auto w-16 h-16 bg-black/40 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white shadow-lg"
          >
            <view class="text-white" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICAgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTQgMkg2YTIgMiAwIDAgMC0yIDJ2MTZhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0yVjh6Ij48L3BhdGg+PHBvbHlsaW5lIHBvaW50cz0iMTQgMiAxNCA4IDIwIDgiPjwvcG9seWxpbmU+PGxpbmUgeDE9IjE2IiB5MT0iMTMiIHgyPSI4IiB5Mj0iMTMiPjwvbGluZT48bGluZSB4MT0iMTYiIHkxPSIxNyIgeDI9IjgiIHkyPSIxNyI+PC9saW5lPjxwb2x5bGluZSBwb2ludHM9IjEwIDkgOSA5IDggOSI+PC9wb2x5bGluZT48L3N2Zz4='); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
          </view>
          
          <!-- Format Badge -->
          <view class="absolute top-4 right-4 px-2 py-1 bg-black/70 backdrop-blur text-white text-[10px] font-bold tracking-wider rounded uppercase flex flex-row items-center gap-1 shadow-md">
            <view class="text-white" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICAgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xNCAySDZhMiAyIDAgMCAwLTIgMnYxNmEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJWOHoiPjwvcGF0aD48cG9seWxpbmUgcG9pbnRzPSIxNCAyIDE0IDggMjAgOCI+PC9wb2x5bGluZT48bGluZSB4MT0iMTYiIHkxPSIxMyIgeDI9IjgiIHkyPSIxMyI+PC9saW5lPjxsaW5lIHgxPSIxNiIgeTE9IjE3IiB4Mj0iOCIgeTI9IjE3Ij48L2xpbmU+PC9zdmc+'); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
            <text>{{ resource.fileType }}</text>
          </view>
        </view>
      </view>

      <!-- Metadata Section -->
      <view class="bg-white px-5 py-6 flex flex-col gap-4 border-b border-slate-100">
        <text class="font-display text-base font-bold text-slate-800 leading-snug">
          {{ resource.title }}
        </text>

        <!-- Academic Tags -->
        <view class="flex flex-row flex-wrap gap-1.5">
          <text :class="['px-2.5 py-1 rounded-full font-sans text-[11px] font-semibold border', getSubjectClass(resource.subject)]">
            {{ resource.subject }}
          </text>
          <text class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-sans text-[11px] font-semibold">
            {{ resource.grade }}
          </text>
          <text class="px-2.5 py-1 rounded-full bg-slate-50 text-slate-500 font-sans text-[11px] border border-slate-200/50 font-medium">
            名师共享资源
          </text>
        </view>

        <!-- Stats details -->
        <view class="flex flex-row items-center gap-6 text-slate-400 font-sans text-xs">
          <view class="flex flex-row items-center gap-1 text-amber-500 font-bold">
            <view class="fill-current text-amber-500" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICAgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmNTllMGIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWdvbiBwb2ludHM9IjEyIDIgMTUuMDkgOC4yNiAyMiA5LjI3IDE3IDE0LjE0IDE4LjE4IDIxLjAyIDEyIDE3Ljc3IDUuODIgMjEuMDIgNyAxNC4xNCAyIDkuMjcgOC45MSA4LjI2IDEyIDIiPjwvcG9seWdvbj48L3N2Zz4='); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
            <text>5.0</text>
          </view>
          <view class="flex flex-row items-center gap-1">
            <view class="text-slate-400" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICAgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5NGEzYjgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMSAxMnM0LTggMTEtOCAxMSA4IDExIDgtNCA4LTExIDgtMTEtOC0xMS04eiI+PC9wYXRoPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMiPjwvY2lyY2xlPjwvc3ZnPg=='); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
            <text>{{ resource.views >= 1000 ? `${(resource.views / 1000).toFixed(1)}k` : resource.views }} 次浏览</text>
          </view>
          <view class="flex flex-row items-center gap-1">
            <view class="text-slate-400" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICAgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5NGEzYjgiIHN0cm9rZS13aWR0aD0iMi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMSAxNXY0YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0ydi00Ij48L3BhdGg+PHBvbHlsaW5lIHBvaW50cz0iNyAxMCAxMiAxNSAxNyAxMCI+PC9wb2x5bGluZT48bGluZSB4MT0iMTIiIHkxPSIxNSIgeDI9IjEyIiB5Mj0iMyI+PC9saW5lPjwvc3ZnPg=='); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
            <text>{{ resource.downloads }} 次下载</text>
          </view>
        </view>

        <view class="h-[1px] w-full bg-slate-100"></view>

        <!-- Description -->
        <view class="space-y-1">
          <text class="block font-display text-[14px] font-bold text-slate-800">资源简介</text>
          <text class="block font-sans text-xs text-slate-500 leading-relaxed">
            {{ resource.description || '暂无详细描述。' }}
          </text>
        </view>
        <view class="space-y-1">
          <text class="block font-sans text-[11px] font-bold text-slate-400">贡献人: {{ resource.authorName }}</text>
        </view>
      </view>

      <!-- Related Recommendations (Horizontal Scroll) -->
      <view class="py-5 bg-transparent" v-if="relatedResources.length > 0">
        <view class="px-5 mb-3 flex flex-row items-center justify-between">
          <text class="font-display text-[14px] font-bold text-slate-800">相关推荐</text>
          <text @click="goToLibrary" class="text-[#00685f] hover:text-[#008378] font-sans text-xs font-semibold flex flex-row items-center transition-colors cursor-pointer gap-0.5">
            <text>查看更多</text>
            <view class="text-[#00685f]" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICAgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDY4NWYiIHN0cm9rZS13aWR0aD0iMi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjkgMTggMTUgMTIgOSA2Ij48L3BvbHlsaW5lPjwvc3ZnPg=='); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
          </text>
        </view>

        <scroll-view scroll-x class="whitespace-nowrap px-5 pb-3" show-scrollbar="false">
          <view 
            v-for="rel in relatedResources" 
            :key="rel.id"
            @click="switchResource(rel.id)"
            class="inline-block w-44 snap-start bg-white rounded-xl border border-slate-200/50 overflow-hidden shadow-sm mr-3 hover:shadow-md hover:border-[#00685f]/20 transition-all cursor-pointer"
          >
            <view class="h-24 w-full bg-slate-100 relative">
              <image :src="rel.coverUrl || getFallbackCover(rel.subject)" @error="rel.coverUrl = getFallbackCover(rel.subject)" mode="aspectFill" class="w-full h-full" />
              <text class="absolute bottom-2 right-2 bg-slate-900/80 text-white px-1.5 py-0.2 rounded text-[9px] font-bold">
                {{ rel.fileType }}
              </text>
            </view>
            <view class="p-3 flex flex-col gap-1.5">
              <text class="font-sans text-xs font-bold text-slate-800 truncate block">
                {{ rel.title }}
              </text>
              <view class="flex flex-row items-center justify-between text-[10px] mt-1">
                <text class="font-semibold text-[#00685f]">
                  {{ rel.points === 0 ? '免费' : `${rel.points} 积分` }}
                </text>
                <text class="text-slate-400">{{ rel.downloads }} 下载</text>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>

    <view v-else class="flex-1 flex flex-col items-center justify-center p-6 text-center py-24">
      <text class="text-slate-500 text-sm">正在加载中...</text>
    </view>

    <!-- Fixed Bottom Action Bar -->
    <view v-if="resource" class="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-100 px-4 py-3 pb-safe z-30 flex flex-row items-center justify-between shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
      <!-- Points Display -->
      <view class="flex flex-row items-baseline gap-0.5">
        <text class="font-display text-2xl font-bold text-[#00685f] tracking-tight">
          {{ resource.points }}
        </text>
        <text class="font-sans text-[11px] font-semibold text-slate-500">积分</text>
      </view>

      <!-- Actions -->
      <view class="flex flex-row items-center gap-3">
        <!-- Favorite Button -->
        <view 
          @click="handleFavoriteToggle"
          :class="['w-10 h-10 flex items-center justify-center rounded-full border transition-colors cursor-pointer',
            isFavorited ? 'text-rose-500 border-rose-100 bg-rose-50' : 'text-slate-400 hover:text-slate-600 border-slate-200 bg-white'
          ]"
          hover-class="opacity-80 scale-95"
        >
          <view class="text-rose-500 fill-current" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHYtaWY9ImlzRmF2b3JpdGVkIiAgIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZjQzZjVlIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTkgMTRjMS40OS0xLjQ2IDMtMy4yMSAzLTUuNUE1LjUgNS41IDAgMCAwIDE2LjUgM2MtMS43NiAwLTMgLjUtNC41IDItMS41LTEuNS0yLjc0LTItNC41LTJBNS41IDUuNSAwIDAgMCAyIDguNWMwIDIuMyAxLjUgNC4wNSAzIDUuNWw3IDdaIj48L3BhdGg+PC9zdmc+'); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
          <view class="text-slate-400" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHYtZWxzZSAgIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTkgMTRjMS40OS0xLjQ2IDMtMy4yMSAzLTUuNUE1LjUgNS41IDAgMCAwIDE2LjUgM2MtMS43NiAwLTMgLjUtNC41IDItMS41LTEuNS0yLjc0LTItNC41LTJBNS41IDUuNSAwIDAgMCAyIDguNWMwIDIuMyAxLjUgNC4wNSAzIDUuNWw3IDdaIj48L3BhdGg+PC9zdmc+'); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
        </view>
        
        <!-- Download Button -->
        <button 
          @click="handleDownloadClick"
          :class="['px-8 py-2.5 rounded-full font-display text-sm font-bold shadow-sm cursor-pointer transition-all border-none',
            isDownloaded
              ? 'bg-slate-100 text-slate-500 border border-slate-200'
              : 'bg-[#00685f] hover:bg-[#008378] text-white'
          ]"
          hover-class="opacity-80 scale-95"
        >
          {{ isDownloaded ? '查看文件' : '立即下载' }}
        </button>
      </view>
    </view>

    <!-- Download Confirmation Modal -->
    <view v-if="isModalOpen && resource" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <view @click="isModalOpen = false" class="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity"></view>

      <!-- Dialog Container -->
      <view class="relative bg-white w-80 rounded-2xl shadow-xl flex flex-col p-6 border border-slate-100 mx-4 z-[51]">
        <view class="flex flex-col items-center text-center gap-2 mb-5">
          <view class="w-12 h-12 rounded-full bg-[#00685f]/10 text-[#00685f] flex items-center justify-center mb-1">
            <view class="text-[#00685f]" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICAgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDY4NWYiIHN0cm9rZS13aWR0aD0iMi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMSAxNXY0YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0ydi00Ij48L3BhdGg+PHBvbHlsaW5lIHBvaW50cz0iNyAxMCAxMiAxNSAxNyAxMCI+PC9wb2x5bGluZT48bGluZSB4MT0iMTIiIHkxPSIxNSIgeDI9IjEyIiB5Mj0iMyI+PC9saW5lPjwvc3ZnPg=='); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
          </view>
          <text class="font-display text-base font-bold text-slate-800">确认下载资源</text>
          <text class="font-sans text-xs text-slate-400 leading-relaxed">
            下载此资源将扣除您的账户积分，确认继续操作吗？
          </text>
        </view>

        <!-- Cost Details -->
        <view class="bg-slate-50 rounded-xl p-3 mb-5 flex flex-row justify-between items-center border border-slate-100">
          <text class="font-sans text-xs text-slate-400">本次消耗</text>
          <view class="flex flex-row items-baseline gap-0.5 text-[#00685f]">
            <text class="font-display text-base font-bold">-{{ resource.points }}</text>
            <text class="font-sans text-[10px] font-semibold">积分</text>
          </view>
        </view>

        <!-- Actions -->
        <view class="flex flex-row gap-3">
          <button 
            @click="isModalOpen = false"
            class="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 font-sans text-xs font-semibold cursor-pointer text-center bg-white border-solid"
          >
            取消
          </button>
          <button 
            @click="handleConfirmDownload"
            :disabled="downloadLoading"
            class="flex-1 py-2 rounded-xl bg-[#00685f] text-white font-sans text-xs font-semibold shadow-sm cursor-pointer text-center border-none flex items-center justify-center"
          >
            <view v-if="downloadLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></view>
            <text v-else>确认下载</text>
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { getFallbackCover } from '../../utils/fallbackCovers'
import { onLoad } from '@dcloudio/uni-app'
import { request } from '../../utils/request'

const resourceId = ref('')
const resource = ref(null)
const user = ref({})
const isPlaying = ref(false)
const isModalOpen = ref(false)
const downloadLoading = ref(false)
const relatedResources = ref([])

const isFavorited = ref(false)
const isDownloaded = ref(false)

onLoad((options) => {
  if (options.id) {
    resourceId.value = options.id
    fetchResourceDetails()
    // Save to browse history local storage
    saveToBrowseHistory(options.id)
  }
})

const saveToBrowseHistory = (id) => {
  let history = uni.getStorageSync('browse_history') || []
  history = history.filter(hid => hid !== id)
  history.push(id)
  uni.setStorageSync('browse_history', history)
}

const fetchResourceDetails = async () => {
  try {
    const res = await request({
      url: `/resources/${resourceId.value}`,
      method: 'GET'
    })
    resource.value = res.data
    
    // Fetch user profile to check favorite and download status
    fetchUserProfile()
    
    // Fetch related recommendations
    fetchRelatedRecommendations()
  } catch (err) {
    uni.showToast({ title: '加载资源详情失败', icon: 'none' })
  }
}

const fetchUserProfile = async () => {
  const token = uni.getStorageSync('token')
  if (!token) return

  try {
    const res = await request({
      url: '/user/profile',
      method: 'GET'
    })
    user.value = res.data
    
    isFavorited.value = (res.data.favoritedIds || []).includes(resourceId.value)
    isDownloaded.value = (res.data.downloadedIds || []).includes(resourceId.value)
  } catch (err) {}
}

const fetchRelatedRecommendations = async () => {
  try {
    const res = await request({
      url: '/resources',
      method: 'GET',
      data: {
        subject: resource.value.subject,
        stage: resource.value.stage
      }
    })
    // Filter current resource
    relatedResources.value = res.data.filter(r => r.id !== resourceId.value).slice(0, 5)
  } catch (err) {}
}

const handleBack = () => {
  uni.navigateBack({
    fail: () => {
      uni.switchTab({
        url: '/pages/index/index'
      })
    }
  })
}

const switchResource = (id) => {
  uni.redirectTo({
    url: `/pages/detail/detail?id=${id}`
  })
}

const goToLibrary = () => {
  uni.switchTab({
    url: '/pages/library/library'
  })
}

const handleFavoriteToggle = async () => {
  const token = uni.getStorageSync('token')
  if (!token) {
    uni.navigateTo({ url: '/pages/login/login' })
    return
  }

  try {
    await request({
      url: `/resources/${resourceId.value}/favorite`,
      method: 'POST'
    })
    isFavorited.value = !isFavorited.value
    uni.showToast({ title: isFavorited.value ? '已收藏' : '已取消收藏', icon: 'success' })
  } catch (err) {}
}

const confirmDelete = () => {
  uni.showModal({
    title: '删除确认',
    content: '您确定要彻底删除该资源吗？此操作不可恢复。',
    confirmText: '删除',
    confirmColor: '#f43f5e',
    success: (res) => {
      if (res.confirm) {
        handleDeleteResource()
      }
    }
  })
}

const handleDeleteResource = async () => {
  try {
    uni.showLoading({ title: '正在删除...' })
    await request({
      url: `/resources/${resourceId.value}`,
      method: 'DELETE'
    })
    uni.hideLoading()
    uni.showToast({ title: '删除成功', icon: 'success' })
    setTimeout(() => {
      handleBack()
    }, 1000)
  } catch (err) {
    uni.hideLoading()
    uni.showToast({ title: err?.msg || '删除失败', icon: 'none' })
  }
}

const doDownloadFile = (fileUrl) => {
  // #ifdef H5
  uni.showModal({
    title: '下载资源',
    content: `请选择操作方式：`,
    confirmText: '直接下载',
    cancelText: '复制链接',
    success: (modalRes) => {
      if (modalRes.confirm) {
        window.open(fileUrl, '_blank')
      } else if (modalRes.cancel) {
        uni.setClipboardData({
          data: fileUrl,
          success: () => uni.showToast({ title: '复制链接成功', icon: 'success' })
        })
      }
    }
  })
  // #endif

  // #ifdef MP-WEIXIN
  uni.showLoading({ title: '文件下载中...' })
  uni.downloadFile({
    url: fileUrl,
    success: (downloadRes) => {
      if (downloadRes.statusCode === 200) {
        uni.hideLoading()
        // Try to open it with native document viewer if it's a document
        if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'].includes(resource.value.fileType.toLowerCase())) {
          uni.openDocument({
            filePath: downloadRes.tempFilePath,
            fileType: resource.value.fileType.toLowerCase(),
            showMenu: true,
            success: function () {
              console.log('打开文档成功')
            },
            fail: () => {
               uni.showModal({ title: '提示', content: '暂不支持直接预览该类型，文件已保存。' })
            }
          })
        } else if (['mp4', 'avi'].includes(resource.value.fileType.toLowerCase())) {
           uni.saveVideoToPhotosAlbum({
              filePath: downloadRes.tempFilePath,
              success: function () {
                  uni.showToast({ title: '已保存至相册', icon: 'success' })
              }
           })
        } else {
          uni.showToast({ title: '下载完成，请在本地查找', icon: 'success' })
        }
      }
    },
    fail: () => {
      uni.hideLoading()
      uni.showModal({
        title: '下载失败',
        content: '文件可能过大或网络异常，已为您复制链接。',
        showCancel: false,
        success: () => {
          uni.setClipboardData({ data: fileUrl })
        }
      })
    }
  })
  // #endif
}

const handleDownloadClick = () => {
  const token = uni.getStorageSync('token')
  if (!token) {
    uni.navigateTo({ url: '/pages/login/login' })
    return
  }

  if (isDownloaded.value) {
    // Already downloaded, trigger the download/preview process again
    doDownloadFile(resource.value.fileUrl)
    return
  }

  // Open download dialog
  isModalOpen.value = true
}

const handleConfirmDownload = async () => {
  downloadLoading.value = true
  try {
    const res = await request({
      url: `/resources/${resourceId.value}/download`,
      method: 'POST'
    })
    downloadLoading.value = false
    isModalOpen.value = false
    isDownloaded.value = true
    
    uni.showToast({ title: '购买成功，准备下载...', icon: 'success' })
    fetchUserProfile() // Refresh points
    
    const fileUrl = res.data

    setTimeout(() => {
      doDownloadFile(fileUrl)
    }, 800)
  } catch (err) {
    downloadLoading.value = false
    isModalOpen.value = false
    uni.showToast({ title: err?.msg || '下载失败', icon: 'none' })
  }
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

const isVideo = (type) => {
  if (!type) return false;
  const t = type.toUpperCase();
  return ['MP4', 'VIDEO', 'AVI', 'MOV', 'MKV'].includes(t);
}
</script>

<script>
export default {
  options: {
    styleIsolation: 'shared'
  }
}
</script>

<style scoped>
.font-display {
  font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

@keyframes progress {
  from { width: 0; }
  to { width: 100%; }
}
.animate-progress {
  animation: progress 5s infinite linear;
}
.whitespace-nowrap {
  white-space: nowrap;
}
.inline-block {
  display: inline-block;
}
</style>


