// app/_layout.tsx

import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../src/context/AuthProvider";

export default function RootLayout() {
  const { user, initializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initializing) return;

    if (!user) {
      router.replace("/(auth)/signin");
    } else {
      router.replace("/(tabs)/entries");
    }
  }, [user, initializing]);

  return <Slot />;
}







