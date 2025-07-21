import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const screenWidth = Dimensions.get("window").width;

const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.screen}>
      <View style={styles.container}>
        {/* Welcome Section */}
        <View style={styles.welcomeBox}>
          <Text style={styles.title}>👋 Welcome back, Friend!</Text>
          <Text style={styles.subtitle}>
            What would you like help with today?
          </Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate("Chatbot")}
            >
              <Icon name="chatbubble-ellipses-outline" size={20} color="#fff" />
              <Text style={styles.btnText}> Talk to AI</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate("Community")}
            >
              <Icon name="people-outline" size={20} color="#6c3fc1" />
              <Text style={styles.btnTextPurple}> Community</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Support Features */}
        <Text style={styles.sectionTitle}>✨ Our Support Features</Text>
        <View style={styles.cardContainer}>
          <FeatureCard
            title="AI Support Assistant"
            description="Personalized guidance from our AI."
            icon="help-buoy-outline"
          />
          <FeatureCard
            title="Community Connect"
            description="Chat with peers in a safe space."
            icon="chatbubbles-outline"
            onPress={() => navigation.navigate("Community")}
          />
          <FeatureCard
            title="AdoStore"
            description="Buy helpful resources."
            icon="cart-outline"
            onPress={() => navigation.navigate("Store")}
          />
        </View>

        {/* Resource Guides */}
        <Text style={styles.sectionTitle}>📘 Resource Guides</Text>
        <View style={styles.cardContainer}>
          <FeatureCard
            title="Privacy & Safety"
            description="How we keep your data secure."
            icon="lock-closed-outline"
          />
          <FeatureCard
            title="Using AI Support"
            description="Tips to talk with our assistant."
            icon="bulb-outline"
          />
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
    <Icon name={icon} size={26} color="#6c3fc1" />
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardText}>{description}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#f2f6fc",
  },
  container: {
    padding: 20,
  },
  welcomeBox: {
    backgroundColor: "#d9e9ff",
    padding: 30,
    borderRadius: 20,
    marginBottom: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  primaryButton: {
    flexDirection: "row",
    backgroundColor: "#6c3fc1",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  secondaryButton: {
    flexDirection: "row",
    backgroundColor: "#efe7ff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  btnTextPurple: {
    color: "#6c3fc1",
    fontWeight: "bold",
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginVertical: 20,
    color: "#333",
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  card: {
    width: (screenWidth - 48) / 2, // Adjust width based on screen size
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 10,
  },
  cardText: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  supportBox: {
    backgroundColor: "#6c3fc1",
    padding: 20,
    borderRadius: 16,
    marginTop: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  supportText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "500",
    marginBottom: 15,
  },
  supportButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  supportBtnText: {
    color: "#6c3fc1",
    fontWeight: "bold",
  },
});

export default HomeScreen;

/* 
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
                
                <View style={styles.welcomeBox}>
                    <Text style={styles.title}>👋 Welcome back, Friend!</Text>
                    <Text style={styles.subtitle}>
                        What would you like help with today?
                    </Text>
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity style={styles.primaryButton}>
                            <Icon name="chatbubble-ellipses-outline" size={20} color="#fff" />
                            <Text style={styles.btnText}> Talk to AI</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.secondaryButton}>
                            <Icon name="people-outline" size={20} color="#6c3fc1" />
                            <Text style={styles.btnTextPurple}> Community</Text>
                        </TouchableOpacity>
                    </View>
                </View>

               
                <Text style={styles.sectionTitle}>✨ Our Support Features</Text>
                <View style={styles.cardContainer}>
                    <FeatureCard
                        title="AI Support Assistant"
                        description="Personalized guidance from our AI."
                        icon="help-buoy-outline"
                    />
                    <FeatureCard
                        title="Community Connect"
                        description="Chat with peers in a safe space."
                        icon="chatbubbles-outline"
                        onPress={() => navigation.navigate("Community")}
                    />
                    <FeatureCard
                        title="AdoStore"
                        description="Buy helpful resources."
                        icon="cart-outline"
                        onPress={() => navigation.navigate("Store")}
                    />
                </View>

              
                <Text style={styles.sectionTitle}>📘 Resource Guides</Text>
                <View style={styles.cardContainer}>
                    <FeatureCard
                        title="Privacy & Safety"
                        description="How we keep your data secure."
                        icon="lock-closed-outline"
                    />
                    <FeatureCard
                        title="Using AI Support"
                        description="Tips to talk with our assistant."
                        icon="bulb-outline"
                    />
                    <FeatureCard
                        title="Community Guidelines"
                        description="Interact with positivity."
                        icon="book-outline"
                    />
                </View>

                {/* Support Box 
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
        <Icon name={icon} size={26} color="#6c3fc1" />
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardText}>{description}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    screen: {
        backgroundColor: '#f2f6fc',
    },
    container: {
        padding: 16,
    },
    welcomeBox: {
        backgroundColor: '#d9e9ff',
        padding: 24,
        borderRadius: 20,
        marginBottom: 20,
        elevation: 2,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 8,
    },
    buttonGroup: {
        flexDirection: 'row',
        marginTop: 16,
    },
    primaryButton: {
        flexDirection: 'row',
        backgroundColor: '#00aaff',
        padding: 12,
        borderRadius: 10,
        marginRight: 10,
        alignItems: 'center',
    },
    secondaryButton: {
        flexDirection: 'row',
        backgroundColor: '#efe7ff',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
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
        color: '#333',
    },
    cardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: (screenWidth - 64) / 2,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 4,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
        marginBottom: 5,
    },
    cardText: {
        fontSize: 13,
        color: '#666',
    },
    supportBox: {
        backgroundColor: '#6c3fc1',
        padding: 20,
        borderRadius: 16,
        marginTop: 30,
        alignItems: 'center',
    },
    supportText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '500',
        marginBottom: 10,
    },
    supportButton: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
    },
    supportBtnText: {
        color: '#6c3fc1',
        fontWeight: 'bold',
    },
});

export default HomeScreen;


*/
