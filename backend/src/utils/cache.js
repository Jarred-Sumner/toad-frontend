import { Op } from 'sequelize'
import moment from 'moment'
import { isObject, isNull, isString, get } from 'lodash'
import * as Utils from '../utils'
import Models from '../models'

const queryIdentity = ({ session_id, conversation_id }) =>
  Models.identity.findOne({
    where: {
      expires_at: {
        [Op.gt]: new Date(),
      },
    },
    include: {
      model: Models.session_conversations,
      where: {
        session_id,
        conversation_id,
      },
      required: true,
    },
    attributes: ['id', 'name', 'board', 'expires_at'],
  })

const getIdentityFromSession = async ({ session_id, conversation_id }) => {
  const key = `${conversation_id}-${session_id}-`
  const cacheResult = await Utils.presence.redis.get(key)

  if (isString(cacheResult)) {
    let data
    try {
      data = JSON.parse(cacheResult)
    } catch (e) {
      data = null
    }
    if (isObject(data)) {
      return data
    }
  }

  const result = await queryIdentity({ session_id, conversation_id })
  if (isNull(result)) {
    const conversation = await Models.conversation.findOne({
      where: { id: conversation_id },
      attributes: ['id', 'board'],
    })
    if (isNull(conversation)) {
      return null
    }

    const identity = await Models.identity.findOne({
      where: {
        board: conversation.board,
        session_id,
        expires_at: {
          [Op.gt]: new Date(),
        },
      },
      attributes: ['id'],
    })

    await Models.session_conversations.create({
      session_id,
      conversation_id,
      identity_id: identity.id,
    })
    const retry = await queryIdentity({ session_id, conversation_id })
    result = get(retry, '[0]', null)
    if (isNull(result)) {
      return null
    }
  }
  const ttl = Math.abs(moment().diff(result.expires_at, 'seconds'))
  Utils.presence.redis.set(key, JSON.stringify(result), 'EX', ttl)
  Utils.presence.redis.set(
    `identity-${result.id}`,
    JSON.stringify(result),
    'EX',
    ttl
  )
  return result
}

const getCachedIdentity = async identityId => {
  const key = `identity-${identityId}`
  const cacheResult = await Utils.presence.redis.get(key)
  if (isString(cacheResult)) {
    let data
    try {
      data = JSON.parse(cacheResult)
    } catch (e) {
      data = null
    }
    if (isObject(data)) {
      return data
    }
  }
  const identity = await Models.identity.findOne({
    where: { id: identityId },
    attributes: ['id', 'name', 'board', 'expires_at'],
  })

  const ttl = Math.abs(moment().diff(identity.expires_at, 'seconds'))
  Utils.presence.redis.set(key, JSON.stringify(identity), 'EX', ttl)

  return identity
}

export default { queryIdentity, getIdentityFromSession, getCachedIdentity }
