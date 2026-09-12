import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export default function AIAssistantChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: 'Hello! I am your Clinical AI Assistant. Ask me about any food item or meal to check safety against your full profile.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    loadFullProfile();
  }, []);

  const loadFullProfile = async () => {
    try {
      const saved = await AsyncStorage.getItem('user_full_profile');
      if (saved) {
        setUserProfile(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load profile');
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input.trim();
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: userText };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const conditions = userProfile?.selectedConditions || ['hypertension'];

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/safety/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meal: userText,
          conditions: conditions,
          user_data: userProfile,
        }),
      });

      const data = await response.json();

      if (response.ok && data.reply) {
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: data.reply }]);
      } else {
        throw new Error();
      }
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `🔍 Profile Check for "${userText}": Active conditions [${conditions.join(', ')}]. Daily sodium target: ${userProfile?.dailySodiumLimitMg || 1500}mg.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>
          Patient: {userProfile?.fullName || 'User'} {userProfile?.age ? `(${userProfile.age} yrs)` : ''}
        </Text>
        <Text style={styles.bannerSubtitle}>
          Conditions: {userProfile?.selectedConditions?.length ? userProfile.selectedConditions.join(', ') : 'None'}
        </Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        )}
      />

      {loading && <ActivityIndicator size="small" color="#38BDF8" style={{ marginBottom: 8 }} />}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask about a meal or ingredient..."
          placeholderTextColor="#94A3B8"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={loading}>
          <Text style={styles.sendText}>Check</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 16 },
  banner: { backgroundColor: '#1E293B', padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  bannerTitle: { color: '#F8FAFC', fontSize: 14, fontWeight: 'bold' },
  bannerSubtitle: { color: '#38BDF8', fontSize: 12, marginTop: 2 },
  list: { paddingBottom: 16 },
  bubble: { padding: 12, borderRadius: 10, marginBottom: 10, maxWidth: '85%' },
  userBubble: { backgroundColor: '#38BDF8', alignSelf: 'flex-end' },
  aiBubble: { backgroundColor: '#1E293B', alignSelf: 'flex-start' },
  text: { color: '#F8FAFC', fontSize: 14, lineHeight: 20 },
  inputContainer: { flexDirection: 'row', gap: 8 },
  input: { flex: 1, backgroundColor: '#1E293B', color: '#F8FAFC', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#334155' },
  sendButton: { backgroundColor: '#38BDF8', justifyContent: 'center', paddingHorizontal: 16, borderRadius: 8 },
  sendText: { color: '#0F172A', fontWeight: 'bold' },
});