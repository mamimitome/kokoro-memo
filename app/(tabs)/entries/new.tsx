import { auth, db } from "@/src/firebase";
import { EMOTIONS } from "@/src/lib/emotions";
import { useRouter } from "expo-router";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function NewEntryScreen() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [emotion, setEmotion] = useState<string | null>(null);

  const user = auth.currentUser;

  const handleSave = async () => {
    if (!user || !emotion || !text) return;

    await addDoc(collection(db, "users", user.uid, "entries"), {
      text,
      emotion,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    router.back()
  };

  if (!user) return <Text>ログインしてください</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>内容</Text>
      <TextInput
        style={styles.input}
        multiline
        value={text}
        onChangeText={setText}
      />

      <Text style={styles.label}>気分</Text>
      <View style={styles.row}>
        {EMOTIONS.map((m) => (
          <TouchableOpacity
            key={m.value}
            style={[styles.moodBtn, emotion === m.value && styles.selected]}
            onPress={() => setEmotion(m.value)}
          >
            <Text style={{ fontSize: 24 }}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="保存" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { marginTop: 12, marginBottom: 6, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    textAlignVertical: "top"
  },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginVertical: 10 },
  moodBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
  },
  selected: {
    borderColor: "#007aff",
    borderWidth: 2,
  }
});

