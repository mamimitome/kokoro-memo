import { Stack } from "expo-router";

export default function EntriesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="new"
        options={{ title: "新規作成" }}
      />
      <Stack.Screen
        name="[id]"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="[id]/edit"
        options={{ title: "編集" }}
      />
    </Stack>
  );
}
