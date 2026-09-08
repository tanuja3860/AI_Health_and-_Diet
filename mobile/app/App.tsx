import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import ProfileScreen from './components/ProfileScreen';
import AIAssistantChat from './components/AIAssistantChat';
import { Colors } from './app/constants/theme';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screen}>
        <ProfileScreen />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screen: {
    flex: 1,
  },
});