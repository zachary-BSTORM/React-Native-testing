import { Stack } from "expo-router";
import { TodoProvider } from "./context/todoContext";
import Navbar from "./components/Navbar";

export default function RootLayout() {
  return (
    <TodoProvider>
      <Navbar/>
      <Stack 
        screenOptions={{ headerShown: false }}
      />
    </TodoProvider>
  );
}
