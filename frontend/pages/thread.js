import { ErrorPage, LoadingPage } from "components/LoadingPage";
import { BoardTitle } from "components/Post/BoardHeader";
import { ViewThreadContainer } from "components/Post/ViewThread";
import _ from "lodash";
import { withRouter } from "next/router";
import React from "react";
import { compose, Query } from "react-apollo";
import { isInitialLoading, withApollo } from "../components/ApolloProvider";
import { Gradient, GRADIENT_COLORS } from "../components/Gradient";
import { Page } from "../components/Page";
import { Spacer } from "../components/Spacer";
import { SPACING } from "../lib/spacing";
import { Queries } from "../Queries";
import { Text } from "components/Text";
import { Author } from "components/Post/Author";
import { COLORS } from "lib/colors";
import { BoardChat } from "components/Chat/BoardChat";
import { ThreadHeader } from "components/Post/ThreadHeader";

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
      <Page renderSubheader={this.renderHeader}>
        <ViewThreadContainer
          board={board}
          threadID={threadID}
          identity={identity}
          showCommentForm={showCommentForm}
          colorScheme={colorScheme}
          initialFocus={initialFocus}
          onDismissCommentForm={this.handleDismissNewComment}
        />

        <BoardChat board={board} colorScheme={colorScheme} />
      </Page>
    );
  }
}

export const ViewThreadPageContainer = compose(
  withApollo,
  withRouter
)(({ url, ...otherProps }) => {
  return (
    <Query
      notifyOnNetworkStatusChange
      fetchPolicy="cache-and-network"
      query={Queries.ViewBoard}
      variables={{ id: url.query.board }}
    >
      {({ data = null, networkStatus }) => {
        const board = _.get(data, "Board");
        if (!board && isInitialLoading(networkStatus)) {
          return <LoadingPage>Toading /{url.query.board}/...</LoadingPage>;
        } else if (!board && isError(networkStatus)) {
          return <ErrorPage />;
        } else if (board) {
          return (
            <ViewThreadPage
              {...otherProps}
              board={board}
              identity={board.identity}
              threadID={url.query.id}
              onDismissCommentForm={this.handleDismissNewComment}
              showCommentForm={!!url.query.r}
              colorScheme={board.color_scheme}
              initialFocus={url.query.h}
              networkStatus={networkStatus}
            />
          );
        } else {
          return <ErrorPage>I CANT FIND {url.query.board}!</ErrorPage>;
        }
      }}
    </Query>
  );
});

export default ViewThreadPageContainer;
