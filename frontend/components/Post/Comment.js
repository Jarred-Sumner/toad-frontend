import React from "react";
import { COLORS } from "../../lib/colors";
import { SPACING } from "../../lib/spacing";
import { Spacer } from "../Spacer";
import { Body } from "./Body";
import { Author } from "./Author";
import { Text } from "../Text";
import moment from "moment";
import { MAX_POST_CONTENT_WIDTH } from "../Post";

export class Comment extends React.PureComponent {
  render() {
    const { comment, backgroundColor = COLORS.offwhite } = this.props;
    return (
      <div className="CommentContainer">
        <React.Fragment />
        <div className="Comment">
          <div className="Header">
            <div className="Header">
              <Author author={comment.author} />
              <Spacer width={SPACING.small} />

              <Text>{moment(comment.timestamp).fromNow()}</Text>
              <Spacer width={SPACING.small} />
              <Text>#{comment.id}</Text>
            </div>
          </div>

          <Spacer height={SPACING.normal} />
          <div className="BodyContainer">
            <Body>{comment.body}</Body>
          </div>

          <style jsx>{`
            .Header {
              display: flex;
              align-items: center;
            }
            .Comment {
              background-color: ${backgroundColor};
              padding: ${SPACING.normal}px;
              border-radius: 2px;
              display: inline-block;
              width: auto;
              max-width: ${MAX_POST_CONTENT_WIDTH}px;
            }
          `}</style>
        </div>
      </div>
    );
  }
}
