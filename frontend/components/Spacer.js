import React from "react";
import classNames from "classnames";
import { COLORS } from "../lib/colors";

export class Spacer extends React.PureComponent {
  render() {
    const { width, height, inline, divider, white } = this.props;
    return (
      <div
        className={classNames("Spacer", {
          "Spacer--inline": inline,
          "Spacer--divider": !!divider,
          "Spacer--white": white
        })}
      >
        <style jsx>{`
          .Spacer {
            content: "";
            display: block;
            width: ${width || 1}px;
            height: ${height || 1}px;
          }

          .Spacer--divider {
            background-color: ${COLORS.offwhite};
            width: ${width ? "100%" : 1}px;
            width: ${height ? "100%" : 0}px;
          }

          .spacer--white: {
            background-color: ${COLORS.white};
          }

          .Spacer--inline {
            display: inline-block;
          }
        `}</style>
      </div>
    );
  }
}

export default Spacer;
