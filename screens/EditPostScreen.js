import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Dimensions,
    ScrollView,
    Image,
    Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { useRoute } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const getBaseURL = () => {
    if (Platform.OS === "android") return "http://192.168.10.108:8000"; // Android Emulator
    if (Platform.OS === "ios") return "http://127.0.0.1:8000";    // iOS Simulator
    return "http://127.0.0.1:8000";                              // Web / desktop
};

const EditPostScreen = ({ navigation }) => {
    const route = useRoute();
    const { postId, existingData } = route.params;

    const [title, setTitle] = useState(existingData.title || "");
    const [content, setContent] = useState(existingData.content || "");
    const [category, setCategory] = useState(existingData.category || "general");
    const [tags, setTags] = useState(existingData.tags || "");
    const [images, setImages] = useState(existingData.images || []);
    const [removeImages, setRemoveImages] = useState([]);
    const [loading, setLoading] = useState(false);

    // 🖼️ Pick up to 5 images
    const handleImagePick = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert("Permission required", "You need to grant gallery access.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            allowsMultipleSelection: true,
            selectionLimit: 5,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            setImages(result.assets.map((a) => a.uri));
        }
    };

    // 🚀 Edit Post
    const handleEditPost = async () => {
        if (!title.trim() || !content.trim()) {
            Alert.alert("Validation Error", "Title and content are required.");
            return;
        }

        try {
            const token = await AsyncStorage.getItem("access_token");
            if (!token) {
                Alert.alert("Authentication Error", "Please log in again.");
                return;
            }

            setLoading(true);
            const baseURL = getBaseURL();

            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);
            formData.append("category", category);
            if (tags) formData.append("tags", tags);

            // Add image files properly
            images.forEach((uri, index) => {
                const filename = uri.split("/").pop();
                const ext = filename.split(".").pop();
                const type = `image/${ext}`;
                formData.append("images", {
                    uri,
                    name: filename,
                    type,
                });
            });

            // Add images to remove
            if (removeImages.length > 0) {
                formData.append("remove_images", removeImages.join(","));
            }

            // ✅ Do NOT set "Content-Type" manually for FormData
            const response = await fetch(`${baseURL}/api/community/posts/${postId}/`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const result = await response.json();
            console.log("POST RESPONSE:", result);

            if (response.ok && result.success !== false) {
                Alert.alert("✅ Success", "Post updated successfully!");
                navigation.goBack();
            } else {
                console.error("POST FAILED:", result);
                Alert.alert("❌ Error", result.message || "Failed to update post.");
            }
        } catch (error) {
            console.error("POST ERROR:", error);
            Alert.alert("Network Error", "Could not reach the server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Handle image removal (for images to delete)
    const handleRemoveImage = (uri) => {
        setRemoveImages((prev) => [...prev, uri]);
        setImages((prev) => prev.filter((image) => image !== uri));
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back-outline" size={24} color="#059BDE" />
            </TouchableOpacity>

            <Text style={styles.header}>Edit Post</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter Post Title *"
                value={title}
                onChangeText={setTitle}
            />

            <TextInput
                style={[styles.input, { height: 120 }]}
                placeholder="Write your post content *"
                value={content}
                onChangeText={setContent}
                multiline
            />

            <View style={styles.pickerContainer}>
                <Text style={styles.label}>Select Category *</Text>
                <Picker
                    selectedValue={category}
                    onValueChange={(itemValue) => setCategory(itemValue)}
                    style={styles.picker}
                    dropdownIconColor="#333"
                >
                    <Picker.Item label="General" value="general" />
                    <Picker.Item label="Questions" value="questions" />
                    <Picker.Item label="Experiences" value="experiences" />
                    <Picker.Item label="Resources" value="resources" />
                </Picker>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Tags (comma-separated)"
                value={tags}
                onChangeText={setTags}
            />

            <TouchableOpacity style={styles.imageUploadButton} onPress={handleImagePick}>
                <Ionicons name="image-outline" size={28} color="#6c3fc1" />
                <Text style={styles.imageUploadText}>
                    {images.length > 0 ? "Change Images" : "Upload Images"}
                </Text>
            </TouchableOpacity>

            {images.length > 0 && (
                <View style={styles.imagePreviewContainer}>
                    {images.map((uri, index) => (
                        <View key={index} style={styles.imagePreviewWrapper}>
                            <Image source={{ uri }} style={styles.imagePreview} />
                            <TouchableOpacity
                                style={styles.removeImageButton}
                                onPress={() => handleRemoveImage(uri)}
                            >
                                <Ionicons name="trash" size={18} color="red" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}

            <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.6 }]}
                onPress={handleEditPost}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? "Updating..." : "Update Post"}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default EditPostScreen;

const styles = StyleSheet.create({
    container: {
        padding: width * 0.05,
        backgroundColor: "#E8F9FF",
        flexGrow: 1,
    },
    backButton: {
        marginBottom: 10,
        alignSelf: "flex-start",
    },
    header: {
        fontSize: width * 0.06,
        fontWeight: "bold",
        color: "#059BDE",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        backgroundColor: "#f2f2f2",
        padding: 12,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginLeft: 10,
        marginTop: 8,
    },
    pickerContainer: {
        marginBottom: 15,
        backgroundColor: "#f2f2f2",
        borderRadius: 10,
    },
    picker: {
        height: 50,
        width: "100%",
    },
    imageUploadButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#e6e6f2",
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
        justifyContent: "center",
    },
    imageUploadText: {
        fontSize: 16,
        color: "#6c3fc1",
        marginLeft: 10,
    },
    imagePreviewContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 15,
    },
    imagePreviewWrapper: {
        position: "relative",
    },
    imagePreview: {
        width: width * 0.25,
        height: width * 0.25,
        borderRadius: 8,
    },
    removeImageButton: {
        position: "absolute",
        top: -5,
        right: -5,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: 15,
        padding: 5,
    },
    button: {
        backgroundColor: "#059BDE",
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: "center",
        marginTop: 10,
        elevation: 3,
    },
    buttonText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "600",
    },
});
