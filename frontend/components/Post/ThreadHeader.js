import React from "react";
import { defaultProps } from "recompose";
import { COLORS } from "../../lib/colors";
import { SPACING } from "../../lib/spacing";
import { Button } from "../Button";
import { BoardPresence } from "../Chat/BoardPresence";
import { Gradient, GRADIENT_COLORS } from "../Gradient";
import { Icon, ICONS } from "../Icon";
import { Spacer } from "../Spacer";
import { Text } from "../Text";
import { Author } from "./Author";

export const BoardTitle = defaultProps({
  size: "24px",
  letterSpacing: "0.33px",
  weight: "bold",
  color: COLORS.white
})(Text);

export class ThreadHeader extends React.PureComponent {
  render() {
    const { board, onClick, identity } = this.props;
    if (!board) {
      return null;
    }

    const {
      online_count: onlineCount = 12,
      color_scheme: colorScheme,
      id,
      label,
      activity
    } = board;

    const color = COLORS[colorScheme];

    return (
      <Gradient color={GRADIENT_COLORS[colorScheme]}>
        <div className="Header">
          <div className="HeaderContent HeaderContent--left">
            <BoardTitle>
              /{id}/ - {label}
            </BoardTitle>
            <Spacer height={SPACING.normal} />
            <div className="OnlineNowBar">
              <Button
                onClick={onClick}
                color={COLORS.white}
                icon={<Icon icon={ICONS.plus} color={COLORS.black} />}
              >
                Post in thread
              </Button>
              <Spacer width={SPACING.normal} />
              <BoardPresence boardID={id} onlineCount={activity.active_count} />
            </div>
          </div>

          <div className="HeaderContent HeaderContent--right">
            <div className="HeaderContentRow">
              <Text color="inherit">You:</Text>&nbsp;
              <Author identity={identity} />
            </div>
          </div>
        </div>

        <style jsx>{`
          .Header {
            padding-left: ${SPACING.huge}px;
            padding-right: ${SPACING.huge}px;
            padding-top: ${SPACING.normal}px;
            padding-bottom: ${SPACING.normal}px;
            position: relative;
            justify-content: space-between;
            display: flex;
          }

          .HeaderContent {
            color: ${COLORS.white};
          }

          .HeaderContentRow {
            display: flex;
            align-items: center;
            text-shadow: 0 0 1px rgba(0, 0, 0, 0.25);
          }

          .OnlineNowBar {
            display: flex;
            align-items: center;
          }
        `}</style>
      </Gradient>
    );
  }
}

export default ThreadHeader;
