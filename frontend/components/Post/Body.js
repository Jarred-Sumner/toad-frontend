import React from "react";
import Markdown from "react-markdown";
import breaks from "remark-breaks";
import { COLORS } from "../../lib/colors";
import { SPACING } from "../../lib/spacing";
import { Text } from "../Text";
import { defaultProps } from "recompose";
// const QuoteText = defaultProps({ color: COLORS.green })(BodyText);
// import Lowlight from "remark-react-lowlight";
// import js from "highlight.js/lib/languages/javascript";

const LineBreak = () => <p className="MarkdownBody-LineBreak" />;

export const Body = ({ children, ...otherProps }) => (
  <React.Fragment>
    <Markdown
      skipHtml
      renderers={{
        root: defaultProps({ className: "MarkdownBody" })(Text),
        break: LineBreak,
        link: ({ children, href, ...otherProps }) => (
          <a href={href} target="_blank">
            {href}
          </a>
        )
      }}
      plugins={[breaks]}
      unwrapDisallowed
      allowedTypes={[
        "root",
        "text",
        "break",
        "paragraph",
        "emphasis",
        "strong",
        "blockquote",
        "link",
        "inlineCode",
        "delete",
        "paragraph",
        "break"
      ]}
    >
      {children}
    </Markdown>

    <style global jsx>{`
      .MarkdownBody p {
        margin-bottom: ${SPACING.normal}px;
        line-height: 19px;
      }

      .MarkdownBody p p {
        margin-bottom: ${SPACING.small}px;
      }

      .MarkdownBody a {
        text-decoration: underline;
      }

      .MarkdownBody blockquote {
        color: ${COLORS.green};
      }

      .MarkdownBody blockquote p {
        white-space: pre-wrap;
      }

      .MarkdownBody blockquote .MarkdownBody-LineBreak {
        margin-bottom: 0;
      }

      .MarkdownBody blockquote > p:before {
        content: "> ";
      }
    `}</style>
  </React.Fragment>
);

export default Body;
