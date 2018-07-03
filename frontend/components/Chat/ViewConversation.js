import React from "react";
import { ChatHeader, CONVERSATION_TYPES } from "./ChatHeader";
import { Conversation } from "./Conversation";
import { ChatComposer } from "./Composer";
import invariant from "invariant";
import { graphql } from "react-apollo";
import { compose } from "recompose";
import { Queries } from "Queries";
import { PARTICIPATION_STATUSES } from "./DesktopChat";

class RawViewConversation extends React.PureComponent {
  handleToggleVisible = () =>
    this.props.onToggleVisible(this.props.conversation.id);

  handleClose = () => {
    return this.props.onClose({
      variables: { conversationID: this.props.conversation.id },
      optimisticResponse: {
        __typename: "Mutation",
        ConversationPresence: {
          ...this.props.conversation,
          participation_status: PARTICIPATION_STATUSES.declined
        }
      }
    });
  };

  handleTypingChange = isTyping => {
    return this.props.updateTypingStatus({
      variables: {
        isTyping,
        conversationID: this.props.conversation.id
      }
    });
  };

  handleSendMessage = ({ body, attachmentID }) => {
    return this.props.sendMessage({
      variables: {
        body,
        attachmentID,
        conversationID: this.props.conversation.id
      }
    });
  };

  render() {
    const { colorScheme, conversation, identity, isVisible } = this.props;

    invariant(identity, "user_identity in Conversation must exist", this.props);

    return (
      <div className="ChatWidget">
        <ChatHeader
          onToggleVisible={this.handleToggleVisible}
          conversation={conversation}
          isCollapsed={!isVisible}
          identity={identity}
          onlineCount={conversation.participants_count || 0}
          onClose={this.handleClose}
          colorScheme={colorScheme}
        />
        {isVisible && (
          <React.Fragment>
            <Conversation
              conversation={conversation}
              identity={identity}
              colorScheme={colorScheme}
            />
            <ChatComposer
              colorScheme={colorScheme}
              onSend={this.handleSendMessage}
              onTypingChange={this.handleTypingChange}
            />
          </React.Fragment>
        )}

        <style jsx>{`
          .ChatWidget {
            pointer-events: auto;
            filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.15));
            max-width: 250px;
            display: flex;
            align-self: flex-end;
            flex-shrink: 0;
            flex-grow: 0;
            flex-direction: column;
          }
        `}</style>
      </div>
    );
  }
}

export const ViewConversation = compose(
  graphql(Queries.SendMessage, {
    name: "sendMessage"
  }),
  graphql(Queries.UpdateTypingStatus, {
    name: "updateTypingStatus"
  }),
  graphql(Queries.LeaveConversation, {
    name: "onClose",
    options: props => {
      return {
        update: (cache, { data }) => {
          const conversation = _.get(data, "ConversationPresence");
          if (!conversation) {
            return;
          }

          const activeConversationsQuery = cache.readQuery({
            query: Queries.ActiveConversations
          }).ActiveConversations;

          const activeConversationIndex = _.findIndex(
            activeConversations,
            ({ id }) => conversation.id === id
          );

          const isInsideActiveConversations = activeConversationIndex > -1;

          if (isInsideActiveConverations) {
            activeConversations.splice(activeConversationIndex, 1);
            cache.writeQuery({
              query: Queries.ActiveConversations,
              data: {
                ActiveConversations: activeConversations
              }
            });
          }

          const boardConversationQuery = cache.readQuery({
            query: Queries.ViewBoardConversation,
            variables: {
              boardID: conversation.board.id
            }
          });

          if (
            _.get(boardConversationQuery, "Board.board_conversation.id") ===
            conversation.id
          ) {
            cache.writeQuery({
              query: Queries.ViewBoardConversation,
              variables: {
                boardID: conversation.board.id
              },
              data: {
                Board: {
                  id: conversation.board.id,
                  __typename: "Board",
                  board_conversation: { conversation }
                }
              }
            });
          }
        }
      };
    }
  })
)(RawViewConversation);

export default ViewConversation;
