import { auth } from "@/src/firebase";
import { Button, Text, View } from "react-native";

export default function ProfileScreen() {
  const user = auth.currentUser;

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 8 }}>Profile</Text>
      <Text>Email: {user?.email}</Text>

      <Button title="ログアウト" onPress={() => auth.signOut()} />
    </View>
  );
}

