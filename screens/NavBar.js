import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';


const Navbar = () => {
    const { logout } = useContext(AuthContext);
    const navigation = useNavigation();
    const route = useRoute();

    const navItems = [
        { name: 'Home', icon: 'home', screen: 'Home' },
        { name: 'Chatbot', icon: 'message-square', screen: 'Chatbot' },
        { name: 'Community', icon: 'users', screen: 'Community', badge: 2 },
        { name: 'Store', icon: 'shopping-bag', screen: 'Store', isStore: true }
    ];

    return (
        <View style={styles.container}>
            {/* Logo */}
            <Image
                source={{ uri: 'https://your-logo-url.com/logo.png' }}
                style={styles.logo}
            />

            {/* Navigation Items */}
            <View style={styles.navItemsContainer}>
                {navItems.map((item) => (
                    <TouchableOpacity
                        key={item.screen}
                        style={[
                            styles.navItem,
                            route.name === item.screen && styles.activeItem,
                            route.name === item.screen && item.isStore && styles.activeStoreItem
                        ]}
                        onPress={() => navigation.navigate(item.screen)}
                    >
                        <Icon
                            name={item.icon}
                            size={16}
                            color={route.name === item.screen ? '#059BDE' : '#000'}
                        />
                        <Text style={[
                            styles.navText,
                            { color: route.name === item.screen ? '#059BDE' : '#000' }
                        ]}>
                            {item.name}
                        </Text>
                        {item.badge && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{item.badge}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            {/* User Info (compact) */}
            <View style={styles.userContainer}>
                <Icon name="bell" size={18} color="#000" style={styles.bellIcon} />
                <View style={styles.userCircle}>
                    <Text style={styles.userInitials}>US</Text>
                </View>
                <TouchableOpacity onPress={logout}>
                    <Text style={styles.navItem}>🚪 Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 50,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    logo: {
        width: 30,
        height: 30,
        marginRight: 5,
    },
    navItemsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    navItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 5,
        marginHorizontal: 2,
        borderRadius: 4,
    },
    activeItem: {
        borderBottomWidth: 2,
        borderBottomColor: '#059BDE',
    },
    activeStoreItem: {
        borderBottomWidth: 2,
        borderBottomColor: '#059BDE',
    },
    navText: {
        marginLeft: 4,
        fontSize: 12,
    },
    badge: {
        backgroundColor: '#A259FF',
        borderRadius: 10,
        paddingHorizontal: 4,
        marginLeft: 4,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 16,
        height: 16,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    bellIcon: {
        marginRight: 8,
    },
    userCircle: {
        backgroundColor: '#059BDE',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userInitials: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
});

export default Navbar;