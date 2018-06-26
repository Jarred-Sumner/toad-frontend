import { makeExecutableSchema } from 'graphql-tools'
import resolvers from './resolverDefinition'

const typeDefs = `
scalar DateTime
scalar Date

enum auth_type {
  anonymous
  account
}

interface IdentityBase {
  id: ID!
  name: String
}

type Identity implements IdentityBase {
  id: ID!
  name: String
}

type PersonalIdentity implements IdentityBase {
  id: ID!
  name: String
  expires_at: DateTime
  email: String
}

# Copied from https://github.com/Jarred-Sumner/toads/blob/ce2e651625d56fafd415f5ebe466cb40eb3b20de/frontend/components/Gradient.js#L1
enum BoardColorScheme {
  blue
  purple_red
  pink
  slate
  red
  green
}

type Board {
  id: ID!
  label: String
  threads(page: Int): [Thread]
  thread(id: ID!): Thread
  identity: PersonalIdentity
  color_scheme: BoardColorScheme
  chat(offset: Int, limit: Int): BoardChat
  activity: BoardActivity
}

type BoardActivity {
  active_count: Int
  active_identities: [Identity]
}

type BoardChat {
  messages: [ChatMessage]
}

interface Post {
  id: ID!
  created_at: DateTime
  body: String
  identity: Identity
  attachment: Attachment
}

type Reply implements Post {
  id: ID!
  created_at: DateTime
  body: String
  identity: Identity
  attachment: Attachment
  parent: ID
}

type ChatMessage implements Post {
  id: ID!
  created_at: DateTime
  body: String
  identity: Identity
  attachment: Attachment
}

type Thread implements Post {
  id: ID!
  created_at: DateTime
  body: String
  identity: Identity
  attachment: Attachment
  replies: [Reply]
  reply_count: Int
}

type Query {
  Board(id:ID!): Board
}

enum AttachmentType {
  file
}

type AttachmentMetadata {
  width: Int
  height: Int
  wUnits: String
  hUnits: String
  type: String
  size: Int
}

type NewAttachment {
  id: ID!
  signed_url: String!
}

type Attachment {
  id: ID!
  type: AttachmentType
  mimetype: String
  filename: String
  url: String
  metadata: AttachmentMetadata
}

type BoardMutation {
  Post(parent_id: ID, body: String!, attachment_id: ID): Post
  Chat(body: String!, attachment_id: ID): ChatMessage
  Activity(visible: Boolean!): BoardActivity
}

type Mutation {
  Attachment(mimetype: String!, filename: String!): NewAttachment
  Board(id:ID!): BoardMutation
  Session(email_token: String!): String
  Login(email: String!): Boolean
}

type Subscription {
  NewBoardMessage(board: ID!): ChatMessage
  BoardActivity(board: ID!): BoardActivity
}

`

const schema = makeExecutableSchema({ typeDefs, resolvers })
export default schema
