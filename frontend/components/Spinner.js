import SpinKit from "react-spinkit";
import { defaultProps } from "recompose";
import { COLORS } from "../lib/colors";
import { SPACING } from "../lib/spacing";
import "react-spinkit/css/base.css";
import "react-spinkit/css/loaders-css.css";
import "react-spinkit/css/fade-in.css";
import "react-spinkit/css/double-bounce.css";

export const Spinner = defaultProps({
  name: "double-bounce",
  color: COLORS.black,
  size: SPACING.normal
})(SpinKit);

export default Spinner;
