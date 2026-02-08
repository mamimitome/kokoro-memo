import { Timestamp } from "firebase/firestore";

export function normalizeTimestamp(value: any): Date | null {
  if (!value) return null;

  try {
    if (value instanceof Timestamp) return value.toDate();
    if (typeof value === "string") return new Date(value);
    if (value instanceof Date) return value;
  } catch (e) {
    return null;
  }

  return null;
}
