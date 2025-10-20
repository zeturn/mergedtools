export default function LandingOrnaments() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      {/* 左上蓝色光斑 */}
      <div className="absolute -top-10 -left-6 h-44 w-44 rounded-full bg-indigo-500/15 blur-2xl animate-float-slow" />
      {/* 右上青色光斑 */}
      <div className="absolute -top-6 right-10 h-36 w-36 rounded-full bg-cyan-400/15 blur-2xl animate-float" />
      {/* 右下绿色光斑 */}
      <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-emerald-400/10 blur-2xl animate-float-delay" />
    </div>
  )
}
