import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'account_balances'

  public async up() {
    this.schema.createTable('account_balances', (table) => {
      table.increments('id')
      table.string('address').notNullable()
      table.bigInteger('balance').notNullable()
      table.timestamp('timestamp').defaultTo(this.now())
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable('account_balances')
  }
}
