import { Client, Account, Databases, Storage } from 'react-native-appwrite';

const APPWRITE_ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
const APPWRITE_PLATFORM = process.env.EXPO_PUBLIC_APPWRITE_PLATFORM;

console.log('Appwrite config environment variables:');
console.log('- ENDPOINT available:', !!APPWRITE_ENDPOINT);
console.log('- PROJECT_ID available:', !!APPWRITE_PROJECT_ID);
console.log('- PLATFORM available:', !!APPWRITE_PLATFORM);

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setPlatform(APPWRITE_PLATFORM);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export { client, account, databases, storage };