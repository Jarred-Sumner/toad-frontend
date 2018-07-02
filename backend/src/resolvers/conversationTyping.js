import { Op } from 'sequelize'
import { isObject } from 'lodash'
import { pubsub } from '../resolverDefinition'
import Models from '../models'
import * as Utils from '../utils'

export default async (_, { conversation_id, is_typing }, { session }) => {
  const convo = await Models.session_conversations.findOne({
    where: {
      session_id: session.id,
      conversation_id,
      participation_status: {
        [Op.not]: ['declined', 'expired'],
      },
    },
  })

  if (!isObject(convo)) {
    return null
  }

  const identity = await Utils.cache.getIdentityFromSession({
    session_id: session.id,
    conversation_id,
  })

  const typingMethod = is_typing
    ? Utils.presence.setTyping
    : Utils.presence.setNotTyping

  const typingUsers = await typingMethod({
    conversation_id,
    identity,
  })

  await pubsub.publish(`ConversationActivity-${conversation_id}`, {
    ConversationActivity: {
      id: conversation_id,
      typing: typingUsers,
    },
  })

  return is_typing
}
