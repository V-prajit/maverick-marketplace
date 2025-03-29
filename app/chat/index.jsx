import React from 'react';
import { View, StyleSheet } from 'react-native';
import ChatList from '../components/ChatList';

export default function ChatScreen() {
  return (
    <View style={styles.container}>
      <ChatList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});