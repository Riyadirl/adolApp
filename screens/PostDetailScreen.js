import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Image,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    TextInput,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const PostDetailScreen = ({ route }) => {
    const { post } = route.params;
    const navigation = useNavigation();

    const [reply, setReply] = useState('');
    const [replies, setReplies] = useState([
        '👤 John: I use screen time settings on the tablet.',
        '👤 Sarah: We set a timer for 30 mins daily.',
    ]);

    const handleSendReply = () => {
        if (reply.trim()) {
            setReplies([...replies, `👤 You: ${reply.trim()}`]);
            setReply('');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color="#059BDE" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Post Details</Text>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={90}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.userRow}>
                        <Image source={{ uri: post.avatar }} style={styles.avatar} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.author}>@{post.author}</Text>
                            <Text style={styles.title}>{post.title}</Text>
                        </View>
                    </View>
                    <Text style={styles.body}>{post.content}</Text>

                    <Text style={styles.repliesHeading}>Replies</Text>
                    {replies.map((r, index) => (
                        <Text key={index} style={styles.reply}>{r}</Text>
                    ))}
                </ScrollView>

                {/* Reply Input */}
                <View style={styles.replyBox}>
                    <TextInput
                        value={reply}
                        onChangeText={setReply}
                        placeholder="Write a reply..."
                        style={styles.input}
                    />
                    <TouchableOpacity onPress={handleSendReply} style={styles.sendButton}>
                        <Icon name="send" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default PostDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: width * 0.04,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
        marginLeft: width * 0.03,
        color: '#059BDE',
    },
    content: {
        padding: width * 0.05,
        paddingBottom: 80,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: width * 0.05,
    },
    avatar: {
        width: width * 0.14,
        height: width * 0.14,
        borderRadius: width * 0.07,
        marginRight: width * 0.04,
    },
    author: {
        fontSize: width * 0.035,
        color: '#666',
    },
    title: {
        fontSize: width * 0.045,
        fontWeight: 'bold',
        color: '#333',
    },
    body: {
        fontSize: width * 0.04,
        color: '#444',
        marginBottom: width * 0.06,
    },
    repliesHeading: {
        fontSize: width * 0.045,
        fontWeight: 'bold',
        marginBottom: width * 0.03,
        color: '#059BDE',
    },
    reply: {
        fontSize: width * 0.037,
        color: '#555',
        marginBottom: width * 0.02,
    },
    replyBox: {
        flexDirection: 'row',
        padding: width * 0.03,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    sendButton: {
        backgroundColor: '#059BDE',
        borderRadius: 20,
        padding: 10,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
