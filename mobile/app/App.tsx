import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileScreen from './components/ProfileScreen';
import LoginScreen from './components/LoginScreen';
import AIAssistantChat from './components/AIAssistantChat';
import { Colors } from './app/constants/theme';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Check for stored JWT token on launch
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error reading auth token:', error);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screen}>
        {isAuthenticated ? (
          <ProfileScreen />
        ) : (
          <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />
        )}
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});