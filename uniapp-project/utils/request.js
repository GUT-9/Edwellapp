const BASE_URL = 'http://localhost:8080/api'; // 之后导出在本地运行时，替换为真实的后端地址

export const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token');
    
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.header
      },
      success: (res) => {
        // 后端统一返回 Result<T> 格式: { code: 200, msg: 'success', data: ... }
        const data = res.data;
        if (data && data.code === 200) {
          resolve(data);
        } else if (data && data.code === 401) {
          uni.showToast({ title: '登录已过期，请重新登录', icon: 'none' });
          uni.removeStorageSync('token');
          // 跳转到登录页
          uni.navigateTo({ url: '/pages/login/login' });
          reject(data);
        } else {
          uni.showToast({ title: data?.msg || '请求失败', icon: 'none' });
          reject(data);
        }
      },
      fail: (err) => {
        uni.showToast({ title: '网络异常，请稍后重试', icon: 'none' });
        reject(err);
      }
    });
  });
};

export const uploadFile = (options) => {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token');
    
    uni.uploadFile({
      url: BASE_URL + options.url,
      filePath: options.filePath,
      name: options.name || 'file',
      formData: options.formData,
      header: {
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.header
      },
      success: (uploadFileRes) => {
        try {
          const data = JSON.parse(uploadFileRes.data);
          if (data.code === 200) {
            resolve(data);
          } else if (data.code === 401) {
            uni.showToast({ title: '登录已过期', icon: 'none' });
            uni.navigateTo({ url: '/pages/login/login' });
            reject(data);
          } else {
            uni.showToast({ title: data.msg || '上传失败', icon: 'none' });
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
  });
};
