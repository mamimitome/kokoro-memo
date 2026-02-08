import { auth, db } from "@/src/firebase";
import { EMOTIONS } from "@/src/lib/emotions";
import { useLocalSearchParams, useRouter } from "expo-router";
import { deleteDoc, doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";


export default function EditEntryScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const user = auth.currentUser;

  const [text, setText] = useState("");
  const [emotion, setEmotion] = useState<string>("");
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

    await updateDoc(
      doc(db, "users", user.uid, "entries", id as string),
      {
        text,
        emotion,
        updatedAt: Timestamp.now(),
      }
    );

    router.replace(`/entries/${id}`);
  };

  const handleDelete = async () => {
    if (!user) return;

    await deleteDoc(doc(db, "users", user.uid, "entries", id as string));
    router.replace("/(tabs)/entries");
  };

  if (loading) return <Text>読み込み中...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>内容</Text>
      <TextInput
        style={styles.input}
        multiline
        value={text}
        onChangeText={setText}
      />

      <Text style={styles.label}>感情</Text>
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
      <Button title="削除" color="red" onPress={handleDelete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20 },
  label: { marginTop:12, marginBottom:6, fontWeight:"bold" },
  input: {
    borderWidth:1,
    borderColor:"#ccc",
    borderRadius:8,
    padding:12,
    minHeight:120,
    textAlignVertical:"top",
  },
  row: { flexDirection:"row", flexWrap:"wrap", gap:8, marginVertical:10 },
  moodBtn: {
    borderWidth:1,
    borderColor:"#ccc",
    padding:12,
    borderRadius:8,
  },
  selected: {
    borderColor:"#007aff",
    borderWidth:2,
  }
});

