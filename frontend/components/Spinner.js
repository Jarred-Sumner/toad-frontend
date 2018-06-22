import SpinKit from "react-spinkit";
import { defaultProps } from "recompose";
import { COLORS } from "../lib/colors";
import { SPACING } from "../lib/spacing";

export const Spinner = defaultProps({
  name: "double-bounce",
  color: COLORS.black,
  size: SPACING.normal
})(SpinKit);

export default Spinner;
