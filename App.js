import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import BackgroundTemplate from "./components/Background/BackgroundTemplate";

export default function App() {
  return (
    <View style={styles.container}>
      <BackgroundTemplate></BackgroundTemplate>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
