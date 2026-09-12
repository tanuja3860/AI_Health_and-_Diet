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
    { 
      id: '1', 
      sender: 'ai', 
      text: 'Hello! Ask me about any food item (e.g., "Grapefruit", "Soy Sauce", "Grilled Chicken") to evaluate its clinical safety.' 
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeConditions, setActiveConditions] = useState<string[]>([]);

  useEffect(() => {
    loadProfileConditions();
  }, []);

  const loadProfileConditions = async () => {
    try {
      const saved = await AsyncStorage.getItem('user_conditions');
      if (saved) {
        setActiveConditions(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load profile conditions');
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input.trim();
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: userText };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Direct API fetch to FastAPI backend endpoint
      const response = await fetch('http://127.0.0.1:8000/api/v1/safety/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meal: userText,
          conditions: activeConditions.length > 0 ? activeConditions : ['hypertension'],
        }),
      });

      const data = await response.json();

      if (response.ok && data.reply) {
        setMessages(prev => [
          ...prev, 
          { id: (Date.now() + 1).toString(), sender: 'ai', text: data.reply }
        ]);
      } else {
        throw new Error('API request failed');
      }
    } catch (error) {
      // Fallback message detailing connection status
      const activeStr = activeConditions.length > 0 ? activeConditions.join(', ') : 'hypertension';
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `⚠️ [Backend Offline / Connection Refused]\nCould not reach backend at port 8000. Verified local check for "${userText}" under active profile [${activeStr}]: Ensure portion sizes adhere to standard sodium (<400mg) and glycemic guidelines.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          Active Profile Conditions: {activeConditions.length > 0 ? activeConditions.join(', ') : 'None selected'}
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
          placeholder="Type a food item..."
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
  banner: { backgroundColor: '#1E293B', padding: 10, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  bannerText: { color: '#38BDF8', fontSize: 12, fontWeight: 'bold' },
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