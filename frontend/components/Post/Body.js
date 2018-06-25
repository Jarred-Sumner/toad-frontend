import React from "react";
import { COLORS } from "../../lib/colors";
import { SPACING } from "../../lib/spacing";
import { Text } from "../Text";
import { defaultProps } from "recompose";
import { parse } from "./BodyParser.pegjs";
import { Spacer } from "../Spacer";
import Linkify from "react-linkify";
import { pure } from "recompose";

const LineBreak = defaultProps({ height: SPACING.small })(Spacer);
const QuoteLine = defaultProps({
  size: "14px",
  lineHeight: "19px",
  color: COLORS.greentext,
  className: "BodyText BodyText--QuoteLine"
})(Text);
const NormalLine = defaultProps({
  size: "14px",
  lineHeight: "19px",
  color: COLORS.black,
  className: "BodyText BodyText--NormalLine"
})(Text);

const COMPONENT_BY_TYPE = {
  quote_line: QuoteLine,
  raw_line: NormalLine,
  blank_line: LineBreak
};

export const Body = pure(({ children, ...otherProps }) => {
  const lines = parse(children);

  return (
    <React.Fragment>
      {lines.map(({ type, text }, index) => {
        const LineComponent = COMPONENT_BY_TYPE[type];
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
          display: block;
        }
      `}</style>
    </React.Fragment>
  );
});

export default Body;
