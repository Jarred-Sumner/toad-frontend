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

class ListThreads extends React.PureComponent {
  static defaultProps = {
    threads: []
  };

  render() {
    const { threads, board, colorScheme, identity } = this.props;

    return (
      <div className="Container">
        {threads.map(thread => (
          <React.Fragment>
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
        `}</style>
      </div>
    );
  }
}

export const ListThreadsContainer = ({ board, ...otherProps }) => {
  return (
    <Query
      fetchPolicy="cache-and-network"
      query={Queries.ViewThreads}
      variables={{ id: board.id }}
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
          return (
            <Text size="14px" weight="bold">
              Something bad happened!
            </Text>
          );
        }
      }}
    </Query>
  );
};

export default ListThreadsContainer;
