import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/Feather'; // For hamburger icon

const ChatbotScreen = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [typing, setTyping] = useState(false); // bot typing state
    const [dots, setDots] = useState(""); // animated dots
    const [welcomeMessage, setWelcomeMessage] = useState(""); // For welcome message
    const [isFirstMessage, setIsFirstMessage] = useState(true); // Track if it's the first user message
    const [sidebarVisible, setSidebarVisible] = useState(false); // Track sidebar visibility

    const sidebarAnim = useRef(new Animated.Value(-300)).current; // Sidebar animation value (starts off-screen)
    const flatListRef = useRef(null);

    const welcomeMessageText = "Welcome to CareSerenity! How can I help you?"; // Text for welcome message

    // Removed typing effect and set the welcome message instantly
    useEffect(() => {
        setWelcomeMessage(welcomeMessageText);
    }, []);

    // Animate the dots like "...", "...."
    useEffect(() => {
        let interval;
        if (typing) {
            interval = setInterval(() => {
                setDots((prev) => (prev.length < 3 ? prev + "." : ""));
            }, 500);
        } else {
            setDots("");
        }
        return () => clearInterval(interval);
    }, [typing]);

    // Send the user's message to the bot
    const sendMessage = async () => {
        if (!input.trim()) return;

        // Remove the welcome message if it's the first message
        if (isFirstMessage) {
            setMessages((prevMessages) =>
                prevMessages.filter((message) => message.text !== welcomeMessageText)
            );
            setIsFirstMessage(false); // Set first message flag to false
        }

        const newMessage = { sender: "user", text: input };
        setMessages((prev) => [...prev, newMessage]);

        const token = await AsyncStorage.getItem("access_token");
        setInput("");
        setLoading(true);
        setTyping(true);

        try {
            const response = await fetch("http://192.168.10.108:8000/api/chatbot/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ query: input }),
            });

            if (!response.body) throw new Error("No response body (stream missing).");

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");

            let botMessage = { sender: "bot", text: "" };
            setMessages((prev) => [...prev, botMessage]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split("\n");

                for (let line of lines) {
                    if (line.startsWith("data:")) {
                        try {
                            const json = JSON.parse(line.replace("data: ", ""));
                            if (json.type === "chunk" && json.content) {
                                // Typing effect: add letters one by one
                                for (let char of json.content) {
                                    botMessage.text += char;
                                    setMessages((prev) => {
                                        const updated = [...prev];
                                        updated[updated.length - 1] = { ...botMessage };
                                        return updated;
                                    });
                                    await new Promise((r) => setTimeout(r, 5)); // typing speed
                                }
                            }
                        } catch (err) {
                            console.log("Skipping non-JSON line:", line);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error with API call:", error);
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "⚠️ Error fetching response." },
            ]);
        } finally {
            setLoading(false);
            setTyping(false);
        }
    };

    // Toggle Sidebar visibility
    const toggleSidebar = () => {
        Animated.timing(sidebarAnim, {
            toValue: sidebarVisible ? -300 : 0, // Slide the sidebar in/out
            duration: 300,
            useNativeDriver: true,
        }).start();
        setSidebarVisible(!sidebarVisible); // Toggle visibility
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            {/* Show the welcome message only when no messages have been sent */}
            {isFirstMessage && !typing && !loading && (
                <View style={styles.welcomeContainer}>
                    <Text style={styles.welcomeMessage}>{welcomeMessage}</Text>
                </View>
            )}

            {/* Chat History Sidebar */}
            <Animated.View style={[styles.sidebar, { transform: [{ translateX: sidebarAnim }] }]}>
                <Text style={styles.sidebarTitle}>Chat History</Text>
                <FlatList
                    data={messages}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.sidebarMessage}>
                            <Text>{item.sender === "user" ? "You: " : "Bot: "}{item.text}</Text>
                        </View>
                    )}
                />
            </Animated.View>

            {/* Overlay background when sidebar is visible */}
            {sidebarVisible && <TouchableWithoutFeedback onPress={toggleSidebar}><View style={styles.overlay} /></TouchableWithoutFeedback>}

            {/* Chat messages */}
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <View
                        style={[
                            styles.message,
                            item.sender === "user" ? styles.userMessage : styles.botMessage,
                        ]}
                    >
                        <Text style={styles.messageText}>{item.text}</Text>
                    </View>
                )}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            {/* Bot is typing indicator */}
            {typing && (
                <View style={[styles.message, styles.botMessage]}>
                    <Text style={styles.typingText}>Typing{dots}</Text>
                </View>
            )}

            {/* Input field */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Type your message..."
                />
                <TouchableOpacity style={styles.button} onPress={sendMessage}>
                    <Text style={styles.buttonText}>Send</Text>
                </TouchableOpacity>
            </View>

            {loading && <ActivityIndicator size="small" color="#007BFF" />}

            {/* Hamburger Menu Icon */}
            <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
                <Icon name="menu" size={24} color="black" />
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#E8F9FF" },
    message: { margin: 8, padding: 12, borderRadius: 12, maxWidth: "80%" },
    userMessage: {
        backgroundColor: "#DCF8C6",
        alignSelf: "flex-end",
        borderBottomRightRadius: 2,
    },
    botMessage: {
        backgroundColor: "#E5E5EA",
        alignSelf: "flex-start",
        borderBottomLeftRadius: 2,
    },
    messageText: { fontSize: 16, color: "#333" },
    typingText: { fontSize: 14, fontStyle: "italic", color: "#555" },
    inputContainer: {
        flexDirection: "row",
        padding: 10,
        borderTopWidth: 1,
        borderColor: "#ddd",
        backgroundColor: "#E8F9FF",
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 20,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: "#FBFBFB",
    },
    button: {
        marginLeft: 10,
        backgroundColor: "#007BFF",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
    welcomeContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
    },
    welcomeMessage: {
        fontSize: 18,
        textAlign: "center",
        fontWeight: "bold",
        color: "#333",
        marginHorizontal: 20,
    },
    sidebar: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: 250,
        backgroundColor: "#fff",
        padding: 20,
        elevation: 5,
        zIndex: 2,
        display: "flex",
    },
    sidebarTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        marginLeft: 40,
    },
    sidebarMessage: {
        padding: 5,
        marginBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1,
    },
    menuButton: {
        position: "absolute",
        top: 20,
        left: 20,
        zIndex: 3,
    },
});

export default ChatbotScreen;
