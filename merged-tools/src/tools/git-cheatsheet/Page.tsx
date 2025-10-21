import { useMemo, useState } from 'react'
import Input from '../../components/Input'

type Item = { cmd: string; desc: string; cat: string }

const DATA: Item[] = [
  { cat:'配置', cmd:'git config --global user.name "Your Name"', desc:'设置用户名' },
  { cat:'配置', cmd:'git config --global user.email you@example.com', desc:'设置邮箱' },
  { cat:'初始化', cmd:'git init', desc:'初始化仓库' },
  { cat:'克隆', cmd:'git clone <url>', desc:'克隆远程仓库' },
  { cat:'状态', cmd:'git status', desc:'查看状态' },
  { cat:'暂存', cmd:'git add .', desc:'暂存所有变更' },
  { cat:'提交', cmd:'git commit -m "message"', desc:'提交变更' },
  { cat:'分支', cmd:'git branch', desc:'列出分支' },
  { cat:'分支', cmd:'git checkout -b <name>', desc:'新建并切换分支' },
  { cat:'合并', cmd:'git merge <branch>', desc:'合并分支' },
  { cat:'拉取', cmd:'git pull', desc:'拉取更新' },
  { cat:'推送', cmd:'git push -u origin <branch>', desc:'推送到远程' },
  { cat:'重置', cmd:'git reset --hard <commit>', desc:'硬重置到某提交' },
  { cat:'回滚', cmd:'git revert <commit>', desc:'回滚提交（生成逆向提交）' },
  { cat:'暂存区', cmd:'git stash', desc:'保存工作区快照' },
  { cat:'打标签', cmd:'git tag v1.0.0', desc:'创建标签' },
  { cat:'日志', cmd:'git log --oneline --graph --decorate --all', desc:'图形化日志' },
]

export default function Page(){
  const [q, setQ] = useState('')
  const list = useMemo(()=>{
    const k = q.trim().toLowerCase()
    if (!k) return DATA
    return DATA.filter(x=> x.cmd.toLowerCase().includes(k) || x.desc.toLowerCase().includes(k) || x.cat.toLowerCase().includes(k))
  }, [q])

  const cats = useMemo(()=> Array.from(new Set(list.map(x=>x.cat))), [list])

  return (
    <div className="space-y-3">
      <Input  variant="simple" className="" placeholder="搜索命令或说明" value={q} onChange={(e)=>setQ(e.target.value)} />
      {cats.map(cat=> (
        <div key={cat} className="space-y-2">
          <div className="text-slate-400">{cat}</div>
          <div className="grid md:grid-cols-2 gap-2">
            {list.filter(x=>x.cat===cat).map((it,idx)=> (
              <div key={idx} className="bg-slate-900 rounded p-3">
                <div className="font-mono text-xs break-all">{it.cmd}</div>
                <div className="text-sm text-slate-400">{it.desc}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
