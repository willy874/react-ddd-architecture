import { css } from '@emotion/css'
import { useMemo } from 'react'

const styles = {
  'progress-bar__title': css(`
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 500;
    color: #2D308A;
    padding-left: 5px;
    margin-bottom: 1px;  
  `),
  'progress-bar__progress': css(`
    margin-bottom: 3px;
    border-radius: 4px;
    overflow: hidden;
    height: 12px;
    background: #D9D9D9;
  `),
  'progress-bar__current': css(`
    background: #2D308A;
    height: 100%;
  `),
  'progress-bar__range': css(`
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
    padding-left: 1px;
    margin-right: -3px;
  `),
}

interface ProgressBarProps {
  title: string
  current: number
  max: number
  min: number
}

export default function ProgressBar({
  title,
  current,
  max,
  min,
}: ProgressBarProps) {
  const width = useMemo(() => {
    return `${((current - min) / (max - min)) * 100}%`
  }, [current, max, min])
  return (
    <div>
      <div className={styles['progress-bar__title']}>
        <div>{title}</div>
        <div>{current}</div>
      </div>
      <div className={styles['progress-bar__progress']}>
        <div
          style={{ width }}
          className={styles['progress-bar__current']}
        ></div>
        <div></div>
      </div>
      <div className={styles['progress-bar__range']}>
        <div>{max}</div>
        <div>{min}</div>
      </div>
    </div>
  )
}
