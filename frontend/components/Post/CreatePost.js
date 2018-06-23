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
import Alert from "../Alert";
import { graphql } from "react-apollo";
import { Queries } from "Queries";

class _CreatePostForm extends React.PureComponent {
  state = {
    photo: null,
    text: "",
    hasDismissedPicker: false,
    file: null
  };

  setEditPhotoRef = editPhotoRef => (this.editPhotoRef = editPhotoRef);

  handleSubmit = async evt => {
    evt.preventDefault();
    const { createPost, boardId } = this.props;
    const { body } = this.state;

    if (!this.editPhotoRef) {
      return;
    }

    try {
      const attachmentId = await this.editPhotoRef.uploadFile(
        this.props.boardId
      );

      const thread = createPost({
        variables: {
          board
        }
      });
    } catch (exception) {
      if (exception.message) {
        Alert.error(exception.message);
      }
    }
  };

  handleSetPhoto = photo => this.setState({ photo });
  handleSetText = evt => this.setState({ text: evt.target.value });

  handleClickOutside = () => {
    this.props.onDismiss();
  };

  handleChangeFile = file => {
    this.setState({ file, hasDismissedPicker: true });
  };

  handleDialogCancel = () => {
    this.setState({ hasDismissedPicker: true });
  };

  render() {
    return (
      <div
        className={classNames("Container", {
          "Container--hidden": !this.state.hasDismissedPicker
        })}
      >
        <div className="CaretContainer">
          <Caret />
        </div>
        <form className="CreatePostForm" onSubmit={this.handleSubmit}>
          <div className="Menu HeaderMenu">
            <Text
              size="14px"
              color={COLORS[GRADIENT_COLORS.blue]}
              weight="bold"
            >
              New thread
            </Text>
          </div>
          <div className="InputRow">
            <div className="Photo">
              <EditPhotoContainer
                dropZoneRef={this.props.dropZoneRef}
                photo={this.state.photo}
                onChange={this.handleChangeFile}
                boardId={this.props.boardId}
                onFileDialogCancel={this.handleDialogCancel}
                editPhotoRef={this.setEditPhotoRef}
                setPhoto={this.handleSetPhoto}
              />
            </div>

            <Spacer width={SPACING.large} />

            <div className="Content">
              <div className="Author">
                <Author author={{ name: "Anonymous" }} />
              </div>

              <textarea
                autoFocus
                autoCapitalize
                autoCorrect
                placeholder="(Optional) leave a comment to go along with your pic"
                value={this.state.text}
                onChange={this.handleSetText}
              />
            </div>
          </div>

          <div className="Menu ActionsMenu">
            <button>
              <Button color={GRADIENT_COLORS.blue}>Create thread</Button>
            </button>
          </div>
        </form>

        <style jsx>{`
          .Container {
            display: block;
            min-width: 525px;
            width: min-content;
            position: absolute;
            top: 100%;
            z-index: 999;
            margin-top: -6px;
            border-radius: 4px;
            filter: drop-shadow(1px 2px 1px rgba(0, 0, 0, 0.2));
          }

          .Container--hidden {
            opacity: 0;
            pointer-events: none;
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
    );
  }
}

const CreatePostFormWithClickOutside = onClickOutside(_CreatePostForm);

export const CreatePostForm = graphql(Queries.CreateThread, {
  name: "createPost"
})(CreatePostFormWithClickOutside);

export default CreatePostForm;
