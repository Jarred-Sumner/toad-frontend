import React from "react";
import { COLORS } from "Toads/lib/colors";
import { SPACING } from "Toads/lib/spacing";
import { Spacer } from "../Spacer";
import { Post } from "../Post";
import { Query } from "react-apollo";
import { Queries } from "Toads/Queries";
import { isInitialLoading } from "../ApolloProvider";
import { Spinner } from "../Spinner";
import _ from "lodash";
import { Text } from "../Text";
import Head from "../head";
import { CreateCommentForm } from "./CreateComment";
import { buildPostDOMID } from "lib/routeHelpers";
import { Router } from "Toads/routes";
import requestIdleCallback from "ric-shim";

class ViewThread extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showBottomCommentForm: props.thread.reply_count > 7
    };
  }

  handleDismissBottomComment = () =>
    this.setState({ showBottomCommentForm: false });

  componentDidMount() {
    if (this.props.initialFocus) {
      requestIdleCallback(this.scrollFocusElementIntoView);
    }
  }

  scrollFocusElementIntoView = () => {
    const focusElement = document.querySelector(
      `#${buildPostDOMID(this.props.initialFocus)}`
    );

    if (focusElement) {
      focusElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start"
      });

      Router.replaceRoute(
        "thread",
        {
          board: this.props.board.id,
          id: this.props.thread.id
        },
        {
          shallow: true
        }
      );
    }
  };

  componentDidUpdate(prevProps) {
    if (
      typeof window !== "undefined" &&
      this.props.initialFocus !== prevProps.initialFocus &&
      this.props.initialFocus
    ) {
      requestIdleCallback(this.scrollFocusElementIntoView);
    }
  }

  render() {
    const {
      thread,
      board,
      colorScheme,
      identity,
      showCommentForm
    } = this.props;
    const { showBottomCommentForm } = this.state;

    return (
      <div className="Container">
        <Head
          title={`${_.truncate(thread.body || "Thread", {
            length: 30
          })} | /${board.id}/ on Toads`}
          description={
            thread.body ? _.truncate(thread.body, { length: 300 }) : null
          }
          ogImage={thread.attachment.url}
          ogImageWidth={_.get(thread, "attachment.metadata.width")}
          ogImageHeight={_.get(thread, "attachment.metadata.height")}
        />
        <div className="PageWrapper PostWrapper" key={thread.id}>
          {showCommentForm && (
            <React.Fragment>
              <Spacer height={SPACING.large} />
              <CreateCommentForm
                postId={thread.id}
                draggable={false}
                boardId={board.id}
                title="Post in thread"
                colorScheme={colorScheme}
                identity={identity}
                autoFocus
                onDismiss={this.props.onDismissCommentForm}
              />
            </React.Fragment>
          )}

          <Spacer height={SPACING.large} />
          <div className="ClearFix">
            <Post
              colorScheme={colorScheme}
              board={board}
              post={thread}
              minimized={false}
              identity={identity}
              comments={thread.replies}
            />
          </div>
          <Spacer height={SPACING.large} />

          {showBottomCommentForm && (
            <React.Fragment>
              <CreateCommentForm
                postId={thread.id}
                draggable={false}
                boardId={board.id}
                colorScheme={colorScheme}
                identity={identity}
                onDismiss={this.handleDismissBottomComment}
              />

              <Spacer height={SPACING.large} />
            </React.Fragment>
          )}
        </div>

        <style jsx>{`
          .PostWrapper {
            width: 100%;
            border-bottom: 1px solid ${COLORS.offwhite};
          }

          .ClearFix:after {
            content: " "; /* Older browser do not support empty content */
            visibility: hidden;
            display: block;
            height: 0;
            clear: both;
          }

          .PageWrapper {
            display: block;
            padding-left: ${SPACING.huge}px;
          }
        `}</style>
      </div>
    );
  }
}

export const ViewThreadContainer = ({
  board,
  colorScheme,
  initialFocus,
  threadID,
  ...otherProps
}) => {
  return (
    <Query
      query={Queries.ViewThread}
      fetchPolicy="cache-and-network"
      variables={{ boardID: board.id, threadID: threadID }}
    >
      {({ data, networkStatus }) => {
        const thread = _.get(data, "Board.thread");
        if (thread) {
          return (
            <ViewThread
              colorScheme={colorScheme}
              board={board}
              initialFocus={initialFocus}
              thread={thread}
              {...otherProps}
            />
          );
        } else if (
          !thread &&
          networkStatus === isInitialLoading(networkStatus)
        ) {
          return <Spinner />;
        } else {
          return null;
        }
      }}
    </Query>
  );
};

export default ViewThreadContainer;
