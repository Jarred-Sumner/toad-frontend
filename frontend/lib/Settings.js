import localForage from "localforage";

const KEYS = {
  collapse_conversation: "collapse_conversation"
};

const key = (namespace, ...keys) =>
  `Settings.${namespace}.${Array(keys).join(".")}`;

export class Settings {
  static async isConversationCollapsed(conversationID) {
    return (
      (await localForage.getItem(
        key(conversationID, KEYS.collapse_conversation)
      )) === "true"
    );
  }

  static setCollapseConversation(conversationID, collapseConversation) {
    return localForage.setItem(
      key(conversationID, KEYS.collapse_conversation),
      String(collapseConversation)
    );
  }
}

export default Settings;
