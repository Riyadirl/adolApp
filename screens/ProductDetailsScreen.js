import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    useWindowDimensions,
    FlatList,
    TextInput,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const relatedProducts = [
    { id: '11', title: 'Modern Lamp', price: '$15.99', image: require('../assets/store/1.png') },
    { id: '12', title: 'Wooden Shelf', price: '$45.00', image: require('../assets/store/2.png') },
    { id: '13', title: 'Comfy Sofa', price: '$299.99', image: require('../assets/store/3.jpg') },
];

const ProductDetailsScreen = ({ route }) => {
    const { product } = route.params;
    const { width } = useWindowDimensions();
    const navigation = useNavigation();

    const [quantity, setQuantity] = useState(1);
    const [cart, setCart] = useState([]);
    const [reviews, setReviews] = useState([
        { id: '1', user: 'Alice', rating: 5, comment: 'Love this product!' },
        { id: '2', user: 'Bob', rating: 4, comment: 'Good value for money.' },
    ]);
    const [newReviewText, setNewReviewText] = useState('');
    const [newReviewRating, setNewReviewRating] = useState(0);

    const incrementQty = () => setQuantity(q => q + 1);
    const decrementQty = () => setQuantity(q => (q > 1 ? q - 1 : 1));

    const addToCart = () => {
        const existingIndex = cart.findIndex(item => item.product.id === product.id);
        let newCart = [...cart];
        if (existingIndex >= 0) {
            newCart[existingIndex].quantity += quantity;
        } else {
            newCart.push({ product, quantity });
        }
        setCart(newCart);
        Alert.alert('Success', `${quantity} x ${product.title} added to cart.`);
    };

    const submitReview = () => {
        if (newReviewRating === 0) {
            Alert.alert('Error', 'Please select a rating.');
            return;
        }
        if (newReviewText.trim() === '') {
            Alert.alert('Error', 'Please enter a review.');
            return;
        }

        const newReview = {
            id: Math.random().toString(),
            user: 'You',
            rating: newReviewRating,
            comment: newReviewText.trim(),
        };
        setReviews([newReview, ...reviews]);
        setNewReviewText('');
        setNewReviewRating(0);
        Alert.alert('Thank you!', 'Your review has been submitted.');
    };

    const renderReview = ({ item }) => (
        <View style={styles.reviewCard}>
            <Text style={styles.reviewUser}>{item.user}</Text>
            <View style={styles.reviewStars}>
                {[...Array(5)].map((_, i) => (
                    <Icon
                        key={i}
                        name={i < item.rating ? 'star' : 'star-outline'}
                        size={16}
                        color="#FFD700"
                    />
                ))}
            </View>
            <Text style={styles.reviewComment}>{item.comment}</Text>
        </View>
    );

    const renderRelatedProduct = ({ item }) => (
        <TouchableOpacity style={[styles.relatedCard, { width: width * 0.4 }]}>
            <Image source={item.image} style={styles.relatedImage} />
            <Text numberOfLines={1} style={styles.relatedTitle}>{item.title}</Text>
            <Text style={styles.relatedPrice}>{item.price}</Text>
        </TouchableOpacity>
    );

    const renderStarSelector = () => (
        <View style={styles.starSelector}>
            {[...Array(5)].map((_, i) => {
                const starName = i < newReviewRating ? 'star' : 'star-outline';
                return (
                    <TouchableOpacity key={i} onPress={() => setNewReviewRating(i + 1)}>
                        <Icon name={starName} size={30} color="#FFD700" />
                    </TouchableOpacity>
                );
            })}
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            {/* Back button */}
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
                activeOpacity={0.7}
            >
                <Icon name="arrow-back" size={28} color="#0277BD" />
            </TouchableOpacity>

            <Image
                source={product.image}
                style={[styles.image, { width: width, height: width * 0.75 }]}
                resizeMode="cover"
            />

            <View style={styles.content}>
                <Text style={styles.title}>{product.title}</Text>
                <Text style={styles.price}>{product.price}</Text>

                <View style={styles.quantityRow}>
                    <Text style={styles.quantityLabel}>Quantity:</Text>
                    <View style={styles.quantityControls}>
                        <TouchableOpacity onPress={decrementQty} style={styles.qtyButton}>
                            <Icon name="remove" size={20} color="#0277BD" />
                        </TouchableOpacity>
                        <Text style={styles.qtyValue}>{quantity}</Text>
                        <TouchableOpacity onPress={incrementQty} style={styles.qtyButton}>
                            <Icon name="add" size={20} color="#0277BD" />
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.descriptionTitle}>Product Description</Text>
                <Text style={styles.description}>
                    This is a beautiful {product.title.toLowerCase()} crafted with quality materials and an eye for design. Perfect for enhancing your home or gifting to loved ones.
                </Text>

                <TouchableOpacity style={styles.addButton} onPress={addToCart}>
                    <Icon name="cart-outline" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Add to Cart</Text>
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>Customer Reviews</Text>
                <FlatList
                    data={reviews}
                    keyExtractor={(item) => item.id}
                    renderItem={renderReview}
                    scrollEnabled={false}
                    style={{ marginBottom: 20 }}
                />

                <Text style={styles.sectionTitle}>Write a Review</Text>
                {renderStarSelector()}
                <TextInput
                    style={styles.reviewInput}
                    placeholder="Write your review here"
                    value={newReviewText}
                    onChangeText={setNewReviewText}
                    multiline
                />
                <TouchableOpacity style={styles.submitReviewButton} onPress={submitReview}>
                    <Text style={styles.submitReviewText}>Submit Review</Text>
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>Related Products</Text>
                <FlatList
                    data={relatedProducts}
                    horizontal
                    keyExtractor={(item) => item.id}
                    renderItem={renderRelatedProduct}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 8 }}
                />
            </View>
        </ScrollView>
    );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    backButton: {
        marginTop: 40,
        marginLeft: 16,
        padding: 6,
        position: 'absolute',
        zIndex: 10,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 30,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
    },
    image: {
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    content: {
        padding: 16,
        marginTop: 80, // to avoid overlap with back button
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    price: {
        fontSize: 20,
        fontWeight: '600',
        color: '#0277BD',
        marginBottom: 12,
    },
    quantityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    quantityLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginRight: 10,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#0277BD',
        borderRadius: 8,
        overflow: 'hidden',
    },
    qtyButton: {
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    qtyValue: {
        fontSize: 16,
        fontWeight: '600',
        paddingHorizontal: 12,
    },
    descriptionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 6,
        color: '#555',
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        color: '#666',
        marginBottom: 20,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0277BD',
        paddingVertical: 12,
        borderRadius: 10,
        marginBottom: 30,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#059BDE',
        marginBottom: 12,
    },
    reviewCard: {
        backgroundColor: '#F5F8FF',
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
    },
    reviewUser: {
        fontWeight: '700',
        color: '#0277BD',
        marginBottom: 4,
    },
    reviewStars: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    reviewComment: {
        fontSize: 14,
        color: '#444',
    },
    starSelector: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    reviewInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        height: 80,
        textAlignVertical: 'top',
        marginBottom: 12,
    },
    submitReviewButton: {
        backgroundColor: '#0277BD',
        paddingVertical: 12,
        borderRadius: 10,
        marginBottom: 30,
        alignItems: 'center',
    },
    submitReviewText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
    relatedCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginRight: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
        padding: 8,
        alignItems: 'center',
    },
    relatedImage: {
        width: '100%',
        height: 120,
        borderRadius: 10,
        marginBottom: 8,
    },
    relatedTitle: {
        fontWeight: '600',
        fontSize: 14,
        color: '#333',
    },
    relatedPrice: {
        fontWeight: 'bold',
        fontSize: 13,
        color: '#0277BD',
        marginTop: 2,
    },
});
