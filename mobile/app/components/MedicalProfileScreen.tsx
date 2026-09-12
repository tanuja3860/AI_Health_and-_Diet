import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MedicalProfile {
  selectedDiseases: string[];
  customDiseases: string;
  selectedAllergies: string[];
  customAllergies: string;
  currentMedications: string;
}

const COMMON_DISEASES = [
  { id: 'hypertension', label: 'Hypertension (High BP)' },
  { id: 'type_2_diabetes', label: 'Type 2 Diabetes' },
  { id: 'celiac', label: 'Celiac Disease' },
  { id: 'kidney_disease', label: 'Chronic Kidney Disease' },
  { id: 'hyperlipidemia', label: 'High Cholesterol' },
  { id: 'gout', label: 'Gout' },
];

const COMMON_ALLERGIES = [
  { id: 'peanuts', label: 'Peanuts' },
  { id: 'tree_nuts', label: 'Tree Nuts' },
  { id: 'dairy', label: 'Dairy / Lactose' },
  { id: 'eggs', label: 'Eggs' },
  { id: 'shellfish', label: 'Shellfish' },
  { id: 'soy', label: 'Soy' },
  { id: 'wheat_gluten', label: 'Wheat / Gluten' },
];

export default function MedicalProfileScreen({ onBack, onComplete }: { onBack: () => void; onComplete: () => void }) {
  const [medical, setMedical] = useState<MedicalProfile>({
    selectedDiseases: [],
    customDiseases: '',
    selectedAllergies: [],
    customAllergies: '',
    currentMedications: '',
  });

  useEffect(() => {
    loadSavedMedical();
  }, []);

  const loadSavedMedical = async () => {
    try {
      const saved = await AsyncStorage.getItem('user_medical_profile');
      if (saved) setMedical(JSON.parse(saved));
    } catch (e) {
      console.error('Failed to load medical profile');
    }
  };

  const toggleDisease = (id: string) => {
    const updated = medical.selectedDiseases.includes(id)
      ? medical.selectedDiseases.filter(item => item !== id)
      : [...medical.selectedDiseases, id];
    setMedical(prev => ({ ...prev, selectedDiseases: updated }));
  };

  const toggleAllergy = (id: string) => {
    const updated = medical.selectedAllergies.includes(id)
      ? medical.selectedAllergies.filter(item => item !== id)
      : [...medical.selectedAllergies, id];
    setMedical(prev => ({ ...prev, selectedAllergies: updated }));
  };

  const handleFinish = async () => {
    try {
      await AsyncStorage.setItem('user_medical_profile', JSON.stringify(medical));

      // Combine conditions & allergies into active list for AI evaluator
      const activeConditions = [...medical.selectedDiseases, ...medical.selectedAllergies];
      await AsyncStorage.setItem('user_conditions', JSON.stringify(activeConditions));

      Alert.alert('Success', 'Medical profile saved successfully!');
      onComplete();
    } catch (e) {
      Alert.alert('Error', 'Could not save medical profile.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Step 2: Medical Profile</Text>
      <Text style={styles.subtitle}>Select or enter medical conditions and allergies:</Text>

      {/* Diseases */}
      <Text style={styles.sectionHeader}>Medical Conditions / Diseases</Text>
      <View style={styles.chipContainer}>
        {COMMON_DISEASES.map(item => {
          const active = medical.selectedDiseases.includes(item.id);
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.chip, active && styles.activeChip]}
              onPress={() => toggleDisease(item.id)}
            >
              <Text style={[styles.chipText, active && styles.activeChipText]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Custom diseases (e.g. Asthma, Thyroid)..."
        placeholderTextColor="#94A3B8"
        value={medical.customDiseases}
        onChangeText={val => setMedical(prev => ({ ...prev, customDiseases: val }))}
      />

      {/* Allergies */}
      <Text style={styles.sectionHeader}>Allergies & Intolerances</Text>
      <View style={styles.chipContainer}>
        {COMMON_ALLERGIES.map(item => {
          const active = medical.selectedAllergies.includes(item.id);
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.chip, active && styles.activeChip]}
              onPress={() => toggleAllergy(item.id)}
            >
              <Text style={[styles.chipText, active && styles.activeChipText]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Custom allergies (e.g. Strawberries, Latex)..."
        placeholderTextColor="#94A3B8"
        value={medical.customAllergies}
        onChangeText={val => setMedical(prev => ({ ...prev, customAllergies: val }))}
      />

      {/* Medications */}
      <Text style={styles.sectionHeader}>Current Medications</Text>
      <TextInput
        style={styles.input}
        placeholder="List current medications (e.g. Lisinopril, Metformin)..."
        placeholderTextColor="#94A3B8"
        value={medical.currentMedications}
        onChangeText={val => setMedical(prev => ({ ...prev, currentMedications: val }))}
      />

      <View style={styles.row}>
        <TouchableOpacity style={[styles.button, styles.backButton]} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.nextButton]} onPress={handleFinish}>
          <Text style={styles.buttonText}>Save & Chat →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#0F172A' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#94A3B8', marginBottom: 16 },
  sectionHeader: { fontSize: 15, fontWeight: 'bold', color: '#38BDF8', marginTop: 12, marginBottom: 8 },
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
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  chip: {
    backgroundColor: '#1E293B',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  activeChip: { backgroundColor: '#38BDF8', borderColor: '#38BDF8' },
  chipText: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  activeChipText: { color: '#0F172A', fontWeight: 'bold' },
  row: { flexDirection: 'row', gap: 10, marginTop: 16 },
  button: { flex: 1, padding: 14, borderRadius: 8, alignItems: 'center' },
  backButton: { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' },
  nextButton: { backgroundColor: '#38BDF8' },
  backButtonText: { color: '#94A3B8', fontWeight: 'bold', fontSize: 15 },
  buttonText: { color: '#0F172A', fontWeight: 'bold', fontSize: 15 },
});