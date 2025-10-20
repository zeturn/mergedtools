const LIST: [number,string][] = [[200,'OK'],[201,'Created'],[202,'Accepted'],[204,'No Content'],[301,'Moved Permanently'],[302,'Found'],[307,'Temporary Redirect'],[308,'Permanent Redirect'],[400,'Bad Request'],[401,'Unauthorized'],[403,'Forbidden'],[404,'Not Found'],[409,'Conflict'],[410,'Gone'],[422,'Unprocessable Entity'],[429,'Too Many Requests'],[500,'Internal Server Error'],[502,'Bad Gateway'],[503,'Service Unavailable']]

export default function Page(){
  return (
    <div className="rounded bg-slate-900 p-3 font-mono space-y-2">
      {LIST.map(([c,t])=> <div key={c}><span className="text-slate-400">{c}</span> — {t}</div>)}
    </div>
  )
}
