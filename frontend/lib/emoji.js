import * as EmojiConvertor from "emoji-js/lib/emoji.js";

export const normalizeEmoji = string => {
  const emoji = new EmojiConvertor();
  emoji.init_env(); // else auto-detection will trigger when we first convert
  emoji.use_sheet = false;
  emoji.text_mode = false;
  emoji.supports_css = false;
  emoji.colons_mode = true;
  emoji.allow_native = false;

  return emoji.replace_unified(emoji.replace_emoticons_with_colons(string));
};

export const convertEmojiToNative = string => {
  const emoji = new EmojiConvertor();
  emoji.use_sheet = false;
  emoji.text_mode = false;
  emoji.replace_mode = "unified";
  emoji.init_env(); // else auto-detection will trigger when we first convert

  return emoji.replace_colons(string);
};
