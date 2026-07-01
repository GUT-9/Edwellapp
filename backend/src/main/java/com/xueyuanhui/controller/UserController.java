package com.xueyuanhui.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.xueyuanhui.common.JwtUtils;
import com.xueyuanhui.common.Result;
import com.xueyuanhui.entity.User;
import com.xueyuanhui.mapper.UserMapper;
import com.xueyuanhui.mapper.FavoriteMapper;
import com.xueyuanhui.mapper.DownloadRecordMapper;
import com.xueyuanhui.mapper.ResourceMapper;
import com.xueyuanhui.common.UserContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Tag(name = "用户模块")
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private FavoriteMapper favoriteMapper;

    @Autowired
    private com.xueyuanhui.service.QiniuStorageService qiniuStorageService;

    @Autowired
    private DownloadRecordMapper downloadRecordMapper;

    @Autowired
    private ResourceMapper resourceMapper;

    @jakarta.annotation.PostConstruct
    public void initSuperAdmin() {
        try {
            User admin = userMapper.selectOne(new QueryWrapper<User>().eq("phone", "15003354256").last("limit 1"));
            if (admin == null) {
                admin = new User();
                admin.setId("u" + UUID.randomUUID().toString().replace("-", "").substring(0, 10));
                admin.setUsername("超级管理员");
                admin.setPhone("15003354256");
                admin.setPassword("123456");
                admin.setRole("admin");
                admin.setPoints(9999);
                admin.setGrade("全学段");
                userMapper.insert(admin);
            } else {
                admin.setPassword("123456");
                admin.setRole("admin");
                userMapper.updateById(admin);
            }
        } catch (Exception e) {
            System.err.println("Init super admin failed: " + e.getMessage());
        }
    }

    @Operation(summary = "手机号密码登录或注册")
    @PostMapping("/login")
    public Result<?> login(@RequestBody Map<String, String> body) {
        String phone = body.get("phone");
        String code = body.get("code"); // Password
        if (phone == null || phone.isEmpty()) {
            return Result.error("手机号不能为空");
        }

        // Using backwards compatibility for old data where phone was saved in username
        User user = userMapper.selectOne(new QueryWrapper<User>().and(w -> w.eq("phone", phone).or().eq("username", phone)).last("limit 1"));
        if (user == null) {
            user = new User();
            user.setId("u" + UUID.randomUUID().toString().replace("-", "").substring(0, 10));
            user.setPhone(phone);
            user.setUsername("用户_" + phone.substring(7));
            user.setPoints(100);
            user.setGrade("未设置");
            user.setAvatarUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuARBMS77J_hxhMvEqhR7sTZKQMjeBuw40YkG5q9ugL1HBLZLcNh9XHPp-vgDWCFHaKBxluJ5bzT0-w5tFx07YaXQcXskcXcWmIYGooiMejXd-XJjUDnoVBDyC984acbWwHOGsEJPf9q82JunHFY6VqpMiH-B1hbwpQev5jvtlVuG_wAykFoGG2CH-Cr3m-R9kaQsRaRDfysK4WlhH2xrlem8_jsBn_UsEjSFDkf-t4d7T2bMKE1tBRf0M9LjYrTN8UCkSot4LLqo8E");
            user.setVipStatus(false);
            user.setRole("student");
            user.setPassword(code != null && !code.isEmpty() ? code : "123456");
            userMapper.insert(user);
        } else {
            // Check password
            if (user.getPassword() != null && !user.getPassword().equals(code)) {
                return Result.error("密码错误");
            }
            if (user.getPhone() == null) {
                user.setPhone(phone); // migrate old user
                userMapper.updateById(user);
            }
        }

        String token = jwtUtils.generateToken(user.getId(), user.getUsername());
        Map<String, Object> res = new HashMap<>();
        res.put("token", token);
        res.put("user", getUserProfileMap(user));
        return Result.success(res);
    }

    @Operation(summary = "微信一键登录(免手机号)")
    @PostMapping("/wx-login")
    public Result<?> wxLogin(HttpServletRequest request, @RequestBody Map<String, String> body) {
        // 微信云托管会自动在 Header 中注入 X-WX-OPENID
        String openid = request.getHeader("x-wx-openid");
        
        // 如果本地调试没有 Header，允许前端传入测试 openid
        if (openid == null || openid.isEmpty()) {
            openid = body.get("openid");
        }

        if (openid == null || openid.isEmpty()) {
            return Result.error("未获取到微信OpenID，请确保在微信云托管环境运行或传入测试ID");
        }

        User user = userMapper.selectOne(new QueryWrapper<User>().eq("openid", openid).last("limit 1"));
        if (user == null) {
            user = new User();
            user.setId("u" + UUID.randomUUID().toString().replace("-", "").substring(0, 10));
            user.setOpenid(openid);
            user.setUsername("微信用户_" + user.getId().substring(1, 7));
            user.setPoints(100);
            user.setGrade("未设置");
            user.setAvatarUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuARBMS77J_hxhMvEqhR7sTZKQMjeBuw40YkG5q9ugL1HBLZLcNh9XHPp-vgDWCFHaKBxluJ5bzT0-w5tFx07YaXQcXskcXcWmIYGooiMejXd-XJjUDnoVBDyC984acbWwHOGsEJPf9q82JunHFY6VqpMiH-B1hbwpQev5jvtlVuG_wAykFoGG2CH-Cr3m-R9kaQsRaRDfysK4WlhH2xrlem8_jsBn_UsEjSFDkf-t4d7T2bMKE1tBRf0M9LjYrTN8UCkSot4LLqo8E");
            user.setVipStatus(false);
            user.setRole("student");
            user.setPassword(""); // WeChat users don't need a password, but DB requires it
            userMapper.insert(user);
        }

        String token = jwtUtils.generateToken(user.getId(), user.getUsername());
        Map<String, Object> res = new HashMap<>();
        res.put("token", token);
        res.put("user", getUserProfileMap(user));
        return Result.success(res);
    }

    @Operation(summary = "获取用户个人信息")
    @GetMapping("/profile")
    public Result<?> getProfile() {
        String userId = UserContext.getUserId();
        if (userId == null) {
            return Result.error(401, "请先登录");
        }
        User user = userMapper.selectById(userId);
        if (user == null) {
            return Result.error("用户不存在");
        }
        return Result.success(getUserProfileMap(user));
    }

    @Operation(summary = "更新用户个人信息")
    @PutMapping("/profile")
    public Result<?> updateProfile(@RequestBody Map<String, String> body) {
        String userId = UserContext.getUserId();
        if (userId == null) {
            return Result.error(401, "请先登录");
        }
        User user = userMapper.selectById(userId);
        if (user == null) {
            return Result.error("用户不存在");
        }

        if (body.containsKey("username") && !body.get("username").trim().isEmpty()) {
            user.setUsername(body.get("username"));
        }
        if (body.containsKey("grade")) {
            user.setGrade(body.get("grade"));
        }
        if (body.containsKey("avatarUrl")) {
            String oldAvatar = user.getAvatarUrl();
            user.setAvatarUrl(body.get("avatarUrl"));
            // Delete old avatar from Qiniu
            if (oldAvatar != null && oldAvatar.contains("oss.gut9.cn") && !oldAvatar.contains("googleusercontent.com")) {
                try {
                    qiniuStorageService.deleteFile(oldAvatar);
                } catch (Exception e) {}
            }
        }
        if (body.containsKey("phone") && !body.get("phone").trim().isEmpty()) {
            user.setPhone(body.get("phone"));
        }

        userMapper.updateById(user);
        return Result.success(getUserProfileMap(user));
    }

    @Operation(summary = "修改密码")
    @PutMapping("/password")
    public Result<?> updatePassword(@RequestBody Map<String, String> body) {
        String userId = UserContext.getUserId();
        if (userId == null) return Result.error(401, "请先登录");
        
        String oldPassword = body.get("oldPassword");
        String newPassword = body.get("newPassword");
        
        if (newPassword == null || newPassword.trim().isEmpty()) {
            return Result.error("新密码不能为空");
        }

        User user = userMapper.selectById(userId);
        if (user == null) return Result.error("用户不存在");

        if (user.getPassword() != null && !user.getPassword().isEmpty() && !user.getPassword().equals(oldPassword)) {
            return Result.error("原密码错误");
        }

        user.setPassword(newPassword);
        userMapper.updateById(user);
        return Result.success("密码修改成功");
    }

    @Operation(summary = "退出登录")
    @PostMapping("/logout")
    public Result<?> logout() {
        return Result.success("退出登录成功");
    }

    private Map<String, Object> getUserProfileMap(User user) {
        Map<String, Object> map = new HashMap<>();
        String rawPhone = user.getPhone() != null ? user.getPhone() : user.getUsername();
        String maskedPhone = null;
        if (rawPhone != null && rawPhone.matches("\\d{11}")) {
            maskedPhone = rawPhone.substring(0, 3) + "****" + rawPhone.substring(7);
        }
        
        map.put("id", user.getId());
        map.put("name", user.getUsername() != null ? user.getUsername() : (maskedPhone != null ? maskedPhone : "微信用户"));
        map.put("username", user.getUsername());
        map.put("phone", maskedPhone);
        map.put("avatarUrl", user.getAvatarUrl());
        map.put("points", user.getPoints());
        map.put("role", user.getRole());
        map.put("grade", user.getGrade());
        map.put("vipStatus", user.getVipStatus());

        // Get favorites
        List<com.xueyuanhui.entity.Favorite> favorites = favoriteMapper.selectList(
                new QueryWrapper<com.xueyuanhui.entity.Favorite>().eq("user_id", user.getId())
        );
        List<String> favoritedIds = favorites.stream().map(com.xueyuanhui.entity.Favorite::getResourceId).collect(java.util.stream.Collectors.toList());
        map.put("favoritedIds", favoritedIds);

        // Get downloads
        List<com.xueyuanhui.entity.DownloadRecord> downloads = downloadRecordMapper.selectList(
                new QueryWrapper<com.xueyuanhui.entity.DownloadRecord>().eq("user_id", user.getId())
        );
        List<String> downloadedIds = downloads.stream().map(com.xueyuanhui.entity.DownloadRecord::getResourceId).distinct().collect(java.util.stream.Collectors.toList());
        map.put("downloadedIds", downloadedIds);

        // Get uploads
        List<com.xueyuanhui.entity.Resource> uploads = resourceMapper.selectList(
                new QueryWrapper<com.xueyuanhui.entity.Resource>().eq("author_id", user.getId())
        );
        List<String> uploadedIds = uploads.stream().map(com.xueyuanhui.entity.Resource::getId).collect(java.util.stream.Collectors.toList());
        map.put("uploadedIds", uploadedIds);

        return map;
    }
}
