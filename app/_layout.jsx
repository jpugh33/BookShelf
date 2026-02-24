import { Stack, Slot } from "expo-router"
import { Colors } from "../constants/Colors"
import { useColorScheme } from "react-native"
import { StatusBar } from "expo-status-bar"
import { UserProvider } from "../contexts/UserContext"
import { useEffect } from "react";
import { BooksProvider } from "../contexts/BooksContext"

export default function RootLayout() {
  useEffect(() => {
    fetch("https://fra.cloud.appwrite.io/v1/health")
      .then(() => {
        console.log("Connected to Appwrite");
      })
      .catch((err) => {
        console.log("Failed to connect to Appwrite:", err);
      });
  }, []);

  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light

  return (
    <UserProvider>
      <BooksProvider>
        <StatusBar value="auto" />

        <Stack screenOptions={{
          headerStyle: { backgroundColor: theme.navBackground },
          headerTintColor: theme.title,
        }}>

          {/* Individual Screens */}
          <Stack.Screen name="index" options={{ title: "Home" }} />

          {/* Groups */}
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />

        </Stack>
      </BooksProvider>
    </UserProvider>
  )

    return <Slot />;
}