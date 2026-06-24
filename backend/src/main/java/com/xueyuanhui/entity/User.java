package com.xueyuanhui.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.util.Date;

@Data
@TableName("user")
public class User {
    @TableId
    private String id;
    private String username;
    private String password;
    private String avatarUrl;
    private Integer points;
    private String role;
    private String grade;
    private Boolean vipStatus;
    private Date createTime;
    private Date updateTime;
}
