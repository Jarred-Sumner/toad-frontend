import { Op } from 'sequelize'
import { isObject } from 'lodash'
import { pubsub } from '../resolverDefinition'
import Models from '../models'

export const broadcastList = async (sessionId, conversationId) => {
  const uc = await Models.conversation.findOne({
    where: {
      id: conversationId,
      expiry_date: {
        [Op.gt]: Models.sequelize.fn('now'),
      },
    },
    include: [
      {
        model: Models.session_conversations,
        attributes: ['participation_status', 'visibility', 'toggled_at'],
        where: {
          session_id: sessionId,
        },
        required: true,
      },
    ],
    raw: true,
  })
  if (!isObject(uc)) {
    return null
  }
  uc.participation_status = uc['session_conversations.participation_status']
  uc.visibility = uc['session_conversations.visibility']
  uc.toggled_at = uc['session_conversations.toggled_at']

  pubsub.publish(`VisibleConversations-${sessionId}`, {
    VisibleConversations: uc,
  })
  return uc
}

// Main resolver function
export default (_, args, { session, loaders }) =>
  loaders.activeConversations.load(session.id)
