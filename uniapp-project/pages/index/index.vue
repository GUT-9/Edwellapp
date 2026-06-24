<template>
  <view class="flex-1 bg-slate-50 min-h-screen pb-20">
    <!-- Header Hero Banner -->
    <view class="bg-gradient-to-r from-teal-700 to-teal-500 text-white px-6 pt-12 pb-8 rounded-b-[36px] shadow-md relative overflow-hidden">
      <!-- Ambient graphics -->
      <view class="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-teal-600/35 blur-2xl"></view>
      <view class="absolute -left-12 bottom-0 w-36 h-36 rounded-full bg-teal-400/20 blur-xl"></view>

      <view class="relative z-10 flex flex-col gap-1.5 mb-6">
        <text class="font-sans text-xl font-bold tracking-tight">学源汇 K12</text>
        <text class="font-sans text-xs opacity-85">汇聚全国优质教育资源，赋能每一堂好课</text>
      </view>

      <!-- Simulated Search Trigger -->
      <view @click="goToLibrary" class="relative z-10 bg-white/15 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 flex flex-row items-center gap-2 cursor-pointer active:scale-98 transition-all">
        <text class="text-white opacity-80">🔍</text>
        <text class="font-sans text-xs text-white/70">搜索教案、课件、同步试卷...</text>
      </view>
    </view>

    <!-- K12 stage grid buttons -->
    <view class="px-4 -mt-4 relative z-20">
      <view class="bg-white rounded-2xl p-5 border border-slate-200/50 shadow-sm grid grid-cols-3 gap-3 text-center">
        <view @click="goToLibraryWithStage('primary')" class="flex flex-col items-center justify-center p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer">
          <text class="text-3xl mb-1.5">🎒</text>
          <text class="font-sans text-xs font-bold text-slate-800">小学段</text>
          <text class="font-sans text-[10px] text-slate-400 mt-0.5">一年级至六年级</text>
        </view>
        <view @click="goToLibraryWithStage('middle')" class="flex flex-col items-center justify-center p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer">
          <text class="text-3xl mb-1.5">🏫</text>
          <text class="font-sans text-xs font-bold text-slate-800">初中段</text>
          <text class="font-sans text-[10px] text-slate-400 mt-0.5">七年级至九年级</text>
        </view>
        <view @click="goToLibraryWithStage('high')" class="flex flex-col items-center justify-center p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer">
          <text class="text-3xl mb-1.5">🎓</text>
          <text class="font-sans text-xs font-bold text-slate-800">高中段</text>
          <text class="font-sans text-[10px] text-slate-400 mt-0.5">高一至高三</text>
        </view>
      </view>
    </view>

    <!-- Quick action links -->
    <view class="px-4 mt-6">
      <view class="flex flex-row justify-between items-center mb-3">
        <text class="font-sans text-sm font-bold text-slate-800">热点专区</text>
        <text @click="goToLibrary" class="font-sans text-xs text-teal-600 font-semibold">查看全部</text>
      </view>

      <view class="grid grid-cols-4 gap-2">
        <view v-for="item in shortcuts" :key="item.name" @click="goToLibrary" class="bg-white rounded-xl p-3 border border-slate-100 flex flex-col items-center justify-center text-center shadow-xs cursor-pointer active:scale-95 transition-all">
          <text class="text-2xl mb-1">{{ item.icon }}</text>
          <text class="font-sans text-[10px] font-bold text-slate-700 mt-1">{{ item.name }}</text>
        </view>
      </view>
    </view>

    <!-- Top downloads list -->
    <view class="px-4 mt-6">
      <view class="flex flex-row justify-between items-center mb-3">
        <text class="font-sans text-sm font-bold text-slate-800">🏅 热门下载榜</text>
        <text @click="goToLibrary" class="font-sans text-xs text-teal-600 font-semibold">按热度排序</text>
      </view>

      <view class="space-y-3">
        <view 
          v-for="(res, idx) in popularResources" 
          :key="res.id"
          @click="navigateToDetail(res.id)"
          class="bg-white rounded-xl p-3 border border-slate-200/50 shadow-xs flex flex-row items-center gap-3 cursor-pointer"
        >
          <view class="w-8 h-8 rounded-full bg-amber-50 text-amber-500 font-sans text-xs font-bold flex items-center justify-center shrink-0 border border-amber-100" v-if="idx < 3">
            {{ idx + 1 }}
          </view>
          <view class="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-sans text-xs font-bold flex items-center justify-center shrink-0" v-else>
            {{ idx + 1 }}
          </view>
          
          <view class="flex-1 flex flex-col gap-0.5">
            <text class="font-sans text-xs font-bold text-slate-800 line-clamp-1">《{{ res.title }}》</text>
            <view class="flex flex-row items-center gap-2">
              <text class="bg-teal-50 text-teal-600 text-[9px] font-bold px-1.5 py-0.2 rounded">{{ res.subject }}</text>
              <text class="text-[10px] font-sans text-slate-400 font-semibold">{{ res.downloads }} 次下载</text>
            </view>
          </view>
          <text class="font-sans text-xs font-bold text-amber-500 shrink-0">{{ res.points }} 积分</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const shortcuts = [
  { name: '教案设计', icon: '📝' },
  { name: '同步练习', icon: '✏️' },
  { name: '期末真题', icon: '💯' },
  { name: '多媒体课件', icon: '💻' }
]

const popularResources = ref([
  { id: '1', title: '高二数学必修一：函数与导数综合复习讲义', subject: '数学', downloads: 1250, points: 10 },
  { id: '5', title: '人教版初二物理下册：牛顿第一定律精讲与实验演示', subject: '物理', downloads: 856, points: 10 },
  { id: '2', title: '初三物理：光学折射与反射核心考点精讲视频', subject: '物理', downloads: 856, points: 5 },
  { id: '3', title: '高一英语必修二单元词汇测试卷及答案详解', subject: '英语', downloads: 2100, points: 0 }
])

const goToLibrary = () => {
  uni.switchTab({
    url: '/pages/library/library'
  })
}

const goToLibraryWithStage = (stage) => {
  // Store the selected stage in global storage for routing integration
  uni.setStorageSync('search_init_stage', stage)
  uni.switchTab({
    url: '/pages/library/library'
  })
}

const navigateToDetail = (id) => {
  uni.navigateTo({
    url: `/pages/detail/detail?id=${id}`
  })
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
</style>
