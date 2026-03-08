import { useAuth } from "@/src/context/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs, useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, initializing } = useAuth();

  if (initializing)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );

  if (!user) return <Redirect href="/(auth)/signin" />;

  return children;
}

export default function TabsLayout() {
  const router = useRouter();

  return (
    <AuthGate>
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: "#ffffff",
          },
          headerTitleStyle: {
            fontWeight: "600",
          },

          tabBarActiveTintColor: "#4A90E2",
          tabBarInactiveTintColor: "#999",

          tabBarStyle: {
            backgroundColor: "white",
            borderTopWidth: 0,
            elevation: 10, // Android
            height: 70,
            paddingBottom: 10,
          },

          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
          },
        }}
      >
        {/* ✅ Entries */}
        <Tabs.Screen
          name="entries"
          options={{
            title: "記録",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list" size={size} color={color} />
            ),
            headerRight: () => (
              <Ionicons
                name="add-circle"
                size={30}
                color="#4A90E2"
                style={{ marginRight: 16 }}
                onPress={() => router.push("/(tabs)/entries/new")}
              />
            ),
          }}
        />

        {/* ✅ Profile */}
        <Tabs.Screen
          name="profile"
          options={{
            title: "プロフィール",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />

        {/* ❌ 非表示ページ */}
        <Tabs.Screen name="entries/new" options={{ href: null }} />
        <Tabs.Screen name="entries/[id]" options={{ href: null }} />
        <Tabs.Screen name="entries/[id]/edit" options={{ href: null }} />
      </Tabs>
    </AuthGate>
  );
}
