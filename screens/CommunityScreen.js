import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, RefreshControl, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';  // For bookmark icon
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout'; // DrawerLayout for the sidebar
import { useNavigation } from '@react-navigation/native';

// Generate demo favorites (data for testing)
const generateDemoFavorites = () => {
    const sampleParagraphs = [
        "Today started off rough, but I took a moment to breathe and reflect. It's amazing what a little gratitude can do to shift your mindset.",
        "Sometimes we forget how far we've come. It’s okay to look back, smile, and give yourself some credit.",
        "The world moves fast, but peace comes when we slow down and notice the beauty around us — a bird singing, the breeze on your face, a smile from a stranger.",
        "This week I challenged myself to avoid negative self-talk. It was harder than I expected, but incredibly freeing.",
        "Never underestimate the power of simply showing up. Even on days when you're tired or anxious — your presence matters.",
        "I used to fear failure, but now I realize it's just part of learning. Each step back taught me something valuable.",
        "We all struggle sometimes. You're not alone, and you don't have to pretend to be okay all the time. Rest is productive too.",
        "It's funny how life works. The things I used to stress over now seem so small. Growth changes perspective.",
        "Kindness isn't just about grand gestures. It's in listening, checking in, and giving others space to be themselves.",
        "If you're doubting your path — breathe. You’re growing. And growth never feels comfortable."
    ];

    return Array.from({ length: 50 }, (_, i) => {
        const paragraphCount = 2 + Math.floor(Math.random() * 3);
        const content = Array.from({ length: paragraphCount }, () =>
            sampleParagraphs[Math.floor(Math.random() * sampleParagraphs.length)]
        ).join('\n\n');

        return {
            id: (i + 1).toString(),
            title: Math.random() < 0.6 ? `Thoughts from Today #${i + 1}` : null,
            image: Math.random() < 0.4 ? `https://picsum.photos/seed/post${i + 1}/600/400` : '',
            saved: i % 3 === 0,  // Track if the post is saved
            likes: Math.floor(Math.random() * 200),
            comments: Math.floor(Math.random() * 60),
            shares: Math.floor(Math.random() * 30),
            author: `user${i + 1}`,
            content
        };
    });
};

const CommunityScreen = () => {
    const navigation = useNavigation();
    const allPosts = generateDemoFavorites();
    const [favorites, setFavorites] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const pageSize = 10;

    const drawerRef = useRef(null); // Ref for the drawer

    useEffect(() => {
        loadMorePosts();
    }, []);

    const loadMorePosts = () => {
        if (loading) return;
        setLoading(true);
        setTimeout(() => {
            const newPosts = allPosts.slice((page - 1) * pageSize, page * pageSize);
            setFavorites(prev => [...prev, ...newPosts]);
            setPage(prev => prev + 1);
            setLoading(false);
        }, 500);
    };

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setFavorites(allPosts.slice(0, pageSize));
            setPage(2);
            setRefreshing(false);
        }, 800);
    };

    const toggleSave = (postId) => {
        setFavorites(prev =>
            prev.map(post =>
                post.id === postId
                    ? { ...post, saved: !post.saved }
                    : post
            )
        );
    };

    const renderPost = ({ item }) => (
        <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => navigation.navigate('PostDetail', { post: item })}>
            {item.image ? <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" /> : null}

            <TouchableOpacity style={styles.saveBtn} onPress={() => toggleSave(item.id)}>
                <Icon name="bookmark" size={18} color={item.saved ? '#f39c12' : '#ccc'} />
            </TouchableOpacity>

            <View style={styles.cardContent}>
                {item.title ? <Text style={styles.title}>{item.title}</Text> : null}
                <Text style={styles.content} numberOfLines={6}>
                    {item.content}
                </Text>
                <View style={styles.socialRow}>
                    <View style={styles.socialItem}>
                        <Icon name="heart" size={16} color="#888" />
                        <Text style={styles.socialText}>{item.likes}</Text>
                    </View>
                    <View style={styles.socialItem}>
                        <Icon name="message-circle" size={16} color="#888" />
                        <Text style={styles.socialText}>{item.comments}</Text>
                    </View>
                    <View style={styles.socialItem}>
                        <Icon name="share-2" size={16} color="#888" />
                        <Text style={styles.socialText}>{item.shares}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    // Drawer content (sidebar options)
    const renderDrawer = () => (
        <SafeAreaView style={styles.drawerContainer}>
            <Text style={styles.drawerTitle}>Menu</Text>
            <TouchableOpacity style={styles.drawerButton} onPress={() => navigation.navigate('SavedPosts')}>
                <Text>Saved Posts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.drawerButton} onPress={() => navigation.navigate('MyActivity')}>
                <Text>My Post</Text>
            </TouchableOpacity>
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
                {/* Hamburger Menu Button */}
                <TouchableOpacity style={styles.menuButton} onPress={() => drawerRef.current.openDrawer()}>
                    <Icon name="menu" size={24} color="#333" />
                </TouchableOpacity>

                {/* Page Title */}
                <View style={styles.pageTitleContainer}>
                    <Text style={styles.pageTitle}>Community Feed</Text>
                </View>

                <FlatList
                    data={favorites}
                    renderItem={renderPost}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingTop: 60, paddingBottom: 100 }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
                    onEndReached={loadMorePosts}
                    onEndReachedThreshold={0.5}
                    showsVerticalScrollIndicator={false}
                />

                {/* Floating Create Post Button */}
                <TouchableOpacity style={styles.createPostBtn} onPress={() => navigation.navigate('CreatePost')}>
                    <Icon name="plus" size={24} color="#fff" />
                </TouchableOpacity>
            </SafeAreaView>
        </DrawerLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8F9FF',
    },
    menuButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 2,
    },
    pageTitleContainer: {
        paddingTop: 20,
        paddingBottom: 10,
        backgroundColor: '#F2F2F2',
        elevation: 2,
        alignItems: 'center',
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
    },
    card: {
        backgroundColor: '#F2F2F2',
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 4,
    },
    image: {
        width: '100%',
        height: 180,
        borderRadius: 12,
    },
    saveBtn: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: '#fff',
        padding: 6,
        borderRadius: 20,
        elevation: 3,
    },
    cardContent: {
        padding: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 10,
    },
    content: {
        fontSize: 14,
        color: '#444',
        lineHeight: 20,
        marginBottom: 12,
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 4,
    },
    socialItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    socialText: {
        fontSize: 13,
        color: '#666',
    },
    createPostBtn: {
        position: 'absolute',
        bottom: 30,
        right: 25,
        backgroundColor: '#3498db',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
    },
    // Sidebar styles
    drawerContainer: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    drawerTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 20,
        color: '#333',
    },
    drawerButton: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default CommunityScreen;
