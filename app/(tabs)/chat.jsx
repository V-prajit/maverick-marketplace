import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, Link } from 'expo-router';

export default function ChatTab() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Chat Tab</Text>
      <Link href="/chat" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Go to Chat</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});