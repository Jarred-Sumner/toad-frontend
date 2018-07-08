import React from "react";
import Typist from "react-typist";
import "react-typist/dist/Typist";
import { defaultProps } from "recompose";
import { COLORS } from "../../lib/colors";
import { Settings } from "../../lib/Settings";
import { SPACING } from "../../lib/spacing";
import { Button } from "../Button";
import { BoardPresence } from "../Chat/BoardPresence";
import { Gradient, GRADIENT_COLORS } from "../Gradient";
import { Icon, ICONS } from "../Icon";
import { Spacer } from "../Spacer";
import { Text } from "../Text";
import { normalizeAnonymousName } from "./Author";
import { CreatePostForm } from "./CreatePost";
import ToadLogo from "../ToadLogo";
import Countdown from "react-countdown-now";
import moment from "moment";
import { Link } from "Toads/routes";
import { MEDIUM_BEAKPOINT } from "lib/mobile";
import PageHeader from "../PageHeader";

const NewPostButton = ({ classes, onPress }) => (
  <Button
    onClick={onPress}
    color={COLORS.white}
    icon={<Icon icon={ICONS.camera} color={COLORS.black} />}
  >
    New thread
  </Button>
);

export const BoardHeader = ({
  isCreatePostVisible,
  showCreatePost,
  board,
  dropZoneRef,
  hideCreatePost,
  ...otherProps
}) => (
  <PageHeader {...otherProps} board={board}>
    <NewPostButton pressed={isCreatePostVisible} onPress={showCreatePost} />
    <Spacer width={SPACING.normal} />
    {isCreatePostVisible && (
      <CreatePostForm
        boardId={board.id}
        identity={board.identity}
        dropZoneRef={dropZoneRef}
        colorScheme={board.color_scheme}
        onDismiss={hideCreatePost}
      />
    )}
  </PageHeader>
);
