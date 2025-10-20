import { useMemo, useState } from 'react'
import { encode as b32enc, decode as b32dec } from 'hi-base32'
import bs58 from 'bs58'
import baseX from 'base-x'

// 字母表定义
const ALPHABETS = {
  base2: '01',
  base4: 'ACGT',
  base8: '01234567',
  base10: '0123456789',
  base12: '0123456789AB',
  base16: '0123456789ABCDEF',
  base20: '0123456789ABCDEFGHIJ',
  base24: '0123456789ABCDEFGHIJKLMN',
  base26: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  base36: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  base40: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ- .,',
  base45: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:',
  base52: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  base56: '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz',
  base58: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
  base60: '0123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz',
  base62: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  base66: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_~.',
  base70: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*',
  base91: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;<=>?@[]^_`{|}~"',
  base94: '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~',
  z85: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#",
  base122: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+,-./:;<=>?@[]^_`{|}~\'"\\',
  base128: Array.from({length: 128}, (_, i) => String.fromCharCode(i)).join('')
}

// Base64 functions
const base64Encode = (text: string) => {
  try { return btoa(unescape(encodeURIComponent(text))) } catch { return '' }
}
const base64Decode = (b64: string) => {
  try { return decodeURIComponent(escape(atob(b64))) } catch { return '' }
}
const base64UrlEncode = (text: string) => base64Encode(text).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const base64UrlDecode = (text: string) => {
  let str = text.replace(/-/g, '+').replace(/_/g, '/')
  while (str.length % 4) str += '='
  return base64Decode(str)
}

// Base32 Hex
const base32hexCodec = baseX('0123456789ABCDEFGHIJKLMNOPQRSTUV')

// Base100 Emoji encoding - 使用 100 个 emoji 字符
const BASE100_EMOJIS = [
  '🐀','🐁','🐂','🐃','🐄','🐅','🐆','🐇','🐈','🐉',
  '🐊','🐋','🐌','🐍','🐎','🐏','🐐','🐑','🐒','🐓',
  '🐔','🐕','🐖','🐗','🐘','🐙','🐚','🐛','🐜','🐝',
  '🐞','🐟','🐠','🐡','🐢','🐣','🐤','🐥','🐦','🐧',
  '🐨','🐩','🐪','🐫','🐬','🐭','🐮','🐯','🐰','🐱',
  '🐲','🐳','🐴','🐵','🐶','🐷','🐸','🐹','🐺','🐻',
  '🐼','🐽','🐾','🐿','👀','👁','👂','👃','👄','👅',
  '👆','👇','👈','👉','👊','👋','👌','👍','👎','👏',
  '👐','👑','👒','👓','👔','👕','👖','👗','👘','👙',
  '👚','👛','👜','👝','👞','👟','👠','👡','👢','👣'
]

const base100Encode = (bytes: Uint8Array): string => {
  return Array.from(bytes).map(byte => BASE100_EMOJIS[byte % 100]).join('')
}

const base100Decode = (text: string): Uint8Array => {
  const emojis = [...text] // 正确处理 emoji 字符
  const bytes = emojis.map(emoji => {
    const idx = BASE100_EMOJIS.indexOf(emoji)
    return idx >= 0 ? idx : 0
  })
  return new Uint8Array(bytes)
}

// Base85 Z85
const z85Dec: Record<string, number> = Object.fromEntries([...ALPHABETS.z85].map((c, i) => [c, i]))
const z85Encode = (data: Uint8Array) => {
  const pad = data.length % 4
  if (pad) {
    const padded = new Uint8Array(data.length + (4 - pad))
    padded.set(data)
    data = padded
  }
  let out = ''
  for (let i = 0; i < data.length; i += 4) {
    let v = (data[i] << 24) + (data[i + 1] << 16) + (data[i + 2] << 8) + data[i + 3]
    v = v >>> 0
    const digits = []
    for (let k = 0; k < 5; k++) { digits.unshift(v % 85); v = Math.floor(v / 85) }
    out += digits.map(d => ALPHABETS.z85[d]).join('')
  }
  return out
}
const z85Decode = (s: string) => {
  if (s.length % 5 !== 0) throw new Error('Z85 字符串长度必须为 5 的倍数')
  const bytes = []
  for (let i = 0; i < s.length; i += 5) {
    let v = 0
    for (let k = 0; k < 5; k++) {
      const d = z85Dec[s[i + k]]
      if (d === undefined) throw new Error('无效字符')
      v = v * 85 + d
    }
    bytes.push((v >>> 24) & 255, (v >>> 16) & 255, (v >>> 8) & 255, v & 255)
  }
  return new Uint8Array(bytes)
}

// Ascii85
const ascii85Encode = (data: Uint8Array) => {
  let out = '<~'
  for (let i = 0; i < data.length; i += 4) {
    const chunk = data.subarray(i, i + 4)
    let val = 0
    for (let j = 0; j < 4; j++) val = (val << 8) + (chunk[j] ?? 0)
    if (chunk.length === 4 && val === 0) { out += 'z'; continue }
    const count = chunk.length + 1
    const digits = []
    for (let k = 0; k < 5; k++) { digits.unshift(val % 85); val = Math.floor(val / 85) }
    for (let k = 0; k < count; k++) out += String.fromCharCode(digits[k] + 33)
  }
  return out + '~>'
}
const ascii85Decode = (s: string) => {
  s = s.trim().replace(/^<~|~>$/g, '').replace(/\s+/g, '')
  const bytes = []
  let block = []
  for (const c of s) {
    if (c === 'z') { bytes.push(0, 0, 0, 0); continue }
    const v = c.charCodeAt(0) - 33
    if (v < 0 || v >= 85) throw new Error('无效字符')
    block.push(v)
    if (block.length === 5) {
      let val = 0
      for (const b of block) val = val * 85 + b
      bytes.push((val >>> 24) & 255, (val >>> 16) & 255, (val >>> 8) & 255, val & 255)
      block = []
    }
  }
  if (block.length) {
    while (block.length < 5) block.push(84)
    let val = 0
    for (const b of block) val = val * 85 + b
    const tmp = [(val >>> 24) & 255, (val >>> 16) & 255, (val >>> 8) & 255, val & 255]
    bytes.push(...tmp.slice(0, block.length - 1))
  }
  return new Uint8Array(bytes)
}

// 编码信息
interface EncodingInfo {
  id: string; name: string; desc: string; category: string; base: number; uses: string[]
}

const ENCODINGS: Record<string, EncodingInfo> = {
  base2: { id: 'base2', name: 'Base2 (Binary)', desc: '二进制', category: '标准', base: 2, uses: ['机器码', '位操作'] },
  base4: { id: 'base4', name: 'Base4 (DNA)', desc: 'DNA编码', category: '标准', base: 4, uses: ['生物信息'] },
  base8: { id: 'base8', name: 'Base8 (Octal)', desc: '八进制', category: '标准', base: 8, uses: ['Unix权限'] },
  base10: { id: 'base10', name: 'Base10 (Decimal)', desc: '十进制', category: '标准', base: 10, uses: ['日常计算'] },
  base12: { id: 'base12', name: 'Base12', desc: '十二进制', category: '标准', base: 12, uses: ['时间系统'] },
  base16: { id: 'base16', name: 'Base16 (Hex)', desc: '十六进制', category: '标准', base: 16, uses: ['哈希', '颜色'] },
  base20: { id: 'base20', name: 'Base20', desc: '二十进制', category: '标准', base: 20, uses: ['玛雅进制'] },
  base24: { id: 'base24', name: 'Base24', desc: '24进制', category: '标准', base: 24, uses: ['紧凑编码'] },
  base26: { id: 'base26', name: 'Base26', desc: '字母表', category: '标准', base: 26, uses: ['列号', 'Excel'] },
  base32: { id: 'base32', name: 'Base32', desc: 'RFC 4648', category: '标准', base: 32, uses: ['Google 2FA', 'OTP'] },
  base32hex: { id: 'base32hex', name: 'Base32 Hex', desc: 'Base32变体', category: '特殊', base: 32, uses: ['Hex编码'] },
  base36: { id: 'base36', name: 'Base36', desc: '数字+字母', category: '标准', base: 36, uses: ['短链', 'ID'] },
  base40: { id: 'base40', name: 'Base40', desc: 'ASCII子集', category: '实验', base: 40, uses: ['ASCII编码'] },
  base45: { id: 'base45', name: 'Base45', desc: 'RFC 9285', category: '标准', base: 45, uses: ['健康码', '二维码'] },
  base52: { id: 'base52', name: 'Base52', desc: '纯字母', category: '标准', base: 52, uses: ['字母编码'] },
  base56: { id: 'base56', name: 'Base56', desc: '去混淆', category: '实验', base: 56, uses: ['安全编码'] },
  base58: { id: 'base58', name: 'Base58', desc: 'Bitcoin', category: '标准', base: 58, uses: ['比特币', 'IPFS'] },
  base60: { id: 'base60', name: 'Base60', desc: '六十进制', category: '标准', base: 60, uses: ['时间制'] },
  base62: { id: 'base62', name: 'Base62', desc: '0-9A-Za-z', category: '标准', base: 62, uses: ['短链', 'ID'] },
  base64: { id: 'base64', name: 'Base64', desc: 'RFC 4648', category: '标准', base: 64, uses: ['Web传输', '邮件'] },
  base64url: { id: 'base64url', name: 'Base64 URL', desc: 'URL安全', category: '特殊', base: 64, uses: ['JWT', 'URL'] },
  base66: { id: 'base66', name: 'Base66', desc: '扩展Base64', category: '实验', base: 66, uses: ['扩展编码'] },
  base70: { id: 'base70', name: 'Base70', desc: '增强可读', category: '实验', base: 70, uses: ['可读编码'] },
  base85_ascii85: { id: 'base85_ascii85', name: 'Base85 (Ascii85)', desc: 'Adobe', category: '高密度', base: 85, uses: ['PDF', 'PostScript'] },
  base85_z85: { id: 'base85_z85', name: 'Base85 (Z85)', desc: 'ZeroMQ', category: '高密度', base: 85, uses: ['ZeroMQ'] },
  base91: { id: 'base91', name: 'Base91', desc: '高效编码', category: '高密度', base: 91, uses: ['82%密度'] },
  base94: { id: 'base94', name: 'Base94', desc: '全ASCII', category: '高密度', base: 94, uses: ['全字符'] },
  base100: { id: 'base100', name: 'Base100 (Emoji)', desc: 'Emoji编码', category: '趣味', base: 100, uses: ['趣味', '可视化', '社交'] },
  base122: { id: 'base122', name: 'Base122', desc: '高密度ASCII', category: '高密度', base: 122, uses: ['高效传输'] },
  base128: { id: 'base128', name: 'Base128', desc: '7-bit ASCII', category: '实验', base: 128, uses: ['二进制编码'] },
}

type EncodingType = keyof typeof ENCODINGS

export default function Page() {
  const [mode, setMode] = useState<'text' | 'file'>('text')
  const [encoding, setEncoding] = useState<EncodingType>('base64')
  const [direction, setDirection] = useState<'encode' | 'decode'>('encode')
  const [category, setCategory] = useState<string>('all')
  const [textInput, setTextInput] = useState('Hello, World!')
  const [file, setFile] = useState<File | null>(null)
  const [fileOutput, setFileOutput] = useState('')
  const [encodedInput, setEncodedInput] = useState('')
  const [decodeMime, setDecodeMime] = useState('application/octet-stream')
  const [decodeFilename, setDecodeFilename] = useState('file.bin')

  const filteredEncodings = useMemo(() => {
    return Object.values(ENCODINGS).filter(e => category === 'all' || e.category === category)
  }, [category])

  const textOutput = useMemo(() => {
    if (mode !== 'text') return ''
    try {
      const enc = new TextEncoder()
      const dec = new TextDecoder()
      const bytes = enc.encode(textInput)
      
      if (direction === 'encode') {
        const codecMap: Record<string, any> = {}
        for (const [key, alphabet] of Object.entries(ALPHABETS)) {
          if (!['z85'].includes(key)) codecMap[key] = baseX(alphabet)
        }
        
        switch (encoding) {
          case 'base2': return codecMap.base2.encode(bytes)
          case 'base4': return codecMap.base4.encode(bytes)
          case 'base8': return codecMap.base8.encode(bytes)
          case 'base10': return codecMap.base10.encode(bytes)
          case 'base12': return codecMap.base12.encode(bytes)
          case 'base16': return codecMap.base16.encode(bytes)
          case 'base20': return codecMap.base20.encode(bytes)
          case 'base24': return codecMap.base24.encode(bytes)
          case 'base26': return codecMap.base26.encode(bytes)
          case 'base32': return b32enc(textInput)
          case 'base32hex': return base32hexCodec.encode(bytes)
          case 'base36': return codecMap.base36.encode(bytes)
          case 'base40': return codecMap.base40.encode(bytes)
          case 'base45': return codecMap.base45.encode(bytes)
          case 'base52': return codecMap.base52.encode(bytes)
          case 'base56': return codecMap.base56.encode(bytes)
          case 'base58': return bs58.encode(bytes)
          case 'base60': return codecMap.base60.encode(bytes)
          case 'base62': return codecMap.base62.encode(bytes)
          case 'base64': return base64Encode(textInput)
          case 'base64url': return base64UrlEncode(textInput)
          case 'base66': return codecMap.base66.encode(bytes)
          case 'base70': return codecMap.base70.encode(bytes)
          case 'base85_ascii85': return ascii85Encode(bytes)
          case 'base85_z85': return z85Encode(bytes)
          case 'base91': return codecMap.base91.encode(bytes)
          case 'base94': return codecMap.base94.encode(bytes)
          case 'base100': return base100Encode(bytes)
          case 'base122': return codecMap.base122.encode(bytes)
          case 'base128': return codecMap.base128.encode(bytes)
          default: return ''
        }
      } else {
        // Decode
        const codecMap: Record<string, any> = {}
        for (const [key, alphabet] of Object.entries(ALPHABETS)) {
          if (!['z85'].includes(key)) codecMap[key] = baseX(alphabet)
        }
        
        let decodedBytes: Uint8Array
        switch (encoding) {
          case 'base2': decodedBytes = codecMap.base2.decode(textInput); break
          case 'base4': decodedBytes = codecMap.base4.decode(textInput); break
          case 'base8': decodedBytes = codecMap.base8.decode(textInput); break
          case 'base10': decodedBytes = codecMap.base10.decode(textInput); break
          case 'base12': decodedBytes = codecMap.base12.decode(textInput); break
          case 'base16': decodedBytes = codecMap.base16.decode(textInput); break
          case 'base20': decodedBytes = codecMap.base20.decode(textInput); break
          case 'base24': decodedBytes = codecMap.base24.decode(textInput); break
          case 'base26': decodedBytes = codecMap.base26.decode(textInput); break
          case 'base32': return b32dec(textInput)
          case 'base32hex': decodedBytes = base32hexCodec.decode(textInput); break
          case 'base36': decodedBytes = codecMap.base36.decode(textInput); break
          case 'base40': decodedBytes = codecMap.base40.decode(textInput); break
          case 'base45': decodedBytes = codecMap.base45.decode(textInput); break
          case 'base52': decodedBytes = codecMap.base52.decode(textInput); break
          case 'base56': decodedBytes = codecMap.base56.decode(textInput); break
          case 'base58': decodedBytes = bs58.decode(textInput); break
          case 'base60': decodedBytes = codecMap.base60.decode(textInput); break
          case 'base62': decodedBytes = codecMap.base62.decode(textInput); break
          case 'base64': return base64Decode(textInput)
          case 'base64url': return base64UrlDecode(textInput)
          case 'base66': decodedBytes = codecMap.base66.decode(textInput); break
          case 'base70': decodedBytes = codecMap.base70.decode(textInput); break
          case 'base85_ascii85': decodedBytes = ascii85Decode(textInput); break
          case 'base85_z85': decodedBytes = z85Decode(textInput); break
          case 'base91': decodedBytes = codecMap.base91.decode(textInput); break
          case 'base94': decodedBytes = codecMap.base94.decode(textInput); break
          case 'base100': decodedBytes = base100Decode(textInput); break
          case 'base122': decodedBytes = codecMap.base122.decode(textInput); break
          case 'base128': decodedBytes = codecMap.base128.decode(textInput); break
          default: return ''
        }
        return dec.decode(decodedBytes)
      }
    } catch (e: any) {
      return '❌ 错误: ' + (e.message || String(e))
    }
  }, [mode, encoding, direction, textInput])

  async function encodeFile() {
    if (!file) return
    try {
      const buffer = await file.arrayBuffer()
      const bytes = new Uint8Array(buffer)
      let result = ''
      
      // 简化：只实现主要编码
      switch (encoding) {
        case 'base64': {
          const reader = new FileReader()
          result = await new Promise<string>((res, rej) => {
            reader.onload = () => res(String(reader.result))
            reader.onerror = rej
            reader.readAsDataURL(file)
          })
          break
        }
        case 'base32': result = b32enc(bytes); break
        case 'base58': result = bs58.encode(bytes); break
        case 'base85_z85': result = z85Encode(bytes); break
        case 'base85_ascii85': result = ascii85Encode(bytes); break
        case 'base100': result = base100Encode(bytes); break
        default: {
          const alphabet = ALPHABETS[encoding as keyof typeof ALPHABETS]
          if (alphabet) {
            const codec = baseX(alphabet)
            result = codec.encode(bytes)
          } else {
            result = base64Encode(new TextDecoder().decode(bytes))
          }
        }
      }
      setFileOutput(result)
    } catch (e: any) {
      setFileOutput('❌ ' + (e.message || String(e)))
    }
  }

  function decodeToFile() {
    if (!encodedInput.trim()) return
    try {
      let bytes: Uint8Array
      
      if (encoding === 'base64') {
        const dataUrl = encodedInput.startsWith('data:') ? encodedInput : `data:${decodeMime};base64,${encodedInput}`
        const a = document.createElement('a')
        a.href = dataUrl
        a.download = decodeFilename
        a.click()
        return
      }
      
      // 其他格式
      switch (encoding) {
        case 'base32': 
          const b32result = b32dec(encodedInput)
          bytes = new Uint8Array(new TextEncoder().encode(b32result))
          break
        case 'base58': bytes = bs58.decode(encodedInput); break
        case 'base85_z85': bytes = z85Decode(encodedInput); break
        case 'base85_ascii85': bytes = ascii85Decode(encodedInput); break
        case 'base100': bytes = base100Decode(encodedInput); break
        default: {
          const alphabet = ALPHABETS[encoding as keyof typeof ALPHABETS]
          if (alphabet) {
            const codec = baseX(alphabet)
            bytes = codec.decode(encodedInput)
          } else {
            bytes = new Uint8Array(0)
          }
        }
      }
      
      const blob = new Blob([new Uint8Array(bytes)], { type: decodeMime })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = decodeFilename
      a.click()
      URL.revokeObjectURL(url)
    } catch (e: any) {
      alert('❌ ' + (e.message || String(e)))
    }
  }

  const info = ENCODINGS[encoding]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="text-center space-y-2 py-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          🎯 Base 编码大全
        </h1>
        <p className="text-slate-400">支持 {Object.keys(ENCODINGS).length} 种编码格式 · Base2 到 Base94</p>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">📋 模式</label>
            <select className="w-full rounded bg-slate-700 border border-slate-600 px-3 py-2" value={mode} onChange={(e) => setMode(e.target.value as any)}>
              <option value="text">文本</option>
              <option value="file">文件</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold">🎨 分类</label>
            <select className="w-full rounded bg-slate-700 border border-slate-600 px-3 py-2" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">全部 ({Object.keys(ENCODINGS).length})</option>
              <option value="标准">标准编码</option>
              <option value="高密度">高密度</option>
              <option value="特殊">特殊编码</option>
              <option value="趣味">趣味编码 🎨</option>
              <option value="实验">实验性</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold">🔢 编码</label>
            <select className="w-full rounded bg-slate-700 border border-slate-600 px-3 py-2 font-mono text-sm" value={encoding} onChange={(e) => setEncoding(e.target.value as EncodingType)}>
              {filteredEncodings.map(enc => (
                <option key={enc.id} value={enc.id}>{enc.name}</option>
              ))}
            </select>
          </div>
          
          {mode === 'text' && (
            <div className="space-y-2">
              <label className="text-sm font-semibold">⚡ 方向</label>
              <select className="w-full rounded bg-slate-700 border border-slate-600 px-3 py-2" value={direction} onChange={(e) => setDirection(e.target.value as any)}>
                <option value="encode">编码</option>
                <option value="decode">解码</option>
              </select>
            </div>
          )}
        </div>
        
        <div className="mt-4 bg-blue-900/20 rounded-lg p-4 border border-blue-700/30">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-blue-300">{info.name}</h3>
              <p className="text-sm text-slate-300 mt-1">{info.desc}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                {info.uses.map((use, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded">{use}</span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-400">{info.base}</div>
              <div className="text-xs text-slate-400">进制</div>
            </div>
          </div>
        </div>
      </div>

      {mode === 'text' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="block text-lg font-semibold">
              {direction === 'encode' ? '📝 输入文本' : '🔐 输入编码'}
            </label>
            <textarea 
              className="w-full h-64 rounded-lg bg-slate-800 border border-slate-700 p-4 font-mono text-sm resize-none"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={direction === 'encode' ? '输入要编码的文本...' : '输入要解码的内容...'}
            />
            <div className="text-xs text-slate-400">
              {textInput.length} 字符 · {new Blob([textInput]).size} 字节
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="block text-lg font-semibold">
              {direction === 'encode' ? '🔐 编码结果' : '📝 解码结果'}
            </label>
            <textarea 
              className="w-full h-64 rounded-lg bg-slate-800 border border-slate-700 p-4 font-mono text-sm resize-none"
              value={textOutput}
              readOnly
            />
            <div className="flex justify-between items-center">
              <div className="text-xs text-slate-400">
                {textOutput.length} 字符 · {new Blob([textOutput]).size} 字节
                {textInput && textOutput && !textOutput.startsWith('❌') && (
                  <span className="ml-2 text-blue-400">
                    · {((new Blob([textOutput]).size / new Blob([textInput]).size) * 100).toFixed(1)}% 效率
                  </span>
                )}
              </div>
              {textOutput && !textOutput.startsWith('❌') && (
                <button
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500"
                  onClick={() => {
                    navigator.clipboard.writeText(textOutput)
                    alert('✅ 已复制！')
                  }}
                >
                  📋 复制
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {mode === 'file' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <section className="space-y-4 p-6 bg-slate-800/30 rounded-xl border border-slate-700">
            <h3 className="text-xl font-semibold">📁 文件 → 编码</h3>
            <input type="file" className="w-full" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            {file && (
              <div className="text-sm bg-slate-700/30 rounded p-3">
                <div>📄 {file.name}</div>
                <div>📊 {(file.size / 1024).toFixed(2)} KB</div>
              </div>
            )}
            <button 
              className="w-full px-6 py-3 rounded-lg bg-green-600 hover:bg-green-500 disabled:bg-gray-600 font-semibold"
              onClick={encodeFile}
              disabled={!file}
            >
              🔐 转换
            </button>
            
            {fileOutput && (
              <div className="space-y-3">
                <textarea 
                  className="w-full h-48 rounded-lg bg-slate-800 border border-slate-700 p-3 font-mono text-xs resize-none"
                  readOnly
                  value={fileOutput}
                />
                {!fileOutput.startsWith('❌') && (
                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 rounded bg-slate-700 hover:bg-slate-600" onClick={() => navigator.clipboard.writeText(fileOutput)}>
                      📋 复制
                    </button>
                    <a 
                      className="flex-1 px-4 py-2 rounded bg-slate-700 hover:bg-slate-600 text-center"
                      href={`data:text/plain;charset=utf-8,${encodeURIComponent(fileOutput)}`}
                      download={`${file?.name}.${encoding}.txt`}
                    >
                      💾 保存
                    </a>
                  </div>
                )}
              </div>
            )}
          </section>
          
          <section className="space-y-4 p-6 bg-slate-800/30 rounded-xl border border-slate-700">
            <h3 className="text-xl font-semibold">🔓 编码 → 文件</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold">文件名</label>
              <input 
                className="w-full rounded bg-slate-700 border border-slate-600 px-3 py-2"
                value={decodeFilename}
                onChange={(e) => setDecodeFilename(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold">MIME 类型</label>
              <input 
                className="w-full rounded bg-slate-700 border border-slate-600 px-3 py-2"
                value={decodeMime}
                onChange={(e) => setDecodeMime(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold">编码内容</label>
              <textarea 
                className="w-full h-48 rounded bg-slate-700 border border-slate-600 p-3 font-mono text-xs resize-none"
                value={encodedInput}
                onChange={(e) => setEncodedInput(e.target.value)}
              />
            </div>
            
            <button 
              className="w-full px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 font-semibold"
              onClick={decodeToFile}
              disabled={!encodedInput.trim()}
            >
              💾 解码下载
            </button>
          </section>
        </div>
      )}

      <details className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
        <summary className="cursor-pointer font-bold text-xl mb-4">📚 使用说明</summary>
        <div className="space-y-4 text-sm mt-4">
          <div>
            <h4 className="font-semibold mb-2">🔥 热门编码</h4>
            <ul className="space-y-1 text-xs ml-4">
              <li><code className="text-blue-400">Base64</code> - 最常用，Web标准</li>
              <li><code className="text-green-400">Base32</code> - Google 2FA</li>
              <li><code className="text-yellow-400">Base58</code> - 比特币地址</li>
              <li><code className="text-purple-400">Base62</code> - URL短链</li>
              <li><code className="text-pink-400">Base45</code> - 健康码</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">💡 提示</h4>
            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
              <li>Base2/Base4 会产生很长的输出</li>
              <li>文件模式建议 &lt; 10MB</li>
              <li>所有处理在浏览器本地完成</li>
              <li>使用分类快速筛选编码格式</li>
            </ul>
          </div>
        </div>
      </details>
      
      <details className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
        <summary className="cursor-pointer font-bold text-xl">📊 完整编码列表</summary>
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-4 py-2 text-left">编码</th>
                <th className="px-4 py-2">基数</th>
                <th className="px-4 py-2 text-left">类别</th>
                <th className="px-4 py-2 text-left">用途</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {Object.values(ENCODINGS).map(enc => (
                <tr key={enc.id} className="hover:bg-slate-700/30">
                  <td className="px-4 py-2 font-mono text-blue-300">{enc.name}</td>
                  <td className="px-4 py-2 text-center font-bold">{enc.base}</td>
                  <td className="px-4 py-2 text-xs">{enc.category}</td>
                  <td className="px-4 py-2 text-xs text-slate-400">{enc.uses.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}
