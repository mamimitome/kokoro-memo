import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../src/firebase";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)/entries");
    } catch (err: any) {
      setMsg(err.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f7fa" }}>
      <View
        style={{
          flex: 1,
          padding: 24,
          justifyContent: "center",
        }}
      >
        {/* タイトル */}
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <Text style={{ fontSize: 28, fontWeight: "bold" }}>KOKORO MEMO</Text>
          <Text style={{ color: "#666", marginTop: 8 }}>アカウント作成</Text>
        </View>

        {/* Email */}
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          style={{
            backgroundColor: "white",
            borderRadius: 8,
            padding: 14,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#ddd",
          }}
        />

        {/* Password */}
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{
            backgroundColor: "white",
            borderRadius: 8,
            padding: 14,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: "#ddd",
          }}
        />

        {/* 登録ボタン */}
        <View
          style={{
            backgroundColor: "#4A90E2",
            padding: 14,
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          <Text
            style={{ color: "white", textAlign: "center", fontWeight: "bold" }}
            onPress={handleSignUp}
          >
            登録する
          </Text>
        </View>

        {/* ログインへ戻る */}
        <Text
          style={{
            textAlign: "center",
            color: "#4A90E2",
            marginTop: 12,
          }}
          onPress={() => router.push("/(auth)/signin")}
        >
          ログインへ戻る
        </Text>

        <Text style={{ color: "red", marginTop: 16 }}>{msg}</Text>
      </View>
    </SafeAreaView>
  );
}
