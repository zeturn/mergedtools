import { useState, useMemo } from 'react'
import ToolLayout from '../../components/ToolLayout'
import { meta } from './index'

type AggFunc = 'sum' | 'avg' | 'count' | 'min' | 'max' | 'countDistinct'

interface PivotConfig {
  rowFields: string[]
  columnFields: string[]
  valueField: string
  aggFunc: AggFunc
}

export default function Page() {
  const [input, setInput] = useState('')
  const [format, setFormat] = useState<'csv' | 'json'>('csv')
  const [data, setData] = useState<Record<string, any>[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [error, setError] = useState('')

  const [config, setConfig] = useState<PivotConfig>({
    rowFields: [],
    columnFields: [],
    valueField: '',
    aggFunc: 'sum',
  })

  const parseCSV = (text: string): Record<string, any>[] => {
    const lines = text.trim().split('\n')
    if (lines.length < 2) throw new Error('CSV 需要至少包含表头和一行数据')

    const headers = lines[0].split(',').map(h => h.trim())
    const result: Record<string, any>[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      if (values.length !== headers.length) continue

      const row: Record<string, any> = {}
      headers.forEach((header, idx) => {
        const val = values[idx]
        // 尝试转换为数字
        const numVal = parseFloat(val)
        row[header] = isNaN(numVal) ? val : numVal
      })
      result.push(row)
    }

    return result
  }

  const loadData = () => {
    try {
      setError('')
      let parsed: Record<string, any>[] = []

      if (format === 'csv') {
        parsed = parseCSV(input)
      } else {
        const jsonData = JSON.parse(input)
        parsed = Array.isArray(jsonData) ? jsonData : [jsonData]
      }

      if (parsed.length === 0) {
        throw new Error('没有数据可分析')
      }

      const cols = Object.keys(parsed[0])
      setData(parsed)
      setColumns(cols)
      
      // 自动设置默认配置
      if (cols.length > 0 && config.rowFields.length === 0) {
        setConfig({
          ...config,
          rowFields: [cols[0]],
          valueField: cols[cols.length - 1],
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '解析失败')
      setData([])
      setColumns([])
    }
  }

  const pivotData = useMemo(() => {
    if (data.length === 0 || !config.valueField) return null

    const grouped = new Map<string, Map<string, any[]>>()

    // 分组数据
    data.forEach(row => {
      const rowKey = config.rowFields.map(f => row[f] ?? 'N/A').join(' | ')
      const colKey = config.columnFields.length > 0
        ? config.columnFields.map(f => row[f] ?? 'N/A').join(' | ')
        : 'Value'

      if (!grouped.has(rowKey)) {
        grouped.set(rowKey, new Map())
      }
      const rowGroup = grouped.get(rowKey)!
      
      if (!rowGroup.has(colKey)) {
        rowGroup.set(colKey, [])
      }
      
      rowGroup.get(colKey)!.push(row[config.valueField])
    })

    // 计算聚合值
    const aggregate = (values: any[]): number => {
      const nums = values.filter(v => typeof v === 'number' && !isNaN(v))
      if (nums.length === 0) return 0

      switch (config.aggFunc) {
        case 'sum':
          return nums.reduce((a, b) => a + b, 0)
        case 'avg':
          return nums.reduce((a, b) => a + b, 0) / nums.length
        case 'count':
          return nums.length
        case 'min':
          return Math.min(...nums)
        case 'max':
          return Math.max(...nums)
        case 'countDistinct':
          return new Set(nums).size
        default:
          return 0
      }
    }

    // 构建透视表
    const allColKeys = new Set<string>()
    grouped.forEach(rowGroup => {
      rowGroup.forEach((_, colKey) => allColKeys.add(colKey))
    })

    const colKeys = Array.from(allColKeys).sort()
    const rows: Array<{ rowKey: string; values: Record<string, number>; total: number }> = []

    grouped.forEach((rowGroup, rowKey) => {
      const values: Record<string, number> = {}
      let total = 0

      colKeys.forEach(colKey => {
        const cellValues = rowGroup.get(colKey) || []
        const aggValue = aggregate(cellValues)
        values[colKey] = aggValue
        total += aggValue
      })

      rows.push({ rowKey, values, total })
    })

    // 计算列总计
    const columnTotals: Record<string, number> = {}
    let grandTotal = 0

    colKeys.forEach(colKey => {
      columnTotals[colKey] = rows.reduce((sum, row) => sum + row.values[colKey], 0)
      grandTotal += columnTotals[colKey]
    })

    return { rows, colKeys, columnTotals, grandTotal }
  }, [data, config])

  const aggFuncLabels = {
    sum: '求和',
    avg: '平均值',
    count: '计数',
    min: '最小值',
    max: '最大值',
    countDistinct: '去重计数',
  }

  const exampleCSV = `region,product,quarter,sales
North,Product A,Q1,1000
North,Product A,Q2,1200
North,Product B,Q1,800
North,Product B,Q2,900
South,Product A,Q1,1500
South,Product A,Q2,1600
South,Product B,Q1,700
South,Product B,Q2,750`

  const exampleJSON = `[
  {"region": "North", "product": "Product A", "quarter": "Q1", "sales": 1000},
  {"region": "North", "product": "Product A", "quarter": "Q2", "sales": 1200},
  {"region": "North", "product": "Product B", "quarter": "Q1", "sales": 800},
  {"region": "North", "product": "Product B", "quarter": "Q2", "sales": 900},
  {"region": "South", "product": "Product A", "quarter": "Q1", "sales": 1500},
  {"region": "South", "product": "Product A", "quarter": "Q2", "sales": 1600},
  {"region": "South", "product": "Product B", "quarter": "Q1", "sales": 700},
  {"region": "South", "product": "Product B", "quarter": "Q2", "sales": 750}
]`

  const loadExample = () => {
    setInput(format === 'csv' ? exampleCSV : exampleJSON)
  }

  const toggleField = (field: string, type: 'row' | 'column') => {
    const fieldArray = type === 'row' ? config.rowFields : config.columnFields
    const otherType = type === 'row' ? 'columnFields' : 'rowFields'
    const otherArray = type === 'row' ? config.columnFields : config.rowFields

    // 从另一个数组中移除
    const newOther = otherArray.filter(f => f !== field)

    if (fieldArray.includes(field)) {
      // 移除
      setConfig({
        ...config,
        [type === 'row' ? 'rowFields' : 'columnFields']: fieldArray.filter(f => f !== field),
        [otherType]: newOther,
      })
    } else {
      // 添加
      setConfig({
        ...config,
        [type === 'row' ? 'rowFields' : 'columnFields']: [...fieldArray, field],
        [otherType]: newOther,
      })
    }
  }

  const formatValue = (value: number): string => {
    if (config.aggFunc === 'avg') {
      return value.toFixed(2)
    }
    return value.toFixed(0)
  }

  return (
    <ToolLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">{meta.name}</h1>
          <p className="text-gray-600">{meta.desc}</p>
        </div>

        {/* 数据输入 */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="font-semibold mb-3">步骤 1: 输入数据</h3>
          
          <div className="flex items-center gap-4 mb-3">
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

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={format === 'csv' ? '粘贴 CSV 数据...' : '粘贴 JSON 数组...'}
            className="w-full h-32 p-3 border rounded font-mono text-sm mb-3"
          />

          <button
            onClick={loadData}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            加载数据
          </button>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* 配置透视表 */}
        {data.length > 0 && (
          <>
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold mb-3">步骤 2: 配置透视表</h3>

              <div className="grid md:grid-cols-3 gap-4">
                {/* 行字段 */}
                <div>
                  <label className="block text-sm font-medium mb-2">行字段</label>
                  <div className="space-y-1">
                    {columns.map(col => (
                      <label key={col} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={config.rowFields.includes(col)}
                          onChange={() => toggleField(col, 'row')}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{col}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 列字段 */}
                <div>
                  <label className="block text-sm font-medium mb-2">列字段（可选）</label>
                  <div className="space-y-1">
                    {columns.map(col => (
                      <label key={col} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={config.columnFields.includes(col)}
                          onChange={() => toggleField(col, 'column')}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{col}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 值字段和聚合函数 */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">值字段</label>
                    <select
                      value={config.valueField}
                      onChange={(e) => setConfig({ ...config, valueField: e.target.value })}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">选择字段...</option>
                      {columns.map(col => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">聚合函数</label>
                    <select
                      value={config.aggFunc}
                      onChange={(e) => setConfig({ ...config, aggFunc: e.target.value as AggFunc })}
                      className="w-full p-2 border rounded"
                    >
                      {Object.entries(aggFuncLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 透视表结果 */}
            {pivotData && (
              <div className="border rounded-lg p-4 bg-white">
                <h3 className="font-semibold mb-3">步骤 3: 查看结果</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2 text-left font-semibold">
                          {config.rowFields.join(' / ')}
                        </th>
                        {pivotData.colKeys.map(colKey => (
                          <th key={colKey} className="border p-2 text-right font-semibold">
                            {colKey}
                          </th>
                        ))}
                        <th className="border p-2 text-right font-semibold bg-blue-50">
                          总计
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pivotData.rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="border p-2 font-medium">{row.rowKey}</td>
                          {pivotData.colKeys.map(colKey => (
                            <td key={colKey} className="border p-2 text-right">
                              {formatValue(row.values[colKey])}
                            </td>
                          ))}
                          <td className="border p-2 text-right font-semibold bg-blue-50">
                            {formatValue(row.total)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-100 font-semibold">
                        <td className="border p-2">总计</td>
                        {pivotData.colKeys.map(colKey => (
                          <td key={colKey} className="border p-2 text-right">
                            {formatValue(pivotData.columnTotals[colKey])}
                          </td>
                        ))}
                        <td className="border p-2 text-right bg-blue-100">
                          {formatValue(pivotData.grandTotal)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                  共 {pivotData.rows.length} 行，{pivotData.colKeys.length} 列
                </div>
              </div>
            )}
          </>
        )}

        {/* 使用说明 */}
        <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded">
          <h4 className="font-semibold mb-2">使用说明：</h4>
          <ol className="list-decimal list-inside space-y-1">
            <li>输入 CSV 或 JSON 格式的数据并加载</li>
            <li>选择行字段（分组维度）和列字段（交叉维度，可选）</li>
            <li>选择值字段和聚合函数（求和、平均等）</li>
            <li>查看生成的透视表，包含行列汇总</li>
          </ol>
        </div>
      </div>
    </ToolLayout>
  )
}
