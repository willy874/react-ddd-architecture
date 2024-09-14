import { ApplicationPlugin } from '@/core'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

interface ReactPluginOptions {
  el: Element
}

export const ReactPlugin = (options: ReactPluginOptions): ApplicationPlugin => {
  return ctx => {
    let node: React.ReactNode = null
    const root = ReactDOM.createRoot(options.el)
    ctx.render = () => {
      root.render(<StrictMode>{node}</StrictMode>)
    }
    ctx.setAppSlot = slot => {
      node = slot(node)
      ctx.render()
    }
    return {}
  }
}

declare module '@/core' {
  interface ApplicationContext {
    render: () => void
    setAppSlot: (slot: (prev: React.ReactNode) => React.ReactNode) => void
  }
}
