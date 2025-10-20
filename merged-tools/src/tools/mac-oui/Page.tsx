import React, { useMemo, useRef, useState } from 'react'

type OUIMap = Record<string, string>

// 极小内置样例，避免体积；用户可导入完整 CSV/JSON 覆盖
const BUILTIN: OUIMap = {
  '000000': 'Xerox',
  '0001E6': 'Cisco Systems',
  '3C5A37': 'Apple, Inc.',
  'F0D1A9': 'HP Inc.',
  'B827EB': 'Raspberry Pi Trading',
}

function normalizeMac(mac: string): string {
  const hex = mac.replace(/[^0-9a-f]/gi, '').toUpperCase()
  return hex.slice(0, 12)
}

function extractOUI(mac12: string): string {
  return mac12.slice(0, 6)
}

async function parseFile(file: File): Promise<OUIMap> {
  const text = await file.text()
  // 尝试 JSON
  try {
    const obj = JSON.parse(text)
    if (obj && typeof obj === 'object') return obj as OUIMap
  } catch {}
  // 尝试 CSV，支持 "OUI,Company" 或 "Prefix,Vendor" 格式
  const lines = text.split(/\r?\n/).filter(Boolean)
  const map: OUIMap = {}
  for (const line of lines) {
    const parts = line.split(',').map((s) => s.trim())
    if (parts.length < 2) continue
    const key = parts[0].replace(/[^0-9a-f]/gi, '').toUpperCase()
    if (key.length === 6) map[key] = parts[1]
  }
  return map
}

export default function Page() {
  const [mac, setMac] = useState('40:16:7E:12:34:56')
  const [map, setMap] = useState<OUIMap>(BUILTIN)
  const fileRef = useRef<HTMLInputElement>(null)

  const info = useMemo(() => {
    const mac12 = normalizeMac(mac)
    if (mac12.length !== 12) return { valid: false }
    const oui = extractOUI(mac12)
    const vendor = map[oui]
    return { valid: true, mac12, oui, vendor }
  }, [mac, map])

  const onImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    try {
      const parsed = await parseFile(f)
      // 合并：用户数据优先
      setMap((prev) => ({ ...prev, ...parsed }))
      e.target.value = ''
    } catch (err) {
      console.error(err)
      alert('解析失败：请提供 JSON（{"A1B2C3": "Vendor"}）或 CSV（OUI,Company）')
    }
  }

  const onReset = () => setMap(BUILTIN)

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-500">MAC 地址</label>
        <input
          value={mac}
          onChange={(e) => setMac(e.target.value)}
          placeholder="AA:BB:CC:DD:EE:FF 或 AABBCCDDEEFF"
          className="input"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <input ref={fileRef} type="file" accept=".json,.csv,text/csv,application/json" onChange={onImport} />
        <button className="btn" onClick={onReset}>恢复内置样例</button>
      </div>
      <div className="rounded border p-3 bg-gray-50 dark:bg-gray-900/40">
        {!info.valid ? (
          <div className="text-gray-500">请输入有效的 MAC 地址（需要 12 位十六进制）</div>
        ) : (
          <div className="space-y-2">
            <div>规范化：{info.mac12!.replace(/(..)(?=.)/g, '$1:').slice(0, 17)}</div>
            <div>OUI 前缀：{info.oui}</div>
            <div>厂商：{info.vendor || '未知（可导入 OUI 数据以提升命中率）'}</div>
          </div>
        )}
      </div>
      <details className="mt-2">
        <summary className="cursor-pointer text-sm text-gray-500">数据格式说明</summary>
        <div className="text-sm text-gray-600 dark:text-gray-300 mt-2 space-y-1">
          <div>
            JSON 示例：
            <code className="ml-1">{'{ "A1B2C3": "Vendor Name" }'}</code>
          </div>
          <div>CSV 示例：OUI,Company（前缀 6 位 16 进制，不含分隔符）</div>
        </div>
      </details>
    </div>
  )
}
