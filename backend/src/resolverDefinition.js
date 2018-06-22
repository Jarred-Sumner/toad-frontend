import { GraphQLDateTime, GraphQLDate } from 'graphql-iso-date'
import * as Resolvers from './resolvers'

const resolvers = {
  DateTime: GraphQLDateTime,
  Date: GraphQLDate,
  Query: {
    Board: Resolvers.board,
  },
  Mutation: {
    Session: Resolvers.session,
    Login: Resolvers.login,
  },
  Board: {
    threads: Resolvers.boardThreads,
    thread: Resolvers.thread,
  },
  Thread: {
    posts: Resolvers.threadPosts,
  },
}

export default resolvers
