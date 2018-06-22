import { GraphQLDateTime, GraphQLDate } from 'graphql-iso-date'
import * as Resolvers from './resolvers'

const resolvers = {
  DateTime: GraphQLDateTime,
  Date: GraphQLDate,
  Query: {
    Board: Resolvers.board,
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
    posts: Resolvers.threadPosts,
  },
  Identity: { name: Resolvers.demoji },
  PersonalIdentity: { name: Resolvers.demoji },
}

export default resolvers
