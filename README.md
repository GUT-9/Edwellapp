# 🏫 EdWell | 学源汇 - 中小学教育资源聚合共享平台

[![Tech Stack](https://img.shields.io/badge/Stack-Spring%20Boot%203%20%2B%20UniApp%20(Vue3)-emerald.svg)]()
[![Platform](https://img.shields.io/badge/Platform-WeChat%20MiniProgram%20%2F%20H5-blue.svg)]()
[![License](https://img.shields.io/badge/License-MIT-purple.svg)]()

**学源汇（EdWell）** 是一款面向 K12 阶段中小学教师与学生的高性能前后端分离教育资源聚合共享平台。平台旨在解决一线教师优质原创备课课件、试卷及短视频资源“流通难、检索糙、分享无激励”的痛点，通过引入**多维级联检索**、**积分划扣与分成转账事务**、**七牛云对象存储直传**以及**Python异步多格式智能首帧截帧服务**，打造一个高效、安全、健康的教育资源共建共享生态圈。

---

## ✨ 核心业务特性

* 🔐 **微信授权与 JWT 安全鉴权体系**：支持微信小程序一键静默快捷登录与自动注册；后端采用 JJWT 构建无状态安全认证过滤，前端引入路由跳转全局锁机制，彻底防范了令牌过期时高并发 401 请求引发的页面栈爆溢出闪退。
* 🔍 **多维级联检索与瀑布流卡片**：前台基于学段（小学、初中、高中）、年级（级联高考复习/竞赛等）及专属学科提供秒级模糊过滤大厅，并采用瀑布流渲染带有智能提取封面的资源卡片。
* 💰 **积分划扣与分成结算原子事务**：支持“一次购买，永久下载”机制。扣除下载者积分与充值作者积分、生成交易账单、写入下载历史在 Spring 的 `@Transactional` 事务内原子执行，并对高频数据库操作引入悲观锁，防止超卖与数据不一致。
* ☁️ **去中心化七牛云 OSS 客户端直传**：客户端直接调取后端带有安全签名的 Token 凭证，通过 `uni.uploadFile` 直接将多媒体资源传输至七牛云存储桶，绕开应用服务器带宽中转，极大提升高并发传输性能。
* 🤖 **Python 异步智能首帧截帧封面服务**：后台 Python 定时任务扫描 pending/approved 资源，针对视频（OpenCV 截帧）、PDF（PyMuPDF 导出）和 PPTX 幻灯片（PowerPoint COM 静默转换）自动提取高清第一页作为封面，并自动回填至数据库以提供瀑布流大厅卡片呈现。
* 🐳 **云原生 Docker 容器部署**：支持轻量级 Dockerfile 镜像构建与微信云托管 native container 部署，免去公网 HTTPS 证书申请开销，实现弹性扩缩容。

---

## 🛠️ 技术栈清单

### 前端
* 核心框架：**uni-app (Vue 3 / SFC setup)**
* 构建工具：**Vite**
* 样式方案：**Tailwind CSS** + **weapp-tailwindcss** (适配小程序 Skyline)

### 后端
* 核心框架：**Spring Boot 3.2.4** + **Java 17**
* 持久层：**MyBatis-Plus 3.5.5** + **MySQL 8.0**
* 缓存与会话：**Redis 7.0** + **JJWT 0.11.5**
* 云端存储：**七牛云 Java SDK 7.14.0**

### 异步封面截帧服务
* 核心语言：**Python 3.10**
* 第三方依赖：`fitz` (PyMuPDF), `opencv-python`, `python-pptx`, `pywin32`

---

## 📂 项目目录结构

```text
EdWell/
├── backend/            # 后端 Spring Boot 3 工程根目录 (包含 Maven pom.xml & Dockerfile)
├── frontend/           # 前端 uni-app Vue 3 小程序/H5 原型源码
├── src/                # 前端运行的主逻辑及静态 SVG 资源目录
├── assets/             # 全局静态样式及资源文件
├── tsconfig.json       # TypeScript 静态类型校验配置
└── vite.config.ts      # Vite 编译与代理服务器配置
```

*(注：系统初始化 SQL 脚本及完整导出的数据备份已归纳在外层 `/sql` 目录中。)*

---

## 🚀 本地开发与启动步骤

### 1. 数据库初始化
在本地启动 MySQL 服务，创建名为 `xueyuanhui` 的数据库，并依次导入：
1. `sql/init_schema.sql` (创建 `user`, `resource`, `download_record`, `point_record`, `favorite` 5张物理表及联合唯一索引)
2. `sql/init_schema.sql` 中的 seeder 数据以注入 200 余条 K12 课程及教师种子用户元数据。

### 2. 启动 Redis 缓存
在本地或者 Docker 中启动 Redis 服务：
```bash
redis-server --port 6379
```

### 3. 启动 Spring Boot 后端
进入 `backend/` 目录，修改 `src/main/resources/application.yml` 中的数据库账号及七牛云 AK/SK，随后使用 Maven 构建并运行：
```bash
cd backend
mvn clean package
java -jar target/backend-1.0.0-SNAPSHOT.jar
```

### 4. 运行前端多端应用
进入根目录，安装前端依赖并启动开发服务：
```bash
npm install
npm run dev
```
* **微信小程序**：在微信开发者工具中导入 `dist/dev/mp-weixin`，并在本地设置中勾选“不校验合法域名、web-view（业务域名）、TLS版本以及HTTPS证书”即可进入演示。
* **H5 网页**：在浏览器中直接打开控制台输出的本地服务端口（如 `http://localhost:5173`）即可。

### 5. 启动 Python 封面自动提取服务
进入 `backend/src/main/python`，安装依赖并启动定时截帧服务：
```bash
pip install -r requirements.txt
python generate_covers.py
```

---

## 👥 团队开发分工与贡献

* **傅天吉** (组长/后端架构) ── 后端微服务、JJWT安全拦截器、通信并发防跳转爆栈锁、积分交易 `@Transactional` 事务逻辑、Knife4j API 集成开发。
* **孙赟泽** (数据库架构/持久层) ── 5 张核心物理数据表 E-R 实体设计、seeding 初始数据注入脚本编写、MyBatis-Plus Mapper 映射层开发。
* **李治刚** (前端开发) ── 响应式大厅UI重构、SVG高清渲染优化、Skyline真机 0x0 塌陷与 Tailwind 左右滑动水平溢出样式兼容性适配。
* **李顺年** (资源管理模块) ── 服务端七牛云直传 Token 签名接口开发、七牛云物理文件流同步接口与资源控制器控制层交互逻辑实现。
* **陶智** (安全与运维) ── 全局异常拦截器 RestControllerAdvice 开发、Dockerfile容器化配置、微信云托管部署与 41 个功能用例回归测试。
