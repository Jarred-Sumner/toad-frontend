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
  createdAt: DateTime
  updatedAt: DateTime
  bumpedAt: DateTime
  posts: [Post]
}

type Query {
  Board(id: ID!, page: Int): [Thread]
  Post(id: ID!): Post
}

type Mutation {
  CreatePost(parentId: ID, body: String!): Thread
}
`

const schema = makeExecutableSchema({ typeDefs, resolvers })
export default schema
