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
import { PageHeader } from "../PageHeader";

export const ThreadHeader = ({
  isCreatePostVisible,
  showCreatePost,
  board,
  dropZoneRef,
  onClick,
  hideCreatePost,
  ...otherProps
}) => (
  <PageHeader {...otherProps} board={board}>
    <Button
      onClick={onClick}
      color={COLORS.white}
      icon={<Icon icon={ICONS.plus} color={COLORS.black} />}
    >
      Reply
    </Button>
    <Spacer width={SPACING.normal} />
  </PageHeader>
);
