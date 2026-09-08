import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import AIAssistantChat from './components/AIAssistantChat';
import ProfileScreen from './components/ProfileScreen';
import { Colors } from './app/constants/theme';

export default function AppNavigator() {
  const [activeTab, setActiveTab] = useState<'chat' | 'profile'>('chat');

  return (
    <SafeAreaView style={styles.container}>
      {/* Navigation Header Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'chat' && styles.activeTab]}
          onPress={() => setActiveTab('chat')}
        >
          <Text style={[styles.tabText, activeTab === 'chat' && styles.activeTabText]}>
            AI Assistant
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>
            Health Profile
          </Text>
        </TouchableOpacity>
      </View>

      {/* Screen Render View */}
      <View style={styles.screenContainer}>
        {activeTab === 'chat' ? <AIAssistantChat /> : <ProfileScreen />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  screenContainer: {
    flex: 1,
  },
});