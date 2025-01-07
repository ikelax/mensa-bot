import { webhookCallback } from "grammy";
import { getMensaBot } from "./bot.js";
import process from "node:process";

if (import.meta.main) {
  process.env.TZ = "Europe/Berlin";
  const bot = getMensaBot(Deno.env.get("TELEGRAM_BOT_PROD_TOKEN"));
  const endpoint = "https://mensa-bot.deno.dev/" + bot.token;
  await bot.api.setWebhook(endpoint);

  const handleUpdate = webhookCallback(bot, "std/http");

  Deno.serve(async (req) => {
    if (req.method === "POST") {
      const url = new URL(req.url);
      if (url.pathname.slice(1) === bot.token) {
        try {
          return await handleUpdate(req);
        } catch (err) {
          console.error(err);
        }
      }
    }
    return new Response();
  });
}
