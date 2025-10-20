# 第三方代码与许可证策略

本项目整合多个开源工具的功能，遵循以下策略以确保合规：

- it-tools（GPL-3.0）：不直接复制源代码；仅参考功能并进行 clean-room 重实现。任何直接复用将保持在独立 GPL 子模块中，并在本仓库中明确标注与隔离。
- ConvertX（AGPL-3.0）：相同策略，不直接复制实现；如需网络/服务端形式，遵守 AGPL 的源代码提供义务；前端功能将以重写实现为主。
- omni-tools（MIT）：允许直接使用与修改；在本项目中将择优提取可复用的小工具逻辑（或基于 MIT 依赖重写整合），并在本文件中保留版权与许可声明。

当前已集成/重写示例：

- Base64 编解码（clean-room 重写）
- UUID v4 生成（clean-room 重写）
- SHA-256 哈希（浏览器 SubtleCrypto，clean-room 重写）
- CSV ⇄ JSON（依赖 papaparse，MIT）
- 颜色 HEX ⇄ RGB（clean-room 重写）
- 时间戳转换（clean-room 重写）
- Base32（hi-base32，MIT）/ Base58（bs58，MIT）
- HTML 实体（he，MIT）
- XML ⇄ JSON（fast-xml-parser，MIT）/ TOML ⇄ JSON（toml/tomlify-j0.4，MIT）/ YAML ⇄ JSON（js-yaml，MIT）
- 文本大小写（clean-room）/ Slugify（slugify，MIT）
- 正则测试器 / URL 编解码 / JSON 格式化 / JWT 解码（clean-room）
- 条形码（jsbarcode，MIT）/ 二维码（qrcode，MIT）
- 图片转换/压缩（Canvas clean-room）/ 单位换算（clean-room）
- JSONPath（jsonpath-plus，MIT）/ UUID Plus（uuid，MIT）

后续计划：

- 从 omni-tools 提取更多 MIT 许可工具（如字符串处理、编码转换等）。
- 针对 it-tools/ConvertX 常用功能逐步重写（QR 码、图片处理、文件转换等），避免直接复制 GPL/AGPL 源码。

### 架构补充：懒加载与自动注册

- 每个工具文件夹导出 `meta`（`index.tsx`），页面组件在 `Page.tsx`。
- 注册表仅急切加载 meta；页面组件通过 React.lazy 按需加载，实现更小的首包体积。
