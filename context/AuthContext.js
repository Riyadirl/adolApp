// context/AuthContext.js
import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authLoading, setAuthLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const checkLoginStatus = async () => {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        setAuthLoading(false);
    };

    const login = async (userData) => {
        await AsyncStorage.setItem('access_token', userData.access);
        await AsyncStorage.setItem('refresh_token', userData.refresh);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = async () => {
        await AsyncStorage.clear();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, authLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
