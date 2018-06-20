import React from "react";
import { NavHeader } from "./NavHeader";
import Head from "./head";
import { SPACING } from "../lib/spacing";
import { COLORS } from "../lib/colors";
// import Headroom from "react-headroom";

export class Page extends React.Component {
  render() {
    const { children, backgroundColor, renderSubheader } = this.props;

    return (
      <article className="Page">
        <Head />
        <React.Fragment>
          <NavHeader />
          {renderSubheader && renderSubheader()}
        </React.Fragment>

        <main className="PageContainer">{children}</main>

        <style jsx>{`
          .Page {
            width: 100%;
            height: 100%;
            background-color: ${backgroundColor || COLORS.background};
          }
        `}</style>
      </article>
    );
  }
}
