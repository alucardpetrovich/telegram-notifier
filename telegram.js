const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { default: input } = require("input");
const fs = require("fs");
const child = require("child_process");

const lastChecked = new Date("2024-02-17T00:00:00+02:00");

let apiId;
let apiHash;
let stringSession; // fill this later with the value from session.save()

(async () => {
  if (!apiId) {
    apiId = await input.text("Please enter your api id: ");
  }
  if (!apiHash) {
    apiHash = await input.text("Please enter your api hash: ");
  }
  if (!stringSession) {
    stringSession = new StringSession(
      await input.text("Please enter your string session: ")
    );
  }

  console.log("Loading interactive example...");
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });
  await client.start({
    phoneNumber: async () => await input.text("Please enter your number: "),
    password: async () => await input.text("Please enter your password: "),
    phoneCode: async () =>
      await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });
  console.log("You should now be connected.");
  console.log(client.session.save()); // Save this string to avoid logging in again

  // const dialogs = await client.getDialogs();
  // const dialogsFormatted = dialogs.map((d) => ({
  //   pinned: d.dialog.pinned,
  //   unreadMark: d.dialog.unreadMark,
  //   unreadReactionsCount: d.dialog.unreadReactionsCount,
  //   unreadMentionsCount: d.dialog.unreadMentionsCount,
  //   unreadCount: d.dialog.unreadCount,
  //   id: d.id,
  //   entityId: d.entity.id,
  //   title: d.entity.title,
  //   username: d.entity.username,
  //   usernames: d.entity.usernames,
  //   name: d.name,
  //   isGroup: d.isGroup,
  //   isUser: d.isUser,
  //   isChannel: d.isChannel,
  //   archived: d.archived,
  // }));

  const test = await client.getMessages("mighty_infant", { limit: 100 });
  const hasNewMessages = test.some(
    (t) => t.date * 1000 - lastChecked.getTime() > 0
  );
  if (hasNewMessages) {
    child.execSync("C:\\Users\\Documents\\alert.mp3");
  }
})();
