import { isBefore, isSameDay } from "date-fns";
import ky from "ky";
import { formatDate } from "./formatDate.js";

export {
  fetchMealplans,
  formatMealplan,
  getMealplanOnDate,
  getMealplanTitle,
  sortMealplans,
};

const linkToMealplan = "[Speiseplan](https://mensaar.de/#/menu/sb)";

/**
 * Fetches the meal plans from the Mensaar page.
 *
 * @returns the meal plans
 */
async function fetchMealplans() {
  const url = "https://mensaar.de/api/2/TFtD8CTykAXXwrW4WBU4/1/de/getMenu/sb";
  return await ky.get(url).json();
}

/**
 * Finds the meal plan on a specific date and returns it formatted in Markdown.
 * If it does not find a meal plan on the date, it returns the `defaultMessage`
 * with a link to the meal plan.
 *
 * @param {*} mealplans an object with meal plans
 * @param {number} timestamp the timestamp of the date
 * @param {string} defaultMessage the default message in case no meal plan is found
 * @returns {string} the meal plan for the date or the default message if no meal plan is found
 */
function getMealplanOnDate(mealplans, timestamp, defaultMessage) {
  const mealplan = findMealplanOnDate(mealplans, timestamp);

  if (mealplan === undefined) {
    return defaultMessage + "\n\n" + linkToMealplan;
  }

  return formatMealplan(mealplan);
}

/**
 * Formats the meal plan in Markdown.
 *
 * Usually, the meal plan of the mensa contains a section with
 * information which is excluded in the formatted meal plan.
 *
 * @param {*} mealplan the meal plan to format
 * @returns {string} the formatted meal plan
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
 * Formats the meal plan for the counter in Markdown.
 *
 * The mensa has many counters that offer meals.
 *
 * @param {*} counter the meal plan for the counter to format
 * @returns {string} the formatted meal plan for the counter
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

/**
 * Sorts the meal plans by their date. Meal plans with a date in the past
 * are place at the end. Meal plans not in the past are sorted in
 * ascending order. Meals plan in the past are sorted in descending
 * order.
 *
 * @param {*} mealplans the meal plans to sort
 * @returns the sorted meal plans
 */
function sortMealplans(mealplans) {
  const sortedPastMealplans = mealplans.days.filter((day) => day.isPast)
    .sort((dayA, dayB) => new Date(dayB.date) - new Date(dayA.date));
  const sortedFutureMealplans = mealplans.days.filter((day) => !day.isPast)
    .sort((dayA, dayB) => new Date(dayA.date) - new Date(dayB.date));

  return [...sortedFutureMealplans, ...sortedPastMealplans];
}

/**
 * Searches for a meal plan on a specific date in the meal plans object.
 *
 * @param {*} mealplans the meal plans to search
 * @param {number} timestamp the timestamp of the date
 * @returns {object | undefined} the meal plan for the date or undefined if it did not find the meal plan
 */
function findMealplanOnDate(mealplans, timestamp) {
  return mealplans.days.find((day) => isSameDay(day.date, timestamp));
}

/**
 * The title of the meal plan has the format
 *
 * "Montag, 06.01.2025 (heute)"
 * "Mittwoch, 17.10.2024 (vergangen)"
 * "Freitag, 24.06.2025"
 *
 * If the meal plan is for today, "(heute)" is added at the end.
 * If the meal plan is in the past, "(vergangen)" is added.
 *
 * @param {string} timestamp the date of the meal plan as a timestamp
 * @param {number | string} today the date of today, only required for tests
 * @returns {string} the title of the meal plan
 */
function getMealplanTitle(timestamp, today = Date.now()) {
  const date = formatDate(timestamp);

  if (isSameDay(timestamp, today)) {
    return `${date} (heute)`;
  }

  // The previous if-clause checks if today and timestamp are on the same day.
  // Hence, here timestamp can only be in the past or in the future such that
  // isBefore is only true if timestamp is the past.
  if (isBefore(timestamp, today)) {
    return `${date} (vergangen)`;
  }

  return date;
}
