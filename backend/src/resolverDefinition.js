import { Op } from 'sequelize'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import GraphQLJSON from 'graphql-type-json'
import { isObject, get, isNull } from 'lodash'
import { GraphQLDateTime, GraphQLDate } from 'graphql-iso-date'
import Models from './models'
import * as Utils from './utils'
import * as Resolvers from './resolvers'
import config from './config'

export const pubsub = new RedisPubSub({
  connection: {
    host: config('redis_host'),
    port: config('redis_port'),
    retry_strategy: options => Math.max(options.attempt * 100, 3000),
  },
})

const resolvers = {
  DateTime: GraphQLDateTime,
  Date: GraphQLDate,
  JSON: GraphQLJSON,
  IdentityBase: {
    __resolveType: (_, args, { session }) =>
      _.session_id === session.id ? 'PersonalIdentity' : 'Identity',
  },
  Query: {
    Board: Resolvers.board,
    ActiveConversations: Resolvers.activeConversations,
    Conversation: Resolvers.conversation,
  },
  Conversation: {
    __resolveType: _ =>
      _.type === 'board_conversation'
        ? 'BoardConversation'
        : 'DirectConversation',
  },
  DirectConversation: {
    messages: Resolvers.conversationMessages,
    user_identity: Resolvers.conversationIdentity,
    participants: Resolvers.participation,
    active_participants: Resolvers.activeParticipants,
    board: _ => get(Models, `Boards[${_.board}]`, null),
  },
  BoardConversation: {
    messages: Resolvers.conversationMessages,
    user_identity: Resolvers.conversationIdentity,
    participants: Resolvers.participation,
    active_participants: Resolvers.activeParticipants,
    participation_status: _ =>
      isNull(_.participation_status) ? 'auto' : _.participation_status,
    board: _ => get(Models, `Boards[${_.board}]`, null),
  },
  Post: {
    __resolveType: _ => (_.parent === null ? 'Thread' : 'Reply'),
  },
  Attachment: {
    url: Utils.signImageUrl,
  },
  Mutation: {
    Board: Resolvers.board,
    Session: Resolvers.session,
    Login: Resolvers.login,
    Attachment: Resolvers.createAttachment,
    Message: Resolvers.message,
    ConversationState: Resolvers.conversationState,
    ConversationTyping: Resolvers.conversationTyping,
  },
  BoardMutation: {
    Post: Resolvers.createPost,
    Activity: Resolvers.activityMutation,
    StartDirectConversation: Resolvers.startDirectConversation,
  },
  Board: {
    threads: Resolvers.boardThreads,
    thread: Resolvers.thread,
    activity: Resolvers.activity,
    expires_at: () => Utils.expiry(),
  },
  Thread: {
    replies: Resolvers.threadReplies,
    reply_count: Resolvers.replyCount,
  },
  Subscription: {
    ConversationMessages: {
      subscribe: async (_, { conversation_id }, { session }) => {
        const identity = await Utils.cache.getIdentityFromSession({
          conversation_id,
          session_id: session.id,
        })
        const convo = await Models.conversation.findOne({
          where: {
            id: conversation_id,
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

        return pubsub.asyncIterator(`ConversationMessages-${conversation_id}`)
      },
    },
    ConversationActivity: {
      subscribe: async (_, { conversation_id }, { session }) => {
        const convo = await Models.session_conversations.findOne({
          where: {
            conversation_id,
            session_id: session.id,
          },
        })

        if (!isObject(convo)) {
          return null
        }

        return pubsub.asyncIterator(`ConversationActivity-${conversation_id}`)
      },
    },
    VisibleConversations: {
      subscribe: (_, args, { session }) => {
        if (!isObject(session)) {
          return null
        }
        return pubsub.asyncIterator(`VisibleConversations-${session.id}`)
      },
    },
    BoardActivity: {
      subscribe: (_, { board }, { session }) => {
        if (!session) {
          return 'Invalid session cookie'
        }
        return pubsub.asyncIterator(`BoardActivity.${board}`)
      },
    },
  },
}

export default resolvers
