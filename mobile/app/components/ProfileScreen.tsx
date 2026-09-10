import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Condition {
  id: string;
  label: string;
}

interface ProfileScreenProps {
  onSaveAndContinue?: () => void;
}

export default function ProfileScreen({ onSaveAndContinue }: ProfileScreenProps) {
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchConditions();
    loadSavedConditions();
  }, []);

  const fetchConditions = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/conditions');
      const data = await response.json();
      setConditions(data);
    } catch (error) {
      setConditions([
        { id: 'hypertension', label: 'Hypertension' },
        { id: 'type_2_diabetes', label: 'Type 2 Diabetes' },
        { id: 'celiac', label: 'Celiac Disease' },
        { id: 'kidney_disease', label: 'Chronic Kidney Disease' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedConditions = async () => {
    const saved = await AsyncStorage.getItem('user_conditions');
    if (saved) {
      setSelectedConditions(JSON.parse(saved));
    }
  };

  const toggleCondition = async (id: string) => {
    let updated: string[];
    if (selectedConditions.includes(id)) {
      updated = selectedConditions.filter(item => item !== id);
    } else {
      updated = [...selectedConditions, id];
    }
    
    setSelectedConditions(updated);
    await AsyncStorage.setItem('user_conditions', JSON.stringify(updated));
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#38BDF8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clinical Health Profile</Text>
      <Text style={styles.subtitle}>Select active health conditions to calculate your food safety matrix:</Text>

      <FlatList
        data={conditions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const isSelected = selectedConditions.includes(item.id);
          return (
            <TouchableOpacity
              style={[styles.card, isSelected && styles.selectedCard]}
              onPress={() => toggleCondition(item.id)}
            >
              <Text style={[styles.cardText, isSelected && styles.selectedCardText]}>
                {item.label}
              </Text>
              <Text style={styles.badge}>{isSelected ? 'ACTIVE' : 'SELECT'}</Text>
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity 
        style={styles.continueButton} 
        onPress={onSaveAndContinue}
      >
        <Text style={styles.continueText}>Save & Continue to AI Assistant →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#0F172A' },
  center: { justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#94A3B8', marginBottom: 16 },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  selectedCard: { borderColor: '#38BDF8', backgroundColor: '#0369A1' },
  cardText: { color: '#F8FAFC', fontSize: 16, fontWeight: '600' },
  selectedCardText: { color: '#FFFFFF', fontWeight: 'bold' },
  badge: { color: '#94A3B8', fontSize: 12, fontWeight: 'bold' },
  continueButton: {
    backgroundColor: '#38BDF8',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  continueText: { color: '#0F172A', fontWeight: 'bold', fontSize: 16 },
});