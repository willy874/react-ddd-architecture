import { EventEmitter } from 'events'

type LayoutComponent = React.FC<{ children: React.ReactNode }>

export class LayoutManager {
  private layouts: Record<string, LayoutComponent> = {
    default: props => props.children,
  }
  private currentType = ''
  private emitter = new EventEmitter()

  getCurrentLayout() {
    return this.layouts[this.currentType] || this.layouts.default
  }

  registerLayout(type: string, node: LayoutComponent) {
    this.layouts[type] = node
  }

  onLayoutChange(callback: (type: string) => void) {
    this.emitter.on('layoutChange', callback)
    return () => {
      this.emitter.off('layoutChange', callback)
    }
  }

  setCurrentLayout(type = 'default') {
    const prev = this.currentType
    this.currentType = type
    if (prev !== type) {
      this.emitter.emit('layoutChange', type)
    }
  }
}
