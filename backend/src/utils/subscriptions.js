import { pubsub } from '../resolverDefinition'
import * as Utils from './index'

const conversationActivity = async conversation => {
  const typingUsers = await Utils.presence.getTyping(conversation.id)

  await pubsub.publish(`ConversationActivity-${conversation.id}`, {
    ConversationActivity: {
      ...conversation,
      typing: typingUsers,
    },
  })
}

export { conversationActivity }
