import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';

import HomeScreen from '../screens/HomeScreen';
import ChatbotScreen from '../screens/ChatbotScreen';
import CommunityScreen from '../screens/CommunityScreen';
import StoreScreen from '../screens/StoreScreen';
// import ProfileScreen from '../screens/ProfileScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: '#059BDE',
                tabBarInactiveTintColor: '#666',
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: '#eee',
                    height: 60,
                },
                tabBarIcon: ({ color, size }) => {
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

                    return <Icon name={iconName} size={20} color={color} />;
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
            {/* <Tab.Screen name="Profile" component={ProfileScreen} /> */}
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

export default TabNavigator;
