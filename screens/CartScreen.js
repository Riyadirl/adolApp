import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const initialCart = [
    {
        id: '1',
        title: 'Product 1',
        price: 100,
        quantity: 1,
        image: require('../assets/store/1.jpg'),
    },
    {
        id: '2',
        title: 'Product 2',
        price: 150,
        quantity: 2,
        image: require('../assets/store/2.jpg'),
    },
];

const CartScreen = ({ navigation }) => {
    const [cart, setCart] = useState(initialCart);

    const updateQuantity = (id, delta) => {
        setCart(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );
    };

    const removeItem = id => {
        Alert.alert(
            'Remove Item',
            'Are you sure you want to remove this product from the cart?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => setCart(prev => prev.filter(item => item.id !== id)),
                },
            ]
        );
    };

    const getSubtotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = getSubtotal() * 0.05;
    const total = getSubtotal() + tax;

    const renderItem = ({ item }) => (
        <View style={styles.cartItem}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.details}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.price}>৳ {item.price}</Text>

                <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} style={styles.qtyBtn}>
                        <Icon name="remove-circle-outline" size={22} color="#0277BD" />
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => updateQuantity(item.id, 1)} style={styles.qtyBtn}>
                        <Icon name="add-circle-outline" size={22} color="#0277BD" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeBtn}>
                    <Icon name="trash-outline" size={18} color="#FF5252" />
                    <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon name="chevron-back-outline" size={24} color="#0277BD" />
                </TouchableOpacity>
                <Text style={styles.heading}>Your Cart</Text>
            </View>

            {cart.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyText}>Your cart is empty.</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Store')}>
                        <Text style={styles.linkText}>Go to Store</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <FlatList
                        data={cart}
                        keyExtractor={item => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.list}
                    />

                    <View style={styles.summary}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryText}>Subtotal:</Text>
                            <Text style={styles.summaryText}>৳ {getSubtotal().toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryText}>Tax (5%):</Text>
                            <Text style={styles.summaryText}>৳ {tax.toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.totalLabel}>Total:</Text>
                            <Text style={styles.totalLabel}>৳ {total.toFixed(2)}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.checkoutBtn}
                            onPress={() => Alert.alert('Checkout', 'Proceeding to payment')}
                        >
                            <Text style={styles.checkoutText}>Checkout</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
};

export default CartScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8F9FF',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    backBtn: {
        marginRight: 8,
        padding: 4,
    },
    heading: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 4,
        elevation: 2,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
    },
    details: {
        flex: 1,
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    price: {
        fontSize: 14,
        color: '#777',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    qtyBtn: {
        padding: 4,
    },
    quantity: {
        marginHorizontal: 10,
        fontSize: 16,
        fontWeight: '500',
    },
    removeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    removeText: {
        marginLeft: 4,
        color: '#FF5252',
        fontSize: 13,
    },
    list: {
        paddingBottom: 20,
    },
    summary: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginTop: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 4,
        elevation: 2,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryText: {
        fontSize: 15,
        color: '#555',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    checkoutBtn: {
        marginTop: 10,
        backgroundColor: '#0277BD',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    checkoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 18,
        marginBottom: 10,
        color: '#999',
    },
    linkText: {
        fontSize: 16,
        color: '#0277BD',
        fontWeight: '500',
    },
});
