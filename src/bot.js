import { Bot, InlineKeyboard, InlineQueryResultBuilder } from "grammy";
import {
  fetchMealplans,
  formatMealplan,
  getMealplanOnDate,
  getMealplanTitle,
  sortMealplans,
} from "./mealplans.js";
import { formatDate } from "./formatDate.js";
import { addDays } from "date-fns";
import { TZDate } from "@date-fns/tz";

export { getMensaBot };

function getInlineKeyboard(mealplans) {
  const labelDataPairs = mealplans.days.map((day) => [
    formatDate(day.date),
    day.date,
  ]);
  const buttonRow = labelDataPairs.map(([label, data]) =>
    InlineKeyboard.text(label, data),
  );
  return InlineKeyboard.from([buttonRow]).toTransposed();
}

async function replyWithMealplanOnDate(ctx, date, messageIfNoMealplanIsFound) {
  const mealplans = await fetchMealplans();
  const mealplanOnDate = getMealplanOnDate(
    mealplans,
    date,
    messageIfNoMealplanIsFound,
  );
  ctx.reply(mealplanOnDate, {
    parse_mode: "MarkdownV2",
  });
}

async function replyWithListOfMealplanDates(ctx) {
  const mealplans = await fetchMealplans();
  const inlineKeyboard = getInlineKeyboard(mealplans);
  ctx.reply("Choose a meal plan.", {
    reply_markup: inlineKeyboard,
  });
}

async function getInlineQueryResults() {
  const mealplans = await fetchMealplans();

  return sortMealplans(mealplans).map((mealplan) =>
    InlineQueryResultBuilder.article(
      mealplan.date,
      getMealplanTitle(mealplan.date),
    ).text(formatMealplan(mealplan), { parse_mode: "MarkdownV2" }),
  );
}

/**
 * @returns The current time in Germany's time zone
 */
function getTime() {
  return TZDate.tz("Europe/Berlin");
}

/**
 * @param {string} token the token to access the HTTP API of Telegram
 * @returns the bot for tasks related to the Mensa
 */
function getMensaBot(token) {
  const bot = new Bot(token);

  bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
  bot.command(["days", "d", "m", "mealplans", "meals", "menus"], (ctx) =>
    replyWithListOfMealplanDates(ctx),
  );
  bot.command(["t", "tomorrow"], (ctx) =>
    replyWithMealplanOnDate(
      ctx,
      addDays(getTime(), 1),
      "Morgen gibt es kein Essen in der Mensa\\!",
    ),
  );
  bot.command("time", (ctx) => ctx.reply(getTime()));
  bot.on("message", (ctx) =>
    replyWithMealplanOnDate(
      ctx,
      getTime(),
      "Heute gibt es kein Essen in der Mensa\\!",
    ),
  );
  bot.on("callback_query:data", async (ctx) => {
    replyWithMealplanOnDate(
      ctx,
      ctx.callbackQuery.data,
      "An dem Tag gibt es kein Essen in der Mensa\\!",
    );
    await ctx.answerCallbackQuery();
  });
  bot.on("inline_query", async (ctx) => {
    await ctx.answerInlineQuery(await getInlineQueryResults(), {
      cache_time: 0,
    });
  });

  return bot;
}
