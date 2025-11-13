import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Modal,
    TextInput, ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(null); // 'update' | 'password' | null

    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        role: 'Adolescent',
        profilePic: null,
    });

    const handleChange = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const closeModal = () => setModalVisible(null);

    const renderUpdateProfileModal = () => (
        <Modal visible={modalVisible === 'update'} transparent animationType="slide">
            <View style={styles.modalWrapper}>
                <ScrollView contentContainerStyle={styles.modalContent}>
                    <Text style={styles.modalTitle}>Update Profile</Text>

                    <TouchableOpacity style={styles.imagePicker}>
                        <Icon name="camera-alt" size={24} color="#999" />
                        <Text style={styles.imagePickerText}>Upload Profile Pic</Text>
                    </TouchableOpacity>

                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={form.username}
                        onChangeText={(text) => handleChange('username', text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        keyboardType="email-address"
                        value={form.email}
                        onChangeText={(text) => handleChange('email', text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="New Password"
                        secureTextEntry
                        value={form.password}
                        onChangeText={(text) => handleChange('password', text)}
                    />

                    <View>
                        <Picker
                            selectedValue={form.role}
                            onValueChange={(itemValue) => handleChange('role', itemValue)}
                            style={styles.pickerWrapper}
                        >
                            <Picker.Item label="Adolescent" value="Adolescent" />
                            <Picker.Item label="Parent" value="Parent" />
                        </Picker>
                    </View>

                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Update</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={closeModal}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </Modal>
    );

    const renderChangePasswordModal = () => (
        <Modal visible={modalVisible === 'password'} transparent animationType="slide">
            <View style={styles.modalWrapper}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Change Password</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Current Password"
                        secureTextEntry
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="New Password"
                        secureTextEntry
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm New Password"
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Change Password</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={closeModal}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>

            <Text style={styles.heading}>Settings</Text>

            <TouchableOpacity style={styles.option} onPress={() => setModalVisible('update')}>
                <Icon name="person" size={22} color="#333" />
                <Text style={styles.optionText}>Update Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={() => setModalVisible('password')}>
                <Icon name="lock" size={22} color="#333" />
                <Text style={styles.optionText}>Change Password</Text>
            </TouchableOpacity>

            {renderUpdateProfileModal()}
            {renderChangePasswordModal()}
        </View>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#E8F9FF',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
    },
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 70,
        marginBottom: 30,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderColor: '#eee',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
    },
    optionText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    modalWrapper: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingHorizontal: 20,
        paddingVertical: 60,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 20,
        overflow: 'hidden',
        padding: 20,
    },
    imagePicker: {
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 20,
        borderRadius: 8,
        marginBottom: 15,
    },
    imagePickerText: {
        marginTop: 5,
        color: '#999',
    },
    button: {
        backgroundColor: '#28a745',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    cancelText: {
        color: '#999',
        marginTop: 15,
        textAlign: 'center',
    },
});
