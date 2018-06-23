import React from "react";
import { Page } from "./Page";
import { Text } from "./Text";
import { Spinner } from "./Spinner";
import { SPACING } from "Toads/lib/spacing";
import { Spacer } from "./Spacer";
import { defaultProps } from "recompose";

export class LoadingPage extends React.PureComponent {
  render() {
    const { children } = this.props;
    return (
      <Page>
        <div className="LoadingContainer">
          {children && (
            <React.Fragment>
              <Text size="36px">{children}</Text>
              <Spacer height={SPACING.normal} />
            </React.Fragment>
          )}
          <Spinner size={SPACING.normal} />
        </div>

        <style jsx>{`
          .LoadingContainer {
            width: 100%;
            height: 100%;
            min-height: 200px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        `}</style>
      </Page>
    );
  }
}

export const ErrorPage = defaultProps({
  children: "An uh-oh happened!! Please try again."
})(LoadingPage);

export default LoadingPage;
