import _ from "lodash";
import React from "react";
import { Query } from "react-apollo";
import { SPACING } from "Toads/lib/spacing";
import { Queries } from "Toads/Queries";
import { isInitialLoading } from "../ApolloProvider";
import { Post } from "../Post";
import { Spacer } from "../Spacer";
import { Spinner } from "../Spinner";
import { MOBILE_BEAKPOINT } from "lib/mobile";

class ListThreads extends React.PureComponent {
  static defaultProps = {
    threads: []
  };

  render() {
    const { threads, board, colorScheme, identity, children } = this.props;

    return (
      <div className="Container">
        {threads.map(thread => (
          <React.Fragment key={thread.id}>
            <div className="PageWrapper PostWrapper" key={thread.id}>
              <div className="ClearFix">
                <Post
                  colorScheme={colorScheme}
                  board={board}
                  identity={identity}
                  post={thread}
                  minimized
                  comments={thread.replies}
                />
              </div>
            </div>
            <Spacer height={SPACING.medium} />
            <Spacer divider width="100%" height={1} />
            <Spacer height={SPACING.medium} />
          </React.Fragment>
        ))}

        {children && <div className="PageWrapper">{children}</div>}

        <style jsx>{`
          .PostWrapper {
            width: 100%;
          }

          .PageWrapper {
            display: block;
            padding-left: ${SPACING.huge}px;
          }

          .ClearFix:after {
            content: " "; /* Older browser do not support empty content */
            visibility: hidden;
            display: block;
            height: 0;
            clear: both;
          }

          @media (max-width: ${MOBILE_BEAKPOINT}px) {
            .PageWrapper {
              padding-left: 0;
              padding-right: 0;
            }
          }
        `}</style>
      </div>
    );
  }
}

export const ListThreadsContainer = ({ board, page, ...otherProps }) => {
  return (
    <Query
      fetchPolicy="cache-and-network"
      query={Queries.ViewThreads}
      variables={{ id: board.id, page }}
    >
      {({ data, networkStatus }) => {
        const threads = _.get(data, "Board.threads");

        if (_.isArray(threads)) {
          return (
            <ListThreads threads={threads} board={board} {...otherProps} />
          );
        } else if (
          !threads &&
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

export default ListThreadsContainer;
