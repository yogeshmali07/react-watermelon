import { synchronize } from '@nozbe/watermelondb/sync'
import { database } from './db'
import { BASE_URL } from '../config'
import Toast from 'react-native-toast-message'

export async function sync() {
  console.log('Sync is called')
  try {
    await synchronize({
      database,
      pullChanges: async ({ lastPulledAt }) => {
        const url = `${BASE_URL}/sync/pull?lastPulledAt=${lastPulledAt || 0}`

        const response = await fetch(url)
        const { changes, timestamp } = await response.json()
        return { changes, timestamp }
      },
      pushChanges: async ({ changes }) => {
        await fetch(`${BASE_URL}/sync/push`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(changes),
        })
      },
    })
     Toast.show({
      type: 'success',
      text1: 'Sync Successful',
      text2: 'Your local changes are now synced!'
    })

  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Sync Failed',
      text2: error.message || 'Something went wrong'
    })
  }
}
