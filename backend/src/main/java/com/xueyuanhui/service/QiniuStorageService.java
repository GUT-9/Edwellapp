package com.xueyuanhui.service;

import com.qiniu.storage.Configuration;
import com.qiniu.storage.Region;
import com.qiniu.storage.UploadManager;
import com.qiniu.util.Auth;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
public class QiniuStorageService {

    @Value("${qiniu.access-key}")
    private String accessKey;

    @Value("${qiniu.secret-key}")
    private String secretKey;

    @Value("${qiniu.bucket}")
    private String bucket;

    @Value("${qiniu.domain}")
    private String domain;

    public String getUploadToken() {
        Auth auth = Auth.create(accessKey, secretKey);
        return auth.uploadToken(bucket);
    }

    public String uploadFile(MultipartFile file) {
        try {
            Configuration cfg = new Configuration(Region.autoRegion());
            UploadManager uploadManager = new UploadManager(cfg);
            Auth auth = Auth.create(accessKey, secretKey);
            String upToken = auth.uploadToken(bucket);

            String originalFilename = file.getOriginalFilename();
            String ext = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                ext = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String key = UUID.randomUUID().toString().replace("-", "") + ext;

            uploadManager.put(file.getInputStream(), key, upToken, null, null);

            return domain + key;
        } catch (Exception e) {
            throw new RuntimeException("七牛云文件上传失败", e);
        }
    }

    public void deleteFile(String fileUrl) {
        if (fileUrl == null || !fileUrl.startsWith(domain)) {
            return;
        }
        try {
            Configuration cfg = new Configuration(Region.autoRegion());
            Auth auth = Auth.create(accessKey, secretKey);
            com.qiniu.storage.BucketManager bucketManager = new com.qiniu.storage.BucketManager(auth, cfg);
            
            // Extract the key from the full URL
            String key = fileUrl.replace(domain, "");
            bucketManager.delete(bucket, key);
        } catch (Exception e) {
            System.err.println("七牛云文件删除失败: " + e.getMessage());
        }
    }
}
