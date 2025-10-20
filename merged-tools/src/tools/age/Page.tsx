import { useMemo, useState } from 'react'

function diffYMD(birth: Date, now: Date) {
  let y = now.getFullYear() - birth.getFullYear()
  let m = now.getMonth() - birth.getMonth()
  let d = now.getDate() - birth.getDate()
  if (d < 0) {
    // 借上月天数
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    d += prevMonth.getDate()
    m -= 1
  }
  if (m < 0) {
    m += 12
    y -= 1
  }
  return { y, m, d }
}

function daysUntilNextBirthday(birth: Date, now = new Date()) {
  const year = now.getFullYear()
  let next = new Date(year, birth.getMonth(), birth.getDate())
  if (next < now) next = new Date(year + 1, birth.getMonth(), birth.getDate())
  const ms = next.getTime() - now.getTime()
  return Math.ceil(ms / 86400000)
}

export default function Page() {
  const today = new Date()
  const [birthday, setBirthday] = useState(() => {
    const y = today.getFullYear() - 20
    const m = (today.getMonth() + 1).toString().padStart(2, '0')
    const d = today.getDate().toString().padStart(2, '0')
    return `${y}-${m}-${d}`
  })

  const calc = useMemo(() => {
    const b = new Date(birthday + 'T00:00:00')
    if (isNaN(b.getTime())) return null
    const ymd = diffYMD(b, new Date())
    const days = daysUntilNextBirthday(b, new Date())
    return { ymd, days }
  }, [birthday])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input className="input" type="date" value={birthday} onChange={(e)=>setBirthday(e.target.value)} />
      </div>
      {calc && (
        <div className="rounded border p-3 bg-gray-50 dark:bg-gray-900/40 space-y-1">
          <div>年龄：{calc.ymd.y} 年 {calc.ymd.m} 月 {calc.ymd.d} 天</div>
          <div>距离下次生日：{calc.days} 天</div>
        </div>
      )}
    </div>
  )
}
