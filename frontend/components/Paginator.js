import React from "react";
import { Button } from "./Button";
import { Icon, ICONS } from "./Icon";
import classNames from "classnames";
import { Text } from "./Text";
import { COLORS } from "lib/colors";
import { SPACING } from "lib/spacing";
import _ from "lodash";
import { GRADIENT_COLORS } from "./Gradient";
import { Spacer } from "./Spacer";
import { Link } from "Toads/routes";

export const MIN_PAGE = 1;
export const MAX_PAGE = 10;

const PageNumber = ({ isActive, page, colorScheme }) => {
  return (
    <div
      className={classNames("PageNumber", {
        "PageNumber--active": isActive
      })}
    >
      <Text size={14} weight="inherit" color={"inherit"}>
        {page}
      </Text>

      <style jsx>{`
        .PageNumber {
          padding: ${SPACING.small}px;

          color: ${COLORS.gray};
          font-weight: 500;
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .PageNumber:hover,
        .PageNumber--active {
          color: ${COLORS[GRADIENT_COLORS[colorScheme]]};
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};

export class Paginator extends React.PureComponent {
  render() {
    const { colorScheme, page, boardId: board } = this.props;
    return (
      <div className="Paginator">
        <Link
          shallow
          route="board"
          params={{ board, p: Math.max(page - 1, MIN_PAGE) }}
        >
          <a>
            <div
              className={classNames("TextButton", "PrevButton", {
                "TextButton--disabled": page <= MIN_PAGE
              })}
            >
              <Icon size="xs" icon={ICONS.previous} />
              <Spacer width={SPACING.small} />
              <Text color="inherit" weight="semiBold" size={14}>
                Prev
              </Text>
            </div>
          </a>
        </Link>

        <div className="PageNumbers">
          {_.range(MIN_PAGE, MAX_PAGE + 1).map(_page => (
            <Link
              key={_page}
              shallow
              route="board"
              params={{ board, p: _page }}
            >
              <a>
                <PageNumber
                  key={_page}
                  colorScheme={colorScheme}
                  isActive={_page === page}
                  page={_page}
                />
              </a>
            </Link>
          ))}
        </div>

        <Link
          shallow
          route="board"
          params={{ board, p: Math.min(page + 1, MAX_PAGE) }}
        >
          <a>
            <div
              className={classNames("TextButton", "NextButton", {
                "TextButton--disabled": page >= MAX_PAGE
              })}
            >
              <Text color="inherit" weight="semiBold" size={14}>
                Next
              </Text>
              <Spacer width={SPACING.small} />
              <Icon size="xs" icon={ICONS.next} />
            </div>
          </a>
        </Link>

        <style jsx>{`
          .Paginator {
            display: flex;
            align-items: center;
            max-width: 320px;
            width: 100%;
          }

          .TextButton {
            color: ${COLORS[GRADIENT_COLORS[colorScheme]]};
            display: flex;
            padding: ${SPACING.small}px ${SPACING.normal}px;
            align-items: center;
            cursor: pointer;
          }

          .PrevButton {
            padding-left: 0;
          }

          .NextButton {
            padding-right: 0;
          }

          .PageNumbers {
            display: flex;
            align-items: center;
            justify-content: space-evenly;
          }

          .TextButton--disabled {
            filter: grayscale(100%);
            opacity: 0.25;
            pointer-events: none;
          }
        `}</style>
      </div>
    );
  }
}

export default Paginator;
