let BASE_URL = 'http://192.168.1.219:8080/api'; // 本地开发或局域网测试地址

if (process.env.NODE_ENV === 'production') {
  // 生产环境（发布上线时）使用微信云托管公网地址
  BASE_URL = 'https://springboot-onal-275813-4-1448291145.sh.run.tcloudbase.com/api'; 
}

let isNavigatingToLogin = false;

// 生产环境自动初始化微信云环境
if (process.env.NODE_ENV === 'production') {
  if (typeof wx !== 'undefined' && wx.cloud) {
    wx.cloud.init({
      env: 'prod-d9gvxka79648637da',
      traceUser: true
    });
  }
}

export const request = (options) => {
  return new Promise(async (resolve, reject) => {
    const token = uni.getStorageSync('token');
    const header = {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.header
    };

    const handleSuccess = (res) => {
      // 深度遍历并强制替换所有的 http 为 https
      let dataString = JSON.stringify(res.data);
      if (dataString) {
        dataString = dataString.replace(/http:\/\/oss\.gut9\.cn/g, 'https://oss.gut9.cn');
        res.data = JSON.parse(dataString);
      }
      const data = res.data;
      if (data && data.code === 200) {
        resolve(data);
      } else if (data && data.code === 401) {
        uni.removeStorageSync('token');
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        
        if (currentPage && currentPage.route !== 'pages/login/login' && !isNavigatingToLogin) {
          isNavigatingToLogin = true;
          uni.showToast({ title: '登录已过期，请重新登录', icon: 'none' });
          uni.navigateTo({ url: '/pages/login/login' });
          setTimeout(() => { isNavigatingToLogin = false; }, 3000);
        }
        reject(data);
      } else {
        uni.showToast({ title: data?.msg || '请求失败', icon: 'none' });
        reject(data);
      }
    };

    if (process.env.NODE_ENV === 'production' && typeof wx !== 'undefined' && wx.cloud) {
      // 生产环境：使用微信专属内网直连（完全免白名单）
      try {
        const res = await wx.cloud.callContainer({
          config: { env: 'prod-d9gvxka79648637da' },
          path: '/api' + options.url,
          header: {
            'X-WX-SERVICE': 'springboot-onal',
            ...header
          },
          method: options.method || 'GET',
          data: options.data
        });
        handleSuccess(res);
      } catch (err) {
        uni.showToast({ title: '云托管网络异常', icon: 'none' });
        reject(err);
      }
    } else {
      // 开发环境：走本地网络
      uni.request({
        url: BASE_URL + options.url,
        method: options.method || 'GET',
        data: options.data,
        header: header,
        success: handleSuccess,
        fail: (err) => {
          uni.showToast({ title: '网络异常，请稍后重试', icon: 'none' });
          reject(err);
        }
      });
    }
  });
};

export const uploadFile = (options) => {
  return new Promise(async (resolve, reject) => {
    try {
      // 1. 先向后端请求七牛云直传 Token
      const tokenRes = await request({ url: '/resource/qiniu/token', method: 'GET' });
      const uploadToken = tokenRes.data;

      // 2. 将文件直接上传到七牛云 (不经过后端，完美绕过微信白名单中的后端域名限制)
      const ext = options.filePath.split('.').pop();
      const fileName = `edwell/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;

      uni.uploadFile({
        url: 'https://upload.qiniup.com', // 七牛云全国通用上传节点 (已备案，可加微信白名单)
        filePath: options.filePath,
        name: 'file',
        formData: {
          token: uploadToken,
          key: fileName
        },
        success: (uploadFileRes) => {
          try {
            const data = JSON.parse(uploadFileRes.data);
            if (data.key) {
              // 构造完整的访问链接，强制使用 https，因为微信手机端完全拦截 http 的图片
              resolve({ code: 200, data: 'https://oss.gut9.cn/' + data.key });
            } else {
              uni.showToast({ title: '七牛云上传失败', icon: 'none' });
              reject(data);
            }
          } catch (e) {
            reject(e);
          }
        },
        fail: (err) => {
          uni.showToast({ title: '网络异常，上传失败', icon: 'none' });
          reject(err);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};
