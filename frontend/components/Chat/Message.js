import React from "react";
import classNames from "classnames";
import { COLORS } from "lib/colors";
import { normalizeAnonymousName } from "../Post/Author";
import { Spacer } from "../Spacer";
import { SPACING } from "lib/spacing";
import { Body } from "./Body";
import { GRADIENT_COLORS } from "../Gradient";
import { Text } from "../Text";
import moment from "moment";

export class Message extends React.PureComponent {
  render() {
    const { isSentByCurrentUser, message, colorScheme } = this.props;

    const { body, identity } = message;

    return (
      <div
        className={classNames("ChatMessage", {
          "ChatMessage--self": isSentByCurrentUser
        })}
      >
        <div className="Author">
          <Spacer height={SPACING.small} />
          <Text lineHeight="12px" color={COLORS.gray} size="12px">
            {normalizeAnonymousName(identity.name)}
          </Text>
        </div>
        <Spacer height={SPACING.small} />

        <div
          data-tip={moment(message.created_at).format("h:mm A")}
          className="ChatMessage-body"
        >
          <Body wrap colorScheme={colorScheme}>
            {body}
          </Body>
        </div>

        <style jsx>{`
          .ChatMessage {
            display: flex;
            flex-direction: column;
            align-self: flex-start;
            flex-shrink: 0;
          }

          .ChatMessage-body {
            background-color: ${COLORS.offwhite};
            padding: ${SPACING.small}px ${SPACING.small}px;
            display: flex;
            width: max-content;
            border-radius: 4px;
            overflow: hidden;
          }

          .ChatMessage--self .ChatMessage-body {
            background-color: ${COLORS[GRADIENT_COLORS[colorScheme]]};
            color: white;
          }

          .ChatMessage--self {
            align-items: flex-end;
            align-self: flex-end;
          }

          .ChatMessage--self .Author {
            display: none;
          }
        `}</style>
      </div>
    );
  }
}
