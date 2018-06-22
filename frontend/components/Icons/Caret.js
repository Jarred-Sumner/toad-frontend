import React from "react";
import { COLORS } from "../../lib/colors";

export default ({
  width = "12px",
  height = "6px",
  fill = COLORS.background
}) => (
  <svg width={width} height={height} viewBox="0 0 12 6">
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g transform="translate(-61.000000, -122.000000)" fill={fill}>
        <path d="M67.6993334,122.813996 L73,128 L61,128 L66.3006666,122.813996 C66.6893469,122.433724 67.3106531,122.433724 67.6993334,122.813996 Z" />
      </g>
    </g>
  </svg>
);
