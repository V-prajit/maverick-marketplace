// Appwrite configuration

import { Client, Account, Databases, Storage } from 'react-native-appwrite';

// Your Appwrite endpoint and project ID
const APPWRITE_ENDPOINT = 'http://localhost/v1';
const APPWRITE_PROJECT_ID = '67e334db001b3a5acbf2';
const APPWRITE_PLATFORM = 'com.company.MaverickMarketPlace';

// Initialize the Appwrite client
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setPlatform(APPWRITE_PLATFORM);

// Initialize Appwrite services
const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export { client, account, databases, storage };