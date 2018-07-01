import { Op } from 'sequelize'
import { isObject, isNull, get } from 'lodash'
import { validatePost } from './createPost'
import { pubsub } from '../resolverDefinition'
import Models from '../models'

const getIdentityFromSession = ({ session_id, conversation_id }) =>
  Models.sequelize.query(
    `select i.id as identity_id, i.board as board
from session_conversations sc
join identities i on (i.session_id = sc.session_id)
join conversations c on (c.id = sc.conversation_id)
where sc.session_id = :session_id
and i.board = c.board
and i.expires_at > now()
and sc.conversation_id = :conversation_id
limit 1`,
    {
      replacements: { session_id, conversation_id },
      type: Models.sequelize.QueryTypes.SELECT,
    }
  )

export default async (_, args, ctx) => {
  const session_id = ctx.session.id
  const { conversation_id } = args
  // Get conversation

  const idLookup = await getIdentityFromSession({ session_id, conversation_id })
  const identity = get(idLookup, '[0].identity_id', null)
  const board = get(idLookup, '[0].board', null)
  if (isNull(identity)) {
    return null
  }

  const validation = await validatePost(
    { id: board, identity: { id: identity } },
    args,
    ctx
  )

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
            [Op.contains]: [identity],
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
