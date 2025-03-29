import React from 'react';
import { View, StyleSheet } from 'react-native';
import ChatDetail from '../components/ChatDetail';

export default function ChatDetailScreen() {
  return (
    <View style={styles.container}>
      <ChatDetail />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});