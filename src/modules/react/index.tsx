import { ApplicationPlugin } from '@/core'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import type { Root } from 'react-dom/client'

export const ReactPlugin: ApplicationPlugin = ctx => {
  ctx.root = ReactDOM.createRoot(document.getElementById('root')!)
  ctx.root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  return {}
}

declare module '@/core' {
  interface ApplicationContext {
    root: Root
  }
}
