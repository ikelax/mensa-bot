import { describe, expect, it } from "vitest";
import {getMealplanTitle, sortMealplans} from "../mealplans";
import original_mealplans from '../fixtures/original_mealplans.json' assert { type: 'json' };
import unsorted_mealplans from '../fixtures/unsorted_mealplans.json' assert { type: 'json' };
import sorted_mealplans from '../fixtures/sorted_mealplans.json' assert { type: 'json' };

describe("getMealplanTitle", () => {
  it("returns the title for today's meal plan", () => {
    expect(
      getMealplanTitle("2025-10-21T00:00:00.000Z", "2025-10-21T07:34:23.000Z"),
    )
      .toBe("Dienstag, 21.10.2025 (heute)");
  });

  it("returns the title for a past meal plan", () => {
    expect(
      getMealplanTitle("2019-02-06T00:00:00.000Z", "2020-08-13T09:10:00.000Z"),
    )
      .toBe("Mittwoch, 06.02.2019 (vergangen)");
  });

  it("returns the title for a future meal plan", () => {
    expect(
      getMealplanTitle("1993-05-24T19:10:00.000Z", "1888-01-05T00:00:00.000Z"),
    )
      .toBe("Montag, 24.05.1993");
  });
});

describe('sortMealplans', () => {
  it('does not change an already sorted meal plans', () => {
    expect(sortMealplans(original_mealplans)).toEqual(original_mealplans.days);
  })

  it('sorts the meal plans', () => {
    expect(sortMealplans(unsorted_mealplans)).toEqual(sorted_mealplans.days);
  })
})
