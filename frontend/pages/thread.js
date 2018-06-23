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
  isReady
} from "../components/ApolloProvider";
import { Query, compose } from "react-apollo";
import { LoadingPage, ErrorPage } from "components/LoadingPage";
import _ from "lodash";
import { ListThreadsContainer } from "components/Post/ListThreads";
import { Queries } from "../Queries";
import { withRouter } from "next/router";
import { BoardHeader, BoardTitle } from "components/Post/BoardHeader";
import { ViewThreadContainer } from "components/Post/ViewThread";

class ViewThreadPage extends React.Component {
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

  renderHeader = () => {
    const { color_scheme: colorScheme, id, label } = this.props.board;
    return (
      <Gradient color={GRADIENT_COLORS[colorScheme]}>
        <div className="Header">
          <BoardTitle>
            /{id}/ - {label}
          </BoardTitle>
        </div>

        <style jsx>{`
          .Header {
            padding: ${SPACING.normal}px ${SPACING.huge}px;
          }
        `}</style>
      </Gradient>
    );
  };

  render() {
    const { board, threadID } = this.props;
    const { colorScheme } = board;

    return (
      <Page renderSubheader={this.renderHeader}>
        <Spacer height={SPACING.large} />
        <ViewThreadContainer
          board={board}
          threadID={threadID}
          colorScheme={colorScheme}
        />
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
      query={Queries.ViewBoard}
      variables={{ id: url.query.board }}
    >
      {({ data = null, networkStatus }) => {
        const board = _.get(data, "Board");
        if (!board && isInitialLoading(networkStatus)) {
          return <LoadingPage>Toading /{url.params.board}/...</LoadingPage>;
        } else if (!board && isError(networkStatus)) {
          return <ErrorPage />;
        } else if (board) {
          return (
            <ViewThreadPage
              {...otherProps}
              board={data.Board || null}
              threadID={url.query.id}
              networkStatus={networkStatus}
            />
          );
        } else {
          return <ErrorPage>I CANT FIND {url.params.board}!</ErrorPage>;
        }
      }}
    </Query>
  );
});

export default ViewThreadPageContainer;
