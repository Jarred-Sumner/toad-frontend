import React from "react";
import { Icon, ICONS } from "../Icon";
import { COLORS } from "lib/colors";
import { SPACING } from "lib/spacing";
import TextAreaAutosize from "react-autosize-textarea";
import { Text } from "../Text";
import { Spacer } from "../Spacer";
import Dropzone from "react-dropzone";

const ENTER_KEYCODE = 13;

export class ChatComposer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      body: "",
      attachment: null
    };
  }

  handleChange = ({ target: { value: body } }) => this.setState({ body });
  handleSend = evt => {
    evt.preventDefault();

    this.sendMessage();
  };

  sendMessage = () => {
    const { body, attachment } = this.state;
    if (_.isEmpty(body) && !attachment) {
      return;
    }

    this.props.onSend({
      body,
      attachment
    });

    this.setState({ body: "", attachment: null });
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

  handleDrop = event => {
    const file = _.first(event.target.files);

    if (!file) {
      return;
    }
  };

  render() {
    const { body } = this.state;

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
          <TextAreaAutosize
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

          .PhotoPicker {
            display: flex;
            align-items: center;
            cursor: pointer;
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
