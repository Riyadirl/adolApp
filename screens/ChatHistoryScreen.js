// ChatHistoryScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const ChatHistoryScreen = ({ route }) => {
    const { chatHistory } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chat History</Text>
            <FlatList
                data={chatHistory}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.messageContainer}>
                        <Text style={styles.messageText}>{item.sender}: {item.text}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    messageContainer: {
        padding: 10,
        backgroundColor: '#E5E5EA',
        marginBottom: 10,
        borderRadius: 10,
    },
    messageText: {
        fontSize: 16,
        color: '#333',
    },
});

export default ChatHistoryScreen;
