import { Op } from 'sequelize'
import { isObject } from 'lodash'
import Models from '../models'
import * as Utils from '../utils'

export default async (_, { conversation_id, is_typing }, { session }) => {
  const convo = await Models.conversation.findOne({
    include: [
      {
        model: Models.session_conversations,
        where: {
          session_id: session.id,
          conversation_id,
          participation_status: {
            [Op.not]: ['declined', 'expired'],
          },
        },
        required: true,
      },
    ],
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

  await typingMethod({
    conversation: conversation_id,
    identity,
  })

  await Utils.subscriptions.conversationActivity(convo)

  return is_typing
}
