// src/screens/TodoListScreen.tsx
import React, { useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native'
import withObservables from '@nozbe/with-observables'
import { database } from '../database/db'
import Todo from '../database/model/Todo'
import TodoItem from '../components/TodoItem'
import { sync } from '../database/syncManager'

function TodoListScreen({ todos }: { todos: Todo[] }) {
  const [newTodo, setNewTodo] = useState('')

  const addTodo = async () => {
    if (!newTodo.trim()) return
    await database.write(async () => {
      await database.get<Todo>('todos').create(todo => {
        todo.title = newTodo
        todo.is_done = false
        todo.updated_at = Date.now()
      })
    })
    setNewTodo('')
  }

  const toggleTodo = async (todo: Todo) => {
    await database.write(async () => {
      await todo.update(t => {
        t.is_done = !t.is_done
        t.updated_at = Date.now()
      })
    })
  }

  const deleteTodo = async (todo: Todo) => {
    await database.write(async () => {
      await todo.markAsDeleted() // sync safe delete
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Todos</Text>
       <TouchableOpacity
  onPress={() => {
    console.log("Sync button pressed");
    sync();
  }}
  style={styles.syncButton}
>
  <Text style={styles.syncButtonText}>Sync</Text>
</TouchableOpacity>

      </View>

      {/* Add Input */}
      <View style={styles.inputContainer}>
        <TextInput
          value={newTodo}
          onChangeText={setNewTodo}
          placeholder="Add a new task..."
          style={styles.input}
        />
        <TouchableOpacity onPress={addTodo} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Todo List */}
      <FlatList
        data={todos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            onToggle={() => toggleTodo(item)}
            onDelete={() => deleteTodo(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  )
}

// Wrap with WatermelonDB HOC to observe live todos
const enhance = withObservables([], () => ({
  todos: database.get<Todo>('todos').query().observe(),
}))

export default enhance(TodoListScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  syncButton: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  syncButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    shadowOpacity: 0.05,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 8,
  },
  addButton: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 40,
  },
})
