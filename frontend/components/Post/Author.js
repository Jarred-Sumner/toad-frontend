import React from "react";
import { Text } from "../Text";

// This will have more stuff later.
export class Author extends React.Component {
  render() {
    const { name } = this.props.author;
    return (
      <Text weight="bold" wrap={false}>
        {name}
      </Text>
    );
  }
}
