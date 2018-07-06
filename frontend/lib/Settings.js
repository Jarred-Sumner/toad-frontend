import localForage from "localforage";

const KEYS = {
  collapse_conversation: "collapse_conversation",
  identity: "identity"
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

  static async setIdentity(identityID) {
    // returns if changed
    const idkey = key("user", KEYS.identity);
    const changed = (await localForage.getItem(idkey)) !== identityID;
    await localForage.setItem(idkey, String(identityID));
    return changed;
  }
}

export default Settings;
