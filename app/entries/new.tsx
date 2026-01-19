import { auth, db } from "@/src/firebase";
import { useRouter } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const moods = ["嬉しい", "悲しい", "普通", "怒り", "好き"];

export default function NewEntryScreen() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [mood, setMood] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const user = auth.currentUser;

  const handleSave = async () => {
    if (!mood || !text || !user) return;

    setLoading(true);

    const now = new Date();

    await addDoc(collection(db, "users", user.uid, "entries"), {
      text,
      emotion: mood, // ←統一
      date: now.toISOString().slice(0, 10), // YYYY-MM-DD
      createdAt: now.toISOString(), // ソート用
    });

    setLoading(false);
    router.replace("/(tabs)/entries");
  };

  if (!user) {
    return <Text>ログインしていません</Text>;
  }

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

      <View style={styles.moods}>
        {moods.map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.moodBtn, mood === m && styles.moodSelected]}
            onPress={() => setMood(m)}
          >
            <Text>{m}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? <ActivityIndicator /> : <Button title="保存" onPress={handleSave} />}
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
  moods: { flexDirection: "row", gap: 8, marginTop: 10 },
  moodBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6
  },
  moodSelected: {
    borderWidth: 2,
    borderColor: "#007aff",
  }
});
