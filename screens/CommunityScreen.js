import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    RefreshControl,
    SafeAreaView,
    ActivityIndicator,
    Platform,
    Modal,
    TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import DrawerLayout from "react-native-gesture-handler/DrawerLayout";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../scr/config";

const getBaseURL = () => {
    if (Platform.OS === "android") return BASE_URL;
    if (Platform.OS === "ios") return "http://127.0.0.1:8000";
    return "http://127.0.0.1:8000";
};

const reactions = [
    { type: "like", icon: "thumbs-up", color: "#1877F2", label: "Like" },
    { type: "love", icon: "heart", color: "#E0245E", label: "Love" },
    { type: "support", icon: "smile", color: "#2ECC71", label: "Support" },
    { type: "celebrate", icon: "star", color: "#F1C40F", label: "Celebrate" },
];

const CommunityScreen = () => {
    const navigation = useNavigation();
    const drawerRef = useRef(null);

    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]); // For storing filtered posts
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [hasFetched, setHasFetched] = useState(false);
    const [activePostId, setActivePostId] = useState(null);
    const [searchQuery, setSearchQuery] = useState(""); // State for storing the search query

    // 🔄 Fetch Posts
    const fetchPosts = async (category = selectedCategory) => {
        try {
            setLoading(true);
            setError(null);
            setHasFetched(false);

            const token = await AsyncStorage.getItem("access_token");
            if (!token) {
                setError("No authentication token found. Please log in again.");
                setLoading(false);
                return;
            }

            const baseURL = getBaseURL();
            const endpoint =
                category === "all"
                    ? `${baseURL}/api/community/posts/`
                    : `${baseURL}/api/community/posts/?category=${category}`;

            const response = await fetch(endpoint, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            console.log("API Response:", JSON.stringify(data, null, 2));

            if (response.ok && data?.success) {
                const postList = Array.isArray(data.data?.posts)
                    ? data.data.posts
                    : [];
                setPosts(postList);
                setFilteredPosts(postList); // Set both original and filtered posts
            } else {
                setError(data?.message || "Failed to load posts");
                setPosts([]);
            }
        } catch (err) {
            console.error(err);
            setError("Network error: Unable to fetch posts");
            setPosts([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
            setHasFetched(true);
        }
    };

    // 🧠 Fetch posts when category changes
    useEffect(() => {
        fetchPosts();
    }, [selectedCategory]);

    // 👀 Auto refresh every time user comes back to this screen
    useFocusEffect(
        useCallback(() => {
            fetchPosts();
        }, [selectedCategory])
    );

    const handleRefresh = () => {
        setRefreshing(true);
        fetchPosts();
    };

    // 💬 React to Post
    const handleReaction = async (postId, reactionType) => {
        try {
            const token = await AsyncStorage.getItem("access_token");
            if (!token) return;

            const baseURL = getBaseURL();
            const url = `${baseURL}/api/community/posts/${postId}/reactions/`;

            // Get the current user interaction from the post
            const currentUserInteraction = posts.find((post) => post.id === postId)?.user_interaction;

            // If any reaction is selected, set all reactions to false
            let newUserInteraction = {
                ...currentUserInteraction,
                is_liked: false,
                is_loved: false,
                is_supported: false,
                is_celebrated: false,
                reaction_type: null,
            };

            // If the selected reaction is different, set it to true
            if (currentUserInteraction?.reaction_type !== reactionType) {
                newUserInteraction = {
                    ...newUserInteraction,
                    [`is_${reactionType}`]: true,
                    reaction_type: reactionType,
                };
            }

            // Optimistic UI update: Immediately show the new reaction state
            setPosts((prev) =>
                prev.map((p) =>
                    p.id === postId
                        ? { ...p, user_interaction: newUserInteraction }
                        : p
                )
            );

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ reaction_type: newUserInteraction.reaction_type }),
            });

            const data = await res.json();
            if (!res.ok) console.error("Reaction failed:", data);

            // Refetch posts to get the updated reaction data
            fetchPosts();
        } catch (err) {
            console.error("Reaction error:", err);
        } finally {
            setActivePostId(null);
        }
    };

    // 💾 Toggle Save Post
    const handleSavePost = async (postId) => {
        try {
            const token = await AsyncStorage.getItem("access_token");
            if (!token) {
                console.warn("No token found");
                return;
            }

            const baseURL = getBaseURL();
            const url = `${baseURL}/api/community/posts/${postId}/save/`;

            setPosts((prev) =>
                prev.map((p) =>
                    p.id === postId ? { ...p, saving: true } : p
                )
            );

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            console.log("Save Post Response:", data);

            if (res.ok && data?.success !== false) {
                setPosts((prev) =>
                    prev.map((p) =>
                        p.id === postId
                            ? {
                                ...p,
                                user_interaction: {
                                    ...p.user_interaction,
                                    is_saved: !p.user_interaction?.is_saved,
                                },
                            }
                            : p
                    )
                );
            } else {
                console.error("Save failed:", data?.message || "Unknown error");
            }

            // Refetch posts to get updated save data
            fetchPosts();
        } catch (err) {
            console.error("Save toggle error:", err);
        } finally {
            setPosts((prev) =>
                prev.map((p) =>
                    p.id === postId ? { ...p, saving: false } : p
                )
            );
        }
    };

    // Handle search input and filter posts based on title/content
    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === "") {
            setFilteredPosts(posts); // Show all posts if search is empty
        } else {
            const filtered = posts.filter(
                (post) =>
                    post.title.toLowerCase().includes(query.toLowerCase()) ||
                    post.content.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredPosts(filtered);
        }
    };

    // 🎴 Render Single Post Card
    const renderPost = ({ item }) => {
        const userReaction = item.user_interaction?.reaction_type;
        const selectedReaction =
            reactions.find((r) => r.type === userReaction) || reactions[0];
        const reactionColor = userReaction ? selectedReaction.color : "#888"; // Default to #888 if no reaction

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate("PostDetail", { postId: item.id })}
            >
                <View style={styles.card}>
                    {item.images && item.images.length > 0 && (
                        <Image
                            source={{ uri: item.images[0] }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    )}

                    {/* 🔖 Save Button */}
                    <TouchableOpacity
                        style={styles.saveBtn}
                        onPress={() => handleSavePost(item.id)}
                    >
                        <Icon
                            name="bookmark"
                            size={18}
                            color={item.user_interaction?.is_saved ? "#f39c12" : "#ccc"}
                        />
                    </TouchableOpacity>

                    <View style={styles.cardContent}>
                        <View style={styles.authorRow}>
                            <Icon name="user" size={16} color="#059BDE" />
                            <Text style={styles.authorName}>
                                {item.author?.name || "Anonymous"}
                            </Text>
                            <Text style={styles.categoryText}> · {item.category}</Text>
                        </View>

                        <Text style={styles.title}>{item.title || "Untitled Post"}</Text>
                        <Text style={styles.content} numberOfLines={5}>
                            {item.content || "No content available"}
                        </Text>

                        {item.tags?.length > 0 && (
                            <Text style={styles.tags}>#{item.tags.join(" #")}</Text>
                        )}

                        {/* 🎉 Reaction Bar */}
                        <View style={styles.reactionRow}>
                            <TouchableOpacity
                                onPress={() => handleReaction(item.id, "like")}
                                onLongPress={() => setActivePostId(item.id)}
                                delayLongPress={100}
                                style={styles.reactionBtn}
                            >
                                <Icon
                                    name={selectedReaction.icon}
                                    size={18}
                                    color={userReaction === "like" ? "#1877F2" : reactionColor}
                                />
                                <Text
                                    style={{
                                        color: userReaction === "like" ? "#1877F2" : reactionColor,
                                        marginLeft: 6,
                                        fontWeight: "600",
                                    }}
                                >
                                    {selectedReaction.label}
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.socialRow}>
                                <View style={styles.socialItem}>
                                    <Icon name="message-circle" size={16} color="#888" />
                                    <Text style={styles.socialText}>
                                        {item.stats?.comments_count || 0}
                                    </Text>
                                </View>
                                <View style={styles.socialItem}>
                                    <Icon name="eye" size={16} color="#888" />
                                    <Text style={styles.socialText}>
                                        {item.stats?.views_count || 0}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* 🧩 Reaction Popup */}
                        {activePostId === item.id && (
                            <Modal transparent animationType="fade" visible>
                                <TouchableOpacity
                                    style={styles.overlay}
                                    onPress={() => setActivePostId(null)}
                                    activeOpacity={1}
                                >
                                    <View style={styles.reactionPopup}>
                                        {reactions.map((r) => (
                                            <TouchableOpacity
                                                key={r.type}
                                                style={styles.reactionOption}
                                                onPress={() => handleReaction(item.id, r.type)}
                                            >
                                                <Icon name={r.icon} size={22} color={r.color} />
                                                <Text
                                                    style={[styles.reactionLabel, { color: r.color }]}
                                                >
                                                    {r.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </TouchableOpacity>
                            </Modal>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    // 🧭 Drawer
    const renderDrawer = () => (
        <SafeAreaView style={styles.drawerContainer}>
            <Text style={styles.drawerTitle}>Menu</Text>

            <TouchableOpacity
                style={styles.drawerButton}
                onPress={() => navigation.navigate("SavedPosts")}
            >
                <Text>Saved Posts</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.drawerButton}
                onPress={() => navigation.navigate("MyPost")}
            >
                <Text>My Posts</Text>
            </TouchableOpacity>

            <View style={styles.categorySection}>
                <Text style={styles.categoryLabel}>Filter by Category:</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedCategory}
                        style={styles.picker}
                        dropdownIconColor="#333"
                        onValueChange={(value) => {
                            setSelectedCategory(value);
                            drawerRef.current.closeDrawer();
                        }}
                    >
                        <Picker.Item label="All" value="all" />
                        <Picker.Item label="Questions" value="questions" />
                        <Picker.Item label="Experiences" value="experiences" />
                        <Picker.Item label="Resources" value="resources" />
                        <Picker.Item label="General" value="general" />
                    </Picker>
                </View>
            </View>
        </SafeAreaView>
    );

    return (
        <DrawerLayout
            ref={drawerRef}
            drawerWidth={250}
            drawerPosition="left"
            renderNavigationView={renderDrawer}
        >
            <SafeAreaView style={styles.container}>
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => drawerRef.current.openDrawer()}
                >
                    <Icon name="menu" size={24} color="#333" />
                </TouchableOpacity>

                <View style={styles.header}>
                    <Text style={styles.pageTitle}>Community Feed</Text>
                </View>

                {/* Search Bar */}
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                />

                {loading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#3498db" />
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity onPress={() => fetchPosts()}>
                            <Text style={styles.retryText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : hasFetched && filteredPosts.length === 0 ? (
                    <View style={styles.noPostContainer}>
                        <Icon name="inbox" size={48} color="#999" style={{ marginBottom: 10 }} />
                        <Text style={styles.noPostText}>No post available</Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredPosts} // Use filteredPosts for displaying posts
                        renderItem={renderPost}
                        keyExtractor={(item) => item.id.toString()}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                        }
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                    />
                )}

                {/* ➕ Floating Create Post Button */}
                <TouchableOpacity
                    style={styles.createPostBtn}
                    onPress={() => navigation.navigate("CreatePost")}
                >
                    <Icon name="plus" size={26} color="#fff" />
                </TouchableOpacity>
            </SafeAreaView>
        </DrawerLayout>
    );
};

export default CommunityScreen;

// --- Styles ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#E8F9FF" },
    header: { backgroundColor: "#F2F2F2", paddingVertical: 15, alignItems: "center" },
    pageTitle: { fontSize: 22, fontWeight: "700", color: "#333" },
    menuButton: { position: "absolute", top: 20, left: 20, zIndex: 2 },
    card: {
        backgroundColor: "#F2F2F2",
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
        overflow: "hidden",
        elevation: 4,
    },
    image: { width: "100%", height: 180 },
    saveBtn: {
        position: "absolute",
        top: 12,
        right: 12,
        backgroundColor: "#fff",
        padding: 6,
        borderRadius: 20,
        elevation: 3,
    },
    cardContent: { padding: 12 },
    authorRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
    authorName: { fontWeight: "600", color: "#222", marginLeft: 5 },
    categoryText: { fontSize: 13, color: "#777" },
    title: { fontSize: 18, fontWeight: "700", color: "#333", marginBottom: 6 },
    content: { fontSize: 14, color: "#444", lineHeight: 20, marginBottom: 8 },
    tags: { fontSize: 13, color: "#777", marginBottom: 8, fontStyle: "italic" },
    reactionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 6,
    },
    reactionBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 30,
        elevation: 2,
    },
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    reactionPopup: {
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 40,
        elevation: 5,
    },
    reactionOption: { alignItems: "center", marginHorizontal: 10 },
    reactionLabel: { fontSize: 12, fontWeight: "600" },
    socialRow: { flexDirection: "row", alignItems: "center", gap: 10 },
    socialItem: { flexDirection: "row", alignItems: "center", gap: 6 },
    socialText: { fontSize: 13, color: "#666" },
    loaderContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
    errorContainer: { alignItems: "center", justifyContent: "center", marginTop: 40 },
    errorText: { color: "red", fontSize: 16, marginBottom: 10, textAlign: "center" },
    retryText: { color: "#3498db", textDecorationLine: "underline" },
    noPostContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 80 },
    noPostText: { fontSize: 16, color: "#555", fontWeight: "600" },
    drawerContainer: { flex: 1, backgroundColor: "#fff", padding: 20 },
    drawerTitle: { fontSize: 20, fontWeight: "700", marginBottom: 20, color: "#333" },
    drawerButton: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" },
    categorySection: { marginTop: 30 },
    categoryLabel: { fontSize: 15, fontWeight: "600", marginBottom: 5 },
    pickerContainer: { backgroundColor: "#f9f9f9", borderRadius: 8 },
    picker: { height: 50, width: "100%" },
    createPostBtn: {
        position: "absolute",
        bottom: 30,
        right: 25,
        backgroundColor: "#3498db",
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    searchBar: {
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 25,
        margin: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#ccc",
    },
});
