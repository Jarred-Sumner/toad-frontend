import { RedisPubSub } from 'graphql-redis-subscriptions'
import { GraphQLDateTime, GraphQLDate } from 'graphql-iso-date'
import * as Resolvers from './resolvers'
import config from './config'

export const pubsub = new RedisPubSub(config('redis_url'))

const resolvers = {
  DateTime: GraphQLDateTime,
  Date: GraphQLDate,
  Query: {
    Board: Resolvers.board,
  },
  Post: {
    __resolveType: _ => (_.parent === null ? 'Thread' : 'Reply'),
  },
  Attachment: {
    thumbnail_url: _ => _.url,
  },
  Mutation: {
    Board: Resolvers.board,
    Session: Resolvers.session,
    Login: Resolvers.login,
    Attachment: Resolvers.createAttachment,
    Chat: Resolvers.chat,
  },
  BoardMutation: {
    Post: Resolvers.createPost,
    Chat: Resolvers.createChat,
  },
  Board: {
    threads: Resolvers.boardThreads,
    thread: Resolvers.thread,
  },
  Thread: {
    replies: Resolvers.threadReplies,
    reply_count: Resolvers.replyCount,
  },
  Subscription: {
    NewBoardMessage: {
      subscribe: (_, { board }, { session }) => {
        if (!session) {
          return 'Invalid session cookie'
        }
        return pubsub.asyncIterator(`NewBoardMessage.${board}`)
      },
    },
  },
}

export default resolvers
