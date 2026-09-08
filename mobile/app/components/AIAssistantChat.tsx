import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors } from '../app/constants/theme';
import { sendChatMessage } from '../services/api';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  warnings?: string[];
}

export default function AIAssistantChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'assistant',
      text: 'Hello! I am your AI Health Assistant. Ask me anything about your diet or meal safety.',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentQuery = inputText;
    setInputText('');
    setLoading(true);

    const response = await sendChatMessage(currentQuery);

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'assistant',
      text: response.reply || response.message || 'Response received.',
      warnings: response.safety_warnings || [],
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setLoading(false);
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    return (
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.assistantBubble,
        ]}
      >
        <Text style={isUser ? styles.userText : styles.assistantText}>
          {item.text}
        </Text>
        {item.warnings && item.warnings.length > 0 && (
          <View style={styles.warningContainer}>
            {item.warnings.map((warn, idx) => (
              <Text key={idx} style={styles.warningText}>
                ⚠️ {warn}
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Clinical AI Chat</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatList}
      />

      {loading && (
        <ActivityIndicator
          size="small"
          color={Colors.primary}
          style={{ marginVertical: 8 }}
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask about meal safety..."
          placeholderTextColor={Colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  chatList: {
    padding: 16,
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  userText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  assistantText: {
    color: Colors.text,
    fontSize: 14,
  },
  warningContainer: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  warningText: {
    fontSize: 12,
    color: Colors.danger,
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: Colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    color: Colors.text,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});