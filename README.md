# Developer Tools Workspace

一个包含210+个实用开发工具的前端应用集合。采用 React + TypeScript + Vite + Tailwind CSS 构建。

## 🚀 快速开始

### 开发
```bash
npm run dev
# 或者
cd merged-tools && npm run dev
```

访问 `http://localhost:5173` 查看应用。

### 构建
```bash
npm run build
# 或者
cd merged-tools && npm run build
```

### 预览构建结果
```bash
npm run preview
# 或者
cd merged-tools && npm run preview
```

## 📁 项目结构

```
/
├── package.json                    # 工作区管理
├── README.md                       # 本文件
├── PROJECT_CLEANUP_REPORT.md       # 详细的清理分析报告
├── CLEANUP_SUMMARY.md              # 清理工作总结
├── backup-*.tar.gz                 # 备份文件
└── merged-tools/                   # 主项目
    ├── src/
    │   ├── tools/                  # 210个工具目录
    │   │   ├── base64/
    │   │   │   ├── index.tsx       # 工具元信息
    │   │   │   └── Page.tsx        # 工具页面组件
    │   │   ├── uuid/
    │   │   └── ...
    │   ├── components/             # 共享组件
    │   ├── pages/                  # 页面组件
    │   └── App.tsx
    ├── scripts/
    │   └── scan-tools.mjs          # 工具分析脚本
    ├── TOOLS_REVIEW.md             # 工具优化建议
    └── package.json
```

## 🛠️ 包含的工具类型

### 编码/解码
- Base编码 (Base32/45/58/62/64/85)
- URL编码/解码
- HTML实体编解码
- Unicode处理

### Hash与加密
- Hash生成 (MD5/SHA-1/SHA-256/SHA-512)
- HMAC
- Bcrypt
- JWT解码/验证

### 数据格式转换
- JSON ⇄ CSV/XML/YAML/TOML
- CSV ⇄ JSON/XML/YAML/TSV
- XML ⇄ JSON
- YAML ⇄ JSON/TOML

### 文本处理
- 大小写转换
- 文本差异对比
- 正则表达式测试
- Markdown编辑器
- 文本统计

### 时间/日期
- Unix时间戳转换
- 时区转换
- 日期差异计算
- Cron表达式

### 图片处理
- 图片压缩/转换/裁剪/缩放
- EXIF信息查看/清理
- 二维码生成/解码
- 条形码生成

### ID生成器
- UUID (v1/v4/v5)
- ULID
- Nanoid
- MAC地址生成

### 开发工具
- SQL格式化
- JSON格式化/压缩
- 代码压缩 (HTML/CSS/JS)
- 颜色转换
- 单位换算

### 其他
- 密码生成器
- Lorem文本生成
- 设备信息
- User-Agent解析
- Git/正则速查表

## 📊 项目优化

项目已完成初步清理:
- ✅ 删除了重复的参考项目 (external/)
- ✅ 优化了根目录配置
- ✅ 识别了可以进一步优化的工具

### 工具统计
- **当前工具数:** 210个
- **可以删除:** 30个 (需要后端支持或过于简单)
- **可以合并:** 33个 → 5个
- **优化后预计:** 152个 (-28%)

详细分析请查看:
- `PROJECT_CLEANUP_REPORT.md` - 清理分析报告
- `merged-tools/TOOLS_REVIEW.md` - 工具审查建议
- `CLEANUP_SUMMARY.md` - 清理工作总结

### 分析工具
运行工具分析脚本:
```bash
cd merged-tools
node scripts/scan-tools.mjs
```

## 🏗️ 架构特点

### 每个工具独立文件夹
```
src/tools/<tool-id>/
├── index.tsx    # 仅导出元信息 (meta)
└── Page.tsx     # 默认导出页面组件
```

### 自动发现和注册
`src/tools/registry.ts` 使用 `import.meta.glob` 自动发现所有工具:
- 急切加载元信息 (用于首页列表)
- 懒加载页面组件 (代码分割)

### 动态路由
路由根据注册表自动生成,无需手动配置。

### 新增工具
只需创建新的工具文件夹,包含 `index.tsx` 和 `Page.tsx`,即可自动出现在应用中。

## 🎯 下一步优化建议

### 短期
1. 删除需要后端的17个工具
2. 删除过于简单的13个工具
3. 更新路由和文档

### 中期
1. 合并Base编码工具 (7合1)
2. 合并Hash工具 (4合1)
3. 合并JSON工具 (6合1)
4. 合并时间工具 (4合1)
5. 合并列表工具 (12合1)

### 长期
1. 监控工具使用情况
2. 收集用户反馈
3. 持续性能优化

## 📝 技术栈

- **前端框架:** React 19
- **构建工具:** Vite
- **样式:** Tailwind CSS v4
- **路由:** React Router v7
- **语言:** TypeScript
- **包管理:** npm/pnpm

## 📄 许可证

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📮 联系

如有问题或建议,请创建 Issue。

---

**最后更新:** 2025-10-19
