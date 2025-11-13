import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, Alert, ScrollView, Platform
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const SigninScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('adolescent');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/register/', {
                username, email, password, role, gender, dob,
            });

            if (response.data.success) {
                Alert.alert('🎉 Registration successful!');
                navigation.navigate('Login');
            } else {
                Alert.alert('Registration failed', response.data.message);
            }
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <Text style={styles.appName}>
                    <Text style={styles.blueText}>Ado</Text><Text style={styles.pinkText}>Support</Text>
                </Text>

                <Text style={styles.heading}>Create an Account</Text>

                <TextInput
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                />

                {/* Gender Picker */}
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={gender}
                        onValueChange={(itemValue) => setGender(itemValue)}
                        style={styles.pickerInner}
                        dropdownIconColor="#888"
                    >
                        <Picker.Item label="Select Gender" value="" />
                        <Picker.Item label="Male" value="male" />
                        <Picker.Item label="Female" value="female" />
                        <Picker.Item label="Other" value="other" />
                    </Picker>
                </View>

                {/* Date of Birth Picker */}
                {Platform.OS === 'web' ? (
                    <input
                        type="date"
                        style={{
                            width: '100%',
                            padding: 14,
                            borderRadius: 12,
                            border: '1px solid #e0e0e0',
                            marginBottom: 16,
                            backgroundColor: '#f9f9f9',
                            fontSize: 16,
                        }}
                        value={dob || ''}
                        onChange={(e) => setDob(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                    />
                ) : (
                    <>
                        <TouchableOpacity
                            style={styles.input}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={{ color: dob ? '#000' : '#888' }}>
                                {dob ? dob : 'Select your date of birth'}
                            </Text>
                        </TouchableOpacity>

                        {showDatePicker && (
                            <DateTimePicker
                                value={dob ? new Date(dob) : new Date()}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                                maximumDate={new Date()}
                                onChange={(event, selectedDate) => {
                                    if (Platform.OS === 'android') setShowDatePicker(false);
                                    if (selectedDate) setDob(selectedDate.toISOString().split('T')[0]);
                                }}
                            />
                        )}
                    </>
                )}

                {/* Role Selection */}
                <Text style={styles.roleLabel}>Select your role:</Text>
                <View style={styles.roleContainer}>
                    <TouchableOpacity
                        style={[styles.roleOption, role === 'adolescent' && styles.roleSelected]}
                        onPress={() => setRole('adolescent')}
                    >
                        <Ionicons name="person" size={20} color={role === 'adolescent' ? '#fff' : '#555'} />
                        <Text style={role === 'adolescent' ? styles.roleTextSelected : styles.roleText}>
                            Adolescent
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.roleOption, role === 'parent' && styles.roleSelected]}
                        onPress={() => setRole('parent')}
                    >
                        <Ionicons name="people" size={20} color={role === 'parent' ? '#fff' : '#555'} />
                        <Text style={role === 'parent' ? styles.roleTextSelected : styles.roleText}>
                            Parent
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.signInBtn} onPress={handleLogin}>
                    <Text style={styles.signInText}>Sign Up</Text>
                </TouchableOpacity>

                <Text style={styles.signUpText}>
                    Already have an account?{' '}
                    <Text style={styles.signUpLink} onPress={() => navigation.navigate('Login')}>
                        Log In
                    </Text>
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f2f6fc',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    card: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    blueText: { color: '#37A8DB' },
    pinkText: { color: '#E85598' },
    heading: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        width: '100%',
        borderColor: '#e0e0e0',
        borderWidth: 1,
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
        backgroundColor: '#f9f9f9',
    },
    roleLabel: {
        fontWeight: '500',
        marginBottom: 10,
        color: '#333',
    },
    pickerWrapper: {
        borderRadius: 10,
        marginBottom: 16,
        backgroundColor: '#f9f9f9',
        overflow: 'hidden',
        height: 50,
        justifyContent: 'center',
    },
    pickerInner: {
        width: '100%',
        height: '100%',
        color: '#333',
        backgroundColor: '#f9f9f9',
    },
    roleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    roleOption: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '48%',
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        gap: 8,
    },
    roleSelected: {
        backgroundColor: '#4BB5FF',
        borderColor: '#4BB5FF',
    },
    roleText: {
        fontSize: 14,
        color: '#555',
    },
    roleTextSelected: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold',
    },
    signInBtn: {
        backgroundColor: '#4BB5FF',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    signInText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    signUpText: {
        fontSize: 14,
        textAlign: 'center',
        color: '#555',
    },
    signUpLink: {
        color: '#1890FF',
        fontWeight: 'bold',
    },
});

export default SigninScreen;
