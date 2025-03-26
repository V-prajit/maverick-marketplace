import { Client, Account, Databases, Storage } from 'react-native-appwrite';
import Constants from 'expo-constants';

const {
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  APPWRITE_PLATFORM
} = Constants.expoConfig?.extra || {};

console.log(APPWRITE_ENDPOINT,APPWRITE_PROJECT_ID,APPWRITE_PLATFORM)

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setPlatform(APPWRITE_PLATFORM);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export { client, account, databases, storage };