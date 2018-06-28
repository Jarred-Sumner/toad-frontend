import React from "react";
import { Query, Subscription } from "react-apollo";
import { Queries } from "Queries";
import { Message } from "./Message";
import _ from "lodash";
import { SPACING } from "lib/spacing";
import { Spacer } from "../Spacer";
import ReactTooltip from "react-tooltip";
import { COLORS } from "lib/colors";
const DEFAULT_LIMIT = 20;

class ChatConversation extends React.PureComponent {
  componentDidMount() {
    ReactTooltip.rebuild();

    this.props.subscribeToMore({
      document: Queries.SubscribeToBoardChat,
      variables: { boardID: this.props.board.id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newMessage = subscriptionData.data.NewBoardMessage;

        return Object.assign({}, prev, {
          Board: {
            ...this.props.board,
            chat: {
              ...prev.Board.chat,
              messages: [newMessage, ...(prev.Board.chat.messages || [])]
            }
          }
        });
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.messages.length !== this.props.messages.length) {
      ReactTooltip.rebuild();
    }
  }

  render() {
    const { messages, colorScheme, identity } = this.props;
    return (
      <div className="ConversationList">
        {messages.map(message => (
          <React.Fragment key={message.id}>
            <Message
              key={message.id}
              message={message}
              colorScheme={colorScheme}
              isSentByCurrentUser={message.identity.id === identity.id}
            />
            <Spacer height={SPACING.small} />
          </React.Fragment>
        ))}

        <style jsx>{`
          .ConversationList {
            overflow-y: auto;
            display: flex;
            flex-direction: column-reverse;
            flex-shrink: 0;
            width: auto;
            max-height: 300px;
            background-color: white;
            border-left: 1px solid ${COLORS.offwhite};
            border-right: 1px solid ${COLORS.offwhite};
            padding: ${SPACING.normal}px ${SPACING.normal}px;
          }
        `}</style>
      </div>
    );
  }
}

export const BoardChatConversation = ({ board, identity, ...otherProps }) => {
  return (
    <Query
      query={Queries.BoardChatHistory}
      variables={{
        boardID: board.id,
        offset: 0,
        limit: DEFAULT_LIMIT
      }}
    >
      {({ data, subscribeToMore }) => (
        <ChatConversation
          {...otherProps}
          subscribeToMore={subscribeToMore}
          messages={_.get(data, "Board.chat.messages") || []}
          board={board}
          identity={identity}
        />
      )}
    </Query>
  );
};
