import React, { useState } from 'react';

function parseCSV(text: string): string[][] {
  return text.split(/\r?\n/).map(row => row.split(','));
}

export default function Page() {
  const [input, setInput] = useState('');
  const [table, setTable] = useState<string[][]>([]);

  function handleAnalyze() {
    setTable(parseCSV(input));
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-2">数据透视表增强版</h2>
      <textarea
        className="w-full border rounded p-2 mb-2"
        rows={6}
        placeholder={"粘贴 CSV 数据（首行为表头）"}
        value={input}
        onChange={e=>setInput(e.target.value)}
      />
      <button className="btn btn-primary" onClick={handleAnalyze}>生成表格</button>
      {table.length > 0 && (
        <div className="overflow-x-auto mt-4">
          <table className="table-auto border border-collapse w-full">
            <thead>
              <tr>
                {table[0].map((h,i)=>(<th key={i} className="border px-2 py-1 bg-gray-100">{h}</th>))}
              </tr>
            </thead>
            <tbody>
              {table.slice(1).map((row,i)=>(
                <tr key={i}>
                  {row.map((cell,j)=>(<td key={j} className="border px-2 py-1">{cell}</td>))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
