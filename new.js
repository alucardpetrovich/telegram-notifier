const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { CronJob } = require("cron");
const { newMessageAlarm, errorAlarm } = require("./client_alarm_commands");

let apiId;
let apiHash;
let stringSession = new StringSession();

let phoneNumber = "";
let password;
let phoneCode = "";

let client;

let lastMessageReceivedAt;

const job = new CronJob(
  "*/10 * * * * *", // cronTime
  checkNewMessages
);

async function checkNewMessages() {
  if (!client) {
    client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    });

    await client.start({
      phoneNumber: phoneNumber,
      password: password,
      phoneCode: phoneCode,
      onError: (err) => console.log(err),
    });

    console.log("You should now be connected.");
    console.log(client.session.save()); // Save this string to avoid logging in again
  }

  try {
    const dialogs = await client.getDialogs({ limit: 100 });
    const maxDialogsDateAndText = dialogs.reduce(
      (acc, d) =>
        d.date > acc.date ? { date: d.date, text: d.message.text } : acc,
      { date: 0, text: "" }
    );

    if (!lastMessageReceivedAt) {
      lastMessageReceivedAt = new Date(maxDialogsDateAndText.date * 1000);
      return;
    }

    for (const d of dialogs) {
      const dialogLastMessageAt = new Date(d.date * 1000);
      if (
        !d.message.out &&
        dialogLastMessageAt.getTime() > lastMessageReceivedAt.getTime() &&
        d.unreadCount > 0
      ) {
        lastMessageReceivedAt = new Date(d.date * 1000);
        newMessageAlarm();
        console.log("new message received", maxDialogsDateAndText.text);
        return;
      }
    }

    console.log("No new messages");
  } catch (err) {
    errorAlarm();
    console.log(err);
  }
}

job.start();
