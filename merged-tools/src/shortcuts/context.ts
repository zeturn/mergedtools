import { createContext, useContext } from 'react'

export type ShortcutsCtx = {
  helpOpen: boolean
  setHelpOpen: (v: boolean) => void
  switcherOpen: boolean
  setSwitcherOpen: (v: boolean) => void
}

export const ShortcutCtx = createContext<ShortcutsCtx | null>(null)

export function useShortcuts() {
  const ctx = useContext(ShortcutCtx)
  if (!ctx) throw new Error('ShortcutProvider is missing')
  return ctx
}
