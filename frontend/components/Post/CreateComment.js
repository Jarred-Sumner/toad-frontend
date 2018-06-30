import classNames from "classnames";
import React from "react";
import { graphql, compose } from "react-apollo";
import Draggable from "react-draggable";
import { Queries } from "Toads/Queries";
import { Router } from "Toads/routes";
import { COLORS } from "../../lib/colors";
import { MOBILE_BEAKPOINT } from "../../lib/mobile";
import { buildPostDOMID } from "../../lib/routeHelpers";
import { SPACING } from "../../lib/spacing";
import Alert from "../Alert";
import { Button } from "../Button";
import { GRADIENT_COLORS } from "../Gradient";
import { Icon, ICONS } from "../Icon";
import { Spacer } from "../Spacer";
import { Text } from "../Text";
import EditPhotoContainer from "../UploadPhoto";
import { Author } from "./Author";
import { withRouter } from "next/router";
import { TextArea } from "../TextArea";
import { normalizeEmoji } from "lib/emoji";

class RawCreateCommentForm extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      text: props.initialText || "",
      focused: true,
      dragging: false,
      file: null,
      isPosting: false
    };
  }

  appendText = text => {
    this.setState({
      text: this.state.text + text
    });

    this.textAreaRef.focus();
  };

  handleFocus = () => this.setState({ focused: true });
  handleBlur = () => this.setState({ focused: false });

  handleSetPhoto = photo => this.setState({ photo });
  handleSetText = evt => this.setState({ text: evt.target.value });

  setEditPhotoRef = editPhotoRef => (this.editPhotoRef = editPhotoRef);

  handleSubmit = async evt => {
    evt.preventDefault();
    const { createComment, boardId, postId } = this.props;
    const { text: body, file, isPosting } = this.state;

    if (!this.editPhotoRef || isPosting) {
      return;
    }

    try {
      let attachmentId;
      this.setState({ isPosting: true });

      if (file) {
        attachmentId = await this.editPhotoRef.uploadFile(this.props.boardId);
      }

      const thread = await createComment({
        variables: {
          boardID: boardId,
          body: normalizeEmoji(body),
          attachment_id: attachmentId,
          threadID: postId
        }
      });

      Alert.success("Replied successfully.");

      if (this.props.router.route !== "thread") {
        Router.pushRoute("thread", {
          board: boardId,
          id: String(postId)
        });
      }

      this.props.onDismiss && this.props.onDismiss();
    } catch (exception) {
      console.error(exception);
      this.setState({ isPosting: false });
      if (exception.message) {
        Alert.error(exception.message);
      }
    }
  };

  handleChangeFile = file => {
    this.setState({ file });
  };

  setTextAreaRef = textAreaRef => (this.textAreaRef = textAreaRef);
  handleDragging = () => this.setState({ dragging: true });
  handleStopDragging = () => this.setState({ dragging: false });

  render() {
    const {
      stickyTo,
      postId,
      boardId,
      colorScheme,
      onDismiss,
      identity,
      draggable,
      title = "Reply to thread"
    } = this.props;
    const { focused, dragging, isPosting } = this.state;
    const color = COLORS[colorScheme];

    return (
      <Draggable
        onStart={this.handleDragging}
        onStop={this.handleStopDragging}
        cancel=".CommentTextArea"
        disabled={!draggable}
      >
        <div
          onClick={this.handleFocus}
          className={classNames("Container", {
            "Container--blur": !focused && !dragging,
            "Container--focused": focused || dragging,
            "Container--static": !draggable
          })}
        >
          <form className="CreateCommentForm" onSubmit={this.handleSubmit}>
            <div className="Menu HeaderMenu">
              <Text size="14px" color={color} weight="bold">
                {title}&nbsp;
                <a href={`#${buildPostDOMID(postId)}`}>
                  <Text weight="inherit" color="inherit" underline>
                    #{postId}
                  </Text>
                </a>
              </Text>

              {onDismiss && (
                <div className="Close">
                  <Icon onClick={onDismiss} icon={ICONS.close} color={color} />
                </div>
              )}
            </div>
            <div className="InputRow">
              <div className="Photo">
                <EditPhotoContainer
                  dropZoneRef={this.props.dropZoneRef}
                  editPhotoRef={this.setEditPhotoRef}
                  photo={this.state.photo}
                  boardId={boardId}
                  onChange={this.handleChangeFile}
                  setPhoto={this.handleSetPhoto}
                />
              </div>

              <Spacer width={SPACING.large} />

              <div className="Content">
                <div className="Author">
                  <Author identity={identity} />
                </div>

                <TextArea
                  className="CommentTextArea"
                  autoFocus={draggable}
                  autoCapitalize
                  autoCorrect
                  colorScheme={colorScheme}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}
                  ref={this.setTextAreaRef}
                  placeholder="Start typing here"
                  value={this.state.text}
                  onChange={this.handleSetText}
                />
              </div>
            </div>

            <div className="Menu ActionsMenu">
              {isPosting && (
                <React.Fragment>
                  <Text>Sending...</Text>
                  <Spacer width={SPACING.normal} />
                </React.Fragment>
              )}
              <button>
                <Button color={GRADIENT_COLORS.blue}>Submit reply</Button>
              </button>
            </div>
          </form>

          <style jsx>{`
            .Container {
              display: block;
              min-width: 525px;
              width: min-content;
              position: fixed;
              top: ${SPACING.large}px;
              right: ${SPACING.large}px;
              border-radius: 4px;
              filter: drop-shadow(1px 2px 1px rgba(0, 0, 0, 0.2));
            }

            .Container--static {
              position: static;
              top: unset;
              right: unset;
              filter: unset;
              border: 1px solid ${COLORS.offwhite};
            }

            .Container--static .HeaderMenu {
              cursor: default;
            }

            .Close {
              cursor: pointer;
            }

            .Photo {
              flex: 0;
              align-self: flex-start;
            }

            .CaretContainer {
              position: absolute;
              top: -14px;
              padding-left: ${SPACING.normal}px;
              z-index: 999;
            }

            form {
              display: flex;
              width: 100%;
              align-self: flex-start;
              flex-direction: column;
            }

            .Author {
              flex: 0;
              margin-bottom: ${SPACING.small}px;
              color: ${color};
            }

            .Content {
              flex-direction: column;
              flex: 1;
              cursor: default;
            }

            .InputRow {
              display: flex;
              padding: ${SPACING.normal}px;
              background: ${COLORS.white};
            }

            .Content,
            .Content > :global(.CommentTextArea) {
              width: auto;
              flex: 1;
              display: flex;
            }

            .Content > :global(.CommentTextArea) {
              background-color: transparent;
              border-radius: 4px;
              outline: 0;
              border: 0;
              font-size: 14px;
              line-height: 19px;
            }

            button {
              -webkit-appearance: none;
              border: 0;
              box-shadow: none;
              background: transparent;
              margin: 0;
              padding: 0;
              display: flex;
              outline: 0;
            }

            .Menu {
              background-color: ${COLORS.light_white};
              display: flex;
              padding: ${SPACING.normal}px;
              width: 100%;
            }

            .HeaderMenu {
              border-top-left-radius: 4px;
              border-top-right-radius: 4px;
              justify-content: space-between;
              cursor: move;
            }

            .ActionsMenu {
              justify-content: flex-end;
              border-bottom-left-radius: 4px;
              border-bottom-right-radius: 4px;
              align-items: center;
            }

            @media (max-width: ${MOBILE_BEAKPOINT}px) {
              .Container {
                min-width: auto;
                width: auto;
                left: 0;
                right: 0;
                margin-left: ${SPACING.small}px;
                margin-right: ${SPACING.small}px;
              }

              .CaretContainer {
                display: none;
              }

              .InputRow {
                flex-direction: column;
              }

              textarea {
                height: 100px;
              }

              .Photo {
                margin-bottom: ${SPACING.normal}px;
              }
            }
          `}</style>
        </div>
      </Draggable>
    );
  }
}

export const CreateCommentForm = compose(
  graphql(Queries.CreateReplyToThread, {
    name: "createComment",
    options: props => ({
      update: (cache, { data }) => {
        const newReply = _.get(data, "Board.Post");
        if (!newReply) {
          return;
        }

        const boardID = props.boardId;
        const threadID = props.postId;

        const variables = {
          boardID,
          threadID
        };
        const cacheData = cache.readQuery({
          query: Queries.ViewThread,
          variables
        });

        cache.writeQuery({
          query: Queries.ViewThread,
          variables,
          data: {
            Board: {
              ...cacheData.Board,
              thread: {
                ...cacheData.Board.thread,
                replies: _.uniqBy(
                  [...cacheData.Board.thread.replies, newReply],
                  "id"
                )
              }
            }
          }
        });
      }
    })
  }),
  withRouter
)(({ innerRef, ...otherProps }) => (
  <RawCreateCommentForm ref={innerRef} {...otherProps} />
));

export default CreateCommentForm;
