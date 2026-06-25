package com.xueyuanhui.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.xueyuanhui.common.Result;
import com.xueyuanhui.common.UserContext;
import com.xueyuanhui.entity.Resource;
import com.xueyuanhui.entity.User;
import com.xueyuanhui.entity.DownloadRecord;
import com.xueyuanhui.entity.PointRecord;
import com.xueyuanhui.entity.Favorite;
import com.xueyuanhui.mapper.ResourceMapper;
import com.xueyuanhui.mapper.UserMapper;
import com.xueyuanhui.mapper.DownloadRecordMapper;
import com.xueyuanhui.mapper.PointRecordMapper;
import com.xueyuanhui.mapper.FavoriteMapper;
import com.xueyuanhui.service.QiniuStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.Map;
import java.util.HashMap;
import java.util.Arrays;

@Tag(name = "资源模块")
@RestController
@RequestMapping("/api")
public class ResourceController {

    @Autowired
    private ResourceMapper resourceMapper;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private DownloadRecordMapper downloadRecordMapper;

    @Autowired
    private PointRecordMapper pointRecordMapper;

    @Autowired
    private FavoriteMapper favoriteMapper;

    @Autowired
    private QiniuStorageService qiniuStorageService;

    @Operation(summary = "文件上传")
    @PostMapping("/upload")
    public Result<String> upload(@RequestParam("file") MultipartFile file) {
        String url = qiniuStorageService.uploadFile(file);
        return Result.success(url);
    }

    @Operation(summary = "获取支持的学科列表")
    @GetMapping("/subjects")
    public Result<Map<String, List<String>>> getSubjects() {
        Map<String, List<String>> subjects = new HashMap<>();
        subjects.put("primary", Arrays.asList("语文", "数学", "英语", "科学", "道德与法治", "综合"));
        subjects.put("middle", Arrays.asList("语文", "数学", "英语", "物理", "化学", "生物", "历史", "地理", "道德与法治", "综合"));
        subjects.put("high", Arrays.asList("语文", "数学", "英语", "物理", "化学", "生物", "历史", "地理", "政治", "综合"));
        return Result.success(subjects);
    }

    @Operation(summary = "获取支持的阶段列表")
    @GetMapping("/stages")
    public Result<List<Map<String, String>>> getStages() {
        List<Map<String, String>> stages = Arrays.asList(
            Map.of("id", "primary", "name", "小学"),
            Map.of("id", "middle", "name", "初中"),
            Map.of("id", "high", "name", "高中")
        );
        return Result.success(stages);
    }

    @Operation(summary = "获取阶段对应的年级列表")
    @GetMapping("/grades")
    public Result<Map<String, List<String>>> getGrades() {
        Map<String, List<String>> grades = new HashMap<>();
        grades.put("primary", Arrays.asList("一年级", "二年级", "三年级", "四年级", "五年级", "六年级", "小学全学段"));
        grades.put("middle", Arrays.asList("七年级", "八年级", "九年级", "中考复习", "竞赛", "初中全学段"));
        grades.put("high", Arrays.asList("高一", "高二", "高三", "高考复习", "竞赛", "高中全学段"));
        return Result.success(grades);
    }

    @Operation(summary = "资源列表获取")
    @GetMapping("/resources")
    public Result<List<Resource>> getResources(
            @RequestParam(required = false) String stage,
            @RequestParam(required = false) String grade,
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String query) {
        
        QueryWrapper<Resource> wrapper = new QueryWrapper<>();
        if (stage != null && !"all".equals(stage)) wrapper.eq("stage", stage);
        if (grade != null && !"all".equals(grade)) wrapper.eq("grade", grade);
        if (subject != null && !"all".equals(subject)) wrapper.eq("subject", subject);
        if (query != null && !query.trim().isEmpty()) {
            wrapper.and(w -> w.like("title", query).or().like("description", query));
        }
        
        wrapper.eq("status", "approved");
        wrapper.orderByDesc("create_time");
        
        return Result.success(resourceMapper.selectList(wrapper));
    }

    @Operation(summary = "获取资源详情")
    @GetMapping("/resources/{id}")
    @Transactional(rollbackFor = Exception.class)
    public Result<Resource> getResourceById(@PathVariable String id) {
        Resource resource = resourceMapper.selectById(id);
        if (resource == null) {
            return Result.error("资源不存在");
        }
        // Increment views
        resource.setViews(resource.getViews() + 1);
        resourceMapper.updateById(resource);
        return Result.success(resource);
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

        // Check if already downloaded
        QueryWrapper<DownloadRecord> recordQuery = new QueryWrapper<DownloadRecord>()
                .eq("user_id", userId)
                .eq("resource_id", id);
        Long recordCount = downloadRecordMapper.selectCount(recordQuery);

        if (recordCount == 0) {
            // Check points
            if (user.getPoints() < resource.getPoints()) {
                return Result.error(403, "积分不足");
            }

            // Deduct points from downloader
            user.setPoints(user.getPoints() - resource.getPoints());
            userMapper.updateById(user);

            // Record point deduction
            PointRecord deductRecord = new PointRecord();
            deductRecord.setUserId(userId);
            deductRecord.setAmount(-resource.getPoints());
            deductRecord.setType("download_cost");
            deductRecord.setDescription("下载资源《" + resource.getTitle() + "》消耗积分");
            deductRecord.setCreateTime(new Date());
            pointRecordMapper.insert(deductRecord);

            // Add points to uploader
            User author = userMapper.selectById(resource.getAuthorId());
            if (author != null) {
                author.setPoints(author.getPoints() + resource.getPoints());
                userMapper.updateById(author);

                // Record point income
                PointRecord incomeRecord = new PointRecord();
                incomeRecord.setUserId(resource.getAuthorId());
                incomeRecord.setAmount(resource.getPoints());
                incomeRecord.setType("download_income");
                incomeRecord.setDescription("用户下载您的资源《" + resource.getTitle() + "》获得积分");
                incomeRecord.setCreateTime(new Date());
                pointRecordMapper.insert(incomeRecord);
            }

            // Write Download Record
            DownloadRecord downloadRecord = new DownloadRecord();
            downloadRecord.setUserId(userId);
            downloadRecord.setResourceId(id);
            downloadRecord.setCostPoints(resource.getPoints());
            downloadRecord.setCreateTime(new Date());
            downloadRecordMapper.insert(downloadRecord);

            // Add download count
            resource.setDownloads(resource.getDownloads() + 1);
            resourceMapper.updateById(resource);
        }

        return Result.success(resource.getFileUrl());
    }

    @Operation(summary = "收藏/取消收藏")
    @PostMapping("/resources/{id}/favorite")
    @Transactional(rollbackFor = Exception.class)
    public Result<?> toggleFavorite(@PathVariable String id) {
        String userId = UserContext.getUserId();
        if (userId == null) return Result.error(401, "请先登录");

        QueryWrapper<Favorite> query = new QueryWrapper<Favorite>()
                .eq("user_id", userId)
                .eq("resource_id", id);
        Favorite favorite = favoriteMapper.selectOne(query);

        if (favorite != null) {
            // Unfavorite
            favoriteMapper.deleteById(favorite.getId());
            return Result.success("取消收藏成功");
        } else {
            // Favorite
            Favorite fav = new Favorite();
            fav.setUserId(userId);
            fav.setResourceId(id);
            fav.setCreateTime(new Date());
            favoriteMapper.insert(fav);
            return Result.success("收藏成功");
        }
    }

    @Operation(summary = "上传资源信息")
    @PostMapping("/resources")
    @Transactional(rollbackFor = Exception.class)
    public Result<?> createResource(@RequestBody Resource resource) {
        String userId = UserContext.getUserId();
        if (userId == null) return Result.error(401, "请先登录");
        User user = userMapper.selectById(userId);
        
        resource.setId("res" + UUID.randomUUID().toString().replace("-", "").substring(0, 10));
        resource.setAuthorId(userId);
        resource.setAuthorName(user.getUsername());
        resource.setStatus("pending");
        resource.setDownloads(0);
        resource.setViews(0);
        
        resourceMapper.insert(resource);

        // Reward user with 20 points for contributing resource
        user.setPoints(user.getPoints() + 20);
        userMapper.updateById(user);

        // Record point reward
        PointRecord rewardRecord = new PointRecord();
        rewardRecord.setUserId(userId);
        rewardRecord.setAmount(20);
        rewardRecord.setType("upload_reward");
        rewardRecord.setDescription("贡献资源《" + resource.getTitle() + "》获得奖励积分");
        rewardRecord.setCreateTime(new Date());
        pointRecordMapper.insert(rewardRecord);

        return Result.success(resource);
    }

    @Operation(summary = "删除资源")
    @DeleteMapping("/resources/{id}")
    @Transactional(rollbackFor = Exception.class)
    public Result<?> deleteResource(@PathVariable String id) {
        String userId = UserContext.getUserId();
        if (userId == null) return Result.error(401, "请先登录");
        
        User user = userMapper.selectById(userId);
        if (user == null) return Result.error(401, "用户不存在");

        Resource resource = resourceMapper.selectById(id);
        if (resource == null) return Result.error("资源不存在");

        // 只有管理员或者资源上传者可以删除
        if (!"admin".equals(user.getRole()) && !userId.equals(resource.getAuthorId())) {
            return Result.error(403, "没有权限删除此资源");
        }

        // 删除相关记录
        favoriteMapper.delete(new QueryWrapper<Favorite>().eq("resource_id", id));
        downloadRecordMapper.delete(new QueryWrapper<DownloadRecord>().eq("resource_id", id));
        
        // 删除资源
        resourceMapper.deleteById(id);

        return Result.success("删除成功");
    }

    @Operation(summary = "获取用户上传的全部资源(包括审核中和已驳回)")
    @GetMapping("/resources/my-uploads")
    public Result<List<Resource>> getMyUploads() {
        String userId = UserContext.getUserId();
        if (userId == null) return Result.error(401, "请先登录");

        QueryWrapper<Resource> query = new QueryWrapper<>();
        query.eq("author_id", userId);
        query.orderByDesc("create_time");
        
        return Result.success(resourceMapper.selectList(query));
    }

    // --- ADMIN ENDPOINTS ---

    @Operation(summary = "管理员获取全部资源列表(包含未审核)")
    @GetMapping("/admin/resources")
    public Result<List<Resource>> getAdminResources(
            @RequestParam(required = false) String status) {
        String userId = UserContext.getUserId();
        if (userId == null) return Result.error(401, "请先登录");
        User user = userMapper.selectById(userId);
        if (!"admin".equals(user.getRole())) {
            return Result.error(403, "没有管理员权限");
        }

        QueryWrapper<Resource> query = new QueryWrapper<>();
        if (status != null && !"all".equals(status)) {
            query.eq("status", status);
        }
        query.orderByDesc("create_time");

        return Result.success(resourceMapper.selectList(query));
    }

    @Operation(summary = "管理员同意并发布资源")
    @PostMapping("/admin/resources/{id}/approve")
    @Transactional(rollbackFor = Exception.class)
    public Result<?> approveResource(@PathVariable String id) {
        String userId = UserContext.getUserId();
        if (userId == null) return Result.error(401, "请先登录");
        User user = userMapper.selectById(userId);
        if (!"admin".equals(user.getRole())) {
            return Result.error(403, "没有管理员权限");
        }

        Resource resource = resourceMapper.selectById(id);
        if (resource == null) {
            return Result.error("资源不存在");
        }

        resource.setStatus("approved");
        resourceMapper.updateById(resource);
        return Result.success(resource);
    }

    @Operation(summary = "管理员驳回资源")
    @PostMapping("/admin/resources/{id}/reject")
    @Transactional(rollbackFor = Exception.class)
    public Result<?> rejectResource(@PathVariable String id, @RequestBody Map<String, String> body) {
        String userId = UserContext.getUserId();
        if (userId == null) return Result.error(401, "请先登录");
        User user = userMapper.selectById(userId);
        if (!"admin".equals(user.getRole())) {
            return Result.error(403, "没有管理员权限");
        }

        Resource resource = resourceMapper.selectById(id);
        if (resource == null) {
            return Result.error("资源不存在");
        }

        String reason = body.get("reason");
        resource.setStatus("rejected");
        resource.setRejectReason(reason != null ? reason : "内容不合规");
        resourceMapper.updateById(resource);
        return Result.success(resource);
    }
}
