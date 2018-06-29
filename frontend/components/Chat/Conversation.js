import React from "react";
import { Query, Subscription } from "react-apollo";
import { Queries } from "Queries";
import { MessageGroup } from "./Message";
import _ from "lodash";
import { SPACING } from "lib/spacing";
import { Spacer } from "../Spacer";
import ReactTooltip from "react-tooltip";
import { COLORS } from "lib/colors";
const DEFAULT_LIMIT = 20;

class ChatConversation extends React.PureComponent {
  state = {
    messageGroups: []
  };

  static getDerivedStateFromProps(props, state) {
    const messageGroups = [];
    let lastMessageGroup;

    props.messages.forEach((message, index) => {
      if (
        !lastMessageGroup ||
        lastMessageGroup.identity.id !== message.identity.id
      ) {
        lastMessageGroup = {
          identity: message.identity,
          messages: []
        };
        messageGroups.push(lastMessageGroup);
      }

      lastMessageGroup.messages.push(message);
    });

    return {
      messageGroups
    };
  }
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
    const { colorScheme, identity } = this.props;
    const { messageGroups } = this.state;
    return (
      <div className="ConversationList">
        {messageGroups.map(messageGroup => (
          <React.Fragment key={_.last(messageGroup.messages.id)}>
            <MessageGroup
              messageGroup={messageGroup}
              colorScheme={colorScheme}
              isSentByCurrentUser={messageGroup.identity.id === identity.id}
            />
            {messageGroup.identity.id !== identity.id && (
              <Spacer height={SPACING.small} />
            )}
          </React.Fragment>
        ))}

        <style jsx>{`
          .ConversationList {
            overflow-y: auto;
            display: flex;
            flex-direction: column-reverse;
            flex-shrink: 0;
            width: auto;
            max-width: 100%;
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
