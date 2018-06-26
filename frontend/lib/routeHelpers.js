import { isProduction, BASE_DOMAIN } from "config";

const SCHEME = isProduction() ? "https" : "http";

export const buildBoardPath = ({ boardId }) => `/${boardId}`;
export const buildPostPath = ({ boardId, id }) => `/${boardId}/${id}`;
export const buildPostDOMID = id => `p${id}`;
export const buildCommentDOMID = id => `p${id}`;

export const buildPostPathSelectedPost = ({ boardId, id }) =>
  buildPostPath({ boardId, id }) + `#` + buildPostDOMID(id);
export const buildCommentPath = ({ boardId, postId, commentId }) =>
  `${buildPostPath({ boardId, id: postId })}#${buildCommentDOMID(commentId)}`;

export const buildURLForPath = path => `${SCHEME}://${BASE_DOMAIN}${path}`;

export const buildBoardURL = boardId =>
  buildURLForPath(buildBoardPath({ boardId }));
export const buildPostURL = (boardId, id, domID) => {
  return `${buildURLForPath(buildBoardPath({ boardId, id }))}#${domID}`;
};
