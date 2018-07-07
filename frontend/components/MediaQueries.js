import RawMediaQuery from "react-responsive";
import { defaultProps } from "recompose";
import { MEDIUM_BEAKPOINT, MOBILE_BEAKPOINT } from "lib/mobile";

export const MediaQuery = Component => props => (
  <RawMediaQuery maxWidth={MOBILE_BEAKPOINT}>
    {matches => <Component isMobile={matches} {...props} />}
  </RawMediaQuery>
);
