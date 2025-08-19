import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import { mySchema } from './schema'
import Todo from './model/Todo'

const adapter = new SQLiteAdapter({
  schema: mySchema,
  jsi: true,
})

export const database = new Database({
  adapter,
  modelClasses: [Todo],
  actionsEnabled: true,
})
