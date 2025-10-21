import { useEffect, useRef, useState } from 'react'
import JsBarcode from 'jsbarcode'
import Input from '../../components/Input'

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
      <Input  variant="simple" className="" value={text} onChange={(e) => setText(e.target.value)} />
      <div className="p-4 bg-white rounded inline-block">
        <svg ref={svgRef} />
      </div>
    </div>
  )
}
