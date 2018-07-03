import Redis from 'ioredis'
import config from '../config'

const redis = new Redis({
  host: config('redis_host'),
  port: Number(config('redis_port')),
})
const ts = () => Math.round(new Date().getTime() / 1000)
const statusTTL = 30
const typingTTL = 15

const getVisible = board => {
  const setKey = `${board}-active`
  const time = ts()
  const timeStart = time - statusTTL
  return redis.zrangebyscore(setKey, timeStart, time)
}

const getTyping = async conversation => {
  const setKey = `${conversation}-typing`
  const time = ts()
  const timeStart = time - typingTTL
  const raw = await redis.zrangebyscore(setKey, timeStart, time)
  return raw.map(r => JSON.parse(r))
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

const setTyping = async ({ conversation, identity }) => {
  const setKey = `${conversation}-typing`
  await redis.zadd(setKey, [ts(), JSON.stringify(identity)])
}

const setNotTyping = async ({ conversation, identity }) => {
  const setKey = `${conversation}-typing`
  await redis.zrem(setKey, JSON.stringify(identity))
}

export default {
  setVisible,
  setInactive,
  getVisible,
  getTyping,
  setTyping,
  setNotTyping,
  redis,
}
