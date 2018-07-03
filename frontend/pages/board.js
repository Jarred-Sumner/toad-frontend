import { ErrorPage, LoadingPage } from "components/LoadingPage";
import { MAX_PAGE, MIN_PAGE, Paginator } from "components/Paginator";
import { BoardHeader } from "components/Post/BoardHeader";
import { ListThreadsContainer } from "components/Post/ListThreads";
import { buildBoardURL } from "lib/routeHelpers";
import _ from "lodash";
import { withRouter } from "next/router";
import React from "react";
import { compose, Query } from "react-apollo";
import Head from "Toads/components/head";
import {
  isError,
  isInitialLoading,
  withApollo
} from "../components/ApolloProvider";
import { Page } from "../components/Page";
import { Spacer } from "../components/Spacer";
import { SPACING } from "../lib/spacing";
import { Queries } from "../Queries";

class ViewBoardPage extends React.Component {
  state = {
    showCreatePost: false
  };

  handleHideCreatePost = () => this.setState({ showCreatePost: false });
  handleShowCreatePost = () => {
    this.setState({ showCreatePost: true }, () => {
      this.dropZoneRef.open();
    });
  };

  setDropzoneRef = dropZoneRef => (this.dropZoneRef = dropZoneRef);

  renderHeader = () => (
    <BoardHeader
      board={this.props.board}
      identity={this.props.identity}
      hideCreatePost={this.handleHideCreatePost}
      showCreatePost={this.handleShowCreatePost}
      isCreatePostVisible={this.state.showCreatePost}
      dropZoneRef={this.setDropzoneRef}
    />
  );

  render() {
    const { board, page } = this.props;
    const { color_scheme: colorScheme } = board;

    return (
      <Page board={board} renderSubheader={this.renderHeader}>
        <Head
          title={`${board.label} | Toads`}
          description={`/${board.id}/ - ${
            board.label
          } is on Toads, a new kind of imageboard.`}
          url={buildBoardURL(board.id)}
        />
        <Spacer height={SPACING.large} />
        <ListThreadsContainer
          identity={board.identity}
          board={board}
          page={page}
          colorScheme={colorScheme}
        >
          <Paginator page={page} colorScheme={colorScheme} boardId={board.id} />
        </ListThreadsContainer>
      </Page>
    );
  }
}

export const ViewBoardPageContainer = compose(
  withApollo,
  withRouter
)(({ url, ...otherProps }) => {
  // Ensure page is between MIN_PAGE and MAX_PAGE. If you try to go to page 9999, it'll just make it 10, and if you try to go < page 1, it'll just make it 1.
  const page = Math.min(
    Math.max(parseInt(url.query.p || MIN_PAGE, 10), MIN_PAGE),
    MAX_PAGE
  );
  return (
    <Query
      notifyOnNetworkStatusChange
      fetchPolicy="cache-and-network"
      query={Queries.ViewBoard}
      variables={{ id: url.query.board }}
    >
      {({ data = null, networkStatus }) => {
        const board = data ? _.get(data, "Board") : null;
        if (!board && isInitialLoading(networkStatus)) {
          return <LoadingPage>Toading /{url.query.board}/...</LoadingPage>;
        } else if (!board && isError(networkStatus)) {
          return <ErrorPage />;
        } else if (board) {
          return (
            <ViewBoardPage
              {...otherProps}
              board={board}
              identity={board.identity}
              page={page}
              networkStatus={networkStatus}
            />
          );
        } else {
          return <ErrorPage>Four Oh Four.</ErrorPage>;
        }
      }}
    </Query>
  );
});

export default ViewBoardPageContainer;
