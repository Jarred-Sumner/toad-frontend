import { makeExecutableSchema } from 'graphql-tools'
import resolvers from './resolverDefinition'

const typeDefs = `
scalar DateTime
scalar Date

enum auth_type {
  anonymous
  account
}

type Identity {
  name: String
  expires_at: DateTime
  authentication: auth_type
  email: String
}

type Board {
  id: ID!
  label: String
  threads(page: Int): [Thread]
  thread(id: ID!): Thread
  identity: Identity
}

type Post {
  id: ID!
  created_at: DateTime
  body: String
  attachment: String
}

type Thread {
  id: ID!
  posts: [Post]
}

type Query {
  Board(id:ID!): Board
}

type BoardMutation {
  Post(parent: ID, body: String!): Thread
}

type Mutation {
  Board(id:ID!): BoardMutation
  Session(email_token: String): String
  Login(email: String!): Boolean
}
`

const schema = makeExecutableSchema({ typeDefs, resolvers })
export default schema
