-- 1. 创建用户表
CREATE TABLE IF NOT EXISTS `user` (
  `id` varchar(64) NOT NULL PRIMARY KEY,
  `username` varchar(50) NOT NULL COMMENT '手机号',
  `password` varchar(128) DEFAULT NULL COMMENT '密码',
  `points` int(11) DEFAULT '100' COMMENT '积分',
  `role` varchar(20) DEFAULT 'student' COMMENT '角色: student/admin',
  `grade` varchar(20) DEFAULT '未设置' COMMENT '年级',
  `avatar_url` varchar(500) DEFAULT NULL COMMENT '头像',
  `vip_status` tinyint(1) DEFAULT '0' COMMENT 'VIP状态',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. 创建资源表
CREATE TABLE IF NOT EXISTS `resource` (
  `id` varchar(64) NOT NULL PRIMARY KEY,
  `title` varchar(200) NOT NULL COMMENT '资源标题',
  `description` text COMMENT '资源描述',
  `stage` varchar(50) DEFAULT NULL COMMENT '学段',
  `grade` varchar(50) DEFAULT NULL COMMENT '年级',
  `subject` varchar(50) DEFAULT NULL COMMENT '学科',
  `file_type` varchar(20) DEFAULT NULL COMMENT '文件类型',
  `file_url` varchar(500) DEFAULT NULL COMMENT '文件下载地址',
  `cover_url` varchar(500) DEFAULT NULL COMMENT '封面地址',
  `points` int(11) DEFAULT '0' COMMENT '下载所需积分',
  `author_id` varchar(64) DEFAULT NULL COMMENT '上传者ID',
  `author_name` varchar(100) DEFAULT NULL COMMENT '上传者昵称',
  `status` varchar(20) DEFAULT 'pending' COMMENT '状态: pending/approved/rejected',
  `reject_reason` varchar(255) DEFAULT NULL COMMENT '驳回原因',
  `views` int(11) DEFAULT '0' COMMENT '浏览量',
  `downloads` int(11) DEFAULT '0' COMMENT '下载量',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. 创建下载记录表
CREATE TABLE IF NOT EXISTS `download_record` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` varchar(64) NOT NULL,
  `resource_id` varchar(64) NOT NULL,
  `cost_points` int(11) DEFAULT '0' COMMENT '消耗积分',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. 创建收藏表
CREATE TABLE IF NOT EXISTS `favorite` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` varchar(64) NOT NULL,
  `resource_id` varchar(64) NOT NULL,
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. 创建积分明细表
CREATE TABLE IF NOT EXISTS `point_record` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` varchar(64) NOT NULL,
  `amount` int(11) NOT NULL COMMENT '变动金额(+/-)',
  `type` varchar(50) NOT NULL COMMENT '类型: upload_reward/download_cost等',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
