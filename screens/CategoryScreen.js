import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TextInput,
    Pressable,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width;
const numColumns = screenWidth < 400 ? 1 : 2;

const categories = [
    {
        id: '1',
        title: 'Mindfulness & Meditation',
        items: 18,
        description: 'Tools for mental clarity and stress reduction',
        icon: 'meditation',
        color: '#6366F1',
    },
    {
        id: '2',
        title: 'Journals & Workbooks',
        items: 24,
        description: 'Express thoughts and track emotional progress',
        icon: 'notebook-edit-outline',
        color: '#D946EF',
    },
    {
        id: '3',
        title: 'Activities & Games',
        items: 15,
        description: 'Fun ways to develop coping skills and mindfulness',
        icon: 'puzzle',
        color: '#F59E0B',
    },
    {
        id: '4',
        title: 'Physical Wellbeing',
        items: 12,
        description: 'Products supporting physical health and stress relief',
        icon: 'heart-pulse',
        color: '#EF4444',
    },
    {
        id: '5',
        title: 'Sleep Improvement',
        items: 9,
        description: 'Solutions for better sleep and relaxation',
        icon: 'moon-waning-crescent',
        color: '#7C3AED',
    },
    {
        id: '6',
        title: 'Self-Care Kits',
        items: 7,
        description: 'Complete packages for adolescent well-being',
        icon: 'cube-outline',
        color: '#10B981',
    },
];

const CategoryCard = ({ item }) => {
    const scale = useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
        Animated.spring(scale, {
            toValue: 0.97,
            useNativeDriver: true,
        }).start();
    };

    const onPressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
            <Animated.View style={[styles.card, { borderColor: item.color, transform: [{ scale }] }]}>
                <View style={styles.cardHeader}>
                    <Icon name={item.icon} size={26} color={item.color} />
                    <Text style={styles.itemCount}>{item.items} items</Text>
                </View>
                <Text style={[styles.title, { color: item.color }]}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <TouchableOpacity>
                    <Text style={[styles.link, { color: item.color }]}>Browse →</Text>
                </TouchableOpacity>
            </Animated.View>
        </Pressable>
    );
};

const CustomTabBar = ({ navigation, activeTab, setActiveTab }) => {
    const tabs = [
        { label: 'Home', icon: 'home', route: 'Home' },
        { label: 'Chatbot', icon: 'message-square', route: 'Chatbot' },
        { label: 'Community', icon: 'users', route: 'Community' },
        { label: 'Store', icon: 'shopping-bag', route: 'Store' },
        { label: 'Profile', icon: 'user', route: 'Profile' },
    ];

    return (
        <View style={styles.bottomNav}>
            {tabs.map(({ label, icon, route }) => {
                const focused = activeTab === label;

                return (
                    <TouchableOpacity
                        key={label}
                        style={styles.navItem}
                        onPress={() => {
                            setActiveTab(label);
                            navigation.navigate("Main", { screen: label });
                        }}
                    >
                        <Animated.View style={focused ? styles.iconFocused : styles.iconDefault}>
                            <Feather name={icon} size={22} color={focused ? '#059BDE' : '#777'} />
                        </Animated.View>
                        <Text style={[styles.navLabel, { color: focused ? '#059BDE' : '#777' }]}>{label}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const CategoryScreen = ({ route = {}, navigation }) => {
    const products = route?.params?.products ?? null;
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('Category'); // or 'Home' or any initial tab you want

    const filtered = categories.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groupedData = [];
    for (let i = 0; i < filtered.length; i += numColumns) {
        groupedData.push(filtered.slice(i, i + numColumns));
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.flexContainer}
        >

            <View style={styles.flexContainer}>

                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Text style={styles.heading}>Explore Categories</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
                        {/* <TouchableOpacity style={styles.filterChip} onPress={() => navigation.navigate('Store')}>
                                <Icon name="home-outline" size={16} style={styles.icon} />
                                <Text style={styles.chipText}>Home</Text>
                            </TouchableOpacity> */}
                        <TouchableOpacity style={styles.filterChip} onPress={() => navigation.navigate('Category')}>
                            <Icon name="grid-outline" size={16} style={styles.icon} />
                            <Text style={styles.chipText}>Categories</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.filterChip}
                            onPress={() => {
                                const bestSellers = products?.filter(item => item.tag === 'Best Seller') || [];
                                navigation.navigate("BestSeller");
                            }}
                        >
                            <Icon name="flame-outline" size={16} style={styles.icon} />
                            <Text style={styles.chipText}>Best Seller</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.filterChip}
                            onPress={() => {
                                const newProducts = products.filter((item) => item.tag === 'New');
                                navigation.navigate('NewProducts', { newProducts });
                            }}
                        >
                            <Icon name="sparkles-outline" size={16} style={styles.icon} />
                            <Text style={styles.chipText}>New</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.filterChip}>
                            <Icon name="cart-outline" size={16} style={styles.icon} />
                            <Text style={styles.chipText}>Cart</Text>
                        </TouchableOpacity>
                    </ScrollView>


                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search categories..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />

                    {groupedData.map((row, idx) => (
                        <View key={idx} style={styles.row}>
                            {row.map((item) => (
                                <View key={item.id} style={{ flex: 1, margin: 8 }}>
                                    <CategoryCard item={item} />
                                </View>
                            ))}
                            {row.length < numColumns &&
                                [...Array(numColumns - row.length)].map((_, i) => <View key={i} style={{ flex: 1, margin: 8 }} />)}
                        </View>
                    ))}
                </ScrollView>

                <CustomTabBar navigation={navigation} activeTab={activeTab} setActiveTab={setActiveTab} />
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    flexContainer: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        backgroundColor: '#FAFAFA',
    },
    scrollContainer: {
        paddingBottom: 100,
        paddingHorizontal: 16,
        paddingTop: 30,
    },
    heading: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 12,
        color: '#111827',
        textAlign: "center"
    },
    searchInput: {
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 12,
        fontSize: 14,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1.5,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemCount: {
        fontSize: 12,
        color: '#6B7280',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    description: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 6,
    },
    link: {
        marginTop: 12,
        fontWeight: '600',
        fontSize: 13,
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        height: 65,
        paddingBottom: 5,
        fontSize: 12,
        fontWeight: '600',
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconFocused: {
        transform: [{ scale: 1.2 }],
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconDefault: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    navLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 2,
    },
    filterBar: {
        marginBottom: 15,
        flexDirection: 'row',
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E1F5FE',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 25,
        marginRight: 10,
    },
    chipText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    icon: {
        marginRight: 6,
        color: '#0277BD',
    },
});

export default CategoryScreen;
