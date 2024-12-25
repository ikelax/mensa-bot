import { Bot, InlineQueryResultBuilder } from "grammy";
import { fetchMealplans, getTodaysMealplan } from "./mealplans.js";

export { getMensaBot };

async function replyWithTodaysMealplan(ctx) {
  const mealplans = await fetchMealplans();
  const todaysMealplan = getTodaysMealplan(mealplans);
  ctx.reply(todaysMealplan, { parse_mode: "MarkdownV2" });
}

/**
 * @param {string} token the token to access the HTTP API of Telegram
 * @returns the bot for tasks related to the Mensa
 */
function getMensaBot(token) {
  const bot = new Bot(token);

  bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
  bot.on(
    "message",
    async (ctx) => replyWithTodaysMealplan(ctx),
  );
  bot.on("inline_query", async (ctx) => {
    const result = InlineQueryResultBuilder.article("id", "Mensa UdS").text(
      await getMealplans(),
      { parse_mode: "MarkdownV2" },
    );
    await ctx.answerInlineQuery([result], { cache_time: 0 });
  });

  return bot;
}
