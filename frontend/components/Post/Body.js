import React from "react";
import { COLORS } from "../../lib/colors";
import { SPACING } from "../../lib/spacing";
import { Text } from "../Text";
import { defaultProps } from "recompose";
import { parse as _parseBody } from "./BodyParser.pegjs";
import { Spacer } from "../Spacer";
import Linkify from "react-linkify";
import { pure } from "recompose";
import _ from "lodash";
import { convertEmojiToNative } from "lib/emoji";
import { Link } from "Toads/routes";
import { GRADIENT_COLORS } from "../Gradient";

const parseBody = _.memoize(_parseBody);

const LineBreak = defaultProps({ height: SPACING.small })(Spacer);
const TitleLine = defaultProps({
  size: "1.4rem",
  lineHeight: "1.6rem",
  weight: "semiBold",
  color: COLORS.black,
  className: "BodyText BodyText--TitleLine"
})(Text);
const EmbedLineText = defaultProps({
  size: "1rem",
  lineHeight: "1.5rem",
  underline: false,
  weight: "semiBold",
  className: "BodyText BodyText--EmbedLine"
})(Text);
const QuoteLine = defaultProps({
  size: "1rem",
  lineHeight: "1.5rem",
  color: COLORS.greentext,
  className: "BodyText BodyText--QuoteLine"
})(Text);
const EmojiLine = defaultProps({
  size: "2.5rem",
  lineHeight: "unset",
  color: COLORS.black,
  className: "BodyText BodyText--EmojiLine"
})(Text);
const NormalLine = defaultProps({
  size: "1rem",
  lineHeight: "1.5rem",
  color: COLORS.black,
  className: "BodyText BodyText--NormalLine"
})(Text);

class EmbedLine extends React.PureComponent {
  render() {
    const {
      boardId,
      threadId,
      commentId,
      minimized,
      children,
      colorScheme,
      embed
    } = this.props;

    return (
      <Link
        shallow={!minimized}
        replace={!minimized}
        scroll={minimized}
        route="thread"
        params={{ board: boardId, id: threadId, h: embed }}
      >
        <a>
          <EmbedLineText color={COLORS[GRADIENT_COLORS[colorScheme]]}>
            {children}
          </EmbedLineText>
        </a>
      </Link>
    );
  }
}

const COMPONENT_BY_TYPE = {
  quote_line: QuoteLine,
  raw_line: NormalLine,
  blank_line: LineBreak,
  title_line: TitleLine,
  emoji_line: EmojiLine,
  embed_line: EmbedLine
};

export const Body = pure(
  ({
    children,
    colorScheme,
    boardId,
    threadId,
    minimized,
    commentId,
    ...otherProps
  }) => {
    const text = parseBody(children);

    const lines = [text.title, ...text.body].filter(_.identity);

    return (
      <React.Fragment>
        {lines.map(({ type, text, embed = null }, index) => {
          const LineComponent = COMPONENT_BY_TYPE[type];

          return (
            <div key={`${index}-${text}`} className="BodyTextLine">
              <LineComponent
                boardId={boardId}
                threadId={threadId}
                commentId={commentId}
                minimized={minimized}
                colorScheme={colorScheme}
                embed={embed}
                key={index}
              >
                {LineComponent !== EmbedLine ? (
                  <Linkify
                    properties={{ target: "_blank", className: "AutoLink" }}
                  >
                    {convertEmojiToNative(text)}
                  </Linkify>
                ) : (
                  text
                )}
              </LineComponent>
            </div>
          );
        })}
        <style jsx>{`
          .BodyTextLine {
            display: block;
          }

          .BodyText--EmojiLine :global(span) {
            vertical-align: middle;
            letter-spacing: 0;
          }
        `}</style>
      </React.Fragment>
    );
  }
);

export default Body;
