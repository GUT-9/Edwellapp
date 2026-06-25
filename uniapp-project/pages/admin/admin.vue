<template>
  <view class="flex-1 bg-slate-50 min-h-screen pb-20">
    <!-- Header -->
    <view class="bg-[#00685f] text-white px-6 pt-12 pb-6 rounded-b-[36px] shadow-md relative overflow-hidden shrink-0 mt-8">
      <view class="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-teal-600/35 blur-2xl"></view>
      
      <view class="relative z-10 flex flex-row items-center justify-between">
        <view class="flex flex-col gap-1">
          <text class="font-display text-xl font-bold tracking-tight">管理员后台</text>
          <text class="font-sans text-xs opacity-85">审核共享资源，进行系统级运营维护</text>
        </view>
        <view 
          @click="exitAdmin"
          class="bg-white/20 border border-white/30 rounded-lg px-3 py-1.5 font-sans text-xs text-white font-bold cursor-pointer hover:bg-white/30 transition-colors"
        >
          返回前台
        </view>
      </view>
    </view>

    <!-- Sidebar simulator Tabs (Horizontal Control) -->
    <view class="px-4 sticky top-0 z-20 bg-slate-50/95 backdrop-blur-sm py-3 border-b border-slate-200/50">
      <view class="bg-slate-200/55 rounded-xl p-1 flex flex-row">
        <view 
          v-for="item in tabs" 
          :key="item.id"
          @click="activeTab = item.id"
          :class="['flex-1 text-center py-2.5 font-sans text-xs font-semibold rounded-lg cursor-pointer transition-all duration-200 flex flex-row items-center justify-center gap-1',
            activeTab === item.id 
              ? 'bg-white shadow-sm text-[#00685f] font-bold' 
              : 'text-slate-500 hover:text-slate-700'
          ]"
        >
          <!-- SVG tab icons -->
          <view class="[activeTab === 'dashboard' ? 'text-[#00685f]' : 'text-slate-500']" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHYtaWY9Iml0ZW0uaWQgPT09ICdkYXNoYm9hcmQnIiA6ICB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwNjg1ZiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSI3IiBoZWlnaHQ9IjkiPjwvcmVjdD48cmVjdCB4PSIxNCIgeT0iMyIgd2lkdGg9IjciIGhlaWdodD0iNSI+PC9yZWN0PjxyZWN0IHg9IjE0IiB5PSIxMiIgd2lkdGg9IjciIGhlaWdodD0iOSI+PC9yZWN0PjxyZWN0IHg9IjMiIHk9IjE2IiB3aWR0aD0iNyIgaGVpZ2h0PSI1Ij48L3JlY3Q+PC9zdmc+'); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
          <view class="[activeTab === 'audit' ? 'text-[#00685f]' : 'text-slate-500']" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHYtaWY9Iml0ZW0uaWQgPT09ICdhdWRpdCciIDogIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDA2ODVmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTEyIDIyczgtNCA4LTEwVjVsLTgtMy04IDN2N2MwIDYgOCAxMCA4IDEweiI+PC9wYXRoPjxsaW5lIHgxPSIxMiIgeTE9IjgiIHgyPSIxMiIgeTI9IjEyIj48L2xpbmU+PGxpbmUgeDE9IjEyIiB5MT0iMTYiIHgyPSIxMi4wMSIgeTI9IjE2Ij48L2xpbmU+PC9zdmc+'); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
          <view class="[activeTab === 'users' ? 'text-[#00685f]' : 'text-slate-500']" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHYtaWY9Iml0ZW0uaWQgPT09ICd1c2VycyciIDogIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDA2ODVmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTE3IDIxdi0yYTQgNCAwIDAgMC00LTRINWE0IDQgMCAwIDAtNCA0djIiPjwvcGF0aD48Y2lyY2xlIGN4PSI5IiBjeT0iNyIgcj0iNCI+PC9jaXJjbGU+PHBhdGggZD0iTTIzIDIxdi0yYTQgNCAwIDAgMC0zLTMuODciPjwvcGF0aD48cGF0aCBkPSJNMTYgMy4xM2E0IDQgMCAwIDEgMCA3Ljc1Ij48L3BhdGg+PC9zdmc+'); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
          <view class="[activeTab === 'settings' ? 'text-[#00685f]' : 'text-slate-500']" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHYtaWY9Iml0ZW0uaWQgPT09ICdzZXR0aW5ncyciIDogIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDA2ODVmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMyI+PC9jaXJjbGU+PHBhdGggZD0iTTE5LjQgMTVhMS42NSAxLjY1IDAgMCAwIC4zMyAxLjgybC4wNi4wNmEyIDIgMCAxIDEtMi44MyAyLjgzbC0uMDYtLjA2YTEuNjUgMS42NSAwIDAgMC0xLjgyLS4zMyAxLjY1IDEuNjUgMCAwIDAtMSAxLjUxVjIxYTIgMiAwIDAgMS00IDB2LS4wOUExLjY1IDEuNjUgMCAwIDAgOSAxOS40YTEuNjUgMS42NSAwIDAgMC0xLjgyLjMzbC0uMDYuMDZhMiAyIDAgMSAxLTIuODMtMi44M2wuMDYtLjA2YTEuNjUgMS42NSAwIDAgMCAuMzMtMS44MiAxLjY1IDEuNjUgMCAwIDAtMS41MS0xSDNhMiAyIDAgMCAxIDAtNGguMDlBMS42NSAxLjY1IDAgMCAwIDQuNiA5YTEuNjUgMS42NSAwIDAgMC0uMzMtMS44MmwtLjA2LS4wNmEyIDIgMCAxIDEgMi44My0yLjgzbC4wNi4wNmExLjY1IDEuNjUgMCAwIDAgMS44Mi4zM0g5YTEuNjUgMS42NSAwIDAgMCAxLTEuNTFWM2EyIDIgMCAwIDEgNCAwdi4wOWExLjY1IDEuNjUgMCAwIDAgMSAxLjUxIDEuNjUgMS42NSAwIDAgMCAxLjgyLS4zM2wuMDYtLjA2YTIgMiAwIDEgMSAyLjgzIDIuODNsLS4wNi4wNmExLjY1IDEuNjUgMCAwIDAtLjMzIDEuODJWOWExLjY1IDEuNjUgMCAwIDAgMS41MSAxSDIxYTIgMiAwIDAgMSAwIDRoLS4wOWExLjY1IDEuNjUgMCAwIDAtMS41MSAxeiI+PC9wYXRoPjwvc3ZnPg=='); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
          <text>{{ item.label }}</text>
          <text v-if="item.id === 'audit' && pendingResources.length > 0" class="bg-rose-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold ml-1">
            {{ pendingResources.length }}
          </text>
        </view>
      </view>
    </view>

    <!-- Dashboard Tab -->
    <view v-if="activeTab === 'dashboard'" class="px-4 space-y-4">
      <!-- Counters Bento Grid -->
      <view class="grid grid-cols-3 gap-2 text-center mt-2">
        <view class="bg-white rounded-xl p-3 border border-slate-200/50 shadow-xs flex flex-col items-center">
          <text class="font-display text-base font-bold text-slate-800">12,450</text>
          <text class="font-sans text-[9px] text-slate-400 font-semibold mt-0.5">总注册用户</text>
        </view>

        <view class="bg-white rounded-xl p-3 border border-slate-200/50 shadow-xs flex flex-col items-center">
          <text class="font-display text-base font-bold text-slate-800">{{ approvedResourcesCount + 45800 }}</text>
          <text class="font-sans text-[9px] text-slate-400 font-semibold mt-0.5">平台资源总数</text>
        </view>

        <view class="bg-rose-50 rounded-xl p-3 border border-rose-200 shadow-xs flex flex-col items-center">
          <text class="font-display text-base font-bold text-rose-600">{{ pendingResources.length }}</text>
          <text class="font-sans text-[9px] text-rose-500 font-semibold mt-0.5">待审核资源</text>
        </view>
      </view>

      <!-- Trends Simple Chart Mock -->
      <view class="bg-white rounded-2xl p-5 border border-slate-200/50 shadow-sm mt-3">
        <text class="block font-sans text-xs font-bold text-slate-700 mb-4">📈 上传增长走势图</text>
        
        <!-- Render simple mock SVG growth graph -->
        <view class="w-full h-32 flex items-center justify-center bg-slate-50/50 rounded-xl relative overflow-hidden">
          <!-- Ambient Grid lines -->
          <view class="absolute inset-x-0 top-1/4 h-[1px] bg-slate-200/50"></view>
          <view class="absolute inset-x-0 top-2/4 h-[1px] bg-slate-200/50"></view>
          <view class="absolute inset-x-0 top-3/4 h-[1px] bg-slate-200/50"></view>

          <!-- Line spline SVG representation -->
          <view class="w-full h-28 absolute inset-0 mt-2" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMDAgMTIwIiA+CiAgICAgICAgICAgIDxkZWZzPgogICAgICAgICAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iY2hhcnRHcmFkIiB4MT0iMCIgeTE9IjAiIHgyPSIwIiB5Mj0iMSI+CiAgICAgICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMDA2ODVmIiBzdG9wLW9wYWNpdHk9IjAuMiIvPgogICAgICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMDA2ODVmIiBzdG9wLW9wYWNpdHk9IjAuMCIvPgogICAgICAgICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICAgICAgICAgIDwvZGVmcz4KICAgICAgICAgICAgPHBhdGggZD0iTTAsOTAgQzUwLDEwMCAxMDAsNjAgMTUwLDcwIEMyMDAsODAgMjUwLDMwIDMwMCwxNSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDA2ODVmIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiAvPgogICAgICAgICAgICA8cGF0aCBkPSJNMCw5MCBDNTAsMTAwIDEwMCw2MCAxNTAsNzAgQzIwMCw4MCAyNTAsMzAgMzAwLDE1IEwzMDAsMTIwIEwwLDEyMCBaIiBmaWxsPSJ1cmwoI2NoYXJ0R3JhZCkiIC8+CiAgICAgICAgICAgIAogICAgICAgICAgICA8Y2lyY2xlIGN4PSIxNTAiIGN5PSI3MCIgcj0iMy41IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiMwMDY4NWYiIHN0cm9rZS13aWR0aD0iMS41IiAvPgogICAgICAgICAgICA8Y2lyY2xlIGN4PSIzMDAiIGN5PSIxNSIgcj0iMy41IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiMwMDY4NWYiIHN0cm9rZS13aWR0aD0iMS41IiAvPgogICAgICAgICAgPC9zdmc+'); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>

          <!-- Label mock -->
          <view class="absolute bottom-2 inset-x-4 flex flex-row justify-between text-[9px] font-bold text-slate-400 font-sans">
            <text>周一</text><text>周三</text><text>周五</text><text>今日</text>
          </view>
        </view>
      </view>
    </view>

    <!-- Audit Tab -->
    <view v-if="activeTab === 'audit'" class="px-4 space-y-3">
      <view v-if="pendingResources.length > 0" class="space-y-3">
        <view 
          v-for="res in pendingResources" 
          :key="res.id"
          class="bg-white rounded-2xl border border-slate-200/50 p-4 shadow-sm flex flex-col gap-3"
        >
          <!-- Resource title & format -->
          <view class="flex flex-row items-start justify-between gap-3">
            <text class="font-sans text-xs font-bold text-slate-800 leading-relaxed">{{ res.title }}</text>
            <text class="bg-slate-900/80 backdrop-blur-sm text-white text-[9px] font-display font-bold px-1.5 py-0.5 rounded tracking-wider uppercase shrink-0">{{ res.fileType }}</text>
          </view>

          <!-- Tags row -->
          <view class="flex flex-row flex-wrap gap-1.5 text-[10px] text-slate-400 font-sans items-center">
            <text :class="['px-1.5 py-0.2 rounded font-bold border', getSubjectClass(res.subject)]">{{ res.subject }}</text>
            <text class="bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded">{{ res.grade }}</text>
            <text class="text-slate-500 font-semibold">上传人: {{ res.authorName }}</text>
            <text class="text-slate-500">点数: {{ res.points }} 积分</text>
          </view>

          <!-- Description -->
          <text class="font-sans text-[11px] text-slate-500 leading-normal">{{ res.description }}</text>

          <view class="h-[1px] w-full bg-slate-100 mt-1"></view>

          <!-- Actions -->
          <view class="flex flex-row gap-3">
            <button 
              @click="openRejectDialog(res.id)"
              class="flex-1 py-1.5 rounded-xl border border-rose-200 text-rose-600 font-sans text-xs font-semibold cursor-pointer text-center bg-white border-solid"
            >
              驳回下架
            </button>
            <button 
              @click="approveResource(res.id)"
              class="flex-1 py-1.5 rounded-xl bg-[#00685f] text-white font-sans text-xs font-semibold shadow-sm cursor-pointer text-center border-none"
            >
              同意并发布
            </button>
          </view>
        </view>
      </view>

      <view v-else class="flex flex-col items-center justify-center py-20 text-center">
        <text class="text-3.5xl mb-2">🎉</text>
        <text class="font-display text-sm font-bold text-slate-700">暂无待审核资源</text>
        <text class="font-sans text-[10px] text-slate-400 mt-1">当前所有上传资源均已审核完成！</text>
      </view>
    </view>

    <!-- Dev placeholders -->
    <view v-if="activeTab === 'users' || activeTab === 'settings'" class="px-6 py-20 text-center">
      <view class="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-slate-100 mb-3 text-slate-400 shadow-sm mx-auto">
        <view class="text-slate-300 animate-spin-slow" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICAgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMiPjwvY2lyY2xlPjxwYXRoIGQ9Ik0xOS40IDE1YTEuNjUgMS42NSAwIDAgMCAuMzMgMS44MmwuMDYuMDZhMiAyIDAgMSAxLTIuODMgMi44M2wtLjA2LS4wNmExLjY1IDEuNjUgMCAwIDAtMS44Mi0uMzMgMS42NSAxLjY1IDAgMCAwLTEgMS41MVYyMWEyIDIgMCAwIDEtNCAwdi0uMDlBMS42NSAxLjY1IDAgMCAwIDkgMTkuNGExLjY1IDEuNjUgMCAwIDAtMS44Mi4zM2wtLjA2LjA2YTIgMiAwIDEgMS0yLjgzLTIuODNsLjA2LS4wNmExLjY1IDEuNjUgMCAwIDAgLjMzLTEuODIgMS42NSAxLjY1IDAgMCAwLTEuNTEtMUgzYTIgMiAwIDAgMSAwLTRoLjA5QTEuNjUgMS42NSAwIDAgMCA0LjYgOWExLjY1IDEuNjUgMCAwIDAtLjMzLTEuODJsLS4wNi0uMDZhMiAyIDAgMSAxIDIuODMtMi44M2wuMDYuMDZhMS42NSAxLjY1IDAgMCAwIDEuODIuMzNIOWExLjY1IDEuNjUgMCAwIDAgMS0xLjUxVjNhMiAyIDAgMCAxIDQgMHYuMDlhMS42NSAxLjY1IDAgMCAwIDEgMS41MSAxLjY1IDEuNjUgMCAwIDAgMS44Mi0uMzNsLjA2LS4wNmEyIDIgMCAxIDEgMi44MyAyLjgzbC0uMDYuMDZhMS42NSAxLjY1IDAgMCAwLS4zMyAxLjgyVjlhMS42NSAxLjY1IDAgMCAwIDEuNTEgMUgyMWEyIDIgMCAwIDEgMCA0aC0uMDlhMS42NSAxLjY1IDAgMCAwLTEuNTEgMXoiPjwvcGF0aD48L3N2Zz4='); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
      </view>
      <text class="font-display text-sm font-bold text-slate-700">模块开发中</text>
      <text class="block font-sans text-[10px] text-slate-400 mt-1">高级管理配置系统模块已预设前端模板结构，敬请期待后续同步。</text>
    </view>

    <!-- Reject Reason Input Dialog -->
    <view v-if="isRejectOpen" class="fixed inset-0 z-[100] flex items-center justify-center">
      <!-- Backdrop -->
      <view @click="isRejectOpen = false" class="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"></view>

      <!-- Dialog Body -->
      <view class="relative bg-white w-80 rounded-2xl shadow-xl p-5 border border-slate-100 mx-4 z-[101] flex flex-col gap-3">
        <text class="font-display text-sm font-bold text-slate-800">请输入驳回的具体原因</text>
        <textarea 
          rows="3"
          v-model="rejectReason"
          placeholder="说明为什么拒绝通过：如缺少解答、文件损坏、含有无关水印广告等..."
          class="w-full px-3 py-2 rounded-xl border border-slate-200 font-sans text-xs text-slate-800 bg-slate-50/20 h-20 outline-none transition-all duration-200 focus:border-[#00685f] focus:bg-white focus:ring-[3px] focus:ring-[#00685f]/10"
        />
        <view class="flex flex-row gap-2 mt-2">
          <button 
            @click="isRejectOpen = false"
            class="flex-1 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-sans text-[11px] font-semibold bg-white border-solid"
          >
            取消
          </button>
          <button 
            @click="rejectResource"
            :disabled="!rejectReason.trim()"
            class="flex-1 py-1.5 rounded-lg bg-rose-600 text-white font-sans text-[11px] font-semibold shadow-sm border-none disabled:bg-slate-100 disabled:text-slate-400"
          >
            确认驳回
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { request } from '../../utils/request'

const tabs = [
  { id: 'dashboard', label: '仪表盘' },
  { id: 'audit', label: '审核中心' },
  { id: 'users', label: '用户管理' },
  { id: 'settings', label: '系统设置' }
]

const activeTab = ref('dashboard')
const pendingResources = ref([])
const approvedResourcesCount = ref(0)

const isRejectOpen = ref(false)
const rejectResourceId = ref('')
const rejectReason = ref('')

onShow(() => {
  verifyAdminAccess()
})

const verifyAdminAccess = async () => {
  const token = uni.getStorageSync('token')
  if (!token) {
    uni.navigateTo({ url: '/pages/login/login' })
    return
  }

  try {
    const res = await request({
      url: '/user/profile',
      method: 'GET'
    })
    
    if (res.data.role !== 'admin') {
      uni.showToast({ title: '无管理员权限', icon: 'none' })
      setTimeout(() => {
        uni.switchTab({ url: '/pages/index/index' })
      }, 1000)
      return
    }

    // Load data
    fetchPendingResources()
    fetchApprovedCount()
  } catch (err) {
    uni.navigateTo({ url: '/pages/login/login' })
  }
}

const fetchPendingResources = async () => {
  try {
    const res = await request({
      url: '/admin/resources',
      method: 'GET',
      data: { status: 'pending' }
    })
    pendingResources.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const fetchApprovedCount = async () => {
  try {
    const res = await request({
      url: '/admin/resources',
      method: 'GET',
      data: { status: 'approved' }
    })
    approvedResourcesCount.value = res.data.length
  } catch (err) {
    console.error(err)
  }
}

const approveResource = async (id) => {
  try {
    uni.showLoading({ title: '处理中...' })
    await request({
      url: `/admin/resources/${id}/approve`,
      method: 'POST'
    })
    uni.hideLoading()
    uni.showToast({ title: '已同意发布', icon: 'success' })
    
    // Refresh list
    fetchPendingResources()
    fetchApprovedCount()
  } catch (err) {
    uni.hideLoading()
    uni.showToast({ title: err?.msg || '操作失败', icon: 'none' })
  }
}

const openRejectDialog = (id) => {
  rejectResourceId.value = id
  rejectReason.value = ''
  isRejectOpen.value = true
}

const rejectResource = async () => {
  if (!rejectResourceId.value || !rejectReason.value.trim()) return
  
  try {
    uni.showLoading({ title: '处理中...' })
    await request({
      url: `/admin/resources/${rejectResourceId.value}/reject`,
      method: 'POST',
      data: {
        reason: rejectReason.value
      }
    })
    uni.hideLoading()
    isRejectOpen.value = false
    uni.showToast({ title: '已成功驳回', icon: 'success' })
    
    // Refresh list
    fetchPendingResources()
  } catch (err) {
    uni.hideLoading()
    uni.showToast({ title: err?.msg || '操作失败', icon: 'none' })
  }
}

const exitAdmin = () => {
  uni.switchTab({
    url: '/pages/profile/profile'
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
</script>

<style scoped>
.font-display {
  font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin-slow {
  animation: spin-slow 8s infinite linear;
}
</style>
