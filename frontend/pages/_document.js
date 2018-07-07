import "@fortawesome/fontawesome-svg-core/styles.css";
import Document, { Head, Main, NextScript } from "next/document";
import Raven from "raven-js";
import { SENTRY_URL } from "Toads/config";
import PageHead from "../components/head";
import { MOBILE_BEAKPOINT } from "lib/mobile";

if (typeof window !== "undefined") {
  window.Promise = require("bluebird");
  window.FontAwesomeConfig = {
    autoAddCss: false
  };
  Raven.config(SENTRY_URL).install();
} else if (typeof global !== "undefined") {
  global.Promise = require("bluebird");
}

export default class MyDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale = 1.0, maximum-scale=1.0, user-scalable=no"
          />
          <style key="root-style" jsx global>{`
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

            body,
            textarea,
            input {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                Helvetica, Arial, sans-serif, "Apple Color Emoji",
                "Segoe UI Emoji", "Segoe UI Symbol";
            }

            * {
              box-sizing: border-box;
              -webkit-overflow-scrolling: touch;
            }

            html,
            body {
              -webkit-tap-highlight-color: transparent;
              font-size: 14px;
            }

            html,
            body,
            #__next {
              min-height: 100%;
              height: 100%;
            }

            a {
              text-decoration: none;
            }

            .MobileOnly {
              display: none !important;
            }

            @media (max-width: ${MOBILE_BEAKPOINT}px) {
              .DesktopOnly {
                display: none !important;
              }

              html,
              body {
                font-size: 16px;
              }

              .MobileOnly {
                display: flex !important;
              }
            }
          `}</style>

          <link
            key="static-stylesheet"
            rel="stylesheet"
            href="/_next/static/style.css"
          />

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/static/apple-touch-icon.png"
          />

          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/static/favicon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/static/favicon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="64x64"
            href="/static/favicon.png"
          />

          <link
            rel="icon"
            type="image/png"
            sizes="96x96"
            href="/static/favicon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="128x128"
            href="/static/favicon.png"
          />

          <link rel="manifest" href="/static/site.webmanifest" />
          <link
            rel="mask-icon"
            href="/static/safari-pinned-tab.svg"
            color="#5bbad5"
          />
          <meta name="apple-mobile-web-app-title" content="Toads" />
          <meta name="application-name" content="Toads" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />

          <PageHead />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
