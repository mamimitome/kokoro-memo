import { auth, db } from "@/src/firebase";
import { emotionToLabel } from "@/src/lib/emotions";
import { normalizeTimestamp } from "@/src/lib/normalize";
import { useLocalSearchParams, useRouter } from "expo-router";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function EntryDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const user = auth.currentUser;

  const [entry, setEntry] = useState<any>(null);

  useEffect(() => {
    if (!user || !id) return;

    const ref = doc(db, "users", user.uid, "entries", id as string);

    getDoc(ref).then((snap) => {
      if (snap.exists()) {
        setEntry({ id, ...snap.data() });
      }
    });
  }, [id, user]);

  if (!entry) return <Text>読み込み中...</Text>;

  const handleDelete = async () => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "entries", id as string));
    router.replace("/(tabs)/entries");
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 40 }}>
        {emotionToLabel(entry.emotion)}
      </Text>

      <Text style={styles.text}>{entry.text}</Text>

      <Text style={styles.date}>
        {normalizeTimestamp(entry.createdAt)?.toLocaleString()}
      </Text>

      <Button title="編集" onPress={() => router.push(`/(tabs)/entries/${id}/edit`)} />

      <View style={{ height:10 }} />
      <Button title="削除" color="red" onPress={handleDelete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20 },
  text: { fontSize:18, marginTop:10 },
  date: { marginTop:10, fontSize:12, color:"#666" }
});

