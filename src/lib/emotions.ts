export const EMOTIONS = [
  { label: "😍", value: "happy" },
  { label: "😭", value: "sad" },
  { label: "😡", value: "angry" },
  { label: "😐", value: "neutral" },
];

export const emotionToLabel = (value: string) =>
  EMOTIONS.find((e) => e.value === value)?.label ?? "❓";

