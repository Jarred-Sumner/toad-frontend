import { Op } from 'sequelize'
import { isNull } from 'lodash'
import { broadcastList } from './activeConversations'
import Models from '../models'

export default async (
  _,
  { participation_status, visibility, conversation_id },
  { session }
) => {
  const existing = await Models.session_conversations.findOne({
    where: {
      conversation_id,
      session_id: session.id,
    },
  })
  if (existing) {
    if (participation_status) {
      existing.participation_status = participation_status
    }
    if (visibility) {
      existing.visibility = visibility
      existing.toggled_at = new Date()
    }
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

    const newSC = {
      conversation_id,
      session_id: session.id,
      identity_id: identity.id,
    }

    if (participation_status) {
      newSC.participation_status = participation_status
    }
    if (visibility) {
      newSC.visibility = visibility
      existing.toggled_at = new Date()
    }

    await Models.session_conversations.create(newSC)
  }

  const usersConversations = await broadcastList(session.id, conversation_id)

  // Update the subscription here
  return usersConversations
}
