import { useEffect, useState } from 'react'

type Mod = typeof import('sql-formatter')

export default function Page(){
  const [sql, setSql] = useState('select id,name from users where created_at>now()-interval 7 day')
  const [out, setOut] = useState('')
  const [dialect, setDialect] = useState<'sql'|'mysql'|'postgresql'|'sqlite'|'bigquery'|'db2'|'mariadb'|'n1ql'|'plsql'|'transactsql'|'redshift'|'spark'|'tsql'>('mysql')
  const [indent, setIndent] = useState(2)

  async function run(){
    const m: Mod = await import('sql-formatter')
    const res = m.format(sql, { language: dialect as any, tabWidth: indent })
    setOut(res)
  }
  useEffect(()=>{ run() }, [])

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center flex-wrap">
        <label className="text-sm text-slate-400">方言</label>
        <select className="rounded bg-slate-800 p-2" value={dialect} onChange={(e)=>setDialect(e.target.value as any)}>
          <option value="sql">SQL (generic)</option>
          <option value="mysql">MySQL</option>
          <option value="postgresql">PostgreSQL</option>
          <option value="sqlite">SQLite</option>
          <option value="mariadb">MariaDB</option>
          <option value="plsql">PL/SQL</option>
          <option value="tsql">T-SQL</option>
          <option value="redshift">Redshift</option>
          <option value="spark">Spark</option>
          <option value="bigquery">BigQuery</option>
          <option value="db2">DB2</option>
          <option value="n1ql">N1QL</option>
          <option value="transactsql">TransactSQL</option>
        </select>
        <label className="text-sm text-slate-400">缩进</label>
        <input type="number" min={1} max={8} className="w-24 rounded bg-slate-800 p-2" value={indent} onChange={(e)=>setIndent(Number(e.target.value))} />
        <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={run}>格式化</button>
      </div>
      <textarea className="w-full min-h-32 rounded bg-slate-800 p-2 font-mono" value={sql} onChange={(e)=>setSql(e.target.value)} />
      <pre className="w-full min-h-32 rounded bg-slate-900 p-2 font-mono whitespace-pre-wrap break-words">{out}</pre>
    </div>
  )
}
