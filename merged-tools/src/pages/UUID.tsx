function uuidv4() {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const toHex = (n: number) => n.toString(16).padStart(2, '0')
  const hex = Array.from(bytes, toHex).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

export default function UUIDPage() {
  const onCopy = async () => {
    await navigator.clipboard.writeText(uuidv4())
    alert('已复制一个新 UUID')
  }
  return (
    <div className="space-y-4">
      <button className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500" onClick={onCopy}>复制新 UUID</button>
      <div className="font-mono text-slate-300">示例：{uuidv4()}</div>
    </div>
  )
}
