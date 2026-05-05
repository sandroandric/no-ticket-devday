import { describe, expect, it } from "vitest";
import { clues, isFinalAnswer, normalizeAnswer } from "./gameData";

describe("No Ticket puzzle data", () => {
  it("has four ordered clues with unique fragments", () => {
    expect(clues).toHaveLength(4);
    expect(new Set(clues.map((clue) => clue.id)).size).toBe(4);
    expect(clues.map((clue) => clue.slot)).toEqual([1, 2, 3, 4]);
  });

  it("normalizes and accepts the kiosk phrase", () => {
    expect(normalizeAnswer(" proof-mode ")).toBe("PROOF MODE");
    expect(isFinalAnswer("proof mode")).toBe(true);
    expect(isFinalAnswer("PROOF")).toBe(true);
    expect(isFinalAnswer("ticket")).toBe(false);
  });
});
