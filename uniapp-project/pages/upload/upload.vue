<template>
  <view class="flex-1 bg-slate-50/50 min-h-screen pb-24">
    <view class="px-4 pt-5 pb-3 mt-8">
      <text class="block font-display text-lg font-bold text-slate-800">上传学习资源</text>
      <text class="block font-sans text-xs text-slate-400 mt-1">分享您的优质学习资料，助力K12教育生态。</text>
    </view>

    <!-- Error notification -->
    <view v-if="error" class="mx-4 p-3.5 bg-rose-50 border border-rose-100 rounded-xl flex flex-row items-center gap-2 text-rose-600 text-xs font-semibold">
      <view class="shrink-0 text-rose-500" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICAgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmNDNmNWUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCI+PC9jaXJjbGU+PGxpbmUgeDE9IjEyIiB5MT0iOCIgeDI9IjEyIiB5Mj0iMTIiPjwvbGluZT48bGluZSB4MT0iMTIiIHkxPSIxNiIgeDI9IjEyLjAxIiB5Mj0iMTYiPjwvbGluZT48L3N2Zz4='); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
      <text>{{ error }}</text>
    </view>

    <view class="px-4 pb-6 space-y-4">
      <!-- 1. 基础信息 -->
      <view class="bg-white rounded-xl p-5 border border-slate-200/50 shadow-sm flex flex-col gap-4 mt-3">
        <view class="font-display text-sm font-bold text-slate-800 flex flex-row items-center gap-2 pb-2 border-b border-slate-100">
          <view class="w-1.5 h-4 bg-[#00685f] rounded-full"></view>
          <text>1. 基础信息</text>
        </view>

        <view class="flex flex-col gap-3.5">
          <view>
            <text class="block font-sans text-xs font-bold text-slate-700 mb-1.5">
              资源标题 <text class="text-rose-500">*</text>
            </text>
            <input 
              type="text"
              v-model="title"
              placeholder="请输入清晰准确的资源标题，如“高二数学期中试卷”"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 font-sans text-xs text-slate-800 bg-slate-50/20 outline-none transition-all duration-200 focus:border-[#00685f] focus:bg-white focus:ring-[3px] focus:ring-[#00685f]/10"
            />
          </view>

          <view>
            <text class="block font-sans text-xs font-bold text-slate-700 mb-1.5">
              资源简介 <text class="text-rose-500">*</text>
            </text>
            <textarea 
              rows="4"
              v-model="description"
              placeholder="简要描述资源内容、适用对象及亮点，让其他老师和同学更好地发现您的作品..."
              class="w-full px-4 py-3 rounded-xl border border-slate-200 font-sans text-xs text-slate-800 bg-slate-50/20 h-24 outline-none transition-all duration-200 focus:border-[#00685f] focus:bg-white focus:ring-[3px] focus:ring-[#00685f]/10"
            />
          </view>
        </view>
      </view>

      <!-- 2. 分类归属 -->
      <view class="bg-white rounded-xl p-5 border border-slate-200/50 shadow-sm flex flex-col gap-4 mt-3">
        <view class="font-display text-sm font-bold text-slate-800 flex flex-row items-center gap-2 pb-2 border-b border-slate-100">
          <view class="w-1.5 h-4 bg-[#00685f] rounded-full"></view>
          <text>2. 分类归属</text>
        </view>

        <view class="flex flex-col gap-3.5">
          <!-- 学段 Picker -->
          <view>
            <text class="block font-sans text-xs font-bold text-slate-700 mb-1.5">
              学段 <text class="text-rose-500">*</text>
            </text>
            <picker @change="onStageChange" :range="stages" range-key="name" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/20 text-slate-800 font-sans text-xs cursor-pointer transition-all duration-200 focus-within:border-[#00685f] focus-within:bg-white focus-within:ring-[3px] focus-within:ring-[#00685f]/10">
              <view class="flex flex-row justify-between items-center">
                <text>{{ stageName || '请选择学段' }}</text>
                <text class="text-slate-400">▼</text>
              </view>
            </picker>
          </view>

          <!-- 年级 Picker -->
          <view>
            <text class="block font-sans text-xs font-bold text-slate-700 mb-1.5">
              年级 <text class="text-rose-500">*</text>
            </text>
            <picker @change="onGradeChange" :range="availableGrades" :disabled="!stage" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/20 text-slate-800 font-sans text-xs cursor-pointer disabled:bg-slate-100 transition-all duration-200 focus-within:border-[#00685f] focus-within:bg-white focus-within:ring-[3px] focus-within:ring-[#00685f]/10">
              <view class="flex flex-row justify-between items-center">
                <text>{{ grade || (stage ? '请选择年级' : '请先选择学段') }}</text>
                <text class="text-slate-400">▼</text>
              </view>
            </picker>
          </view>

          <!-- 学科 Picker -->
          <view>
            <text class="block font-sans text-xs font-bold text-slate-700 mb-1.5">
              学科 <text class="text-rose-500">*</text>
            </text>
            <picker @change="onSubjectChange" :range="availableSubjects" :disabled="!stage" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/20 text-slate-800 font-sans text-xs cursor-pointer disabled:bg-slate-100 transition-all duration-200 focus-within:border-[#00685f] focus-within:bg-white focus-within:ring-[3px] focus-within:ring-[#00685f]/10">
              <view class="flex flex-row justify-between items-center">
                <text>{{ subject || (stage ? '请选择学科' : '请先选择学段') }}</text>
                <text class="text-slate-400">▼</text>
              </view>
            </picker>
          </view>
        </view>
      </view>

      <!-- 3. 文件与封面 -->
      <view class="bg-white rounded-xl p-5 border border-slate-200/50 shadow-sm flex flex-col gap-4 mt-3">
        <view class="font-display text-sm font-bold text-slate-800 flex flex-row items-center gap-2 pb-2 border-b border-slate-100">
          <view class="w-1.5 h-4 bg-[#00685f] rounded-full"></view>
          <text>3. 文件与封面</text>
        </view>

        <view class="flex flex-col gap-4">
          <view>
            <text class="block font-sans text-xs font-bold text-slate-700 mb-1.5">
              资源文件 <text class="text-rose-500">*</text>
            </text>

            <view v-if="fileName" class="p-4 rounded-xl border border-[#00685f]/20 bg-[#00685f]/10 flex flex-row items-center justify-between">
              <view class="flex flex-row items-center gap-3">
                <view class="w-10 h-10 bg-[#00685f]/10 rounded-lg text-[#00685f] flex items-center justify-center font-display text-[11px] font-bold">
                  {{ fileType }}
                </view>
                <view>
                  <text class="font-sans text-xs font-bold text-slate-800 truncate block max-w-[180px]">{{ fileName }}</text>
                  <text class="text-[10px] text-slate-400 font-sans mt-0.5">{{ fileSize }}</text>
                </view>
              </view>
              <text 
                @click="removeFile"
                class="text-[11px] font-semibold text-rose-500 hover:text-rose-600 cursor-pointer"
              >
                删除
              </text>
            </view>

            <view 
              v-else
              @click="chooseFile"
              class="w-full bg-slate-50 rounded-xl p-6 text-center cursor-pointer hover:border-[#00685f] hover:bg-slate-100/40 border-2 border-dashed border-slate-200/80 transition-all flex flex-col items-center justify-center"
            >
              <view class="text-slate-400 mb-2 block" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICAgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5NGEzYjgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjEgMTV2NGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMnYtNCI+PC9wYXRoPjxwb2x5bGluZSBwb2ludHM9IjE3IDggMTIgMyA3IDgiPjwvcG9seWxpbmU+PGxpbmUgeDE9IjEyIiB5MT0iMyIgeDI9IjEyIiB5Mj0iMTUiPjwvbGluZT48L3N2Zz4='); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
              <text class="font-sans text-xs font-bold text-slate-700">点击选择或上传资源文件</text>
              <text class="font-sans text-[10px] text-slate-400 mt-1 max-w-xs leading-relaxed">
                支持 PDF, Word, PPT, MP4 等格式，单个文件不超过 100MB
              </text>
            </view>
          </view>

          <!-- Optional Cover URL -->
          <view>
            <text class="block font-sans text-xs font-bold text-slate-700 mb-1.5">
              封面图片 (可选)
            </text>
            <view v-if="coverUrl" class="relative w-32 h-32 rounded-xl overflow-hidden border border-slate-200">
              <image :src="coverUrl" mode="aspectFill" class="w-full h-full object-cover" />
              <view @click="coverUrl = ''" class="absolute top-1 right-1 w-6 h-6 bg-rose-500/80 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-rose-600 transition-colors">
                <view class="" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48bGluZSB4MT0iMTgiIHkxPSI2IiB4Mj0iNiIgeTI9IjE4Ij48L2xpbmU+PGxpbmUgeDE9IjYiIHkxPSI2IiB4Mj0iMTgiIHkyPSIxOCI+PC9saW5lPjwvc3ZnPg=='); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
              </view>
            </view>
            <view 
              v-else
              @click="chooseCover"
              class="w-32 h-32 bg-slate-50 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#00685f] border border-dashed border-slate-300 transition-colors"
            >
              <view class="text-slate-400 mb-2" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICAgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5NGEzYjgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSIzIiB5PSIzIiB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHJ4PSIyIiByeT0iMiI+PC9yZWN0PjxjaXJjbGUgY3g9IjguNSIgY3k9IjguNSIgcj0iMS41Ij48L2NpcmNsZT48cG9seWxpbmUgcG9pbnRzPSIyMSAxNSAxNiAxMCA1IDIxIj48L3BvbHlsaW5lPjwvc3ZnPg=='); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
              <text class="font-sans text-[11px] font-semibold text-slate-500">点击上传封面</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 4. 设置与声明 -->
      <view class="bg-white rounded-xl p-5 border border-slate-200/50 shadow-sm flex flex-col gap-4 mt-3">
        <view class="font-display text-sm font-bold text-slate-800 flex flex-row items-center gap-2 pb-2 border-b border-slate-100">
          <view class="w-1.5 h-4 bg-[#00685f] rounded-full"></view>
          <text>4. 设置与声明</text>
        </view>

        <view class="flex flex-col gap-4">
          <view class="flex flex-row items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
            <view class="flex flex-col gap-0.5 max-w-[160px]">
              <text class="font-sans text-xs font-bold text-slate-700">下载所需积分</text>
              <text class="font-sans text-[10px] text-slate-400 leading-normal">设置其他用户下载本资源需消耗的积分。</text>
            </view>

            <!-- Number counter selector -->
            <view class="flex flex-row items-center gap-1.5 bg-white rounded-lg border border-slate-200 px-2 py-1">
              <view 
                @click="adjustPoints(-5)"
                class="p-1 text-slate-500 hover:text-[#00685f] cursor-pointer hover:bg-slate-50 rounded flex items-center justify-center w-6 h-6"
              >
                <view class="text-slate-500" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICAgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2NDc0OGIiIHN0cm9rZS13aWR0aD0iMi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxsaW5lIHgxPSI1IiB5MT0iMTIiIHgyPSIxOSIgeTI9IjEyIj48L2xpbmU+PC9zdmc+'); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
              </view>
              <input 
                type="number"
                v-model="points"
                class="w-10 text-center font-sans text-xs font-bold text-slate-800 border-none bg-transparent"
              />
              <view 
                @click="adjustPoints(5)"
                class="p-1 text-slate-500 hover:text-[#00685f] cursor-pointer hover:bg-slate-50 rounded flex items-center justify-center w-6 h-6"
              >
                <view class="text-slate-500" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICAgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2NDc0OGIiIHN0cm9rZS13aWR0aD0iMi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxsaW5lIHgxPSIxMiIgeTE9IjUiIHgyPSIxMiIgeTI9IjE5Ij48L2xpbmU+PGxpbmUgeDE9IjUiIHkxPSIxMiIgeDI9IjE5IiB5Mj0iMTIiPjwvbGluZT48L3N2Zz4='); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
              </view>
            </view>
          </view>

          <!-- Copyright check checkbox -->
          <view class="flex flex-row items-start gap-2.5">
            <checkbox-group @change="onCopyrightChange" class="pt-0.5 shrink-0">
              <checkbox value="confirm" :checked="isCopyrightChecked" color="#00685f" style="transform:scale(0.8)" />
            </checkbox-group>
            <text class="font-sans text-[11px] text-slate-500 leading-relaxed">
              我承诺此资源由本人原创或已获得合法授权，不存在侵权情况。若有违规，平台有权随时下架处理。 <text class="text-rose-500 font-bold">*</text>
            </text>
          </view>
        </view>
      </view>

      <!-- Upload Button -->
      <view class="pt-4">
        <button 
          @click="handleStartUpload"
          class="w-full bg-[#00685f] hover:bg-[#008378] text-white font-sans text-sm font-bold py-3.5 rounded-xl shadow-md cursor-pointer transition-all active:scale-[0.98] flex flex-row items-center justify-center gap-1.5 border-none"
        >
          <view class="text-white" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICAgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjEgMTV2NGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMnYtNCI+PC9wYXRoPjxwb2x5bGluZSBwb2ludHM9IjE3IDggMTIgMyA3IDgiPjwvcG9seWxpbmU+PGxpbmUgeDE9IjEyIiB5MT0iMyIgeDI9IjEyIiB5Mj0iMTUiPjwvbGluZT48L3N2Zz4='); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
          <text>开始上传</text>
        </button>
      </view>
    </view>

    <!-- Uploading progress overlay modal -->
    <view v-if="uploadProgress !== null" class="fixed inset-0 bg-slate-950/45 backdrop-blur-sm z-50 flex items-center justify-center">
      <view class="bg-white w-72 rounded-2xl shadow-xl p-6 text-center border border-slate-100 flex flex-col items-center z-[51]">
        <view class="w-12 h-12 rounded-full bg-[#00685f]/10 text-[#00685f] flex items-center justify-center mb-4">
          <view class="animate-bounce text-[#00685f]" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICAgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDY4NWYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjEgMTV2NGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMnYtNCI+PC9wYXRoPjxwb2x5bGluZSBwb2ludHM9IjE3IDggMTIgMyA3IDgiPjwvcG9seWxpbmU+PGxpbmUgeDE9IjEyIiB5MT0iMyIgeDI9IjEyIiB5Mj0iMTUiPjwvbGluZT48L3N2Zz4='); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
        </view>
        <text class="font-display text-sm font-bold text-slate-800">正在传输文件至云存储</text>
        <text class="font-sans text-[11px] text-slate-400 mt-1">请勿关闭或退出当前页面...</text>
        
        <view class="w-full bg-slate-100 h-1.5 rounded-full mt-5 overflow-hidden">
          <view class="bg-[#00685f] h-full transition-all duration-150" :style="{ width: uploadProgress + '%' }"></view>
        </view>
        <text class="font-display text-xs font-bold text-[#00685f] mt-2">{{ uploadProgress }}%</text>
      </view>
    </view>

    <!-- Success Modal -->
    <view v-if="isSuccessOpen" class="fixed inset-0 bg-slate-950/45 backdrop-blur-sm z-50 flex items-center justify-center">
      <view class="bg-white w-80 rounded-2xl shadow-xl p-6 text-center border border-slate-100 flex flex-col items-center mx-4 z-[51]">
        <view class="w-14 h-14 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4">
          <view class="text-emerald-500" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICAgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMxMGI5ODEiIHN0cm9rZS13aWR0aD0iMi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMiAxMS4wOFYxMmExMCAxMCAwIDEgMS01LjkzLTkuMTQiPjwvcGF0aD48cG9seWxpbmUgcG9pbnRzPSIyMiA0IDEyIDE0LjAxIDkgMTEuMDEiPjwvcG9seWxpbmU+PC9zdmc+'); background-size: contain; background-repeat: no-repeat; background-position: center;"></view>
        </view>
        <text class="font-display text-base font-bold text-slate-800">资源上传提交成功</text>
        <text class="font-sans text-xs text-slate-400 mt-2 leading-relaxed">
          您的资源已提交至系统后台审核中心。通过后将自动向全站师生发布，并增加您的贡献积分！
        </text>

        <view class="flex gap-3 w-full mt-6 flex-row">
          <button 
            @click="handleResetForm"
            class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-sans text-xs font-semibold cursor-pointer text-center bg-white border-solid"
          >
            再传一集
          </button>
          <button 
            @click="handleViewUploads"
            class="flex-1 py-2.5 rounded-xl bg-[#00685f] text-white font-sans text-xs font-semibold shadow-sm cursor-pointer text-center border-none"
          >
            查看上传
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { request, uploadFile } from '../../utils/request'

// Config
const stages = ref([])
const stageGrades = ref({})
const stageSubjects = ref({})

// Basic form info
const title = ref('')
const description = ref('')
const stage = ref('')
const stageName = ref('')
const grade = ref('')
const subject = ref('')

const fileName = ref('')
const fileSize = ref('')
const fileType = ref('')
const coverUrl = ref('')
const tempFilePath = ref('')

const points = ref(0)
const isCopyrightChecked = ref(false)
const error = ref('')
const uploadProgress = ref(null)
const isSuccessOpen = ref(false)

let currentUserId = ''

onShow(() => {
  const token = uni.getStorageSync('token')
  const userStr = uni.getStorageSync('user')
  if (!token) {
    uni.navigateTo({
      url: '/pages/login/login'
    })
    return
  }
  
  if (userStr) {
    const userObj = JSON.parse(userStr)
    if (currentUserId && currentUserId !== userObj.id) {
      handleResetForm()
    }
    currentUserId = userObj.id
  }

  fetchConfig()
})

const fetchConfig = async () => {
  try {
    const [stagesRes, gradesRes, subjectsRes] = await Promise.all([
      request({ url: '/stages', method: 'GET' }),
      request({ url: '/grades', method: 'GET' }),
      request({ url: '/subjects', method: 'GET' })
    ])
    stages.value = stagesRes.data || []
    stageGrades.value = gradesRes.data || {}
    stageSubjects.value = subjectsRes.data || {}
  } catch (err) {
    console.error(err)
  }
}

// Cascading computed choices
const availableGrades = computed(() => {
  return stage.value ? (stageGrades.value[stage.value] || []) : []
})

const availableSubjects = computed(() => {
  return stage.value ? (stageSubjects.value[stage.value] || []) : []
})

// Pickers change
const onStageChange = (e) => {
  const index = e.detail.value
  stage.value = stages.value[index]?.id || ''
  stageName.value = stages.value[index]?.name || ''
  grade.value = ''
  subject.value = ''
}

const onGradeChange = (e) => {
  grade.value = availableGrades.value[e.detail.value]
}

const onSubjectChange = (e) => {
  subject.value = availableSubjects.value[e.detail.value]
}

const onCopyrightChange = (e) => {
  isCopyrightChecked.value = e.detail.value.includes('confirm')
}

const adjustPoints = (amount) => {
  const nextVal = points.value + amount
  if (nextVal >= 0 && nextVal <= 100) {
    points.value = nextVal
  }
}

// Select document file
const chooseFile = () => {
  // Use uni.chooseFile for uni-app (H5, app) or uni.chooseMessageFile for WeChat Mini Program
  // #ifdef MP-WEIXIN
  uni.chooseMessageFile({
    count: 1,
    type: 'file',
    success: (res) => {
      processSelectedFile(res.tempFiles[0])
    }
  })
  // #endif

  // #ifndef MP-WEIXIN
  uni.chooseFile({
    count: 1,
    type: 'all',
    success: (res) => {
      processSelectedFile(res.tempFiles[0])
    }
  })
  // #endif
}

const processSelectedFile = (file) => {
  fileName.value = file.name
  fileSize.value = (file.size / 1024 / 1024).toFixed(2) + ' MB'
  
  // Extract extension
  const idx = file.name.lastIndexOf('.')
  const ext = idx !== -1 ? file.name.substring(idx + 1).toUpperCase() : 'DOC'
  fileType.value = ext
  tempFilePath.value = file.path

  // Smart autofill stage and subject based on filename
  if (file.name.includes('数学')) {
    stage.value = 'high'
    stageName.value = '高中'
    setTimeout(() => {
      grade.value = '高二'
      subject.value = '数学'
    }, 50)
  } else if (file.name.includes('物理')) {
    stage.value = 'middle'
    stageName.value = '初中'
    setTimeout(() => {
      grade.value = '九年级'
      subject.value = '物理'
    }, 50)
  } else if (file.name.includes('语文')) {
    stage.value = 'primary'
    stageName.value = '小学'
    setTimeout(() => {
      grade.value = '六年级'
      subject.value = '语文'
    }, 50)
  }
}

const chooseCover = () => {
  uni.chooseImage({
    count: 1,
    success: async (res) => {
      const tempPath = res.tempFilePaths[0]
      try {
        uni.showLoading({ title: '上传封面中...' })
        const uploadRes = await uploadFile({
          url: '/upload',
          filePath: tempPath,
          name: 'file'
        })
        coverUrl.value = uploadRes.data
        uni.hideLoading()
      } catch (err) {
        uni.hideLoading()
        uni.showToast({ title: '封面上传失败', icon: 'none' })
      }
    }
  })
}

const removeFile = () => {
  fileName.value = ''
  fileSize.value = ''
  fileType.value = ''
  tempFilePath.value = ''
}

const handleStartUpload = async () => {
  error.value = ''

  if (!title.value.trim()) {
    error.value = '请输入资源标题'
    return
  }
  if (!description.value.trim()) {
    error.value = '请输入资源描述简介'
    return
  }
  if (!stage.value) {
    error.value = '请选择资源所处的学段'
    return
  }
  if (!grade.value) {
    error.value = '请选择资源适用的具体年级'
    return
  }
  if (!subject.value) {
    error.value = '请选择资源所属的学科门类'
    return
  }
  if (!tempFilePath.value) {
    error.value = '请先点击上传资源文件'
    return
  }
  if (!isCopyrightChecked.value) {
    error.value = '请勾选同意并承诺知识产权版权相关声明'
    return
  }

  try {
    uploadProgress.value = 0
    // Simulate progress animation
    const progressInterval = setInterval(() => {
      if (uploadProgress.value !== null && uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 200)

    // Upload to backend Qiniu API
    const uploadRes = await uploadFile({
      url: '/upload',
      filePath: tempFilePath.value,
      name: 'file'
    })

    clearInterval(progressInterval)
    uploadProgress.value = 100

    const finalFileUrl = uploadRes.data // Direct Qiniu URL returned by backend

    let finalCoverUrl = coverUrl.value;
    if (!finalCoverUrl) {
      if (['MP4', 'VIDEO', 'AVI', 'MOV', 'MKV'].includes(fileType.value)) {
        finalCoverUrl = finalFileUrl + '?vframe/jpg/offset/1';
      } else { finalCoverUrl = ''; }
    }

    // Insert resource records into backend
    await request({
      url: '/resources',
      method: 'POST',
      data: {
        title: title.value,
        description: description.value,
        stage: stage.value,
        grade: grade.value,
        subject: subject.value,
        fileType: fileType.value,
        fileUrl: finalFileUrl,
        coverUrl: finalCoverUrl,
        points: points.value
      }
    })

    uploadProgress.value = null
    isSuccessOpen.value = true
  } catch (err) {
    uploadProgress.value = null
    uni.showToast({ title: err?.msg || '上传云端失败，请稍后重试', icon: 'none' })
  }
}

const handleResetForm = () => {
  title.value = ''
  description.value = ''
  stage.value = ''
  stageName.value = ''
  grade.value = ''
  subject.value = ''
  removeFile()
  coverUrl.value = ''
  points.value = 0
  isCopyrightChecked.value = false
  isSuccessOpen.value = false
}

const handleViewUploads = () => {
  handleResetForm()
  isSuccessOpen.value = false
  uni.switchTab({
    url: '/pages/profile/profile'
  })
}
</script>

<style scoped>
.font-display {
  font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
</style>
