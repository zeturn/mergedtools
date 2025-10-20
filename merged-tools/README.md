# React + TypeScript + Vite

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
## Merged Tools（React + Tailwind + Vite）

一个将多项目常用小工具汇聚到一起的前端应用。采用 React + TypeScript + Vite，并集成 Tailwind CSS（v4）。

当前内置示例（均为 clean-room 重写或使用 MIT 依赖）：

- Base64 编解码
- UUID v4 生成
- SHA-256 散列
- CSV ⇄ JSON（papaparse, MIT）
- 颜色转换（HEX ⇄ RGB）
- 时间戳转换（Unix 秒/毫秒 ⇄ 日期）
- 二维码生成（qrcode, MIT）

### 开发
# Merged Tools（React + Tailwind + Vite）

一个将多项目常用小工具汇聚到一起的前端应用。采用 React + TypeScript + Vite，并集成 Tailwind CSS（v4）。支持“一个工具一个文件夹”的可扩展架构与按需懒加载。

## 功能一览（部分）

- Base64 编解码（clean-room）
- Base32 编解码（hi-base32，MIT）
- Base58 编解码（bs58，MIT）
- UUID 生成（clean-room）与 UUID Plus：v1/v4/v5（uuid，MIT）
- SHA-256 散列（SubtleCrypto，clean-room）与 MD5/HMAC-SHA256（spark-md5 + WebCrypto）
- CSV ⇄ JSON（papaparse，MIT）
- XML ⇄ JSON（fast-xml-parser，MIT）
- YAML ⇄ JSON（js-yaml，MIT）
- TOML ⇄ JSON（toml/tomlify-j0.4，MIT）
- HTML 实体编解码（he，MIT）
- 文本大小写转换（clean-room）、Slugify（slugify，MIT）
- URL 编解码、JSON 格式化、正则测试器、JWT 解码（clean-room）
- 条形码生成（jsbarcode，MIT）、二维码生成（qrcode，MIT）
- 图片转换/压缩（Canvas：PNG/JPEG/WebP，clean-room）
- 单位换算（长度/质量/温度，clean-room）

## 运行与构建

```bash
npm install
npm run dev
# 构建预览
npm run build
npm run preview
```

## 架构与约定

- 目录按“每个工具一个文件夹”组织：`src/tools/<toolId>/`。
  - 每个工具包含两个文件：`index.tsx` 与 `Page.tsx`。
  - `index.tsx` 仅导出工具的元信息 `meta`；`Page.tsx` 导出默认的页面组件。
- 注册表：`src/tools/registry.ts`
  - 通过 `import.meta.glob` 自动发现所有工具。
  - 仅“急切加载”元信息；页面组件使用 React.lazy 懒加载，实现代码分割。
- 路由与导航：动态根据注册表生成，首页展示所有工具卡片（`src/pages/Home.tsx` + `src/components/ToolsList.tsx`）。

## 如何新增一个工具

以 `foo` 为例：

1) 创建目录：`src/tools/foo/`

2) 添加 `index.tsx`（仅导出 meta）：

```ts
export const meta = {
  id: 'foo',
  name: '我的新工具',
  desc: '一句话描述',
  license: 'Clean-room',
} as const
```

3) 添加 `Page.tsx`（默认导出页面组件）：

```tsx
export default function Page() {
  return <div>这里是新工具</div>
}
```

保存后路由与首页会自动出现该工具，无需手工修改其他文件。

## 技术要点

- Tailwind v4：使用 `@tailwindcss/postcss` 插件与 `@import "tailwindcss"` 方式
- 路由：react-router-dom；页面组件使用 Suspense 包裹以支持懒加载
- 构建：Vite；通过按需加载显著降低首包体积

## 许可证与第三方

- 本项目代码以 MIT 许可证发布，详见 `LICENSE`
- 第三方与重写策略详见 `docs/THIRD_PARTY.md`
    ],
