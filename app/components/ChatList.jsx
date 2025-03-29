import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import { Query } from 'react-native-appwrite';
import { Ionicons } from '@expo/vector-icons';
import { client, databases, account, DATABASE_ID, CHATS_COLLECTION_ID, USERS_COLLECTION_ID, MESSAGES_COLLECTION_ID } from '../../appwrite/config';
import { use } from 'react';

export default function ChatList(){
    const [chats, setChats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const router = useRouter();
  
    useEffect(() => {
        checkSession();
    }, []);

    useEffect(() => {
        if (!currentUser) return;

        const unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${CHATS_COLLECTION_ID}.documents`, response => {
            if (
                response.events.includes(`databases.${DATABASE_ID}.collections.${CHATS_COLLECTION_ID}.documents.*.update`) ||         response.events.includes(`databases.${DATABASE_ID}.collections.${CHATS_COLLECTION_ID}.documents.*.create`)
            ) {
                const chatData = response.payload;

                if(chatData.buyerId === currentUser.$id || chatData.sellerId === currentUser.$id){
                    refreshChats();
                }
            }
        });
        
        const messagesUnsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${MESSAGES_COLLECTION_ID}.documents`, response => {
            if (response.events.includes(`databases.${DATABASE_ID}.collections.${MESSAGES_COLLECTION_ID}.documents.*.create`)){
                refreshChats();
            }
        });

        return () => {
            unsubscribe();
            messagesUnsubscribe();
        };
    }, [currentUser]);

    const checkSession = async() => {
        try {
            const session = await account.getSession('current');
            if (session) {
                const user = await account.get();
                setCurrentUser(user);
                fetchChats(user.$id);
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            console.log('No active session found');
            setIsLoading(false);        
        }
    };

    const fetchChats = async(userId) => {
        setIsLoading(true);
        try {
            const chatResponse = await databases.listDocuments(
                DATABASE_ID,
                CHATS_COLLECTION_ID,
                [
                    Query.or(
                        [Query.equal('buyerId', userID),
                            Query.equal('sellerId', userId)]
                    ),
                    Query.orderDesc('updatedAt')
                ]
            );

            const chatsWithDetails = await Promise.all(
                chatResponse.documents.map(async (chat) => {
                    try {
                        const otherUserId = chat.buyerId === userId ? chat.sellerId : chat.buyerId;
 
                        const userProfileResponse = await databases.listDocuments(
                            DATABASE_ID,
                            USERS_COLLECTION_ID,
                            [Query.equal('userId', otherUserId)]
                          );
              
                        if (userProfileResponse.documents.length > 0) {
                            const userProfile = userProfileResponse.documents[0];
                            chat.otherUserName = userProfile.displayName || 'Unknown User';
                            chat.otherUserId = otherUserId;
                        } else {
                            chat.otherUserName = 'Unknown User';
                            chat.otherUserId = otherUserId;
                        }

                        const latestMessageResponse = await databases.listDocuments(
                            DATABASE_ID,
                            MESSAGES_COLLECTION_ID,
                            [
                                Query.equal('chatId', chat.$id),
                                Query.orderDesc('createdAt'),
                                Query.limit(1)  
                            ]
                        );

                        if (latestMessageResponse.documents.length > 0) {
                            const latestMessage = latestMessageResponse.documents[0];
                            chat.latestMessage = latestMessage.content;
                            chat.latestMessageTime = latestMessage.createdAt;
                            chat.isLatestMessageRead = latestMessage.isRead;
                            chat.isLatestMessageFromUser = latestMessage.senderId === userId;
                        }

                        if (chat.buyerId === userId || chat.sellerId === userId) {
                            const unreadMessagesResponse = await databases.listDocuments(
                              DATABASE_ID,
                              MESSAGES_COLLECTION_ID,
                              [
                                Query.equal('chatId', chat.$id),
                                Query.equal('senderId', otherUserId),
                                Query.equal('isRead', false)
                              ]
                            );

                            chat.unreadCount = unreadMessagesResponse.documents.length;
                    }

                    return chat;
                } catch (error) {
                    console.error('Error fetching chat details:', error);
                    chat.otherUserName = 'Unknown User';
                    chat.otherUserId = otherUserId;
                    return chat;
                }
                })
            );

            setChats(chatsWithDetails)
        } catch (error) {
            console.error('Error fetching chats:', error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    const refreshChats = () => {
        if (currentUser){
            setRefreshing(true);
            fetchChats(currentUser.$id);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';

        const messageDate = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (messageDate.toDateString() === today.toDateString()) {
            return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        if (messageDate.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        }

        if (today.getTime() - messageDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
            return messageDate.toLocaleDateString([], { weekday: 'short' });
        } 

        return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    const navigateToChat = (chat) => {
        router.push({
            pathname: '/chat/[id]',
            params: { id: chat.$id }
        });
    };

    if (isLoading){
        return (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2196F3" />
            </View>
        );
    }

    if (!currentUser){
        return (
            <View style={styles.containerCenter}>
              <Text style={styles.message}>Please log in to view your chats</Text>
              <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
                <Text style={styles.buttonText}>Log In</Text>
              </TouchableOpacity>
            </View>
        );       
    }

    const renderChatItem = ({ item }) => {
        const isUserSeller = item.sellerId === currentUser.$id;

        return (
            <TouchableOpacity 
              style={styles.chatItem} 
              onPress={() => navigateToChat(item)}
            >
              <View style={styles.chatInfo}>
                <Text style={styles.chatName}>{item.otherUserName}</Text>
                <Text style={styles.listingTitle} numberOfLines={1}>
                  {isUserSeller ? 'Your listing: ' : ''}{item.listingTitle}
                </Text>
                {item.latestMessage && (
                  <Text 
                    style={[
                      styles.lastMessage, 
                      (!item.isLatestMessageRead && !item.isLatestMessageFromUser) && styles.unreadMessage
                    ]} 
                    numberOfLines={1}
                  >
                    {item.isLatestMessageFromUser ? 'You: ' : ''}{item.latestMessage}
                  </Text>
                )}
              </View>
              <View style={styles.chatMeta}>
                <Text style={styles.chatDate}>{formatDate(item.latestMessageTime || item.updatedAt)}</Text>
                {item.unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
          <FlatList
            data={chats}
            renderItem={renderChatItem}
            keyExtractor={item => item.$id}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refreshChats} />
            }
            ListEmptyComponent={
              !isLoading && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No conversations yet</Text>
                </View>
              )
            }
          />
        </View>
      );    
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    containerCenter: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    message: {
      fontSize: 18,
      marginBottom: 20,
      textAlign: 'center',
    },
    button: {
      backgroundColor: '#2196F3',
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      width: 200,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
    listContainer: {
      flexGrow: 1,
    },
    chatItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    chatInfo: {
      flex: 1,
      marginRight: 10,
    },
    chatName: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    listingTitle: {
      fontSize: 14,
      color: '#666',
    },
    chatMeta: {
      alignItems: 'flex-end',
    },
    chatDate: {
      fontSize: 12,
      color: '#888',
      marginBottom: 5,
    },
    lastMessage: {
      fontSize: 14,
      color: '#666',
      marginTop: 4,
    },
    unreadMessage: {
      fontWeight: 'bold',
      color: '#333',
    },
    unreadBadge: {
      backgroundColor: '#2196F3',
      borderRadius: 10,
      paddingHorizontal: 6,
      paddingVertical: 2,
      marginTop: 5,
    },
    unreadBadgeText: {
      color: 'white',
      fontSize: 12,
      fontWeight: 'bold',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    emptyText: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
    },
});