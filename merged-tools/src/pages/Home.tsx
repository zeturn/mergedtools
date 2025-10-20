import { Link } from 'react-router-dom'
import LandingOrnaments from '../components/LandingOrnaments'
import StatBar from '../components/StatBar'
import ShortcutHints from '../components/ShortcutHints'

export default function Home() {


  return (
    <div className="relative">
      {/* 全屏固定渐变背景 */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(30,58,138,0.35),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(15,118,110,0.25),transparent_60%)]" aria-hidden="true" />
      <LandingOrnaments />

      {/* 顶部 Hero：左标题右图案 */}
      <section className="py-10 lg:py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs border border-slate-700 bg-slate-800/60 text-slate-300">
              <span>稳定优先</span>
              <span className="text-slate-500">·</span>
              <span>无需 AI 也可靠</span>
            </div>
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-cyan-200 to-emerald-200">Merged Tools</h1>
            <p className="mt-4 text-slate-300 text-lg leading-relaxed">
              比 AI 更稳定的实用工具集合。我们专注 determinism 和可预期性：本地执行、开源实现、即点即用。
            </p>
            <StatBar />
          </div>
          <div className="flex justify-center md:justify-end">
            <div className="w-56 h-56 md:w-72 md:h-72 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-cyan-400/10 to-emerald-400/10 border border-slate-700 shadow-inner flex items-center justify-center">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-indigo-500/30 border border-indigo-400/40 rotate-12 animate-rotate-slow" />
            </div>
          </div>
        </div>
      </section>

      {/* Get Start 行 */}
      <section className="mt-2 flex items-center gap-3">
        <Link to="/menu" className="px-5 py-3 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow hover:shadow-indigo-500/20">
          Get Start
        </Link>
        <a href="#advantages" className="px-5 py-3 rounded-md bg-slate-800/70 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700">
          了解优势
        </a>
      </section>
      <ShortcutHints />

      {/* 优势 */}
      <section id="advantages" className="grid md:grid-cols-3 gap-5 mt-6">
        {[{
          title: '无需网络 · 即可使用',
          desc: '多数工具在浏览器直接运行，无后端依赖，离线也能用。'
        }, {
          title: '确定性输出',
          desc: '同样的输入得到同样的结果，方便验证与自动化。'
        }, {
          title: '开源透明',
          desc: '代码可审计，行为可预测，放心用于工作流。'
        }].map((f) => (
          <div key={f.title} className="rounded-xl bg-slate-800/70 border border-slate-700 p-6 shadow hover:shadow-lg hover:border-slate-500 transition">
            <h3 className="text-xl font-semibold">{f.title}</h3>
            <p className="text-slate-400 mt-2">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* 介绍 */}
      <section className="mt-10 rounded-2xl border border-slate-700 bg-slate-800/60 p-6 md:p-8">
        <h2 className="text-2xl font-bold">介绍</h2>
        <p className="mt-2 text-slate-300">
          常见格式转换、编码/解码、数据处理等都支持快捷键与复制粘贴，适合融入团队协作与自动化流水线。无登录、隐私本地、轻量快速。
        </p>
      </section>

      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Merged Tools · MIT License ·
        <Link to="/shortcuts" className="text-slate-300 hover:underline ml-2">快捷键说明</Link>
      </footer>
    </div>
  )
}
