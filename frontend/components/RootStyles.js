import initReactFastclick from "react-fastclick";
import { COLORS } from "../lib/colors";

if (typeof window !== "undefined") {
  window.Promise = require("bluebird");
} else if (typeof global !== "undefined") {
  global.Promise = require("bluebird");
}

if (typeof window !== "undefined") {
  initReactFastclick();
}

export const RootStyles = ({ noScroll = false }) => (
  <style jsx global>{`
    html,
    body,
    div,
    span,
    applet,
    object,
    iframe,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p,
    blockquote,
    pre,
    a,
    abbr,
    acronym,
    address,
    big,
    cite,
    code,
    del,
    dfn,
    em,
    img,
    ins,
    kbd,
    q,
    s,
    samp,
    small,
    strike,
    strong,
    sub,
    sup,
    tt,
    var,
    b,
    u,
    i,
    center,
    dl,
    dt,
    dd,
    ol,
    ul,
    li,
    fieldset,
    form,
    label,
    legend,
    table,
    caption,
    tbody,
    tfoot,
    thead,
    tr,
    th,
    td,
    article,
    aside,
    canvas,
    details,
    embed,
    figure,
    figcaption,
    footer,
    header,
    hgroup,
    main,
    menu,
    nav,
    output,
    ruby,
    section,
    summary,
    time,
    mark,
    audio,
    video {
      margin: 0;
      padding: 0;
      border: 0;
      font-size: 100%;
      font: inherit;
      vertical-align: baseline;
    }
    /* HTML5 display-role reset for older browsers */
    article,
    aside,
    details,
    figcaption,
    figure,
    footer,
    header,
    hgroup,
    main,
    menu,
    nav,
    section {
      display: block;
    }
    body {
      line-height: 1;
    }
    ol,
    ul {
      list-style: none;
    }
    blockquote,
    q {
      quotes: none;
    }
    blockquote:before,
    blockquote:after,
    q:before,
    q:after {
      content: "";
      content: none;
    }
    table {
      border-collapse: collapse;
      border-spacing: 0;
    }

    body {
      font-family: "Open Sans", sans-serif;
    }

    html,
    body,
    #__next,
    div[data-reactroot] {
      ${noScroll ? "display: flex" : "default"};
      ${noScroll ? "flex-direction: column" : "unset"};
      ${noScroll ? "overflow: hidden;" : ""};
    }

    * {
      box-sizing: border-box;
      -webkit-overflow-scrolling: touch;
    }

    html,
    body {
      -webkit-tap-highlight-color: transparent;
    }

    a {
      text-decoration: none;
    }
  `}</style>
);

export default RootStyles;
