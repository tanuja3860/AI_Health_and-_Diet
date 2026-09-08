import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { Colors } from '../app/constants/theme';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  status?: 'SAFE' | 'WARNING' | 'HAZARDOUS';
}

export default function AIAssistantChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! Ask me about any meal, and I will cross-reference it with your clinical profile matrix.',
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
    
    // Simulating clinical safety evaluator response
    const isHazard = input.toLowerCase().includes('fish') || input.toLowerCase().includes('soy');
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: isHazard 
        ? 'Warning: Ingredients detected in this query conflict with active conditions.' 
        : 'Meal check complete. No critical contraindications found for your profile.',
      status: isHazard ? 'HAZARDOUS' : 'SAFE',
    };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInput('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
            <Text style={styles.bubbleText}>{item.text}</Text>
            {item.status && (
              <View style={[styles.badge, item.status === 'HAZARDOUS' ? styles.dangerBadge : styles.safeBadge]}>
                <Text style={styles.badgeText}>{item.status}</Text>
              </View>
            )}
          </View>
        )}
      />

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Ask AI assistant..."
          placeholderTextColor={Colors.textMuted}
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  bubble: {
    padding: 14,
    borderRadius: 12,
    maxWidth: '85%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.surfaceLight,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bubbleText: {
    color: Colors.text,
    fontSize: 15,
  },
  badge: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  safeBadge: {
    backgroundColor: Colors.safe,
  },
  dangerBadge: {
    backgroundColor: Colors.danger,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  inputBar: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    color: Colors.text,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  sendText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});