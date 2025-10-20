import type { LazyExoticComponent } from 'react'

export type ToolMeta = {
  id: string
  name: string
  desc?: string
  license?: string
  tags?: string[]
  keywords?: string[]
  ogImage?: string
}

export type ToolModule = {
  meta: ToolMeta
  default: React.ComponentType<any>
}

export type RegisteredTool = {
  meta: ToolMeta
  Component: React.ComponentType<any> | LazyExoticComponent<any>
  prefetch?: () => Promise<any>
}
