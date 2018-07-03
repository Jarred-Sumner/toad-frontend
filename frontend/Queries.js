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
    participants {
      ...IdentityFragmnet
    }
    participant_count

    board {
      id
      color_scheme
    }

    user_identity {
      ...IdentityFragment
    }

    typing {
      ...IdentityFragment
    }
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
  ViewBoardConversation: gql`
    query ViewBoardConversation($boardID: ID!) {
      Board(id: $boardID) {
        id

        board_conversation {
          ...ConversationFragment
        }
      }
    }

    ${fragments.conversation}
  `,
  ActiveConversations: gql`
    query ActiveConversations {
      ActiveConversations {
        ...ConversationFragment
      }
    }

    ${fragments.conversation}
  `,
  SubscribeToConversationParticipationStatusUpdates: gql`
    subscription ConversationUpdates {
      VisibleConversations {
        ...ConversationFragment
      }
    }

    ${fragments.conversation}
  `,
  SubscribeToMessageUpdates: gql`
    subscription SubscribeToMessageUpdates($conversationID: ID!) {
      ConversationMessages(conversation_id: $conversationID) {
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
  LeaveConversation: gql`
    mutation LeaveConversation($conversationID: ID!) {
      ConversationPresence(conversation_id: $conversationID, presence: false) {
        ...ConversationFragment
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
  `,
  UpdateTypingStatus: gql`
    mutation UpdateTypingStatus($conversationID: ID!, $isTyping: Boolean!) {
      ConversationTyping(conversation_id: $conversationID, is_typing: $isTyping)
    }
  `
};

export default Queries;
