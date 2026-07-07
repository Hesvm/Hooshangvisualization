export type Greeting = { line1: string; line2: string };

const LINE_2 = "چطوری میتونم کمکت کنم؟";

/**
 * Time-of-day buckets and their Persian greeting phrases are unconfirmed —
 * placeholder values only, using the single known reference string
 * ("صبح بخیر") for the morning bucket until the other three are provided.
 */
function getTimeOfDayGreeting(hour: number): string {
  if (hour >= 5 && hour < 12) return "صبح بخیر";
  if (hour >= 12 && hour < 17) return "ظهر بخیر";
  if (hour >= 17 && hour < 21) return "عصر بخیر";
  return "شب بخیر";
}

export function getGreeting(name: string, date: Date): Greeting {
  const timeGreeting = getTimeOfDayGreeting(date.getHours());
  return {
    line1: `${timeGreeting} ${name}!`,
    line2: LINE_2,
  };
}
