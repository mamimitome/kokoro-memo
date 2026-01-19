import { auth, db } from "@/src/firebase";
import { useLocalSearchParams, useRouter } from "expo-router";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

const moods = ["嬉しい", "悲しい", "普通", "怒り", "好き"];

export default function EditEntryScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [text, setText] = useState("");
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(true);

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return; // userチェック

    const fetchData = async () => {
      const ref = doc(db, "users", user.uid, "entries", id as string);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setText(data.text);
        setMood(data.mood);
      }

      setLoading(false);
    };

    fetchData();
  }, [id, user]);

  const handleSave = async () => {
    if (!user) return; // ここ追加
    if (!mood || !text) return;

    const ref = doc(db, "users", user.uid, "entries", id as string);

    await updateDoc(ref, {
      mood,
      text,
    });

    router.replace(`/(tabs)/(entries)/${id}`);
  };

  const handleDelete = async () => {
    if (!user) return; // ここ追加

    Alert.alert("削除確認", "この日記を削除しますか？", [
      { text: "キャンセル", style: "cancel" },
      {
        text: "削除する",
        style: "destructive",
        onPress: async () => {
          const ref = doc(db, "users", user.uid, "entries", id as string);
          await deleteDoc(ref);
          router.replace("/(tabs)/(entries)");
        },
      },
    ]);
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>ログインしていません</Text>
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

  return (
    <View style={styles.container}>
      <Text>内容</Text>
      <TextInput
        style={styles.input}
        multiline
        value={text}
        onChangeText={setText}
      />

      <Text style={{ marginTop: 20 }}>感情を選択</Text>
      <View style={styles.moodContainer}>
        {moods.map((m) => (
          <Button
            key={m}
            title={m}
            onPress={() => setMood(m)}
            color={m === mood ? "#007aff" : undefined}
          />
        ))}
      </View>

      <View style={{ marginTop: 20 }}>
        <Button title="保存する" onPress={handleSave} />
      </View>

      <View style={{ marginTop: 20 }}>
        <Button title="削除する" onPress={handleDelete} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    textAlignVertical: "top",
  },
  moodContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
});
