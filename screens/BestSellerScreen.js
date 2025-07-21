import React from 'react';
import {
    View, Text, StyleSheet, FlatList,
    Image, TouchableOpacity, ScrollView,
} from 'react-native';
import Navbar from './NavBar';

const BestSellerScreen = ({ route, navigation }) => {
    const { bestSellers } = route.params;

    const renderProduct = ({ item }) => (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() => navigation.navigate('ProductDetails', { product: item })}
            activeOpacity={0.8}
        >
            <Image source={item.image} style={styles.productImage} resizeMode="cover" />
            <View style={styles.cardContent}>
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.price}>{item.price}</Text>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            <Navbar />
            <Text style={styles.heading}>🔥 Best Sellers</Text>

            {/* Filter Bar */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
                <TouchableOpacity style={styles.filterChip}>
                    <Text onPress={() => navigation.navigate('Store')}>🏠 Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterChip}>
                    <Text onPress={() => navigation.navigate('Category')}>📂 Category</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterChip}>
                    <Text>More...</Text>
                </TouchableOpacity>
            </ScrollView>

            <FlatList
                data={bestSellers}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.productsList}
            />
        </ScrollView>
    );
};

export default BestSellerScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        padding: 10,
    },
    heading: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
        color: '#222',
    },
    filterBar: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    filterChip: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
    },
    productsList: {
        paddingBottom: 100,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    productCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        width: '48%',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 3,
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: 120,
        backgroundColor: '#F0F0F0',
    },
    cardContent: {
        padding: 10,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
        color: '#333',
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#009688',
    },
    button: {
        backgroundColor: '#059BDE',
        borderRadius: 8,
        paddingVertical: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
});
