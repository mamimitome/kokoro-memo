import { auth, db } from "@/src/firebase";
import { useRouter } from "expo-router";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

export default function EntriesListScreen() {
  const [entries, setEntries] = useState<any[]>([]);
  const router = useRouter();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const ref = collection(db, "users", user.uid, "entries");
    const q = query(ref, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setEntries(docs);
    });

    return () => unsub();
  }, [user]);

  if (!user) {
    return (
      <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
        <Text>ログインしてください</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/entries/${item.id}`)}
            style={{ padding:16, borderBottomWidth:1, borderColor:"#ddd" }}
          >
            <Text style={{ fontWeight:"bold", fontSize:16 }}>
              {item.mood ?? "(no mood)"}
            </Text>
            <Text>{item.createdAt?.toDate().toLocaleString()}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
