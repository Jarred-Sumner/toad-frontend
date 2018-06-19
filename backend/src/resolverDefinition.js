import { GraphQLDateTime, GraphQLDate } from 'graphql-iso-date'
// import * as Resolvers from './resolvers'

const resolvers = {
  DateTime: GraphQLDateTime,
  Date: GraphQLDate,
  Query: {},
  Mutation: {},
}

export default resolvers
