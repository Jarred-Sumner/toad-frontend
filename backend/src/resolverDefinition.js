import { RedisPubSub } from 'graphql-redis-subscriptions'
import { GraphQLDateTime, GraphQLDate } from 'graphql-iso-date'
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
  },
  Conversation: {
    __resolveType: _ =>
      _.type === 'board_conversation'
        ? 'BoardConversation'
        : 'DirectConversation',
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
    ConversationPresence: Resolvers.conversationPresence,
  },
  BoardMutation: {
    Post: Resolvers.createPost,
    Activity: Resolvers.activityMutation,
    StartDirectConversation: Resolvers.startDirectConversation,
    Message: Resolvers.message,
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
    // NewBoardMessage: {
    //   subscribe: (_, { board }, { session }) => {
    //     if (!session) {
    //       return 'Invalid session cookie'
    //     }
    //     return pubsub.asyncIterator(`NewBoardMessage.${board}`)
    //   },
    // },
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
