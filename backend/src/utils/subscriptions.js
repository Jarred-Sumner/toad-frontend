import { pubsub } from '../resolverDefinition'
import * as Utils from './index'

const conversationActivity = async conversation => {
  console.log('conversationactivity', conversation.id)
  const typingUsers = await Utils.presence.getTyping(conversation.id)
  await pubsub.publish(`ConversationActivity-${conversation.id}`, {
    ConversationActivity: {
      ...conversation.dataValues,
      typing: typingUsers,
    },
  })
}

export default { conversationActivity }
