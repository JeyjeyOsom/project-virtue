// app/Services/EthereumService.ts
import axios from 'axios'
import redis from '@adonisjs/redis/services/main'

export default class EthereumService {
  private static async fetchFromAlchemy(endpoint: string) {
    const alchemyApiKey = process.env.ALCHEMY_API_KEY
    const response = await axios.get(
      `https://eth-mainnet.alchemyapi.io/v2/${alchemyApiKey}/${endpoint}`
    )
    return response.data
  }

  public static async getGasPrice() {
    const cachedGasPrice = await redis.get('gas_price')
    if (cachedGasPrice) return JSON.parse(cachedGasPrice)

    const data = await this.fetchFromAlchemy('eth_gasPrice')
    const gasPrice = Number.parseInt(data.result, 16) // Convert hex to decimal

    // Cache for 5 minutes
    await redis.setex('gas_price', 300, JSON.stringify(gasPrice))
    return gasPrice
  }

  public static async getCurrentBlockNumber() {
    const cachedBlock = await redis.get('block_number')
    if (cachedBlock) return JSON.parse(cachedBlock)

    const data = await this.fetchFromAlchemy('eth_blockNumber')
    const blockNumber = Number.parseInt(data.result, 16)

    // Cache for 5 minutes
    await redis.setex('block_number', 300, JSON.stringify(blockNumber))
    return blockNumber
  }

  public static async getAccountBalance(address: string) {
    const data = await this.fetchFromAlchemy(`eth_getBalance?address=${address}&tag=latest`)
    return Number.parseInt(data.result, 16) // Convert hex to decimal
  }
}
