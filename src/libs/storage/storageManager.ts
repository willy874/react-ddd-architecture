import { EventEmitter } from 'events'

export class StorageManager {
  private current: Storage
  private emitter = new EventEmitter()
  private batchCount = 0
  private batchQueue: StorageEvent[] = []

  constructor(storage: Storage) {
    this.current = storage
  }

  getItem(key: string) {
    return this.current.getItem(key)
  }

  setItem(key: string, value: string) {
    const event = new StorageEvent('storage', {
      key,
      oldValue: value,
      newValue: this.getItem(key),
      url: window.location.href,
    })
    this.current.setItem(key, value)
    this.emit(event)
  }

  removeItem(key: string) {
    const event = new StorageEvent('storage', {
      key,
      oldValue: this.getItem(key),
      newValue: null,
      url: window.location.href,
    })
    this.current.removeItem(key)
    this.emit(event)
  }

  on(listener: (event: StorageEvent) => void) {
    this.emitter.on('change', listener)
    return () => {
      this.emitter.off('change', listener)
    }
  }

  off(listener: (event: StorageEvent) => void) {
    this.emitter.off('change', listener)
  }

  emit(event: StorageEvent) {
    this.emitter.emit('change', event)
    this.batchCount++
    Promise.resolve().then(() => {
      this.emitBatchUpdated(event)
    })
  }

  onBatchUpdated(listener: (events: StorageEvent[]) => void) {
    this.emitter.on('batchUpdated', listener)
    return () => {
      this.emitter.off('batchUpdated', listener)
    }
  }

  emitBatchUpdated(event: StorageEvent) {
    this.batchQueue.push(event)
    this.batchCount--
    if (this.batchCount === 0) {
      this.emitter.emit('batchUpdated', this.batchQueue)
      this.batchQueue = []
    }
  }
}
