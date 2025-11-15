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
    TextInput, // Import TextInput for the search bar
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../scr/config";

const { width } = Dimensions.get("window");

const getBaseURL = () => {
    if (Platform.OS === "android") return BASE_URL;
    return "http://127.0.0.1:8000";
};

const SavedPostsScreen = () => {
    const navigation = useNavigation();
    const [savedPosts, setSavedPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]); // For storing filtered posts
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(""); // State for search query

    useEffect(() => {
        fetchSavedPosts();
    }, []);

    const fetchSavedPosts = async () => {
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
            console.log("Fetched posts:", response);

            if (res.ok && response.success) {
                const allPosts = response?.data?.posts ?? [];

                // ⭐ Filter only saved posts
                const savedList = allPosts.filter(
                    (post) => post?.user_interaction?.is_saved === true
                );

                console.log("Saved Posts:", savedList);
                setSavedPosts(savedList);
                setFilteredPosts(savedList); // Set both original and filtered posts
            } else {
                console.error("Fetch error:", response.message);
            }
        } catch (err) {
            console.error("Error fetching saved posts:", err);
        } finally {
            setLoading(false);
        }
    };

    // Handle search functionality
    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === "") {
            setFilteredPosts(savedPosts); // Show all posts if search is empty
        } else {
            const filtered = savedPosts.filter(
                (post) =>
                    post.title.toLowerCase().includes(query.toLowerCase()) ||
                    post.content.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredPosts(filtered);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.centered}>
                <ActivityIndicator size="large" color="#059BDE" />
                <Text style={{ color: "#059BDE", marginTop: 10 }}>
                    Loading saved posts...
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
                <Text style={styles.headerTitle}>Saved Posts</Text>
            </View>

            {/* Search Bar */}
            <TextInput
                style={styles.searchBar}
                placeholder="Search saved posts..."
                value={searchQuery}
                onChangeText={handleSearch}
            />

            {filteredPosts.length === 0 ? (
                <View style={styles.centered}>
                    <Text style={{ color: "#777" }}>No saved posts found.</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredPosts} // Use filtered posts for display
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ padding: width * 0.04 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() =>
                                navigation.navigate("PostDetail", {
                                    postId: item.id, // 🔥 Navigate with only postId
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

                                {item.images?.length > 0 && (
                                    <Image
                                        source={{ uri: item.images[0] }}
                                        style={styles.postImage}
                                    />
                                )}
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </SafeAreaView>
    );
};

export default SavedPostsScreen;

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
        marginTop: 8,
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
