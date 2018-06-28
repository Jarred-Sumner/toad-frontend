import localForage from "localforage";

const KEYS = {
  hide_board_chat: "hide_board_chat"
};

const key = (boardID, key) => `Settings.${boardID}.${key}`;

export class Settings {
  static async isBoardChatHidden(boardID) {
    return (
      (await localForage.getItem(key(boardID, KEYS.hide_board_chat))) === "true"
    );
  }

  static setHideBoardChat(boardID, hideBoardChat) {
    return localForage.setItem(
      key(boardID, KEYS.hide_board_chat),
      String(hideBoardChat)
    );
  }
}

export default Settings;
