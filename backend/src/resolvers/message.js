import { Op } from 'sequelize'
import { isObject } from 'lodash'
import { validatePost } from './createPost'
import Models from '../models'

export default async (_, args, ctx) => {
  const board = _.id
  const { identity } = _
  const { conversation_id } = args
  // Get conversation

  // const identity = Models.

  const convo = await Models.conversation.findOne({
    where: {
      id: conversation_id,
      board,
      [Op.or]: [
        {
          type: 'board_conversation',
        },
        {
          type: 'direct_conversation',

          participants: {
            [Op.contains]: [identity.id],
          },
        },
      ],
    },
  })
  if (!isObject(convo)) {
    return null
  }

  const validation = await validatePost(_, args, ctx)
  if (!isObject(validation)) {
    return null
  }

  const { post } = validation

  const inserted = await Models.conversation_messages.create({
    ...post,
    conversation_id: convo.id,
    board,
  })
  const withData = await Models.conversation_messages.findOne({
    where: { id: inserted.id },
  })

  // Broadcast subscription

  return withData
}
