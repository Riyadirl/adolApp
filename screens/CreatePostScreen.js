import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker for image upload functionality

const { width } = Dimensions.get('window');

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=Demo+User';

const CreatePostScreen = ({ route }) => {
    const navigation = useNavigation();
    const [author, setAuthor] = useState('');
    const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUri, setImageUri] = useState(null); // State to store selected image URI

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                if (userData) {
                    const user = JSON.parse(userData);
                    setAuthor(user.name || 'Anonymous');

                    if (user.avatar && user.avatar.trim() !== '') {
                        setAvatar(user.avatar);
                    } else {
                        setAvatar(DEFAULT_AVATAR);
                    }
                }
            } catch (error) {
                console.error('Failed to load user:', error);
                setAvatar(DEFAULT_AVATAR);
            }
        };
        loadUser();
    }, []);

    const handleCreatePost = async () => {
        if (!title || !content) {
            Alert.alert('Validation Error', 'Title and content are required.');
            return;
        }

        const newPost = {
            id: Date.now().toString(),
            author,
            avatar,
            title,
            content,
            imageUri,
        };

        try {
            const existing = await AsyncStorage.getItem('posts');
            const postList = existing ? JSON.parse(existing) : [];
            const updated = [newPost, ...postList];
            await AsyncStorage.setItem('posts', JSON.stringify(updated));

            if (route.params?.onPostCreated) {
                route.params.onPostCreated();
            }

            Alert.alert('Success', 'Post created successfully!');
            navigation.goBack();
        } catch (error) {
            console.error('Failed to save post:', error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        }
    };

    const handleImagePick = async () => {
        // Ask for permission to access the photo library
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert('Permission required', 'Permission to access camera roll is required!');
            return;
        }

        // Pick an image from the gallery
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.cancelled) {
            setImageUri(result.uri); // Store the URI of the selected image
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Back Button Icon */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back-outline" size={24} color="#059BDE" />
            </TouchableOpacity>

            <Text style={styles.header}>Create New Post</Text>

            {/* Image Upload Section */}
            <TouchableOpacity style={styles.imageUploadButton} onPress={handleImagePick}>
                <Ionicons name="image-outline" size={30} color="#6c3fc1" />
                <Text style={styles.imageUploadText}>
                    {imageUri ? 'Change Image' : 'Upload Image'}
                </Text>
            </TouchableOpacity>

            {imageUri && (
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            )}

            {/* Title Input */}
            <TextInput
                style={styles.input}
                placeholder="Post Title"
                value={title}
                onChangeText={setTitle}
            />

            {/* Content Input */}
            <TextInput
                style={[styles.input, { height: 120 }]}
                placeholder="Content"
                value={content}
                onChangeText={setContent}
                multiline
            />

            {/* Post Button */}
            <TouchableOpacity style={styles.button} onPress={handleCreatePost}>
                <Text style={styles.buttonText}>Post</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default CreatePostScreen;

const styles = StyleSheet.create({
    container: {
        padding: width * 0.05,
        backgroundColor: '#E8F9FF',
        flexGrow: 1,
    },
    backButton: {
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    header: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        color: '#059BDE',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#f2f2f2',
        padding: 12,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#059BDE',
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 10,
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
    },
    imageUploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e6e6f2',
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
        justifyContent: 'center',
    },
    imageUploadText: {
        fontSize: 16,
        color: '#6c3fc1',
        marginLeft: 10,
    },
    imagePreview: {
        width: '100%',
        height: 200,
        marginTop: 10,
        borderRadius: 8,
        resizeMode: 'cover',
    },
});
