import { useMemo, useState } from 'react'

function utf8Bytes(s: string) {
  // 粗略估计：使用 TextEncoder 可获得精确字节数
  return new TextEncoder().encode(s).length
}

export default function Page() {
  const [text, setText] = useState('Hello 世界\nThis is a test.')
  const stats = useMemo(() => {
    const chars = text.length
    const nonSpace = text.replace(/\s/g, '').length
    const words = (text.match(/([A-Za-z0-9_]+(?:'[A-Za-z0-9_]+)?)/g) || []).length
    const lines = text.split(/\r?\n/).length
    const bytes = utf8Bytes(text)
    const cjk = (text.match(/[\u4E00-\u9FFF]/g) || []).length
    return { chars, nonSpace, words, lines, bytes, cjk }
  }, [text])

  return (
    <div className="space-y-4">
      <textarea className="textarea h-64" value={text} onChange={(e)=>setText(e.target.value)} />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
        <div className="rounded border p-2">字符数：{stats.chars}</div>
        <div className="rounded border p-2">非空字符：{stats.nonSpace}</div>
        <div className="rounded border p-2">单词数：{stats.words}</div>
        <div className="rounded border p-2">行数：{stats.lines}</div>
        <div className="rounded border p-2">UTF-8 字节：{stats.bytes}</div>
        <div className="rounded border p-2">CJK 字符：{stats.cjk}</div>
      </div>
    </div>
  )
}
