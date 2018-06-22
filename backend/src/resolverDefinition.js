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
  Mutation: {
    Board: Resolvers.board,
    Session: Resolvers.session,
    Login: Resolvers.login,
  },
  BoardMutation: {
    Post: Resolvers.createPost,
    Attachment: Resolvers.createAttachment,
  },
  Board: {
    threads: Resolvers.boardThreads,
    thread: Resolvers.thread,
  },
  Thread: {
    replies: Resolvers.threadReplies,
  },
}

export default resolvers
