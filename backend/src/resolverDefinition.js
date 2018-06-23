import { GraphQLDateTime, GraphQLDate } from 'graphql-iso-date'
import * as Resolvers from './resolvers'

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
  },
  BoardMutation: {
    Post: Resolvers.createPost,
  },
  Board: {
    threads: Resolvers.boardThreads,
    thread: Resolvers.thread,
  },
  Thread: {
    replies: Resolvers.threadReplies,
    reply_count: Resolvers.replyCount,
  },
}

export default resolvers
