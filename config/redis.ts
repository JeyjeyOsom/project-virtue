import env from '#start/env'

const redisConfig = {
  connection: env.get('REDIS_CONNECTION', 'local'),
  connections: {
    local: {
      host: env.get('REDIS_HOST', '127.0.0.1'),
      port: env.get('REDIS_PORT', '6379'),
      password: env.get('REDIS_PASSWORD', ''),
      db: 0,
      keyPrefix: '',
    },
  },
}

export default redisConfig
