const SCHEME = process.env.NODE_ENV === "production" ? "https" : "http";

export const buildBoardPath = ({ boardId }) => `/${boardId}`;
export const buildPostPath = ({ boardId, id }) => `/${boardId}/${id}`;
export const buildPostDOMID = id => `t${id}`;
export const buildCommentDOMID = id => `c${id}`;

export const buildPostPathSelectedPost = ({ boardId, id }) =>
  buildPostPath({ boardId, id }) + `#` + buildPostDOMID(id);
export const buildCommentPath = ({ boardId, postId, commentId }) =>
  `${buildPostPath({ boardId, id: postId })}#${buildCommentDOMID(commentId)}`;

export const buildURLForPath = path =>
  `${SCHEME}://${process.env.BASE_DOMAIN}${path}`;

export const buildBoardURL = boardId =>
  buildURLForPath(buildBoardPath({ boardId }));
export const buildPostURL = (boardId, id) =>
  buildURLForPath(buildBoardPath({ boardId, id }));
