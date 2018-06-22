import gql from "graphql-tag";

const fragments = {};
fragments.identity = `
    id
    name
  `;
fragments.attachment = `
  id
  type
  mimetype
  filename
  url
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

export const Queries = {
  ViewBoard: gql`
    query ViewBoard($id: ID!) {
      Board(id: $id) {
        id
        label
        color_scheme
      }
    }
  `,
  ViewThread: gql`
    query ViewThread($boardID: ID!, $threadID: ID!) {
      Board(id: $id) {
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
  `
};

export default Queries;
