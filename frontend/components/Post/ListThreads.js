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
    const { threads, board, colorScheme } = this.props;

    return (
      <div className="Container">
        {threads.map(thread => (
          <div className="PageWrapper PostWrapper" key={thread.id}>
            <Spacer height={SPACING.large} />
            <Post
              colorScheme={colorScheme}
              board={board}
              post={thread}
              comments={thread.replies}
            />
            <Spacer height={SPACING.large} />
          </div>
        ))}

        <style jsx>{`
          .PostWrapper {
            width: 100%;
            border-bottom: 1px solid ${COLORS.offwhite};
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

export const ListThreadsContainer = ({ board, ...otherProps }) => {
  return (
    <Query query={Queries.ViewThreads} variables={{ id: board.id }}>
      {({ data, networkStatus }) => {
        const threads = _.get(data, "Board.threads");

        if (_.isArray(threads)) {
          return <ListThreads board={board} {...otherProps} />;
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
