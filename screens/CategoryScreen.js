import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView } from 'react-native-web';

const categories = [
    {
        id: '1',
        title: 'Mindfulness & Meditation',
        items: 18,
        description: 'Tools for mental clarity and stress reduction',
        icon: 'meditation',
        color: '#6366F1', // Indigo
    },
    {
        id: '2',
        title: 'Journals & Workbooks',
        items: 24,
        description: 'Express thoughts and track emotional progress',
        icon: 'notebook-edit-outline',
        color: '#D946EF', // Fuchsia
    },
    {
        id: '3',
        title: 'Activities & Games',
        items: 15,
        description: 'Fun ways to develop coping skills and mindfulness',
        icon: 'puzzle',
        color: '#F59E0B', // Amber
    },
    {
        id: '4',
        title: 'Physical Wellbeing',
        items: 12,
        description: 'Products supporting physical health and stress relief',
        icon: 'heart-pulse',
        color: '#EF4444', // Red
    },
    {
        id: '5',
        title: 'Sleep Improvement',
        items: 9,
        description: 'Solutions for better sleep and relaxation',
        icon: 'moon-waning-crescent',
        color: '#7C3AED', // Violet
    },
    {
        id: '6',
        title: 'Self-Care Kits',
        items: 7,
        description: 'Complete packages for adolescent well-being',
        icon: 'cube-outline',
        color: '#10B981', // Emerald
    },
];

const CategoryCard = ({ item }) => (
    <View style={[styles.card, { borderColor: item.color }]}>
        <View style={styles.cardHeader}>
            <Icon name={item.icon} size={26} color={item.color} />
            <Text style={styles.itemCount}>{item.items} items</Text>
        </View>
        <Text style={[styles.title, { color: item.color }]}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <TouchableOpacity>
            <Text style={[styles.link, { color: item.color }]}>Browse products →</Text>
        </TouchableOpacity>
    </View>
);

const CategoryScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Category</Text>
            {/* Filters */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} >
                <TouchableOpacity style={styles.filterChip}> <Text onPress={() => navigation.navigate("Store")}>Home </Text></TouchableOpacity >
                <TouchableOpacity style={styles.filterChip}> <Text onPress={() => navigation.navigate("Category")}>Category </Text></TouchableOpacity >
                {/* <TouchableOpacity
                            style={styles.filterChip}
                            onPress={() => {
                                const bestSellers = products.filter((item) => item.tag === 'Best Seller');
                                navigation.navigate('BestSeller', { bestSellers });
                            }}
                        >
                            <Text>Bestsellers</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.filterChip}
                            onPress={() => {
                                const newProducts = products.filter((item) => item.tag === 'New');
                                navigation.navigate('NewProducts', { newProducts });
                            }}
                        >
                            <Text>New</Text>
                        </TouchableOpacity> */}

                <TouchableOpacity style={styles.filterChip}> <Text>... </Text></TouchableOpacity >
            </ScrollView>

            <FlatList
                data={categories}
                renderItem={({ item }) => <CategoryCard item={item} />}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        paddingTop: 20,
        backgroundColor: '#F9FAFB',
        flex: 1,
    },
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    list: {
        paddingBottom: 40,
    },
    card: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1.5,
        margin: 8,
        padding: 15,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemCount: {
        fontSize: 12,
        color: '#6B7280',
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        marginTop: 8,
    },
    description: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 4,
    },
    link: {
        marginTop: 10,
        fontWeight: '600',
        fontSize: 13,
    },
    filterBar: {
        marginBottom: 10,
        flexDirection: 'row',
    },
    filterChip: {
        backgroundColor: '#eee',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 15,
        marginRight: 8,
    },
});

export default CategoryScreen;
