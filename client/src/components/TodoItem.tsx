// src/components/TodoItem.tsx
// src/components/TodoItem.tsx
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import withObservables from '@nozbe/with-observables'
import Todo from '../database/model/Todo'

type Props = {
  todo: Todo
  onToggle: () => void
  onDelete: () => void
}

function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onToggle}
        style={[
          styles.checkbox,
          {
            borderColor: todo.is_done ? '#4caf50' : '#ccc',
            backgroundColor: todo.is_done ? '#4caf50' : 'transparent',
          },
        ]}
      />
      <Text
        style={[
          styles.title,
          {
            textDecorationLine: todo.is_done ? 'line-through' : 'none',
            color: todo.is_done ? '#999' : '#333',
          },
        ]}
      >
        {todo.title}
      </Text>
      <TouchableOpacity onPress={onDelete}>
        <Text style={styles.delete}>✕</Text>
      </TouchableOpacity>
    </View>
  )
}

// 👇 Wrap each Todo item with an observer
export default withObservables(['todo'], ({ todo }) => ({
  todo,
}))(TodoItem)


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  checkbox: {
    height: 24,
    width: 24,
    borderRadius: 6,
    borderWidth: 2,
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontSize: 16,
  },
  delete: {
    color: 'red',
    fontWeight: '600',
  },
})
