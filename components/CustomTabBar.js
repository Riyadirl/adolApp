import React from 'react';
import { View, TouchableOpacity, Text, Animated, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const CustomTabBar = ({ navigation, activeTab, setActiveTab }) => {
    const tabs = [
        { label: 'Home', icon: 'home', route: 'Home' },
        { label: 'Chatbot', icon: 'message-square', route: 'Chatbot' },
        { label: 'Community', icon: 'users', route: 'Community' },
        { label: 'Store', icon: 'shopping-bag', route: 'Store' },
        { label: 'Profile', icon: 'user', route: 'Profile' },
    ];

    return (
        <View style={styles.bottomNav}>
            {tabs.map(({ label, icon, route }) => {
                const focused = activeTab === label;

                return (
                    <TouchableOpacity
                        key={label}
                        style={styles.navItem}
                        onPress={() => {
                            setActiveTab(label);
                            navigation.navigate(route, { screen: label });
                        }}
                    >
                        <Animated.View style={focused ? styles.iconFocused : styles.iconDefault}>
                            <Icon name={icon} size={22} color={focused ? '#059BDE' : '#777'} />
                        </Animated.View>
                        <Text style={[styles.navLabel, { color: focused ? '#059BDE' : '#777' }]}>{label}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        height: 65,
        paddingBottom: 5,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconFocused: {
        transform: [{ scale: 1.2 }],
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconDefault: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    navLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 2,
    },
});

export default CustomTabBar;
