// DrawerNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ChatbotScreen from '../screens/ChatbotScreen';  // Your Chatbot screen
import ChatHistoryScreen from '../screens/ChatHistoryScreen';  // Your Chat History screen

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
    return (
        <Drawer.Navigator
            initialRouteName="Chatbot"
            screenOptions={{
                headerShown: false,  // Hide header for drawer
            }}
        >
            <Drawer.Screen name="Chatbot" component={ChatbotScreen} />
            <Drawer.Screen name="Chat History" component={ChatHistoryScreen} />
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;
