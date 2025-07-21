import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import SigninScreen from '../screens/SigninScreen';
import CategoryScreen from '../screens/CategoryScreen'
import TabNavigator from './TabNavigator'; // <- import your tab bar
import PostDetailScreen from '../screens/PostDetailScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
    const { user, authLoading } = useContext(AuthContext);

    if (authLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#1890FF" />
            </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user ? (
                <>
                    <Stack.Screen name="Main" component={TabNavigator} />
                    <Stack.Screen name="Category" component={CategoryScreen} />
                    <Stack.Screen name="PostDetail" component={PostDetailScreen} />
                    <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
                    <Stack.Screen name="Profile" component={ProfileScreen} />
                </>
            ) : (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Signup" component={SigninScreen} />
                </>
            )}
        </Stack.Navigator>
    );
};

export default RootNavigator;
