import { useMemo } from 'react'
import ProgressBar from './components/ProgressBar'
import TitleIcon from './TitleIcon.svg'
import { css } from '@emotion/css'
import { PerformanceModel } from './models'

const styles = {
  title: css(`
    display: flex;
    font-size: 24px;
    font-weight: 600;
    gap: 8px;
    color: #2F2F2F;
    margin-bottom: 24px;
  `),
  content: css(`
    display: flex;
    flex-direction: column;
    gap: 10px;
  `),
}

interface PerformanceTrackerProps {
  data: PerformanceModel[]
}

export default function PerformanceTracker({ data }: PerformanceTrackerProps) {
  const mathData = useMemo(() => {
    return {
      current: data.reduce((acc, item) => acc + item.current, 0),
      max: data.reduce((acc, item) => acc + item.max, 0),
      min: data.reduce((acc, item) => acc + item.min, 0),
    }
  }, [data])
  return (
    <div>
      <h2 className={styles.title}>
        <img src={TitleIcon} alt="" />
        <span>Performance Tracker</span>
      </h2>
      <div className={styles.content}>
        <ProgressBar
          title="Math"
          current={mathData.current}
          max={mathData.max}
          min={mathData.min}
        />
        {data.map((item, index) => (
          <ProgressBar
            key={index}
            title={item.type}
            current={item.current}
            max={item.max}
            min={item.min}
          />
        ))}
      </div>
    </div>
  )
}
