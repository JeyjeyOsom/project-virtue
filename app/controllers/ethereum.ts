import type { HttpContext } from '@adonisjs/core/http'
import EthereumService from '#services/ethereum'
import AccountBalance from '#models/account_balance'

export default class EthereumController {
  public async handle({ request, response }: HttpContext) {
    const address = request.input('address')

    if (!address) {
      return response.badRequest({ error: 'Ethereum address is required' })
    }

    try {
      const [gasPrice, blockNumber, balance] = await Promise.all([
        EthereumService.getGasPrice(),
        EthereumService.getCurrentBlockNumber(),
        EthereumService.getAccountBalance(address),
      ])

      // Save balance to the database using the AccountBalance model
      await AccountBalance.create({ address, balance })

      return response.json({ gasPrice, blockNumber, balance })
    } catch (error) {
      return response.internalServerError({ error: 'Failed to fetch Ethereum data' })
    }
  }
}
