import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const mySchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'todos',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'is_done', type: 'boolean' },
        { name: 'updated_at', type: 'number' }, // use number for timestamp
      ],
    }),
  ],
})
