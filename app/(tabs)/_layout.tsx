import { useAuth } from "@/src/context/AuthProvider";
import { Redirect, Tabs } from "expo-router";

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, initializing } = useAuth();

  if (initializing) return null;
  if (!user) return <Redirect href="/(auth)/signin" />;

  return children;
}

export default function TabsLayout() {
  return (
    <AuthGate>
      <Tabs>
        <Tabs.Screen name="entries" options={{ title: "Entries" }} />
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      </Tabs>
    </AuthGate>
  );
}


