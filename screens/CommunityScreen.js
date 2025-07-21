import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";

const { width } = Dimensions.get("window");

const dummyPosts = [
  {
    id: "1",
    author: "Alice",
    avatar: "https://i.pravatar.cc/150?img=1",
    title: "How do you manage screen time for kids?",
    content: "Looking for suggestions on limiting screen time effectively.",
  },
  {
    id: "2",
    author: "Bob",
    avatar: "https://i.pravatar.cc/150?img=2",
    title: "Best educational apps for toddlers?",
    content: "Any recommendations for safe and fun learning apps?",
  },
];

const CommunityScreen = () => {
  const navigation = useNavigation();

  const renderPost = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("PostDetail", { post: item })}
    >
      <View style={styles.header}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.authorContainer}>
          <Text style={styles.author}>@{item.author}</Text>
          <Text style={styles.postTitle}>{item.title}</Text>
        </View>
      </View>
      <Text style={styles.content} numberOfLines={2}>
        {item.content}
      </Text>
      <Text style={styles.readMore}>Read more →</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.screenTitle}>Community</Text>
      <FlatList
        data={dummyPosts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        contentContainerStyle={styles.listContent}
      />
      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => alert("Create new post")}
      >
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CommunityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#059BDE",
    paddingHorizontal: width * 0.05,
    paddingVertical: width * 0.04,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  listContent: {
    paddingHorizontal: width * 0.04,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: width * 0.04,
    marginBottom: width * 0.04,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: width * 0.03,
  },
  avatar: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    marginRight: width * 0.04,
  },
  authorContainer: {
    flex: 1,
  },
  author: {
    fontSize: width * 0.035,
    color: "#666",
  },
  postTitle: {
    fontSize: width * 0.045,
    fontWeight: "600",
    color: "#333",
  },
  content: {
    fontSize: width * 0.038,
    color: "#555",
    marginBottom: width * 0.02,
  },
  readMore: {
    fontSize: width * 0.038,
    color: "#059BDE",
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#059BDE",
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});

/*
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

const dummyPosts = [
    {
        id: '1',
        author: 'Alice',
        avatar: 'https://i.pravatar.cc/150?img=1',
        title: 'How do you manage screen time for kids?',
        content: 'Looking for suggestions on limiting screen time effectively.',
    },
    {
        id: '2',
        author: 'Bob',
        avatar: 'https://i.pravatar.cc/150?img=2',
        title: 'Best educational apps for toddlers?',
        content: 'Any recommendations for safe and fun learning apps?',
    },
];

const CommunityScreen = () => {
    const navigation = useNavigation();

    const renderPost = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('PostDetail', { post: item })}
        >
            <View style={styles.header}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View style={{ flex: 1 }}>
                    <Text style={styles.author}>@{item.author}</Text>
                    <Text style={styles.postTitle}>{item.title}</Text>
                </View>
            </View>
            <Text style={styles.content} numberOfLines={2}>
                {item.content}
            </Text>
            <Text style={styles.readMore}>Read more →</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.screenTitle}>Community</Text>
            <FlatList
                data={dummyPosts}
                keyExtractor={(item) => item.id}
                renderItem={renderPost}
                contentContainerStyle={styles.listContent}
            />

            {/* Floating Action Button 
            <TouchableOpacity
                style={styles.fab}
                onPress={() => alert('Create new post')}
            >
                <Icon name="plus" size={24} color="#fff" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default CommunityScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    screenTitle: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        color: '#059BDE',
        paddingHorizontal: width * 0.05,
        paddingVertical: width * 0.04,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    listContent: {
        paddingHorizontal: width * 0.04,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: width * 0.04,
        marginBottom: width * 0.04,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: width * 0.03,
    },
    avatar: {
        width: width * 0.12,
        height: width * 0.12,
        borderRadius: width * 0.06,
        marginRight: width * 0.04,
    },
    author: {
        fontSize: width * 0.035,
        color: '#666',
    },
    postTitle: {
        fontSize: width * 0.045,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        fontSize: width * 0.038,
        color: '#555',
        marginBottom: width * 0.02,
    },
    readMore: {
        fontSize: width * 0.038,
        color: '#059BDE',
        fontWeight: '600',
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        backgroundColor: '#059BDE',
        width: width * 0.15,
        height: width * 0.15,
        borderRadius: width * 0.075,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
});
 */
