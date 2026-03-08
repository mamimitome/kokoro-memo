import { auth, db } from "@/src/firebase";
import { emotionToLabel } from "@/src/lib/emotions";
import { normalizeTimestamp } from "@/src/lib/normalize";
import { useRouter } from "expo-router";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function EntriesScreen() {
  console.log("Entries screen mounted"); // ←ここが「export直後」

  const router = useRouter();
  const user = auth.currentUser;

  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Entries useEffect - user:", user?.uid);

    if (!user) return;

    const ref = collection(db, "users", user.uid, "entries");
    const q = query(ref, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      console.log("Firestore snapshot:", snap.size, "docs");
      setEntries(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );

  if (entries.length === 0)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
          backgroundColor: "#f5f7fa",
        }}
      >
        <Text style={{ fontSize: 60, marginBottom: 16 }}>📝</Text>

        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            marginBottom: 8,
          }}
        >
          まだ記録がありません
        </Text>

        <Text
          style={{
            color: "#666",
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          今日の気持ちを残してみましょう
        </Text>

        <TouchableOpacity
          style={{
            backgroundColor: "#4A90E2",
            paddingVertical: 14,
            paddingHorizontal: 32,
            borderRadius: 12,
            elevation: 3,
          }}
          onPress={() => router.push("/(tabs)/entries/new")}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>新規作成</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <FlatList
      data={entries}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{
        padding: 16,
        paddingTop: 20,
        backgroundColor: "#f5f7fa",
      }}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={{
            backgroundColor: "white",
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            alignItems: "center",

            // iOS shadow
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,

            // Android shadow
            elevation: 4,
          }}
          onPress={() => router.push(`/(tabs)/entries/${item.id}`)}
        >
          <Text style={{ fontSize: 36 }}>{emotionToLabel(item.emotion)}</Text>

          <Text
            numberOfLines={1}
            style={{
              fontSize: 16,
              fontWeight: "600",
              marginTop: 8,
            }}
          >
            {item.text}
          </Text>

          <Text
            style={{
              fontSize: 12,
              color: "#888",
              marginTop: 6,
            }}
          >
            {normalizeTimestamp(item.createdAt)?.toLocaleString()}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}
