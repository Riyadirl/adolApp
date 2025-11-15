import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert,
    Dimensions,
    Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";  // Import useFocusEffect
import { BASE_URL } from "../scr/config";
import Ionicons from "react-native-vector-icons/Ionicons";  // Import Ionicons

const { width } = Dimensions.get("window");

const getBaseURL = () => {
    if (Platform.OS === "android") return BASE_URL;
    return "http://127.0.0.1:8000";
};

const MyPostsScreen = () => {
    const route = useRoute();  // Use useRoute to get the route object
    const navigation = useNavigation();
    const [posts, setPosts] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                let storedId = await AsyncStorage.getItem("user_id");
                if (storedId) {
                    storedId = storedId.replace(/"/g, "").trim();
                    setUserId(storedId);
                }
            } catch (err) {
                console.error("Error loading user_id:", err);
            }
        })();
    }, []);

    // Refetch posts when the screen is focused
    useFocusEffect(
        React.useCallback(() => {
            if (userId) fetchMyPosts();
        }, [userId]) // Refetch posts when userId is available or screen is focused
    );

    useEffect(() => {
        // Check if the "updatedPost" exists in the route params
        const updatedPost = route.params?.updatedPost;
        if (updatedPost) {
            // Update the post list with the updated post
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === updatedPost.id ? updatedPost : post
                )
            );
        }
    }, [route.params]);  // Depend on route.params to update when returning from EditPost

    const fetchMyPosts = async () => {
        try {
            setLoading(true);

            const token = await AsyncStorage.getItem("access_token");
            if (!token) {
                Alert.alert("Authentication Error", "Please log in again.");
                return;
            }

            const baseURL = getBaseURL();
            const res = await fetch(`${baseURL}/api/community/posts/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const response = await res.json();

            if (res.ok && response.success) {
                const allPosts = Array.isArray(response.data.posts)
                    ? response.data.posts
                    : [];

                const myPosts = allPosts.filter(
                    (post) =>
                        String(post.author?.id).trim() ===
                        String(userId).trim()
                );

                setPosts(myPosts);
            }
        } catch (err) {
            console.error("Error fetching posts:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (postId) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this post?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem("access_token");
                            if (!token) {
                                Alert.alert("Error", "You are not logged in.");
                                return;
                            }

                            const baseURL = getBaseURL();

                            const res = await fetch(
                                `${baseURL}/api/community/posts/${postId}/`,
                                {
                                    method: "DELETE",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${token}`,
                                    },
                                }
                            );

                            const data = await res.json().catch(() => null);

                            console.log("DELETE RESPONSE:", data);  // 🔥 Debug print

                            if (res.ok && data?.success) {
                                // remove from UI instantly
                                setPosts((prev) => prev.filter((p) => p.id !== postId));
                                Alert.alert("Success", "Post deleted successfully.");
                            } else {
                                Alert.alert("Error", data?.message || "Failed to delete post.");
                            }
                        } catch (err) {
                            console.error("Error deleting post:", err);
                            Alert.alert("Error", "Network error while deleting post.");
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.centered}>
                <ActivityIndicator size="large" color="#059BDE" />
                <Text style={{ color: "#059BDE", marginTop: 10 }}>
                    Loading your posts...
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color="#059BDE" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Posts</Text>
            </View>

            {posts.length === 0 ? (
                <View style={styles.centered}>
                    <Text style={{ color: "#777" }}>
                        You haven't posted anything yet.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={posts}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ padding: width * 0.04 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() =>
                                navigation.navigate("PostDetail", {
                                    postId: item.id,
                                })
                            }
                        >
                            <View style={styles.postCard}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    {item.author?.avatar ? (
                                        <Image
                                            source={{
                                                uri: item.author?.avatar,
                                            }}
                                            style={styles.avatar}
                                        />
                                    ) : (
                                        <Icon name="user" size={40} color="#059BDE" marginRight={10} />
                                    )}
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.postTitle}>{item.title}</Text>
                                        <Text style={styles.metaText}>
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </Text>
                                    </View>
                                </View>

                                <Text numberOfLines={3} style={styles.postContent}>
                                    {item.content}
                                </Text>

                                {item.images && item.images.length > 0 && (
                                    <Image
                                        source={{ uri: item.images[0] }}
                                        style={styles.postImage}
                                        resizeMode="cover"
                                    />
                                )}

                                <View style={styles.actions}>
                                    <TouchableOpacity
                                        style={[styles.actionButton, { backgroundColor: "#059BDE" }]}
                                        onPress={() =>
                                            navigation.navigate("EditPost", {
                                                postId: item.id,
                                                existingData: item,
                                            })
                                        }
                                    >
                                        <Icon name="edit" size={16} color="#fff" />
                                        <Text style={styles.actionText}>Edit</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.actionButton, { backgroundColor: "#e63946" }]}
                                        onPress={() => handleDelete(item.id)}
                                    >
                                        <Icon name="trash-2" size={16} color="#fff" />
                                        <Text style={styles.actionText}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </SafeAreaView>
    );
};

export default MyPostsScreen;

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
    },
    postCard: {
        backgroundColor: "#F8FAFC",
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: "#eee",
    },
    postTitle: { fontSize: 16, fontWeight: "bold", color: "#222" },
    metaText: { fontSize: 12, color: "#777" },
    postContent: { marginVertical: 8, fontSize: 14, color: "#444" },
    postImage: {
        width: "100%",
        height: 180,
        borderRadius: 8,
        marginBottom: 8,
    },
    actions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 10 },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        marginLeft: 8,
    },
    actionText: {
        color: "#fff",
        marginLeft: 5,
        fontSize: 14,
        fontWeight: "600",
    },
});
