import { useState } from 'react'
import ToolLayout from '../../components/ToolLayout'
import { meta } from './index'

interface ColumnStats {
  column: string
  count: number
  numericCount: number
  mean: number | null
  median: number | null
  mode: string | null
  stdDev: number | null
  variance: number | null
  min: number | null
  max: number | null
  q1: number | null
  q3: number | null
  range: number | null
  sum: number | null
}

export default function Page() {
  const [input, setInput] = useState('')
  const [format, setFormat] = useState<'csv' | 'json'>('csv')
  const [stats, setStats] = useState<ColumnStats[]>([])
  const [error, setError] = useState('')

  const calculateStats = (values: number[]): Partial<ColumnStats> => {
    if (values.length === 0) return {}

    const sorted = [...values].sort((a, b) => a - b)
    const n = sorted.length
    const sum = sorted.reduce((a, b) => a + b, 0)
    const mean = sum / n

    // 中位数
    const median = n % 2 === 0 
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 
      : sorted[Math.floor(n / 2)]

    // 四分位数
    const q1Index = Math.floor(n * 0.25)
    const q3Index = Math.floor(n * 0.75)
    const q1 = sorted[q1Index]
    const q3 = sorted[q3Index]

    // 方差和标准差
    const variance = sorted.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n
    const stdDev = Math.sqrt(variance)

    return {
      mean: Number(mean.toFixed(4)),
      median: Number(median.toFixed(4)),
      stdDev: Number(stdDev.toFixed(4)),
      variance: Number(variance.toFixed(4)),
      min: sorted[0],
      max: sorted[n - 1],
      q1,
      q3,
      range: sorted[n - 1] - sorted[0],
      sum: Number(sum.toFixed(4)),
    }
  }

  const findMode = (values: (string | number)[]): string | null => {
    const frequency: Record<string, number> = {}
    values.forEach(val => {
      const key = String(val)
      frequency[key] = (frequency[key] || 0) + 1
    })

    let maxFreq = 0
    let mode: string | null = null
    for (const [key, freq] of Object.entries(frequency)) {
      if (freq > maxFreq) {
        maxFreq = freq
        mode = key
      }
    }

    return maxFreq > 1 ? mode : null
  }

  const parseCSV = (text: string): Record<string, any>[] => {
    const lines = text.trim().split('\n')
    if (lines.length < 2) throw new Error('CSV 需要至少包含表头和一行数据')

    const headers = lines[0].split(',').map(h => h.trim())
    const data: Record<string, any>[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      if (values.length !== headers.length) continue

      const row: Record<string, any> = {}
      headers.forEach((header, idx) => {
        row[header] = values[idx]
      })
      data.push(row)
    }

    return data
  }

  const analyze = () => {
    try {
      setError('')
      let data: Record<string, any>[] = []

      if (format === 'csv') {
        data = parseCSV(input)
      } else {
        const parsed = JSON.parse(input)
        data = Array.isArray(parsed) ? parsed : [parsed]
      }

      if (data.length === 0) {
        throw new Error('没有数据可分析')
      }

      // 获取所有列名
      const columns = Object.keys(data[0])
      const results: ColumnStats[] = []

      columns.forEach(column => {
        const values = data.map(row => row[column]).filter(v => v != null && v !== '')
        const numericValues = values
          .map(v => parseFloat(String(v)))
          .filter(v => !isNaN(v))

        const columnStat: ColumnStats = {
          column,
          count: values.length,
          numericCount: numericValues.length,
          mean: null,
          median: null,
          mode: findMode(values),
          stdDev: null,
          variance: null,
          min: null,
          max: null,
          q1: null,
          q3: null,
          range: null,
          sum: null,
        }

        if (numericValues.length > 0) {
          Object.assign(columnStat, calculateStats(numericValues))
        }

        results.push(columnStat)
      })

      setStats(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : '解析失败')
      setStats([])
    }
  }

  const exampleCSV = `name,age,score,salary
Alice,25,85.5,50000
Bob,30,92.0,65000
Charlie,28,78.5,55000
Diana,35,88.0,70000
Eve,27,91.5,60000`

  const exampleJSON = `[
  {"name": "Alice", "age": 25, "score": 85.5, "salary": 50000},
  {"name": "Bob", "age": 30, "score": 92.0, "salary": 65000},
  {"name": "Charlie", "age": 28, "score": 78.5, "salary": 55000},
  {"name": "Diana", "age": 35, "score": 88.0, "salary": 70000},
  {"name": "Eve", "age": 27, "score": 91.5, "salary": 60000}
]`

  const loadExample = () => {
    setInput(format === 'csv' ? exampleCSV : exampleJSON)
  }

  return (
    <ToolLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold mb-4">{meta.name}</h1>
        <p className="text-gray-600 mb-6">{meta.desc}</p>
        {/* 格式选择 */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={format === 'csv'}
              onChange={() => setFormat('csv')}
              className="w-4 h-4"
            />
            <span>CSV 格式</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={format === 'json'}
              onChange={() => setFormat('json')}
              className="w-4 h-4"
            />
            <span>JSON 格式</span>
          </label>
          <button
            onClick={loadExample}
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
          >
            加载示例
          </button>
        </div>

        {/* 输入区 */}
        <div>
          <label className="block text-sm font-medium mb-1">
            输入数据 ({format === 'csv' ? 'CSV' : 'JSON'})
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={format === 'csv' ? '粘贴 CSV 数据...' : '粘贴 JSON 数组...'}
            className="w-full h-40 p-3 border rounded font-mono text-sm"
          />
        </div>

        {/* 分析按钮 */}
        <button
          onClick={analyze}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          开始分析
        </button>

        {/* 错误提示 */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}

        {/* 统计结果 */}
        {stats.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">统计结果</h3>
            
            {stats.map((stat) => (
              <div key={stat.column} className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-semibold text-lg mb-3 text-blue-600">
                  列: {stat.column}
                </h4>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  <StatItem label="总数" value={stat.count} />
                  <StatItem label="数值数量" value={stat.numericCount} />
                  
                  {stat.numericCount > 0 && (
                    <>
                      <StatItem label="均值" value={stat.mean} />
                      <StatItem label="中位数" value={stat.median} />
                      <StatItem label="标准差" value={stat.stdDev} />
                      <StatItem label="方差" value={stat.variance} />
                      <StatItem label="最小值" value={stat.min} />
                      <StatItem label="最大值" value={stat.max} />
                      <StatItem label="Q1 (25%)" value={stat.q1} />
                      <StatItem label="Q3 (75%)" value={stat.q3} />
                      <StatItem label="范围" value={stat.range} />
                      <StatItem label="总和" value={stat.sum} />
                    </>
                  )}
                  
                  {stat.mode && (
                    <StatItem label="众数" value={stat.mode} />
                  )}
                </div>

                {stat.numericCount > 0 && (
                  <div className="mt-4">
                    <div className="text-sm text-gray-600 mb-2">数据分布（箱线图）</div>
                    <BoxPlot
                      min={stat.min!}
                      q1={stat.q1!}
                      median={stat.median!}
                      q3={stat.q3!}
                      max={stat.max!}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}

function StatItem({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-white p-2 rounded border">
      <div className="text-xs text-gray-600">{label}</div>
      <div className="font-semibold text-sm">
        {value != null ? value : 'N/A'}
      </div>
    </div>
  )
}

function BoxPlot({ min, q1, median, q3, max }: {
  min: number
  q1: number
  median: number
  q3: number
  max: number
}) {
  const range = max - min
  const scale = (val: number) => ((val - min) / range) * 100

  return (
    <div className="relative h-12 bg-gray-200 rounded">
      {/* 最小值到最大值的线 */}
      <div
        className="absolute top-1/2 h-0.5 bg-gray-600"
        style={{
          left: '0%',
          width: '100%',
        }}
      />
      
      {/* IQR 箱子 (Q1 to Q3) */}
      <div
        className="absolute top-2 h-8 bg-blue-400 border-2 border-blue-600 rounded"
        style={{
          left: `${scale(q1)}%`,
          width: `${scale(q3) - scale(q1)}%`,
        }}
      />
      
      {/* 中位数线 */}
      <div
        className="absolute top-0 h-12 w-0.5 bg-red-600"
        style={{
          left: `${scale(median)}%`,
        }}
      />
      
      {/* 标记点 */}
      <div className="absolute -bottom-6 left-0 text-xs text-gray-600">
        {min.toFixed(1)}
      </div>
      <div
        className="absolute -bottom-6 text-xs text-gray-600"
        style={{ left: `${scale(q1)}%`, transform: 'translateX(-50%)' }}
      >
        Q1: {q1.toFixed(1)}
      </div>
      <div
        className="absolute -bottom-6 text-xs text-red-600 font-semibold"
        style={{ left: `${scale(median)}%`, transform: 'translateX(-50%)' }}
      >
        {median.toFixed(1)}
      </div>
      <div
        className="absolute -bottom-6 text-xs text-gray-600"
        style={{ left: `${scale(q3)}%`, transform: 'translateX(-50%)' }}
      >
        Q3: {q3.toFixed(1)}
      </div>
      <div className="absolute -bottom-6 right-0 text-xs text-gray-600">
        {max.toFixed(1)}
      </div>
    </div>
  )
}
