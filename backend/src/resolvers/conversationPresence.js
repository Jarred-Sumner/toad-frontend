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
    await Models.session_conversations.create({
      conversation_id,
      session_id: session.id,
      participation_status: optInStatus,
    })
  }

  const usersConversations = await broadcastList(session.id, conversation_id)

  // Update the subscription here
  return usersConversations
}
