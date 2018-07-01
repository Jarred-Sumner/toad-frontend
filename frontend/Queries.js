import gql from "graphql-tag";

const fragments = {};
fragments.identity = `
    id
    name
  `;
fragments.activity = `
  active_count
  active_identities {
    ${fragments.identity}
  }
`;
fragments.attachment = `
  id
  type
  mimetype
  filename
  url

  metadata {
    width
    height
  }
`;
fragments.post = `
    created_at
    body

    identity {
      ${fragments.identity}
    }

    attachment {
      ${fragments.attachment}
    }
  `;
fragments.chatMessage = `
id
created_at
body
identity { ${fragments.identity} }
attachment { ${fragments.attachment}}
`;

fragments.conversation = `
    id
    particiatpion_status
    participants
    participants_count
    typing { id }
    expiry_date
`;

export const Queries = {
  ViewBoard: gql`
    query ViewBoard($id: ID!) {
      Board(id: $id) {
        id
        label
        color_scheme

        activity {
          ${fragments.activity}
        }

        identity {
          ${fragments.identity}
        }
      }
    }
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
          ${fragments.post}
        }
      }
    }
  `,
  CreateReplyToThread: gql`
  mutation CreateReplyToThread($body: String!, $attachment_id: ID, $boardID: ID!, $threadID: ID!) {
    Board(id: $boardID) {

      Post(body: $body, parent_id: $threadID, attachment_id: $attachment_id) {
        id
        ${fragments.post}
      }
    }
  }
  `,
  ViewThread: gql`
    query ViewThread($boardID: ID!, $threadID: ID!) {
      Board(id: $boardID) {
        id

        thread(id: $threadID) {
          id
          ${fragments.post}

          replies {
            id
            ${fragments.post}
          }
          reply_count
        }
      }
    }
  `,
  ViewThreads: gql`
    query ViewThreads($id: ID!, $page: Int) {
      Board(id: $id) {
        id

        threads(page: $page) {
          id
          ${fragments.post}

          replies {
            id
            ${fragments.post}
          }
          reply_count
        }
      }
    }
  `,
  BoardActivitySubscription: gql`
    subscription GetBoardActivity($boardID: ID!) {
      BoardActivity(board: $boardID) {
        ${fragments.activity}
      }
    }
  `,
  UpdatePresence: gql`
    mutation UpdatePresence($visible: Boolean!, $boardID: ID!) {
      Board(id: $boardID) {
        Activity(visible: $visible) {
          ${fragments.activity}
        }
      }
    }
  `,
  SubscribeToBoardChat: gql`
    subscription NewBoardMessage($boardID: ID!) {
      NewBoardMessage(board: $boardID) {
        ${fragments.chatMessage}
      }
    }
  `,
  BoardChatHistory: gql`
    query BoardChatHistory($boardID: ID!, $offset: Int, $limit: Int) {
      Board(id: $boardID) {
        id
        chat(offset: $offset, limit: $limit) {
          messages {
            ${fragments.chatMessage}
          }
        }
      }
    }
  `,
  StartDirectConversation: gql`
    mutation StartDirectConversation($identityID: ID!, $boardID: ID!) {
      Board(id: $boardID) {
        StartDirectConversation(target: $identityID) {
          ${fragments.conversation}
        }
      }
    }
  `,
  SendMessage: gql`
    mutation SendMessage($conversationID: ID!, $body: String!, $attachmentID: ID) {
        Message(conversation_id: $conversationID, body: $body, attachment_id: $attachmentID) {
          ${fragments.chatMessage}
        }
      }
  `,

};

export default Queries;
