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

export const MAX_POST_PHOTO_WIDTH = 375;
export const MAX_POST_PHOTO_HEIGHT = 375;
export const MAX_POST_CONTENT_WIDTH = 576;

const PostHeader = ({ post }) => (
  <div className="Header">
    <Author author={post.author} />
    <Spacer width={SPACING.small} />

    <Text>{moment(post.timestamp).fromNow()}</Text>
    <Spacer width={SPACING.small} />
    <Text>#{post.id}</Text>

    <style jsx>{`
      .Header {
        display: flex;
        align-items: center;
      }
    `}</style>
  </div>
);

export class Post extends React.PureComponent {
  render() {
    const { post, comments } = this.props;
    const dimensions = calculateDimensions({
      photo: post.photo,
      maxWidth: MAX_POST_PHOTO_WIDTH,
      maxHeight: MAX_POST_PHOTO_HEIGHT
    });

    return (
      <div className="PostContainer">
        <div className="Post">
          {post.photo && (
            <React.Fragment>
              <Photo
                width={dimensions.width}
                maxWidth="100%"
                height={dimensions.height}
                photo={post.photo}
              />
              <Spacer width={SPACING.large} />
            </React.Fragment>
          )}

          <div className="ContentContainer">
            <PostHeader post={post} />
            <Spacer height={SPACING.normal} />
            <div className="BodyContainer">
              <Body>{post.body}</Body>
            </div>
          </div>
          <Spacer height={SPACING.normal} />
        </div>

        <Spacer height={SPACING.normal} />

        {comments.map(comment => (
          <React.Fragment key={comment.id}>
            <Comment comment={comment} />
            <Spacer height={SPACING.normal} />
          </React.Fragment>
        ))}

        <style jsx>{`
          .Post {
            display: flex;
            max-width: ${MAX_POST_PHOTO_WIDTH +
              MAX_POST_CONTENT_WIDTH +
              SPACING.large}px;
            flex-wrap: wrap;
          }

          .ContentContainer {
            max-width: ${MAX_POST_CONTENT_WIDTH}px;
            width: 100%;
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
