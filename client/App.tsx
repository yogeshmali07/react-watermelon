import React, {useEffect} from 'react';
import Toast from 'react-native-toast-message';
import TodoListScreen from './src/screens/TodoListScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { startSyncService, stopSyncService } from './src/services/syncService'

export default function App() {
  useEffect(() => {
    startSyncService()
    return () => stopSyncService() 
  }, [])
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <TodoListScreen />
        <Toast position="bottom" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}