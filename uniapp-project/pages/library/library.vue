<template>
  <view class="flex-1 flex flex-col bg-slate-50 min-h-screen pb-20">
    <!-- Search and Filter Bar -->
    <view class="bg-white border-b border-slate-100 px-4 py-3 flex flex-row items-center justify-between gap-3 sticky top-0 z-20">
      <view class="flex-1 flex flex-row items-center bg-slate-100 rounded-lg px-3 py-2 border border-slate-200/50">
        <text class="text-slate-400 mr-2 text-base">🔍</text>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜索资源、教案、试卷..." 
          class="flex-1 bg-transparent font-sans text-xs text-slate-700 outline-none"
        />
        <text v-if="searchQuery" @click="searchQuery = ''" class="text-slate-400 font-sans text-xs font-bold px-1">✕</text>
      </view>

      <view 
        @click="isFilterOpen = true"
        :class="['flex flex-row items-center justify-center gap-1 font-sans text-xs font-semibold px-4 py-2.5 rounded-lg border shadow-sm transition-all', 
          isAnyFilterActive ? 'bg-teal-50 text-teal-600 border-teal-200' : 'bg-white text-slate-700 border-slate-200'
        ]"
      >
        <text class="mr-0.5">⚙️</text>
        <text>筛选</text>
        <view v-if="isAnyFilterActive" class="w-2 h-2 rounded-full bg-teal-600 ml-1"></view>
      </view>
    </view>

    <!-- Category Tabs (Horizontal Scroll) -->
    <scroll-view scroll-x class="whitespace-nowrap px-4 py-3 bg-white border-b border-slate-100/50" show-scrollbar="false">
      <view 
        v-for="cat in categories" 
        :key="cat"
        @click="activeCategory = cat"
        :class="['inline-block shrink-0 font-sans text-xs font-semibold px-4 py-1.5 rounded-full mr-2 border transition-all',
          activeCategory === cat ? 'bg-teal-600 text-white border-teal-600 shadow-sm' : 'bg-slate-100 text-slate-600 border-slate-200/50'
        ]"
      >
        {{ cat }}
      </view>
    </scroll-view>

    <!-- Header info -->
    <view class="px-4 py-3 flex flex-row justify-between items-center bg-white/40">
      <view class="flex flex-row items-center gap-1">
        <text class="font-sans text-sm font-bold text-slate-800">
          {{ activeCategory === '全部' ? '最新资源' : activeCategory }}
        </text>
        <text class="text-xs text-slate-400 ml-1">({{ filteredResources.length }} 个)</text>
      </view>

      <view 
        @click="sortBy = sortBy === 'time' ? 'downloads' : 'time'"
        class="flex flex-row items-center text-slate-500 font-sans text-xs font-medium"
      >
        <text>{{ sortBy === 'time' ? '最新发布' : '下载量高' }}</text>
        <text class="ml-0.5">⇅</text>
      </view>
    </view>

    <!-- Active Tags Row -->
    <view v-if="isAnyFilterActive" class="px-4 pb-2 flex flex-row flex-wrap gap-1.5 items-center">
      <text class="text-[10px] font-semibold text-slate-400 mr-1">已筛:</text>
      <text v-if="appliedStage !== 'all'" class="bg-teal-50 text-teal-600 text-[10px] font-semibold px-2 py-0.5 rounded-full mr-1">
        {{ STAGES.find(s => s.id === appliedStage)?.name }}
      </text>
      <text v-if="appliedGrade !== 'all'" class="bg-teal-50 text-teal-600 text-[10px] font-semibold px-2 py-0.5 rounded-full mr-1">
        {{ appliedGrade }}
      </text>
      <text v-if="appliedSubject !== 'all'" class="bg-teal-50 text-teal-600 text-[10px] font-semibold px-2 py-0.5 rounded-full mr-1">
        {{ appliedSubject }}
      </text>
      <text @click="handleClearAllFilters" class="text-teal-600 text-[11px] font-semibold underline ml-1">重置</text>
    </view>

    <!-- Main Resource Grid -->
    <view v-if="filteredResources.length > 0" class="grid grid-cols-2 gap-3 px-4 py-2">
      <view 
        v-for="res in filteredResources" 
        :key="res.id"
        @click="navigateToDetail(res.id)"
        class="bg-white rounded-2xl border border-slate-200/50 overflow-hidden shadow-sm flex flex-col"
      >
        <view class="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
          <image :src="res.coverUrl" mode="aspectFill" class="w-full h-full" />
          <view class="absolute bottom-2 left-2 z-10">
            <text class="bg-slate-900/60 backdrop-blur-md text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
              {{ res.fileType }}
            </text>
          </view>
        </view>
        <view class="p-3 flex-1 flex flex-col gap-1.5">
          <text class="font-sans text-xs font-bold text-slate-800 line-clamp-2 leading-relaxed h-8">
            {{ res.title }}
          </text>
          <view class="flex flex-row justify-between items-center mt-1">
            <text class="text-[10px] font-sans text-slate-400 font-semibold">
              {{ res.grade }} • {{ res.subject }}
            </text>
            <text class="font-sans text-[11px] font-bold text-amber-500">
              {{ res.points }} 积分
            </text>
          </view>
        </view>
      </view>
    </view>

    <!-- Empty State -->
    <view v-else class="flex flex-col items-center justify-center py-20 px-6 text-center">
      <text class="text-4xl text-slate-300 mb-2">📂</text>
      <text class="font-sans text-sm font-bold text-slate-700 mb-1">暂无相关资源</text>
      <text class="font-sans text-xs text-slate-400 max-w-xs leading-relaxed">
        尝试调整筛选条件或重新搜索，探索更多K12精选备课资料。
      </text>
      <button 
        @click="handleClearAllFilters"
        class="mt-6 font-sans text-xs font-semibold text-white bg-teal-600 px-6 py-2.5 rounded-lg active:scale-95 border-none"
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
          <text class="font-sans text-sm font-bold text-slate-800">资源筛选</text>
          <text @click="isFilterOpen = false" class="text-slate-400 font-sans text-sm font-bold px-2">✕</text>
        </view>

        <!-- Scrollable Options Content -->
        <scroll-view scroll-y class="flex-1 p-6 space-y-6 overflow-y-auto">
          <!-- Stage Section -->
          <view class="space-y-3 mb-6">
            <text class="block font-sans text-xs font-bold text-slate-500 mb-2">🎓 学段选择</text>
            <view class="grid grid-cols-3 gap-2">
              <view 
                @click="tempStage = 'all'"
                :class="['py-2 rounded-full font-sans text-xs font-medium border text-center transition-all cursor-pointer',
                  tempStage === 'all' ? 'bg-teal-50 text-teal-600 border-teal-300 font-bold' : 'text-slate-600 border-slate-200'
                ]"
              >
                全部
              </view>
              <view 
                v-for="stage in STAGES" 
                :key="stage.id"
                @click="tempStage = stage.id"
                :class="['py-2 rounded-full font-sans text-xs font-medium border text-center transition-all cursor-pointer',
                  tempStage === stage.id ? 'bg-teal-50 text-teal-600 border-teal-300 font-bold' : 'text-slate-600 border-slate-200'
                ]"
              >
                {{ stage.name }}
              </view>
            </view>
          </view>

          <!-- Grade Section (Cascading) -->
          <view class="space-y-3 mb-6">
            <text class="block font-sans text-xs font-bold text-slate-500 mb-2">📖 年级选择</text>
            <view class="grid grid-cols-3 gap-2">
              <view 
                @click="tempGrade = 'all'"
                :class="['py-2 rounded-lg font-sans text-xs font-medium border text-center transition-all cursor-pointer',
                  tempGrade === 'all' ? 'bg-teal-50 text-teal-600 border-teal-300 font-bold' : 'text-slate-600 border-slate-200'
                ]"
              >
                全部
              </view>
              <view 
                v-for="grade in availableGrades" 
                :key="grade"
                @click="tempGrade = grade"
                :class="['py-2 rounded-lg font-sans text-xs font-medium border text-center transition-all cursor-pointer',
                  tempGrade === grade ? 'bg-teal-50 text-teal-600 border-teal-300 font-bold' : 'text-slate-600 border-slate-200'
                ]"
              >
                {{ grade }}
              </view>
            </view>
          </view>

          <!-- Subject Section (Cascading) -->
          <view class="space-y-3 mb-6">
            <text class="block font-sans text-xs font-bold text-slate-500 mb-2">📚 学科分类</text>
            <view class="grid grid-cols-3 gap-2">
              <view 
                @click="tempSubject = 'all'"
                :class="['py-2 rounded-lg font-sans text-xs font-medium border text-center transition-all cursor-pointer',
                  tempSubject === 'all' ? 'bg-teal-50 text-teal-600 border-teal-300 font-bold' : 'text-slate-600 border-slate-200'
                ]"
              >
                全部
              </view>
              <view 
                v-for="subject in availableSubjects" 
                :key="subject"
                @click="tempSubject = subject"
                :class="['py-2 rounded-lg font-sans text-xs font-medium border text-center transition-all cursor-pointer',
                  tempSubject === subject ? 'bg-teal-50 text-teal-600 border-teal-300 font-bold' : 'text-slate-600 border-slate-200'
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
            class="flex-1 flex flex-row items-center justify-center gap-1 text-slate-600 font-sans text-xs font-semibold py-3 rounded-xl border border-slate-200 bg-white cursor-pointer"
          >
            <text>↺ 重置</text>
          </view>
          <view 
            @click="handleApplyFilters"
            class="flex-[2] bg-teal-600 text-white font-sans text-xs font-semibold py-3 rounded-xl shadow-md text-center cursor-pointer"
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

// K12 Configuration Data
const STAGES = [
  { id: 'primary', name: '小学' },
  { id: 'middle', name: '初中' },
  { id: 'high', name: '高中' }
]

const STAGE_GRADES = {
  primary: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
  middle: ['七年级', '八年级', '九年级'],
  high: ['高一', '高二', '高三']
}

const STAGE_SUBJECTS = {
  primary: ['语文', '数学', '英语', '道德与法治', '科学', '音乐', '美术', '体育'],
  middle: ['语文', '数学', '英语', '道德与法治', '历史', '地理', '物理', '化学', '生物'],
  high: ['语文', '数学', '英语', '思想政治', '历史', '地理', '物理', '化学', '生物', '信息技术']
}

// State
const searchQuery = ref('')
const activeCategory = ref('全部')
const sortBy = ref('time')
const isFilterOpen = ref(false)

const tempStage = ref('all')
const tempGrade = ref('all')
const tempSubject = ref('all')

const appliedStage = ref('all')
const appliedGrade = ref('all')
const appliedSubject = ref('all')

const categories = ['全部', '教案设计', '同步练习', '期末真题', '课件PPT']

// Mock Resources matching the sharing platform
const resources = ref([
  { id: '5', title: '人教版初二物理下册：牛顿第一定律精讲与实验演示', stage: 'middle', grade: '八年级', subject: '物理', fileType: 'MP4', downloads: 856, points: 10, coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFwOCedqHslA64b14zmZqhE3c53Pgtb86yFXkwFalWvDk3psrJwDZnwZdSEpi82ZQuhdnT6qCfjBdIiw1ZmfIyLhuzl4e4ki66dgnVB5Zn8k4fGbaUsqYwBdjGQV32JCUh01FVQDRjYskbuuHC0-U-Dusg3_6dfruKrxNhcI6pSJCLF3BsSoXV4gY9XXuPUwQmYHhMvPXhxbhw_B_KSWO0DOL0LRrk9hxj5ka9tFmzKrpiMmEr26ArX9mU7vVT2A0A50DMfkaM5N8', status: 'approved', createdAt: '2026-06-10' },
  { id: '1', title: '高二数学必修一：函数与导数综合复习讲义', stage: 'high', grade: '高二', subject: '数学', fileType: 'PDF', downloads: 1250, points: 10, coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnCVnZJFfEd7kHFNFAKDRq7NqizLHP4KgWUfGh3hhhkx-D3025gFcxNLzrSw5axM8Q1XtF3PBHeJVUdwE3XzklMmhLRq1aKxzoA-oqTcUcVnxKy9IW232d1UodH4X_eEfVkCl13pKxbX_YmnI_87xl_g4TLUOS3OOFs6nNoHDDD1v2o7vO7OrmevoJrSHzRlvTPO61pDMlXQtCZc_YhoA87sXDpU3QEDmm5kRFoC6xoARYvWweFUC7oZYGxJoY1oOQcpp4G2vbbxs', status: 'approved', createdAt: '2026-06-22' },
  { id: '2', title: '初三物理：光学折射与反射核心考点精讲视频', stage: 'middle', grade: '九年级', subject: '物理', fileType: 'MP4', downloads: 856, points: 5, coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCFacj-jlLiGGC9_AtxHAuR9CHASm6YtZnryASj9wcf42xBmh9OjFnizNKAjafu8XgCGVmerH_jLBew2fpBXuH_vWUclW6Rykvx5wz-JZR25tPMW5zRz31U76yDMj4f2NE8GWks97Sx7RtG-I7hMJnZYKhhN-TlwUvH2tkfNHb_Jr3oi3e6_Ht2XnydNZjb1U5qJGlH_FFkmScExk4AP7s5D_FyLg7oFq1s0AV79u4WQTuNhRk5ODwvp1O9FMaFQcOwTLXY6vCj8c', status: 'approved', createdAt: '2026-06-21' },
  { id: '3', title: '高一英语必修二单元词汇测试卷及答案详解', stage: 'high', grade: '高一', subject: '英语', fileType: 'DOCX', downloads: 2100, points: 0, coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBv5GLpxrA2pBCvxofL03mMT1jaErwDDK3_UbG8Ok96gl3oeyDi5VKTydm4aEd6EX_SVr_M6WX-0_6mMCSnFwxoLlIWp3yfLxv10w1OBf6sdN9rgRaHK2coptlU-sGb7XJ_JKssFARF8kmJ3cnWVZU11Np_OU3Ob8TZ9SGNYc-hvXVo1rCXoborSAVGGSbXs9gJKvrVEJtVOGhPb3s3j2UIzXKZ6wG4HcICgT70Cvzp4UMfqA5m5nhltMY7nvz_MdlNXj6KAQAVQtQ', status: 'approved', createdAt: '2026-06-18' },
  { id: '4', title: '初二语文：文言文阅读理解答题技巧课件', stage: 'middle', grade: '八年级', subject: '语文', fileType: 'PPT', downloads: 432, points: 10, coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcRA1W8Myvm56kfeWAYmaIYyzN15wgJ8H5QM38Rcii0N_04orXxF3s0ETw93v74cnIvIjanxIoO3_U9CxNZpyRORG7lBhoAmEg_WaGwa8U65bEBGYaaie0TPcPkI5g7QIGBGoPLmM8VVVnsfHNMYLTbCHLjG53mOvdDMmaYskB11rX9OMHHnMUs32glk2HuAHj1hB5zNHEL2zDY5z_WpWMQKlV_1vT7NAfshpZwqkisdVcD4mSoVac9KIUUEFZuAm6LYS-5eB03lY', status: 'approved', createdAt: '2026-06-15' }
])

// Helper functions for dynamic linking/cascading
const getGradeStage = (grade) => {
  if (STAGE_GRADES.primary.includes(grade)) return 'primary'
  if (STAGE_GRADES.middle.includes(grade)) return 'middle'
  if (STAGE_GRADES.high.includes(grade)) return 'high'
  return undefined
}

const getSubjectStages = (subj) => {
  const list = []
  if (STAGE_SUBJECTS.primary.includes(subj)) list.push('primary')
  if (STAGE_SUBJECTS.middle.includes(subj)) list.push('middle')
  if (STAGE_SUBJECTS.high.includes(subj)) list.push('high')
  return list
}

// Watching state for smart cascading
watch(tempStage, (newStage) => {
  if (newStage !== 'all') {
    const grades = STAGE_GRADES[newStage]
    if (!grades.includes(tempGrade.value) && tempGrade.value !== 'all') {
      tempGrade.value = 'all'
    }
    const subjects = STAGE_SUBJECTS[newStage]
    if (!subjects.includes(tempSubject.value) && tempSubject.value !== 'all') {
      tempSubject.value = 'all'
    }
  }
})

watch(tempGrade, (newGrade) => {
  if (newGrade !== 'all' && tempSubject.value !== 'all') {
    const gradeStage = getGradeStage(newGrade)
    if (gradeStage) {
      const allowedSubjs = STAGE_SUBJECTS[gradeStage]
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

// Dynamic computations based on current stage, grade & subject selections
const availableGrades = computed(() => {
  let baseGrades = []
  if (tempStage.value === 'all') {
    baseGrades = [...STAGE_GRADES.primary, ...STAGE_GRADES.middle, ...STAGE_GRADES.high]
  } else {
    baseGrades = [...STAGE_GRADES[tempStage.value]]
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
    baseSubjects = Array.from(new Set([
      ...STAGE_SUBJECTS.primary,
      ...STAGE_SUBJECTS.middle,
      ...STAGE_SUBJECTS.high
    ]))
  } else {
    baseSubjects = [...STAGE_SUBJECTS[tempStage.value]]
  }

  if (tempGrade.value !== 'all') {
    const gradeStage = getGradeStage(tempGrade.value)
    if (gradeStage) {
      const stageSubjs = STAGE_SUBJECTS[gradeStage]
      return baseSubjects.filter(sub => stageSubjs.includes(sub))
    }
  }

  return baseSubjects
})

// Advanced results count computation in the Drawer
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

// Filter application handlers
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

// Dynamic display filtering
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
    result.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  return result
})

// Native Uni-App router redirection
const navigateToDetail = (id) => {
  uni.navigateTo({
    url: `/pages/detail/detail?id=${id}`
  })
}
</script>

<style scoped>
.grid-cols-2 {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
