package com.xueyuanhui.config;

import com.xueyuanhui.entity.Resource;
import com.xueyuanhui.entity.User;
import com.xueyuanhui.mapper.ResourceMapper;
import com.xueyuanhui.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private ResourceMapper resourceMapper;

    @Override
    public void run(String... args) throws Exception {
        // 1. Initialize Users
        if (userMapper.selectCount(null) == 0) {
            // Standard Student User
            User student = new User();
            student.setId("u1");
            student.setUsername("13800138000");
            student.setPassword("123456");
            student.setPoints(1250);
            student.setRole("student");
            student.setGrade("高二");
            student.setAvatarUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuARBMS77J_hxhMvEqhR7sTZKQMjeBuw40YkG5q9ugL1HBLZLcNh9XHPp-vgDWCFHaKBxluJ5bzT0-w5tFx07YaXQcXskcXcWmIYGooiMejXd-XJjUDnoVBDyC984acbWwHOGsEJPf9q82JunHFY6VqpMiH-B1hbwpQev5jvtlVuG_wAykFoGG2CH-Cr3m-R9kaQsRaRDfysK4WlhH2xrlem8_jsBn_UsEjSFDkf-t4d7T2bMKE1tBRf0M9LjYrTN8UCkSot4LLqo8E");
            student.setVipStatus(true);
            student.setCreateTime(new Date());
            student.setUpdateTime(new Date());
            userMapper.insert(student);

            // Administrator User
            User admin = new User();
            admin.setId("u2");
            admin.setUsername("admin");
            admin.setPassword("admin");
            admin.setPoints(99999);
            admin.setRole("admin");
            admin.setGrade("未设置");
            admin.setAvatarUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuARBMS77J_hxhMvEqhR7sTZKQMjeBuw40YkG5q9ugL1HBLZLcNh9XHPp-vgDWCFHaKBxluJ5bzT0-w5tFx07YaXQcXskcXcWmIYGooiMejXd-XJjUDnoVBDyC984acbWwHOGsEJPf9q82JunHFY6VqpMiH-B1hbwpQev5jvtlVuG_wAykFoGG2CH-Cr3m-R9kaQsRaRDfysK4WlhH2xrlem8_jsBn_UsEjSFDkf-t4d7T2bMKE1tBRf0M9LjYrTN8UCkSot4LLqo8E");
            admin.setVipStatus(true);
            admin.setCreateTime(new Date());
            admin.setUpdateTime(new Date());
            userMapper.insert(admin);
        }

        // 2. Initialize Resources
        if (resourceMapper.selectCount(null) == 0) {
            Resource r1 = new Resource();
            r1.setId("1");
            r1.setTitle("高二数学必修一：函数与导数综合复习讲义");
            r1.setStage("high");
            r1.setGrade("高二");
            r1.setSubject("数学");
            r1.setFileType("PDF");
            r1.setFileUrl("https://static.qiniu.com/mock-math.pdf");
            r1.setCoverUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuBnCVnZJFfEd7kHFNFAKDRq7NqizLHP4KgWUfGh3hhhkx-D3025gFcxNLzrSw5axM8Q1XtF3PBHeJVUdwE3XzklMmhLRq1aKxzoA-oqTcUcVnxKy9IW232d1UodH4X_eEfVkCl13pKxbX_YmnI_87xl_g4TLUOS3OOFs6nNoHDDD1v2o7vO7OrmevoJrSHzRlvTPO61pDMlXQtCZc_YhoA87sXDpU3QEDmm5kRFoC6xoARYvWweFUC7oZYGxJoY1oOQcpp4G2vbbxs");
            r1.setPoints(10);
            r1.setDownloads(1250);
            r1.setViews(3400);
            r1.setStatus("approved");
            r1.setAuthorId("u2");
            r1.setAuthorName("李老师");
            r1.setDescription("包含核心考点和历年真题解析。");
            r1.setCreateTime(new Date());
            r1.setUpdateTime(new Date());
            resourceMapper.insert(r1);

            Resource r2 = new Resource();
            r2.setId("2");
            r2.setTitle("初三物理：光学折射与反射核心考点精讲视频");
            r2.setStage("middle");
            r2.setGrade("九年级");
            r2.setSubject("物理");
            r2.setFileType("MP4");
            r2.setFileUrl("https://static.qiniu.com/mock-physics.mp4");
            r2.setCoverUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuDCFacj-jlLiGGC9_AtxHAuR9CHASm6YtZnryASj9wcf42xBmh9OjFnizNKAjafu8XgCGVmerH_jLBew2fpBXuH_vWUclW6Rykvx5wz-JZR25tPMW5zRz31U76yDMj4f2NE8GWks97Sx7RtG-I7hMJnZYKhhN-TlwUvH2tkfNHb_Jr3oi3e6_Ht2XnydNZjb1U5qJGlH_FFkmScExk4AP7s5D_FyLg7oFq1s0AV79u4WQTuNhRk5ODwvp1O9FMaFQcOwTLXY6vCj8c");
            r2.setPoints(5);
            r2.setDownloads(856);
            r2.setViews(1200);
            r2.setStatus("approved");
            r2.setAuthorId("u2");
            r2.setAuthorName("王老师");
            r2.setDescription("光学核心考点。");
            r2.setCreateTime(new Date());
            r2.setUpdateTime(new Date());
            resourceMapper.insert(r2);

            Resource r3 = new Resource();
            r3.setId("3");
            r3.setTitle("高一英语必修二单元词汇测试卷及答案详解");
            r3.setStage("high");
            r3.setGrade("高一");
            r3.setSubject("英语");
            r3.setFileType("DOCX");
            r3.setFileUrl("https://static.qiniu.com/mock-english.docx");
            r3.setCoverUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuBv5GLpxrA2pBCvxofL03mMT1jaErwDDK3_UbG8Ok96gl3oeyDi5VKTydm4aEd6EX_SVr_M6WX-0_6mMCSnFwxoLlIWp3yfLxv10w1OBf6sdN9rgRaHK2coptlU-sGb7XJ_JKssFARF8kmJ3cnWVZU11Np_OU3Ob8TZ9SGNYc-hvXVo1rCXoborSAVGGSbXs9gJKvrVEJtVOGhPb3s3j2UIzXKZ6wG4HcICgT70Cvzp4UMfqA5m5nhltMY7nvz_MdlNXj6KAQAVQtQ");
            r3.setPoints(0);
            r3.setDownloads(2100);
            r3.setViews(4200);
            r3.setStatus("approved");
            r3.setAuthorId("u2");
            r3.setAuthorName("赵老师");
            r3.setDescription("包含详解。");
            r3.setCreateTime(new Date());
            r3.setUpdateTime(new Date());
            resourceMapper.insert(r3);

            Resource r4 = new Resource();
            r4.setId("4");
            r4.setTitle("初二语文：文言文阅读理解答题技巧课件");
            r4.setStage("middle");
            r4.setGrade("八年级");
            r4.setSubject("语文");
            r4.setFileType("PPT");
            r4.setFileUrl("https://static.qiniu.com/mock-chinese.ppt");
            r4.setCoverUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuCcRA1W8Myvm56kfeWAYmaIYyzN15wgJ8H5QM38Rcii0N_04orXxF3s0ETw93v74cnIvIjanxIoO3_U9CxNZpyRORG7lBhoAmEg_WaGwa8U65bEBGYaaie0TPcPkI5g7QIGBGoPLmM8VVVnsfHNMYLTbCHLjG53mOvdDMmaYskB11rX9OMHHnMUs32glk2HuAHj1hB5zNHEL2zDY5z_WpWMQKlV_1vT7NAfshpZwqkisdVcD4mSoVac9KIUUEFZuAm6LYS-5eB03lY");
            r4.setPoints(10);
            r4.setDownloads(432);
            r4.setViews(800);
            r4.setStatus("approved");
            r4.setAuthorId("u2");
            r4.setAuthorName("孙老师");
            r4.setDescription("文言文技巧。");
            r4.setCreateTime(new Date());
            r4.setUpdateTime(new Date());
            resourceMapper.insert(r4);

            Resource r5 = new Resource();
            r5.setId("5");
            r5.setTitle("人教版初二物理下册：牛顿第一定律精讲与实验演示");
            r5.setStage("middle");
            r5.setGrade("八年级");
            r5.setSubject("物理");
            r5.setFileType("MP4");
            r5.setFileUrl("https://static.qiniu.com/mock-newton.mp4");
            r5.setCoverUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuBFwOCedqHslA64b14zmZqhE3c53Pgtb86yFXkwFalWvDk3psrJwDZnwZdSEpi82ZQuhdnT6qCfjBdIiw1ZmfIyLhuzl4e4ki66dgnVB5Zn8k4fGbaUsqYwBdjGQV32JCUh01FVQDRjYskbuuHC0-U-Dusg3_6dfruKrxNhcI6pSJCLF3BsSoXV4gY9XXuPUwQmYHhMvPXhxbhw_B_KSWO0DOL0LRrk9hxj5ka9tFmzKrpiMmEr26ArX9mU7vVT2A0A50DMfkaM5N8");
            r5.setPoints(10);
            r5.setDownloads(856);
            r5.setViews(1250);
            r5.setStatus("approved");
            r5.setAuthorId("u2");
            r5.setAuthorName("王老师");
            r5.setDescription("牛顿第一定律。");
            r5.setCreateTime(new Date());
            r5.setUpdateTime(new Date());
            resourceMapper.insert(r5);
        }
    }
}
