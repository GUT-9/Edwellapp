package com.xueyuanhui.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.xueyuanhui.common.JwtUtils;
import com.xueyuanhui.common.Result;
import com.xueyuanhui.entity.User;
import com.xueyuanhui.mapper.UserMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
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
            user.setUsername(phone);
            user.setPassword("123456"); // Encrypt in real scenario
            user.setPoints(100);
            user.setRole("student");
            userMapper.insert(user);
        }

        String token = jwtUtils.generateToken(user.getId(), user.getUsername());
        Map<String, Object> res = new HashMap<>();
        res.put("token", token);
        res.put("user", user);
        return Result.success(res);
    }
}
