// components/Dashboard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const Dashboard = ({ data }) => {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.welcomeBox}>
                <Text style={styles.title}>Welcome back, {data.username || 'Friend'}!</Text>
                <Text style={styles.subtitle}>What would you like help with today?</Text>
                <View style={styles.buttonGroup}>
                    <TouchableOpacity style={styles.primaryButton}>
                        <Text style={styles.btnText}>Talk to AI</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.secondaryButton}>
                        <Text style={styles.btnTextPurple}>Browse Community</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Our Support Features</Text>
            <View style={styles.cardContainer}>
                {data.features?.map((feature, index) => (
                    <TouchableOpacity key={index} style={styles.card}>
                        <Text style={styles.cardTitle}>{feature.title}</Text>
                        <Text style={styles.cardText}>{feature.description}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.sectionTitle}>Resource Guides</Text>
            <View style={styles.cardContainer}>
                {data.guides?.map((guide, index) => (
                    <TouchableOpacity key={index} style={styles.card}>
                        <Text style={styles.cardTitle}>{guide.title}</Text>
                        <Text style={styles.cardText}>{guide.description}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.supportBox}>
                <Text style={styles.supportText}>Need immediate support?</Text>
                <TouchableOpacity style={styles.supportButton}>
                    <Text style={styles.btnText}>Talk to Someone Now</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16, backgroundColor: '#f5f9fc' },
    welcomeBox: { backgroundColor: '#eaf3fd', padding: 20, borderRadius: 12 },
    title: { fontSize: 22, fontWeight: 'bold' },
    subtitle: { fontSize: 16, color: '#555', marginTop: 5 },
    buttonGroup: { flexDirection: 'row', marginTop: 15 },
    primaryButton: { backgroundColor: '#00aaff', padding: 10, borderRadius: 8, marginRight: 10 },
    secondaryButton: { backgroundColor: '#e2d8ff', padding: 10, borderRadius: 8 },
    btnText: { color: '#fff', fontWeight: 'bold' },
    btnTextPurple: { color: '#6c3fc1', fontWeight: 'bold' },
    sectionTitle: { fontSize: 18, fontWeight: '600', marginVertical: 10 },
    cardContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    card: { width: '48%', backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 12 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
    cardText: { fontSize: 14, color: '#555' },
    supportBox: { backgroundColor: '#9e69f7', padding: 20, borderRadius: 12, marginTop: 20, alignItems: 'center' },
    supportText: { color: '#fff', fontSize: 16, marginBottom: 10 },
    supportButton: { backgroundColor: '#fff', padding: 10, borderRadius: 8 },
});

export default Dashboard;
