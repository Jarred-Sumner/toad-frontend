import classNames from "classnames";
import { Settings } from "lib/Settings";
import { SPACING } from "lib/spacing";
import { Queries } from "Queries";
import React from "react";
import { Mutation, Query } from "react-apollo";
import { Spacer } from "../Spacer";
import { ViewConversation } from "./ViewConversation";
import _ from "lodash";
import Bluebird from "bluebird";

export const PARTICIPATION_STATUSES = {
  auto: "auto",
  explicit_opt_in: "explicit_opt_in",
  declined: "declined",
  expired: "expired"
};

const isNewConversationVisible = conversation => {
  const { participation_status } = conversation;
  return [
    null,
    PARTICIPATION_STATUSES.auto,
    PARTICIPATION_STATUSES.explicit_opt_in
  ].includes(participation_status);
};

class RawDesktopChat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visibleConversations: [],
      allConversations: [],
      boardConversation: null,
      conversations: []
    };
  }

  static getDerivedStateFromProps(props, state) {
    const changes = {};

    if (props.boardConversation !== state.boardConversation) {
      changes.boardConversation = props.boardConversation;
    }

    if (
      props.conversations !== state.conversations ||
      props.boardConversation !== state.boardConversation
    ) {
      const newConversations = _
        .compact([props.boardConversation, ...props.conversations])
        .filter(({ id }) => !state.visibleConversations.includes(id))
        .filter(isNewConversationVisible)
        .map(({ id }) => id);

      changes.conversations = props.conversations;

      changes.allConversations = _.uniqBy(
        _.compact([...props.conversations, props.boardConversation]),
        "id"
      );
    }

    return changes;
  }

  componentDidMount() {
    this.props.subscribeToMore({
      document: Queries.SubscribeToConversationParticipationStatusUpdates,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const updatedConversation = subscriptionData.data.VisibleConversations;
        const conversations = this.props.conversations.slice();

        const index = _.findIndex(conversations, [
          "id",
          updatedConversation.id
        ]);

        if (index > -1) {
          conversations[index] = updatedConversation;
        } else {
          conversations.unshift(updatedConversation);
        }

        return Object.assign({}, prev, {
          ActiveConversations: conversations
        });
      }
    });

    this.updateVisibleConversations();
  }

  updateVisibleConversations = async () => {
    const visibleConversations = await Bluebird.filter(
      this.state.allConversations,
      async ({ id }) => !(await Settings.isConversationCollapsed(id)),
      {
        concurrency: 5
      }
    ).map(({ id }) => id);

    this.setState({
      visibleConversations
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.allConversations !== this.state.allConversations) {
      this.updateVisibleConversations();
    }
  }

  handleToggleVisible = conversationID => {
    const shouldCollapse = this.state.visibleConversations.includes(
      conversationID
    )
      ? true
      : false;

    const visibleConversations = this.state.visibleConversations.slice();

    if (shouldCollapse) {
      visibleConversations.splice(visibleConversations.indexOf(conversationID));
    } else {
      visibleConversations.push(conversationID);
    }

    this.setState(
      {
        visibleConversations
      },
      async () => {
        await Settings.setCollapseConversation(conversationID, shouldCollapse);
      }
    );
  };

  renderConversation = (conversation, index) => {
    const isLast = this.state.visibleConversations.length - 1 === index;
    return (
      <React.Fragment key={conversation.id}>
        <ViewConversation
          conversation={conversation}
          isVisible={this.state.visibleConversations.includes(conversation.id)}
          colorScheme={conversation.board.color_scheme}
          onToggleVisible={this.handleToggleVisible}
          identity={conversation.user_identity}
        />
        <Spacer width={isLast ? SPACING.huge : SPACING.large} />
      </React.Fragment>
    );
  };

  render() {
    const { allConversations, visibleConversations } = this.state;

    return (
      <div
        className={classNames("DesktopChatContainer", {
          "DesktopChatContainer--hidden": _.isEmpty(allConversations)
        })}
      >
        {allConversations.map(this.renderConversation)}

        <style jsx>{`
          .DesktopChatContainer {
            position: fixed;
            bottom: 0;
            right: 0;
            pointer-events: none;
            display: flex;
          }

          .DesktopChatContainer--hidden {
            display: none;
          }
        `}</style>
      </div>
    );
  }
}

export const DesktopChat = ({ colorScheme, board = null }) => (
  <Query fetchPolicy="cache-and-network" query={Queries.ActiveConversations}>
    {({ data, subscribeToMore }) => (
      <Query
        query={Queries.ViewBoardConversation}
        skip={!board}
        fetchPolicy="cache-and-network"
        variables={{ boardID: board ? board.id : null }}
      >
        {({ data: boardConversationData = {} }) => (
          <RawDesktopChat
            subscribeToMore={subscribeToMore}
            colorScheme={colorScheme}
            boardConversation={_.get(
              boardConversationData,
              "Board.board_conversation"
            )}
            conversations={_.get(data || {}, "ActiveConversations") || []}
          />
        )}
      </Query>
    )}
  </Query>
);

export default DesktopChat;
