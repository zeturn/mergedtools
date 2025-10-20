import { useState } from 'react'

export default function Page(){
  const [cmd, setCmd] = useState('docker run -d --name myapp -p 8080:80 -e NODE_ENV=production -v /data:/app/data --restart unless-stopped myimage:latest')
  const [yaml, setYaml] = useState('')

  function convert(){
    try{ setYaml(toCompose(cmd)) }catch(e: unknown){ setYaml('解析失败：'+ String(e)) }
  }

  return (
    <div className="space-y-3">
      <textarea className="w-full min-h-32 bg-slate-900 rounded p-2 font-mono" value={cmd} onChange={(e)=>setCmd(e.target.value)} />
      <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={convert}>转换</button>
      <pre className="bg-slate-900 p-3 rounded overflow-auto text-sm"><code>{yaml}</code></pre>
      <div className="text-xs text-slate-400">提示：简化转换，支持 --name/-p/-e/-v/--restart/-d 等常见参数；如有复杂场景可手工再调整。</div>
    </div>
  )
}

function toCompose(command: string){
  const tokens = shlex(command)
  const name = valAfter(tokens, '--name')
  const image = tokens[tokens.length-1]
  const ports = vals(tokens, '-p').map(x=> `  - "${x}"`)
  const envs = vals(tokens, '-e').map(x=> `      - ${x}`)
  const vols = vals(tokens, '-v').map(x=> `      - ${x}`)
  const restart = valAfter(tokens, '--restart')
  const detach = tokens.includes('-d')

  const lines = [
    'services:',
    `  ${name||'app'}:`,
    `    image: ${image}`,
  ]
  if (detach) lines.push(`    deploy:
      replicas: 1`)
  if (restart) lines.push(`    restart: ${restart}`)
  if (ports.length) lines.push('    ports:', ...ports)
  if (envs.length) lines.push('    environment:', ...envs)
  if (vols.length) lines.push('    volumes:', ...vols)
  return lines.join('\n')
}

function shlex(s: string){
  const re = /\s+|"([^"]*)"|'([^']*)'/g
  const out: string[] = []
  let i = 0, m: RegExpExecArray | null
  while ((m = re.exec(s))){
    const gap = s.slice(i, m.index).trim()
    if (gap) out.push(gap)
    if (m[1]!=null) out.push(m[1])
    else if (m[2]!=null) out.push(m[2])
    i = m.index + m[0].length
  }
  const rest = s.slice(i).trim(); if (rest) out.push(rest)
  return out
}

function valAfter(tokens: string[], key: string){
  const i = tokens.indexOf(key)
  return i>=0? tokens[i+1]: ''
}

function vals(tokens: string[], key: string){
  const arr: string[] = []
  for (let i=0;i<tokens.length;i++) if (tokens[i]===key) arr.push(tokens[i+1])
  return arr
}
