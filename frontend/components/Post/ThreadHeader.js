import React from "react";
import Typist from "react-typist";
import "react-typist/dist/Typist";
import { defaultProps } from "recompose";
import { COLORS } from "../../lib/colors";
import { SPACING } from "../../lib/spacing";
import { Button } from "../Button";
import { BoardPresence } from "../Chat/BoardPresence";
import { Gradient, GRADIENT_COLORS } from "../Gradient";
import { Icon, ICONS } from "../Icon";
import { Spacer } from "../Spacer";
import { Text } from "../Text";
import { normalizeAnonymousName } from "./Author";
import { CreatePostForm } from "./CreatePost";

const NewPostButton = ({ classes, onPress }) => (
  <Button
    onClick={onPress}
    color={COLORS.white}
    icon={<Icon icon={ICONS.camera} color={COLORS.black} />}
  >
    New thread
  </Button>
);

export const BoardTitle = defaultProps({
  size: "32px",
  letterSpacing: "0px",
  weight: "normal",
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
          <div className="HeaderBackground" />

          <div className="HeaderContent HeaderContent--left">
            <div className="HeaderContentRow">
              <BoardTitle>
                <Typist hidewhenDoneDelay={100} cursor={{ hideWhenDone: true }}>
                  <span>Today, you are</span>
                  &nbsp;
                  <span className="BoldText">
                    {normalizeAnonymousName(identity.name)}
                  </span>
                </Typist>
              </BoardTitle>
            </div>
            <Spacer height={SPACING.large} />
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
        </div>

        <style jsx>{`
          .Header {
            position: relative;
            justify-content: space-between;
            display: flex;
          }

          .BoldText {
            font-weight: bold;
            color: white;
          }

          .Header,
          .HeaderBackground {
            padding-left: ${SPACING.huge}px;
            padding-right: ${SPACING.huge}px;
            padding-top: ${SPACING.large}px;
            padding-bottom: ${SPACING.large}px;
          }

          .HeaderBackground {
            position: absolute;
            z-index: 0;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            display: flex;
            width: 100%;
            height: 100%;
            pointer-events: none;
            opacity: 0;
            background-image: url("/static/ToadLogo.svg");
            animation: fade-background-in 1s linear;
            animation-fill-mode: forwards;
            animation-delay: 4s;
            background-repeat: repeat;
          }

          @keyframes fade-background-in {
            0% {
              opacity: 0;
            }

            100% {
              opacity: 0.1;
            }
          }

          .HeaderContent {
            color: ${COLORS.white};
          }

          .HeaderContentRow {
            display: flex;
            align-items: center;
            text-shadow: 0 0 1px rgba(0, 0, 0, 0.25);
          }

          .CountdownTimer {
            display: flex;

            text-align: right;
          }

          .CountdownTimerContainer {
            display: flex;
            justify-content: flex-end;
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
