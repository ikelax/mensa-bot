import { describe, expect, it } from "vitest";
import {
  formatMealplan,
  getMealplanOnDate,
  getMealplanTitle,
  sortMealplans,
} from "../mealplans";
import original_mealplans from "../fixtures/original_mealplans.json" with { type: "json" };
import unsorted_mealplans from "../fixtures/unsorted_mealplans.json" with { type: "json" };
import sorted_mealplans from "../fixtures/sorted_mealplans.json" with { type: "json" };

describe("getMealplanTitle", () => {
  it("returns the title for today's meal plan", () => {
    expect(
      getMealplanTitle("2025-10-21T00:00:00.000Z", "2025-10-21T07:34:23.000Z"),
    ).toBe("Dienstag, 21.10.2025 (heute)");
  });

  it("returns the title for a past meal plan", () => {
    expect(
      getMealplanTitle("2019-02-06T00:00:00.000Z", "2020-08-13T09:10:00.000Z"),
    ).toBe("Mittwoch, 06.02.2019 (vergangen)");
  });

  it("returns the title for a future meal plan", () => {
    expect(
      getMealplanTitle("1993-05-24T19:10:00.000Z", "1888-01-05T00:00:00.000Z"),
    ).toBe("Montag, 24.05.1993");
  });
});

describe("sortMealplans", () => {
  it("does not change an already sorted meal plans", () => {
    expect(sortMealplans(original_mealplans)).toEqual(original_mealplans.days);
  });

  it("sorts the meal plans", () => {
    expect(sortMealplans(unsorted_mealplans)).toEqual(sorted_mealplans.days);
  });
});

describe("getMealplanOnDate", () => {
  it("returns the default message if it does not find a meal plan", () => {
    const defaultMessage = "default message";
    expect(
      getMealplanOnDate(
        original_mealplans,
        "2025-10-11T00:00:00.000Z",
        defaultMessage,
      ),
    ).toBe(`${defaultMessage}\n\n[Speiseplan](https://mensaar.de/#/menu/sb)`);
  });

  it("returns the formatted meal plan", () => {
    expect(
      getMealplanOnDate(original_mealplans, "2025-01-31T00:00:00.000Z", ""),
    ).toBe(`__*Freitag, 31\\.01\\.2025*__

__*Wahlessen \\- Aufgang C*__
Changshou Nudelsuppe mit Rindfleisch für ???€

[Speiseplan](https://mensaar.de/#/menu/sb)`);
  });
});

describe("formatMealplan", () => {
  it("formats a meal plan with only one counter", () => {
    expect(formatMealplan(original_mealplans.days[5])).toBe(
      `__*Montag, 27\\.01\\.2025*__

__*Wahlessen \\- Aufgang C*__
Shizitóu Löwenkopf\\-Fleischbällchen für ???€
Basmatireis \\(aus biologischem Anbau\\)

[Speiseplan](https://mensaar.de/#/menu/sb)`,
    );
  });

  it("formats a meal plan with many counters", () => {
    expect(formatMealplan(original_mealplans.days[1])).toBe(
      `__*Dienstag, 07\\.01\\.2025*__

__*Menü 1 \\- Aufgang B*__
Chili sin carne für 3,10€
Nachos
Karottensalat
Sahnepudding

__*Menü 2 \\- Aufgang A*__
Hähnchenbrustfilet Toscana für 3,65€
Tomatensoße mit Gemüse
Reis \\(aus biologischem Anbau\\)
Alternativbeilage
Bunt gemischter Blattsalat
Weiße Salatsoße Dressing
Klare Salatsoße
Obst \\(Äpfel aus biologischem Anbau\\)

__*Wahlessen \\- Aufgang C*__
Hähnchenbrustfilet mit Spinat\\-Tomatensoße für ???€
Tagliatelle

Bunter Gemüseteller für ???€
Vegan: Kräuter\\-Dip
Gerstoni\\-Tomaten\\-Rucolasalat

Salatbuffet für 3,70€

__*Mensacafé \\- Erdgeschoss*__
Pizza Diavolo mit Peperoni, Salami und Paprika für ???€

Pizza vegetarisch mit Oliven, Paprika,Broccoli und getrockneten Tomaten für ???€

[Speiseplan](https://mensaar.de/#/menu/sb)`,
    );
  });
});
