import moment from 'moment'
import { isObject } from 'lodash'
import { Op } from 'sequelize'
import Model from '../models'

export default async ({ id, identity }, { target_user }, { session }) => {
  const board = id
  const identityIds = [identity.id, target_user]
  // ensure that there doesn't already exist a conversation
  const existing = await Model.conversation.findOne({
    where: {
      participants: {
        [Op.contains]: identityIds,
      },
      type: 'direct_conversation',
    },
  })
  console.log(JSON.stringify(existing, null, 2))
  if (isObject(existing)) {
    return existing
  }

  // get target_user's identity, return null if not found

  const targetIdentity = await Model.identity.findOne({
    id: target_user,
    expires_at: {
      [Op.gt]: new Date(),
    },
  })

  if (!targetIdentity) {
    return null
  }

  const newConvo = await Model.conversation.create({
    board,
    participants: identityIds,
    type: 'direct_conversation',
    expiry_date: moment()
      .add(5, 'minutes')
      .toISOString(),
  })

  // add convo to users' conversations
  const newConvos = await Model.session_conversations.bulkCreate([
    {
      // Conversation creator:
      session_id: session.id,
      conversation_id: newConvo.id,
      participation_status: 'explicit_opt_in',
    },
    {
      // Message receipient:
      session_id: targetIdentity.session_id,
      conversation_id: newConvo.id,
      participation_status: 'auto',
    },
  ])
  // Broadcast subscription update here
  return newConvo
}
