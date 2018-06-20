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
        display: inline-flex;
        white-space: nowrap;
        flex-shrink: 0;
        align-self: flex-start;
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
            <Spacer width={SPACING.normal} />
            <PostHeader post={post} />
            <Spacer height={SPACING.small} />
            <div className="BodyContainer">
              <Body>{post.body}</Body>
            </div>

            <Spacer height={SPACING.normal} />

            {comments.map(comment => (
              <React.Fragment key={comment.id}>
                <Comment comment={comment} />
                <Spacer height={SPACING.normal} />
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

          .Post,
          .PostContainer {
            display: inline;
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
