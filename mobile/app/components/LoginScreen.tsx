import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/login', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('userToken', data.access_token);
        onLoginSuccess();
      } else {
        Alert.alert('Login Failed', data.detail || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Network Error', 'Unable to connect to authentication server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clinical AI Login</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#94A3B8"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#94A3B8"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#0F172A' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#1E293B', color: '#F8FAFC', borderRadius: 8, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  button: { backgroundColor: '#38BDF8', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#0F172A', fontWeight: 'bold', fontSize: 16 },
});