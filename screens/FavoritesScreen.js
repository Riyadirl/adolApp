import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    RefreshControl,
    SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

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
            liked: i % 3 === 0,
            likes: Math.floor(Math.random() * 200),
            comments: Math.floor(Math.random() * 60),
            shares: Math.floor(Math.random() * 30),
            author: `user${i + 1}`,
            content
        };
    });
};

const FavoritesScreen = () => {
    const navigation = useNavigation();
    const allPosts = generateDemoFavorites();
    const [favorites, setFavorites] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const pageSize = 10;

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

    const toggleLike = (postId) => {
        setFavorites(prev =>
            prev.map(post =>
                post.id === postId
                    ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
                    : post
            )
        );
    };

    const renderPost = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('PostDetail', { post: item })}
            >
                {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
                ) : null}

                <TouchableOpacity
                    style={styles.favoriteBtn}
                    onPress={() => toggleLike(item.id)}
                >
                    <Icon
                        name="bookmark"
                        size={18}
                        color={item.liked ? '#e74c3c' : '#ccc'}
                    />
                </TouchableOpacity>

                <View style={styles.cardContent}>
                    {item.title ? <Text style={styles.title}>{item.title}</Text> : null}
                    <Text style={styles.content} numberOfLines={6}>
                        {item.content}
                    </Text>
                    <View style={styles.socialRow}>
                        <View style={styles.socialItem}>
                            <Icon name="heart" size={16} color={item.liked ? '#e74c3c' : '#888'} />
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
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Favorites Posts</Text>
                <Icon name="star" size={24} color="#FFDC60" style={styles.headerIcon} />
            </View>

            <FlatList
                data={favorites}
                renderItem={renderPost}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingTop: 60, paddingBottom: 20 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
                onEndReached={loadMorePosts}
                onEndReachedThreshold={0.5}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8F9FF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        backgroundColor: '#E8F9FF',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        elevation: 2,
    },
    headerText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        marginRight: 10,
    },
    headerIcon: {
        marginLeft: 10,
    },
    card: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 2,
    },
    image: {
        width: '100%',
        height: 180,
    },
    favoriteBtn: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: '#fff',
        padding: 6,
        borderRadius: 20,
        elevation: 2,
    },
    cardContent: {
        padding: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
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
});

export default FavoritesScreen;
