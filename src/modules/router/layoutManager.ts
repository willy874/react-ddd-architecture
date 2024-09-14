export type LayoutComponent = React.FC<{ children: React.ReactNode }>

class LayoutManager {
  layouts: Record<string, LayoutComponent> = {
    default: props => props.children,
  }
  currentType = ''
  listeners: Array<(type: string) => void> = []

  getCurrentLayout() {
    return this.layouts[this.currentType] || this.layouts.default
  }

  registerLayout(type: string, node: LayoutComponent) {
    this.layouts[type] = node
  }

  emitLayoutChange(type: string) {
    this.listeners.forEach(l => l(type))
  }

  onLayoutChange(callback: (type: string) => void) {
    this.listeners = [...this.listeners, callback]
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback)
    }
  }

  setCurrentLayout(type = 'default') {
    const prev = this.currentType
    this.currentType = type
    if (prev !== type) {
      this.emitLayoutChange(type)
    }
  }
}

export const layoutManager = new LayoutManager()
