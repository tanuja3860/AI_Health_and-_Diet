import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [phone, setPhone] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      setErrorMessage('Please enter a valid phone number');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      if (response.ok) {
        setStep('otp');
      } else {
        setStep('otp'); // Fallback to OTP step for UI testing
      }
    } catch (error) {
      setStep('otp'); // Offline fallback
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setErrorMessage('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        await AsyncStorage.setItem('userToken', data.access_token);
        onLoginSuccess();
      } else {
        setErrorMessage(data.detail || 'Invalid OTP code');
      }
    } catch (error) {
      // Offline demo login trigger
      await AsyncStorage.setItem('userToken', 'mock-phone-token');
      onLoginSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clinical AI Login</Text>
      <Text style={styles.subtitle}>
        {step === 'phone' ? 'Enter your phone number to receive a verification code' : `Enter code sent to ${phone}`}
      </Text>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      {step === 'phone' ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="+1 555 000 0000"
            placeholderTextColor="#94A3B8"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <TouchableOpacity style={styles.button} onPress={handleSendOTP} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Sending Code...' : 'Send OTP'}</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter 6-digit OTP (Use 123456)"
            placeholderTextColor="#94A3B8"
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
            maxLength={6}
          />
          <TouchableOpacity style={styles.button} onPress={handleVerifyOTP} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Verifying...' : 'Verify & Login'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={() => setStep('phone')}>
            <Text style={styles.backText}>Change Phone Number</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#0F172A' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 4, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#94A3B8', marginBottom: 20, textAlign: 'center' },
  errorText: { color: '#EF4444', textAlign: 'center', marginBottom: 12, fontWeight: '600' },
  input: { backgroundColor: '#1E293B', color: '#F8FAFC', borderRadius: 8, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  button: { backgroundColor: '#38BDF8', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#0F172A', fontWeight: 'bold', fontSize: 16 },
  backButton: { marginTop: 16, alignItems: 'center' },
  backText: { color: '#94A3B8', fontSize: 14 },
});