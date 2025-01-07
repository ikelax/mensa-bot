import { getMensaBot } from "./bot.js";
import process from "node:process";

if (import.meta.main) {
  process.env.TZ = "Europe/Berlin";
  const bot = getMensaBot(Deno.env.get("TELEGRAM_BOT_DEV_TOKEN"));
  bot.start();
}
