import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import { Animated, View, Text, StyleSheet } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import ChatbotScreen from '../screens/ChatbotScreen';
import CommunityScreen from '../screens/CommunityScreen';
import StoreScreen from '../screens/StoreScreen';
import ProfileScreen from '../screens/ProfileScreen';
// import CategoryScreen from '../screens/CategoryScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: '#546de5',
                tabBarInactiveTintColor: 'black',
                tabBarStyle: {
                    backgroundColor: '#E8F9FF',
                    borderTopWidth: 1,
                    borderTopColor: '#eee',
                    height: 65,
                    paddingBottom: 5,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    switch (route.name) {
                        case 'Home':
                            iconName = 'home';
                            break;
                        case 'Chatbot':
                            iconName = 'message-square';
                            break;
                        case 'Community':
                            iconName = 'users';
                            break;
                        case 'Store':
                            iconName = 'shopping-bag';
                            break;
                        case 'Profile':
                            iconName = 'user';
                            break;
                        default:
                            iconName = 'circle';
                    }

                    return (
                        <Animated.View style={focused ? styles.iconFocused : styles.iconDefault}>
                            <Icon name={iconName} size={26} color={color} />
                        </Animated.View>
                    );
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Chatbot" component={ChatbotScreen} />
            <Tab.Screen
                name="Community"
                component={CommunityScreen}
                options={{ tabBarBadge: 2 }}
            />
            <Tab.Screen name="Store" component={StoreScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
            {/* <Tab.Screen name="Category" component={CategoryScreen} /> */}
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    iconFocused: {
        transform: [{ scale: 1.2 }],
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconDefault: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default TabNavigator;
