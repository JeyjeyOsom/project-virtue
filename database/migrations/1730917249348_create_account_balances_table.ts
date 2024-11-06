import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'account_balances'

  public async up() {
    this.schema.createTable('account_balances', (table) => {
      table.increments('id')
      table.string('address').notNullable()
      table.bigInteger('balance').notNullable()
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable('account_balances')
  }
}
