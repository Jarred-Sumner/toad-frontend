import React from "react";
import { COLORS } from "../../lib/colors";
import { SPACING } from "../../lib/spacing";
import { Spacer } from "../Spacer";
import { Body } from "./Body";
import { Author } from "./Author";
import { Text } from "../Text";
import moment from "moment";
import { MAX_POST_CONTENT_WIDTH, PostHeader } from "../Post";
import Photo, { calculateDimensions } from "../Photo";
import { buildCommentDOMID } from "../../lib/routeHelpers";

export const MAX_PHOTO_WIDTH = 175;
export const MAX_PHOTO_HEIGHT = 300;

export class Comment extends React.PureComponent {
  handleShowReply = () => this.props.createReply(this.props.comment.id);
  render() {
    const { comment, backgroundColor = COLORS.offwhite, url } = this.props;
    const dimensions = comment.attachment
      ? calculateDimensions({
          photo: comment.attachment,
          maxWidth: MAX_PHOTO_WIDTH,
          maxHeight: MAX_PHOTO_HEIGHT
        })
      : null;

    return (
      <div id={buildCommentDOMID(comment.id)} className="CommentContainer">
        {comment.attachment && (
          <React.Fragment>
            <Photo
              width={dimensions.width}
              height={dimensions.height}
              maxWidth={MAX_PHOTO_WIDTH + "px"}
              maxHeight={MAX_PHOTO_HEIGHT + "px"}
              photo={comment.attachment}
            />
            <Spacer width={SPACING.small} />
          </React.Fragment>
        )}
        <div className="Comment">
          <PostHeader
            onClick={this.handleShowReply}
            post={comment}
            muted
            url={url}
          />

          <Spacer height={SPACING.normal} />
          <div className="BodyContainer">
            <Body>{comment.body}</Body>
          </div>
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
            align-content: flex-start;
          }

          .Comment {
            background-color: ${backgroundColor};
            padding: ${SPACING.normal}px;
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
