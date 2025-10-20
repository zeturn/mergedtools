import { lazy } from 'react'
import type { RegisteredTool, ToolMeta } from './types'

// 仅加载轻量 meta，组件懒加载
const metaModules = import.meta.glob<ToolMeta>('./*/index.tsx', { eager: true, import: 'meta' })
const componentModules = import.meta.glob('./*/Page.tsx')

export const tools: RegisteredTool[] = Object.entries(metaModules)
  .map(([path, meta]) => {
  // path like './foo/index.tsx' -> map to './foo/Page.tsx'
  const pagePath = path.replace('/index.tsx', '/Page.tsx')
  const loader = componentModules[pagePath]
    const Component = lazy(async () => {
      const m: any = await loader()
      return { default: m.default }
    })
    const prefetch = loader ? () => loader() : undefined
    return { meta, Component, prefetch }
  })
  .sort((a, b) => a.meta.name.localeCompare(b.meta.name))

export function getToolById(id: string) {
  return tools.find((t) => t.meta.id === id)
}
