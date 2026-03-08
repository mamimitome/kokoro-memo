import { auth, db } from "@/src/firebase";
import { emotionToLabel } from "@/src/lib/emotions";
import { normalizeTimestamp } from "@/src/lib/normalize";
import { useLocalSearchParams, useRouter } from "expo-router";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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

  if (!entry) {
    return (
      <View style={styles.loading}>
        <Text>読み込み中...</Text>
      </View>
    );
  }

  const handleDelete = async () => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "entries", id as string));
    router.replace("/(tabs)/entries");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.emoji}>{emotionToLabel(entry.emotion)}</Text>

        <Text style={styles.text}>{entry.text}</Text>

        <Text style={styles.date}>
          {normalizeTimestamp(entry.createdAt)?.toLocaleString()}
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push(`/(tabs)/entries/${id}/edit`)}
        >
          <Text style={styles.buttonText}>編集</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteText}>削除</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F7FA",
  },

  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },

  emoji: {
    fontSize: 40,
    marginBottom: 10,
  },

  text: {
    fontSize: 18,
    marginBottom: 10,
  },

  date: {
    fontSize: 12,
    color: "#666",
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#4A90E2",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },

  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },

  deleteButton: {
    padding: 12,
    alignItems: "center",
  },

  deleteText: {
    color: "#E53935",
    fontWeight: "600",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
