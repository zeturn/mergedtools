# Merged Tools - 工具审查与优化建议

生成时间: 2025-10-19
总工具数: 210+

## 📊 工具分类统计

### 1. Base 编码类 (8个工具)
可以合并为一个"多格式Base编码工具"

| 工具ID | 功能 | 建议 |
|--------|------|------|
| base32 | Base32 编解码 | 🔀 合并 |
| base45 | Base45 编解码 | 🔀 合并 |
| base58 | Base58 编解码 | 🔀 合并 |
| base62 | Base62 编解码 | 🔀 合并 |
| base64 | Base64 编解码 | 🔀 合并 |
| base64-file | Base64 文件编解码 | 🔀 合并 |
| base85 | Base85 编解码 | 🔀 合并 |
| base-convert | 进制转换 | ✅ 保留(功能不同) |

**合并方案:**
```
新工具: base-encoder
功能: 统一界面,下拉选择编码格式(Base32/45/58/62/64/85)
支持: 文本和文件两种输入模式
```

### 2. Hash/加密类 (6个工具)
可以整合

| 工具ID | 功能 | 建议 |
|--------|------|------|
| hash | 基础Hash(MD5/SHA) | 🔀 合并 |
| hash-extra | 额外Hash算法 | 🔀 合并 |
| hash-text | 文本Hash | 🔀 合并 |
| file-hash | 文件Hash | 🔀 合并 |
| hmac | HMAC | ✅ 保留(需要密钥) |
| bcrypt | Bcrypt | ✅ 保留(专用) |

**合并方案:**
```
新工具: hash-generator
功能: 
- 支持多种算法(MD5/SHA-1/SHA-256/SHA-512等)
- 支持文本和文件输入
- 可选HMAC模式
```

### 3. CSV处理类 (12个工具)
部分可以合并

| 工具ID | 功能 | 建议 |
|--------|------|------|
| csv-json | CSV转JSON | ✅ 保留(常用) |
| json-csv | JSON转CSV | ✅ 保留(常用) |
| csv-pivot | CSV透视 | ✅ 保留(独特) |
| csv-to-tsv | CSV转TSV | 🔀 合并到格式转换器 |
| csv-to-xml | CSV转XML | 🔀 合并到格式转换器 |
| csv-to-yaml | CSV转YAML | 🔀 合并到格式转换器 |
| change-csv-separator | 更改分隔符 | ✅ 保留(实用) |
| swap-csv-columns | 交换列 | ❌ 删除(太具体) |
| insert-csv-columns | 插入列 | ❌ 删除(太具体) |
| transpose-csv | 转置CSV | ✅ 保留(独特) |
| find-incomplete-csv-records | 查找不完整记录 | ✅ 保留(实用) |

### 4. JSON处理类 (11个工具)
核心工具保留

| 工具ID | 功能 | 建议 |
|--------|------|------|
| json-format | JSON格式化 | ✅ 保留(核心) |
| json-minify | JSON压缩 | 🔀 合并到json-format |
| json-viewer | JSON查看器 | 🔀 合并到json-format |
| json-diff | JSON差异对比 | ✅ 保留(独特) |
| json-schema | JSON Schema | ✅ 保留(专业) |
| json-stringify | JSON序列化 | 🔀 合并到json-format |
| validate-json | JSON验证 | 🔀 合并到json-format |
| jsonpath | JSONPath查询 | ✅ 保留(专业) |
| escape-json | JSON转义 | 🔀 合并到json-format |
| json-to-* | JSON转其他格式 | ✅ 保留(各有用途) |

### 5. 时间/日期类 (9个工具)
可以大幅合并

| 工具ID | 功能 | 建议 |
|--------|------|------|
| date-time-converter | 日期时间转换 | 🔀 核心工具 |
| timestamp | 时间戳 | 🔀 合并 |
| convert-unix-to-date | Unix转日期 | 🔀 合并 |
| timezone | 时区转换 | ✅ 保留(独特) |
| date-diff | 日期差异 | 🔀 合并 |
| time-between-dates | 日期间隔 | 🔀 合并 |
| countdown | 倒计时 | ✅ 保留(独特) |
| chronometer | 计时器 | ✅ 保留(独特) |
| truncate-clock-time | 截断时间 | ❌ 删除(太具体) |

**合并方案:**
```
新工具: time-converter
功能:
- Unix时间戳 ⇄ 日期时间
- 时区转换
- 日期计算(差异/间隔)
- 格式化选项
```

### 6. 文本处理类 (8个工具)

| 工具ID | 功能 | 建议 |
|--------|------|------|
| text-case | 大小写转换 | 🔀 合并 |
| text-diff | 文本差异 | ✅ 保留(常用) |
| text-stats | 文本统计 | ✅ 保留(实用) |
| text-unicode | Unicode处理 | ✅ 保留(专业) |
| text-binary | 文本二进制转换 | ✅ 保留(独特) |
| randomize-case | 随机大小写 | ❌ 删除(娱乐性) |
| reverse | 反转文本 | ❌ 删除(太简单) |
| repeat | 重复文本 | ❌ 删除(太简单) |

### 7. 图片处理类 (12个工具)
后端依赖工具需要评估

| 工具ID | 功能 | 需要后端? | 建议 |
|--------|------|-----------|------|
| image-compress | 图片压缩 | ❌ (Canvas) | ✅ 保留 |
| image-convert | 图片转换 | ❌ (Canvas) | ✅ 保留 |
| image-crop | 图片裁剪 | ❌ (Canvas) | ✅ 保留 |
| image-resize | 图片缩放 | ❌ (Canvas) | ✅ 保留 |
| image-watermark | 图片水印 | ❌ (Canvas) | ✅ 保留 |
| exif | EXIF信息 | ❌ (exifr库) | ✅ 保留 |
| exif-batch | EXIF批处理 | ❌ | ✅ 保留 |
| exif-sanitize | EXIF清理 | ❌ | ✅ 保留 |
| imagemagick | ImageMagick | ✅ | ❌ 删除/标注 |
| graphicsmagick | GraphicsMagick | ✅ | ❌ 删除/标注 |
| vips | libvips | ✅ | ❌ 删除/标注 |
| libheif | HEIF处理 | ✅ | ❌ 删除/标注 |
| libjxl | JPEG XL | ✅ | ❌ 删除/标注 |

### 8. 文档转换类 (需要后端)

| 工具ID | 功能 | 建议 |
|--------|------|------|
| calibre-convert | 电子书转换 | ❌ 删除(需要Calibre后端) |
| libreoffice-convert | Office文档转换 | ❌ 删除(需要LibreOffice) |
| pandoc-convert | Pandoc转换 | ❌ 删除(需要Pandoc) |
| xelatex | LaTeX编译 | ❌ 删除(需要XeLaTeX) |
| dvisvgm | DVI转SVG | ❌ 删除(需要dvisvgm) |
| inkscape | Inkscape转换 | ❌ 删除(需要Inkscape) |
| resvg | SVG渲染 | ❌ 删除(需要resvg) |
| potrace | 矢量化 | ❌ 删除(需要potrace) |
| vtracer | 矢量追踪 | ❌ 删除(需要vtracer) |

### 9. 简单计算类 (可删除)

| 工具ID | 功能 | 建议 |
|--------|------|------|
| sum | 求和 | ❌ 删除(太简单) |
| percentage | 百分比 | ❌ 删除(太简单) |
| generic-calc | 通用计算器 | ✅ 保留(实用) |
| math-eval | 数学表达式 | ✅ 保留(强大) |
| arithmetic-sequence | 等差数列 | ❌ 删除(太具体) |

### 10. 其他实用工具 (保留)

核心工具,建议保留:
- ✅ uuid / uuid-plus / nanoid / ulid - ID生成器
- ✅ qrcode / qr-batch / qr-decode - 二维码
- ✅ barcode / barcode-batch - 条形码
- ✅ jwt-decode / jwt-verify - JWT处理
- ✅ regex-tester / regex-replace - 正则工具
- ✅ url-encode / url-parser / url-params - URL工具
- ✅ password / password-strength - 密码工具
- ✅ cron / cron-builder - Cron表达式
- ✅ device-info - 设备信息
- ✅ user-agent - UA解析
- ✅ lorem - Lorem文本生成
- ✅ emoji-picker - Emoji选择器
- ✅ color / color-convert / palette - 颜色工具
- ✅ markdown-editor / markdown-to-html - Markdown
- ✅ sql-format - SQL格式化
- ✅ html-entities - HTML实体
- ✅ minify - 代码压缩

## 📋 优化建议总结

### 立即删除 (20-30个工具)

**需要后端的工具:**
- calibre-convert, libreoffice-convert, pandoc-convert
- xelatex, dvisvgm, inkscape, resvg, potrace, vtracer
- imagemagick, graphicsmagick, vips, libheif, libjxl
- msgconvert, dasel

**功能过于简单:**
- sum, percentage, arithmetic-sequence
- reverse, repeat, randomize-case
- swap-csv-columns, insert-csv-columns
- truncate-clock-time
- convert-days-to-hours, convert-hours-to-days
- convert-seconds-to-time, convert-time-to-seconds

### 可以合并 (30-40个工具 → 10-15个)

**Base编码组 → base-encoder** (8合1)
**Hash组 → hash-generator** (4合1)
**JSON工具组 → json-toolkit** (5合1)
**时间工具组 → time-converter** (5合1)
**列表处理组 → list-toolkit** (合并10+个list-*工具)

### 保留核心工具 (~150个)

专业性强、功能独特、使用频率高的工具

## 🎯 预期效果

### 优化前
- 工具数量: 210+
- 用户体验: 工具过多,难以选择
- 维护成本: 高

### 优化后
- 工具数量: ~150
- 删除: 20-30个(需要后端/过于简单)
- 合并: 30-40个 → 10-15个多功能工具
- 保留: ~150个核心工具

### 收益
- ✅ 更清晰的工具分类
- ✅ 更好的用户体验
- ✅ 更低的维护成本
- ✅ 更小的包体积

## 🚀 实施计划

### 阶段1: 清理(1-2天)
1. 删除需要后端的工具
2. 删除过于简单的工具
3. 更新路由和文档

### 阶段2: 合并(3-5天)
1. 实现 base-encoder (合并8个)
2. 实现 hash-generator (合并4个)
3. 实现 json-toolkit (合并5个)
4. 实现 time-converter (合并5个)
5. 实现 list-toolkit (合并10+个)

### 阶段3: 测试与文档(1-2天)
1. 测试所有合并后的工具
2. 更新README和工具文档
3. 更新SEO信息

---

**注意:** 删除或合并工具前,请确保:
1. 检查是否有用户依赖该工具
2. 提供迁移指南(如果适用)
3. 备份原始代码
