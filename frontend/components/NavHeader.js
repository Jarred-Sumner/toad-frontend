import React from "react";
import { Link } from "../routes";
import { Text } from "./Text";
import { SPACING } from "../lib/spacing";
import { COLORS } from "../lib/colors";
import { Spacer } from "./Spacer";

export const BOARD_LIST = [
  {
    label: "Tech",
    id: "tech"
  },
  {
    label: "Code",
    id: "code"
  },
  {
    label: "Fortnite",
    id: "fortnite"
  },
  {
    label: "Cooking",
    id: "cooking"
  }
];

export class NavHeader extends React.PureComponent {
  render() {
    return (
      <nav className="NavHeader">
        <div className="BrandContainer">
          <img
            className="BrandImage"
            src="/static/Header/brand.png"
            srcSet="/static/Header/brand.png 1x, /static/Header/brand@2x.png 2x, /static/Header/brand@3x.png 3x"
          />

          <Spacer width={SPACING.large} />
        </div>

        <div className="BoardsList">
          {BOARD_LIST.map(({ id, label }) => (
            <React.Fragment key={id}>
              <Link route="board" params={{ board: id }}>
                <a>
                  <Text letterSpacing="0.2px" underline>
                    {label}
                  </Text>
                </a>
              </Link>
              <Spacer width={SPACING.normal} />
            </React.Fragment>
          ))}
        </div>

        {/* TODO */}
        <div className="AccountActions" />

        <style jsx>{`
          .NavHeader {
            display: flex;
            padding: ${SPACING.normal}px ${SPACING.huge}px;
            background-color: ${COLORS.white};
            border-bottom: 1px solid ${COLORS.offwhite};
          }

          .BoardsList,
          .BrandContainer {
            display: flex;
          }

          .BrandImage {
            width: 65px;
          }
        `}</style>
      </nav>
    );
  }
}

export default NavHeader;
