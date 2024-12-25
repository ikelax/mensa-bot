import { getMensaBot } from "./bot.js";

const bot = getMensaBot(Deno.env.get("TELEGRAM_BOT_DEV_TOKEN"));
bot.start();
