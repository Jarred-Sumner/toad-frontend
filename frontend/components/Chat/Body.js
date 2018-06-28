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

const parseBody = _.memoize(_parseBody);

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

const COMPONENT_BY_TYPE = {
  quote_line: QuoteLine,
  raw_line: NormalLine,
  blank_line: LineBreak,
  title_line: NormalLine,
  embed_line: EmbedLine
};

export const Body = pure(({ children, colorScheme, ...otherProps }) => {
  const text = parseBody(children);

  const lines = [text.title, ...text.body].filter(_.identity);

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
                {text}
              </Linkify>
            </LineComponent>
          </div>
        );
      })}
      <style jsx>{`
        .BodyTextLine {
          display: flex;
          width: max-content;
        }
      `}</style>
    </React.Fragment>
  );
});

export default Body;
