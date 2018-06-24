import React from "react";
import classNames from "classnames";
import { SPACING } from "../lib/spacing";
import { GRADIENT_COLORS } from "./Gradient";
import { Text } from "./Text";
import { COLORS } from "../lib/colors";
import { Spacer } from "./Spacer";

export class Button extends React.PureComponent {
  render() {
    const {
      children,
      disabled,
      color,
      onClick,
      icon,
      pressed,
      pending
    } = this.props;

    return (
      <div
        onClick={disabled ? undefined : onClick}
        className={classNames("Button", {
          "Button--pressed": pressed,
          "Button--disabled": disabled,
          "Button--pending": pending,
          "Button--blue": color === GRADIENT_COLORS.blue,
          "Button--black": color === COLORS.black,
          "Button--white": color === COLORS.white,
          "Button--purple_red": color === GRADIENT_COLORS.purple_red,
          "Button--pink": color === GRADIENT_COLORS.pink,
          "Button--slate": color === GRADIENT_COLORS.slate,
          "Button--red": color === GRADIENT_COLORS.red,
          "Button--green": color === GRADIENT_COLORS.green
        })}
      >
        {icon && (
          <React.Fragment>
            {icon}
            {!!children && <Spacer width={SPACING.small} />}
          </React.Fragment>
        )}
        {!!children && (
          <Text
            letterSpacing="0px"
            lineHeight="14px"
            weight="semiBold"
            size="14px"
            color="inherit"
          >
            {children}
          </Text>
        )}

        <style jsx>{`
          .Button {
            display: flex;
            align-self: flex-start;
            padding: ${SPACING.ten}px ${SPACING.normal}px;
            align-items: center;
            justify-content: center;
            transition: opacity 0.05s linear;
            border-radius: 4px;
            border: 1px solid white;
            cursor: pointer;
          }

          .Button--white {
            background-color: white;
            background-image: linear-gradient(0deg, #fafafa 0%, #fcfcfc 100%);
            border-color: ${COLORS.medium_white};
            color: ${COLORS.black};
          }

          .Button--black {
            background-color: ${COLORS.black};
            border-color: #333;
            color: ${COLORS.white};
          }

          .Button--pressed,
          .Button:hover {
            opacity: 0.97;
          }

          .Button--blue {
            background-color: ${COLORS[GRADIENT_COLORS.blue]};
            border-color: #431a5a;
            color: white;
          }
          .Button--purple_red {
            background-color: ${COLORS[GRADIENT_COLORS.purple_red]};
            border-color: #651a33;
            color: white;
          }
          .Button--pink {
            background-color: ${COLORS[GRADIENT_COLORS.pink]};
            border-color: #aa346f;
            color: white;
          }
          .Button--slate {
            background-color: ${COLORS[GRADIENT_COLORS.slate]};
            border-color: #666;
            color: white;
          }
          .Button--red {
            background-color: ${COLORS[GRADIENT_COLORS.red]};
            border-color: #c53a08;
            color: white;
          }
          .Button--green {
            background-color: ${COLORS[GRADIENT_COLORS.green]};
            color: white;
          }

          .Button-disabled,
          .Button--pending,
          .Button--pending:hover {
            opacity: 0.75;
          }

          .Button--pending,
          .Button--pending:hover {
            cursor: busy;
          }

          .Button--disabled {
            cursor: disabled;
          }
        `}</style>
      </div>
    );
  }
}
