import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TodoListScreen from './src/screens/TodoListScreen';
import Toast from 'react-native-toast-message';

export default function App() {
  console.log('App rendered')
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <TodoListScreen />
        <Toast position="bottom" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}