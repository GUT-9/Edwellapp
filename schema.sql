CREATE DATABASE IF NOT EXISTS xueyuanhui DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE xueyuanhui;

-- 用户表
CREATE TABLE `user` (
  `id` varchar(64) NOT NULL COMMENT '用户ID',
  `username` varchar(64) NOT NULL COMMENT '用户名/手机号',
  `password` varchar(255) NOT NULL COMMENT '加密密码',
  `avatar_url` varchar(500) DEFAULT NULL COMMENT '头像',
  `points` int NOT NULL DEFAULT 0 COMMENT '积分余额',
  `role` varchar(20) NOT NULL DEFAULT 'student' COMMENT '角色: student, teacher, admin',
  `grade` varchar(50) DEFAULT NULL COMMENT '年级',
  `vip_status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否VIP',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 资源表
CREATE TABLE `resource` (
  `id` varchar(64) NOT NULL COMMENT '资源ID',
  `title` varchar(200) NOT NULL COMMENT '资源标题',
  `stage` varchar(20) NOT NULL COMMENT '学段: primary, middle, high',
  `grade` varchar(20) NOT NULL COMMENT '年级',
  `subject` varchar(50) NOT NULL COMMENT '学科',
  `file_type` varchar(20) NOT NULL COMMENT '文件类型(PDF, MP4, PPT等)',
  `file_url` varchar(500) NOT NULL COMMENT '真实下载地址(七牛云URL)',
  `cover_url` varchar(500) DEFAULT NULL COMMENT '封面图URL',
  `points` int NOT NULL DEFAULT 0 COMMENT '下载所需积分',
  `downloads` int NOT NULL DEFAULT 0 COMMENT '下载次数',
  `views` int NOT NULL DEFAULT 0 COMMENT '浏览次数',
  `status` varchar(20) NOT NULL DEFAULT 'pending' COMMENT '状态: pending, approved, rejected',
  `reject_reason` varchar(255) DEFAULT NULL COMMENT '驳回原因',
  `author_id` varchar(64) NOT NULL COMMENT '上传者ID',
  `author_name` varchar(64) NOT NULL COMMENT '上传者姓名',
  `description` text COMMENT '资源描述',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_author_id` (`author_id`),
  KEY `idx_stage_grade_subject` (`stage`, `grade`, `subject`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='资源表';

-- 下载记录表
CREATE TABLE `download_record` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` varchar(64) NOT NULL COMMENT '用户ID',
  `resource_id` varchar(64) NOT NULL COMMENT '资源ID',
  `cost_points` int NOT NULL DEFAULT 0 COMMENT '花费积分',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '下载时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_resource_id` (`resource_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='下载记录表';

-- 积分记录表
CREATE TABLE `point_record` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` varchar(64) NOT NULL COMMENT '用户ID',
  `amount` int NOT NULL COMMENT '积分变动数值(正负)',
  `type` varchar(50) NOT NULL COMMENT '变动类型(upload_reward, download_cost, download_income等)',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '变动时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='积分变动明细表';

-- 收藏表
CREATE TABLE `favorite` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` varchar(64) NOT NULL COMMENT '用户ID',
  `resource_id` varchar(64) NOT NULL COMMENT '资源ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '收藏时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_resource` (`user_id`, `resource_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户收藏表';
