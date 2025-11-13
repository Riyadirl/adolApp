import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

const OrderDetailsScreen = () => {
    const navigation = useNavigation();

    const order = {
        id: 'ORD123456',
        date: '2025-07-22',
        status: 'Shipped',
        items: [
            {
                name: 'Wireless Headphones',
                quantity: 1,
                price: 59.99,
            },
            {
                name: 'Phone Case',
                quantity: 2,
                price: 9.99,
            },
        ],
        shippingAddress: '123 Main St, Dhaka, Bangladesh',
        total: 79.97,
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.navigate('Main', { screen: 'Profile' })}
                >
                    <Icon name="arrow-left" size={24} color="#059BDE" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order Details</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.label}>Order ID: {order.id}</Text>
                <Text style={styles.value}></Text>

                <Text style={styles.label}>Order Date:</Text>
                <Text style={styles.value}>{order.date}</Text>

                <Text style={styles.label}>Status:</Text>
                <Text style={[styles.value, styles.status]}>{order.status}</Text>

                <Text style={styles.label}>Items:</Text>
                {order.items.map((item, index) => (
                    <View key={index} style={styles.itemRow}>
                        <Text style={styles.itemText}>{item.name} x{item.quantity}</Text>
                        <Text style={styles.itemText}>${(item.price * item.quantity).toFixed(2)}</Text>
                    </View>
                ))}

                <Text style={styles.label}>Shipping Address:</Text>
                <Text style={styles.value}>{order.shippingAddress}</Text>

                <Text style={styles.total}>Total: ${order.total.toFixed(2)}</Text>
            </ScrollView>
        </View>
    );
};

export default OrderDetailsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#fff',
    },
    backButton: {
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#059BDE',
    },
    content: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginTop: 12,
    },
    value: {
        fontSize: 15,
        color: '#555',
        marginBottom: 8,
    },
    status: {
        color: '#27ae60',
        fontWeight: 'bold',
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemText: {
        fontSize: 15,
        color: '#444',
    },
    total: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 20,
    },
});
