import { getEntry } from "@/lib/entries";
import { auth } from "@/src/firebase"; // ←★追加
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, StyleSheet, Text, View } from "react-native";

export default function EntryDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [entry, setEntry] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const data = await getEntry(id as string);
      setEntry(data);
      setLoading(false);
    };

    load();
  }, [id, user]);

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>ログインしていません。</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!entry) {
    return (
      <View style={styles.center}>
        <Text>データがありません。</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.mood}>気分: {entry.emotion}</Text>
      <Text style={styles.text}>{entry.text}</Text>

      <Text style={{ marginTop: 12 }}>
        作成: {entry.createdAt?.toLocaleString?.() ?? "-"}
      </Text>

      <View style={{ marginTop: 24 }}>
        <Button title="編集する" onPress={() => router.push(`/entries/${id}/edit`)} />
      </View>

      <View style={{ marginTop: 24 }}>
        <Button title="戻る" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  container: { flex: 1, padding: 20 },
  mood: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  text: { fontSize: 16, lineHeight: 22 },
});
