import { useAuth } from "@/src/context/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs, useRouter } from "expo-router";

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, initializing } = useAuth();

  if (initializing) return null;
  if (!user) return <Redirect href="/(auth)/signin" />;

  return children;
}

export default function TabsLayout() {
  const router = useRouter();

  return (
    <AuthGate>
      <Tabs>
        {/* ✅ Entries（＋ボタン付き） */}
        <Tabs.Screen
          name="entries"
          options={{
            title: "Entries",
            headerRight: () => (
              <Ionicons
                name="add-circle-outline"
                size={28}
                color="#007aff"
                style={{ marginRight: 12 }}
                onPress={() => router.push("/(tabs)/entries/new")}
              />
            ),
          }}
        />

        {/* ✅ Profile */}
        <Tabs.Screen
          name="profile"
          options={{ title: "Profile" }}
        />

        {/* ❌ タブ非表示（内部ページ） */}
        <Tabs.Screen name="entries/new" options={{ href: null }} />
        <Tabs.Screen name="entries/[id]" options={{ href: null }} />
        <Tabs.Screen name="entries/[id]/edit" options={{ href: null }} />
      </Tabs>
    </AuthGate>
  );
}


