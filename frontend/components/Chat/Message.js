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

export class MessageGroup extends React.PureComponent {
  render() {
    const { isSentByCurrentUser, messageGroup, colorScheme } = this.props;

    const { identity } = messageGroup;

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

        {messageGroup.messages.map((message, index) => (
          <React.Fragment key={message.id}>
            <div
              data-tip={moment(message.created_at).format("h:mm A")}
              className="ChatMessage-body"
            >
              <Body wrap colorScheme={colorScheme}>
                {message.body}
              </Body>
            </div>
            <Spacer height={SPACING.small} />
          </React.Fragment>
        ))}

        <style jsx>{`
          .ChatMessage {
            display: flex;
            flex-direction: column;
            align-self: flex-start;
            flex-wrap: wrap;
            flex: 1;
            flex-shrink: 0;
          }

          .ChatMessage-body {
            background-color: ${COLORS.offwhite};
            padding: ${SPACING.small}px ${SPACING.small}px;
            display: flex;
            flex-wrap: wrap;
            width: max-content;
            max-width: 180px;
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