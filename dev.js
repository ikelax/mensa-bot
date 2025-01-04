import { getMensaBot } from "./bot.js";

const token = Deno.env.get("TELEGRAM_BOT_DEV_TOKEN");
if (token === undefined) {
  console.log("TELEGRAM_BOT_DEV_TOKEN: Missing token.");
  Deno.exit(1);
}

const bot = getMensaBot(token);
bot.start();
