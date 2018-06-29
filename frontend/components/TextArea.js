import TextAreaAutosize from "react-autosize-textarea";
import React from "react";

export class TextArea extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { value, onChange, innerRef, ...otherProps } = this.props;
    return (
      <React.Fragment>
        <TextAreaAutosize
          {...otherProps}
          value={value}
          onChange={onChange}
          innerRef={innerRef}
        />
      </React.Fragment>
    );
  }
}

export default TextArea;
