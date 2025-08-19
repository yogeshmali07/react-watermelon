import { Model } from '@nozbe/watermelondb'
import { field, date } from '@nozbe/watermelondb/decorators'

export default class Todo extends Model {
  static table = 'todos'

  @field('title') title!: string
  @field('is_done') is_done!: boolean
  @date('updated_at') updated_at!: number
}
