import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import Navbar from './NavBar';

const NewProductsScreen = ({ route, navigation }) => {
    const { newProducts } = route.params;

    const renderProduct = ({ item }) => (
        <View style={styles.productCard}>
            <TouchableOpacity onPress={() => navigation.navigate('ProductDetails', { product: item })}>
                <Image source={item.image} style={styles.productImage} resizeMode="contain" />
            </TouchableOpacity>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>{item.price}</Text>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Add to Cart</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <Navbar />
            <Text style={styles.heading}>New Products</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} >
                <TouchableOpacity style={styles.filterChip}> <Text onPress={() => navigation.navigate("Store")}>Home </Text></TouchableOpacity >
                <TouchableOpacity style={styles.filterChip}> <Text onPress={() => navigation.navigate("Category")}>Category </Text></TouchableOpacity >
                {/* <TouchableOpacity
                                style={styles.filterChip}
                                onPress={() => {
                                    const bestSellers = products.filter((item) => item.tag === 'Best Seller');
                                    navigation.navigate('BestSeller', { bestSellers });
                                }}
                            >
                                <Text>Bestsellers</Text>
                            </TouchableOpacity>
            
                            <TouchableOpacity
                                style={styles.filterChip}
                                onPress={() => {
                                    const newProducts = products.filter((item) => item.tag === 'New');
                                    navigation.navigate('NewProducts', { newProducts });
                                }}
                            >
                                <Text>New</Text>
                            </TouchableOpacity> */}

                <TouchableOpacity style={styles.filterChip}> <Text>... </Text></TouchableOpacity >
            </ScrollView>
            <FlatList
                data={newProducts}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.productsList}
            />
        </ScrollView>
    );
};

export default NewProductsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    productsList: {
        paddingBottom: 80,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    productCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        width: '48%',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    productImage: {
        width: '100%',
        height: 100,
        borderRadius: 8,
        marginBottom: 5,
        backgroundColor: '#f2f2f2',
    },
    title: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4,
    },
    price: {
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    button: {
        backgroundColor: '#059BDE',
        borderRadius: 6,
        paddingVertical: 6,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
    filterBar: {
        marginBottom: 10,
        flexDirection: 'row',
    },
    filterChip: {
        backgroundColor: '#eee',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 15,
        marginRight: 8,
    },
});
