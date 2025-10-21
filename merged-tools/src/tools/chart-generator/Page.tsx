import { useState, useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Bar, Line, Pie, Doughnut, Radar, PolarArea } from 'react-chartjs-2'
import ToolLayout from '../../components/ToolLayout'
import { meta } from './index'

// 注册 Chart.js 组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
)

type ChartType = 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'polarArea'

const COLORS = [
  'rgb(255, 99, 132)',
  'rgb(54, 162, 235)',
  'rgb(255, 206, 86)',
  'rgb(75, 192, 192)',
  'rgb(153, 102, 255)',
  'rgb(255, 159, 64)',
  'rgb(201, 203, 207)',
  'rgb(255, 99, 71)',
  'rgb(144, 238, 144)',
  'rgb(173, 216, 230)',
]

export default function Page() {
  const chartRef = useRef<any>(null)
  const [chartType, setChartType] = useState<ChartType>('bar')
  const [title, setTitle] = useState('我的图表')
  const [labels, setLabels] = useState('一月,二月,三月,四月,五月,六月')
  const [datasets, setDatasets] = useState([
    { label: '数据集 1', data: '65,59,80,81,56,55' },
  ])

  const addDataset = () => {
    setDatasets([...datasets, { label: `数据集 ${datasets.length + 1}`, data: '30,40,50,60,70,80' }])
  }

  const removeDataset = (index: number) => {
    setDatasets(datasets.filter((_, i) => i !== index))
  }

  const updateDataset = (index: number, field: 'label' | 'data', value: string) => {
    const newDatasets = [...datasets]
    newDatasets[index][field] = value
    setDatasets(newDatasets)
  }

  const parseData = () => {
    const labelArray = labels.split(',').map(s => s.trim()).filter(Boolean)
    
    const parsedDatasets = datasets.map((ds, idx) => {
      const dataArray = ds.data
        .split(',')
        .map(s => parseFloat(s.trim()))
        .filter(n => !isNaN(n))

      const color = COLORS[idx % COLORS.length]
      const backgroundColor = chartType === 'pie' || chartType === 'doughnut' || chartType === 'polarArea'
        ? labelArray.map((_, i) => COLORS[i % COLORS.length])
        : color.replace('rgb', 'rgba').replace(')', ', 0.5)')

      return {
        label: ds.label,
        data: dataArray,
        backgroundColor,
        borderColor: color,
        borderWidth: 2,
      }
    })

    return {
      labels: labelArray,
      datasets: parsedDatasets,
    }
  }

  const chartData = parseData()

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 18,
        },
      },
    },
    ...(chartType === 'radar' && {
      scales: {
        r: {
          beginAtZero: true,
        },
      },
    }),
  }

  const downloadChart = () => {
    if (chartRef.current) {
      const url = chartRef.current.toBase64Image()
      const link = document.createElement('a')
      link.download = `chart-${Date.now()}.png`
      link.href = url
      link.click()
    }
  }

  const loadExample = () => {
    setTitle('月度销售报表')
    setLabels('一月,二月,三月,四月,五月,六月')
    setDatasets([
      { label: '产品 A', data: '65,59,80,81,56,55' },
      { label: '产品 B', data: '28,48,40,19,86,27' },
    ])
  }

  const renderChart = () => {
    const props = { ref: chartRef, data: chartData, options }
    
    switch (chartType) {
      case 'bar':
        return <Bar {...props} />
      case 'line':
        return <Line {...props} />
      case 'pie':
        return <Pie {...props} />
      case 'doughnut':
        return <Doughnut {...props} />
      case 'radar':
        return <Radar {...props} />
      case 'polarArea':
        return <PolarArea {...props} />
      default:
        return <Bar {...props} />
    }
  }

  return (
    <ToolLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">{meta.name}</h1>
          <p className="text-gray-600">{meta.desc}</p>
        </div>

        {/* 图表类型选择 */}
        <div>
          <label className="block text-sm font-medium mb-2">图表类型</label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'bar', label: '柱状图' },
              { value: 'line', label: '折线图' },
              { value: 'pie', label: '饼图' },
              { value: 'doughnut', label: '环形图' },
              { value: 'radar', label: '雷达图' },
              { value: 'polarArea', label: '极坐标图' },
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => setChartType(type.value as ChartType)}
                className={`px-4 py-2 rounded border ${
                  chartType === type.value
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* 图表标题 */}
        <div>
          <label className="block text-sm font-medium mb-1">图表标题</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="输入图表标题..."
            className="w-full p-2 border rounded"
          />
        </div>

        {/* 标签 */}
        <div>
          <label className="block text-sm font-medium mb-1">
            标签（逗号分隔）
          </label>
          <input
            type="text"
            value={labels}
            onChange={(e) => setLabels(e.target.value)}
            placeholder="例如: 一月,二月,三月"
            className="w-full p-2 border rounded font-mono text-sm"
          />
        </div>

        {/* 数据集 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">数据集</label>
            <button
              onClick={addDataset}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              + 添加数据集
            </button>
          </div>

          {datasets.map((ds, idx) => (
            <div key={idx} className="p-3 border rounded bg-gray-50 space-y-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <input
                  type="text"
                  value={ds.label}
                  onChange={(e) => updateDataset(idx, 'label', e.target.value)}
                  placeholder="数据集名称"
                  className="flex-1 p-2 border rounded"
                />
                {datasets.length > 1 && (
                  <button
                    onClick={() => removeDataset(idx)}
                    className="px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    删除
                  </button>
                )}
              </div>
              <input
                type="text"
                value={ds.data}
                onChange={(e) => updateDataset(idx, 'data', e.target.value)}
                placeholder="数据（逗号分隔，例如: 65,59,80,81,56,55）"
                className="w-full p-2 border rounded font-mono text-sm"
              />
            </div>
          ))}
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2">
          <button
            onClick={loadExample}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            加载示例
          </button>
          <button
            onClick={downloadChart}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            下载图表
          </button>
        </div>

        {/* 图表预览 */}
        <div className="border rounded-lg p-6 bg-white">
          <div className="max-w-4xl mx-auto">
            {renderChart()}
          </div>
        </div>

        {/* 使用说明 */}
        <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded">
          <h4 className="font-semibold mb-2">使用说明：</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>选择图表类型，输入标题和标签</li>
            <li>添加一个或多个数据集，输入数据（用逗号分隔）</li>
            <li>实时预览图表效果</li>
            <li>点击"下载图表"保存为 PNG 图片</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  )
}
