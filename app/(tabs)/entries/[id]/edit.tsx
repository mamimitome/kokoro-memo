import { auth, db } from "@/src/firebase";
import { EMOTIONS } from "@/src/lib/emotions";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  deleteDoc,
  doc,
  getDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EditEntryScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const user = auth.currentUser;

  const [text, setText] = useState("");
  const [emotion, setEmotion] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !id) return;

    const ref = doc(db, "users", user.uid, "entries", id as string);

    getDoc(ref).then((snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setText(data.text ?? "");
        setEmotion(data.emotion ?? "");
      }
      setLoading(false);
    });
  }, [id, user]);

  const handleSave = async () => {
    if (!user || !emotion || !text) return;

    await updateDoc(doc(db, "users", user.uid, "entries", id as string), {
      text,
      emotion,
      updatedAt: Timestamp.now(),
    });

    router.replace(`/entries/${id}`);
  };

  const handleDelete = async () => {
    if (!user) return;

    await deleteDoc(doc(db, "users", user.uid, "entries", id as string));
    router.replace("/(tabs)/entries");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>読み込み中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>今日の気持ち</Text>

        <View style={styles.emotionRow}>
          {EMOTIONS.map((e) => {
            const selected = emotion === e.value;

            return (
              <TouchableOpacity
                key={e.value}
                style={[
                  styles.emotionButton,
                  selected && styles.emotionSelected,
                ]}
                onPress={() => setEmotion(e.value)}
              >
                <Text style={styles.emotionText}>{e.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>内容</Text>

        <TextInput
          value={text}
          onChangeText={setText}
          style={[styles.input, styles.textArea]}
          placeholder="今日あったことを書いてみよう"
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>保存する</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteText}>削除する</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 20,
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

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },

  emotionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  emotionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F0F3F7",
    justifyContent: "center",
    alignItems: "center",
  },

  emotionSelected: {
    backgroundColor: "#D6E8FF",
  },

  emotionText: {
    fontSize: 28,
  },

  input: {
    backgroundColor: "#F0F3F7",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    fontSize: 16,
  },

  textArea: {
    height: 120,
    textAlignVertical: "top",
  },

  button: {
    backgroundColor: "#4A90E2",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  deleteButton: {
    marginTop: 16,
    padding: 12,
    alignItems: "center",
  },

  deleteText: {
    color: "#E53935",
    fontWeight: "600",
  },
});
