import { useState } from 'react'
import { Textarea } from '../../components/Input'

async function genRsa(bits = 2048){
  return crypto.subtle.generateKey(
    { name: 'RSASSA-PKCS1-v1_5', modulusLength: bits, publicExponent: new Uint8Array([1,0,1]), hash: 'SHA-256' },
    true,
    ['sign','verify']
  )
}
function toPem(label: string, bin: ArrayBuffer){
  const b64 = btoa(String.fromCharCode(...new Uint8Array(bin))).replace(/(.{64})/g,'$1\n')
  return `-----BEGIN ${label}-----\n${b64}\n-----END ${label}-----`
}

export default function Page(){
  const [bits, setBits] = useState(2048)
  const [pub, setPub] = useState('')
  const [pri, setPri] = useState('')
  async function run(){
    const { publicKey, privateKey } = await genRsa(bits)
    const spki = await crypto.subtle.exportKey('spki', publicKey)
    const pkcs8 = await crypto.subtle.exportKey('pkcs8', privateKey)
    setPub(toPem('PUBLIC KEY', spki))
    setPri(toPem('PRIVATE KEY', pkcs8))
  }
  const copy = async (s: string)=> { await navigator.clipboard.writeText(s); alert('已复制') }
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-500">模数长度</label>
        <select className="select" value={bits} onChange={(e)=>setBits(Number(e.target.value))}>
          <option value={2048}>2048</option>
          <option value={3072}>3072</option>
          <option value={4096}>4096</option>
        </select>
        <button className="btn" onClick={run}>生成</button>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <div className="text-sm text-gray-500 mb-1">公钥（SPKI PEM）</div>
          <Textarea variant="simple" className="h-48" value={pub} readOnly />
          {pub && <button className="btn mt-2" onClick={()=>copy(pub)}>复制公钥</button>}
        </div>
        <div>
          <div className="text-sm text-gray-500 mb-1">私钥（PKCS#8 PEM）</div>
          <Textarea variant="simple" className="h-48" value={pri} readOnly />
          {pri && <button className="btn mt-2" onClick={()=>copy(pri)}>复制私钥</button>}
        </div>
      </div>
      <div className="text-xs text-gray-500">提示：浏览器 WebCrypto 生成的密钥不可导出明文材料（除非标记可导出），此处已导出 PEM 方便测试。生产环境请妥善保管私钥并考虑硬件保护。</div>
    </div>
  )
}
