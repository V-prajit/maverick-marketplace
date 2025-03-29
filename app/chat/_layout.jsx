import React from 'react';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ChatLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'My Chats',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Chat',
          headerTitleAlign: 'center',
          headerBackTitle: 'Back',
          headerBackTitleVisible: true,
        }}
      />
      <Stack.Screen
        name="new"
        options={{
          title: 'New Chat',
          headerTitleAlign: 'center',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}