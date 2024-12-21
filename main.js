import { webhookCallback } from "grammy";
import { bot } from "./bot.js";

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
