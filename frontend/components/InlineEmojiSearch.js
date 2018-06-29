import React from "react";
import { ordered, lib } from "emojilib";
import { COLORS } from "lib/colors";
import { Spacer } from "./Spacer";
import { SPACING } from "lib/spacing";
import { Text } from "./Text";
import { GRADIENT_COLORS } from "./Gradient";
import classNames from "classnames";
import _ from "lodash";

export const EMOJI_PICKER_DIRECTIONS = {
  bottom: "bottom",
  top: "top"
};

export const searchEmoji = keyword => {
  console.log(keyword);
  return _.uniq(
    ordered
      .filter(phrase => phrase.startsWith(keyword))
      .map(key => ({ key, value: lib[key] }))
      .slice(0, 20)
  );
};

class InlineEmojiSearchRow extends React.PureComponent {
  handleClick = evt => {
    evt.preventDefault();
    this.props.onClick(this.props.emoji);
  };

  handleSelect = () => this.props.onSelect(this.props.emoji);

  render() {
    const { emoji, colorScheme, selected } = this.props;
    return (
      <div
        className={classNames("EmojiRow", {
          "EmojiRow--selected": selected
        })}
        onMouseDown={this.handleClick}
        onMouseOver={this.handleSelect}
      >
        <Text size="16px">{emoji.value.char}</Text>
        <Spacer height divider />
        <Text weight="semiBold" size="12px" color="inherit">
          :{emoji.key}:
        </Text>

        <style jsx>{`
          .EmojiRow {
            display: inline-flex;
            align-items: center;
            width: 100%;
            cursor: pointer;
            padding: ${SPACING.xsmall}px;
            background-color: white;
            color: ${COLORS.black};
            border-radius: 10px;
            flex: 0;
            align-self: flex-start;
            width: min-content;
          }

          .EmojiRow--selected {
            background-color: ${COLORS[GRADIENT_COLORS[colorScheme]]};
            color: ${COLORS.white};
          }
        `}</style>
      </div>
    );
  }
}

export class InlineEmojiSearch extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
      selectedIndex: -1,
      keyword: null
    };
  }

  static defaultProps = {
    direction: EMOJI_PICKER_DIRECTIONS.top
  };

  static getDerivedStateFromProps(props, state) {
    if (props.keyword !== state.keyword) {
      return {
        results: searchEmoji(props.keyword),
        keyword: props.keyword,
        selectedIndex: 0
      };
    } else {
      return {};
    }
  }

  handlePressRow = row => {
    this.insertEmoji(row);
  };

  handleSelect = row => {
    this.setState({
      selectedIndex: this.state.results.indexOf(row)
    });
  };

  insertSelectedEmoji = () => {
    const emoji = this.state.results[this.state.selectedIndex];

    if (emoji) {
      this.insertEmoji(emoji);
    }
  };

  insertEmoji = row => {
    this.props.onPick(row.value.char);
  };

  incrementIndex = index => {
    this.setState({
      selectedIndex: Math.max(
        Math.min(
          index + this.state.selectedIndex,
          this.state.results.length - 1
        ),
        0
      )
    });
  };

  renderResults = () =>
    this.state.results.map((row, index) => (
      <InlineEmojiSearchRow
        colorScheme={this.props.colorScheme}
        keyword={this.state.keyword}
        key={row.key}
        selected={this.state.selectedIndex === index}
        onSelect={this.handleSelect}
        onClick={this.handlePressRow}
        emoji={row}
      />
    ));

  render() {
    const { results, keyword, selectedIndex } = this.state;
    const { colorScheme, direction } = this.props;

    if (!results) {
      return null;
    }

    return (
      <div
        className={classNames("Container", {
          "Container--top": direction === EMOJI_PICKER_DIRECTIONS.top,
          "Container--bottom": direction === EMOJI_PICKER_DIRECTIONS.bottom
        })}
      >
        <div className="Search">{this.renderResults()}</div>

        <style jsx>{`
          .Container {
            position: absolute;
            max-width: 250px;
            height: 150px;
            display: flex;
            align-items: flex-start;
          }

          .Container--top {
            bottom: 0;
          }

          .Container--bottom {
            bottom: 100%;
          }

          .Container--bottom .Search {
            align-self: flex-end;
          }

          .Search {
            padding: ${SPACING.small}px;
            width: auto;
            overflow: auto;
            background-color: white;
            max-height: 150px;
            align-self: flex-start;

            border: 1px solid rgba(0, 0, 0, 0.05);
            border-radius: 4px;
            filter: drop-shadow(1px 1px 1px #ccc);
            display: flex;
            flex-wrap: wrap;
          }
        `}</style>
      </div>
    );
  }
}
