package com.xueyuanhui.controller;

import com.xueyuanhui.common.Result;
import com.xueyuanhui.common.UserContext;
import com.xueyuanhui.entity.User;
import com.xueyuanhui.mapper.UserMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Tag(name = "系统设置模块")
@RestController
@RequestMapping("/api/admin/settings")
public class SettingsController {

    @Autowired
    private UserMapper userMapper;

    // In-memory settings storage for demonstration
    private static final Map<String, Object> settings = new HashMap<>();

    static {
        settings.put("siteName", "EdWell中小学教育资源库");
        settings.put("maintenanceMode", false);
        settings.put("allowUploads", true);
        settings.put("reviewRequired", true);
        settings.put("welcomeMessage", "欢迎来到EdWell平台，海量真题与课件供您下载学习！");
    }

    private boolean isAdmin() {
        String userId = UserContext.getUserId();
        if (userId == null) return false;
        User user = userMapper.selectById(userId);
        return user != null && "admin".equals(user.getRole());
    }

    @Operation(summary = "获取系统设置")
    @GetMapping
    public Result<Map<String, Object>> getSettings() {
        if (!isAdmin()) {
            return Result.error(403, "没有管理员权限");
        }
        return Result.success(settings);
    }

    @Operation(summary = "更新系统设置")
    @PutMapping
    public Result<Map<String, Object>> updateSettings(@RequestBody Map<String, Object> newSettings) {
        if (!isAdmin()) {
            return Result.error(403, "没有管理员权限");
        }
        if (newSettings != null) {
            settings.putAll(newSettings);
        }
        return Result.success(settings);
    }
}
