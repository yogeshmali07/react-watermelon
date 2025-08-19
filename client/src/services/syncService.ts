// src/services/syncService.ts
import NetInfo from '@react-native-community/netinfo'
import { sync } from '../database/syncManager'

let unsubscribe: (() => void) | null = null
let syncing = false

export function startSyncService() {

  unsubscribe = NetInfo.addEventListener(state => {
    const hasInternet = !!state.isConnected && !!state.isInternetReachable
    if (hasInternet && !syncing) {
      triggerSync()
    } else {
    }
  })
}

export function stopSyncService() {
  if (unsubscribe) {
    unsubscribe()
    unsubscribe = null
  }
}

async function triggerSync() {
  if (syncing) return
  syncing = true

  try {
    await sync()
  } catch (err) {
    console.error("❌ Auto-sync failed:", err)
  } finally {
    syncing = false
  }
}
