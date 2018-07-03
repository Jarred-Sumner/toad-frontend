import React from "react";
import { Queries } from "Queries";
import { Text } from "../Text";
import { COLORS } from "lib/colors";
import { GRADIENT_COLORS } from "../Gradient";
import { SPACING } from "lib/spacing";
import GreenDot from "../GreenDot";
import { Spacer } from "../Spacer";
import { Subscription } from "react-apollo";
import _ from "lodash";
import classNames from "classnames";
import { Icon, ICONS } from "../Icon";
import { normalizeAnonymousName } from "../Post/Author";

export const CONVERSATION_TYPES = {
  board_chat: "BoardConversation",
  dm: "DirectConversation"
};

class BoardConversationChatHeader extends React.PureComponent {
  render() {
    const { onlineCount, conversation } = this.props;
    return (
      <React.Fragment>
        {onlineCount > 0 && (
          <React.Fragment>
            <GreenDot />
            <Spacer width={SPACING.small} />
          </React.Fragment>
        )}

        <Text color={COLORS.white} weight="semiBold" size="inherit">
          /{conversation.board.id}/&nbsp;
          {onlineCount > 0 && (
            <Text color="inherit" weight="regular" size="inherit">
              ({onlineCount} online)
            </Text>
          )}
        </Text>
      </React.Fragment>
    );
  }
}

class DirectConversationChatHeader extends React.PureComponent {
  get participants() {
    return _.compact(this.props.conversation.participants);
  }

  get participant() {
    const { identity } = this.props;

    return this.participants.find(({ id }) => id !== identity.id);
  }

  get isOnline() {
    const {
      active_participants: activeParticipants = {}
    } = this.props.conversation;

    if (!this.participant || !activeParticipants) {
      return false;
    }

    return !!activeParticipants[this.participant.id];
  }

  render() {
    if (!this.participant) {
      return null;
    }

    return (
      <React.Fragment>
        {this.isOnline && (
          <React.Fragment>
            <GreenDot />
            <Spacer width={SPACING.small} />
          </React.Fragment>
        )}

        <Text color={COLORS.white} weight="semiBold" size="inherit">
          {normalizeAnonymousName(this.participant.name)}
        </Text>
      </React.Fragment>
    );
  }
}

export class ChatHeader extends React.PureComponent {
  handleClose = event => {
    event.stopPropagation();

    this.props.onClose();
  };

  render() {
    const {
      conversation,
      onlineCount,
      colorScheme = GRADIENT_COLORS.green,
      onToggleVisible,
      isCollapsed,
      onClose,
      identity
    } = this.props;

    const type = _.invert(CONVERSATION_TYPES)[conversation.__typename];

    const isBoardChat =
      CONVERSATION_TYPES[type] === CONVERSATION_TYPES.board_chat;
    const ChatHeaderComponent = isBoardChat
      ? BoardConversationChatHeader
      : DirectConversationChatHeader;

    return (
      <div
        onClick={onToggleVisible}
        className={classNames("ChatHeader", {
          "ChatHeader--collapsed": isCollapsed
        })}
      >
        <div className="Content Content--left">
          <ChatHeaderComponent
            identity={identity}
            onlineCount={onlineCount}
            colorScheme={colorScheme}
            conversation={conversation}
          />
        </div>

        <div className="Content Content--right">
          <Spacer width={SPACING.normal} />
          <div
            data-tip="Leave chat"
            onClick={this.handleClose}
            className="CloseButton"
          >
            <Icon icon={ICONS.close} color="white" />
          </div>
        </div>
        <style jsx>{`
          .ChatHeader {
            background-color: ${COLORS[GRADIENT_COLORS[colorScheme]]};
            padding: ${SPACING.normal}px ${SPACING.normal}px;
            display: flex;
            align-items: center;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            font-size: 14px;
            cursor: pointer;
            justify-content: space-between;
            min-width: 50px;
          }

          .Content {
            display: flex;
          }

          .CloseButton {
            cursor: pointer;
            opacity: 0.75;
          }

          .CloseButton:hover {
            opacity: 1;
          }

          .ChatHeader:hover {
            filter: brightness(95%);
          }
        `}</style>
      </div>
    );
  }
}
