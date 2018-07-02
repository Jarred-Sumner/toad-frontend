import gql from "graphql-tag";

const fragments = {};
fragments.identity = gql`
  fragment IdentityFragment on IdentityBase {
    id
    name
  }
`;
fragments.activity = gql`
  fragment ActivityFragment on BoardActivity {
    active_count
    active_identities {
      ...IdentityFragment
    }
  }

  ${fragments.identity}
`;
fragments.attachment = gql`
  fragment AttachmentFragment on Attachment {
    id
    type
    mimetype
    filename
    url

    metadata {
      width
      height
    }
  }
`;
fragments.post = gql`
  fragment PostFragment on Post {
    created_at
    body

    identity {
      ...IdentityFragment
    }

    attachment {
      ...AttachmentFragment
    }
  }

  ${fragments.identity}
  ${fragments.attachment}
`;
fragments.chatMessage = gql`
  fragment MessageFragment on Message {
    id
    created_at
    body
    identity {
      ...IdentityFragment
    }
    attachment {
      ...AttachmentFragment
    }
  }

  ${fragments.identity}
  ${fragments.attachment}
`;

fragments.conversation = gql`
  fragment ConversationFragment on Conversation {
    id
    participation_status
    participants
    participants_count
    typing {
      ...IdentityFragment
    }
    expiry_date
  }

  ${fragments.identity}
`;

export const Queries = {
  ViewBoard: gql`
    query ViewBoard($id: ID!) {
      Board(id: $id) {
        id
        label
        color_scheme
        activity {
          ...ActivityFragment
        }
        identity {
          ...IdentityFragment
        }
      }
    }

    ${fragments.identity}
    ${fragments.activity}
  `,
  CreateAttachment: gql`
    mutation CreateAttachment($mimetype: String!, $filename: String!) {
      Attachment(mimetype: $mimetype, filename: $filename) {
        id
        signed_url
      }
    }
  `,
  CreateThread: gql`
    mutation CreateThread($body: String!, $attachment_id: ID, $boardID: ID!) {
      Board(id: $boardID) {
        Post(body: $body, attachment_id: $attachment_id) {
          id
          ...PostFragment
        }
      }
    }

    ${fragments.post}
  `,
  CreateReplyToThread: gql`
  mutation CreateReplyToThread($body: String!, $attachment_id: ID, $boardID: ID!, $threadID: ID!) {
    Board(id: $boardID) {
      Post(body: $body, parent_id: $threadID, attachment_id: $attachment_id) {
        id
        ...PostFragment
      }
    }

    ${fragments.post}
  }
  `,
  ViewThread: gql`
    query ViewThread($boardID: ID!, $threadID: ID!) {
      Board(id: $boardID) {
        id
        thread(id: $threadID) {
          id
          ...PostFragment
          replies {
            id
            ...PostFragment
          }
          reply_count
        }
      }
    }

    ${fragments.post}
  `,
  ViewThreads: gql`
    query ViewThreads($id: ID!, $page: Int) {
      Board(id: $id) {
        id
        threads(page: $page) {
          id
          ...PostFragment
          replies {
            id
            ...PostFragment
          }
          reply_count
        }
      }
    }

    ${fragments.post}
  `,
  BoardActivitySubscription: gql`
    subscription GetBoardActivity($boardID: ID!) {
      BoardActivity(board: $boardID) {
        ...ActivityFragment
      }
    }

    ${fragments.activity}
  `,
  UpdatePresence: gql`
    mutation UpdatePresence($visible: Boolean!, $boardID: ID!) {
      Board(id: $boardID) {
        Activity(visible: $visible) {
          ...ActivityFragment
        }
      }
    }

    ${fragments.activity}
  `,
  SubscribeToBoardChat: gql`
    subscription NewBoardMessage($boardID: ID!) {
      NewBoardMessage(board: $boardID) {
        ...MessageFragment
      }
    }

    ${fragments.chatMessage}
  `,
  ChatHistory: gql`
    query ChatHistory($conversationID: ID!, $offset: Int, $limit: Int) {
      Conversation(id: $conversationID) {
        id

        messages(offset: $offset, limit: $limit) {
          ...MessageFragment
        }
      }
    }

    ${fragments.chatMessage}
  `,
  CreateDirectConversation: gql`
    mutation CreateDirectConversation($identityID: ID!, $boardID: ID!) {
      Board(id: $boardID) {
        StartDirectConversation(target: $identityID) {
          ...ConversationFragment
        }
      }
    }

    ${fragments.conversation}
  `,
  SendMessage: gql`
    mutation SendMessage(
      $conversationID: ID!
      $body: String!
      $attachmentID: ID
    ) {
      Message(
        conversation_id: $conversationID
        body: $body
        attachment_id: $attachmentID
      ) {
        ...MessageFragment
      }
    }

    ${fragments.chatMessage}
  `
};

export default Queries;
