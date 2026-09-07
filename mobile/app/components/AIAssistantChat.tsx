import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

interface Message {
  sender: 'ai' | 'user';
  text: string;
}

export const AIAssistantChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: 'Hello! How can I adjust your diet or meal plan today?' }
  ]);
  const [input, setInput] = useState<string>('');

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev: Message[]) => [...prev, { sender: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages((prev: Message[]) => [
        ...prev,
        { sender: 'ai', text: "I've noted that! Updating your macro calculations now." }
      ]);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatArea}>
        {messages.map((msg: Message, idx: number) => (
          <View key={idx} style={[styles.bubble, msg.sender === 'user' ? styles.userMsg : styles.aiMsg]}>
            <Text style={styles.msgText}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask AI Assistant..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  chatArea: { flex: 1, marginBottom: 16 },
  bubble: { padding: 12, borderRadius: 12, marginBottom: 8, maxWidth: '80%' },
  userMsg: { backgroundColor: '#10b981', alignSelf: 'flex-end' },
  aiMsg: { backgroundColor: '#e2e8f0', alignSelf: 'flex-start' },
  msgText: { fontSize: 14, color: '#0f172a' },
  inputContainer: { flexDirection: 'row', gap: 8 },
  input: { flex: 1, borderBottomWidth: 1, borderColor: '#cbd5e1', padding: 8 },
  sendButton: { backgroundColor: '#10b981', padding: 12, borderRadius: 8 }
});