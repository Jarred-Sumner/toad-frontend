import Redis from 'ioredis'
import Bluebird from 'bluebird'
import { isArray, pull } from 'lodash'
import config from '../config'

const redis = new Redis(config('redis_url'))

const connectedUsers = {}

const setVisible = async ({ board, identity_id }) => {
  if (!isArray(connectedUsers[board])) {
    connectedUsers[board] = []
  }
  const setKey = `${board}-members`
  await redis.sadd(setKey, identity_id)
  connectedUsers[board].push(identity_id)
  return redis.smembers(setKey)
}

const setInactive = async ({ board, identity_id }) => {
  if (!isArray(connectedUsers[board])) {
    connectedUsers[board] = []
  }
  const setKey = `${board}-members`
  await redis.srem(setKey, identity_id)
  pull(connectedUsers[board], identity_id)
  return redis.smembers(setKey)
}

const closeServer = () => {
  const topics = Object.keys(connectedUsers)
  return Bluebird.map(topics, async topic => {
    const setKey = `${topic}-members`
    const identities = connectedUsers[topic]
    return redis.srem(setKey, identities)
  })
}

export default { setVisible, setInactive, closeServer }
