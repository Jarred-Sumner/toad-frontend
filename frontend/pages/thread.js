import { ErrorPage, LoadingPage } from "components/LoadingPage";
import { ThreadHeader } from "components/Post/ThreadHeader";
import { ViewThreadContainer } from "components/Post/ViewThread";
import _ from "lodash";
import { withRouter } from "next/router";
import React from "react";
import { compose, Query } from "react-apollo";
import { isInitialLoading, withApollo } from "../components/ApolloProvider";
import { Page } from "../components/Page";
import { Queries } from "../Queries";

class ViewThreadPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showCommentForm: props.showCommentForm
    };
  }

  toggleReplyToThread = () =>
    this.setState({ showCommentForm: !this.state.showCommentForm });

  setDropzoneRef = dropZoneRef => (this.dropZoneRef = dropZoneRef);

  handleDismissNewComment = () => this.setState({ showCommentForm: false });

  renderHeader = () => {
    const { board, identity } = this.props;
    return (
      <ThreadHeader
        board={board}
        identity={identity}
        onClick={this.toggleReplyToThread}
      />
    );
  };

  render() {
    const { board, threadID, identity, colorScheme, initialFocus } = this.props;
    const { showCommentForm } = this.state;

    return (
      <Page board={board} renderSubheader={this.renderHeader}>
        <ViewThreadContainer
          board={board}
          threadID={threadID}
          identity={identity}
          showCommentForm={showCommentForm}
          colorScheme={colorScheme}
          initialFocus={initialFocus}
          onDismissCommentForm={this.handleDismissNewComment}
        />
      </Page>
    );
  }
}

export const ViewThreadPageContainer = withApollo(
  ({ url: { query }, ...otherProps }) => {
    return (
      <Query
        notifyOnNetworkStatusChange
        fetchPolicy="cache-and-network"
        query={Queries.ViewBoard}
        variables={{ id: query.board }}
      >
        {({ data = null, networkStatus }) => {
          const board = _.get(data, "Board");
          if (!board && isInitialLoading(networkStatus)) {
            return <LoadingPage>Toading /{query.board}/...</LoadingPage>;
          } else if (!board && isError(networkStatus)) {
            return <ErrorPage />;
          } else if (board) {
            return (
              <ViewThreadPage
                {...otherProps}
                board={board}
                identity={board.identity}
                threadID={query.id}
                onDismissCommentForm={this.handleDismissNewComment}
                showCommentForm={!!query.r}
                colorScheme={board.color_scheme}
                initialFocus={query.h}
                networkStatus={networkStatus}
              />
            );
          } else {
            return <ErrorPage>I CANT FIND {query.board}!</ErrorPage>;
          }
        }}
      </Query>
    );
  }
);

export default ViewThreadPageContainer;
