import React from "react";
import { Text } from "../Text";
import * as EmojiConvertor from "emoji-js/lib/emoji.js";

const normalizeName = name => {
  const emoji = new EmojiConvertor();
  emoji.use_sheet = false;
  emoji.text_mode = false;
  emoji.replace_mode = "unified";
  emoji.init_env(); // else auto-detection will trigger when we first convert

  return emoji.replace_colons(name);
};

const normalizeAnonymousName = name => {
  return `@Anon${normalizeName(name)}`;
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
