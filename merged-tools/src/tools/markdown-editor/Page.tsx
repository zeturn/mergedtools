import { useEffect, useRef, useState } from 'react'

type EditorType = 'markdown' | 'wysiwyg'

export default function Page() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const editorRef = useRef<any>(null)
  const [type, setType] = useState<EditorType>('markdown')
  const [ready, setReady] = useState(false)
  const [value, setValue] = useState<string>(`# 欢迎使用 Markdown 富文本编辑器\n\n- 左上角切换 Markdown/WYSIWYG\n- 支持导入/导出内容\n- 支持代码块\n\n\`\`\`ts\nconst hello: string = 'world'\nconsole.log(hello)\n\`\`\``)

  // 动态加载 editor 以避免打包体积过大
  useEffect(() => {
    let disposed = false
    async function mount() {
      const [{ default: Editor },] = await Promise.all([
        import('@toast-ui/editor'),
        import('@toast-ui/editor/dist/toastui-editor.css'),
      ])
      if (disposed) return
      const inst = new Editor({
        el: containerRef.current!,
        previewStyle: 'vertical',
        height: '600px',
        initialEditType: type,
        initialValue: value,
        usageStatistics: false,
      })
      editorRef.current = inst
      setReady(true)
    }
    mount()
    return () => { disposed = true; editorRef.current?.destroy?.(); editorRef.current = null }
  // 初次挂载
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 同步模式切换
  useEffect(() => {
    if (!ready) return
    editorRef.current?.changeMode?.(type)
  }, [type, ready])

  // 同步外部 value 到 editor（仅在初始化后）
  useEffect(() => {
    if (!ready) return
    const cur = editorRef.current?.getMarkdown?.()
    if (typeof cur === 'string' && cur !== value) {
      editorRef.current?.setMarkdown?.(value)
    }
  }, [value, ready])

  function onImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => setValue(String(reader.result ?? ''))
    reader.readAsText(f)
  }

  function doCopy() {
    const md: string = editorRef.current?.getMarkdown?.() ?? ''
    navigator.clipboard?.writeText(md)
  }

  function download() {
    const md: string = editorRef.current?.getMarkdown?.() ?? ''
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'document.md'; a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-center">
        <label className="flex items-center gap-2">
          <span>模式</span>
          <select className="select" value={type} onChange={(e)=>setType(e.target.value as EditorType)}>
            <option value="markdown">Markdown</option>
            <option value="wysiwyg">WYSIWYG</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          <input type="file" accept=".md,.markdown,.txt" onChange={onImportFile} />
        </label>
        <button className="btn" onClick={doCopy}>复制 Markdown</button>
        <button className="btn" onClick={download}>下载 .md</button>
      </div>

      <div ref={containerRef} className="rounded overflow-hidden bg-white text-black" />
    </div>
  )
}
