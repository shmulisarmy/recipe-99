const months = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
} as const;

function dateStringToTimestamp(dateString: string): number {
  const [, month, day, year] = dateString.split(" ");
  return new Date(Number(year), months[month as keyof typeof months], Number(day)).getTime();
}

export function sortDateStrings(dateStrings: string[]): string[] {
  return [...dateStrings].sort(
    (first, second) =>
      dateStringToTimestamp(first) - dateStringToTimestamp(second),
  );
}
