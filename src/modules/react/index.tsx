import { ApplicationPlugin } from '@/core'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App'
import type { ReactNode } from 'react'
import type { Root } from 'react-dom/client'

interface ReactPluginOptions {
  el: Element
}

export const ReactPlugin = (options: ReactPluginOptions): ApplicationPlugin => {
  return ctx => {
    let node: ReactNode = null
    ctx.root = ReactDOM.createRoot(options.el)
    ctx.setAppSlot = slot => {
      node = slot(node)
      ctx.root.render(<StrictMode>{node}</StrictMode>)
    }
    return {}
  }
}

declare module '@/core' {
  interface ApplicationContext {
    root: Root
    setAppSlot: (slot: (prev: ReactNode) => ReactNode) => void
  }
}
