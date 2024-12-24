import ky from "ky";
import { Bot, InlineQueryResultBuilder } from "grammy";

export {getMensaBot}

function isToday(dateString) {
  var inputDate = new Date(dateString);
  var todaysDate = new Date();
  return inputDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0);
}

function test(mealplans) {
  const todaysMealplan = mealplans.days.find((day) => isToday(day.date));

  if (todaysMealplan == undefined) {
    return "Heute gibt es kein Essen in der Mensa\\!";
  }

  const counters = todaysMealplan.counters.filter((meal) => meal.id !== "info");

  return counters
    .map((counter) => {
      const counterTitle =
        `__*${counter.displayName} - ${counter.description}*__\n`;
      const meals = counter.meals;
      const mealsString = meals
        .map((meal) => {
          const price = meal?.prices?.s ?? "???";
          const mealTitle = `${meal.name} für ${price}€`;

          if (meal.name === "Salatbuffet") {
            return mealTitle;
          }

          if (meal.components.length === 0) {
            return mealTitle;
          }

          const extras = meal.components
            .map((component) => component.name)
            .join("\n");
          return mealTitle + "\n" + extras;
        })
        .join("\n\n");

      return counterTitle + mealsString;
    })
    .join("\n\n");
}

async function getMealplans() {
  const url = "https://mensaar.de/api/2/TFtD8CTykAXXwrW4WBU4/1/de/getMenu/sb";
  const mealplans = await ky.get(url).json();
  const escapedMealplans = test(mealplans)
    .replaceAll("-", "\\-")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)");
  const link = "[Speiseplan](https://mensaar.de/#/menu/sb)";
  return escapedMealplans + "\n\n" + link;
}

function getMensaBot(token) {
  const bot = new Bot(token);

  bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
  bot.on(
    "message",
    async (ctx) => ctx.reply(await getMealplans(), { parse_mode: "MarkdownV2" }),
  );
  bot.on("inline_query", async (ctx) => {
    const result = InlineQueryResultBuilder.article("id", "Mensa UdS").text(
      await getMealplans(),
      { parse_mode: "MarkdownV2" },
    );
    await ctx.answerInlineQuery([result], { cache_time: 0 });
  });

  return bot
}
