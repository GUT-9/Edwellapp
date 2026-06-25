package com.xueyuanhui.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("====== Checking Database Mock Data ======");
        
        // Insert Users
        String insertAdmin = "INSERT IGNORE INTO `user` (id, username, password, role, points, avatar_url, create_time) VALUES ('u-admin-1', '13800000000', '123456', 'admin', 9999, 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', NOW())";
        String insertTeacher = "INSERT IGNORE INTO `user` (id, username, password, role, points, avatar_url, create_time) VALUES ('u-test-1', '13900000000', '123456', 'teacher', 100, 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher', NOW())";
        jdbcTemplate.execute(insertAdmin);
        jdbcTemplate.execute(insertTeacher);

        // Insert Resources
        Long count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM resource", Long.class);
        if (count != null && count == 0) {
            String[] resources = {
                "INSERT IGNORE INTO `resource` (id, title, description, file_url, cover_url, file_type, stage, grade, subject, author_id, author_name, points, downloads, views, status, create_time) VALUES ('res-mock-1', '小学语文三年级下册第一单元教案', '包含完整的PPT和教案设计', 'http://example.com/mock.pdf', '', 'PDF', 'primary', '三年级', '语文', 'u-admin-1', '系统管理员', 5, 120, 350, 'approved', NOW())",
                "INSERT IGNORE INTO `resource` (id, title, description, file_url, cover_url, file_type, stage, grade, subject, author_id, author_name, points, downloads, views, status, create_time) VALUES ('res-mock-2', '初中数学中考真题汇编', '2020-2023年中考数学真题', 'http://example.com/mock.pdf', '', 'WORD', 'middle', '九年级', '数学', 'u-admin-1', '系统管理员', 10, 890, 1200, 'approved', NOW())",
                "INSERT IGNORE INTO `resource` (id, title, description, file_url, cover_url, file_type, stage, grade, subject, author_id, author_name, points, downloads, views, status, create_time) VALUES ('res-mock-3', '高中物理必修一知识点总结', '牛顿运动定律核心归纳', 'http://example.com/mock.pdf', '', 'PPT', 'high', '高一', '物理', 'u-test-1', '测试老师', 0, 45, 110, 'approved', NOW())",
                "INSERT IGNORE INTO `resource` (id, title, description, file_url, cover_url, file_type, stage, grade, subject, author_id, author_name, points, downloads, views, status, create_time) VALUES ('res-mock-4', '小学英语启蒙儿歌视频合集', '适合一二年级的英语启蒙教学素材', 'http://example.com/mock.mp4', '', 'VIDEO', 'primary', '一年级', '英语', 'u-admin-1', '系统管理员', 20, 320, 890, 'approved', NOW())",
                "INSERT IGNORE INTO `resource` (id, title, description, file_url, cover_url, file_type, stage, grade, subject, author_id, author_name, points, downloads, views, status, create_time) VALUES ('res-mock-5', '高中化学实验演示视频大全', '高一高二核心化学实验视频记录', 'http://example.com/mock.mp4', '', 'VIDEO', 'high', '高二', '化学', 'u-test-1', '测试老师', 15, 60, 200, 'pending', NOW())"
            };
            for (String r : resources) {
                jdbcTemplate.execute(r);
            }
        }
        
        System.out.println("====== Mock Data Initialized Successfully ======");
    }
}
