import { format, isPast, isToday } from "date-fns";
import { de } from "date-fns/locale";
import ky from "ky";
import { MEALPLAN, NO_FOOD_MESSAGE } from "./dotenv-defaults";

export {
  fetchMealplans,
  formatMealplan,
  getMealplanTitle,
  getTodaysMealplan,
  sortMealplans,
};

const linkToMealplan = `[${MEALPLAN}](https://mensaar.de/#/menu/sb)`;
const dateFnsOptions = { locale: de };

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
  const todaysMealplan = findTodaysMealplan(mealplans);

  if (todaysMealplan == undefined) {
    return `${NO_FOOD_MESSAGE}\n\n` + linkToMealplan;
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

  const title = `__*${getMealplanTitle(mealplan.date)}*__`
    .replaceAll(".", "\\.");

  const formattedCounters = counters
    .map((counter) => formatCounter(counter))
    .join("\n\n")
    // Characters that have to be escaped in the Markdown style of Telegram.
    // https://core.telegram.org/bots/api#markdownv2-style
    .replaceAll("-", "\\-")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)");

  return title + "\n\n" + formattedCounters + "\n\n" + linkToMealplan;
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
  const mealTitle = `${meal.name} - ${price}€`;

  if (meal.name === "Salatbuffet" || meal.components.length === 0) {
    return mealTitle;
  }

  const extras = meal.components
    .map((component) => component.name)
    .join("\n");
  return mealTitle + "\n" + extras;
}

/**
 * Sorts the mealplans by their date. Mealsplan with a date in the past
 * are place at the end. Mealplans not in the past are sorted in
 * ascending order. Mealsplan in the past are sorted in descending
 * order.
 *
 * @param {*} mealplans the mealplans to sort
 * @returns the sorted mealplans
 */
function sortMealplans(mealplans) {
  const sortedPastMealplans = mealplans.days.filter((day) => day.isPast)
    .sort((dayA, dayB) => dayB - dayA);
  const sortedFutureMealplans = mealplans.days.filter((day) => !day.isPast)
    .sort((dayA, dayB) => dayA - dayB);

  return [...sortedFutureMealplans, ...sortedPastMealplans];
}

/**
 * Searches for todays mealplan in the mealplans object.
 *
 * @param {*} mealplans the mealplans to search
 * @returns {object | undefined} todays mealplan or undefined if it did not find the mealplan
 */
function findTodaysMealplan(mealplans) {
  return mealplans.days.find((day) => isToday(day.date));
}

/**
 * The title of the mealplan has the format
 *
 * "Montag, 06.01.2025 (heute)"
 * "Mittwoch, 17.10.2024 (vergangen)"
 * "Freitag, 24.06.2025"
 *
 * If the mealplan is for today, "(heute)" is added at the end.
 * If the mealplan is in the past, "(vergangen)" is added.
 *
 * @param {string} timestamp
 * @returns {string} the title of the mealplan
 */
function getMealplanTitle(timestamp) {
  const weekday = format(timestamp, "EEEE", dateFnsOptions);
  const date = format(timestamp, "P", dateFnsOptions);

  if (isToday(timestamp)) {
    return `${weekday}, ${date} (heute)`;
  }

  if (isPast(timestamp)) {
    return `${weekday}, ${date} (vergangen)`;
  }

  return `${weekday}, ${date}`;
}
