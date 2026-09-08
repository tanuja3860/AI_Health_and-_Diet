import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Colors } from '../app/constants/theme';

const AVAILABLE_CONDITIONS = [
  { id: 'pregnancy', label: 'Pregnancy' },
  { id: 'diabetes', label: 'Type 2 Diabetes' },
  { id: 'hypertension', label: 'Hypertension' },
  { id: 'kidney_disease', label: 'Kidney Disease' },
  { id: 'celiac', label: 'Celiac Disease' },
];

export default function ProfileScreen() {
  const [profile, setProfile] = useState({
    age: '30',
    weight: '70',
    height: '170',
    conditions: ['diabetes'] as string[],
  });

  const toggleCondition = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      conditions: prev.conditions.includes(id)
        ? prev.conditions.filter((c) => c !== id)
        : [...prev.conditions, id],
    }));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Health Profile Setup</Text>
      <Text style={styles.subtitle}>Configure medical condition flags for AI evaluations</Text>

      <Text style={styles.sectionLabel}>Active Conditions</Text>
      <View style={styles.chipContainer}>
        {AVAILABLE_CONDITIONS.map((cond) => {
          const active = profile.conditions.includes(cond.id);
          return (
            <TouchableOpacity
              key={cond.id}
              onPress={() => toggleCondition(cond.id)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {cond.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.sectionLabel}>Metrics</Text>
      <View style={styles.row}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Age</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={profile.age}
            onChangeText={(v) => setProfile({ ...profile, age: v })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={profile.weight}
            onChangeText={(v) => setProfile({ ...profile, weight: v })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Height (cm)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={profile.height}
            onChangeText={(v) => setProfile({ ...profile, height: v })}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Profile Settings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingTop: 60 },
  title: { fontSize: 22, fontWeight: 'bold', color: Colors.primary, marginBottom: 4 },
  subtitle: { fontSize: 13, color: Colors.textMuted, marginBottom: 24 },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 12 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 12, color: Colors.text, fontWeight: '500' },
  chipTextActive: { color: '#FFFFFF' },
  row: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  inputGroup: { flex: 1 },
  inputLabel: { fontSize: 12, color: Colors.textMuted, marginBottom: 6 },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: Colors.text,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
});