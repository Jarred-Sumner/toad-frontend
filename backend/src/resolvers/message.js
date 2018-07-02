import { Op } from 'sequelize'
import { isObject, isNull } from 'lodash'
import { validatePost } from './createPost'
import { pubsub } from '../resolverDefinition'
import * as Utils from '../utils'
import Models from '../models'

export default async (_, args, ctx) => {
  const session_id = ctx.session.id
  const { conversation_id } = args
  // Get conversation

  const identity = await Utils.cache.getIdentityFromSession({
    session_id,
    conversation_id,
  })
  if (isNull(identity)) {
    return null
  }

  const { board } = identity

  const validation = await validatePost({ id: board, identity }, args, ctx)

  if (!isObject(validation)) {
    return null
  }

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

  const { post } = validation

  const inserted = await Models.conversation_messages.create({
    ...post,
    conversation_id: convo.id,
    board,
  })
  const withData = await Models.conversation_messages.findOne({
    where: { id: inserted.id },
  })

  pubsub.publish(`ConversationMessages-${convo.id}`, {
    ConversationMessages: withData,
  })

  return withData
}
