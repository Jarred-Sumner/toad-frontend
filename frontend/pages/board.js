import React from "react";
import { Page } from "../components/Page";
import { Post } from "../components/Post";
import { Spacer } from "../components/Spacer";
import { SPACING } from "../lib/spacing";
import { COLORS } from "../lib/colors";
import { Gradient, GRADIENT_COLORS } from "../components/Gradient";
import { Text } from "../components/Text";
import GreenDot from "../components/GreenDot";
import { Button } from "../components/Button";
import { BOARD_LIST } from "../components/NavHeader";
import { CreatePostForm } from "../components/Post/CreatePost";
import { Icon, ICONS } from "../components/Icon";
import {
  withApollo,
  isInitialLoading,
  isReady,
  isError
} from "../components/ApolloProvider";
import { Query, compose } from "react-apollo";
import { LoadingPage, ErrorPage } from "components/LoadingPage";
import _ from "lodash";
import { ListThreadsContainer } from "components/Post/ListThreads";
import { Queries } from "../Queries";
import { withRouter } from "next/router";
import { BoardHeader } from "components/Post/BoardHeader";

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
    const { board } = this.props;
    const { color_scheme: colorScheme } = board;

    return (
      <Page renderSubheader={this.renderHeader}>
        <Spacer height={SPACING.large} />
        <ListThreadsContainer
          identity={board.identity}
          board={board}
          colorScheme={colorScheme}
        />
      </Page>
    );
  }
}

export const ViewBoardPageContainer = compose(
  withApollo,
  withRouter
)(({ url, ...otherProps }) => {
  return (
    <Query
      notifyOnNetworkStatusChange
      query={Queries.ViewBoard}
      variables={{ id: url.query.board }}
    >
      {({ data = null, networkStatus }) => {
        const board = data ? _.get(data, "Board") : null;
        if (!board && isInitialLoading(networkStatus)) {
          return <LoadingPage>Toading /{url.params.board}/...</LoadingPage>;
        } else if (!board && isError(networkStatus)) {
          return <ErrorPage />;
        } else if (board) {
          return (
            <ViewBoardPage
              {...otherProps}
              board={board}
              identity={board.identity}
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
