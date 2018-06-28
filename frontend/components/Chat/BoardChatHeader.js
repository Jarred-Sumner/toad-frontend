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

class RawBoardChatHeader extends React.PureComponent {
  render() {
    const {
      board,
      onlineCount,
      colorScheme,
      onToggleVisible,
      isCollapsed
    } = this.props;
    return (
      <div
        onClick={onToggleVisible}
        className={classNames("BoardChatHeader", {
          "BoardChatHeader--collapsed": isCollapsed
        })}
      >
        <GreenDot />
        <Spacer width={SPACING.small} />
        <Text color={COLORS.white} weight="semiBold" size="inherit">
          /{board.id}/&nbsp;
          <Text color="inherit" weight="regular" size="inherit">
            ({onlineCount} online)
          </Text>
        </Text>
        <style jsx>{`
          .BoardChatHeader {
            background-color: ${COLORS[GRADIENT_COLORS[colorScheme]]};
            padding: ${SPACING.normal}px ${SPACING.normal}px;
            display: flex;
            align-items: center;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            font-size: 14px;
            cursor: pointer;
          }

          .BoardChatHeader:hover {
            filter: brightness(95%);
          }
        `}</style>
      </div>
    );
  }
}

export const BoardChatHeader = ({
  board,
  colorScheme,
  onToggleVisible,
  isCollapsed
}) => (
  <Subscription
    subscription={Queries.BoardActivitySubscription}
    variables={{ boardID: board.id }}
  >
    {({ data }) => (
      <RawBoardChatHeader
        onlineCount={
          _.get(data, "BoardActivity.active_count") ||
          board.activity.active_count
        }
        board={board}
        onToggleVisible={onToggleVisible}
        isCollapsed={isCollapsed}
        colorScheme={colorScheme}
      />
    )}
  </Subscription>
);
