import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import { weappTailwindcss as uvtw } from 'weapp-tailwindcss/vite';

const isH5 = process.env.UNI_PLATFORM === 'h5';
const isApp = process.env.UNI_PLATFORM === 'app' || process.env.UNI_PLATFORM === 'app-plus';
const weappTailwindcssDisabled = isH5 || isApp;

export default defineConfig({
  plugins: [
    uni(),
    uvtw({
      rem2rpx: true,
      disabled: weappTailwindcssDisabled
    })
  ]
});
