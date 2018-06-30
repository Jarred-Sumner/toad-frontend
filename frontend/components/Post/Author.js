import React from "react";
import { Text } from "../Text";
import { convertEmojiToNative } from "lib/emoji";

export const normalizeAnonymousName = name => {
  return `@Anon${convertEmojiToNative(name)}`;
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
    return (
      <Text size="12px" color="inherit" weight="bold" wrap={false}>
        {name}
      </Text>
    );
  }
}
