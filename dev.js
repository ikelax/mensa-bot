import { getMensaBot } from "./src/bot.js";

if (import.meta.main) {
  const bot = getMensaBot(Deno.env.get("TELEGRAM_BOT_DEV_TOKEN"));
  bot.start();
}
