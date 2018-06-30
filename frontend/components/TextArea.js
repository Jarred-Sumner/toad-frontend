import TextAreaAutosize from "react-autosize-textarea";
import React from "react";
import { searchEmoji, InlineEmojiSearch } from "./InlineEmojiSearch";
import _ from "lodash";

const EMOJI_TERMINATOR_REGEX = /[ .,\/#!$%\^&\*;:{}=\-`~()]/g;

const shouldOpenEmojiPicker = string => {
  return searchEmoji(string).length > 0;
};

const shouldCloseEmojiPicker = string => {
  return searchEmoji(string).length === 0;
};

const SPECIAL_KEYCODES = {
  left: 37,
  right: 39,
  enter: 13,
  escape: 27
};

const getEmojiKeyword = ({ string, cursorPosition }) => {
  const potentialString = (string || "").substr(0, cursorPosition);

  if (potentialString.includes(":")) {
    const emojiKeyword = _.last(potentialString.split(":"));

    if (emojiKeyword.length > 1 && !EMOJI_TERMINATOR_REGEX.test(emojiKeyword)) {
      return {
        emojiKeyword,
        start: _.lastIndexOf(potentialString, ":"),
        end: cursorPosition
      };
    }
  }

  return {
    emojiKeyword: null,
    start: null,
    end: null
  };
};

export class TextArea extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isEmojiPickerVisible: false,
      isEmojiPickerEnabled: false,
      cursorPosition: 0
    };
  }

  setRef = ref => {
    this.textAreaRef = ref;

    if (this.props.innerRef) {
      this.props.innerRef(ref);
    }
  };

  static getDerivedStateFromProps(props, state) {
    const {
      emojiKeyword,
      start: emojiKeywordStart,
      end: emojiKeywordEnd
    } = getEmojiKeyword({
      string: props.value,
      cursorPosition: state.cursorPosition
    });

    if (emojiKeyword !== state.emojiKeyword) {
      return {
        emojiKeyword,
        emojiKeywordStart,
        emojiKeywordEnd,
        isEmojiPickerVisible:
          state.isEmojiPickerEnabled && searchEmoji(emojiKeyword).length > 0
      };
    } else {
      return {};
    }
  }

  handleKeyDown = evt => {
    if (
      _.values(SPECIAL_KEYCODES).includes(evt.keyCode) &&
      this.emojiRef &&
      this.state.isEmojiPickerVisible &&
      this.textAreaRef
    ) {
      this.setState({
        cursorPosition: this.textAreaRef.selectionEnd
      });

      evt.preventDefault();

      if (evt.keyCode === SPECIAL_KEYCODES.left) {
        this.emojiRef.incrementIndex(-1);
      } else if (evt.keyCode === SPECIAL_KEYCODES.right) {
        this.emojiRef.incrementIndex(1);
      } else if (evt.keyCode === SPECIAL_KEYCODES.enter) {
        this.emojiRef.insertSelectedEmoji();
      } else if (evt.keyCode === SPECIAL_KEYCODES.escape) {
        this.setState({
          isEmojiPickerEnabled: false,
          emojiKeywordStart: null,
          emojiKeywordEnd: null,
          isEmojiPickerVisible: false
        });
      }
    } else {
      if (this.props.onKeyDown) {
        return this.props.onKeyDown(evt);
      }
    }
  };

  handleChange = evt => {
    this.setState({
      cursorPosition: this.textAreaRef.selectionEnd
    });

    if (this.props.onChange) {
      return this.props.onChange(evt);
    }
  };

  handleFocus = evt => {
    this.setState({ isEmojiPickerEnabled: true });

    if (this.props.onFocus) {
      this.props.onFocus(evt);
    }
  };

  handleBlur = evt => {
    this.setState({ isEmojiPickerEnabled: false });

    if (this.props.onBlur) {
      this.props.onBlur(evt);
    }
  };

  setEmojiRef = emojiRef => (this.emojiRef = emojiRef);

  handleInsertEmoji = emoji => {
    const { emojiKeywordStart, emojiKeywordEnd } = this.state;
    const { value } = this.props;

    const replacedString = [
      value.substr(0, emojiKeywordStart),
      emoji,
      value.substr(emojiKeywordEnd, value.length - 1)
    ].join("");

    this.props.onChange({
      target: {
        value: replacedString
      }
    });
  };

  render() {
    const {
      value,
      onChange,
      emojiPickerDirection,
      colorScheme,
      ...otherProps
    } = this.props;
    const {
      isEmojiPickerVisible,
      emojiKeyword,
      isEmojiPickerEnabled
    } = this.state;
    return (
      <React.Fragment>
        <TextAreaAutosize
          {...otherProps}
          value={value}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onKeyDown={this.handleKeyDown}
          innerRef={this.setRef}
        />
        {isEmojiPickerVisible &&
          isEmojiPickerEnabled && (
            <InlineEmojiSearch
              ref={this.setEmojiRef}
              colorScheme={colorScheme}
              direction={emojiPickerDirection}
              onPick={this.handleInsertEmoji}
              keyword={emojiKeyword}
            />
          )}
      </React.Fragment>
    );
  }
}

export default TextArea;
