import { describe, expect, it } from "vitest";
import { getMealplanTitle } from "../mealplans";

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
