import { Client, Account, Databases, Storage } from 'react-native-appwrite';
import { Platform } from 'react-native';

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID);

// Configure the client for proper tunneling
if (Platform.OS !== 'web') {
  // Set the platform for mobile apps
  client.setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFORM);
  
  // If in tunnel mode, set additional headers to help with tunneling
  if (process.env.EXPO_PUBLIC_APPWRITE_TUNNEL_MODE === 'true') {
    // This ensures we don't send self-signed certificate errors
    client.setSelfSigned(true);
  }
}

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const DATABASE_ID = '67e72aef00071555f538';
export const USERS_COLLECTION_ID = 'users';
export const LISTINGS_COLLECTION_ID = 'listings';
export const IMAGES_COLLECTION_ID = 'images';
export const IMAGES_BUCKET_ID = 'listing-images';
export const CHATS_COLLECTION_ID = '67e834c60026698fc1c8';
export const MESSAGES_COLLECTION_ID = '67e834c90039d2a6f82f';

export { client, account, databases, storage };