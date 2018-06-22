import React from "react";
import { COLORS } from "../../lib/colors";
import { SPACING } from "../../lib/spacing";
import { Spacer } from "../Spacer";
import { Body } from "./Body";
import { Author } from "./Author";
import { Text } from "../Text";
import moment from "moment";
import { MAX_POST_CONTENT_WIDTH } from "../Post";
import Photo, { calculateDimensions } from "../Photo";

export const MAX_PHOTO_WIDTH = 175;
export const MAX_PHOTO_HEIGHT = 300;

export class Comment extends React.PureComponent {
  render() {
    const { comment, backgroundColor = COLORS.offwhite } = this.props;
    const dimensions = comment.photo
      ? calculateDimensions({
          photo: comment.photo,
          maxWidth: MAX_PHOTO_WIDTH,
          maxHeight: MAX_PHOTO_HEIGHT
        })
      : null;

    return (
      <div className="CommentContainer">
        {comment.photo && (
          <React.Fragment>
            <Photo
              width={dimensions.width}
              height={dimensions.height}
              maxWidth="100%"
              photo={comment.photo}
            />
            <Spacer width={SPACING.small} />
          </React.Fragment>
        )}
        <div className="Comment">
          <div className="Header">
            <Author author={comment.author} />
            <Spacer width={SPACING.small} />

            <Text>{moment(comment.timestamp).fromNow()}</Text>
            <Spacer width={SPACING.small} />
            <Text>#{comment.id}</Text>
          </div>

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
          .Header {
            display: inline-flex;
            align-self: flex-start;
            align-items: center;
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
