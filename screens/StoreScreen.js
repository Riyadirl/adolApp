import React from 'react';
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

const StoreScreen = ({ navigation }) => {
    const { width } = useWindowDimensions();
    const cardWidth = (width - 36) / 2; // 12px padding + 12px gap between columns

    const products = [
        { id: '1', title: 'Elegant Lamp', price: '$10.99', image: require('../assets/store/1.png'), tag: 'Best Seller' },
        { id: '2', title: 'Wooden Table', price: '$14.95', image: require('../assets/store/2.png'), tag: 'New' },
        { id: '3', title: 'Modern Chair', price: '$20.95', image: require('../assets/store/3.jpg'), tag: 'New' },
        { id: '4', title: 'Wall Clock', price: '$25.95', image: require('../assets/store/4.jpg'), tag: 'New' },
        { id: '5', title: 'Indoor Plant', price: '$18.95', image: require('../assets/store/5.jpg'), tag: 'New' },
        { id: '6', title: 'Decor Vase', price: '$20', image: require('../assets/store/6.jpg'), tag: 'New' },
        { id: '7', title: 'Vintage Radio', price: '$14.95', image: require('../assets/store/7.jpg'), tag: 'New' },
        { id: '8', title: 'Art Frame', price: '$10', image: require('../assets/store/8.jpg'), tag: 'New' },
        { id: '9', title: 'Rug Carpet', price: '$20', image: require('../assets/store/9.jpg'), tag: 'New' },
        { id: '10', title: 'Stylish Mug', price: '$14.95', image: require('../assets/store/10.jpg'), tag: 'New' },
    ];

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
            <Text style={styles.heading}>Shop the Look</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
                <TouchableOpacity style={styles.filterChip} onPress={() => navigation.navigate('Store')}>
                    <Icon name="home-outline" size={16} style={styles.icon} />
                    <Text style={styles.chipText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterChip} onPress={() => navigation.navigate('Category')}>
                    <Icon name="grid-outline" size={16} style={styles.icon} />
                    <Text style={styles.chipText}>Categories</Text>
                </TouchableOpacity>
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
                <TouchableOpacity style={styles.filterChip}>
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

export default StoreScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        paddingHorizontal: 12,
        paddingTop: 10,
    },
    heading: {
        fontSize: 26,
        fontWeight: '700',
        marginBottom: 15,
        color: '#333',
        textAlign: 'center',
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
});
