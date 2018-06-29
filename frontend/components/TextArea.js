import TextAreaAutosize from "react-autosize-textarea";
import React from "react";

export class TextArea extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  setRef = ref => {
    this.textAreaRef = ref;

    if (this.props.innerRef) {
      this.props.innerRef(ref);
    }
  };

  render() {
    const { value, onChange, ...otherProps } = this.props;
    return (
      <React.Fragment>
        <TextAreaAutosize
          {...otherProps}
          value={value}
          onChange={onChange}
          innerRef={this.setRef}
        />
      </React.Fragment>
    );
  }
}

export default TextArea;
