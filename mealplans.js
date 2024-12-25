import { isToday } from "date-fns";
import ky from "ky";

export { fetchMealplans, getTodaysMealplan };

const linkToMealplan = "[Speiseplan](https://mensaar.de/#/menu/sb)";

/**
 * Fetches the mealplans from the Mensaar page.
 *
 * @returns the mealplans
 */
async function fetchMealplans() {
  const url = "https://mensaar.de/api/2/TFtD8CTykAXXwrW4WBU4/1/de/getMenu/sb";
  return await ky.get(url).json();
}

/**
 * Finds the mealplan for today and returns it formatted in Markdown.
 * If it does not find a mealplan for today, it returns a message
 * indicating this.
 *
 * @param {*} mealplans an object with mealplans
 * @returns {string} the mealplan for today or the message that there is
 * no food today
 */
function getTodaysMealplan(mealplans) {
  const todaysMealplan = mealplans.days.find((day) => isToday(day.date));

  if (todaysMealplan == undefined) {
    return "Heute gibt es kein Essen in der Mensa\\!\n\n" + linkToMealplan;
  }

  return formatMealplan(todaysMealplan);
}

/**
 * Formats the mealplan in Markdown.
 *
 * Usually, the mealplan of the mensa contains a section with
 * information which is excluded in the formatted mealplan.
 *
 * @param {*} mealplan the mealplan to format
 * @returns {string} the formatted mealplan
 */
function formatMealplan(mealplan) {
  const counters = mealplan.counters.filter((meal) => meal.id !== "info");
  const formattedCounters = counters
    .map((counter) => formatCounter(counter))
    .join("\n\n")
    // Characters that have to be escaped in the Markdown style of Telegram.
    // https://core.telegram.org/bots/api#markdownv2-style
    .replaceAll("-", "\\-")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)");

  return formattedCounters + "\n\n" + linkToMealplan;
}

/**
 * Formats the mealplan for the counter in Markdown.
 *
 * The mensa has many counters that offer meals.
 *
 * @param {*} counter the mealplan for the counter to format
 * @returns {string} the formatted mealplan for the counter
 */
function formatCounter(counter) {
  const title = `__*${counter.displayName} - ${counter.description}*__\n`;
  const meals = counter.meals
    .map((meal) => formatMeal(meal))
    .join("\n\n");

  return title + meals;
}

/**
 * Formats the meal in Markdown.
 *
 * In the mensa meals are handed out by counters.
 *
 * @param {*} meal the meal to format
 * @returns {string} the formatted meal
 */
function formatMeal(meal) {
  const price = meal?.prices?.s ?? "???";
  const mealTitle = `${meal.name} für ${price}€`;

  if (meal.name === "Salatbuffet" || meal.components.length === 0) {
    return mealTitle;
  }

  const extras = meal.components
    .map((component) => component.name)
    .join("\n");
  return mealTitle + "\n" + extras;
}
