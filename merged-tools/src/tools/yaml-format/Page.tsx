import { useMemo, useState } from 'react'
import yaml from 'js-yaml'
import { Textarea } from '../../components/Input'

function tryDump(obj: any, indent: number, sortKeys: boolean) {
  try {
    return yaml.dump(obj, { indent, sortKeys })
  } catch (e: any) {
    return '错误：' + (e?.message || String(e))
  }
}

export default function Page() {
  const [src, setSrc] = useState('name: Alice\nage: 30\nitems:\n  - id: 2\n  - id: 1')
  const [out, setOut] = useState('')
  const [indent, setIndent] = useState(2)
  const [sortKeys, setSortKeys] = useState(false)

  const parsed = useMemo(() => {
    try {
      return { ok: true as const, value: yaml.load(src) }
    } catch (e: any) {
      return { ok: false as const, error: e?.message || String(e) }
    }
  }, [src])

  function format() {
    if (!parsed.ok) {
      setOut('错误：' + parsed.error)
      return
    }
    setOut(tryDump(parsed.value, indent, sortKeys))
  }

  function minify() {
    if (!parsed.ok) {
      setOut('错误：' + parsed.error)
      return
    }
    // 压缩思路：先转 JSON 再用最小缩进与不换行风格（js-yaml 没有真正“单行”yaml，采用 indent=2 且尽量简洁）
    try {
      const json = JSON.parse(JSON.stringify(parsed.value))
      // 使用 flowLevel=0 尽可能生成 flow style（行内）
      const min = yaml.dump(json, { indent: 2, flowLevel: 0, sortKeys })
      setOut(min)
    } catch (e: any) {
      setOut('错误：' + (e?.message || String(e)))
    }
  }

  return (
    <div className="space-y-3">
      <Textarea variant="simple" className="h-56"
        value={src}
        onChange={(e) => setSrc(e.target.value)}
        placeholder="在此粘贴 YAML 文本"
      />

      <div className="flex flex-wrap gap-3 items-center">
        <label className="flex items-center gap-2">
          <span>缩进</span>
          <select
            className="select"
            value={indent}
            onChange={(e) => setIndent(parseInt(e.target.value) || 2)}
          >
            <option value={2}>2</option>
            <option value={4}>4</option>
          </select>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="checkbox"
            checked={sortKeys}
            onChange={(e) => setSortKeys(e.target.checked)}
          />
          <span>键排序</span>
        </label>

        <button className="btn" onClick={format}>格式化</button>
        <button className="btn" onClick={minify}>压缩</button>
      </div>

      {!parsed.ok && (
        <div className="text-red-400 text-sm">解析错误：{parsed.error}</div>
      )}

      <Textarea variant="simple" className="h-56" value={out} readOnly placeholder="输出将显示在这里" />
    </div>
  )
}
