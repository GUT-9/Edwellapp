package com.xueyuanhui.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.util.Date;

@Data
@TableName("resource")
public class Resource {
    @TableId
    private String id;
    private String title;
    private String stage;
    private String grade;
    private String subject;
    private String fileType;
    private String fileUrl;
    private String coverUrl;
    private Integer points;
    private Integer downloads;
    private Integer views;
    private String status;
    private String rejectReason;
    private String authorId;
    private String authorName;
    private String description;
    private Date createTime;
    private Date updateTime;
}
