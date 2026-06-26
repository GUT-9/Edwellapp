<template>
  <view class="flex-1 bg-white flex flex-col relative overflow-hidden min-h-screen z-50">
    <!-- Background Decorative Blur Gradients -->
    <view class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <view class="absolute -top-[10%] -right-[10%] w-72 h-72 rounded-full bg-[#00685f]/10 blur-3xl"></view>
      <view class="absolute top-[30%] -left-[10%] w-64 h-64 rounded-full bg-[#645efb]/10 blur-3xl"></view>
    </view>

    <!-- Header Close button -->
    <view class="relative z-10 flex items-center justify-between h-16 px-4 w-full shrink-0 mt-8">
      <view @click="handleClose" class="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center cursor-pointer">
        <view class="w-5 h-5" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAyNCAyNCcgZmlsbD0nbm9uZScgc3Ryb2tlPScjNjQ3NDhiJyBzdHJva2Utd2lkdGg9JzInIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcgc3Ryb2tlLWxpbmVqb2luPSdyb3VuZCc+PGxpbmUgeDE9JzE4JyB5MT0nNicgeDI9JzYnIHkyPScxOCc+PC9saW5lPjxsaW5lIHgxPSc2JyB5MT0nNicgeDI9JzE4JyB5Mj0nMTgnPjwvbGluZT48L3N2Zz4='); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
      </view>
    </view>

    <!-- Main Form content -->
    <view class="relative z-10 flex-1 flex flex-col px-6 pt-6 pb-12 max-w-md mx-auto w-full">
      <!-- Brand details -->
      <view class="mb-8">
        <view class="w-14 h-14 bg-[#00685f] text-white rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-[#00685f]/10">
          <view class="w-8 h-8" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAyNCAyNCcgZmlsbD0nI2ZmZmZmZic+PHBhdGggZD0nTTEyIDJMMiA3bDEwIDUgMTAtNS0xMC01ek0yIDE3bDEwIDUgMTAtNU0yIDEybDEwIDUgMTAtNScgLz48L3N2Zz4='); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
        </view>
        <text class="font-display text-xl font-bold text-slate-800 mb-2 block">欢迎登录学源汇</text>
        <text class="font-sans text-xs text-slate-400 block">探索海量优质教育资源，让学习更高效。</text>
      </view>

      <!-- Input Validation Error -->
      <view v-if="error" class="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-rose-600 text-xs font-semibold animate-shake">
        <view class="w-4.5 h-4.5 shrink-0" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAyNCAyNCcgZmlsbD0nbm9uZScgc3Ryb2tlPScjZTExZDQ4JyBzdHJva2Utd2lkdGg9JzInIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcgc3Ryb2tlLWxpbmVqb2luPSdyb3VuZCc+PGNpcmNsZSBjeD0nMTInIGN5PScxMicgcj0nMTAnPjwvY2lyY2xlPjxsaW5lIHgxPScxMicgeTE9JzgnIHgyPScxMicgeTI9JzEyJz48L2xpbmU+PGxpbmUgeDE9JzEyJyB5MT0nMTYnIHgyPScxMi4wMScgeTI9JzE2Jz48L2xpbmU+PC9zdmc+'); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
        <text>{{ error }}</text>
      </view>

      <!-- Login Form inputs -->
      <view class="flex flex-col gap-5">
        <!-- Phone Input with +86 indicator -->
        <view class="relative">
          <view class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <text class="font-sans text-xs font-semibold text-slate-500 border-r border-slate-200 pr-3">+86</text>
          </view>
          <input 
            type="number"
            v-model="phone"
            maxlength="11"
            placeholder="请输入手机号"
            class="w-full box-border bg-slate-50 border border-slate-200 focus:bg-white rounded-xl pl-16 pr-4 h-[48px] font-sans text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#00685f] transition-all outline-none"
          />
        </view>

        <!-- Password input -->
        <view class="relative flex gap-3">
          <view class="relative flex-1">
            <input 
              type="password"
              v-model="password"
              placeholder="请输入密码"
              class="w-full box-border bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-4 h-[48px] font-sans text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#00685f] transition-all outline-none"
            />
          </view>
        </view>

        <!-- Submit Action Button -->
        <button 
          @click="handleSubmit"
          class="w-full bg-[#00685f] hover:bg-[#005049] text-white font-display text-sm font-bold h-[48px] leading-[48px] rounded-xl shadow-md cursor-pointer transition-all mt-2 text-center border-none after:border-none"
          hover-class="opacity-80 scale-95"
        >
          登录 / 注册
        </button>

        <!-- Agreement Checkbox -->
        <view class="flex items-start gap-2.5 mt-2">
          <view class="relative flex items-center pt-0.5 shrink-0" @click="toggleAgreement">
            <view class="w-4 h-4 border border-slate-200 rounded flex items-center justify-center transition-all cursor-pointer" :class="isAgreementChecked ? 'bg-[#00685f] border-[#00685f]' : 'bg-slate-50'">
              <image v-if="isAgreementChecked" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E" class="w-3 h-3 text-white" style="width: 12px; height: 12px;" mode="aspectFit" />
            </view>
          </view>
          <text 
            @click="toggleAgreement"
            class="font-sans text-[11px] text-slate-500 leading-relaxed cursor-pointer"
          >
            我已阅读并同意学源汇的 <text class="text-[#00685f]">《用户协议》</text>、<text class="text-[#00685f]">《隐私政策》</text> 及 <text class="text-[#00685f]">《儿童个人信息保护规则》</text>，未注册手机号将自动注册。
          </text>
        </view>
      </view>

      <view class="flex-1"></view>

      <!-- WeChat social login footer mockup -->
      <view class="mt-12 flex flex-col items-center">
        <view class="flex items-center w-full gap-4 mb-6">
          <view class="flex-1 h-px bg-slate-100"></view>
          <text class="font-sans text-[11px] text-slate-400 uppercase tracking-wider font-semibold">其他登录方式</text>
          <view class="flex-1 h-px bg-slate-100"></view>
        </view>
        
        <view @click="handleWeChatLogin" class="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100/60 flex items-center justify-center text-emerald-500 transition-all cursor-pointer shadow-sm">
          <view class="w-5 h-5" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAyNCAyNCcgZmlsbD0nIzEwYjk4MSc+PHBhdGggZD0nTTE4IDhINkM0LjkgOCA0IDguOSA0IDEwdjhjMCAxLjEuOSAyIDIgMmgxMmMxLjEgMCAyLS45IDItMnYtOGMwLTEuMS0uOS0yLTItMnptLTQgN2gtNHYtMmg0djJ6JyAvPjwvc3ZnPg=='); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { request } from '../../utils/request'

const phone = ref('')
const password = ref('')
const isAgreementChecked = ref(false)
const error = ref('')

const handleClose = () => {
  uni.navigateBack({
    fail: () => {
      uni.switchTab({
        url: '/pages/index/index'
      })
    }
  })
}

const toggleAgreement = () => {
  isAgreementChecked.value = !isAgreementChecked.value
}

const handleSubmit = async () => {
  error.value = ''

  if (!phone.value || phone.value.length !== 11 || !/^\d+$/.test(phone.value)) {
    error.value = '请输入正确的11位手机号码'
    return
  }

  if (!password.value) {
    error.value = '请输入密码'
    return
  }

  if (!isAgreementChecked.value) {
    error.value = '请勾选并同意《用户协议》与《隐私政策》'
    return
  }

  try {
    uni.showLoading({ title: '正在登录...', mask: true })
    const res = await request({
      url: '/user/login',
      method: 'POST',
      data: {
        phone: phone.value,
        code: password.value // Backend uses code field
      }
    })
    
    uni.hideLoading()
    
    // Save to storage
    uni.setStorageSync('token', res.data.token)
    uni.setStorageSync('user', JSON.stringify(res.data.user))
    
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })

    // Redirect to profile
    setTimeout(() => {
      uni.switchTab({
        url: '/pages/profile/profile',
        fail: () => {
          uni.reLaunch({
            url: '/pages/profile/profile'
          })
        }
      })
    }, 1000)
  } catch (err) {
    uni.hideLoading()
    error.value = err?.msg || '登录失败，请检查网络或重试'
  }
}

const handleWeChatLogin = () => {
  uni.showToast({
    title: '微信一键登录暂未开放',
    icon: 'none'
  })
}
</script>

<style>
page {
  background-color: #ffffff;
}
button::after {
  border: none;
}
</style>
