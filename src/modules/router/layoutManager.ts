type LayoutComponent = React.FC<{ children: React.ReactNode }>

const createLayoutManager = () => {
  const DefaultLayout: LayoutComponent = props => props.children
  const layouts: Record<string, LayoutComponent> = {
    default: DefaultLayout,
  }
  let currentType = 'default'
  return {
    layouts,
    getCurrentLayout: () => layouts[currentType] || DefaultLayout,
    registerLayout: (type: string, node: LayoutComponent) => {
      layouts[type] = node
    },
    setCurrentLayout: (type: string) => {
      currentType = type
    },
  }
}

export const layoutManager = createLayoutManager()
