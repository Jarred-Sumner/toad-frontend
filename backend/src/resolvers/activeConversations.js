import { Op } from 'sequelize'
import { pubsub } from '../resolverDefinition'
import Models from '../models'

export const getConversations = async sessionId => {
  const uc = await Models.conversation.findAll({
    include: [
      {
        model: Models.session_conversations,
        attributes: ['participation_status'],
        where: {
          session_id: sessionId,
          participation_status: {
            [Op.or]: ['explicit_opt_in', 'auto'],
          },
        },
        required: true,
      },
    ],
    raw: true,
  })

  const usersConversations = uc.map(c => ({
    ...c,
    participation_status: c['session_conversations.participation_status'],
  }))
  return usersConversations
}

export const broadcastList = async sessionId => {
  const convos = await getConversations(sessionId)
  await pubsub.publish(`ConversationUpdates-${sessionId}`, {
    ActiveConversations: convos,
  })
  return convos
}

// Main resolver function
export default (_, args, { session }) => getConversations(session.id)
