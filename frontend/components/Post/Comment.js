import React from "react";
import { COLORS } from "../../lib/colors";
import { SPACING } from "../../lib/spacing";
import { Spacer } from "../Spacer";
import { Body } from "./Body";
import { Author } from "./Author";
import { Text } from "../Text";
import moment from "moment";
import { MAX_POST_CONTENT_WIDTH, PostHeader } from "../Post";
import Photo, { calculateDimensions, PreviewablePhoto } from "../Photo";
import { buildCommentDOMID } from "../../lib/routeHelpers";
import _ from "lodash";

export const MAX_PHOTO_WIDTH_MINIMIZED = 125;
export const MAX_PHOTO_HEIGHT_MINIMIZED = 125;
export const MAX_PHOTO_WIDTH = 175;
export const MAX_PHOTO_HEIGHT = 300;

export class Comment extends React.PureComponent {
  handleShowReply = evt => {
    evt.preventDefault();
    evt.stopPropagation();
    this.props.createReply(this.props.comment.id);
  };
  render() {
    const {
      comment,
      backgroundColor = COLORS.offwhite,
      url,
      boardId,
      threadId,
      minimized,
      colorScheme
    } = this.props;
    const dimensions = calculateDimensions({
      photo: comment.attachment,
      maxWidth: minimized ? MAX_PHOTO_WIDTH_MINIMIZED : MAX_PHOTO_WIDTH,
      maxHeight: minimized ? MAX_PHOTO_HEIGHT_MINIMIZED : MAX_PHOTO_HEIGHT
    });

    return (
      <div id={buildCommentDOMID(comment.id)} className="CommentContainer">
        {comment.attachment && (
          <React.Fragment>
            <PreviewablePhoto
              width={dimensions.width}
              height={dimensions.height}
              photo={comment.attachment}
              minHeight={125}
            />
            <Spacer width={SPACING.small} />
          </React.Fragment>
        )}
        <div className="Comment">
          <PostHeader
            onClick={this.handleShowReply}
            post={comment}
            boardId={boardId}
            muted
            minimized={minimized}
            threadId={threadId}
          />

          <Spacer height={SPACING.small} />
          <div className="BodyContainer">
            <Body
              colorScheme={colorScheme}
              commentId={comment.id}
              threadId={threadId}
              boardId={boardId}
              minimized={minimized}
            >
              {minimized
                ? _.truncate(comment.body, { length: 500 })
                : comment.body}
            </Body>
          </div>
          <Spacer height={SPACING.small} />
        </div>
        <style jsx>{`
          .CommentContainer {
            display: inline-flex;
            background-color: ${backgroundColor};
            border-radius: 2px;
            overflow: hidden;
          }

          .BodyContainer {
            display: inline-flex;
            align-self: flex-start;
            flex-direction: column;
            align-content: flex-start;
          }

          .Comment {
            background-color: ${backgroundColor};
            padding: ${SPACING.small}px ${SPACING.normal}px;
            border-radius: 2px;
            display: inline-flex;
            align-self: flex-start;
            flex-direction: column;
            width: auto;
            max-width: ${MAX_POST_CONTENT_WIDTH}px;
          }
        `}</style>
      </div>
    );
  }
}
