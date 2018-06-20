import React from "react";
import classNames from "classnames";
import { SPACING } from "../lib/spacing";
import { GRADIENT_COLORS } from "./Gradient";
import { Text } from "./Text";
import { COLORS } from "../lib/colors";

export class Button extends React.PureComponent {
  render() {
    const { children, color } = this.props;
    return (
      <div
        className={classNames("Button", {
          "Button--blue": color === GRADIENT_COLORS.blue,
          "Button--white": color === COLORS.white,
          "Button--purple_red": color === GRADIENT_COLORS.purple_red,
          "Button--pink": color === GRADIENT_COLORS.pink,
          "Button--slate": color === GRADIENT_COLORS.slate,
          "Button--red": color === GRADIENT_COLORS.red,
          "Button--green": color === GRADIENT_COLORS.green
        })}
      >
        <Text letterSpacing="0.3px" size="16px" color="inherit">
          {children}
        </Text>

        <style jsx>{`
          .Button {
            display: flex;
            align-self: flex-start;
            padding: ${SPACING.small}px ${SPACING.normal}px;
            align-items: center;
            justify-content: center;
            transition: opacity 0.05s linear;
            border-radius: 4px;
            border: 1px solid white;
          }

          .Button--white {
            background-color: white;
            border-color: #F0F0F0;
            color: ${COLORS.black}px;
          }

          .Button:hover {
            cursor: pointer;
            opacity: 0.9;
          }

          .Button--blue {
            background-color: #5b247a;
            border-color: #431A5A;
            color: white;
          }
          .Button--purple_red {
            background-color: #c53364;
            border-color: #651A33;
            color: white;
          }
          .Button--pink {
            background-color: #f54ea2;
            border-color: #AA346F;
            color: white;
          }
          .Button--slate {
            background-color: #333333;
            border-color: #666;
            color: white;
          }
          .Button--red {
            background-color: #ff4a0a;
            border-color: #C53A08;
            color: white;
          }
          .Button--green {
            background-color: #194f68;
            border-color: darken
            color: white;
          }
        `}</style>
      </div>
    );
  }
}
