import { StorageManager } from '../../libs/storage/storageManager'

export const localStorageManager = new StorageManager(window.localStorage)

export const sessionStorageManager = new StorageManager(window.sessionStorage)
