import { GraphQLDateTime, GraphQLDate } from 'graphql-iso-date'
import * as Resolvers from './resolvers'

const resolvers = {
  DateTime: GraphQLDateTime,
  Date: GraphQLDate,
  Query: {
    BoardThreads: Resolvers.boardThreads,
    Thread: Resolvers.thread,
  },
  Mutation: {},
  Thread: {
    posts: Resolvers.threadPosts,
  },
}

export default resolvers
