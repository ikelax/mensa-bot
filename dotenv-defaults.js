export const START_MESSAGE = Deno.env.get("START_MESSAGE") ??
  "Welcome! Up and running.";
export const MEALPLAN = Deno.env.get("MEALPLAN") ?? "Speiseplan";
export const NO_FOOD_MESSAGE = Deno.env.get("NO_FOOD_MESSAGE") ??
  "Heute gibt es kein Essen in der Mensa!";
