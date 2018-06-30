import React from "react";
import moment from "moment-shortformat";
import { Author } from "./Post/Author";
import { Text } from "./Text";
import { SPACING } from "../lib/spacing";
import { Body } from "./Post/Body";
import Photo, { calculateDimensions, PreviewablePhoto } from "./Photo";
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
  buildPostDOMID,
  buildURLForPath,
  buildPostPath,
  buildPostURL
} from "../lib/routeHelpers";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Alert from "./Alert";
import { Router } from "Toads/routes";

export const MIN_POST_PHOTO_MINIMIZED_HEIGHT = 78;
export const MIN_POST_PHOTO_HEIGHT = 78;

export const MAX_POST_PHOTO_MINIMIZED_WIDTH = 255;
export const MAX_POST_PHOTO_MINIMIZED_HEIGHT = 192;
export const MAX_POST_PHOTO_WIDTH = 300;
export const MAX_POST_PHOTO_HEIGHT = 225;
export const MAX_POST_CONTENT_WIDTH = 576;

const copiedToClipboard = () => Alert.info("Copied link to clipboard");

export const PostHeader = ({
  post,
  threadId,
  boardId,
  colorScheme = GRADIENT_COLORS.blue,
  onClick,
  muted,
  minimized
}) => {
  const color = COLORS[colorScheme];

  return (
    <div
      className={classNames("Header", {
        "Header--muted": muted
      })}
    >
      <Author identity={post.identity} />
      <Spacer width={SPACING.small} />

      <Link
        route="thread"
        shallow={!minimized}
        replace={!minimized}
        scroll={minimized}
        params={{
          board: String(boardId),
          id: String(threadId),
          h: String(post.id)
        }}
      >
        <a data-tip={moment(post.created_at).format("lll")}>
          <Text size="inherit" color={COLORS.gray}>
            {moment(post.created_at).short()}
          </Text>
        </a>
      </Link>
      <Spacer width={SPACING.small} />
      <Link
        route="thread"
        shallow={!minimized}
        replace={!minimized}
        scroll={minimized}
        params={{
          board: String(boardId),
          id: String(threadId),
          h: String(post.id)
        }}
      >
        <a>
          <Text size="inherit" color="inherit">
            /{post.id}/
          </Text>
        </a>
      </Link>
      <Spacer width={SPACING.small} />
      <Text color={COLORS.medium_white}>|</Text>
      <Spacer width={SPACING.small} />
      <div className="Group">
        <Icon
          data-tip="Report"
          icon={ICONS.flag}
          size="xs"
          color={COLORS.gray}
        />
        <Spacer width={SPACING.small} />
        <CopyToClipboard
          onCopy={copiedToClipboard}
          text={buildPostURL(boardId, threadId, buildPostDOMID(post.id))}
        >
          <Icon
            data-tip="Copy link"
            icon={ICONS.link}
            size="xs"
            color={COLORS.gray}
          />
        </CopyToClipboard>
      </div>
      <Spacer width={SPACING.small} />
      <Text color={COLORS.medium_white}>|</Text>
      <Spacer width={SPACING.small} />
      <Link
        route="thread"
        shallow={!minimized}
        replace={!minimized}
        scroll={minimized}
        params={{
          board: String(boardId),
          id: String(threadId),
          r: String(post.id)
        }}
      >
        <a>
          <div className="Group" onClick={onClick}>
            <Text size="inherit" weight="semiBold" color="inherit">
              Reply
            </Text>
            <Spacer width={SPACING.small} />
            <Icon icon={ICONS.chevronRight} size="xs" color="inherit" />
          </div>
        </a>
      </Link>

      <style jsx>{`
        .Header {
          display: inline-flex;
          white-space: nowrap;
          flex-shrink: 0;
          align-items: center;
          align-self: flex-start;
          color: ${color};

          font-size: 12px;
        }

        a {
          color: inherit;
        }

        .Header--muted {
          color: ${COLORS.gray};
          filter: grayscale(100%);
        }

        .Header:hover {
          color: ${color};
          filter: grayscale(0%);
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
  constructor(props) {
    super(props);

    this.state = {
      defautReplyText: "",
      showCommentForm: props.showCommentForm || false
    };
  }

  get shouldRedirectToComment() {
    return !!this.props.minimized;
  }

  buildReplyText = id => {
    return `> /${id}/\n`;
  };

  handleShowCommentForm = url => {
    this.setState({
      showCommentForm: true,
      defautReplyText: url
        ? this.state.defautReplyText + url
        : this.state.defautReplyText
    });
  };

  handleDismissCommentForm = () =>
    this.setState({ showCommentForm: false, defautReplyText: "" });

  handleReplyToPost = evt => {
    evt.preventDefault();
    evt.stopPropagation();

    if (this.shouldRedirectToComment) {
      return Router.pushRoute("thread", {
        board: this.props.board.id,
        id: this.props.post.id,
        h: this.props.post.id
      });
    }

    if (!this.state.showCommentForm) {
      this.handleShowCommentForm();
    } else {
      const text = this.buildReplyText(this.props.post.id);
      this.commentFormRef && this.commentFormRef.appendText(text);
    }
  };

  handleReplyToComment = commentId => {
    if (this.shouldRedirectToComment) {
      return Router.pushRoute("thread", {
        board: this.props.board.id,
        id: this.props.post.id,
        h: commentId
      });
    }

    const text = this.buildReplyText(commentId);

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
      colorScheme,
      identity,
      minimized
    } = this.props;
    const { showCommentForm } = this.state;

    const color = COLORS[GRADIENT_COLORS[colorScheme]];
    const dimensions = calculateDimensions({
      photo: post.attachment,
      maxWidth: minimized
        ? MAX_POST_PHOTO_MINIMIZED_WIDTH
        : MAX_POST_PHOTO_WIDTH,
      maxHeight: minimized
        ? MAX_POST_PHOTO_MINIMIZED_HEIGHT
        : MAX_POST_PHOTO_HEIGHT
    });

    const url = buildPostPathSelectedPost({ boardId: board.id, id: post.id });
    const postDomID = buildPostDOMID(post.id);
    return (
      <div id={postDomID} className="PostContainer">
        {showCommentForm && (
          <CreateCommentForm
            stickyTo={postDomID}
            postId={post.id}
            boardId={board.id}
            draggable
            colorScheme={colorScheme}
            identity={identity}
            innerRef={this.setCommentFormRef}
            onDismiss={this.handleDismissCommentForm}
            initialText={this.state.defautReplyText}
          />
        )}

        <div className="Post">
          {post.attachment && (
            <div className="PhotoWrapper">
              <div className="PhotoContainer">
                <PreviewablePhoto
                  width={dimensions.width}
                  height={dimensions.height}
                  minHeight={
                    minimized
                      ? MIN_POST_PHOTO_MINIMIZED_HEIGHT
                      : MIN_POST_PHOTO_HEIGHT
                  }
                  photo={post.attachment}
                />
              </div>
            </div>
          )}

          <div className="ContentContainer">
            <PostHeader
              onClick={this.handleReplyToPost}
              boardId={board.id}
              colorScheme={colorScheme}
              post={post}
              minimized={minimized}
              threadId={post.id}
            />
            <Spacer height={SPACING.small} />
            <div className="BodyContainer">
              <Body
                colorScheme={colorScheme}
                commentId={null}
                threadId={post.id}
                boardId={board.id}
              >
                {post.body}
              </Body>
            </div>

            {post.reply_count > 0 &&
              minimized && (
                <React.Fragment>
                  <Spacer height={SPACING.small} />

                  <div className="Actions">
                    <Link
                      route="thread"
                      params={{ board: board.id, id: post.id }}
                    >
                      <a>
                        <Text weight="semiBold" color={color}>
                          {post.reply_count} replies
                        </Text>
                      </a>
                    </Link>
                  </div>
                </React.Fragment>
              )}

            <Spacer height={SPACING.normal} />

            {comments.map((comment, index) => (
              <React.Fragment key={comment.id}>
                <Comment
                  createReply={this.handleReplyToComment}
                  comment={comment}
                  boardId={board.id}
                  threadId={post.id}
                  minimized={minimized}
                  colorScheme={colorScheme}
                />
                {comments.length - 1 > index && (
                  <Spacer height={SPACING.small} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <style jsx>{`
          .PhotoContainer {
            float: left;
            margin-right: ${SPACING.large}px;
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

          .BodyContainer {
            flex-direction: column;
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
