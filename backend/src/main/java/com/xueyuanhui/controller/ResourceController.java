package com.xueyuanhui.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.xueyuanhui.common.Result;
import com.xueyuanhui.common.UserContext;
import com.xueyuanhui.entity.Resource;
import com.xueyuanhui.entity.User;
import com.xueyuanhui.mapper.ResourceMapper;
import com.xueyuanhui.mapper.UserMapper;
import com.xueyuanhui.service.QiniuStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Tag(name = "资源模块")
@RestController
@RequestMapping("/api")
public class ResourceController {

    @Autowired
    private ResourceMapper resourceMapper;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private QiniuStorageService qiniuStorageService;

    @Operation(summary = "文件上传")
    @PostMapping("/upload")
    public Result<String> upload(@RequestParam("file") MultipartFile file) {
        String url = qiniuStorageService.uploadFile(file);
        return Result.success(url);
    }

    @Operation(summary = "资源列表获取")
    @GetMapping("/resources")
    public Result<List<Resource>> getResources(
            @RequestParam(required = false) String stage,
            @RequestParam(required = false) String grade,
            @RequestParam(required = false) String subject) {
        
        QueryWrapper<Resource> query = new QueryWrapper<>();
        if (stage != null && !"all".equals(stage)) query.eq("stage", stage);
        if (grade != null && !"all".equals(grade)) query.eq("grade", grade);
        if (subject != null && !"all".equals(subject)) query.eq("subject", subject);
        
        query.eq("status", "approved");
        
        return Result.success(resourceMapper.selectList(query));
    }

    @Operation(summary = "积分下载")
    @PostMapping("/resources/{id}/download")
    @Transactional(rollbackFor = Exception.class)
    public Result<String> downloadResource(@PathVariable String id) {
        String userId = UserContext.getUserId();
        if (userId == null) return Result.error(401, "请先登录");

        User user = userMapper.selectById(userId);
        Resource resource = resourceMapper.selectById(id);
        if (resource == null) return Result.error("资源不存在");

        if (user.getPoints() < resource.getPoints()) {
            return Result.error(403, "积分不足");
        }

        // Deduct points
        user.setPoints(user.getPoints() - resource.getPoints());
        userMapper.updateById(user);

        // Add points to uploader (if we have uploader logic)
        User author = userMapper.selectById(resource.getAuthorId());
        if (author != null) {
            author.setPoints(author.getPoints() + resource.getPoints());
            userMapper.updateById(author);
        }

        // Add download count
        resource.setDownloads(resource.getDownloads() + 1);
        resourceMapper.updateById(resource);

        // Record tables would go here

        return Result.success(resource.getFileUrl());
    }

    @Operation(summary = "上传资源信息")
    @PostMapping("/resources")
    public Result<?> createResource(@RequestBody Resource resource) {
        String userId = UserContext.getUserId();
        User user = userMapper.selectById(userId);
        
        resource.setId("res" + UUID.randomUUID().toString().replace("-", "").substring(0, 10));
        resource.setAuthorId(userId);
        resource.setAuthorName(user.getUsername());
        resource.setStatus("pending");
        resource.setDownloads(0);
        resource.setViews(0);
        
        resourceMapper.insert(resource);
        return Result.success(resource);
    }
}
