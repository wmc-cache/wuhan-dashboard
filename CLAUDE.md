# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概览
这是一个基于 Vue 3 + TypeScript + Vite 的武汉仪表板项目，使用 ECharts 进行数据可视化展示。

## 开发命令
```bash
npm run dev      # 启动开发服务器，运行在 :5173 端口
npm run build    # 构建生产版本到 dist/ 目录
npm run preview  # 预览已构建的应用
```

## 项目架构
- **前端框架**: Vue 3 + Composition API (`<script setup>`)
- **状态管理**: Pinia
- **路由**: Vue Router (使用 Hash 模式)
- **图表库**: ECharts 5.5.1
- **样式**: SCSS + CSS Modules

## 核心组件架构
- `ScaleBox.vue`: 等比缩放容器组件，基于 1920x1080 设计稿自适应缩放
- `HeaderBar.vue`: 顶部导航栏组件
- `EChart.vue`: ECharts 图表封装组件

## 目录结构
```
src/
├── components/          # 可复用组件
│   ├── dashboard/       # 仪表板相关组件
│   ├── ScaleBox.vue     # 屏幕适配组件
│   ├── HeaderBar.vue    # 头部导航
│   └── EChart.vue       # 图表组件
├── pages/               # 路由页面
│   ├── Dashboard.vue    # 主仪表板
│   ├── Org.vue         # 组织页面
│   ├── Member.vue      # 成员页面
│   ├── Laomo.vue       # 老莫页面
│   └── Yiliao.vue      # 医疗页面
├── router/             # 路由配置
├── styles/             # 全局样式
├── images/             # 静态图片资源
└── utils/              # 工具函数
```

## 设计规范
- **设计基准**: 1920x1080 分辨率设计稿
- **缩放策略**: 使用 ScaleBox 组件实现等比缩放适配不同屏幕
- **颜色主题**: 蓝色系 (#0b4aa2)
- **字体**: DIN, PingFang SC, Microsoft YaHei

## 开发规范
- 组件文件使用 PascalCase 命名
- 使用 `<script setup lang="ts">` 语法
- 样式使用 `<style scoped lang="scss">`
- 图片资源放在 `src/images/` 目录下

## 路由配置
项目使用 Hash 路由模式，主要路由：
- `/` - 主仪表板 (Dashboard.vue)
- `/org` - 组织页面 (Org.vue)
- `/member` - 成员页面 (Member.vue)
- `/laomo` - 老莫页面 (Laomo.vue)
- `/yiliao` - 医疗页面 (Yiliao.vue)