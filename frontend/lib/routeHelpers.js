export const buildPostPath = ({ boardId, id }) => `/${boardId}/${id}`;
export const buildPostDOMID = id => `t${id}`;
export const buildCommentDOMID = id => `c${id}`;

export const buildPostPathSelectedPost = ({ boardId, id }) =>
  buildPostPath({ boardId, id }) + `#` + buildPostDOMID(id);
export const buildCommentPath = ({ boardId, postId, commentId }) =>
  `${buildPostPath({ boardId, id: postId })}#${buildCommentDOMID(commentId)}`;
