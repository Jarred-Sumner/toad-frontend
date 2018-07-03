import { Op } from 'sequelize'
import { isNull } from 'lodash'
import { broadcastList } from './activeConversations'
import Models from '../models'

export default async (_, { presence, conversation_id }, { session }) => {
  const optInStatus = presence ? 'explicit_opt_in' : 'declined'
  const existing = await Models.session_conversations.findOne({
    where: {
      conversation_id,
      session_id: session.id,
    },
  })
  if (existing) {
    existing.participation_status = optInStatus
    await existing.save()
  } else {
    const conversation = await Models.conversations.findOne({
      where: { id: conversation_id },
      attributes: ['id', 'board'],
    })
    if (isNull(conversation)) {
      return null
    }

    const identity = await Models.identity.findOne({
      where: {
        board: conversation.board,
        session_id: session.id,
        expires_at: {
          [Op.gt]: new Date(),
        },
      },
      attributes: ['id'],
    })

    await Models.session_conversations.create({
      conversation_id,
      session_id: session.id,
      identity_id: identity.id,
      participation_status: optInStatus,
    })
  }

  const usersConversations = await broadcastList(session.id, conversation_id)

  // Update the subscription here
  return usersConversations
}
