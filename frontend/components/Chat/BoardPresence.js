import React from "react";
import GreenDot from "../GreenDot";
import { Spacer } from "../Spacer";
import { Text } from "../Text";
import { COLORS } from "lib/colors";
import { Mutation, Query, Subscription } from "react-apollo";
import { Queries } from "Queries";
import _ from "lodash";
import { SPACING } from "lib/spacing";

const POLL_INTERVAL = 20000; // server-side it's 30 seconds, but we do 20 seconds just to be safe
class BoardPresenceIndicator extends React.PureComponent {
  render() {
    const { onlineCount } = this.props;
    return (
      <div className="BoardPresence">
        <GreenDot />
        <Spacer width={SPACING.small} />
        <Text
          size="14px"
          weight="bold"
          letterSpacing="0.22px"
          color={COLORS.white}
        >
          <Text underline weight="inherit" color="inherit" size="inherit">
            {onlineCount} toads
          </Text>
          &nbsp;online now
        </Text>

        <style jsx>{`
          .BoardPresence {
            display: flex;
            align-items: center;
          }
        `}</style>
      </div>
    );
  }
}

class RawBoardPresence extends React.Component {
  componentDidMount() {
    if (!document.hidden) {
      this.touchOnline();
      this.startUpdatingPresence();
    }

    document.addEventListener(
      "visibilitychange",
      this.handleVisibilityChange,
      false
    );
  }

  startUpdatingPresence = () => {
    if (this.presencePoller) {
      return;
    }

    this.presencePoller = window.setInterval(this.touchOnline, POLL_INTERVAL);
  };

  stopUpdatingPresence = () => {
    window.clearInterval(this.presencePoller);
    delete this.presencePoller;
    this.presencePoller = undefined;
  };

  componentWillUnmount() {
    this.stopUpdatingPresence();
  }

  touchOnline = () => {
    this.props.updatePresence({
      variables: {
        boardID: this.props.boardID,
        visible: true
      }
    });
  };

  // We don't actually ever mark as offline because cross-tab coordination sounds more nuanced than what I currently have time for
  // This means the online now count could be innacurate by like...30 seconds.
  // which is nbd anyway.
  handleVisibilityChange = () => {
    if (typeof document === "undefined") {
      return;
    }

    if (document.hidden) {
      this.stopUpdatingPresence();
    } else {
      this.touchOnline();
      this.startUpdatingPresence();
    }
  };

  render() {
    const { onlineCount, boardID } = this.props;
    return (
      <Subscription
        subscription={Queries.BoardActivitySubscription}
        variables={{ boardID }}
      >
        {({ data }) => (
          <BoardPresenceIndicator
            onlineCount={
              _.get(data, "BoardActivity.active_count") || onlineCount
            }
          />
        )}
      </Subscription>
    );
  }
}

export const BoardPresence = ({ boardID, onlineCount, ...otherProps }) => {
  return (
    <Mutation
      mutation={Queries.UpdatePresence}
      variables={{ boardID, visible: true }}
    >
      {updatePresence => (
        <RawBoardPresence
          boardID={boardID}
          key={boardID}
          updatePresence={updatePresence}
          onlineCount={onlineCount}
        />
      )}
    </Mutation>
  );
};

export default BoardPresence;
