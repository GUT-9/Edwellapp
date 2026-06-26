<template>
  <view class="flex-1 bg-slate-50/50 min-h-screen pb-24">
    <!-- Profile Header section -->
    <view class="p-4 mt-4">
      <view class="bg-white rounded-2xl border border-slate-200/50 p-5 flex flex-col gap-4 shadow-sm">
        <!-- User main info -->
        <view class="flex flex-row items-center gap-4">
          <view class="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-100 shrink-0 shadow-inner">
            <image 
              :src="user.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuARBMS77J_hxhMvEqhR7sTZKQMjeBuw40YkG5q9ugL1HBLZLcNh9XHPp-vgDWCFHaKBxluJ5bzT0-w5tFx07YaXQcXskcXcWmIYGooiMejXd-XJjUDnoVBDyC984acbWwHOGsEJPf9q82JunHFY6VqpMiH-B1hbwpQev5jvtlVuG_wAykFoGG2CH-Cr3m-R9kaQsRaRDfysK4WlhH2xrlem8_jsBn_UsEjSFDkf-t4d7T2bMKE1tBRf0M9LjYrTN8UCkSot4LLqo8E'" 
              class="w-full h-full object-cover"
            />
          </view>
          
          <view class="flex flex-col gap-1 flex-1">
            <view class="flex flex-row items-center gap-1.5 flex-wrap">
              <text class="font-display text-base font-bold text-slate-800">{{ user.name || '学源汇用户' }}</text>
              <view class="bg-[#00685f]/10 text-[#00685f] text-[10px] font-bold px-1.5 py-0.5 rounded-full flex flex-row items-center gap-0.5 border border-[#00685f]/20">
                <view class="text-[#00685f]" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICAgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDY4NWYiIHN0cm9rZS13aWR0aD0iMi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxjaXJjbGUgY3g9IjEyIiBjeT0iOCIgcj0iNyI+PC9jaXJjbGU+PHBvbHlsaW5lIHBvaW50cz0iOC4yMSAxMy44OSA3IDIzIDEyIDIwIDE3IDIzIDE1Ljc5IDEzLjg4Ij48L3BvbHlsaW5lPjwvc3ZnPg=='); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
                <text>{{ user.role === 'admin' ? '管理员' : 'VIP 会员' }}</text>
              </view>
            </view>
            <view class="flex flex-row gap-1.5 mt-1">
              <picker @change="onGradePickerChange" :range="grades" class="bg-blue-50 text-blue-600 font-sans text-[10px] px-2 py-0.5 rounded-full font-bold cursor-pointer border border-blue-100">
                <view>{{ user.grade || '设置年级' }} ▾</view>
              </picker>
            </view>
          </view>
        </view>

        <view class="h-[1px] w-full bg-slate-100"></view>

        <!-- Bento metrics counters -->
        <view class="grid grid-cols-3 gap-2 text-center">
          <view class="bg-slate-50/80 hover:bg-slate-50 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-100 transition-colors cursor-pointer">
            <text class="font-display text-base font-bold text-[#00685f] mb-0.5">
              {{ (user.points || 0).toLocaleString() }}
            </text>
            <text class="font-sans text-[10px] text-slate-400 font-semibold">我的积分</text>
          </view>

          <view class="bg-slate-50/80 hover:bg-slate-50 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-100 transition-colors cursor-pointer">
            <text class="font-display text-base font-bold text-slate-800 mb-0.5">
              {{ (user.downloadedIds || []).length }}
            </text>
            <text class="font-sans text-[10px] text-slate-400 font-semibold">已下载</text>
          </view>

          <view class="bg-slate-50/80 hover:bg-slate-50 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-100 transition-colors cursor-pointer">
            <text class="font-display text-base font-bold text-slate-800 mb-0.5">
              {{ (user.uploadedIds || []).length }}
            </text>
            <text class="font-sans text-[10px] text-slate-400 font-semibold">贡献资源</text>
          </view>
        </view>

        <!-- Quick Actions (Moved from bottom) -->
        <view class="flex flex-row gap-2 mt-1">
          <button 
            @click="handleLogout"
            class="flex-1 font-sans text-xs font-semibold text-slate-500 bg-white py-2 border border-slate-200 rounded-lg shadow-sm text-center border-solid m-0"
            hover-class="opacity-80 scale-95"
          >
            退出登录
          </button>
          <button 
            v-if="user.role === 'admin'"
            @click="goToAdmin"
            class="flex-1 font-sans text-xs font-semibold text-[#00685f] bg-[#00685f]/10 py-2 border border-[#00685f]/20 rounded-lg shadow-sm text-center border-solid m-0"
            hover-class="opacity-80 scale-95"
          >
            进入管理员后台
          </button>
        </view>
      </view>
    </view>

    <!-- Segmented Control Tabs (Sticky bar) -->
    <view class="px-4 sticky top-0 z-20 bg-slate-50/95 backdrop-blur-sm py-2 border-b border-slate-100/50">
      <view class="bg-slate-200/55 rounded-xl p-1 flex flex-row">
        <view
          v-for="tab in tabConfig"
          :key="tab.id"
          @click="onTabChange(tab.id)"
          :class="['flex-1 text-center py-2.5 font-sans text-xs font-semibold rounded-lg cursor-pointer transition-all duration-200 flex flex-row items-center justify-center gap-1',
            activeTab === tab.id
              ? 'bg-white shadow-sm text-[#00685f] font-bold'
              : 'text-slate-500 hover:text-slate-700'
          ]"
        >
          <view class="[activeTab === 'favorites' ? 'fill-current text-[#00685f]' : 'text-slate-500']" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHYtaWY9InRhYi5pZCA9PT0gJ2Zhdm9yaXRlcyciIDogIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDA2ODVmIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTkgMTRjMS40OS0xLjQ2IDMtMy4yMSAzLTUuNUE1LjUgNS41IDAgMCAwIDE2LjUgM2MtMS43NiAwLTMgLjUtNC41IDItMS41LTEuNS0yLjc0LTItNC41LTJBNS41IDUuNSAwIDAgMCAyIDguNWMwIDIuMyAxLjUgNC4wNSAzIDUuNWw3IDdaIj48L3BhdGg+PC9zdmc+'); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
          <view class="[activeTab === 'history' ? 'text-[#00685f]' : 'text-slate-500']" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHYtaWY9InRhYi5pZCA9PT0gJ2hpc3RvcnknIiA6ICB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwNjg1ZiIgc3Ryb2tlLXdpZHRoPSIyLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiPjwvY2lyY2xlPjxwb2x5bGluZSBwb2ludHM9IjEyIDYgMTIgMTIgMTYgMTQiPjwvcG9seWxpbmU+PC9zdmc+'); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
          <view class="[activeTab === 'downloads' ? 'text-[#00685f]' : 'text-slate-500']" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHYtaWY9InRhYi5pZCA9PT0gJ2Rvd25sb2FkcyciIDogIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDA2ODVmIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjEgMTV2NGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMnYtNCI+PC9wYXRoPjxwb2x5bGluZSBwb2ludHM9IjcgMTAgMTIgMTUgMTcgMTAiPjwvcG9seWxpbmU+PGxpbmUgeDE9IjEyIiB5MT0iMTUiIHgyPSIxMiIgeTI9IjMiPjwvbGluZT48L3N2Zz4='); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
          <view class="[activeTab === 'uploads' ? 'text-[#00685f]' : 'text-slate-500']" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHYtaWY9InRhYi5pZCA9PT0gJ3VwbG9hZHMnIiA6ICB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwNjg1ZiIgc3Ryb2tlLXdpZHRoPSIyLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTIxIDE1djRhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJ2LTQiPjwvcGF0aD48cG9seWxpbmUgcG9pbnRzPSIxNyA4IDEyIDMgNyA4Ij48L3BvbHlsaW5lPjxsaW5lIHgxPSIxMiIgeTE9IjMiIHgyPSIxMiIgeTI9IjE1Ij48L2xpbmU+PC9zdmc+'); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
          <text>{{ tab.label }}</text>
        </view>
      </view>
    </view>

    <!-- Content Area listing resource grid -->
    <view class="px-4 py-4">
      <view v-if="activeTabResources.length > 0" class="grid grid-cols-2 gap-3">
        <view 
          v-for="res in activeTabResources" 
          :key="res.id"
          @click="goToDetail(res.id)"
          class="relative group bg-white rounded-xl overflow-hidden border border-slate-200/60 flex flex-col cursor-pointer transition-all duration-300 hover:border-[#00685f]/40 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
        >
          <view class="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
            <image :src="res.coverUrl || getFallbackCover(res.subject)" @error="res.coverUrl = getFallbackCover(res.subject)" mode="aspectFill" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
            <text class="font-sans text-xs font-semibold text-slate-800 line-clamp-2 leading-snug transition-colors duration-200 group-hover:text-[#00685f] h-8">
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
                  <view class="fill-current text-amber-500" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICAgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmNTllMGIiIHN0cm9rZS13aWR0aD0iMi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5Z29uIHBvaW50cz0iMTIgMiAxNS4wOSA4LjI2IDIyIDkuMjcgMTcgMTQuMTQgMTguMTggMjEuMDIgMTIgMTcuNzcgNS44MiAyMS4wMiA3IDE0LjE0IDIgOS4yNyA4LjkxIDguMjYgMTIgMiI+PC9wb2x5Z29uPjwvc3ZnPg=='); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
                  <text>{{ (res.rating || 5.0).toFixed(1) }}</text>
                </view>
                <view class="flex flex-row items-center gap-0.5 text-slate-400">
                  <view class="text-slate-400" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICAgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5NGEzYjgiIHN0cm9rZS13aWR0aD0iMi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMSAxNXY0YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0ydi00Ij48L3BhdGg+PHBvbHlsaW5lIHBvaW50cz0iNyAxMCAxMiAxNSAxNyAxMCI+PC9wb2x5bGluZT48bGluZSB4MT0iMTIiIHkxPSIxNSIgeDI9IjEyIiB5Mj0iMyI+PC9saW5lPjwvc3ZnPg=='); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
                  <text>{{ res.downloads >= 1000 ? `${(res.downloads / 1000).toFixed(1)}k` : res.downloads }}</text>
                </view>
              </view>
            </view>
          </view>

          <!-- Status Overlay for Uploads Tab -->
          <view v-if="activeTab === 'uploads'" class="absolute top-2 left-2 z-10 shrink-0">
            <text v-if="res.status === 'pending'" class="bg-amber-100 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-amber-200/50">
              审核中
            </text>
            <text v-if="res.status === 'approved'" class="bg-emerald-100 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-emerald-200/50">
              已通过
            </text>
            <view v-if="res.status === 'rejected'" class="relative flex flex-col items-start gap-1">
              <text @click.stop="showRejectReason(res.rejectReason)" class="bg-rose-100 text-rose-700 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-rose-200/50 flex flex-row items-center gap-0.5">
                已驳回 <view class="" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCI+PC9jaXJjbGU+PHBhdGggZD0iTTkuMDkgOWEzIDMgMCAwIDEgNS44MyAxYzAgMi0zIDMtMyAzIj48L3BhdGg+PGxpbmUgeDE9IjEyIiB5MT0iMTciIHgyPSIxMi4wMSIgeTI9IjE3Ij48L2xpbmU+PC9zdmc+'); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
              </text>
            </view>
          </view>
        </view>
      </view>

      <!-- Empty Space matching current tab -->
      <view v-else class="flex flex-col items-center justify-center py-16 text-center">
        <view class="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-slate-100 mb-3 text-slate-400 shadow-sm">
          <view class="text-slate-300" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICAgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Im0xMiAzLTEwIDVMMTIgMTNsMTAtNS0xMC01WiI+PC9wYXRoPjxwYXRoIGQ9Im0yIDE3IDEwIDUgMTAtNSI+PC9wYXRoPjxwYXRoIGQ9Im0yIDEyIDEwIDUgMTAtNSI+PC9wYXRoPjwvc3ZnPg=='); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
        </view>
        <text class="font-sans text-xs text-slate-400">暂无相应记录</text>
      </view>

    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow, onReachBottom } from '@dcloudio/uni-app'
import { getFallbackCover } from '../../utils/fallbackCovers'
import { request } from '../../utils/request'

const grades = ref([])

// Tab Configuration
const tabConfig = [
  { id: 'favorites', label: '收藏列表' },
  { id: 'history', label: '浏览历史' },
  { id: 'downloads', label: '下载记录' },
  { id: 'uploads', label: '我的上传' }
]

// State
const user = ref({})
const activeTab = ref('favorites')
const allApprovedResources = ref([])
const myUploadedResources = ref([])
const displayCount = ref(10)

onShow(() => {
  displayCount.value = 10
  fetchUserProfile()
  fetchApprovedResources()
  fetchMyUploads()
  fetchGrades()
})

onReachBottom(() => {
  displayCount.value += 10
})

const fetchGrades = async () => {
  try {
    const res = await request({ url: '/grades', method: 'GET' })
    let flatGrades = []
    if (res.data && !Array.isArray(res.data)) {
      Object.values(res.data).forEach(arr => flatGrades.push(...arr))
      grades.value = Array.from(new Set(flatGrades))
    } else {
      grades.value = res.data || []
    }
  } catch(e) {}
}

const fetchUserProfile = async () => {
  const token = uni.getStorageSync('token')
  if (!token) {
    uni.navigateTo({
      url: '/pages/login/login'
    })
    return
  }

  try {
    const res = await request({
      url: '/user/profile',
      method: 'GET'
    })
    user.value = res.data
    uni.setStorageSync('user', JSON.stringify(res.data))
  } catch (err) {
    if (err?.code === 401) {
      uni.navigateTo({
        url: '/pages/login/login'
      })
    }
  }
}

const fetchApprovedResources = async () => {
  try {
    const res = await request({
      url: '/resources',
      method: 'GET'
    })
    allApprovedResources.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const fetchMyUploads = async () => {
  try {
    const res = await request({
      url: '/resources/my-uploads',
      method: 'GET'
    })
    myUploadedResources.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const onGradePickerChange = async (e) => {
  const selectedGrade = grades.value[e.detail.value]
  try {
    uni.showLoading({ title: '更新中...' })
    const res = await request({
      url: '/user/profile',
      method: 'PUT',
      data: {
        grade: selectedGrade
      }
    })
    uni.hideLoading()
    user.value = res.data
    uni.setStorageSync('user', JSON.stringify(res.data))
    uni.showToast({ title: '修改成功', icon: 'success' })
  } catch (err) {
    uni.hideLoading()
    uni.showToast({ title: err?.msg || '修改失败', icon: 'none' })
  }
}

const showRejectReason = (reason) => {
  uni.showModal({
    title: '驳回原因',
    content: reason || '资源文件不合规或格式错误。',
    showCancel: false,
    confirmText: '确定'
  })
}

const goToDetail = (id) => {
  uni.navigateTo({
    url: `/pages/detail/detail?id=${id}`
  })
}

const goToAdmin = () => {
  uni.navigateTo({
    url: '/pages/admin/admin'
  })
}

const handleLogout = async () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await request({
            url: '/user/logout',
            method: 'POST'
          })
        } catch (e) {}
        
        uni.removeStorageSync('token')
        uni.removeStorageSync('user')
        uni.showToast({ title: '退出登录成功', icon: 'success' })
        
        setTimeout(() => {
          uni.switchTab({
            url: '/pages/index/index'
          })
        }, 1000)
      }
    }
  })
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

// Compute tab contents dynamically
const activeTabResources = computed(() => {
  let list = []
  if (activeTab.value === 'favorites') {
    const ids = user.value.favoritedIds || []
    list = allApprovedResources.value.filter(r => ids.includes(r.id))
  } else if (activeTab.value === 'downloads') {
    const ids = user.value.downloadedIds || []
    list = allApprovedResources.value.filter(r => ids.includes(r.id))
  } else if (activeTab.value === 'uploads') {
    list = myUploadedResources.value
  } else if (activeTab.value === 'history') {
    const historyIds = uni.getStorageSync('browse_history') || []
    // Keep list unique and reverse chronological
    const uniqueIds = Array.from(new Set(historyIds)).reverse()
    list = uniqueIds
      .map(id => allApprovedResources.value.find(r => r.id === id))
      .filter(r => r !== undefined)
  }
  
  return list.slice(0, displayCount.value)
})

const onTabChange = (tabId) => {
  activeTab.value = tabId
  displayCount.value = 10
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
