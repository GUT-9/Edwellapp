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
    private DownloadRecordMapper downloadRecordMapper;

    @Autowired
    private ResourceMapper resourceMapper;

    @jakarta.annotation.PostConstruct
    public void initSuperAdmin() {
        try {
            User admin = userMapper.selectOne(new QueryWrapper<User>().eq("username", "15003354256"));
            if (admin == null) {
                admin = new User();
                admin.setId("u" + UUID.randomUUID().toString().replace("-", "").substring(0, 10));
                admin.setUsername("15003354256");
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

    @Operation(summary = "用户注册或登录")
    @PostMapping("/login")
    public Result<?> login(@RequestBody Map<String, String> body) {
        String phone = body.get("phone");
        String code = body.get("code"); // Simplified validation
        if (phone == null || phone.isEmpty()) {
            return Result.error("手机号不能为空");
        }

        User user = userMapper.selectOne(new QueryWrapper<User>().eq("username", phone));
        if (user == null) {
            user = new User();
            user.setId("u" + UUID.randomUUID().toString().replace("-", "").substring(0, 10));
            user.setUsername(phone); // Save full phone number for authentication
            user.setPoints(100);
            user.setGrade("未设置");
            user.setAvatarUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuARBMS77J_hxhMvEqhR7sTZKQMjeBuw40YkG5q9ugL1HBLZLcNh9XHPp-vgDWCFHaKBxluJ5bzT0-w5tFx07YaXQcXskcXcWmIYGooiMejXd-XJjUDnoVBDyC984acbWwHOGsEJPf9q82JunHFY6VqpMiH-B1hbwpQev5jvtlVuG_wAykFoGG2CH-Cr3m-R9kaQsRaRDfysK4WlhH2xrlem8_jsBn_UsEjSFDkf-t4d7T2bMKE1tBRf0M9LjYrTN8UCkSot4LLqo8E");
            user.setVipStatus(false);

            if ("15003354256".equals(phone)) {
                user.setRole("admin");
                user.setPassword("123456");
                if (!"123456".equals(code)) {
                    return Result.error("密码错误，超级管理员初始密码为123456");
                }
            } else {
                user.setRole("student");
                user.setPassword(code != null && !code.isEmpty() ? code : "123456");
            }
            userMapper.insert(user);
        } else {
            // Validate password
            if (user.getPassword() != null && !user.getPassword().equals(code)) {
                return Result.error("密码错误");
            }
            // Enforce admin for 15003354256
            if ("15003354256".equals(phone) && !"admin".equals(user.getRole())) {
                user.setRole("admin");
                userMapper.updateById(user);
            }
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

        if (body.containsKey("username")) {
            user.setUsername(body.get("username"));
        }
        if (body.containsKey("grade")) {
            user.setGrade(body.get("grade"));
        }
        if (body.containsKey("avatarUrl")) {
            user.setAvatarUrl(body.get("avatarUrl"));
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

        if (user.getPassword() != null && !user.getPassword().equals(oldPassword)) {
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
        String rawPhone = user.getUsername();
        String maskedPhone = rawPhone;
        if (rawPhone != null && rawPhone.length() == 11) {
            maskedPhone = rawPhone.substring(0, 3) + "****" + rawPhone.substring(7);
        }
        
        map.put("id", user.getId());
        map.put("name", maskedPhone); // Map masked phone to frontend 'name'
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
