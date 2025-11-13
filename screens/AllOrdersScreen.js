import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    RefreshControl,
    TouchableOpacity,
    useColorScheme,
    StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const AllOrdersScreen = () => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const navigation = useNavigation();

    const [refreshing, setRefreshing] = useState(false);
    const [orders, setOrders] = useState([
        { id: 'ORD12345', status: 'Pending', total: 250 },
        { id: 'ORD67890', status: 'Shipped', total: 480 },
        { id: 'ORD54321', status: 'Delivered', total: 120 },
        { id: 'ORD98765', status: 'Cancelled', total: 90 },
    ]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // Simulate fetch
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    }, []);

    const renderOrder = ({ item }) => (
        <View style={[styles.card, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
            <Text style={[styles.text, { color: isDark ? '#fff' : '#111' }]}>🆔 Order ID: {item.id}</Text>
            <Text style={[styles.text, { color: isDark ? '#bbb' : '#444' }]}>📦 Status: {item.status}</Text>
            <Text style={[styles.text, { color: isDark ? '#0f0' : '#007700' }]}>💰 Total: ${item.total}</Text>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#E8F9FF' }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: "Profile" })}>
                    <Icon name="arrow-left" size={24} color={isDark ? '#fff' : '#000'} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#000' }]}>All Orders</Text>
                <View style={{ width: 24 }} /> {/* Spacer for alignment */}
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Orders")} >
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id}
                    renderItem={renderOrder}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#059BDE" />
                    }
                    contentContainerStyle={{ padding: 16 }}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    card: {
        padding: 18,
        borderRadius: 12,
        marginBottom: 14,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
    },
    text: {
        fontSize: 15,
        marginBottom: 6,
    },
});

export default AllOrdersScreen;
