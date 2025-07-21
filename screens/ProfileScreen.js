import React, { useEffect, useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    useColorScheme,
    TouchableOpacity,
    ScrollView,
    StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import { AuthContext } from '../context/AuthContext';

const UserProfileScreen = () => {
    const [user, setUser] = useState(null);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        const fetchUser = async () => {
            const storedUser = await AsyncStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        };
        fetchUser();
    }, []);

    if (!user) {
        return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: isDark ? '#101010' : '#f5f7fa' }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View
                style={[
                    styles.header,
                    {
                        backgroundColor: isDark ? '#1c1c1e' : '#ffffff',
                    },
                ]}
            >
                <View style={styles.avatar}>
                    <Icon name="user" size={50} color="#fff" />
                </View>
                <Text style={[styles.name, { color: isDark ? '#fff' : '#222' }]}>{user.name}</Text>
                <Text style={[styles.email, { color: isDark ? '#ccc' : '#555' }]}>{user.email}</Text>
                <Text style={[styles.role, { color: isDark ? '#aaa' : '#777' }]}>Role: {user.role}</Text>
            </View>

            {/* Dashboard Section */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#333' }]}>Your Dashboard</Text>
                <View style={styles.cardGrid}>
                    {[
                        { icon: 'shopping-cart', label: 'Orders', value: '5' },
                        { icon: 'message-circle', label: 'Messages', value: '3' },
                        { icon: 'heart', label: 'Favorites', value: '8' },
                        { icon: 'star', label: 'Reviews', value: '12' },
                        { icon: 'bell', label: 'Alerts', value: '2' },
                        { icon: 'settings', label: 'Settings', value: '' },
                    ].map((item, index) => (
                        <View
                            key={index}
                            style={[
                                styles.card,
                                { backgroundColor: isDark ? '#222' : '#fff' },
                            ]}
                        >
                            <Icon name={item.icon} size={26} color="#059BDE" />
                            <Text style={[styles.cardText, { color: isDark ? '#eee' : '#333' }]}>
                                {item.label}
                                {item.value ? `: ${item.value}` : ''}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Logout */}
            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                <Text style={styles.logoutText}>🚪 Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 50,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 10,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#1C8DDE',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
    },
    name: {
        fontSize: 22,
        fontWeight: '700',
        marginTop: 4,
    },
    email: {
        fontSize: 15,
        marginTop: 4,
    },
    role: {
        fontSize: 14,
        marginTop: 4,
        fontStyle: 'italic',
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    cardGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '47%',
        borderRadius: 16,
        padding: 18,
        alignItems: 'center',
        marginBottom: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
    },
    cardText: {
        marginTop: 8,
        fontSize: 15,
        fontWeight: '500',
        textAlign: 'center',
    },
    logoutBtn: {
        backgroundColor: '#FF3B30',
        marginHorizontal: 24,
        marginVertical: 30,
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        elevation: 6,
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default UserProfileScreen;
