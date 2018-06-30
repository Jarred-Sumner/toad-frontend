import React from "react";
import { COLORS } from "../../lib/colors";
import { SPACING } from "../../lib/spacing";
import { Text } from "../Text";
import { defaultProps } from "recompose";
import { parse as _parseBody } from "../Post/BodyParser.pegjs";
import { Spacer } from "../Spacer";
import Linkify from "react-linkify";
import { pure } from "recompose";
import _ from "lodash";
import { convertEmojiToNative } from "lib/emoji";

export const parseBody = _.memoize(string => {
  const text = _parseBody(string);

  return [text.title, ...text.body].filter(_.identity);
});

const LineBreak = defaultProps({ height: SPACING.small })(Spacer);
const EmbedLine = defaultProps({
  size: "12px",
  underline: true,
  className: "BodyText BodyText--EmbedLine"
})(Text);
const QuoteLine = defaultProps({
  size: "12px",
  color: COLORS.greentext,
  className: "BodyText BodyText--QuoteLine"
})(Text);
const NormalLine = defaultProps({
  size: "12px",
  lineHeight: "16px",
  color: "inherit",
  className: "BodyText BodyText--NormalLine"
})(Text);
export const EmojiLine = defaultProps({
  size: "36px",
  lineHeight: "unset",
  color: COLORS.black,
  className: "BodyText BodyText--EmojiLine"
})(Text);

export const TEXT_TYPES = {
  quote_line: "quote_line",
  raw_line: "raw_line",
  blank_line: "blank_line",
  title_line: "title_line",
  embed_line: "embed_line",
  emoji_line: "emoji_line"
};

const COMPONENT_BY_TYPE = {
  [TEXT_TYPES.quote_line]: QuoteLine,
  [TEXT_TYPES.raw_line]: NormalLine,
  [TEXT_TYPES.blank_line]: LineBreak,
  [TEXT_TYPES.title_line]: NormalLine,
  [TEXT_TYPES.embed_line]: EmbedLine,
  [TEXT_TYPES.emoji_line]: EmojiLine
};

export const Body = pure(({ lines, colorScheme, ...otherProps }) => {
  return (
    <React.Fragment>
      {lines.map(({ type, text }, index) => {
        const LineComponent = COMPONENT_BY_TYPE[type];

        // TODO: color scheme, hover state
        if (LineComponent === COMPONENT_BY_TYPE.embed_line) {
        }

        return (
          <div className="BodyTextLine">
            <LineComponent key={index}>
              <Linkify properties={{ target: "_blank", className: "AutoLink" }}>
                {convertEmojiToNative(text)}
              </Linkify>
            </LineComponent>
          </div>
        );
      })}
      <style jsx>{`
        .BodyTextLine {
          display: flex;
          width: max-content;
          flex-wrap: wrap;
          max-width: 100%;
        }

        .BodyText--EmojiLine :global(span) {
          vertical-align: middle;
          letter-spacing: 0;
        }
      `}</style>
    </React.Fragment>
  );
});

export default Body;
