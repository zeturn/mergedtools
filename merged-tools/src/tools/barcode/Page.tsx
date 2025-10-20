import { useEffect, useRef, useState } from 'react'
import JsBarcode from 'jsbarcode'

export default function Page() {
  const [text, setText] = useState('123456789012')
  const svgRef = useRef<SVGSVGElement | null>(null)
  useEffect(() => {
    if (!svgRef.current) return
    try {
      JsBarcode(svgRef.current, text || ' ', { format: 'CODE128', displayValue: true, margin: 8, height: 80 })
    } catch { /* ignore */ }
  }, [text])
  return (
    <div className="space-y-3">
      <input className="w-full rounded bg-slate-800 p-2" value={text} onChange={(e) => setText(e.target.value)} />
      <div className="p-4 bg-white rounded inline-block">
        <svg ref={svgRef} />
      </div>
    </div>
  )
}
