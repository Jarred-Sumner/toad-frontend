import { Op } from 'sequelize'
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
    existing.opt_in_status = optInStatus
    await existing.save()
  } else {
    await Models.session_conversations.create({
      conversation_id,
      session_id: session.id,
      opt_in_status: optInStatus,
    })
  }

  const usersConversations = await Models.session_conversations.find({
    where: {
      session_id: session.id,
      opt_in_status: {
        [Op.or]: ['explicit_opt_in', 'auto'],
      },
    },
  })
  // Update the subscription here
  return usersConversations
}
