import { listenEntries } from "@/lib/entries";
import { useAuth } from "@/src/context/AuthProvider";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, FlatList, Text, View } from "react-native";

export default function EntriesTab() {
  const { user } = useAuth();
  const router = useRouter();

  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsub = listenEntries((items) => {
      setEntries(items);
      setLoading(false);
    });

    return () => unsub?.();
  }, [user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (entries.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ marginBottom: 16 }}>まだ記録がありません</Text>
        <Button title="新規作成" onPress={() => router.push("/entries/new")} />
      </View>
    );
  }

  return (
    <FlatList
      data={entries}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={{ padding: 16, borderBottomWidth: 1 }}>
          <Text>{item.text}</Text>
          <Text style={{ fontSize: 12, color: "#666" }}>
            {item.createdAt?.toLocaleString?.()}
          </Text>
        </View>
      )}
    />
  );
}

