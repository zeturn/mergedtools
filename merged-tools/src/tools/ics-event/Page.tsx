import { useMemo, useState } from 'react'
import { Textarea } from '../../components/Input'

function fmtDateLocal(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${d}T${hh}:${mm}`
}

function toICSDate(dt: Date, allDay: boolean) {
  if (allDay) {
    const y = dt.getFullYear()
    const m = String(dt.getMonth() + 1).padStart(2, '0')
    const d = String(dt.getDate()).padStart(2, '0')
    return `${y}${m}${d}`
  }
  const y = dt.getUTCFullYear()
  const m = String(dt.getUTCMonth() + 1).padStart(2, '0')
  const d = String(dt.getUTCDate()).padStart(2, '0')
  const hh = String(dt.getUTCHours()).padStart(2, '0')
  const mm = String(dt.getUTCMinutes()).padStart(2, '0')
  const ss = '00'
  return `${y}${m}${d}T${hh}${mm}${ss}Z`
}

function foldLine(s: string) {
  // ICS 要求 75 字节换行，这里简化按 70 字符折行
  const lines: string[] = []
  for (let i = 0; i < s.length; i += 70) lines.push(s.slice(i, i + 70))
  return lines.join('\r\n ')
}

function escapeICS(s: string) {
  return s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;')
}

export default function Page() {
  const now = new Date()
  const [title, setTitle] = useState('会议')
  const [desc, setDesc] = useState('讨论路线图')
  const [loc, setLoc] = useState('会议室 A / Zoom')
  const [allDay, setAllDay] = useState(false)
  const [start, setStart] = useState(fmtDateLocal(now))
  const [end, setEnd] = useState(fmtDateLocal(new Date(now.getTime() + 60 * 60 * 1000)))
  const [alarmMin, setAlarmMin] = useState(10)
  const [addAlarm, setAddAlarm] = useState(true)

  const ics = useMemo(() => {
    const uid = `${Date.now()}@local`
    const dtStart = new Date(start)
    const dtEnd = new Date(end)
    const lines: string[] = []
    lines.push('BEGIN:VCALENDAR')
    lines.push('VERSION:2.0')
    lines.push('PRODID:-//merged-tools//ics//CN')
    lines.push('CALSCALE:GREGORIAN')
    lines.push('METHOD:PUBLISH')
    lines.push('BEGIN:VEVENT')
    lines.push(`UID:${uid}`)
    lines.push(`DTSTAMP:${toICSDate(new Date(), false)}`)
    if (allDay) {
      lines.push(`DTSTART;VALUE=DATE:${toICSDate(dtStart, true)}`)
      lines.push(`DTEND;VALUE=DATE:${toICSDate(dtEnd, true)}`)
    } else {
      lines.push(`DTSTART:${toICSDate(dtStart, false)}`)
      lines.push(`DTEND:${toICSDate(dtEnd, false)}`)
    }
    if (title) lines.push(foldLine(`SUMMARY:${escapeICS(title)}`))
    if (desc) lines.push(foldLine(`DESCRIPTION:${escapeICS(desc)}`))
    if (loc) lines.push(foldLine(`LOCATION:${escapeICS(loc)}`))
    if (addAlarm && alarmMin > 0) {
      lines.push('BEGIN:VALARM')
      lines.push('ACTION:DISPLAY')
      lines.push(`DESCRIPTION:${escapeICS(title) || 'Event Reminder'}`)
      lines.push(`TRIGGER:-PT${Math.floor(alarmMin)}M`)
      lines.push('END:VALARM')
    }
    lines.push('END:VEVENT')
    lines.push('END:VCALENDAR')
    return lines.join('\r\n') + '\r\n'
  }, [title, desc, loc, allDay, start, end, addAlarm, alarmMin])

  const onCopy = async () => { await navigator.clipboard.writeText(ics); alert('已复制 ICS') }
  const onDownload = () => {
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'event.ics'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <label className="text-sm text-gray-500">标题<input className="input" value={title} onChange={(e)=>setTitle(e.target.value)} /></label>
        <label className="text-sm text-gray-500">地点<input className="input" value={loc} onChange={(e)=>setLoc(e.target.value)} /></label>
        <label className="text-sm text-gray-500 sm:col-span-2">描述<Textarea variant="simple" className="h-20" value={desc} onChange={(e)=>setDesc(e.target.value)} /></label>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-500"><input type="checkbox" checked={allDay} onChange={(e)=>setAllDay(e.target.checked)} /> 全天</label>
        <label className="flex items-center gap-2 text-sm text-gray-500">开始<input className="input" type="datetime-local" value={start} onChange={(e)=>setStart(e.target.value)} disabled={allDay} /></label>
        <label className="flex items-center gap-2 text-sm text-gray-500">结束<input className="input" type="datetime-local" value={end} onChange={(e)=>setEnd(e.target.value)} disabled={allDay} /></label>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-500"><input type="checkbox" checked={addAlarm} onChange={(e)=>setAddAlarm(e.target.checked)} /> 提前提醒</label>
        <label className="flex items-center gap-2 text-sm text-gray-500">分钟<input className="input w-24" type="number" min={1} max={1440} value={alarmMin} onChange={(e)=>setAlarmMin(Math.max(1, Math.min(1440, Number(e.target.value)||10)))} /></label>
      </div>
      <div className="flex gap-2">
        <button className="btn" onClick={onCopy}>复制 ICS</button>
        <button className="btn" onClick={onDownload}>下载 .ics</button>
      </div>
      <details>
        <summary className="cursor-pointer text-sm text-gray-500">预览 ICS 文本</summary>
        <pre className="rounded border p-2 bg-gray-50 dark:bg-gray-900/40 whitespace-pre">{ics}</pre>
      </details>
    </div>
  )
}
