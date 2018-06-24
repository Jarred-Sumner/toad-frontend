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
    const { board, threadID, identity } = this.props;
    const { colorScheme } = board;

    return (
      <Page renderSubheader={this.renderHeader}>
        <Spacer height={SPACING.large} />
        <ViewThreadContainer
          board={board}
          threadID={threadID}
          identity={identity}
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
