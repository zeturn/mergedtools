import { useEffect, useState } from 'react'

export default function SearchBar({ value, onChange, placeholder = '搜索工具名称或描述…' }: { value?: string; onChange?: (v: string) => void; placeholder?: string }) {
  const [q, setQ] = useState(value ?? '')
  useEffect(() => { setQ(value ?? '') }, [value])
  return (
    <div className="mb-4">
      <input id="global-search"
        className="w-full rounded bg-slate-800/80 p-3 ring-1 ring-slate-700 focus:outline-none focus:ring-slate-500 placeholder:text-slate-500"
        placeholder={placeholder}
        value={q}
        onChange={(e) => { setQ(e.target.value); onChange?.(e.target.value) }}
      />
    </div>
  )
}
