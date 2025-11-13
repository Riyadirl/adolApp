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
    Platform,
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

    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(3); // start with 3 likes for demo

    const handleSendReply = () => {
        if (reply.trim()) {
            setReplies([...replies, `👤 You: ${reply.trim()}`]);
            setReply('');
        }
    };

    const toggleLike = () => {
        setLiked(!liked);
        setLikeCount(likeCount + (liked ? -1 : 1));
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color="#059BDE" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{post.title ? post.title : "Title"}</Text>
            </View>

            {/* Main Content */}
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

                    {/* Like Row */}
                    <View style={styles.likeRow}>
                        <TouchableOpacity onPress={toggleLike} style={styles.likeButton}>
                            <Icon
                                name={liked ? 'heart' : 'heart'}
                                color={liked ? '#e74c3c' : '#888'}
                                size={20}
                                solid={liked}
                            />
                            <Text style={[styles.likeText, liked && { color: '#e74c3c' }]}>
                                {liked ? 'Liked' : 'Like'}
                            </Text>
                        </TouchableOpacity>
                        <Text style={styles.likeCount}>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</Text>
                    </View>

                    {/* Replies */}
                    <Text style={styles.repliesHeading}>Replies</Text>
                    {replies.map((r, index) => (
                        <Text key={index} style={styles.reply}>{r}</Text>
                    ))}
                </ScrollView>

                {/* Reply Box */}
                <View style={styles.replyBox}>
                    <TextInput
                        value={reply}
                        onChangeText={setReply}
                        placeholder="Write a reply..."
                        style={styles.input}
                        placeholderTextColor="#aaa"
                    />
                    <TouchableOpacity onPress={handleSendReply} style={styles.sendButton}>
                        <Icon name="send" size={18} color="#fff" />
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
        paddingBottom: 100,
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
        backgroundColor: '#eee',
    },
    author: {
        fontSize: width * 0.035,
        color: '#666',
    },
    title: {
        fontSize: width * 0.045,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 2,
    },
    body: {
        fontSize: width * 0.04,
        color: '#444',
        marginBottom: width * 0.06,
        lineHeight: 22,
    },
    likeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: width * 0.05,
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: width * 0.04,
    },
    likeText: {
        fontSize: width * 0.04,
        color: '#888',
        marginLeft: 6,
    },
    likeCount: {
        fontSize: width * 0.035,
        color: '#555',
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
        marginBottom: width * 0.025,
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
        height: 42,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        paddingHorizontal: 15,
        fontSize: 15,
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
