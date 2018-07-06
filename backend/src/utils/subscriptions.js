import { pubsub } from '../resolverDefinition'
import * as Resolvers from '../resolvers'
import * as Utils from './index'

const conversationActivity = async (conversation, ctx) => {
  const { loaders } = ctx
  const proms = await Promise.all([
    Utils.presence.getTyping(conversation.id),
    Resolvers.activeParticipants(conversation, {}, ctx),
    loaders.participation.load(conversation.id),
  ])

  await pubsub.publish(`ConversationActivity-${conversation.id}`, {
    ConversationActivity: {
      ...conversation.dataValues,
      ...{
        typing: proms[0],
        participants: proms[1],
        active_participants: proms[2],
      },
    },
  })
}

export default { conversationActivity }
