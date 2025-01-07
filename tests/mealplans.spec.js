import { describe, expect, it, vi } from "vitest";
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
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers();
  });

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers();
  });

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

  it("returns the title for tomorrow's meal plan", () => {
    vi.setSystemTime(new Date("3001-03-18T18:17:00.000Z"));
    expect(getMealplanTitle("3001-03-19T00:00:12.345Z")).toBe(
      "Donnerstag, 19.03.3001 (morgen)",
    );
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
      getMealplanOnDate(
        original_mealplans,
        "2025-01-31T00:00:00.000Z",
        "",
        "2024-01-11T00:00:00.000Z",
      ),
    ).toBe(`__*Freitag, 31\\.01\\.2025*__

__*Wahlessen \\- Aufgang C*__
Changshou Nudelsuppe mit Rindfleisch für ???€

[Speiseplan](https://mensaar.de/#/menu/sb)`);
  });
});

describe("formatMealplan", () => {
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers();
  });

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers();
  });

  it("formats a meal plan with only one counter", () => {
    expect(
      formatMealplan(original_mealplans.days[5], "1000-10-10T00:00:00.000Z"),
    ).toBe(
      `__*Montag, 27\\.01\\.2025*__

__*Wahlessen \\- Aufgang C*__
Shizitóu Löwenkopf\\-Fleischbällchen für ???€
Basmatireis \\(aus biologischem Anbau\\)

[Speiseplan](https://mensaar.de/#/menu/sb)`,
    );
  });

  it("formats a meal plan with many counters", () => {
    expect(
      formatMealplan(original_mealplans.days[1], "2025-01-01T00:00:00.000Z"),
    ).toBe(
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

  it("escapes the brackets for (heute) in the meal plan title", () => {
    expect(
      formatMealplan(original_mealplans.days[8], "2025-01-30T01:30:25.200Z"),
    ).toBe(
      `__*Donnerstag, 30\\.01\\.2025 \\(heute\\)*__

__*Wahlessen \\- Aufgang C*__
Kourou gedämpfter Schweinebauch für ???€
Basmatireis \\(aus biologischem Anbau\\)
Broccoligemüse

[Speiseplan](https://mensaar.de/#/menu/sb)`,
    );
  });

  it("escapes the brackets for (vergangen) in the meal plan title", () => {
    expect(
      formatMealplan(original_mealplans.days[7], "2025-03-14T11:05:00.000Z"),
    ).toBe(
      `__*Mittwoch, 29\\.01\\.2025 \\(vergangen\\)*__

__*Wahlessen \\- Aufgang C*__
Gebratene Nudeln mit Sojastreifen für ???€

[Speiseplan](https://mensaar.de/#/menu/sb)`,
    );
  });

  it("escapes the brackets for (morgen) in the meal plan title", () => {
    vi.setSystemTime("2025-01-27T23:59:59.999Z");
    expect(formatMealplan(original_mealplans.days[6])).toBe(
      `__*Dienstag, 28\\.01\\.2025 \\(morgen\\)*__

__*Wahlessen \\- Aufgang C*__
Yú gedünsteter Kabeljau mit Gemüse für ???€
Schmorkartoffeln Gamja Jorim

[Speiseplan](https://mensaar.de/#/menu/sb)`,
    );
  });
});
