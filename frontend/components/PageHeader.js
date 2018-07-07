import { BoardPresence } from "./Chat/BoardPresence";
import { Gradient, GRADIENT_COLORS } from "./Gradient";
import moment from "moment";
import React from "react";
import Countdown from "react-countdown-now";
import Typist from "react-typist";
import "react-typist/dist/Typist";
import { defaultProps } from "recompose";
import { Spacer } from "./Spacer";
import { Text } from "./Text";
import ToadLogo from "./ToadLogo";
import { Link } from "Toads/routes";
import { COLORS } from "../lib/colors";
import { Settings } from "../lib/Settings";
import { SPACING } from "../lib/spacing";
import { normalizeAnonymousName } from "./Post/Author";
import { MEDIUM_BEAKPOINT, MOBILE_BEAKPOINT } from "lib/mobile";

export const Title = defaultProps({
  size: "1rem",
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
        border: 1px solid currentColor;
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
        color: inherit;
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

export class PageHeader extends React.PureComponent {
  state = {
    showTyping: null
  };
  async componentDidMount() {
    const { identity } = this.props;
    const newIdentity = await Settings.setIdentity(identity.id);
    this.setState({ showTyping: newIdentity });
  }
  render() {
    const {
      board,
      hideCreatePost,
      isCreatePostVisible,
      showCreatePost,
      dropZoneRef,
      identity,
      children
    } = this.props;
    if (!board) {
      return null;
    }
    const { showTyping } = this.state;

    const {
      online_count: onlineCount = 12,
      color_scheme: colorScheme,
      id,
      label,
      expires_at,
      activity
    } = board;

    const color = COLORS[colorScheme];

    return (
      <Gradient color={GRADIENT_COLORS[colorScheme]}>
        <div className="Header">
          <div className="HeaderBackground" />

          <div className="HeaderContent ">
            <div className="HeaderContentRow">
              <Link route="board" params={{ board: board.id }}>
                <a>
                  <ToadLogo />
                </a>
              </Link>

              <Spacer width={SPACING.medium} />
              {children}
              <div className="HeaderContentRow DesktopOnly">
                <BoardPresence
                  boardID={id}
                  onlineCount={activity.active_count}
                />

                <Spacer width={SPACING.medium} />

                <GreatResetCountdown
                  color={COLORS.white}
                  date={moment(expires_at).toDate()}
                />
              </div>
            </div>

            <div className="HeaderContentRow">
              <Title>
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
              </Title>
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
            flex-direction: row;
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

          @media (max-width: ${MOBILE_BEAKPOINT}px) {
            .Header,
            .HeaderBackground {
              padding-left: ${SPACING.normal}px;
              padding-right: ${SPACING.normal}px;
              padding-top: ${SPACING.normal}px;
              padding-bottom: ${SPACING.normal}px;
            }
          }
        `}</style>
      </Gradient>
    );
  }
}

export default PageHeader;
