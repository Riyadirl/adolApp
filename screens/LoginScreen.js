import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, Alert, Image, ScrollView, useColorScheme
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secureText, setSecureText] = useState(true);
    const [errors, setErrors] = useState({});
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    useEffect(() => {
        checkAutoLogin();
    }, []);

    const checkAutoLogin = async () => {
        const token = await AsyncStorage.getItem('access_token');
        const user = await AsyncStorage.getItem('user');
        if (token && user) {
            const userData = JSON.parse(user);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home', params: userData }]
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /\S+@\S+\.\S+/;

        if (!email.trim()) newErrors.email = 'Email is required';
        else if (!emailRegex.test(email)) newErrors.email = 'Invalid email';

        if (!password.trim()) newErrors.password = 'Password is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        try {
            const response = await axios.post('http://192.168.10.108:8000/api/login/', {
                email,
                password,
            });

            if (response.data.success) {
                const userData = response.data.data;

                await AsyncStorage.setItem('access_token', userData.access);
                await AsyncStorage.setItem('refresh_token', userData.refresh);
                await AsyncStorage.setItem('user', JSON.stringify(userData));

                Alert.alert('Success', 'Logged in!');
                await login(userData);
                console.log(userData.username)
            } else {
                Alert.alert('Login Failed', response.data.message || 'Something went wrong');
                console.log(response.data.message)
            }

        } catch (error) {
            console.log('Login error:', error.response?.data); // debug line
            const msg = error.response?.data?.error || 'Invalid credentials or server error';
            Alert.alert('Login Error', msg);
        }
    };


    const theme = getStyles(isDark);

    return (
        <ScrollView contentContainerStyle={theme.wrapper}>
            <View style={theme.card}>
                <Text style={theme.appName}>
                    <Text style={{ color: '#37A8DB' }}>Ado</Text>
                    <Text style={{ color: '#E85598' }}>Support</Text>
                </Text>

                <Text style={theme.title}>Login</Text>
                <Text style={theme.subtitle}>Enter your credentials</Text>

                <Text style={theme.label}>Email Address *</Text>
                <TextInput
                    placeholder="you@example.com"
                    placeholderTextColor={isDark ? '#aaa' : '#888'}
                    value={email}
                    onChangeText={setEmail}
                    style={theme.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                {errors.email && <Text style={theme.errorText}>{errors.email}</Text>}

                <Text style={theme.label}>Password *</Text>
                <View style={theme.passwordWrapper}>
                    <TextInput
                        placeholder="••••••••"
                        placeholderTextColor={isDark ? '#aaa' : '#888'}
                        value={password}
                        onChangeText={setPassword}
                        style={[theme.input, { flex: 1 }]}
                        secureTextEntry={secureText}
                    />
                    <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                        <Icon
                            name={secureText ? 'eye-off-outline' : 'eye-outline'}
                            size={22}
                            color={isDark ? '#ccc' : '#888'}
                            style={{ marginLeft: 8 }}
                        />
                    </TouchableOpacity>
                </View>
                {errors.password && <Text style={theme.errorText}>{errors.password}</Text>}

                <TouchableOpacity style={theme.loginBtn} onPress={handleLogin}>
                    <Text style={theme.loginText}>🔒 Login</Text>
                </TouchableOpacity>

                <TouchableOpacity style={theme.googleBtn}>
                    <Image
                        source={{ uri: 'https://img.icons8.com/color/48/google-logo.png' }}
                        style={theme.googleIcon}
                    />
                    <Text style={theme.googleText}>Continue with Google</Text>
                </TouchableOpacity>

                <Text style={theme.registerText}>
                    Don’t have an account?{' '}
                    <Text
                        style={theme.registerLink}
                        onPress={() => navigation.navigate('Signup')}
                    >
                        Register
                    </Text>
                </Text>
            </View>
        </ScrollView>
    );
};

const getStyles = (isDark) => StyleSheet.create({
    wrapper: {
        flexGrow: 1,
        backgroundColor: isDark ? '#121212' : '#F4F7FB',
        justifyContent: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: isDark ? '#1e1e1e' : '#fff',
        borderRadius: 14,
        padding: 25,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
    },
    appName: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: isDark ? '#fff' : '#222',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 6,
        color: isDark ? '#fff' : '#222',
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        color: isDark ? '#aaa' : '#666',
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        marginBottom: 6,
        color: isDark ? '#ddd' : '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: isDark ? '#444' : '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        color: isDark ? '#fff' : '#000',
    },
    passwordWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    errorText: {
        color: '#ff6b6b',
        marginBottom: 10,
        fontSize: 13,
    },
    loginBtn: {
        backgroundColor: '#1890FF',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    loginText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    googleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        justifyContent: 'center',
        marginBottom: 20,
    },
    googleIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    googleText: {
        fontWeight: '600',
        color: isDark ? '#eee' : '#333',
        fontSize: 15,
    },
    registerText: {
        textAlign: 'center',
        fontSize: 14,
        color: isDark ? '#bbb' : '#555',
    },
    registerLink: {
        color: '#1890FF',
        fontWeight: 'bold',
    },
});

export default LoginScreen;
