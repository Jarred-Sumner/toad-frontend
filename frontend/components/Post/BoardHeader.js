import React from "react";
import { Post } from "../Post";
import { Spacer } from "../Spacer";
import { SPACING } from "../../lib/spacing";
import { COLORS } from "../../lib/colors";
import { Gradient, GRADIENT_COLORS } from "../Gradient";
import { Text } from "../Text";
import GreenDot from "../GreenDot";
import { Button } from "../Button";
import { BOARD_LIST } from "../NavHeader";
import { CreatePostForm } from "./CreatePost";
import { Icon, ICONS } from "../Icon";
import { withApollo } from "../ApolloProvider";
import { defaultProps } from "recompose";

const NewPostButton = ({ classes, onPress }) => (
  <Button
    onClick={onPress}
    color={COLORS.white}
    icon={<Icon icon={ICONS.camera} color={COLORS.black} />}
  >
    New thread
  </Button>
);

export const BoardTitle = defaultProps({
  size: "24px",
  letterSpacing: "0.33px",
  weight: "bold",
  color: COLORS.white
})(Text);

export class BoardHeader extends React.PureComponent {
  render() {
    const {
      board,
      hideCreatePost,
      isCreatePostVisible,
      showCreatePost,
      dropZoneRef
    } = this.props;
    if (!board) {
      return null;
    }

    const {
      online_count: onlineCount = 12,
      color_scheme: colorScheme,
      id,
      label
    } = board;

    const color = COLORS[colorScheme];

    return (
      <Gradient color={GRADIENT_COLORS[colorScheme]}>
        <div className="Header">
          <BoardTitle>
            /{id}/ - {label}
          </BoardTitle>
          <Spacer height={SPACING.normal} />
          <div className="OnlineNowBar">
            <NewPostButton
              pressed={isCreatePostVisible}
              onPress={showCreatePost}
            />
            {isCreatePostVisible && (
              <CreatePostForm
                boardId={id}
                dropZoneRef={dropZoneRef}
                onDismiss={hideCreatePost}
              />
            )}
            <Spacer width={SPACING.normal} />
            <GreenDot />
            <Spacer width={SPACING.small} />
            <Text
              size="14px"
              weight="bold"
              letterSpacing="0.22px"
              color={COLORS.white}
            >
              <Text underline weight="inherit" color="inherit" size="inherit">
                {onlineCount} toads
              </Text>
              &nbsp;online now
            </Text>
          </div>
        </div>

        <style jsx>{`
          .Header {
            padding-left: ${SPACING.huge}px;
            padding-right: ${SPACING.huge}px;
            padding-top: ${SPACING.normal}px;
            padding-bottom: ${SPACING.normal}px;
            position: relative;
          }

          .OnlineNowBar {
            display: flex;
            align-items: center;
          }
        `}</style>
      </Gradient>
    );
  }
}

export default BoardHeader;
