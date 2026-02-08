import { auth, db } from "@/src/firebase";
import { emotionToLabel } from "@/src/lib/emotions";
import { normalizeTimestamp } from "@/src/lib/normalize";
import { useRouter } from "expo-router";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, FlatList, Text, TouchableOpacity, View } from "react-native";

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

  if (loading) return <ActivityIndicator />;

  if (entries.length === 0)
    return (
      <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
        <Text>まだ記録がありません</Text>
        <Button title="新規作成" onPress={() => router.push("/(tabs)/entries/new")} />
      </View>
    );

  return (
    <FlatList
      data={entries}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={{
            padding: 16,
            borderBottomWidth: 1,
            borderColor: "#ddd",
            alignItems: "center",   // ← ★これ追加
          }}

          onPress={() => router.push(`/(tabs)/entries/${item.id}`)}
        >
          <Text style={{ fontSize: 32 }}>
          {emotionToLabel(item.emotion)}
          </Text>

          <Text numberOfLines={1}>{item.text}</Text>
          <Text style={{ fontSize:12, color:"#666" }}>
            <Text style={{ fontSize:12, color:"#666" }}>
              {normalizeTimestamp(item.createdAt)?.toLocaleString()}
            </Text>
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}
