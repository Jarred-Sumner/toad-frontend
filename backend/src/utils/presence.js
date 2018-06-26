import Redis from 'ioredis'
import config from '../config'

const redis = new Redis({
  host: config('redis_host'),
  port: config('redis_port'),
})
const ts = () => Math.round(new Date().getTime() / 1000)
const statusTTL = 30

const getVisible = board => {
  const setKey = `${board}-active`
  const time = ts()
  const timeStart = time - statusTTL
  return redis.zrangebyscore(setKey, timeStart, time)
}

const setVisible = async ({ board, identity_id }) => {
  const setKey = `${board}-active`
  await redis.zadd(setKey, [ts(), identity_id])
  return getVisible(board)
}

const setInactive = async ({ board, identity_id }) => {
  const setKey = `${board}-active`
  await redis.zrem(setKey, identity_id)
  return getVisible(board)
}

export default { setVisible, setInactive, getVisible }
