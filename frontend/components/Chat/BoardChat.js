import React from "react";
import { Subscription, Mutation } from "react-apollo";
import { Queries } from "Queries";
import { BoardChatHeader } from "./BoardChatHeader";
import { Spacer } from "../Spacer";
import { SPACING } from "lib/spacing";
import { ChatComposer } from "./Composer";
import { BoardChatConversation } from "./Conversation";
import { COLORS } from "lib/colors";
import { Settings } from "lib/Settings";
import classNames from "classnames";

class RawBoardChat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false,
      hasInitialized: false
    };
  }

  async componentDidMount() {
    const isVisible = !(await Settings.isBoardChatHidden(this.props.board.id));
    console.log({ isVisible });
    this.setState({ isVisible, hasInitialized: true });
  }

  handleToggleVisible = () => {
    const isVisible = !this.state.isVisible;
    this.setState({ isVisible }, () => {
      Settings.setHideBoardChat(this.props.board.id, !isVisible).then(() => {
        console.log("Updated board chat visiblility", isVisible);
      });
    });
  };
  handleSendMessage = ({ body, attachment }) => {
    this.props.sendMessage({
      variables: {
        body,
        attachmentID: attachment ? attachment.id : undefined,
        boardID: this.props.board.id
      }
    });
  };

  render() {
    const { board, colorScheme } = this.props;
    const { isVisible, hasInitialized } = this.state;

    return (
      <div
        className={classNames("BoardChatContainer", {
          "BoardChatContainer--hidden": !hasInitialized
        })}
      >
        <div className="BoardChatWidget">
          <BoardChatHeader
            onToggleVisible={this.handleToggleVisible}
            board={board}
            isCollapsed={!isVisible}
            colorScheme={colorScheme}
          />
          {isVisible && (
            <React.Fragment>
              <BoardChatConversation
                board={board}
                identity={board.identity}
                colorScheme={colorScheme}
              />
              <ChatComposer onSend={this.handleSendMessage} />
            </React.Fragment>
          )}
        </div>

        <Spacer width={SPACING.huge} />

        <style jsx>{`
          .BoardChatContainer {
            position: fixed;
            bottom: 0;
            right: 0;
            pointer-events: none;
            display: flex;
          }

          .BoardChatContainer--hidden {
            display: none;
          }

          .BoardChatWidget {
            pointer-events: auto;
            filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.15));
            max-width: 250px;
          }
        `}</style>
      </div>
    );
  }
}

export const BoardChat = ({ board, ...otherProps }) => (
  <Mutation mutation={Queries.SendBoardMessage}>
    {sendMessage => (
      <RawBoardChat sendMessage={sendMessage} board={board} {...otherProps} />
    )}
  </Mutation>
);

export default BoardChat;
