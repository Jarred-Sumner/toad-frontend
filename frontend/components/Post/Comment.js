import React from "react";
import { COLORS } from "../../lib/colors";
import { SPACING } from "../../lib/spacing";
import { Spacer } from "../Spacer";
import { Body } from "./Body";
import { Author } from "./Author";
import { Text } from "../Text";
import moment from "moment";
import classNames from "classnames";
import {
  MAX_POST_CONTENT_WIDTH,
  PostHeader,
  MAX_POST_PHOTO_MINIMIZED_WIDTH
} from "../Post";
import Photo, { calculateDimensions, PreviewablePhoto } from "../Photo";
import { buildCommentDOMID } from "../../lib/routeHelpers";
import _ from "lodash";
import { MOBILE_BEAKPOINT } from "lib/mobile";
import { MediaQuery } from "../MediaQueries";

export const MAX_PHOTO_WIDTH_MOBILE = 360;
export const MAX_PHOTO_HEIGHT_MOBILE = 360;

export const MAX_PHOTO_WIDTH_MINIMIZED = 125;
export const MAX_PHOTO_HEIGHT_MINIMIZED = 125;
export const MAX_PHOTO_WIDTH = 175;
export const MAX_PHOTO_HEIGHT = 300;

class _Comment extends React.PureComponent {
  maxWidth = () => {
    const { minimized, isMobile } = this.props;

    if (isMobile) {
      return MAX_PHOTO_WIDTH_MOBILE;
    } else if (minimized) {
      return MAX_PHOTO_WIDTH_MINIMIZED;
    } else {
      return MAX_PHOTO_WIDTH;
    }
  };

  maxHeight = () => {
    const { minimized, isMobile } = this.props;

    if (isMobile) {
      return MAX_PHOTO_HEIGHT_MOBILE;
    } else if (minimized) {
      return MAX_PHOTO_HEIGHT_MINIMIZED;
    } else {
      return MAX_PHOTO_HEIGHT;
    }
  };
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
      colorScheme,
      currentIdentityId,
      isOdd
    } = this.props;
    const dimensions = calculateDimensions({
      photo: comment.attachment,
      maxWidth: this.maxWidth(),
      maxHeight: this.maxHeight()
    });

    return (
      <div
        id={buildCommentDOMID(comment.id)}
        className={classNames("CommentContainer", {
          "CommentContainer--even": isOdd
        })}
      >
        <div className={"CommentHeader MobileOnly"}>
          <PostHeader
            onClick={this.handleShowReply}
            post={comment}
            currentIdentityId={currentIdentityId}
            boardId={boardId}
            muted
            minimized={minimized}
            threadId={threadId}
          />
          <Spacer height={SPACING.small} />
        </div>
        {comment.attachment && (
          <React.Fragment>
            <PreviewablePhoto
              width={dimensions.width}
              height={dimensions.height}
              photo={comment.attachment}
              minHeight={125}
            />
            <div className="DesktopOnly">
              <Spacer width={SPACING.small} />
            </div>
            <div className="MobileOnly">
              <Spacer height={SPACING.small} />
            </div>
          </React.Fragment>
        )}
        <div className="Comment">
          <div className={"CommentHeader DesktopOnly"}>
            <PostHeader
              onClick={this.handleShowReply}
              post={comment}
              currentIdentityId={currentIdentityId}
              boardId={boardId}
              muted
              minimized={minimized}
              threadId={threadId}
            />
            <Spacer height={SPACING.small} />
          </div>

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
            padding: ${SPACING.small}px ${SPACING.normal}px;
            border-radius: 2px;
            display: inline-flex;
            align-self: flex-start;
            flex-direction: column;
            width: auto;
            max-width: ${MAX_POST_CONTENT_WIDTH}px;
          }

          @media (max-width: ${MOBILE_BEAKPOINT}px) {
            .CommentHeader,
            .Comment {
              padding: ${SPACING.small}px ${SPACING.normal}px;
              width: 100%;
              max-width: 100%;
            }

            .CommentContainer {
              flex-direction: column;
              background-color: white;
              width: 100%;
            }
          }
        `}</style>
      </div>
    );
  }
}

export const Comment = MediaQuery(_Comment);
