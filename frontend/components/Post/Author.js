import React from "react";
import { Text } from "../Text";
import { convertEmojiToNative } from "lib/emoji";
import { Mutation } from "react-apollo";
import { Queries } from "Queries";

export const normalizeAnonymousName = name => {
  return convertEmojiToNative(name);
};

// This will have more stuff later.
export class Author extends React.PureComponent {
  static defaultProps = {
    anonymous: true
  };
  state = { name: null };

  static getDerivedStateFromProps(props, state) {
    const { anonymous, identity } = props;

    if (!identity || !identity.name) {
      return {};
    }

    let name;

    if (anonymous) {
      name = normalizeAnonymousName(identity.name);
    } else {
      name = normalizeName(identity.name);
    }

    if (name !== state.name) {
      return { name };
    } else {
      return {};
    }
  }

  render() {
    const { name } = this.state;
    const { onClick, size = "12px" } = this.props;

    return (
      <Text
        size={size}
        hoverable={!!onClick}
        onClick={onClick}
        color="inherit"
        weight="bold"
        wrap={false}
      >
        {name}
      </Text>
    );
  }
}

class RawMessagableAuthor extends React.PureComponent {
  handleOnClick = async () => await this.props.createDirectMessage();

  render() {
    const { identity, anonymous, boardID } = this.props;

    return (
      <Author
        onClick={this.handleOnClick}
        identity={identity}
        anonymous={anonymous}
        boardID={boardID}
      />
    );
  }
}

export const MessageableAuthor = ({
  identity,
  anonymous,
  boardID,
  enabled = false
}) => {
  return (
    <Mutation
      mutation={Queries.CreateDirectConversation}
      variables={{ identityID: identity.id, boardID }}
    >
      {createDirectMessage => (
        <RawMessagableAuthor
          identity={identity}
          anonymous={anonymous}
          enabled={enabled}
          createDirectMessage={createDirectMessage}
          boardID={boardID}
        />
      )}
    </Mutation>
  );
};
