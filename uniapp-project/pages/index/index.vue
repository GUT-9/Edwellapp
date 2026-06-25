<template>
  <view class="flex-1 min-h-screen bg-slate-50 flex flex-col relative overflow-hidden pb-24">
    <!-- Search Section -->
    <view class="px-4 pt-5 pb-3 bg-white z-10 relative">
      <view class="relative">
        <view class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <image src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiICA+CiAgICAgICAgICAgIDxjaXJjbGUgY3g9IjExIiBjeT0iMTEiIHI9IjgiPjwvY2lyY2xlPgogICAgICAgICAgICA8bGluZSB4MT0iMjEiIHkxPSIyMSIgeDI9IjE2LjY1IiB5Mj0iMTYuNjUiPjwvbGluZT4KICAgICAgICAgIDwvc3ZnPg==" class="w-5 h-5" style="width: 20px; height: 20px; flex-shrink: 0;" mode="aspectFit" />
        </view>
        <input 
          type="text"
          v-model="searchQuery"
          placeholder="搜索课程、教案、试卷..."
          class="block w-full pl-10 pr-20 py-3.5 h-[48px] border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-[#00685f]/20 focus:border-[#00685f] text-sm shadow-sm transition-all outline-none"
          confirm-type="search"
          @confirm="handleSearch"
        />
        <view class="absolute inset-y-0 right-0 pr-1.5 flex items-center">
          <button 
            @click="handleSearch"
            class="text-white font-sans text-xs bg-[#00685f] hover:bg-[#005049] px-4 h-[36px] flex items-center justify-center rounded-lg font-semibold transition-all shadow-sm active:scale-95 border-none m-0"
          >
            搜索
          </button>
        </view>
      </view>
    </view>

    <!-- Quick Access Grid -->
    <view class="px-4 py-3 bg-white relative z-10">
      <view class="grid grid-cols-3 gap-3 mb-6">
        <view 
          @click="goToLibraryWithStage('primary')"
          class="flex flex-col items-center justify-center p-4 bg-emerald-50/40 rounded-xl border border-emerald-100/40 hover:bg-emerald-50 hover:border-emerald-100 transition-all duration-300 active:scale-95 cursor-pointer shadow-sm"
        >
          <view class="w-12 h-12 bg-[#00685f]/10 rounded-full flex items-center justify-center mb-2">
            <image src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAyNCAyNCcgZmlsbD0nbm9uZScgc3Ryb2tlPScjMDA2ODVmJyBzdHJva2Utd2lkdGg9JzInIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcgc3Ryb2tlLWxpbmVqb2luPSdyb3VuZCc+PHBhdGggZD0nTTIxLjQyIDEwLjkyMmExIDEgMCAwIDAtLjAxOS0xLjgzOEwxMi44MyA1LjE4YTIgMiAwIDAgMC0xLjY2IDBMMi42IDkuMDhhMSAxIDAgMCAwIDAgMS44MzJsOC41NyAzLjkwOGEyIDIgMCAwIDAgMS42NiAweicgLz48cGF0aCBkPSdNNiAxMnY1YzAgMiAyIDMgNiAzczYtMSA2LTN2LTUnIC8+PHBhdGggZD0nTTIxLjUgMTJ2NicgLz48L3N2Zz4=" class="w-6 h-6" style="width: 24px; height: 24px;" mode="aspectFit" />
          </view>
          <text class="font-sans text-xs font-semibold text-slate-700">小学</text>
        </view>

        <view 
          @click="goToLibraryWithStage('middle')"
          class="flex flex-col items-center justify-center p-4 bg-indigo-50/40 rounded-xl border border-indigo-100/40 hover:bg-indigo-50 hover:border-indigo-100 transition-all duration-300 active:scale-95 cursor-pointer shadow-sm"
        >
          <view class="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center mb-2">
            <image src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAyNCAyNCcgZmlsbD0nbm9uZScgc3Ryb2tlPScjNjM2NmYxJyBzdHJva2Utd2lkdGg9JzInIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcgc3Ryb2tlLWxpbmVqb2luPSdyb3VuZCc+PHBhdGggZD0nTTEyIDIyczgtNCA4LTEwVjVsLTgtMy04IDN2N2MwIDYgOCAxMCA4IDEweicgLz48L3N2Zz4=" class="w-5 h-5" style="width: 20px; height: 20px;" mode="aspectFit" />
          </view>
          <text class="font-sans text-xs font-semibold text-slate-700">初中</text>
        </view>

        <view 
          @click="goToLibraryWithStage('high')"
          class="flex flex-col items-center justify-center p-4 bg-amber-50/30 rounded-xl border border-amber-100/30 hover:bg-amber-50 hover:border-amber-100 transition-all duration-300 active:scale-95 cursor-pointer shadow-sm"
        >
          <view class="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mb-2">
            <image src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAyNCAyNCcgZmlsbD0nbm9uZScgc3Ryb2tlPScjZDk3NzA2JyBzdHJva2Utd2lkdGg9JzInIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcgc3Ryb2tlLWxpbmVqb2luPSdyb3VuZCc+PHBhdGggZD0nTTIgM2g2YTQgNCAwIDAgMSA0IDR2MTRhMyAzIDAgMCAwLTMtM0gyeicgLz48cGF0aCBkPSdNMjIgM2gtNmE0IDQgMCAwIDAtNCA0djE0YTMgMyAwIDAgMSAzLTNoN3onIC8+PC9zdmc+" class="w-5 h-5" style="width: 20px; height: 20px;" mode="aspectFit" />
          </view>
          <text class="font-sans text-xs font-semibold text-slate-700">高中</text>
        </view>
      </view>

      <!-- Hot Subjects -->
      <view class="flex items-center gap-1 text-slate-800 font-display text-[15px] font-bold mb-3">
        <image src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjZjQzZjVlIiAgPgogICAgICAgICAgPHBhdGggZD0iTTE3LjY1NyAxNi42NTdMMTMuNDE0IDIwLjlhMS45OTggMS45OTggMCAwMS0yLjgyNyAwbC00LjI0NC00LjI0M2E4IDggMCAxMTExLjMxNCAweiIgLz4KICAgICAgICAgIDxwYXRoIGQ9Ik0xNSAxMWEzIDMgMCAxMS02IDAgMyAzIDAgMDE2IDB6IiAvPgogICAgICAgIDwvc3ZnPg==" class="w-5 h-5 text-rose-500" style="width: 20px; height: 20px; flex-shrink: 0;" mode="aspectFit" />
        <text>热门学科</text>
      </view>
      
      <scroll-view scroll-x="true" class="w-full whitespace-nowrap" :show-scrollbar="false">
        <view class="flex items-center gap-2 pb-1 pr-4 inline-flex">
          <view 
            v-for="sub in hotSubjects" 
            :key="sub.name"
            @click="goToLibraryWithSubject(sub.name)"
            class="px-4 py-2 rounded-full font-sans text-xs font-semibold border transition-all duration-200 active:scale-95 cursor-pointer shadow-sm"
            :class="sub.bg"
          >
            {{ sub.name }}
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- Featured Resources -->
    <view class="px-4 py-5 bg-slate-50/50 mt-2 border-t border-slate-100/80 flex-1 relative z-10">
      <view class="flex justify-between items-center mb-4">
        <text class="font-display text-base font-bold text-slate-800">精选资源</text>
        <view 
          @click="goToLibraryAll"
          class="font-sans text-xs font-semibold text-[#00685f] hover:text-[#005049] flex items-center transition-colors cursor-pointer"
        >
          查看全部
          <image src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiICA+CiAgICAgICAgICAgIDxwb2x5bGluZSBwb2ludHM9IjkgMTggMTUgMTIgOSA2Ij48L3BvbHlsaW5lPgogICAgICAgICAgPC9zdmc+" class="w-4 h-4 ml-0.5" style="width: 16px; height: 16px; flex-shrink: 0;" mode="aspectFit" />
        </view>
      </view>

      <view class="grid grid-cols-2 gap-3">
        <view 
          v-for="res in popularResources" 
          :key="res.id"
          @click="navigateToDetail(res.id)"
          class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-100 cursor-pointer flex flex-col"
        >
          <!-- Cover Image Container -->
          <view class="aspect-[4/3] bg-slate-100 relative overflow-hidden group">
            <image 
              :src="res.coverUrl" 
              mode="aspectFill"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            <view class="absolute top-2 right-2 px-2 py-0.5 bg-slate-900/80 backdrop-blur-sm rounded font-sans text-[10px] font-bold text-white tracking-wider">
              {{ res.fileType }}
            </view>

            <view class="absolute bottom-2 left-2 px-2.5 py-0.5 bg-white/95 backdrop-blur-sm rounded-full font-sans text-[10px] font-bold text-[#00685f] shadow-sm flex items-center gap-1">
              {{ res.points === 0 ? '免费' : `${res.points} 积分` }}
            </view>
          </view>

          <!-- Content Info -->
          <view class="p-3 flex flex-col flex-1">
            <text class="font-sans text-sm font-semibold text-slate-800 line-clamp-2 leading-snug mb-2 flex-1">
              {{ res.title }}
            </text>

            <view class="flex items-center gap-1.5 mb-3 flex-wrap">
              <view class="px-2 py-0.5 rounded-full font-sans text-[10px] font-semibold" :class="getSubjectClass(res.subject)">
                {{ res.subject }}
              </view>
              <view class="px-2 py-0.5 rounded-full font-sans text-[10px] font-semibold bg-slate-100 text-slate-600">
                {{ res.grade }}
              </view>
            </view>

            <!-- Bottom Stats -->
            <view class="flex items-center justify-between pt-2 border-t border-slate-50 mt-auto">
              <view class="flex items-center gap-3">
                <view class="flex items-center gap-1 text-amber-500">
                  <image src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJjdXJyZW50Q29sb3IiICA+CiAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPSIxMiAyIDE1LjA5IDguMjYgMjIgOS4yNyAxNyAxNC4xNCAxOC4xOCAyMS4wMiAxMiAxNy43NyA1LjgyIDIxLjAyIDcgMTQuMTQgMiA5LjI3IDguOTEgOC4yNiAxMiAyIj48L3BvbHlnb24+CiAgICAgICAgICAgICAgICAgIDwvc3ZnPg==" class="w-3 h-3" style="width: 12px; height: 12px; flex-shrink: 0;" mode="aspectFit" />
                  <text class="font-sans text-[11px] font-bold">4.8</text>
                </view>
                <view class="flex items-center gap-1 text-slate-400">
                  <image src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgID4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjEgMTV2NGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMnYtNCI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwb2x5bGluZSBwb2ludHM9IjcgMTAgMTIgMTUgMTcgMTAiPjwvcG9seWxpbmU+CiAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9IjEyIiB5MT0iMTUiIHgyPSIxMiIgeTI9IjMiPjwvbGluZT4KICAgICAgICAgICAgICAgICAgPC9zdmc+" class="w-3 h-3" style="width: 12px; height: 12px; flex-shrink: 0;" mode="aspectFit" />
                  <text class="font-sans text-[11px] font-bold">{{ res.downloads }}</text>
                </view>
              </view>

              <view 
                @click.stop="handleFavorite(res.id)"
                class="p-1 -mr-1 rounded-full hover:bg-slate-50 transition-colors"
                :class="isFavorited(res.id) ? 'text-rose-500' : 'text-slate-300'"
              >
                <image src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDI0IDI0IiA6ZmlsbD0iaXNGYXZvcml0ZWQocmVzLmlkKSA/ICdjdXJyZW50Q29sb3InIDogJ25vbmUnIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiICA+CiAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMC44NCA0LjYxYTUuNSA1LjUgMCAwIDAtNy43OCAwTDEyIDUuNjdsLTEuMDYtMS4wNmE1LjUgNS41IDAgMCAwLTcuNzggNy43OGwxLjA2IDEuMDZMMTIgMjEuMjNsNy43OC03Ljc4IDEuMDYtMS4wNmE1LjUgNS41IDAgMCAwIDAtNy43OHoiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDwvc3ZnPg==" class="w-4 h-4" style="width: 16px; height: 16px; flex-shrink: 0;" mode="aspectFit" />
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { request } from '../../utils/request'

const searchQuery = ref('')
const popularResources = ref([])
const favoritedIds = ref([])

const hotSubjects = ref([
  { name: '语文', bg: 'bg-red-50 text-red-600 border-red-200/60' },
  { name: '数学', bg: 'bg-blue-50 text-blue-600 border-blue-200/60' },
  { name: '英语', bg: 'bg-purple-50 text-purple-600 border-purple-200/60' },
  { name: '物理', bg: 'bg-emerald-50 text-emerald-600 border-emerald-200/60' },
  { name: '化学', bg: 'bg-slate-100 text-slate-700 border-slate-300/60' }
])

onShow(() => {
  fetchSubjects()
  fetchPopularResources()
  syncUserFavorites()
})

const fetchSubjects = async () => {
  try {
    const res = await request({ url: '/subjects', method: 'GET' })
    if (res.data) {
      let flatSubjects = []
      if (!Array.isArray(res.data)) {
        Object.values(res.data).forEach(arr => flatSubjects.push(...arr))
      } else {
        flatSubjects = res.data
      }
      const uniqueSubjects = Array.from(new Set(flatSubjects)).slice(0, 6)
      const bgs = [
        'bg-red-50 text-red-600 border-red-200/60',
        'bg-blue-50 text-blue-600 border-blue-200/60',
        'bg-purple-50 text-purple-600 border-purple-200/60',
        'bg-emerald-50 text-emerald-600 border-emerald-200/60',
        'bg-amber-50 text-amber-600 border-amber-200/60',
        'bg-cyan-50 text-cyan-600 border-cyan-200/60'
      ]
      if (uniqueSubjects.length > 0) {
        hotSubjects.value = uniqueSubjects.map((name, index) => ({
          name,
          bg: bgs[index % bgs.length]
        }))
      }
    }
  } catch (err) {}
}

const syncUserFavorites = () => {
  try {
    const userStr = uni.getStorageSync('user')
    if (userStr) {
      const userObj = JSON.parse(userStr)
      favoritedIds.value = userObj.favoritedIds || []
    } else {
      favoritedIds.value = []
    }
  } catch (e) {
    console.error(e)
  }
}

const isFavorited = (id) => {
  return favoritedIds.value.includes(id)
}

const fetchPopularResources = async () => {
  try {
    const res = await request({
      url: '/resources',
      method: 'GET'
    })
    // Sort by downloads desc, take top 4
    popularResources.value = res.data
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, 4)
  } catch (err) {
    console.error(err)
  }
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    uni.setStorageSync('search_init_query', searchQuery.value.trim())
  }
  goToLibraryAll()
}

const goToLibraryAll = () => {
  uni.switchTab({
    url: '/pages/library/library'
  })
}

const goToLibraryWithStage = (stage) => {
  uni.setStorageSync('search_init_stage', stage)
  goToLibraryAll()
}

const goToLibraryWithSubject = (subject) => {
  uni.setStorageSync('search_init_subject', subject)
  goToLibraryAll()
}

const navigateToDetail = (id) => {
  uni.navigateTo({
    url: `/pages/detail/detail?id=${id}`
  })
}

const getSubjectClass = (subject) => {
  switch (subject) {
    case '语文': return 'bg-red-50 text-red-600';
    case '数学': return 'bg-blue-50 text-blue-600';
    case '英语': return 'bg-purple-50 text-purple-600';
    case '物理': return 'bg-emerald-50 text-emerald-600';
    default: return 'bg-slate-50 text-slate-600';
  }
}

const handleFavorite = async (id) => {
  const token = uni.getStorageSync('token')
  if (!token) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    setTimeout(() => {
      uni.navigateTo({ url: '/pages/login/login' })
    }, 1000)
    return
  }

  try {
    const res = await request({
      url: `/resources/${id}/favorite`,
      method: 'POST'
    })
    
    // Toggle locally
    if (favoritedIds.value.includes(id)) {
      favoritedIds.value = favoritedIds.value.filter(item => item !== id)
      uni.showToast({ title: '取消收藏成功', icon: 'none' })
    } else {
      favoritedIds.value.push(id)
      uni.showToast({ title: '收藏成功', icon: 'none' })
    }

    // Sync back to stored user object
    const userStr = uni.getStorageSync('user')
    if (userStr) {
      const userObj = JSON.parse(userStr)
      userObj.favoritedIds = favoritedIds.value
      uni.setStorageSync('user', JSON.stringify(userObj))
    }
  } catch (err) {
    uni.showToast({ title: err?.msg || '操作失败', icon: 'none' })
  }
}
</script>

<style>
button::after {
  border: none;
}
</style>
