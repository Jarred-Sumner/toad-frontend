import React from "react";
import { Icon, ICONS } from "../Icon";
import { COLORS } from "lib/colors";
import { SPACING } from "lib/spacing";

import { Text } from "../Text";
import { Spacer } from "../Spacer";
import Dropzone from "react-dropzone";
import { Mutation } from "react-apollo";
import { Queries } from "Queries";
import { uploadFile } from "lib/uploadFile";
import Alert from "../Alert";
import { TextArea } from "../TextArea";

const ENTER_KEYCODE = 13;

class RawChatComposer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      body: "",
      attachment: null,
      isUploadingFile: false
    };
  }

  handleChange = ({ target: { value: body } }) => this.setState({ body });
  handleSend = evt => {
    evt.preventDefault();

    this.sendMessage();
  };

  sendMessage = async () => {
    const { body, attachment, file, isUploadingFile } = this.state;
    if ((_.isEmpty(body) && !attachment && !file) || isUploadingFile) {
      return;
    }

    let attachmentID = attachment;

    if (file && !attachmentID) {
      this.setState({ isUploadingFile: true });
      try {
        attachmentID = await uploadFile({
          createAttachment: this.props.createAttachment,
          file
        }).then(
          id => {
            return id;
          },
          error => {
            return Promise.reject({
              message: "File upload failed. Please try again."
            });
          }
        );

        this.setState({ isUploadingFile: false });
      } catch (exception) {
        console.error(exception);
        Alert.error(
          "Something went wrong while uploading the file. Please retry."
        );
        return;
      }
    }

    this.props.onSend({
      body,
      attachmentID
    });

    this.setState({ body: "", attachment: null, file: null });
  };

  handleReturn = event => {
    const { keyCode, shiftKey } = event;
    if (keyCode === ENTER_KEYCODE && !shiftKey) {
      event.preventDefault();

      this.sendMessage();
      return false;
    } else {
      return true;
    }
  };

  handleDrop = files => {
    const file = _.first(files);

    if (!file) {
      return;
    }

    this.setState({ file });
  };

  render() {
    const { body, file } = this.state;

    return (
      <form onSubmit={this.handleSend} className="Container">
        <div className="PhotoPicker">
          <Dropzone
            multiple={false}
            // disabled={status === Status.uploading}
            accept="image/*"
            style={{
              borderWidth: 0,
              borderRadius: 0,
              width: "100%",
              height: "100%"
            }}
            onDrop={this.handleDrop}
          >
            <Icon color="inherit" icon={ICONS.camera} />
          </Dropzone>
        </div>

        <Spacer width={SPACING.normal} />

        <div className="ComposerInputContainer">
          {file &&
            file.preview && (
              <React.Fragment>
                <img src={file.preview} className="PhotoPreview" />
                <Spacer height={SPACING.small} />
              </React.Fragment>
            )}
          <TextArea
            name="body"
            value={body}
            maxRows={20}
            rows={1}
            placeholder="Type a message..."
            onChange={this.handleChange}
            onKeyDown={this.handleReturn}
            type="text"
          />
        </div>

        <style jsx>{`
          .Container {
            display: flex;
            align-items: center;
            padding: ${SPACING.small}px ${SPACING.normal}px;
            background-color: ${COLORS.white};
            border-left: 1px solid ${COLORS.offwhite};
            border-right: 1px solid ${COLORS.offwhite};
            border-top: 1px solid ${COLORS.offwhite};
            width: 100%;
          }

          img {
            max-width: 75px;
            max-height: 60px;
            object-fit: contain;
            border-radius: 4px;
          }

          .PhotoPicker {
            display: flex;
            align-items: center;
            cursor: pointer;
            align-self: flex-end;
            padding: ${SPACING.small}px 0;
            margin-bottom: 1px;
            color: ${COLORS.gray};
          }

          .PhotoPicker:hover {
            color: ${COLORS.black};
          }

          :global(.ComposerInputContainer > textarea) {
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 32px;
            background-color: ${COLORS.offwhite};
            border: 1px solid ${COLORS.offwhite};
            padding: ${SPACING.small}px ${SPACING.normal}px;
            font-size: 12px;
            width: 200px;
            resize: none;
            outline: 0;
          }

          :global(.ComposerInputContainer > textarea:focus) {
            background-color: ${COLORS.background};
            border-color: ${COLORS.offwhite};
          }

          button {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}</style>
      </form>
    );
  }
}

export const ChatComposer = props => (
  <Mutation mutation={Queries.CreateAttachment}>
    {createAttachment => (
      <RawChatComposer createAttachment={createAttachment} {...props} />
    )}
  </Mutation>
);
