import { ApplicationPlugin } from '@/core'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

type ConfigComponent = React.ComponentType<{ children: React.ReactNode }>

interface ReactPluginOptions {
  el: () => Element
  main: React.ComponentType
  providers: ConfigComponent[]
}

export const ReactAppPlugin = (
  options: ReactPluginOptions,
): ApplicationPlugin => {
  return app => {
    const { providers, main: Main, el } = options
    const root = ReactDOM.createRoot(el())
    const render = () => {
      root.render(
        <StrictMode>
          {providers.reduceRight(
            (acc, Provider) => {
              return <Provider>{acc}</Provider>
            },
            <Main />,
          )}
        </StrictMode>,
      )
    }
    app.provider('render', render)
    return {}
  }
}

declare module '@/core' {
  interface ApplicationService {
    render: () => void
  }
}
