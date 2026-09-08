import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../app/constants/theme';

const CONDITIONS = [
  { id: 'hypertension', label: 'Hypertension' },
  { id: 'type_2_diabetes', label: 'Type 2 Diabetes' },
  { id: 'celiac', label: 'Celiac Disease' },
  { id: 'kidney_disease', label: 'Chronic Kidney Disease' },
];

export default function ProfileScreen() {
  const [selected, setSelected] = useState<string[]>(['hypertension']);

  const toggleCondition = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Clinical Health Profile</Text>
      <Text style={styles.subtitle}>Select conditions to calculate safety matrix</Text>

      <View style={styles.grid}>
        {CONDITIONS.map(item => {
          const isActive = selected.includes(item.id);
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, isActive && styles.activeCard]}
              onPress={() => toggleCondition(item.id)}
            >
              <Text style={[styles.cardText, isActive && styles.activeCardText]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 20,
  },
  grid: {
    gap: 12,
  },
  card: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceLight,
  },
  cardText: {
    color: Colors.textMuted,
    fontSize: 16,
    fontWeight: '600',
  },
  activeCardText: {
    color: Colors.primary,
  },
});