import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    ScrollView,
    useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import productsData from '../assets/data/product.json';

const NewProductsScreen = ({ navigation }) => {
    const { width } = useWindowDimensions();
    const cardWidth = (width - 36) / 2;
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const loadProducts = () => {
            const bestSellers = productsData.filter((item) => item.tag === 'New');
            const updated = bestSellers.map((item) => ({
                ...item,
                image: getImage(item.image),
            }));
            setProducts(updated);
        };

        const getImage = (imagePath) => {
            switch (imagePath) {
                case '1.jpg':
                    return require('../assets/store/1.jpg');
                case '2.jpg':
                    return require('../assets/store/2.jpg');
                case '3.jpg':
                    return require('../assets/store/3.jpg');
                case '4.jpg':
                    return require('../assets/store/4.jpg');
                case '5.jpg':
                    return require('../assets/store/5.jpg');
                case '6.jpg':
                    return require('../assets/store/6.jpg');
                case '7.jpg':
                    return require('../assets/store/7.jpg');
                case '8.jpg':
                    return require('../assets/store/8.jpg');
                case '9.jpg':
                    return require('../assets/store/9.jpg');
                case '10.jpg':
                    return require('../assets/store/10.jpg');
                default:
                    return require('../assets/store/1.jpg');
            }
        };

        loadProducts();
    }, []);

    const renderProduct = ({ item }) => (
        <TouchableOpacity
            style={[styles.productCard, { width: cardWidth }]}
            onPress={() => navigation.navigate('ProductDetails', { product: item })}
            activeOpacity={0.8}
        >
            <Image source={item.image} style={styles.productImage} resizeMode="cover" />
            <View style={styles.productInfo}>
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.price}>{item.price}</Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
                <Icon name="cart-outline" size={18} color="#fff" />
                <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate("Main", { screen: 'Store' })} style={styles.backButton}>
                    <Icon name="chevron-back-outline" size={24} color="#0277BD" />
                </TouchableOpacity>
                <Text style={styles.heading}>New Added</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
                {/* <TouchableOpacity style={styles.filterChip} onPress={() => navigation.navigate('Category', { products })}>
                    <Icon name="grid-outline" size={16} style={styles.icon} />
                    <Text style={styles.chipText}>Categories</Text>
                </TouchableOpacity> */}
                <TouchableOpacity
                    style={styles.filterChip}
                    onPress={() => {
                        const bestSellers = products.filter((item) => item.tag === 'Best Seller');
                        navigation.navigate('BestSeller', { bestSellers });
                    }}
                >
                    <Icon name="flame-outline" size={16} style={styles.icon} />
                    <Text style={styles.chipText}>Best Seller</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.filterChip}
                    onPress={() => {
                        const newProducts = products.filter((item) => item.tag === 'New');
                        navigation.navigate('NewProducts', { newProducts });
                    }}
                >
                    <Icon name="sparkles-outline" size={16} style={styles.icon} />
                    <Text style={styles.chipText}>New</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterChip}
                    onPress={() => {
                        const newProducts = products.filter((item) => item.tag === 'New');
                        navigation.navigate('Cart');
                    }}
                >
                    <Icon name="cart-outline" size={16} style={styles.icon} />
                    <Text style={styles.chipText}>Cart</Text>
                </TouchableOpacity>
            </ScrollView>

            <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.productsList}
                scrollEnabled={false}
            />
        </ScrollView>
    );
};

export default NewProductsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8F9FF',
        paddingHorizontal: 12,
        paddingTop: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    backButton: {
        marginRight: 8,
    },
    heading: {
        fontSize: 26,
        fontWeight: '700',
        color: '#333',
    },
    productsList: {
        paddingBottom: 100,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 18,
    },
    productCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 4,
    },
    productImage: {
        width: '100%',
        height: 130,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
    },
    productInfo: {
        marginTop: 10,
        marginBottom: 8,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    price: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#666',
        marginTop: 3,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0277BD',
        borderRadius: 8,
        paddingVertical: 6,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 6,
    },
    filterBar: {
        marginBottom: 15,
        flexDirection: 'row',
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E1F5FE',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 25,
        marginRight: 10,
    },
    chipText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    icon: {
        marginRight: 6,
        color: '#0277BD',
    },
});
