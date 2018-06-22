import React from "react";

export class AddPhotoIcon extends React.PureComponent {
  render() {
    const { width, height, color } = this.props;

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 100 100"
      >
        <ellipse fill={color} cx="49.77" cy="57.17" rx="12.94" ry="12.95" />
        <path
          fill={color}
          d="M71.58 63.23a18.75 18.75 0 0 1 12-.36A2 2 0 0 0 86.23 61V36a2 2 0 0 0-2-2h-8.67a2.06 2.06 0 0 1-1.69-.9l-9-13.21a2 2 0 0 0-1.68-.9H36.33a2.06 2.06 0 0 0-1.69.9l-9 13.21A2 2 0 0 1 24 34h-8.77a2 2 0 0 0-2 2v45a2 2 0 0 0 2 2h42.1a2 2 0 0 0 2-2.06 18.66 18.66 0 0 1 .3-3.34 2 2 0 0 0-2.7-2.16 19.58 19.58 0 1 1 12.37-19.7A19.39 19.39 0 0 1 69 61a2 2 0 0 0 2.58 2.23zM60.23 30a1 1 0 0 1-1 1h-19a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h19a1 1 0 0 1 1 1z"
        />
        <path
          fill={color}
          d="M78.16 68.46a12.43 12.43 0 1 0 12.43 12.43 12.43 12.43 0 0 0-12.43-12.43zm6.78 13.24a1 1 0 0 1-1 1H81a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1h-1.65a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1h-3a1 1 0 0 1-1-1v-1.62a1 1 0 0 1 1-1h3a1 1 0 0 0 1-1v-3a1 1 0 0 1 1-1H79a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h3a1 1 0 0 1 1 1z"
        />
      </svg>
    );
  }
}

export default AddPhotoIcon;
