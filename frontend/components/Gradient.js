import React from "react";
import classNames from "classnames";

export const GRADIENT_COLORS = {
  blue: `blue`,
  purple_red: `purple_red`,
  pink: `pink`,
  slate: `slate`,
  red: `red`,
  green: `green`
};
``;
export class Gradient extends React.Component {
  render() {
    const { children, color } = this.props;

    return (
      <div
        className={classNames("Gradient", {
          "Gradient--blue": GRADIENT_COLORS.blue === color,
          "Gradient--purple_red": GRADIENT_COLORS.purple_red === color,
          "Gradient--pink": GRADIENT_COLORS.pink === color,
          "Gradient--red": GRADIENT_COLORS.red === color,
          "Gradient--green": GRADIENT_COLORS.green === color,
          "Gradient--slate": GRADIENT_COLORS.slate === color
        })}
      >
        {children}

        <style jsx>{`
          .Gradient {
            display: block;
            width: 100%;
            height: auto;
          }

          .Gradient--blue {
            background-image: linear-gradient(45deg, #5b247a 0%, #1bcedf 100%);
          }
          .Gradient--purple_red {
            background-image: linear-gradient(
              -135deg,
              #622774 0%,
              #c53364 100%
            );
          }
          .Gradient--pink {
            background-image: linear-gradient(45deg, #ff7676 0%, #f54ea2 100%);
          }
          .Gradient--slate {
            background-image: linear-gradient(45deg, #656060 0%, #333333 100%);
          }
          .Gradient--red {
            background-image: linear-gradient(
              -123deg,
              #db0b73 0%,
              #ff4a0a 100%
            );
          }
          .Gradient--green {
            background-image: linear-gradient(44deg, #57ca84 0%, #194f68 100%);
          }
        `}</style>
      </div>
    );
  }
}

export default Gradient;
