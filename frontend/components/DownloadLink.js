import React from "react";
import { detect } from "detect-browser";
import _ from "lodash";

export const isInternetExplorer = _.memoize(() => {
  const browser = detect();

  return browser.name === "ie";
});

export class DownloadLink extends React.PureComponent {
  render() {
    const { url, children, ...otherProps } = this.props;
    if (isInternetExplorer()) {
      return (
        <a {...otherProps} target="_blank" href={url}>
          {children}
        </a>
      );
    } else {
      return (
        <a {...otherProps} download href={url}>
          {children}
        </a>
      );
    }
  }
}
