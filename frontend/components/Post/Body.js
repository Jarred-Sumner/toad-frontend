import React from "react";
import { Text } from "../Text";
import { defaultProps } from "recompose";

// This will have all the formatting stuff later -- greentext, linkifying, etc.
export const Body = defaultProps({
  lineHeight: "18px",
  wrap: true
})(Text);

export default Body;
