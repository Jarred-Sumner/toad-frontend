import React from "react";
import Typist from "react-typist";
import "react-typist/dist/Typist";
import { defaultProps } from "recompose";
import Settings from "../../lib/Settings";
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
import ToadLogo from "../ToadLogo";
import Countdown from "react-countdown-now";
import moment from "moment";
import { Link } from "Toads/routes";

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
  size: "18px",
  letterSpacing: "0px",
  weight: "normal",
  color: COLORS.white
})(Text);

export const GreatReset = ({ hours, minutes }) => (
  <div className="ResetContainer">
    <div className="TimerBox">
      <Text size="12px" lineHeight="12px" color="inherit" weight="semiBold">
        {hours}:{minutes}
      </Text>
    </div>
    <Spacer width={SPACING.small} />
    <Text weight="bold" color="inherit" size="14px">
      Great Reset™
    </Text>
    <style jsx>{`
      .TimerBox {
        padding: ${SPACING.xsmall}px ${SPACING.small}px;
        border: 1px solid ${COLORS.white};
        display: flex;
        align-items: center;
        border-radius: 2px;
      }

      .TimerBox :global(.Text) {
        height: 12px;
        display: flex;
      }

      .ResetContainer {
        display: flex;
        color: white;
        align-items: center;
      }
    `}</style>
  </div>
);

export const GreatResetCountdown = defaultProps({
  intervalDelay: 60000,
  daysInHours: true,
  renderer: GreatReset
})(Countdown);

export class ThreadHeader extends React.PureComponent {
  state = {
    showTyping: null
  };

  async componentDidMount() {
    const { identity } = this.props;
    const newIdentity = await Settings.setIdentity(identity.id);
    console.log("newid", newIdentity);
    this.setState({ showTyping: newIdentity });
  }

  render() {
    const { board, onClick, identity } = this.props;
    const { showTyping } = this.state;
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
                {showTyping === true && (
                  <Typist
                    hidewhenDoneDelay={100}
                    cursor={{ hideWhenDone: true }}
                  >
                    <span>Today, you are</span>
                    &nbsp;
                    <span className="BoldText">
                      {normalizeAnonymousName(identity.name)}
                    </span>
                  </Typist>
                )}
                {showTyping === false && (
                  <span className="BoldText">
                    {normalizeAnonymousName(identity.name)}
                  </span>
                )}
              </BoardTitle>
            </div>

            <div className="HeaderContentRow">
              <div className="OnlineNowBar">
                <Link route="board" params={{ board: board.id }}>
                  <a>
                    <ToadLogo />
                  </a>
                </Link>

                <Spacer width={SPACING.medium} />
                <Button
                  onClick={onClick}
                  color={COLORS.white}
                  icon={<Icon icon={ICONS.plus} color={COLORS.black} />}
                >
                  Post in thread
                </Button>
                <Spacer width={SPACING.medium} />
                <BoardPresence
                  boardID={id}
                  onlineCount={activity.active_count}
                />

                <Spacer width={SPACING.medium} />

                <GreatResetCountdown
                  date={moment()
                    .add(1, "day")
                    .startOf("day")
                    .toDate()}
                />
              </div>
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
            padding-top: ${SPACING.normal}px;
            padding-bottom: ${SPACING.normal}px;
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
            display: flex;
            justify-content: space-between;
            flex-direction: row-reverse;
            width: 100%;
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
