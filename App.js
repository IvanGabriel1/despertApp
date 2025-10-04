import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import TabNavigator from "./src/Navigation/TabNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { AlarmaProvider } from "./src/Context/AlarmaContext";

export default function App() {
  return (
    <AlarmaProvider>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
      <StatusBar style="auto" />
    </AlarmaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
