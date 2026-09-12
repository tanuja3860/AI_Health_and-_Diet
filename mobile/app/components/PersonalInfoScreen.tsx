import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PersonalInfo {
  fullName: string;
  phone: string;
  age: string;
  gender: string;
  heightCm: string;
  weightKg: string;
  address: string;
}

export default function PersonalInfoScreen({ onNext }: { onNext: () => void }) {
  const [info, setInfo] = useState<PersonalInfo>({
    fullName: '',
    phone: '',
    age: '',
    gender: '',
    heightCm: '',
    weightKg: '',
    address: '',
  });

  useEffect(() => {
    loadSavedInfo();
  }, []);

  const loadSavedInfo = async () => {
    try {
      const saved = await AsyncStorage.getItem('user_personal_info');
      if (saved) setInfo(JSON.parse(saved));
    } catch (e) {
      console.error('Failed to load personal info');
    }
  };

  const handleNext = async () => {
    if (!info.fullName || !info.phone) {
      Alert.alert('Required Fields', 'Please enter at least your Name and Phone Number.');
      return;
    }

    try {
      await AsyncStorage.setItem('user_personal_info', JSON.stringify(info));
      onNext();
    } catch (e) {
      Alert.alert('Error', 'Could not save personal info.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Step 1: Personal Details</Text>
      <Text style={styles.subtitle}>Enter your personal and contact details:</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Alex Smith"
        placeholderTextColor="#94A3B8"
        value={info.fullName}
        onChangeText={val => setInfo(prev => ({ ...prev, fullName: val }))}
      />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. +1 555-0199"
        placeholderTextColor="#94A3B8"
        keyboardType="phone-pad"
        value={info.phone}
        onChangeText={val => setInfo(prev => ({ ...prev, phone: val }))}
      />

      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>Age (years)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 45"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            value={info.age}
            onChangeText={val => setInfo(prev => ({ ...prev, age: val }))}
          />
        </View>
        <View style={styles.half}>
          <Text style={styles.label}>Gender</Text>
          <TextInput
            style={styles.input}
            placeholder="Male / Female / Other"
            placeholderTextColor="#94A3B8"
            value={info.gender}
            onChangeText={val => setInfo(prev => ({ ...prev, gender: val }))}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>Height (cm)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 175"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            value={info.heightCm}
            onChangeText={val => setInfo(prev => ({ ...prev, heightCm: val }))}
          />
        </View>
        <View style={styles.half}>
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 75"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            value={info.weightKg}
            onChangeText={val => setInfo(prev => ({ ...prev, weightKg: val }))}
          />
        </View>
      </View>

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Street address, city, zip code..."
        placeholderTextColor="#94A3B8"
        multiline
        numberOfLines={3}
        value={info.address}
        onChangeText={val => setInfo(prev => ({ ...prev, address: val }))}
      />

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next: Medical Profile →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#0F172A' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#94A3B8', marginBottom: 16 },
  label: { fontSize: 13, fontWeight: 'bold', color: '#38BDF8', marginBottom: 4, marginTop: 6 },
  input: {
    backgroundColor: '#1E293B',
    color: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    fontSize: 14,
    marginBottom: 10,
  },
  textArea: { height: 70, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  button: {
    backgroundColor: '#38BDF8',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: { color: '#0F172A', fontWeight: 'bold', fontSize: 16 },
});