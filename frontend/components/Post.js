import React from "react";
import moment from "moment";
import { Author } from "./Post/Author";
import { Text } from "./Text";
import { SPACING } from "../lib/spacing";
import { Body } from "./Post/Body";
import Photo, { calculateDimensions } from "./Photo";
import { Spacer } from "./Spacer";
import { MEDIUM_BEAKPOINT } from "../lib/mobile";
import { Comment } from "./Post/Comment";
import { COLORS } from "../lib/colors";
import { GRADIENT_COLORS } from "./Gradient";
import Icon, { ICONS } from "./Icon";
import { Link } from "../routes";
import { CreateCommentForm } from "./Post/CreateComment";
import classNames from "classnames";
import {
  buildPostPathSelectedPost,
  buildCommentDOMID,
  buildCommentPath,
  buildPostDOMID
} from "../lib/routeHelpers";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Alert from "./Alert";

export const MAX_POST_PHOTO_WIDTH = 375;
export const MAX_POST_PHOTO_HEIGHT = 375;
export const MAX_POST_CONTENT_WIDTH = 576;

const copiedToClipboard = () => Alert.info("Copied link to clipboard");

export const PostHeader = ({
  post,
  colorScheme = GRADIENT_COLORS.blue,
  onClick,
  muted,
  url
}) => {
  const color = COLORS[colorScheme];

  return (
    <div
      className={classNames("Header", {
        "Header--muted": muted
      })}
    >
      <Author author={post.author} />
      <Spacer width={SPACING.small} />

      <Link href={url}>
        <a>
          <Text>{moment(post.timestamp).fromNow()}</Text>
        </a>
      </Link>
      <Spacer width={SPACING.small} />
      <Link href={url}>
        <a>
          <Text underline>#{post.id}</Text>
        </a>
      </Link>
      <Spacer width={SPACING.small} />
      <Text color={COLORS.medium_white}>|</Text>
      <Spacer width={SPACING.small} />
      <div className="Group">
        <Icon icon={ICONS.flag} size="xs" color={COLORS.gray} />
        <Spacer width={SPACING.small} />
        <CopyToClipboard onCopy={copiedToClipboard} text={url}>
          <Icon icon={ICONS.link} size="xs" color={COLORS.gray} />
        </CopyToClipboard>
      </div>
      <Spacer width={SPACING.small} />
      <Text color={COLORS.medium_white}>|</Text>
      <Spacer width={SPACING.small} />
      <div onClick={onClick} className="Group">
        <Text weight="semiBold" color="inherit">
          Reply
        </Text>
        <Spacer width={SPACING.small} />
        <Icon icon={ICONS.chevronRight} size="xs" color="inherit" />
      </div>

      <style jsx>{`
        .Header {
          display: inline-flex;
          white-space: nowrap;
          flex-shrink: 0;
          align-items: center;
          align-self: flex-start;
          color: ${color};
        }

        a {
          color: inherit;
        }

        .Header--muted {
          color: ${COLORS.gray};
        }

        .Header:hover {
          color: ${color};
        }

        .Group {
          display: flex;
          cursor: pointer;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export class Post extends React.PureComponent {
  state = {
    defautReplyText: "",
    showCommentForm: false
  };

  buildReplyText = url => {
    return `>> ${url}\n`;
  };

  handleShowCommentForm = url => {
    this.setState({
      showCommentForm: true,
      defautReplyText: this.state.defautReplyText + url
    });
  };

  handleDismissCommentForm = () =>
    this.setState({ showCommentForm: false, defautReplyText: "" });

  handleReplyToPost = () => {
    const text = this.buildReplyText(
      buildPostPathSelectedPost({
        boardId: this.props.board.id,
        id: this.props.post.id
      })
    );

    if (this.state.showCommentForm) {
      this.commentFormRef && this.commentFormRef.appendText(text);
    } else {
      this.handleShowCommentForm(text);
    }
  };

  handleReplyToComment = commentId => {
    const text = this.buildReplyText(
      buildCommentPath({
        boardId: this.props.board.id,
        postId: this.props.post.id,
        commentId
      })
    );

    if (this.state.showCommentForm) {
      this.commentFormRef && this.commentFormRef.appendText(text);
    } else {
      this.handleShowCommentForm(text);
    }
  };

  setCommentFormRef = commentFormRef => (this.commentFormRef = commentFormRef);

  render() {
    const {
      post,
      comments,
      board,
      colorScheme = GRADIENT_COLORS.blue
    } = this.props;
    const color = COLORS[colorScheme];
    const commentsCount = 10;
    const dimensions = post.photo
      ? calculateDimensions({
          photo: post.photo,
          maxWidth: MAX_POST_PHOTO_WIDTH,
          maxHeight: MAX_POST_PHOTO_HEIGHT
        })
      : null;

    const url = buildPostPathSelectedPost({ boardId: board.id, id: post.id });
    const postDomID = buildPostDOMID(post.id);
    return (
      <div id={postDomID} className="PostContainer">
        {this.state.showCommentForm && (
          <CreateCommentForm
            stickyTo={postDomID}
            postId={post.id}
            colorScheme={colorScheme}
            ref={this.setCommentFormRef}
            onDismiss={this.handleDismissCommentForm}
            initialText={this.state.defautReplyText}
          />
        )}

        <div className="Post">
          {post.photo && (
            <React.Fragment>
              <div className="PhotoWrapper">
                <div className="PhotoContainer">
                  <Photo
                    width={dimensions.width}
                    maxWidth="100%"
                    height={dimensions.height}
                    photo={post.photo}
                  />
                </div>
              </div>
            </React.Fragment>
          )}

          <div className="ContentContainer">
            <PostHeader
              onClick={this.handleReplyToPost}
              board={board}
              url={url}
              post={post}
            />
            <Spacer height={SPACING.small} />
            <div className="BodyContainer">
              <Body>{post.body}</Body>
            </div>

            <Spacer height={SPACING.small} />

            <div className="Actions">
              <Link route="thread" params={{ board: board.id, id: post.id }}>
                <a>
                  <Text weight="semiBold" color={color}>
                    {commentsCount} comments
                  </Text>
                </a>
              </Link>
            </div>

            <Spacer height={SPACING.normal} />

            {comments.map(comment => (
              <React.Fragment key={comment.id}>
                <Comment
                  createReply={this.handleReplyToComment}
                  comment={comment}
                  url={buildCommentPath({
                    boardId: board.id,
                    postId: post.id,
                    commentId: comment.id
                  })}
                />
                <Spacer height={SPACING.small} />
              </React.Fragment>
            ))}
          </div>
        </div>

        <style jsx>{`
          .PhotoContainer {
            float: left;
            margin-right: ${SPACING.large}px;
            margin-bottom: ${SPACING.large}px;
          }

          .Post {
            display: inline;
          }

          .PostContainer {
            position: relative;
          }

          .ContentContainer {
            display: block;
            width: 100%;
            word-wrap: break-word;
            max-width: 1024px;
          }

          @media (max-width: ${MEDIUM_BEAKPOINT}px) {
            .Post {
              max-width: 100%;
            }
          }
        `}</style>
      </div>
    );
  }
}

export default Post;
