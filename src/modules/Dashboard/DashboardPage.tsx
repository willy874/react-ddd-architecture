import { useState } from 'react'
import { css } from '@emotion/css'
import ZoomIn from './ZoomIn.svg'
import ZoomOut from './ZoomOut.svg'
import DashboardContainer from './DashboardContainer'

const styles = {
  layout: css(`
    display: flex;
    flex-grow: 1;
  `),
  nav: css(`
    width: 68px;
    flex-shrink: 0;
    background: #fbfbfb;
    border-right: 1px solid #bcbcbc;
  `),
  aside: css(`
    padding: 0 30px;
    flex-shrink: 0;
    transition: width 0.3s;
  `),
  extension: css(`
    border: 1px solid #785FBB;
    border-radius: 12px;
    height: 100%;
    position: relative;
  `),
  'zoom-icon': css(`
    width: 24px;
    height: 24px;
    position: absolute;
    right: 20px;
    top: 20px;
    background: #fff;
    border: 1px solid #bcbcbc;
  `),
  main: css(`
    flex-grow: 1;
    display: flex;
    padding: 71px 0;
  `),
  page: css(`
    flex-grow: 1;
    display: flex;
  `),
}

export default function DashboardPage() {
  const [isZoomed, setIsZoomed] = useState(false)
  return (
    <div className={styles.layout}>
      <nav className={styles.nav}></nav>
      <main className={styles.main}>
        <div className={styles.page}>
          <DashboardContainer />
          <aside
            style={{ width: isZoomed ? '559px' : '288px' }}
            className={styles.aside}
          >
            <div className={styles.extension}>
              <button
                className={styles['zoom-icon']}
                onClick={() => setIsZoomed(!isZoomed)}
              >
                {isZoomed ? (
                  <img src={ZoomIn} alt="Zoom in" />
                ) : (
                  <img src={ZoomOut} alt="Zoom out" />
                )}
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
