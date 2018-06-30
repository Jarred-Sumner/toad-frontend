import React from "react";
import ReactTooltip from "react-tooltip";
import { COLORS } from "../lib/colors";
import { MOBILE_BEAKPOINT } from "../lib/mobile";
import { SPACING } from "../lib/spacing";
import { AlertHost } from "./Alert";
import { NavHeader } from "./NavHeader";
import { Spacer } from "./Spacer";
import { Text } from "./Text";
import { Router } from "Toads/routes";
import { GITHUB_REPO_URL } from "config";
import { ImagePreviewProvider, ImagePreviewViewer } from "./ImagePreview";

// import Headroom from "react-headroom";

export class Page extends React.Component {
  componentDidMount() {
    const orignialRouteChangeComplete = Router.onRouteChangeComplete;

    Router.onRouteChangeComplete = url => {
      ReactTooltip.rebuild();

      if (orignialRouteChangeComplete) {
        return orignialRouteChangeComplete(url);
      }
    };
  }

  render() {
    const { children, renderSubheader } = this.props;

    return (
      <article className="Page">
        <AlertHost />
        <React.Fragment>
          <NavHeader />
          {renderSubheader && renderSubheader()}
        </React.Fragment>

        <ImagePreviewProvider>
          <main className="PageContainer">
            {children}
            <ImagePreviewViewer />
          </main>
        </ImagePreviewProvider>

        <footer>
          <div className="FooterContent">
            <Text size="12px" color={COLORS.medium_white}>
              Toads is{" "}
              <a href={GITHUB_REPO_URL} target="_blank">
                open-source software
              </a>
            </Text>
          </div>

          <div className="FooterContent">
            <a
              href={`${GITHUB_REPO_URL}/commits/${GIT_COMMIT}`}
              target="_blank"
            >
              <Text size="12px" color={COLORS.medium_white}>
                v{GIT_COMMIT}
              </Text>
            </a>
          </div>
        </footer>

        <ReactTooltip />

        <style jsx>{`
          .PageContainer,
          .Page {
            width: 100%;
            height: auto;
            min-height: 100%;
          }

          .Page {
            display: flex;
            align-self: flex-start;
            flex-direction: column;
          }

          .Page {
            background-color: ${COLORS.background};
          }

          footer {
            margin-top: auto;
            width: 100%;
            padding: ${SPACING.large}px ${SPACING.huge}px;
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
