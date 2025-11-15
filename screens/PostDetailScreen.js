import React, { useState, useEffect } from "react";
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
    ActivityIndicator,
    Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../scr/config";

const { width } = Dimensions.get("window");

const getBaseURL = () => {
    if (Platform.OS === "android") return BASE_URL;
    return "http://127.0.0.1:8000";
};

const PostDetailScreen = ({ route }) => {
    const { postId } = route.params;
    const navigation = useNavigation();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    const [replyText, setReplyText] = useState("");
    const [replyTo, setReplyTo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);

    // Load logged-in user once
    useEffect(() => {
        (async () => {
            try {
                const userData = await AsyncStorage.getItem("user_data");
                if (userData) {
                    const user = JSON.parse(userData);
                    setCurrentUserId(user.id);
                    console.log("Current user id:", user.id);
                }
            } catch (err) {
                console.error("Error loading user_data:", err);
            }
        })();
    }, []);

    // Fetch post details
    const fetchPostDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = await AsyncStorage.getItem("access_token");
            if (!token) {
                setError("Authentication error. Please log in again.");
                return;
            }

            const baseURL = getBaseURL();
            const res = await fetch(`${baseURL}/api/community/posts/${postId}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            console.log("Post details response:", data);

            if (res.ok && data.success) {
                setPost(data.data);
                setComments(Array.isArray(data.data.comments) ? data.data.comments : []);
            } else {
                setError(data.message || "Failed to load post");
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            setError("Network error while loading post");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPostDetails();
    }, [postId]);

    // Handle likes, comments, and replies
    const handleToggleLike = async (commentId) => { /* ...same logic... */ };
    const handleSendComment = async () => { /* ...same logic... */ };
    const handleSendReply = async (commentId) => { /* ...same logic... */ };
    const handleDeleteComment = (commentId) => { /* ...same logic... */ };

    if (loading) {
        return (
            <SafeAreaView style={styles.centered}>
                <ActivityIndicator size="large" color="#059BDE" />
                <Text style={{ color: "#059BDE", marginTop: 10 }}>
                    Loading post...
                </Text>
            </SafeAreaView>
        );
    }

    if (error || !post) {
        return (
            <SafeAreaView style={styles.centered}>
                <Text style={{ color: "red", fontSize: 16 }}>
                    {error || "Post not found"}
                </Text>
                <TouchableOpacity onPress={fetchPostDetails}>
                    <Text style={{ color: "#059BDE", marginTop: 10 }}>
                        Retry
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color="#059BDE" />
                </TouchableOpacity>
                <Text
                    style={styles.headerTitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {post.title}
                </Text>
            </View>

            {/* Wrapping entire screen in KeyboardAvoidingView */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 20}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    {/* Author */}
                    <View style={styles.userRow}>
                        <Image
                            source={{
                                uri:
                                    post.author?.avatar ||
                                    "https://placehold.co/100x100?text=User",
                            }}
                            style={styles.avatar}
                        />
                        <View>
                            <Text style={styles.author}>{post.author?.name}</Text>
                            <Text style={styles.metaText}>
                                {post.category} ·{" "}
                                {new Date(post.created_at).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>

                    {/* Images */}
                    {post.images?.length > 0 && (
                        <ScrollView
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                        >
                            {post.images.map((img, index) => (
                                <Image
                                    key={index}
                                    source={{ uri: img }}
                                    style={styles.postImage}
                                />
                            ))}
                        </ScrollView>
                    )}

                    {/* Content */}
                    <Text style={styles.body}>{post.content}</Text>

                    {/* Comments */}
                    <Text style={styles.repliesHeading}>Comments</Text>

                    {comments.length === 0 ? (
                        <Text style={{ color: "#777" }}>No comments yet.</Text>
                    ) : (
                        comments.map((c) => {
                            const isOwner =
                                String(c.author?.id) === String(currentUserId);

                            return (
                                <View key={c.id} style={styles.commentItem}>
                                    {/* Author row */}
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Icon name="user" size={14} color="#059BDE" />
                                        <Text style={styles.commentAuthor}>
                                            {c.author?.name}
                                        </Text>
                                    </View>

                                    {/* Text */}
                                    <Text style={styles.commentText}>
                                        {c.content}
                                    </Text>

                                    {/* Actions */}
                                    <View style={styles.commentActions}>
                                        <TouchableOpacity
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                marginRight: 15,
                                            }}
                                            onPress={() =>
                                                handleToggleLike(c.id)
                                            }
                                        >
                                            <Icon
                                                name="heart"
                                                size={14}
                                                color={
                                                    c.user_interaction
                                                        ?.is_liked
                                                        ? "red"
                                                        : "#aaa"
                                                }
                                            />
                                            <Text style={styles.likeCount}>
                                                {" "}
                                                {c.stats?.likes_count || 0}
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() =>
                                                setReplyTo(
                                                    replyTo === c.id
                                                        ? null
                                                        : c.id
                                                )
                                            }
                                        >
                                            <Text
                                                style={{
                                                    color: "#059BDE",
                                                    fontSize: 13,
                                                }}
                                            >
                                                Reply
                                            </Text>
                                        </TouchableOpacity>

                                        {/* Delete only for owner's comment */}
                                        {isOwner && (
                                            <TouchableOpacity
                                                onPress={() =>
                                                    handleDeleteComment(c.id)
                                                }
                                                style={{ marginLeft: 15 }}
                                            >
                                                <Icon
                                                    name="trash-2"
                                                    size={15}
                                                    color="red"
                                                />
                                            </TouchableOpacity>
                                        )}
                                    </View>

                                    {/* Reply input */}
                                    {replyTo === c.id && (
                                        <View style={styles.replyInputBox}>
                                            <TextInput
                                                value={replyText}
                                                onChangeText={setReplyText}
                                                placeholder="Write a reply..."
                                                style={styles.input}
                                                placeholderTextColor="#aaa"
                                            />
                                            <TouchableOpacity
                                                onPress={() =>
                                                    handleSendReply(c.id)
                                                }
                                                style={styles.sendButton}
                                                disabled={submitting}
                                            >
                                                {submitting ? (
                                                    <ActivityIndicator
                                                        size="small"
                                                        color="#fff"
                                                    />
                                                ) : (
                                                    <Icon
                                                        name="send"
                                                        size={16}
                                                        color="#fff"
                                                    />
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    )}

                                    {/* Replies */}
                                    {c.replies?.map((r) => (
                                        <View key={r.id} style={styles.replyItem}>
                                            <Text style={styles.replyAuthor}>
                                                {r.author?.name}
                                            </Text>
                                            <Text style={styles.replyText}>
                                                {r.content}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            );
                        })
                    )}
                </ScrollView>

                {/* Comment input */}
                <View style={styles.replyBox}>
                    <TextInput
                        value={comment}
                        onChangeText={setComment}
                        placeholder="Write a comment..."
                        style={styles.input}
                        placeholderTextColor="#aaa"
                        editable={!submitting}
                    />
                    <TouchableOpacity
                        onPress={handleSendComment}
                        style={styles.sendButton}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Icon name="send" size={18} color="#fff" />
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default PostDetailScreen;


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: width * 0.04,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    headerTitle: {
        fontSize: width * 0.05,
        fontWeight: "bold",
        marginLeft: width * 0.03,
        color: "#059BDE",
        maxWidth: width * 0.7,
    },
    content: { padding: width * 0.05, paddingBottom: 100 },
    userRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: width * 0.05,
    },
    avatar: {
        width: width * 0.14,
        height: width * 0.14,
        borderRadius: width * 0.07,
        marginRight: width * 0.04,
        backgroundColor: "#eee",
    },
    author: { fontSize: width * 0.04, fontWeight: "600", color: "#333" },
    metaText: { fontSize: width * 0.035, color: "#777" },
    postImage: {
        width: width - 40,
        height: 220,
        borderRadius: 10,
        marginBottom: 10,
        marginRight: 10,
    },
    body: {
        fontSize: width * 0.04,
        color: "#444",
        marginVertical: width * 0.04,
        lineHeight: 22,
    },
    repliesHeading: {
        fontSize: width * 0.045,
        fontWeight: "bold",
        color: "#059BDE",
        marginBottom: 6,
    },
    commentItem: {
        backgroundColor: "#F2F8FF",
        borderRadius: 10,
        padding: 10,
        marginBottom: 8,
    },
    commentAuthor: {
        fontSize: 14,
        fontWeight: "600",
        color: "#059BDE",
        marginLeft: 5,
    },
    commentText: { fontSize: 14, color: "#333", marginTop: 2 },
    commentActions: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 5,
    },
    likeCount: { color: "#333", fontSize: 13 },
    replyItem: {
        backgroundColor: "#E8F4FF",
        borderRadius: 8,
        padding: 8,
        marginTop: 6,
        marginLeft: 20,
    },
    replyAuthor: { fontSize: 13, color: "#059BDE", fontWeight: "500" },
    replyText: { fontSize: 13, color: "#333", marginTop: 2 },
    replyInputBox: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
        marginLeft: 20,
    },
    replyBox: {
        flexDirection: "row",
        padding: width * 0.03,
        borderTopWidth: 1,
        borderTopColor: "#eee",
        backgroundColor: "#fff",
    },
    input: {
        flex: 1,
        height: 42,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 20,
        paddingHorizontal: 15,
        fontSize: 15,
        backgroundColor: "#f9f9f9",
    },
    sendButton: {
        backgroundColor: "#059BDE",
        borderRadius: 20,
        padding: 10,
        marginLeft: 10,
        justifyContent: "center",
        alignItems: "center",
    },
});
