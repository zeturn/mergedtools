import { useEffect, useMemo, useState } from 'react'

type Scure = typeof import('@scure/bip39')

function bytesToHex(buf: Uint8Array){ return Array.from(buf).map(b=>b.toString(16).padStart(2,'0')).join('') }
function hexToBytes(hex: string){ const s = hex.replace(/\s+/g,''); if (s.length%2) throw new Error('hex 长度必须为偶数'); const a = new Uint8Array(s.length/2); for(let i=0;i<a.length;i++) a[i]=parseInt(s.slice(i*2,i*2+2),16); return a }

export default function Page(){
  const [mod, setMod] = useState<Scure | null>(null)
  const [wordlist, setWordlist] = useState<string[] | null>(null)
  const [lang, setLang] = useState<'en'|'zh-CN'|'ja'|'ko'|'fr'|'es'|'it'|'pt'|'cs'>('en')
  const [mnemonic, setMnemonic] = useState('')
  const [passphrase, setPassphrase] = useState('')
  const [entropyHex, setEntropyHex] = useState('')
  const [seedHex, setSeedHex] = useState('')
  const [valid, setValid] = useState<boolean|null>(null)
  const [path, setPath] = useState("m/44'/0'/0'/0/0")
  const [xpub, setXpub] = useState('')
  const [xprv, setXprv] = useState('')
  const [pubHex, setPubHex] = useState('')
  const [privHex, setPrivHex] = useState('')

  // dynamic import to keep initial bundle small
  useEffect(()=>{ (async()=>{ 
    const m = await import('@scure/bip39');
    setMod(m);
  })() }, [])

  async function loadWordlist(code: typeof lang){
    let wl: string[] | undefined
    switch(code){
      case 'en': wl = (await import('@scure/bip39/wordlists/english.js')).wordlist; break
      case 'zh-CN': wl = (await import('@scure/bip39/wordlists/simplified-chinese.js')).wordlist; break
      // omit zh-TW due to package export issue
      case 'ja': wl = (await import('@scure/bip39/wordlists/japanese.js')).wordlist; break
      case 'ko': wl = (await import('@scure/bip39/wordlists/korean.js')).wordlist; break
      case 'fr': wl = (await import('@scure/bip39/wordlists/french.js')).wordlist; break
      case 'es': wl = (await import('@scure/bip39/wordlists/spanish.js')).wordlist; break
      case 'it': wl = (await import('@scure/bip39/wordlists/italian.js')).wordlist; break
      case 'pt': wl = (await import('@scure/bip39/wordlists/portuguese.js')).wordlist; break
      case 'cs': wl = (await import('@scure/bip39/wordlists/czech.js')).wordlist; break
    }
    setWordlist(wl || null)
  }

  useEffect(()=>{ loadWordlist(lang) }, [lang])

  const wl = useMemo(()=> wordlist || undefined, [wordlist])

  async function genMnemonic(bits=128){
    if (!mod || !wl) return
    const bytes = new Uint8Array(bits/8); crypto.getRandomValues(bytes)
    const hex = bytesToHex(bytes)
    const m = mod.entropyToMnemonic(bytes, wl)
    setEntropyHex(hex)
    setMnemonic(m)
  }

  async function fromEntropy(){
    if (!mod || !wl) return
    try { const bytes = hexToBytes(entropyHex); setMnemonic(mod.entropyToMnemonic(bytes, wl)); setValid(null) }
    catch(e:any){ alert(e?.message || '转换失败') }
  }
  async function toEntropy(){
    if (!mod || !wl) return
    try { const bytes = mod.mnemonicToEntropy(mnemonic, wl); setEntropyHex(bytesToHex(bytes)) }
    catch(e:any){ alert(e?.message || '转换失败') }
  }
  async function check(){
    if (!mod || !wl) return
    setValid(mod.validateMnemonic(mnemonic, wl))
  }
  async function toSeed(){
    if (!mod) return
    const seed = mod.mnemonicToSeedSync(mnemonic, passphrase)
    setSeedHex(bytesToHex(seed))
  }

  async function derive(){
    try{
      const { HDKey } = await import('@scure/bip32')
      const seed = new Uint8Array(hexToBytes(seedHex || bytesToHex(mod!.mnemonicToSeedSync(mnemonic, passphrase))))
      const root = HDKey.fromMasterSeed(seed)
      const node = root.derive(path)
      setXprv(node.privateExtendedKey || '')
      setXpub(node.publicExtendedKey || '')
      setPrivHex(node.privateKey ? bytesToHex(node.privateKey) : '')
      setPubHex(node.publicKey ? bytesToHex(node.publicKey) : '')
    }catch(e:any){ alert(e?.message || '派生失败') }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center flex-wrap">
        <label className="text-sm text-slate-400">词表</label>
        <select className="rounded bg-slate-800 p-2" value={lang} onChange={(e)=>setLang(e.target.value as any)}>
          <option value="en">English</option>
          <option value="zh-CN">简体中文</option>
          {/* 繁體中文暂不提供（包导出路径存在问题） */}
          <option value="ja">日本語</option>
          <option value="ko">한국어</option>
          <option value="fr">Français</option>
          <option value="es">Español</option>
          <option value="it">Italiano</option>
          <option value="pt">Português</option>
          <option value="cs">Čeština</option>
        </select>
        <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={()=>genMnemonic(128)}>生成 12 词</button>
        <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={()=>genMnemonic(256)}>生成 24 词</button>
      </div>
      <section className="space-y-2">
        <div className="text-sm text-slate-400">助记词</div>
        <textarea className="w-full min-h-24 rounded bg-slate-800 p-2" value={mnemonic} onChange={(e)=>setMnemonic(e.target.value)} />
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={toEntropy}>助记词 → 熵</button>
          <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={check}>校验</button>
          {valid!==null && <span className={valid? 'text-green-400':'text-red-400'}>{valid? '有效':'无效'}</span>}
        </div>
      </section>
      <section className="space-y-2">
        <div className="text-sm text-slate-400">熵（hex）</div>
        <textarea className="w-full min-h-20 rounded bg-slate-800 p-2 font-mono" value={entropyHex} onChange={(e)=>setEntropyHex(e.target.value)} />
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={fromEntropy}>熵 → 助记词</button>
        </div>
      </section>
      <section className="space-y-2">
        <div className="text-sm text-slate-400">可选 Passphrase（BIP39）</div>
        <input className="rounded bg-slate-800 p-2" value={passphrase} onChange={(e)=>setPassphrase(e.target.value)} />
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={toSeed}>导出 Seed</button>
        </div>
        {seedHex && <div className="rounded bg-slate-900 p-2 font-mono break-all">{seedHex}</div>}
      </section>
      <section className="space-y-2">
        <div className="text-sm text-slate-400">BIP32/44 路径派生</div>
        <div className="flex gap-2 items-center flex-wrap">
          <input className="rounded bg-slate-800 p-2 w-[24rem]" value={path} onChange={(e)=>setPath(e.target.value)} />
          <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={derive}>派生</button>
        </div>
        {(xpub||xprv) && (
          <div className="space-y-2">
            {xprv && <div className="rounded bg-slate-900 p-2 font-mono break-all">xprv: {xprv}</div>}
            {xpub && <div className="rounded bg-slate-900 p-2 font-mono break-all">xpub: {xpub}</div>}
            {privHex && <div className="rounded bg-slate-900 p-2 font-mono break-all">priv: {privHex}</div>}
            {pubHex && <div className="rounded bg-slate-900 p-2 font-mono break-all">pub: {pubHex}</div>}
          </div>
        )}
      </section>
    </div>
  )
}
