import { RedisPubSub } from 'graphql-redis-subscriptions'
import { isObject, get } from 'lodash'
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
    board: _ => get(Models, `Boards[${_.board}]`, null),
  },
  BoardConversation: {
    messages: Resolvers.conversationMessages,
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
    ConversationPresence: Resolvers.conversationPresence,
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
    board_conversation: Resolvers.boardConversation,
  },
  Thread: {
    replies: Resolvers.threadReplies,
    reply_count: Resolvers.replyCount,
  },
  Subscription: {
    ConversationMessages: {
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
