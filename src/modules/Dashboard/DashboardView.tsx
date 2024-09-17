import { useEffect, useInsertionEffect, useMemo, useRef, useState } from 'react'
import { css } from '@emotion/css'
import clsx from 'clsx'
import PerformanceTracker from './PerformanceTracker'
import { PerformanceModel, ScoreDistributionModel } from './models'
import Chart from './Chart'
import { getChartOptions } from './chart-options'

const styles = {
  'data-chart': css(`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  `),
  'data-chart__container': css(`
    flex-grow: 1;
    overflow: auto;
    height: 0;
    padding: 0 56px;
  `),
  'data-chart__row': css(`
    padding: 28px 0;
    display: flex;
    gap: 25px;
    width: 100%;
    align-items: flex-start;
  `),
  'data-chart__col-lg': css(`
    flex: 0 0 50%;
    width: 50%;
    height: 294px;
  `),
  'data-chart__col-md': css(`
    margin-bottom: 25px;
  `),
  'data-chart__card': css(`
    background: #fbfbfb;
    box-shadow: 0px 0px 2px 0px #00000040;
    border-radius: 12px;
    padding: 20px;
    height: 100%;
  `),
  'direction-column': css(`
    display: block;
  `),
  'direction-row': css(`
    flex-direction: row;
  `),
  canvas: css(`
    width: 100%;
    height: 100%;
    position: relative;
    canvas {
      position: absolute;
      inset: 0;
    }
  `),
}

interface DashboardViewProps {
  currentScore: number
  ranking: number
  sat: ScoreDistributionModel[]
  performance: PerformanceModel[]
}

export default function DashboardView({
  currentScore,
  ranking,
  sat,
  performance,
}: DashboardViewProps) {
  const [containerWidth, setContainerWidth] = useState(0)

  const chartOptions = useMemo(() => {
    const settings = (() => {
      const scores = sat.map(i => i.score)
      const centerScore = Math.round(
        scores.reduce((acc, cur) => acc + cur, 0) / scores.length,
      )
      return {
        current: currentScore,
        ranking,
        showLabel: [
          Math.min(...scores),
          scores.find(i => i === centerScore) || 0,
          Math.max(...scores),
        ],
      }
    })()
    const newOptions = { ...getChartOptions(settings) }
    newOptions.data.values =
      sat.map(item => ({
        x: item.score,
        y: item.count,
      })) || []
    return newOptions
  }, [currentScore, ranking, sat])

  const observer = useRef<HTMLDivElement>(null)
  useInsertionEffect(() => {
    setContainerWidth(window.innerWidth)
  }, [])
  useEffect(() => {
    const ob = new ResizeObserver(entries => {
      entries.forEach(entry => {
        setContainerWidth(entry.target.clientWidth || window.innerWidth)
      })
    })
    const el = observer.current as Element
    ob.observe(el)
    setContainerWidth(el.clientWidth || window.innerWidth)
    return () => {
      ob.disconnect()
    }
  }, [])

  const media = useMemo(() => {
    if (containerWidth < 1050) {
      return 'md'
    }
    return 'lg'
  }, [containerWidth])

  return (
    <div ref={observer} className={styles['data-chart']}>
      <div className={styles['data-chart__container']}>
        <div
          className={clsx(styles['data-chart__row'], {
            [styles['direction-column']]: media !== 'lg',
            [styles['direction-row']]: media === 'lg',
          })}
        >
          <div
            className={clsx({
              [styles['data-chart__col-md']]: media !== 'lg',
              [styles['data-chart__col-lg']]: media === 'lg',
            })}
          >
            <div className={styles['data-chart__card']}>
              <PerformanceTracker data={performance} />
            </div>
          </div>
          <div
            className={clsx({
              [styles['data-chart__col-md']]: media !== 'lg',
              [styles['data-chart__col-lg']]: media === 'lg',
            })}
          >
            <div className={styles['data-chart__card']}>
              <Chart
                style={{ minHeight: media !== 'lg' ? '500px' : 'auto' }}
                key={containerWidth}
                className={styles.canvas}
                options={chartOptions}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
