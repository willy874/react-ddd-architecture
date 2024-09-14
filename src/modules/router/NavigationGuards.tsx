import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import type { Location } from 'react-router-dom'

export interface NavigationGuardsProps {
  onChange?: (value: Location, oldValue: Location) => void
  children: React.ReactNode
}

export default function NavigationGuards({
  onChange,
  children,
}: NavigationGuardsProps) {
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const location = useLocation()
  const prevLocation = useRef(location)
  useEffect(() => {
    if (location.pathname !== prevLocation.current.pathname) {
      window.scrollTo(0, 0)
    }
    const prev = prevLocation.current
    prevLocation.current = location
    onChangeRef.current?.(prevLocation.current, prev)
  }, [location])

  return children
}
