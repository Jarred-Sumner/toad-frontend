import React from "react";
import { NavHeader } from "./NavHeader";
import Head from "./head";
import { SPACING } from "../lib/spacing";
import { COLORS } from "../lib/colors";
import { AlertHost } from "./Alert";
import { Text } from "./Text";
import { Spacer } from "./Spacer";
import { MOBILE_BEAKPOINT } from "../lib/mobile";

// import Headroom from "react-headroom";

export class Page extends React.Component {
  render() {
    const { children, backgroundColor, renderSubheader } = this.props;

    return (
      <article className="Page">
        <Head />
        <AlertHost />
        <React.Fragment>
          <NavHeader />
          {renderSubheader && renderSubheader()}
        </React.Fragment>

        <main className="PageContainer">{children}</main>
        <Spacer height={SPACING.large} />
        <Spacer divider width="100%" height={1} />
        <footer>
          <div className="FooterContent">
            <Text size="12px" color={COLORS.medium_white}>
              Toads is{" "}
              <a href={process.env.GITHUB_REPO_URL} target="_blank">
                open-source software
              </a>
            </Text>
          </div>

          <div className="FooterContent">
            <a
              href={`${process.env.GITHUB_REPO_URL}/commits/${GIT_COMMIT}`}
              target="_blank"
            >
              <Text size="12px" color={COLORS.medium_white}>
                v{GIT_COMMIT}
              </Text>
            </a>
          </div>
        </footer>

        <style jsx>{`
          .Page {
            width: 100%;
            height: 100%;
            background-color: ${backgroundColor || COLORS.background};
          }

          footer {
            width: 100%;
            padding: ${SPACING.large}px;
            display: flex;
            justify-content: space-between;
          }

          footer a {
            color: inherit;
          }

          .FooterContent {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }

          footer {
            flex-direction: column;
          }

          @media (max-width: ${MOBILE_BEAKPOINT}px) {
            footer {
              padding: ${SPACING.small}px;
              align-items: center;
            }
          }
        `}</style>
      </article>
    );
  }
}
