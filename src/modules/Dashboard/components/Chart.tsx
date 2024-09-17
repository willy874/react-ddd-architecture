import VChart, { ISpec } from '@visactor/vchart'
import { useEffect, useRef } from 'react'

function isEqual(a: object, b: object) {
  return JSON.stringify(a) === JSON.stringify(b)
}

export function defineChartOptions<T extends ISpec>(options: T): T {
  return options
}

export interface ChartProps<Options extends ISpec>
  extends React.HTMLAttributes<HTMLDivElement> {
  options: Options
}

function Chart<O extends ISpec>({ options, ...attrs }: ChartProps<O>) {
  const domRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<VChart | null>(null)
  useEffect(() => {
    const dom = domRef.current
    if (!dom) return
    if (!dom.querySelector('canvas')) {
      chartRef.current = new VChart(optionsRef.current, { dom })
      chartRef.current?.renderSync()
    }
  }, [])

  const optionsRef = useRef(options)
  useEffect(() => {
    Promise.resolve().then(() => {
      if (isEqual(optionsRef.current, options)) return
      optionsRef.current = options
      chartRef.current?.updateSpecSync(optionsRef.current)
    })
  }, [options])

  return <div {...attrs} ref={domRef} />
}

export default Chart
