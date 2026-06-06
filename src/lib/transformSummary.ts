const SUMMARY_MAX_LENGTH = 80;

export function deriveTransformSummary(description: string): string {
  const firstLine =
    description
      .trim()
      .split("\n")
      .map((line) => line.trim())
      .find((line) => line.length > 0) ?? "";

  if (firstLine.length <= SUMMARY_MAX_LENGTH) {
    return firstLine;
  }

  return `${firstLine.slice(0, SUMMARY_MAX_LENGTH - 3)}...`;
}
