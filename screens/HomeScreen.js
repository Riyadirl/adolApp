import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width;

const HomeScreen = ({ navigation }) => {
    return (
        <ScrollView style={styles.screen}>
            <View style={styles.container}>
                {/* Welcome Section */}
                <View style={styles.welcomeBox}>
                    {/* <Icon name="hand-left-outline" size={30} color="#333" /> */}
                    <Text style={styles.title}>Welcome back, Friend!</Text>
                    <Text style={styles.subtitle}>
                        What would you like help with today?
                    </Text>
                    {/* <View style={styles.buttonGroup}>
                        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Main', { screen: 'Chatbot' })}>
                            <Icon name="chatbubble-ellipses-outline" size={20} color="#fff" />
                            <Text style={styles.btnText}> Talk to AI</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Main', { screen: 'Community' })}>
                            <Icon name="people-outline" size={20} color="#6c3fc1" />
                            <Text style={styles.btnTextPurple}> Community</Text>
                        </TouchableOpacity>
                    </View> */}
                </View>

                {/* Support Features */}
                <Text style={styles.sectionTitle}>
                    <Icon name="apps-outline" size={20} color="#333" /> Our Support Features
                </Text>
                <View style={styles.cardContainer}>
                    <FeatureCard
                        title="AI Support Assistant"
                        description="Personalized guidance from our AI."
                        icon="help-buoy-outline"
                        onPress={() => navigation.navigate('Main', { screen: 'Chatbot' })}
                    />
                </View>
                <View style={styles.cardContainer}>
                    <FeatureCard
                        title="Community Connect"
                        description="Chat with peers in a safe space."
                        icon="chatbubbles-outline"
                        onPress={() => navigation.navigate("Main", { screen: 'Community' })}
                    />
                </View>
                <View style={styles.cardContainer}>
                    <FeatureCard
                        title="AdoStore"
                        description="Buy helpful resources."
                        icon="cart-outline"
                        onPress={() => navigation.navigate("Store")}
                    />
                </View>

                {/* Resource Guides */}
                <Text style={styles.sectionTitle}>
                    <Icon name="book-outline" size={20} color="#333" /> Resource Guides
                </Text>
                <View style={styles.cardContainer}>
                    <FeatureCard
                        title="Privacy & Safety"
                        description="How we keep your data secure."
                        icon="lock-closed-outline"
                    />
                </View>
                <View style={styles.cardContainer}>
                    <FeatureCard
                        title="Using AI Support"
                        description="Tips to talk with our assistant."
                        icon="bulb-outline"
                    />
                </View>
                <View style={styles.cardContainer}>
                    <FeatureCard
                        title="Community Guidelines"
                        description="Interact with positivity."
                        icon="book-outline"
                    />
                </View>

                {/* Support Box */}
                <View style={styles.supportBox}>
                    <Text style={styles.supportText}>🚨 Need immediate support?</Text>
                    <TouchableOpacity style={styles.supportButton}>
                        <Text style={styles.supportBtnText}>Talk to Someone Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const FeatureCard = ({ title, description, icon, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
        <View style={styles.cardHeader}>
            <Icon name={icon} size={26} color="#6c3fc1" />
            <Text style={styles.cardTitle}>{title}</Text>
        </View>
        <Text style={styles.cardText}>{description}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    screen: {
        backgroundColor: '#E8F9FF',
    },
    container: {
        padding: 16,
    },
    welcomeBox: {
        backgroundColor: '#F2F2F2',
        padding: 24,
        borderRadius: 20,
        marginBottom: 20,
        elevation: 5,
        shadowColor: '#E5EAF0 ',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        alignItems: 'center',
        color: '#0277BD'
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333333',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#333333',
        marginTop: 8,
        textAlign: 'center',
    },
    buttonGroup: {
        flexDirection: 'row',
        marginTop: 16,
        justifyContent: 'space-between',
    },
    primaryButton: {
        flexDirection: 'row',
        backgroundColor: '#00aaff',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        width: '48%',
        justifyContent: 'center',
    },
    secondaryButton: {
        flexDirection: 'row',
        backgroundColor: '#efe7ff',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        width: '48%',
        justifyContent: 'center',
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    btnTextPurple: {
        color: '#6c3fc1',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginVertical: 16,
        color: '#E5EAF0 ',
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardContainer: {
        width: '100%',
        marginBottom: 10,  // Reduced the space between card items
    },
    card: {
        backgroundColor: '#F2F2F2',
        padding: 18,
        borderRadius: 15,
        marginBottom: 3,  // Reduced space between cards
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,  // Reduced space between icon and title
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginLeft: 10,  // Adjusted the gap between icon and title
    },
    cardText: {
        fontSize: 14,
        color: '#333333',
    },
    supportBox: {
        backgroundColor: '',
        padding: 24,
        borderRadius: 16,
        marginTop: 30,
        alignItems: 'center',
    },
    supportText: {
        color: 'black',
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 12,
    },
    supportButton: {
        backgroundColor: '#3dd344ff',
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 12,
    },
    supportBtnText: {
        color: '#e7e8f0ff',
        fontWeight: 'bold',
    },
});

export default HomeScreen;
