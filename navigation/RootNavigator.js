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
import CreatePostScreen from '../screens/CreatePostScreen';
import StoreScreen from '../screens/StoreScreen';
import BestSellerScreen from '../screens/BestSellerScreen';
import NewProductsScreen from '../screens/NewProductsScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import MessagesScreen from '../screens/MessagesScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ReviewsScreen from '../screens/ReviewsScreen';
import AlertsScreen from '../screens/AlertsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AllOrdersScreen from '../screens/AllOrdersScreen';
import CartScreen from '../screens/CartScreen';

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
                    {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
                    <Stack.Screen name="CreatePost" component={CreatePostScreen} />
                    {/* <Stack.Screen name="Store" component={StoreScreen} /> */}
                    <Stack.Screen name="BestSeller" component={BestSellerScreen} />
                    <Stack.Screen name="NewProducts" component={NewProductsScreen} />
                    <Stack.Screen name="Orders" component={OrderDetailsScreen} />
                    <Stack.Screen name="Messages" component={MessagesScreen} />
                    <Stack.Screen name="Favorites" component={FavoritesScreen} />
                    <Stack.Screen name="Reviews" component={ReviewsScreen} />
                    <Stack.Screen name="Alerts" component={AlertsScreen} />
                    <Stack.Screen name="Settings" component={SettingsScreen} />
                    <Stack.Screen name="AllOrders" component={AllOrdersScreen} />
                    <Stack.Screen name="Cart" component={CartScreen} />
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
