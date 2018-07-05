import Models from '../models'

export default async (_, { id }, { session }) => {
  // Verify that this person is a part of this conversation
  const convo = await Models.conversation.findOne({
    where: { id },
    attributes: ['id', 'type', 'board', 'participants', 'expiry_date'],
    include: [
      {
        model: Models.session_conversations,
        where: { session_id: session.id },
        attributes: ['participation_status'],
        required: false,
      },
    ],
  })

  if (convo === null) {
    return null
  }

  if (
    convo.type === 'direct_conversation' &&
    convo.session_conversations.length === 0
  ) {
    return null
  }

  return convo
}
