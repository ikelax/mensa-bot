import { expect, it } from "vitest";
import { formatDate } from "../formatDate.js";

it("formats 2025-01-06T00:00:00.000Z", () => {
  expect(formatDate("2025-01-06T00:00:00.000Z")).toBe("Montag, 06.01.2025");
});

it("formats 2024-12-27T12:12:12.123Z", () => {
  expect(formatDate("2024-12-27T12:12:12.123Z")).toBe("Freitag, 27.12.2024");
});
