import React from "react";
import EditPhotoContainer from "../UploadPhoto";
import { Author } from "./Author";
import { Button } from "../Button";
import { COLORS } from "../../lib/colors";
import { Spacer } from "../Spacer";
import { SPACING } from "../../lib/spacing";
import { GRADIENT_COLORS } from "../Gradient";
import { Text } from "../Text";
import Caret from "../Icons/Caret";
import classNames from "classnames";
import onClickOutside from "react-onclickoutside";
import { MOBILE_BEAKPOINT } from "../../lib/mobile";
import Sticky from "react-stickynode";
import Draggable from "react-draggable";
import { buildPostDOMID } from "../../lib/routeHelpers";
import { Icon, ICONS } from "../Icon";
import { Queries } from "Toads/Queries";
import { graphql } from "react-apollo";
import Alert from "../Alert";
import { Router } from "Toads/routes";

class _CreateCommentForm extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      text: props.initialText || "",
      focused: true,
      dragging: false,
      file: null
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
    const { text: body, file } = this.state;

    if (!this.editPhotoRef) {
      return;
    }

    try {
      let attachmentId;

      if (file) {
        attachmentId = await this.editPhotoRef.uploadFile(this.props.boardId);
      }

      const thread = await createComment({
        variables: {
          boardID: boardId,
          body,
          attachment_id: attachmentId,
          threadID: postId
        }
      });

      Router.pushRoute("thread", {
        board: boardId,
        id: postId
      });
    } catch (exception) {
      console.error(exception);
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
    const { stickyTo, postId, colorScheme, onDismiss, identity } = this.props;
    const { focused, dragging } = this.state;
    const color = COLORS[colorScheme];

    return (
      <Draggable
        onStart={this.handleDragging}
        onStop={this.handleStopDragging}
        cancel=".CommentTextArea"
      >
        <div
          onClick={this.handleFocus}
          className={classNames("Container", {
            "Container--blur": !focused && !dragging,
            "Container--focused": focused || dragging
          })}
        >
          <form className="CreateCommentForm" onSubmit={this.handleSubmit}>
            <div className="Menu HeaderMenu">
              <Text size="14px" color={color} weight="bold">
                Comment on thread{" "}
                <a href={`#${buildPostDOMID(postId)}`}>
                  <Text weight="inherit" color="inherit" underline>
                    #{postId}
                  </Text>
                </a>
              </Text>

              <div className="Close">
                <Icon onClick={onDismiss} icon={ICONS.close} color={color} />
              </div>
            </div>
            <div className="InputRow">
              <div className="Photo">
                <EditPhotoContainer
                  dropZoneRef={this.props.dropZoneRef}
                  editPhotoRef={this.setEditPhotoRef}
                  photo={this.state.photo}
                  onChange={this.handleChangeFile}
                  setPhoto={this.handleSetPhoto}
                />
              </div>

              <Spacer width={SPACING.large} />

              <div className="Content">
                <div className="Author">
                  <Author identity={identity} />
                </div>

                <textarea
                  className="CommentTextArea"
                  autoFocus
                  autoCapitalize
                  autoCorrect
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
              <button>
                <Button color={GRADIENT_COLORS.blue}>Create comment</Button>
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
            }

            .Content {
              flex-direction: column;
              flex: 1;
            }

            .InputRow {
              display: flex;
              padding: ${SPACING.normal}px;
              background: ${COLORS.white};
            }

            .Content,
            textarea {
              width: auto;
              flex: 1;
              display: flex;
            }

            textarea {
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
            }

            .ActionsMenu {
              justify-content: flex-end;
              border-bottom-left-radius: 4px;
              border-bottom-right-radius: 4px;
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

export const CreateCommentForm = graphql(Queries.CreateReplyToThread, {
  name: "createComment"
})(_CreateCommentForm);

export default CreateCommentForm;
