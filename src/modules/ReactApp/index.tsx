import { ApplicationPlugin } from '@/core'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

interface ReactPluginOptions {
  el: Element
}

export const ReactAppPlugin = (
  options: ReactPluginOptions,
): ApplicationPlugin => {
  return app => {
    let node: React.ReactNode = null
    const root = ReactDOM.createRoot(options.el)
    const render = () => {
      root.render(<StrictMode>{node}</StrictMode>)
    }
    app.provider('render', render)
    app.provider('setAppSlot', slot => {
      node = slot(node)
      render()
    })
    return {}
  }
}

declare module '@/core' {
  interface ApplicationService {
    render: () => void
    setAppSlot: (slot: (prev: React.ReactNode) => React.ReactNode) => void
  }
}
