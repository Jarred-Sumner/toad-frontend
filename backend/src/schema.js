import { makeExecutableSchema } from 'graphql-tools'
import resolvers from './resolverDefinition'

const typeDefs = `
scalar DateTime
scalar Date

type Board {
  id: ID!
  label: String
}

type Post {
  id: ID!
  createdAt: DateTime
  body: String
  attachment: String
}

type Thread {
  id: ID!
  posts: [Post]
}

type Query {
  BoardThreads(board: ID!, page: Int): [Thread]
  Thread(id: ID!, board: ID!): Thread
}

type Mutation {
  Post(parent: ID, body: String!): Thread
}
`

const schema = makeExecutableSchema({ typeDefs, resolvers })
export default schema
