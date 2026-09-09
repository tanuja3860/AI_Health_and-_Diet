import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Colors } from '../app/constants/theme';

interface Condition {
  id: string;
  label: string;
}

const FALLBACK_CONDITIONS: Condition[] = [
  { id: 'hypertension', label: 'Hypertension' },
  { id: 'type_2_diabetes', label: 'Type 2 Diabetes' },
  { id: 'celiac', label: 'Celiac Disease' },
  { id: 'kidney_disease', label: 'Chronic Kidney Disease' },
  { id: 'coronary_artery', label: 'Coronary Artery Disease' },
  { id: 'gout', label: 'Gout' },
  { id: 'ibs', label: 'Irritable Bowel Syndrome (IBS)' },
  { id: 'lactose_intolerance', label: 'Lactose Intolerance' },
  { id: 'peanut_allergy', label: 'Peanut Allergy' },
  { id: 'hyperlipidemia', label: 'Hyperlipidemia' },
];

export default function ProfileScreen() {
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [selected, setSelected] = useState<string[]>(['hypertension']);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchConditions = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/conditions');
        if (response.ok) {
          const data = await response.json();
          setConditions(data);
        } else {
          setConditions(FALLBACK_CONDITIONS);
        }
      } catch (error) {
        // Fallback if backend is offline or unreachable
        setConditions(FALLBACK_CONDITIONS);
      } finally {
        setLoading(false);
      }
    };

    fetchConditions();
  }, []);

  const toggleCondition = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Clinical Health Profile</Text>
      <Text style={styles.subtitle}>Select conditions to calculate safety matrix</Text>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
      ) : (
        <View style={styles.grid}>
          {conditions.map(item => {
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
      )}
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
  loader: {
    marginTop: 40,
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