import redis from '@adonisjs/redis/services/main'
import { Network, Alchemy } from 'alchemy-sdk'

// Initialize Alchemy with your API key and network settings
const settings = {
  apiKey: process.env.ALCHEMY_API_KEY, // Make sure your Alchemy API key is in your .env file
  network: Network.ETH_MAINNET,
}
const alchemy = new Alchemy(settings)

export default class EthereumService {
  public static async getGasPrice() {
    const cachedGasPrice = await redis.get('gas_price')
    if (cachedGasPrice) return JSON.parse(cachedGasPrice)

    // Fetch the gas price using Alchemy SDK
    const gasPrice = await alchemy.core.getGasPrice()
    const gasPriceInGwei = Number.parseInt(gasPrice.toString(), 10) / 1e9 // Convert to Gwei if needed

    // Cache the gas price for 5 minutes (300 seconds)
    await redis.setex('gas_price', 300, JSON.stringify(gasPriceInGwei))
    return gasPriceInGwei
  }

  public static async getCurrentBlockNumber() {
    const cachedBlock = await redis.get('block_number')
    if (cachedBlock) return JSON.parse(cachedBlock)

    // Fetch the latest block number using Alchemy SDK
    const blockNumber = await alchemy.core.getBlockNumber()

    // Cache the block number for 5 minutess
    await redis.setex('block_number', 300, JSON.stringify(blockNumber))
    return blockNumber
  }

  public static async getAccountBalance(address: string) {
    // Fetch the account balance using Alchemy SDK
    const balance = await alchemy.core.getBalance(address)
    return Number.parseInt(balance.toString(), 10) // Convert to decimal format
  }
}
