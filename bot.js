import { Bot, InlineQueryResultBuilder } from "grammy";
import {
  fetchMealplans,
  formatMealplan,
  getMealplanTitle,
  getTodaysMealplan,
  sortMealplans,
} from "./mealplans.js";

export { getMensaBot };

async function replyWithTodaysMealplan(ctx) {
  const mealplans = await fetchMealplans();
  const todaysMealplan = getTodaysMealplan(mealplans);
  ctx.reply(todaysMealplan, { parse_mode: "MarkdownV2" });
}

async function getInlineQueryResults() {
  const mealplans = await fetchMealplans();

  return sortMealplans(mealplans).map((mealplan) =>
    InlineQueryResultBuilder.article(
      mealplan.date,
      getMealplanTitle(mealplan.date),
    ).text(
      formatMealplan(mealplan),
      { parse_mode: "MarkdownV2" },
    )
  );
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
    await ctx.answerInlineQuery(await getInlineQueryResults(), {
      cache_time: 0,
    });
  });

  return bot;
}
