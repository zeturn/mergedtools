// Web Worker for bcrypt operations
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import bcrypt from 'bcryptjs'

type Req =
  | { id: number; action: 'hash'; password: string; rounds: number }
  | { id: number; action: 'compare'; password: string; hash: string }

type Res =
  | { id: number; ok: true; result: string | boolean }
  | { id: number; ok: false; error: string }

self.onmessage = async (ev: MessageEvent<Req>) => {
  const msg = ev.data
  try {
    if (msg.action === 'hash') {
      const result = await bcrypt.hash(msg.password, msg.rounds)
      const res: Res = { id: msg.id, ok: true, result }
      ;(self as any).postMessage(res)
    } else if (msg.action === 'compare') {
      const result = await bcrypt.compare(msg.password, msg.hash)
      const res: Res = { id: msg.id, ok: true, result }
      ;(self as any).postMessage(res)
    }
  } catch (e: any) {
    const res: Res = { id: msg.id, ok: false, error: e?.message || 'error' }
    ;(self as any).postMessage(res)
  }
}
