import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../src/firebase";

type Entry = {
  id: string;
  text: string;
  emotion?: string;
  createdAt: string;
};

export default function FilterEntriesScreen() {
  const { filter } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("ログインが必要です");
          setLoading(false);
          return;
        }

        const baseRef = collection(db, "users", user.uid, "entries");

        let q = query(baseRef, orderBy("createdAt", "desc"));

        // ▼ フィルタを emotion または date として扱う
        if (typeof filter === "string") {
          // **emotion フィルタ**
          const emotionFilters = ["happy", "sad", "angry", "anxious"];
          if (emotionFilters.includes(filter)) {
            q = query(
              baseRef,
              where("emotion", "==", filter),
              orderBy("createdAt", "desc")
            );
          }

          // **日付フィルタ (YYYY-MM-DD)**
          if (/^\d{4}-\d{2}-\d{2}$/.test(filter)) {
            q = query(
              baseRef,
              where("date", "==", filter),
              orderBy("createdAt", "desc")
            );
          }
        }

        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));

        setEntries(docs);
      } catch (e: any) {
        setError("読み込みに失敗しました");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [filter]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ padding: 24 }}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "600" }}>
        {String(filter)} の記録
      </Text>

      {entries.length === 0 && (
        <Text style={{ marginTop: 12, opacity: 0.6 }}>データがありません</Text>
      )}

      {entries.map((entry) => (
        <TouchableOpacity
          key={entry.id}
          onPress={() =>
            router.push(`/entries/${entry.id}`)
          }
          style={{
            padding: 12,
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 8,
          }}
        >
          <Text style={{ fontSize: 16 }}>{entry.text}</Text>
          {entry.emotion && (
            <Text style={{ fontSize: 13, opacity: 0.6 }}>
              emotion: {entry.emotion}
            </Text>
          )}
          <Text style={{ fontSize: 13, opacity: 0.6 }}>{entry.createdAt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
