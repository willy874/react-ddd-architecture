import { ApplicationPlugin } from '@/core'
import { StorageManager } from './storageManager'

const storageManager = new StorageManager(window.localStorage)

export const StoragePlugin = (): ApplicationPlugin => {
  return app => {
    app.provider('getStorageItem', (key: string) => {
      return storageManager.getItem(key)
    })
    app.provider('setStorageItem', (key: string, value: string) => {
      storageManager.setItem(key, value)
    })
    app.provider('removeStorageItem', (key: string) => {
      storageManager.removeItem(key)
    })
    storageManager.on(event => {
      app.emit('storageChange', event)
    })
    storageManager.onBatchUpdated(events => {
      app.emit('storageBatchChange', events)
    })
    return {}
  }
}

declare module '@/core' {
  interface ApplicationEvent {
    storageChange: (event: StorageEvent) => void
    storageBatchChange: (events: StorageEvent[]) => void
  }
  interface ApplicationService {
    getStorageItem: (key: string) => string | null
    setStorageItem: (key: string, value: string) => void
    removeStorageItem: (key: string) => void
  }
}
