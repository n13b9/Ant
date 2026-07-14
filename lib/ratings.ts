export const RATINGS = [
  { value: 1, label: "Poor" },
  { value: 2, label: "Okay" },
  { value: 3, label: "Good" },
  { value: 4, label: "Excellent" },
] as const;

export type RatingValue = (typeof RATINGS)[number]["value"];

export const RATING_LABELS: Record<number, string> = Object.fromEntries(
  RATINGS.map((r) => [r.value, r.label])
);

export function isValidRating(value: unknown): value is RatingValue {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 4;
}
